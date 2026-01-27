'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocation } from '@/src/contexts/LocationContext'

const specialistsData = [
  { name: 'Dermatology', icon: '/images1/dermatologist.png' },
  { name: 'Gynecology', icon: '/images1/gynco.png' },
  { name: 'Gastroenterology', icon: '/images1/gestro.png' },
  { name: 'Urology', icon: '/images1/urologist.png' },
  { name: 'Dentistry', icon: '/images1/dentist.png' },
  { name: 'Obesity', icon: '/images1/obesity.png' },
  { name: 'Orthopedic', icon: '/images1/ortheo.png' },
  { name: 'ENT', icon: '/images1/ent.png' },
]

// Repeat the list as requested
const specialists = [...specialistsData, ...specialistsData, ...specialistsData]

// Group specialists into chunks of 6 for mobile carousel (2 rows x 3 columns)
type Specialist = { name: string; icon: string }
const mobileChunks: Specialist[][] = []
for (let i = 0; i < specialists.length; i += 6) {
  mobileChunks.push(specialists.slice(i, i + 6))
}

export default function Carousel() {
  const router = useRouter()
  const { city } = useLocation()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [mobileShowLeft, setMobileShowLeft] = useState(false)
  const [mobileShowRight, setMobileShowRight] = useState(true)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10) 
    }
  }

  const checkMobileScroll = () => {
    if (mobileScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = mobileScrollRef.current
      setMobileShowLeft(scrollLeft > 0)
      setMobileShowRight(scrollLeft < scrollWidth - clientWidth - 10) 
    }
  }

  useEffect(() => {
    checkScroll()
    checkMobileScroll()
    window.addEventListener('resize', checkScroll)
    window.addEventListener('resize', checkMobileScroll)
    return () => {
      window.removeEventListener('resize', checkScroll)
      window.removeEventListener('resize', checkMobileScroll)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300 
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const mobileScroll = (direction: 'left' | 'right') => {
    if (mobileScrollRef.current) {
      const scrollAmount = mobileScrollRef.current.clientWidth
      mobileScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  // Handle click on specialist to navigate to doctor search page
  const handleSpecialistClick = (specialistName: string) => {
    router.push(
      `/doctor?query=${encodeURIComponent(specialistName)}&city=${encodeURIComponent(city || '')}`
    )
  }

  return (
    <div className="w-full flex justify-center py-10 px-4">
      <div className="relative bg-[#4E148C] rounded-[22px] px-[20px] md:px-[20px] py-[30px] md:py-[40px] max-w-[1370px] w-full group/carousel">
        
        {/* Mobile Layout - 2 rows x 3 columns grid carousel */}
        <div className="md:hidden relative">
          {/* Mobile Left Arrow */}
          {mobileShowLeft && (
            <button
              onClick={() => mobileScroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-full backdrop-blur-sm transition-all"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Mobile Right Arrow */}
          {mobileShowRight && (
            <button
              onClick={() => mobileScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-full backdrop-blur-sm transition-all"
            >
              <ChevronRight size={20} />
            </button>
          )}

          <div 
            ref={mobileScrollRef}
            onScroll={checkMobileScroll}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
          >
            {mobileChunks.map((chunk, chunkIndex) => (
              <div 
                key={chunkIndex} 
                className="grid grid-cols-3 grid-rows-2 gap-4 min-w-full snap-center px-6"
              >
                {chunk.map((specialist, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                    onClick={() => handleSpecialistClick(specialist.name)}
                  >
                    <div className="relative w-16 h-16 rounded-full bg-[#3D0F6E] flex items-center justify-center transition-all duration-300 group-hover:bg-[#ff6600]">
                      <Image
                        src={specialist.icon}
                        alt={specialist.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <span className="text-white text-[10px] font-medium text-center leading-tight">
                      {specialist.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout - Horizontal scroll */}
        <div className="hidden md:block relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all"
            >
              <ChevronRight size={24} />
            </button>
          )}

          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="relative z-10 flex overflow-x-auto scrollbar-hide gap-8 snap-x scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
          >
            {specialists.map((specialist, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center gap-4 group cursor-pointer min-w-[120px] snap-start"
                onClick={() => handleSpecialistClick(specialist.name)}
              >
                <div className="relative w-24 h-24 rounded-full bg-[#3D0F6E] flex items-center justify-center transition-all duration-300 group-hover:bg-[#ff6600] z-10">
                  <Image
                    src={specialist.icon}
                    alt={specialist.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <span className="text-white text-sm md:text-base font-medium text-center leading-tight">
                  {specialist.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}