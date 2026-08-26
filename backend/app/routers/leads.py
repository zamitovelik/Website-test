from fastapi import APIRouter, BackgroundTasks, Depends, Query, Request
from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Lead, User
from app.notifications import notify_lead
from app.ratelimit import client_ip, leads_limiter
from app.schemas import ContactRequestIn, DemoRequestIn, LeadAccepted, LeadListOut, LeadOut
from app.security import require_admin

router = APIRouter(prefix="/api/leads", tags=["Заявки"])


@router.get("", response_model=LeadListOut)
def list_leads(
    kind: str | None = Query(default=None, pattern="^(demo|contact)$"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
) -> LeadListOut:
    """Список заявок. Только для администраторов — внутри персональные данные."""
    query = db.query(Lead)
    if kind:
        query = query.filter(Lead.kind == kind)

    total = query.with_entities(func.count(Lead.id)).scalar() or 0
    items = query.order_by(desc(Lead.created_at), desc(Lead.id)).offset(offset).limit(limit).all()

    by_kind = dict(db.query(Lead.kind, func.count(Lead.id)).group_by(Lead.kind).all())
    counts = {
        "all": sum(by_kind.values()),
        "demo": by_kind.get("demo", 0),
        "contact": by_kind.get("contact", 0),
    }

    return LeadListOut(
        items=[LeadOut.model_validate(item) for item in items],
        total=total,
        counts=counts,
    )


def _save_lead(request: Request, db: Session, lead: Lead) -> Lead:
    lead.ip_address = client_ip(request)
    lead.user_agent = (request.headers.get("user-agent") or "")[:400]
    lead.source_path = (request.headers.get("referer") or "")[:200] or None

    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


@router.post("/demo", response_model=LeadAccepted, status_code=201)
def create_demo_request(
    payload: DemoRequestIn,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> LeadAccepted:
    leads_limiter.check(client_ip(request))

    lead = _save_lead(
        request,
        db,
        Lead(
            kind="demo",
            name=payload.name.strip(),
            email=str(payload.email).strip(),
            company=payload.company.strip(),
            team_size=payload.team_size.strip(),
            message=payload.comment.strip() or None,
        ),
    )

    # Уведомления уходят в фоне: заявка уже сохранена, даже если канал недоступен.
    background_tasks.add_task(notify_lead, lead.id)

    return LeadAccepted(
        id=lead.id,
        message="Заявка принята. Мы свяжемся с вами в течение рабочего дня.",
    )


@router.post("/contact", response_model=LeadAccepted, status_code=201)
def create_contact_request(
    payload: ContactRequestIn,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> LeadAccepted:
    leads_limiter.check(client_ip(request))

    lead = _save_lead(
        request,
        db,
        Lead(
            kind="contact",
            name=payload.name.strip(),
            email=str(payload.email).strip(),
            topic=payload.topic.strip(),
            message=payload.message.strip(),
        ),
    )

    background_tasks.add_task(notify_lead, lead.id)

    return LeadAccepted(
        id=lead.id,
        message="Сообщение отправлено. Ответим на указанную почту.",
    )
