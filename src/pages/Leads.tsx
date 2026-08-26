import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Building2, Check, Loader2, Mail, RefreshCw, Send, X } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Animate from '@/components/Animate';
import { btnSubtle } from '@/lib/ui';
import { fetchLeads, type Lead, type LeadList } from '@/lib/api';
import { useAuth } from '@/lib/use-auth';

const PAGE_SIZE = 25;

const FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'demo', label: 'Демо' },
  { key: 'contact', label: 'Сообщения' },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];

const KIND_LABELS: Record<Lead['kind'], string> = {
  demo: 'Заявка на демо',
  contact: 'Сообщение',
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Значок доставки: зелёный — ушло, серый — канал не настроен, красный — ошибка. */
function DeliveryBadge({
  sent,
  error,
  label,
  icon: Icon,
}: {
  sent: boolean;
  error: string | null;
  label: string;
  icon: typeof Send;
}) {
  const notConfigured = !sent && !!error && error.includes('не настроен');
  const failed = !sent && !!error && !notConfigured;

  const tone = sent
    ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-200'
    : failed
      ? 'bg-[#C43648]/15 border-[#C43648]/40 text-[#F5B8C1]'
      : 'bg-white/[0.04] border-white/10 text-white/35';

  return (
    <span
      title={error ?? (sent ? `${label}: отправлено` : label)}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-[6px] border text-[11px] font-[450] leading-[11px] ${tone}`}
    >
      <Icon className="w-3 h-3" />
      {label}
      {sent ? <Check className="w-3 h-3" /> : failed ? <X className="w-3 h-3" /> : null}
    </span>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <article className="rounded-[16px] bg-[rgba(17,16,15,0.35)] border border-white/[0.07] backdrop-blur-[20px] p-5 transition-colors hover:border-white/20">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-[7px] py-[5px] bg-white/10 rounded-[6px] text-white/70 text-[11px] font-[450] leading-[11px]">
              #{lead.id}
            </span>
            <span className="text-white/50 text-[12px] font-[450] leading-[12px]">
              {KIND_LABELS[lead.kind]}
            </span>
          </div>
          <p className="text-white text-[17px] font-[450] leading-[1.3] break-words">
            {lead.name}
          </p>
        </div>
        <span className="text-white/40 text-[12px] font-[450] leading-[12px] whitespace-nowrap">
          {formatDate(lead.created_at)}
        </span>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <a
          href={`mailto:${lead.email}`}
          className="inline-flex items-center gap-2 text-white/80 text-[14px] font-[450] hover:text-white transition-colors w-fit break-all"
        >
          <Mail className="w-3.5 h-3.5 shrink-0 opacity-60" />
          {lead.email}
        </a>

        {lead.company && (
          <span className="inline-flex items-center gap-2 text-white/60 text-[14px] font-[450]">
            <Building2 className="w-3.5 h-3.5 shrink-0 opacity-60" />
            {lead.company}
            {lead.team_size && <span className="text-white/35">· {lead.team_size}</span>}
          </span>
        )}

        {lead.topic && (
          <span className="text-white/60 text-[14px] font-[450]">Тема: {lead.topic}</span>
        )}
      </div>

      {lead.message && (
        <p className="text-white/70 text-[14px] font-[450] leading-[1.55] mb-4 whitespace-pre-wrap break-words border-l-2 border-white/10 pl-3">
          {lead.message}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <DeliveryBadge
          sent={lead.telegram_sent}
          error={lead.telegram_error}
          label="Telegram"
          icon={Send}
        />
        <DeliveryBadge sent={lead.email_sent} error={lead.email_error} label="Почта" icon={Mail} />
      </div>
    </article>
  );
}

export default function Leads() {
  const { user, signOut } = useAuth();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [data, setData] = useState<LeadList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const load = useCallback(
    async (kind: FilterKey, pageIndex: number) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchLeads({
          kind: kind === 'all' ? undefined : kind,
          limit: PAGE_SIZE,
          offset: pageIndex * PAGE_SIZE,
        });
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить заявки.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load(filter, page);
  }, [filter, page, load]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <PageShell
      eyebrow="Личный кабинет"
      title="Заявки с сайта"
      lead={user ? `Вы вошли как ${user.full_name || user.email}.` : undefined}
    >
      <Animate delay={500} direction="up" className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setFilter(f.key);
                  setPage(0);
                }}
                className={`h-[42px] px-5 rounded-[11px] text-[14px] font-[450] leading-[14px] border transition-colors ${
                  filter === f.key
                    ? 'bg-[#E9E9E9] text-[#0A0707] border-transparent'
                    : 'bg-white/[0.04] text-white/70 border-white/10 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {f.label}
                {data && (
                  <span className={filter === f.key ? 'text-[#0A0707]/50' : 'text-white/35'}>
                    {' '}
                    {data.counts[f.key]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => load(filter, page)}
              disabled={loading}
              className="h-[42px] px-4 inline-flex items-center gap-2 rounded-[11px] bg-white/[0.04] border border-white/10 text-white/70 text-[14px] font-[450] transition-colors hover:text-white hover:bg-white/[0.08] disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </button>
            <button
              onClick={signOut}
              className="h-[42px] px-4 rounded-[11px] bg-white/[0.04] border border-white/10 text-white/70 text-[14px] font-[450] transition-colors hover:text-white hover:bg-white/[0.08]"
            >
              Выйти
            </button>
          </div>
        </div>
      </Animate>

      {error && (
        <div className="flex items-start gap-3 rounded-[12px] bg-[#C43648]/15 border border-[#C43648]/40 p-4 mb-6">
          <AlertCircle className="w-4 h-4 mt-[2px] shrink-0 text-[#F08898]" />
          <p className="text-[#F5B8C1] text-[14px] font-[450] leading-[1.5]">{error}</p>
        </div>
      )}

      {loading && !data && (
        <div className="flex items-center gap-3 text-white/50 text-[15px] font-[450] py-10">
          <Loader2 className="w-5 h-5 animate-spin" />
          Загружаю заявки…
        </div>
      )}

      {data && data.items.length === 0 && !loading && (
        <div className="rounded-[16px] bg-[rgba(17,16,15,0.35)] border border-white/[0.07] p-10 text-center">
          <p className="text-white text-[17px] font-[450] mb-2">Заявок пока нет</p>
          <p className="text-white/55 text-[14px] font-[450]">
            Они появятся здесь, как только кто-то заполнит форму на сайте.
          </p>
        </div>
      )}

      {data && data.items.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.items.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>

          {data.total > PAGE_SIZE && (
            <div className="flex items-center justify-between gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0 || loading}
                className={`${btnSubtle} disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Назад
              </button>
              <span className="text-white/50 text-[14px] font-[450]">
                Страница {page + 1} из {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page + 1 >= totalPages || loading}
                className={`${btnSubtle} disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Вперёд
              </button>
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}
