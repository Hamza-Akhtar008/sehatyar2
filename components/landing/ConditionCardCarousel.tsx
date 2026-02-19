'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocation } from '@/src/contexts/LocationContext'

type Condition = { name: string; icon: string }

const conditionsData: Condition[] = [
  { name: 'High Blood Pressure', icon: '/doctorbycondition/highBloodPressure.png' },
  { name: 'Piles', icon: '/doctorbycondition/piles.png' },
  { name: 'Diarrhea', icon: '/doctorbycondition/diaerha.png' },
  { name: 'Acne', icon: '/doctorbycondition/Acne.png' },
  { name: 'Pregnancy', icon: '/doctorbycondition/pregnancy.png' },
  { name: 'Fever', icon: '/doctorbycondition/fever.png' },
  { name: 'Heart Attack', icon: '/doctorbycondition/heartAttack.png' },
]

// Repeat the list to create infinite scroll effect
const conditions = [...conditionsData, ...conditionsData, ...conditionsData]

// Group conditions into chunks of 6 for mobile carousel (2 rows x 3 columns)
const mobileChunks: Condition[][] = []
for (let i = 0; i < conditions.length; i += 6) {
  mobileChunks.push(conditions.slice(i, i + 6))
}

export default function ConditionCardCarousel() {
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

  // Handle click on condition to navigate to doctor search page
  const handleConditionClick = (conditionName: string) => {
    router.push(
      `/doctor?query=${encodeURIComponent(conditionName)}&city=${encodeURIComponent(city || 'Abbottabad')}`
    )
  }

  return (
    <section className="w-full flex mt-2 md:mt-6 lg:mt-1 justify-center items-center py-2 md:py-10 px-4 md:h-[513px]">
      <div className="bg-[#f4f4f4] rounded-[22px] md:rounded-[42px] px-[20px] md:px-[66px] py-[20px] md:py-[40px] max-w-[1370px] w-full flex flex-col gap-6 md:gap-10">
        
        {/* Header Section */}
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-2xl md:text-4xl font-bold text-[#4e148c]">
          Doctor by <span className="text-[#ff6600]">Condition</span>
        </h2>
        <Button className="bg-[#4E148C] text-white rounded-full hover:bg-[#ff6600] px-5 md:px-10 py-1.5 md:py-3 text-[13px] md:text-base h-auto min-h-[32px] font-medium shadow-md transition-all active:scale-95">
          View All
        </Button>
      </div>

      <p className="text-gray-600 text-sm md:text-lg max-w-2xl mb-6">
        Quickly find the right specialists for common conditions and get trusted medical care when you need it.
      </p>
    </div>
        <div className="relative bg-[#4E148C] rounded-[22px] px-[20px] md:px-[20px] py-[30px] md:py-[40px] w-full group/carousel">
          <div className="md:hidden relative">
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
                  {chunk.map((condition, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col items-center gap-2 group cursor-pointer"
                      onClick={() => handleConditionClick(condition.name)}
                    >
                      <div className="relative w-14 h-14 rounded-full bg-[#3D0F6E] flex items-center justify-center transition-all duration-300 group-hover:bg-[#ff6600]">
                        <Image
                          src={condition.icon}
                          alt={condition.name}
                          width={28}
                          height={28}
                          className="w-7 h-7 object-contain"
                        />
                      </div>
                      <span className="text-white text-[9px] font-medium text-center leading-tight">
                        {condition.name}
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
              {conditions.map((condition, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center gap-4 group cursor-pointer min-w-[120px] snap-start"
                  onClick={() => handleConditionClick(condition.name)}
                >
                  <div className="relative w-24 h-24 rounded-full bg-[#3D0F6E] flex items-center justify-center transition-all duration-300 group-hover:bg-[#ff6600] z-10">
                    <Image
                      src={condition.icon}
                      alt={condition.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <span className="text-white text-sm md:text-base font-medium text-center leading-tight">
                    {condition.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
