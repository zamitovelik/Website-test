/**
 * Клиент бэкенда.
 *
 * В разработке запросы идут на относительный /api — Vite проксирует их
 * на http://localhost:8000 (см. vite.config.ts).
 * В продакшене задайте VITE_API_URL с адресом развёрнутого бэкенда.
 */

const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type ValidationDetail = { loc?: (string | number)[]; msg?: string };

/** Превращает ответ FastAPI об ошибке в одну читаемую строку. */
function extractError(payload: unknown, status: number): string {
  if (typeof payload === 'object' && payload !== null && 'detail' in payload) {
    const detail = (payload as { detail: unknown }).detail;

    if (typeof detail === 'string') return detail;

    if (Array.isArray(detail)) {
      const first = detail[0] as ValidationDetail | undefined;
      if (first?.msg) {
        const field = first.loc?.filter((p) => p !== 'body').join('.');
        return field ? `Поле «${field}»: ${first.msg}` : first.msg;
      }
    }
  }

  if (status === 429) return 'Слишком много запросов. Попробуйте немного позже.';
  if (status >= 500) return 'Сервер временно недоступен. Попробуйте позже.';
  return 'Не удалось выполнить запрос.';
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError(
      'Не удалось связаться с сервером. Проверьте, запущен ли бэкенд.',
      0
    );
  }

  const raw = await response.text();

  let payload: unknown = null;
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      // Пришёл не JSON — почти всегда это значит, что запрос ушёл не на бэкенд
      // (нет VITE_API_URL, неверный адрес, страница-заглушка хостинга).
      throw new ApiError(
        'Сервер вернул неожиданный ответ. Похоже, бэкенд не подключён.',
        response.status
      );
    }
  }

  if (!response.ok) {
    throw new ApiError(extractError(payload, response.status), response.status);
  }

  return payload as T;
}

// ── Заявки ───────────────────────────────────────────────────────────────────

export type DemoRequest = {
  name: string;
  company: string;
  email: string;
  team_size: string;
  comment: string;
};

export type ContactRequest = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export type LeadAccepted = {
  id: number;
  ok: boolean;
  message: string;
};

export const submitDemoRequest = (data: DemoRequest) =>
  request<LeadAccepted>('/api/leads/demo', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const submitContactRequest = (data: ContactRequest) =>
  request<LeadAccepted>('/api/leads/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// ── Авторизация ──────────────────────────────────────────────────────────────

export type AuthUser = {
  id: number;
  email: string;
  full_name: string | null;
  last_login_at: string | null;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
};

const TOKEN_KEY = 'apogee_token';

/** «Запомнить меня» решает, переживёт ли сессия закрытие вкладки. */
export function saveToken(token: string, remember: boolean): void {
  clearToken();
  (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  // Заголовок Authorization принимает только печатные ASCII-символы.
  // Испорченное значение уронило бы fetch ещё до отправки запроса — тогда
  // ответа 401 не будет, и токен остался бы в хранилище навсегда.
  if (!/^[\x21-\x7e]+$/.test(token)) {
    clearToken();
    return null;
  }

  return token;
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const login = (email: string, password: string) =>
  request<TokenResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const fetchMe = () => request<AuthUser>('/api/auth/me', { headers: authHeaders() });

// ── Список заявок (только для вошедших) ──────────────────────────────────────

export type Lead = {
  id: number;
  kind: 'demo' | 'contact';
  name: string;
  email: string;
  company: string | null;
  team_size: string | null;
  topic: string | null;
  message: string | null;
  email_sent: boolean;
  email_error: string | null;
  telegram_sent: boolean;
  telegram_error: string | null;
  created_at: string;
};

export type LeadList = {
  items: Lead[];
  total: number;
  counts: { all: number; demo: number; contact: number };
};

export function fetchLeads(params: {
  kind?: 'demo' | 'contact';
  limit?: number;
  offset?: number;
} = {}): Promise<LeadList> {
  const query = new URLSearchParams();
  if (params.kind) query.set('kind', params.kind);
  if (params.limit != null) query.set('limit', String(params.limit));
  if (params.offset != null) query.set('offset', String(params.offset));

  const suffix = query.toString() ? `?${query}` : '';
  return request<LeadList>(`/api/leads${suffix}`, { headers: authHeaders() });
}
