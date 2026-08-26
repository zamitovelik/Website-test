from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


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


class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str | None
    last_login_at: datetime | None


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserOut


class HealthOut(BaseModel):
    status: str
    database: str
    mail_configured: bool
    telegram_configured: bool
