"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Background3D from "@/components/Background3D";
import MilkyWayEffect from "@/components/MilkyWayEffect";
import TwinklingStars from "@/components/TwinklingStars";
import CustomCursor from "@/components/CustomCursor";
import DraggableScrollContainer from "@/components/DraggableScrollContainer";
import RandomStreamMarquee from "@/components/RandomStreamMarquee";
import { GENRES, Genre, MOCK_PORTFOLIO } from "@/app/constants";

// --- Local Preview Components ---

const GENRE_IMAGES: Record<string, string> = {
  irezumi: "/placeholders/irezumi.png",
  blackwork: "/placeholders/blackwork.png",
  black_and_grey: "/placeholders/black and gray.png",
  old_school: "/placeholders/oldschool.png",
  lettering: "/placeholders/lettering.png",
  tribal: "/placeholders/tribal.png",
  east_asian_ink: "/placeholders/east asian ink.png",
  watercolor: "/placeholders/watercolor.png",
  illustration: "/placeholders/illustration.png",
  mandala: "/placeholders/mandala.png",
  sak_yant: "/placeholders/sak yant.png",
  other: "/placeholders/etc.png",
};


// 2. Genre Preview Card (3D Tilt Effect) - UPDATED SIZE
function GenrePreviewCard({ genre }: { genre: Genre }) {
  const href = `/genre?tab=portfolio&genre=${genre}`;
  const displayName = genre
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const imageSrc = GENRE_IMAGES[genre] || "/placeholders/logo.png"; // Fallback

  return (
    <Link
      href={href}
      className="group relative w-full block"
    >
      <div className="relative h-[180px] sm:h-[220px] lg:h-[240px] flex flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.08] backdrop-blur-md transition-all duration-500 ease-out group-hover:bg-white/[0.12] group-hover:border-[#D6C23D]/28 group-hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src={imageSrc}
            alt={displayName}
            fill
            className="object-cover transition-all duration-700 ease-out opacity-20 grayscale group-hover:opacity-100 group-hover:grayscale-0"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
          {/* Dark Overlay Gradient to ensure text pop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
        </div>

        {/* Content Layer (z-10 to stay on top) */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-8 h-[2px] bg-white/20 mb-5 group-hover:bg-[#FFD700] transition-all duration-500 shadow-sm"></div>
          <span className="text-sm sm:text-base font-medium uppercase tracking-[0.25em] text-white-muted group-hover:text-white-main transition-all duration-300 text-center px-4 leading-relaxed">
            {displayName}
          </span>
        </div>
      </div>
    </Link>
  );
}


export default function HomePage() {
  // Scroll Restoration Logic (ScrollToTop) - Preserved
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#D6BE8A] selection:text-black font-sans">
      <CustomCursor isActive={true} />

      {/* Global Background Effects Layer - z-0 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Background3D isActive={true} />
        <MilkyWayEffect isVisible={true} />
        <TwinklingStars isActive={true} />
      </div>

      {/* Navigation - z-50 */}
      <NavBar />

      {/* Main Content - z-10 */}
      <main className="relative z-10 w-full">

        {/* --- STICKY WRAPPER: SECTION A & B --- */}
        {/* Text persists across A and B. Video scrolls away with A. */}
        <div className="relative">

          {/* Sticky Text Layer - z-50 */}
          {/* Stays fixed while parent (A+B wrapper) is in view */}
          <div className="absolute top-0 left-0 w-full h-screen flex flex-col justify-center items-start z-50 pointer-events-none pb-20">
            <style>{`
              @media (min-width: 1024px) and (max-width: 1439px) {
                .section-a-title { font-size: 6.75rem !important; }
                .section-a-subtitle { font-size: 1.125rem !important; }
              }
              @media (min-width: 1440px) {
                .section-a-title { font-size: 9rem !important; }
                .section-a-subtitle { font-size: 1.125rem !important; }
              }
            `}</style>
            <div
              className="w-full px-4 md:px-6 lg:px-8 pl-4 md:pl-6 lg:pl-8 border-l-4 border-[#D6BE8A] ml-4 md:ml-6 lg:ml-8"
            >
              <h1 className="font-playfair section-a-title text-5xl sm:text-6xl md:text-[6.75rem] lg:text-[12rem] font-thin tracking-tighter text-white-main leading-[0.9]">
                <span className="font-bold tracking-tight text-[#D6BE8A] drop-shadow-[0_0_20px_rgba(214,190,138,0.7)]">FLYING</span>
                <br />
                <span className="font-medium tracking-tighter text-white-main mix-blend-overlay">STUDIO</span>
              </h1>
            </div>
            <p
              className="section-a-subtitle mt-6 md:mt-8 lg:mt-10 mx-4 md:mx-6 lg:mx-8 ml-4 md:ml-6 lg:ml-8 text-white-muted text-sm md:text-lg lg:text-xl font-light tracking-[0.05em] max-w-xs md:max-w-sm lg:max-w-md xl:max-w-xl 2xl:max-w-2xl leading-relaxed"
            >
              이 세상을 바늘로 그리는 사람들
            </p>
            <div
              className="font-bebas ml-4 md:ml-6 lg:ml-8 mt-2 text-gold-antique text-xs md:text-sm lg:text-sm tracking-[0.2em] block mx-4 md:mx-6 lg:mx-8"
            >
              ARTIST COLLECTIVE · INCHEON
            </div>
          </div>

          {/* --- SECTION A: HERO --- */}
          {/* Relative so it scrolls up and video disappears */}
          <section
            id="section-a"
            className="relative w-full h-screen overflow-hidden z-0"
          >
            {/* Background Video */}
            <div
              className="absolute inset-0 z-0"
            >
              <video
                className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover opacity-100"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/placeholders/arirang.mp4" type="video/mp4" />
              </video>
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
          </section>


          {/* --- SECTION B: PORTFOLIO MARQUEE --- */}
          {/* Relative so it continues flow after A */}
          <section
            id="section-b"
            className="relative w-full h-screen overflow-hidden z-20"
          >
            {/* Wrapper for Animation (Zoom Out / Fade Out) */}
            <div
              className="w-full h-full relative bg-gradient-dark-depth origin-center"
            >
              {/* Background Layer */}
              <div className="absolute inset-0 z-0">
                {/* Random Stream Marquee (Background) */}
                <RandomStreamMarquee />
              </div>
            </div>
          </section>

        </div>

        {/* --- SECTION C: EVENT (Relative, scroll under B) --- */}
        <section
          className="relative h-screen overflow-hidden py-0 flex items-center justify-center perspective-1000 z-30"
          id="section-c"
        >
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-widest text-[#D6BE8A] drop-shadow-[0_0_25px_rgba(214,190,138,0.3)] border-b-2 border-[#D6BE8A]/60 py-8 px-12 inline-block uppercase text-center">
                이달의 이벤트
              </h2>
              <span className="font-bebas block text-gold-active text-base tracking-[0.5em] uppercase mt-4 font-light opacity-80">
                MONTHLY DROPS
              </span>
            </div>

            <div className="glass-panel-heavy p-4 sm:p-6">
              <div className="w-full mb-8">
                <DraggableScrollContainer className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x">
                  <div className="grid grid-rows-1 grid-flow-col gap-4 w-max">
                    {MOCK_PORTFOLIO.slice(0, 16).map((item, index) => (
                      <div
                        key={item.id}
                        className="glass-card-hover w-[180px] sm:w-[220px] aspect-[4/5] relative rounded-lg group snap-start"
                      >
                        <Image
                          src={item.image}
                          alt={item.artist}
                          fill
                          className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          sizes="(max-width: 640px) 180px, 220px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                          <span className="text-xs text-white/80 font-medium">{item.artist}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </DraggableScrollContainer>
              </div>

              <div className="p-6 rounded-xl bg-black/50 border border-gold-soft/30 mb-8">
                <h3 className="font-bebas text-gold-active font-bold mb-4 tracking-widest text-sm uppercase">Notice</h3>
                <ul className="text-sm text-[#D6BE8A]/90 space-y-3 leading-relaxed font-light">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D6BE8A] mt-1.5 w-1 h-1 rounded-full bg-current block shrink-0"></span>
                    <span>이달의 이벤트 도안은 한정 기간 동안만 진행됩니다.<br /><span className="text-stone-400">예약 마감 시 조기 종료될 수 있습니다.</span></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D6BE8A] mt-1.5 w-1 h-1 rounded-full bg-current block shrink-0"></span>
                    <span>갤러리 이미지는 참고용이며 동일한 결과를 보장하지 않습니다. 피부 상태·부위·에이징에 따라 표현이 달라질 수 있습니다.</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Link href="/gallery?tab=portfolio">
                  <button className="font-bebas group relative px-10 py-4 sm:px-14 sm:py-5 rounded-full overflow-hidden bg-gold-soft/5 border border-gold-soft hover:border-gold-active hover:shadow-[0_0_20px_rgba(214,190,138,0.3)] text-gold-active transition-all duration-500">
                    <span className="relative z-10 text-sm sm:text-base tracking-[0.2em] font-semibold uppercase">
                      View All Events
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Scene D - Genre (Floating Tiles) */}
        <section
          className="relative h-screen overflow-hidden py-0 flex items-center justify-center"
          id="section-d"
        >
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <div className="flex flex-col items-center mb-4 shrink-0">
              <h2 className="font-bebas text-2xl sm:text-4xl font-bold tracking-widest text-[#D6BE8A] drop-shadow-[0_0_25px_rgba(214,190,138,0.3)] border-b border-[#D6BE8A]/60 py-4 px-8 inline-block uppercase text-center">
                STYLES
              </h2>
            </div>

            <div className="relative flex-1 flex flex-col justify-center min-h-0">

              <div className="glass-panel-heavy p-4 overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                  {GENRES.map((g, i) => {
                    return (
                      <div
                        key={g}
                        className="w-full"
                      >
                        <GenrePreviewCard genre={g} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scene E - Consultation Flow */}
        <section
          className="relative h-screen overflow-hidden py-0 flex flex-col items-center justify-center"
          id="section-e"
        >
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <div className="flex flex-col gap-2 h-full justify-center">

              <div className="text-left shrink-0">
                <h2 className="font-bebas text-2xl sm:text-4xl font-bold tracking-widest text-[#D6BE8A] drop-shadow-[0_0_25px_rgba(214,190,138,0.3)] border-b border-[#D6BE8A]/60 py-4 px-8 inline-block uppercase">
                  Consultation Flow
                </h2>
                <span className="font-josefin block text-gold-soft/80 text-xs sm:text-sm tracking-[0.05em] mt-2 font-light">
                  모든 시술은 대면 상담을 통해 결정됩니다.
                </span>
              </div>

              <div className="flex flex-col flex-1 justify-center min-h-0">
                <div className="glass-panel-heavy p-3 overflow-y-auto scrollbar-hide max-h-[50vh]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      { index: 1, label: "01", title: "Online Request", body: "원하시는 시술 부위와 스타일을 선택하고 대면 상담 요청을 접수합니다." },
                      { index: 2, label: "02", title: "In-Person Consultation", body: "대면 상담을 통해 디자인 방향, 시술 가능 여부, 세부 조건을 확인합니다." },
                      { index: 3, label: "03", title: "Decision", body: "상담 결과에 따라 시술 진행 여부가 결정되며, 상황에 따라 시술이 제한되거나 거절될 수 있습니다." },
                      { index: 4, label: "04", title: "Tattoo Session", body: "시술이 확정된 경우에 한해 일정 협의 후 시술이 진행됩니다." },
                    ].map((step, idx) => (
                      <div
                        key={step.label}
                        className="relative glass-card-hover group p-3 rounded-lg min-h-[80px] flex flex-col justify-center"
                      >
                        <span className="font-bebas text-2xl font-bold text-gold-antique/20 absolute top-2 right-3 select-none group-hover:text-gold-antique/40 transition-colors">
                          {step.label}
                        </span>
                        <div className="relative z-10 pr-6">
                          <h3 className="font-bebas text-sm text-gold-soft font-medium tracking-wide mb-0.5 group-hover:text-gold-active transition-colors">
                            {step.title}
                          </h3>
                          <p className="font-josefin text-[10px] text-white-muted leading-tight break-keep font-light group-hover:text-white-main transition-colors line-clamp-2">
                            {step.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center mt-2 shrink-0">
                  <p className="font-josefin text-[10px] text-stone-400 mb-1 tracking-wide font-light">
                    온라인 접수는 시술 예약이 아닙니다.
                  </p>
                  <Link href="/contact">
                    <button className="font-bebas group relative px-6 py-2 sm:px-8 sm:py-2.5 rounded-full overflow-hidden bg-gold-soft/5 border border-gold-soft hover:border-gold-active hover:shadow-[0_0_20px_rgba(214,190,138,0.3)] text-gold-active transition-all duration-500">
                      <span className="relative z-10 text-[10px] sm:text-xs tracking-[0.2em] font-semibold uppercase">
                        Request Consultation
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
