"use client"
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import React, { useRef } from "react";
import { useMobile } from "../../hooks/use-mobile";

export default function Doctors() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = isMobile ? 292 : 450; // Smaller scroll amount for mobile
    const newScrollPosition = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  };

  return (
    <section className=" p-10 lg:p-25 px-5 lg:px-20">
      <div className="relative">
       <div className="absolute bottom-0 left-0 w pointer-events-none">
          <Image 
            src="/hero-bg.png" 
            alt="Decorative" 
            width={286} 
            height={50} 
            className="object-contain select-none" 
          />
        </div>
      <div className="bg-card py-10 lg:py-20 px-5 md:px-25 rounded-4xl">
      {/* <Card className=""> */}
        {/* Decorative Backgrounds */}
        {/* <div className="doctors-bg-decoration">
          <Image 
            src="/hero-bg.png" 
            alt="Decorative" 
            width={286} 
            height={50} 
            className="object-contain select-none" 
          />
        </div> */}
      
        
        {/* Title + Description */}
        <div className="">
          <div className="">
            <h2 className="doctors-title">
              Popular <span className="doctors-title-accent">Doctors</span>
            </h2>
            <p className="doctors-description text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <br></br>
               Vehicula massa in enim luctus. Rutrum arcu.
            </p>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="w-full  mx-auto overflow-hidden">
          <div 
            ref={scrollContainerRef}
            className="flex gap-19 flex-nowrap overflow-x-auto hide-scrollbar w-full my-10">
            {[1, 2, 3, 4].map((index) => (
            <div key={index} className="doctors-card-item  flex-shrink-0 ">
              {/* <div className="doctors-card-inner"> */}
              <div className="">
                <div className="items-start inline-flex ">
                  <Image
                    src="/assets/doctors.svg"
                    alt="Doctor"
                    width={50}
                    height={50}
                    className="doctors-image w-auto h-84 sm:h-100 xl:w-auto  xl:h-110 2xl:w-100 2xl:h-110 object-contain "
                    />
                    <span className="w-12 h-12 sm:w-15 sm:h-15 -ml-13 sm:-ml-16  xl:mt-2 bg-[#4ADE80] hover:bg-[#3cbb6c] p-4.5  rounded-full cursor-pointer transition text-white rotate-320 items-center justify-center flex mt-1 md:mt-0">
                      {/* <span className=""> */}

                      <ArrowRight className="doctors-image-arrow" />
                      {/* </span> */}
                    </span>
                </div>
                <div className="doctors-info-card p-5.5  w-[78%] left-38 md:left-45 bottom-10">
                  <h3 className="doctors-name text-base mb-0 font-medium">
                    Dr. Michael Sterling
                  </h3>
                  <p className="doctors-specialization text-xs mt-0 font-light">
                    Gynecologist, Obstetrician
                    <br />
                    MBBS, FCPS (Gynecology and Obstetrics)
                  </p>
                </div>
              </div>
              {/* Arrow Button */}
              {/* <div className="doctors-arrow-button">
                <ArrowRight className="doctors-arrow-icon" />
              </div> */}
            </div>
          ))}
          </div>
        </div>

        {/* Pagination Arrows */}
        <div className="doctors-pagination flex justify-center gap-2 mt-0">
          <Button 
            onClick={() => handleScroll('left')}
            className="doctors-pagination-button hover:bg-primary/90"
          >
            ‹
          </Button>
          <Button 
            onClick={() => handleScroll('right')}
            className="doctors-pagination-button hover:bg-primary/90"
          >
            ›
          </Button>
        </div>
        </div>
        </div>
      {/* </Card> */}
    </section>
  );
}