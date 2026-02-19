"use client"

import Image from "next/image"

export default function Partners() {
  const logos = [
    { src: "/brands/firnas.png" },
    { src: "/brands/jazz.png" },
    { src: "/brands/naya.png" },
    { src: "/brands/easy.png" },
    { src: "/brands/faysal.png" },
    { src: "/brands/ubl.png" },
    { src: "/brands/ufone.png" },
    { src: "/brands/zong.png" },
  ]

  const scrollingLogos = [...logos, ...logos]
  return (
    <section className="pt-8 pb-10 md:pt-20 md:pb-28 px-4 md:px-10 text-center max-w-[1400px] mx-auto overflow-hidden">
      <h2 className="text-4xl md:text-5xl font-semibold mb-14 md:mb-20 tracking-tight">
        <span className="text-[#4E148C]">Our</span>{" "}
        <span className="text-[#FF6600]">Partners</span>
      </h2>

      <div
        className="relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      >
        <div className="flex animate-marquee whitespace-nowrap gap-12 md:gap-20 items-center">
          {scrollingLogos.map((logo, index) => (
            <div 
              key={index} 
              className={`relative w-28 md:w-40 h-10 md:h-14 flex-shrink-0 transition-all duration-300 px-2 flex items-center justify-center ${
                logo.src === "/brands/zong.png" ? "scale-[1.6] md:scale-[2.4]" : ""
              }`}
            >
              <Image
                src={logo.src}
                alt="Partner Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 128px, 192px"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: fit-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
