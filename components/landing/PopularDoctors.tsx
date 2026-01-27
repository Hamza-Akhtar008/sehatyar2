'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

const doctorsData = [
  {
    name: 'Dr. Ismail Khan',
    location: 'Portland, Oregon, USA',
    image: '/doctor1.svg',
  },
  {
    name: 'Dr. Haris Khan Tanoli',
    location: 'Portland, Oregon, USA',
    image: '/doctor2.svg',
  },
  {
    name: 'Dr. Shameem Bibi',
    location: 'Portland, Oregon, USA',
    image: '/doctor3.svg',
  },
  {
    name: 'Dr. Noman Tanoli',
    location: 'Portland, Oregon, USA',
    image: '/doctor4.svg',
  },
]

export default function PopularDoctors() {
  const [currentPage, setCurrentPage] = useState(0)

  const scrollLeft = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const scrollRight = () => {
    setCurrentPage((prev) => Math.min(Math.ceil(doctorsData.length / 4) - 1, prev + 1))
  }

  return (
    <section className="w-full flex justify-center py-10 px-4">
      <div className="relative bg-[#F4F4F4] rounded-[22px] md:rounded-[42px] overflow-hidden max-w-[1370px] w-full">
        {/* Background Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-backgound.svg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 px-6 md:px-16 py-10 md:py-14">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-[#4E148C]">Popular</span>{' '}
              <span className="text-[#FF6600]">Doctors</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base max-w-md">
              Find top-rated doctors in your city, chosen for their experience and exceptional patient care.
            </p>
          </div>

          {/* Doctors Grid - 4 in one frame */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {doctorsData.map((doctor, index) => (
              <div key={index} className="group cursor-pointer">
                {/* Doctor Image with hover pop-up effect */}
                <div className="relative w-full h-[180px] sm:h-[220px] md:h-[280px] rounded-[16px] md:rounded-[20px] overflow-hidden bg-gray-200 mb-3 md:mb-4 transition-transform duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-xl">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Doctor Info */}
                <div className="flex items-start justify-between gap-1 md:gap-2">
                  <div>
                    <h3 className="font-semibold text-[#333333] text-sm md:text-lg leading-tight">
                      {doctor.name}
                    </h3>
                    <p className="text-gray-500 text-[10px] md:text-sm mt-0.5 md:mt-1">
                      {doctor.location}
                    </p>
                  </div>
                  <Link
                    href="#"
                    className="flex items-center gap-0.5 md:gap-1 text-[#FF6600] text-[10px] md:text-sm font-medium hover:underline flex-shrink-0"
                  >
                    View Profile
                    <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-[#4E148C] text-white hover:bg-[#ff6600]"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-[#4E148C] text-white hover:bg-[#ff6600]"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

