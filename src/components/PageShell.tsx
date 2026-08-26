import Animate from '@/components/Animate';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

type PageShellProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  /** Узкая колонка для страниц-форм (вход, демо). */
  narrow?: boolean;
};

export default function PageShell({
  eyebrow,
  title,
  lead,
  children,
  narrow = false,
}: PageShellProps) {
  return (
    <div className="relative min-h-screen bg-[#080A19] flex flex-col overflow-x-hidden">
      {/* Фоновое свечение — перекликается с небулой на главной, но без веса видео. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[25%] -left-[15%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-[radial-gradient(circle,rgba(60,78,220,0.20),transparent_70%)] blur-[90px]" />
        <div className="absolute top-[5%] -right-[20%] w-[65vw] h-[65vw] max-w-[850px] max-h-[850px] rounded-full bg-[radial-gradient(circle,rgba(196,54,72,0.16),transparent_70%)] blur-[100px]" />
        <div className="absolute bottom-[-30%] left-[20%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-[radial-gradient(circle,rgba(38,50,150,0.14),transparent_70%)] blur-[110px]" />
      </div>

      {/* z-50, а не z-10: у <main> ниже тот же z-10, и он идёт следующим в
          разметке — при равном порядке он перекрывал бы выпадающее меню шапки. */}
      <div className="relative z-50">
        <Nav />
      </div>

      <main className="relative z-10 flex-1 w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className={narrow ? 'max-w-[520px] mx-auto' : ''}>
          <header className={narrow ? 'mb-8 text-center' : 'max-w-[760px] mb-10 sm:mb-16'}>
            {eyebrow && (
              <Animate delay={200} direction="up">
                <p className="text-white/50 text-[13px] sm:text-[14px] font-[450] leading-[14px] uppercase tracking-[0.12em] mb-4">
                  {eyebrow}
                </p>
              </Animate>
            )}

            <Animate delay={300} direction="up">
              <h1 className="text-white text-[34px] sm:text-[48px] md:text-[58px] font-normal leading-[1.02] tracking-[-0.01em]">
                {title}
              </h1>
            </Animate>

            {lead && (
              <Animate delay={400} direction="up">
                <p
                  className={`text-white/80 text-[16px] sm:text-[19px] font-[450] leading-[1.45] mt-5 max-w-[620px] ${
                    narrow ? 'mx-auto' : ''
                  }`}
                >
                  {lead}
                </p>
              </Animate>
            )}
          </header>

          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
