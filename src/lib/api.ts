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

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function login(
  email: string,
  password: string,
  remember: boolean
): Promise<TokenResponse> {
  const result = await request<TokenResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (remember) {
    localStorage.setItem(TOKEN_KEY, result.access_token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, result.access_token);
  }

  return result;
}

export const fetchMe = () =>
  request<AuthUser>('/api/auth/me', {
    headers: { Authorization: `Bearer ${getToken() ?? sessionStorage.getItem(TOKEN_KEY) ?? ''}` },
  });
