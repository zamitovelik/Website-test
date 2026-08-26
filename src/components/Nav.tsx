import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import Animate from '@/components/Animate';
import Logo from '@/components/Logo';
import { NAV_LINKS, PLATFORM_MENU } from '@/lib/navigation';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isMobilePlatformOpen, setIsMobilePlatformOpen] = useState(false);
  const platformRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Любая смена маршрута закрывает и мобильное меню, и выпадающий список.
  useEffect(() => {
    setIsOpen(false);
    setIsPlatformOpen(false);
    setIsMobilePlatformOpen(false);
  }, [pathname]);

  // Клик вне выпадающего списка и Escape закрывают его.
  useEffect(() => {
    if (!isPlatformOpen) return;

    const onPointerDown = (e: MouseEvent) => {
      if (platformRef.current && !platformRef.current.contains(e.target as Node)) {
        setIsPlatformOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPlatformOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isPlatformOpen]);

  const isActive = (to: string) => pathname === to;

  return (
    <>
      <nav className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] pt-[20px] sm:pt-[30px] flex items-center justify-between relative z-50">
        <Animate delay={0} direction="down">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Apogee, на главную">
            <Logo className="sm:w-[32px] sm:h-[32px]" />
            <span className="text-white text-[22px] sm:text-[26px] font-[450] leading-none tracking-[-0.02em]">
              Apogee
            </span>
          </Link>
        </Animate>

        <Animate delay={100} direction="down" className="hidden lg:block">
          <div ref={platformRef} className="relative">
            <div className="h-[52px] px-6 flex items-center gap-[30px] bg-[rgba(10,7,7,0.35)] rounded-[11px] backdrop-blur-[17px]">
              {NAV_LINKS.map((link) =>
                link.hasDropdown ? (
                  <button
                    key={link.to}
                    onClick={() => setIsPlatformOpen((v) => !v)}
                    aria-expanded={isPlatformOpen}
                    className={`flex items-center gap-[5px] text-[14px] font-[450] leading-[14px] hover:text-white transition-colors ${
                      isActive(link.to) || isPlatformOpen ? 'text-white' : 'text-white/80'
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`w-[10px] h-[10px] opacity-80 transition-transform duration-300 ${
                        isPlatformOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-[14px] font-[450] leading-[14px] hover:text-white transition-colors cursor-pointer ${
                      isActive(link.to) ? 'text-white' : 'text-white/80'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            <div
              className={`absolute left-0 top-[60px] w-[360px] p-2 bg-[rgba(17,16,15,0.72)] backdrop-blur-[30px] rounded-[16px] border border-white/[0.08] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] origin-top ${
                isPlatformOpen
                  ? 'opacity-100 translate-y-0 scale-100 visible'
                  : 'opacity-0 -translate-y-2 scale-[0.98] invisible'
              }`}
            >
              {PLATFORM_MENU.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsPlatformOpen(false)}
                  className="block px-4 py-3 rounded-[12px] transition-colors hover:bg-white/[0.06]"
                >
                  <span className="block text-white text-[14px] font-[450] leading-[18px]">
                    {item.label}
                  </span>
                  <span className="block text-white/50 text-[12px] font-[450] leading-[16px] mt-0.5">
                    {item.description}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Animate>

        <Animate delay={200} direction="down" className="hidden lg:block">
          <div className="h-[52px] p-[3px] bg-[rgba(0,0,0,0.35)] rounded-[13px] backdrop-blur-[17px] flex items-center gap-[5px]">
            <Link
              to="/login"
              className="h-[46px] px-6 flex items-center rounded-[11px] text-white text-[14px] font-[450] leading-[14px] hover:bg-white/5 transition-colors"
            >
              Войти
            </Link>
            <Link
              to="/demo"
              className="h-[46px] px-6 flex items-center bg-[#E9E9E9] rounded-[11px] text-[#0A0707] text-[14px] font-[450] leading-[14px] hover:bg-white transition-colors"
            >
              Записаться на демо
            </Link>
          </div>
        </Animate>

        <Animate delay={100} direction="down" className="lg:hidden">
          <button
            className="w-[44px] h-[44px] flex items-center justify-center rounded-[11px] bg-[rgba(10,7,7,0.35)] backdrop-blur-[17px] transition-colors hover:bg-white/10"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Открыть меню"
            aria-expanded={isOpen}
          >
            <div className="relative w-5 h-5">
              <Menu
                className={`w-5 h-5 text-white absolute inset-0 transition-all duration-300 ease-out ${
                  isOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <X
                className={`w-5 h-5 text-white absolute inset-0 transition-all duration-300 ease-out ${
                  isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                }`}
              />
            </div>
          </button>
        </Animate>
      </nav>

      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'visible' : 'invisible'
        }`}
      >
        <div
          className={`absolute inset-0 bg-[#080A19]/90 backdrop-blur-[24px] transition-opacity duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute top-[76px] sm:top-[86px] left-4 right-4 sm:left-6 sm:right-6 max-h-[calc(100vh-100px)] overflow-y-auto bg-[rgba(17,16,15,0.6)] backdrop-blur-[30px] rounded-[20px] border border-white/[0.06] p-6 sm:p-8 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-top ${
            isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-[0.97]'
          }`}
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => {
              const rowClass = `flex items-center justify-between px-4 py-4 rounded-[12px] text-[18px] font-[450] hover:bg-white/[0.06] transition-all duration-300 ${
                isActive(link.to) ? 'text-white bg-white/[0.04]' : 'text-white/90'
              } ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`;
              const style = { transitionDelay: isOpen ? `${100 + i * 50}ms` : '0ms' };

              if (link.hasDropdown) {
                return (
                  <div key={link.to}>
                    <button
                      onClick={() => setIsMobilePlatformOpen((v) => !v)}
                      aria-expanded={isMobilePlatformOpen}
                      className={`w-full ${rowClass}`}
                      style={style}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 opacity-50 transition-transform duration-300 ${
                          isMobilePlatformOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                      />
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                        isMobilePlatformOpen
                          ? 'grid-rows-[1fr] opacity-100'
                          : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-col gap-1 pt-1 pl-3">
                          {PLATFORM_MENU.map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              className="px-4 py-3 rounded-[12px] text-white/70 text-[15px] font-[450] hover:bg-white/[0.06] hover:text-white transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link key={link.to} to={link.to} className={rowClass} style={style}>
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="h-px bg-white/10 my-5" />

          <div
            className={`flex flex-col gap-3 transition-all duration-300 ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{ transitionDelay: isOpen ? '350ms' : '0ms' }}
          >
            <Link
              to="/demo"
              className="w-full h-[50px] flex items-center justify-center bg-[#E9E9E9] rounded-[12px] text-[#0A0707] text-[15px] font-[450] transition-colors hover:bg-white"
            >
              Записаться на демо
            </Link>
            <Link
              to="/login"
              className="w-full h-[50px] flex items-center justify-center rounded-[12px] border border-white/30 text-white text-[15px] font-[450] transition-colors hover:bg-white/5"
            >
              Войти
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
