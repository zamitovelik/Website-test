from fastapi import APIRouter, Depends, Query
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Lead
from app.schemas import LeadOut
from app.security import require_admin_token

router = APIRouter(prefix="/api/admin", tags=["Админка"])


@router.get("/leads", response_model=list[LeadOut], dependencies=[Depends(require_admin_token)])
def list_leads(
    kind: str | None = Query(default=None, pattern="^(demo|contact)$"),
    limit: int = Query(default=50, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
) -> list[Lead]:
    """Список заявок. Требует заголовок X-Admin-Token."""
    query = db.query(Lead)
    if kind:
        query = query.filter(Lead.kind == kind)

    return query.order_by(desc(Lead.created_at)).offset(offset).limit(limit).all()
