import Hero from '@/components/Hero';
import HomeSections from '@/components/HomeSections';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="relative bg-[#080A19] overflow-x-hidden">
      <Hero />

      <div className="relative">
        {/* Фоновое свечение под прокручиваемой частью — продолжение небулы из героя. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[5%] -left-[15%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-[radial-gradient(circle,rgba(60,78,220,0.18),transparent_70%)] blur-[90px]" />
          <div className="absolute top-[35%] -right-[20%] w-[65vw] h-[65vw] max-w-[850px] max-h-[850px] rounded-full bg-[radial-gradient(circle,rgba(196,54,72,0.14),transparent_70%)] blur-[100px]" />
          <div className="absolute bottom-[5%] left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-[radial-gradient(circle,rgba(38,50,150,0.14),transparent_70%)] blur-[110px]" />
        </div>

        <div className="relative z-10">
          <HomeSections />
          <Footer />
        </div>
      </div>
    </div>
  );
}
