import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import Animate from '@/components/Animate';
import Nav from '@/components/Nav';
import RevenueCard from '@/components/RevenueCard';
import { btnLight, btnOutline } from '@/lib/ui';

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#080A19]">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_092641_de52eb87-daf2-41db-92cb-7a56eae012a5.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="relative z-10 h-full flex flex-col">
        <Nav />

        <div className="flex-1 flex items-center py-8">
          <div className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-12">
            <div className="max-w-[593px]">
              <Animate delay={300} direction="up">
                <h1 className="text-white text-[36px] sm:text-[52px] md:text-[64px] lg:text-[72px] font-normal leading-[0.95] mb-5 sm:mb-8">
                  Поднимите ключевые данные на новую высоту
                </h1>
              </Animate>

              <Animate delay={500} direction="up">
                <p className="text-white/80 text-[16px] sm:text-[18px] md:text-[20px] font-[450] leading-[1.3] max-w-[370px] mb-7 sm:mb-10">
                  Продвинутые системы рассуждений и предиктивные модели, созданные для
                  неизвестного
                </p>
              </Animate>

              <Animate delay={700} direction="up">
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <Link to="/demo" className={btnLight}>
                    Записаться на демо
                  </Link>
                  <Link to="/contact" className={btnOutline}>
                    Поговорить с командой
                  </Link>
                </div>
              </Animate>
            </div>

            <RevenueCard />
          </div>
        </div>

        {/* left-0 right-0 вместо left-1/2 + translate: анимация fade-up
            переопределяет transform, и центрирование через translateX слетело бы. */}
        <Animate
          delay={1400}
          direction="up"
          className="hidden sm:block absolute bottom-6 left-0 right-0"
        >
          <button
            onClick={() =>
              document
                .getElementById('next-section')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            aria-label="Пролистать вниз"
            className="mx-auto flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors"
          >
            <span className="text-[12px] font-[450] leading-[12px] tracking-[0.08em] uppercase">
              Листайте вниз
            </span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </Animate>
      </div>
    </section>
  );
}
