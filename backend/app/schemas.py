from datetime import datetime, timezone

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_serializer


class DemoRequestIn(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    company: str = Field(min_length=1, max_length=200)
    email: EmailStr
    team_size: str = Field(max_length=100)
    comment: str = Field(default="", max_length=5000)


class ContactRequestIn(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    topic: str = Field(max_length=200)
    message: str = Field(min_length=1, max_length=5000)


class LeadAccepted(BaseModel):
    id: int
    ok: bool = True
    message: str


class LeadOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    kind: str
    name: str
    email: str
    company: str | None
    team_size: str | None
    topic: str | None
    message: str | None
    email_sent: bool
    email_error: str | None
    telegram_sent: bool
    telegram_error: str | None
    created_at: datetime

    @field_serializer("created_at")
    def _utc(self, value: datetime) -> str:
        # SQLite отдаёт время без часового пояса, Postgres — с ним. Приводим
        # к единому UTC, иначе браузер примет наивное время за локальное.
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc).isoformat()


class LeadListOut(BaseModel):
    items: list[LeadOut]
    total: int
    counts: dict[str, int]


class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)


class RegisterIn(BaseModel):
    email: EmailStr
    full_name: str = Field(default="", max_length=200)
    # bcrypt читает только первые 72 байта, поэтому длиннее принимать незачем.
    password: str = Field(min_length=8, max_length=72)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str | None
    is_admin: bool
    last_login_at: datetime | None


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserOut


class HealthOut(BaseModel):
    status: str
    database: str
    database_engine: str
    mail_configured: bool
    telegram_configured: bool
