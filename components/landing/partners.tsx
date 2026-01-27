"use client"

import Image from "next/image"

export default function Partners() {
  const logos = [
    { src: "/partners/image 18.png", width: 140, height: 51 },
    { src: "/partners/image 19.png", width: 134, height: 51 },
    { src: "/partners/image 20.png", width: 172, height: 51 },
    { src: "/partners/image 21.png", width: 314, height: 51 },
    { src: "/partners/image 22.png", width: 182, height: 51 },
    { src: "/partners/image 23.png", width: 102, height: 51 },
    { src: "/partners/image 24.png", width: 114, height: 51 },
    { src: "/partners/image 25.png", width: 142, height: 51 },
    { src: "/partners/image 26.png", width: 179, height: 51 },
    { src: "/partners/image 27.png", width: 100, height: 51 },
    { src: "/partners/image 28.png", width: 61, height: 51 },
    { src: "/partners/image 29.png", width: 66, height: 65 },
    { src: "/partners/image 30.png", width: 68, height: 68 },
  ]

  const scrollingLogos = [...logos, ...logos]
  return (
    <section className="py-2 md:py-28 px-4 md:px-10 text-center max-w-[1370px] mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold text-[#45278b] ">
        Our <span className="text-[#f97316]">Partners</span>
      </h1>

      <div
        className="relative overflow-hidden mt-8 md:mt-12"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}
      >
        <div className="flex animate-marquee gap-8 md:gap-10 ">
          {scrollingLogos.map((logo, index) => (
            <div key={index} className="flex-[0_0_auto] flex items-center justify-center mt-8">
              <Image
                src={logo.src || "/placeholder.svg"}
                alt={`Partner logo ${index + 1}`}
                width={logo.width}
                height={logo.height}
                className="object-contain h-12 md:h-[70px] w-auto max-w-[120px] md:max-w-[180px]"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 80s linear infinite; /* slow scroll */
        }
      `}</style>
    </section>
  )
}
