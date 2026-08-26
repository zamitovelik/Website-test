/**
 * Общие классы кнопок. Значения отступов/высот совпадают со спецификацией героя,
 * поэтому переиспользуются на всех страницах без расхождений.
 */

export const btnLight =
  'inline-flex items-center justify-center h-[46px] sm:h-[51px] px-5 sm:px-[27px] bg-[#E9E9E9] rounded-[12px] text-[#0A0707] text-[14px] sm:text-[15.5px] font-[450] leading-[15.5px] transition-opacity hover:opacity-90';

export const btnOutline =
  'inline-flex items-center justify-center h-[46px] sm:h-[51px] px-5 sm:px-[27px] rounded-[12px] border border-white text-white text-[14px] sm:text-[15.5px] font-[450] leading-[15.5px] transition-opacity hover:opacity-80';

export const btnSubtle =
  'inline-flex items-center justify-center h-[46px] sm:h-[51px] px-5 sm:px-[27px] rounded-[12px] border border-white/20 bg-white/[0.04] text-white text-[14px] sm:text-[15.5px] font-[450] leading-[15.5px] transition-colors hover:bg-white/[0.09]';

/** Стеклянная карточка — та же формула, что у карточки выручки в герое. */
export const glassCard =
  'bg-[rgba(17,16,15,0.35)] backdrop-blur-[20px] border border-white/[0.06] rounded-[24px]';

/** Поле ввода для форм демо / входа / контактов. */
export const inputBase =
  'w-full h-[50px] px-4 rounded-[12px] bg-white/[0.04] border border-white/10 text-white text-[15px] font-[450] placeholder:text-white/30 outline-none transition-colors focus:border-white/40 focus:bg-white/[0.07]';

export const labelBase = 'block text-white/70 text-[13px] font-[450] leading-[13px] mb-2';
