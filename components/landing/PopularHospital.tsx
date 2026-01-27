'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

const PopularHospital = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const hospitals = [
    {
      id: 1,
      name: 'CMH Abbottabad',
      location: 'Abbottabad',
      image: '/images/popular-hospitals/poplarhos1.svg',
    },
    {
      id: 2,
      name: 'Jinnah International',
      location: 'Abbottabad',
      image: '/images/popular-hospitals/popularhos2.svg',
    },
    {
      id: 3,
      name: 'Ayub Medical Complex',
      location: 'Abbottabad',
      image: '/images/popular-hospitals/popularho3.svg',
    },
    {
      id: 4,
      name: 'Abbottabad International',
      location: 'Abbottabad',
      image: '/images/popular-hospitals/popularhos3.svg',
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Scroll by the visible width (shows 2 cards at a time on mobile)
      const scrollAmount = container.clientWidth;
      const currentScroll = container.scrollLeft;
      
      const newScrollPosition =
        direction === 'left' 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount;

      container.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative max-w-[1370px] mt-8 mx-auto py-16 px-8 md:px-12 lg:px-16 overflow-hidden bg-[#f5f5f5] rounded-[30px] mb-6">
      {/* Background SVG */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/hero-backgound.svg"
          alt="Background"
          fill
          className="object-cover opacity-30"
        />
      </div>

      {/* Decorative Bottom Left Element */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200/40 to-transparent rounded-tr-full pointer-events-none" />

      <div className="relative w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left">
            <span className="text-[#4E148C]">Popular </span>
            <span className="text-[#FF6600]">Hospital</span>
          </h2>

          {/* Navigation Buttons - Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full bg-[#4E148C] text-white flex items-center justify-center hover:bg-[#ff6600] transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full bg-[#4E148C] text-white flex items-center justify-center hover:bg-[#ff6600] transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Hospital Cards - Horizontal scroll on mobile, Grid on desktop */}
        <div
          ref={scrollContainerRef}
          className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-hidden pb-4 scroll-smooth snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="flex-shrink-0 w-[calc(50%-8px)] md:w-auto group cursor-pointer snap-start"
            >
              {/* Hospital Image */}
              <div className="relative w-full h-[180px] md:h-[250px] overflow-hidden rounded-2xl mb-3 md:mb-4">
                <Image
                  src={hospital.image}
                  alt={hospital.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:-translate-y-4"
                />
              </div>

              {/* Card Content - Stacked on mobile, side by side on desktop */}
              <div>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 md:gap-2">
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-bold text-black leading-tight mb-1">
                      {hospital.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">{hospital.location}</p>
                  </div>
                  <a
                    href="#"
                    className="flex items-center gap-1 text-sm font-semibold text-black hover:text-[#4E148C] transition-colors mt-2 md:mt-1 md:flex-shrink-0"
                  >
                    Details
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons - Shown at bottom on mobile only */}
        <div className="flex md:hidden justify-center gap-3 mt-8">
          <button
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full bg-[#4E148C] text-white flex items-center justify-center hover:bg-[#ff6600] transition-all duration-300 shadow-lg hover:shadow-xl"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full bg-[#4E148C] text-white flex items-center justify-center hover:bg-[#ff6600] transition-all duration-300 shadow-lg hover:shadow-xl"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularHospital;
