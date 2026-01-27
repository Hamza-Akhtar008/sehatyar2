'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export default function CustomerReview() {
  const reviews = [
    {
      id: 1,
      name: 'Muhammad Farhan',
      role: 'Administrator',
      image: '/images/recentdoctor.png',
      rating: 5,
      text: 'As a clinic admin, Sehatyar has reduced our workload a lot. Patients can book easily, and we manage queues without chaos.',
    },
    {
      id: 2,
      name: 'Asfand Yar',
      role: 'Freelancer',
      image: '/images/recentdoctor2.png',
      rating: 4,
      text: 'The video consultation feature saved me a trip to the hospital. The doctor understood my issue clearly, and the experience felt professional and easy.',
    },
    {
      id: 3,
      name: 'Dr. Hamza Rehman',
      role: 'General Physician',
      image: '/images/recentdoctor3.png',
      rating: 4,
      text: 'Managing my clinic has become much easier with Sehatyar. Appointment scheduling, records, billing—everything is organized in one place.',
    },
    {
      id: 4,
      name: 'Sarah Khan',
      role: 'Patient',
      image: '/images/recentdoctor.png',
      rating: 5,
      text: 'I found the best dermatologist for my acne treatment through Sehatyar. Booking was seamless and the reminders were very helpful.',
    },
    {
      id: 5,
      name: 'Ali Ahmed',
      role: 'Software Engineer',
      image: '/images/recentdoctor2.png',
      rating: 5,
      text: 'The UI is very intuitive. I booked an appointment for my father in minutes. Great service!',
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))
  }

  const getVisibleReviews = () => {
    const items = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % reviews.length
      items.push(reviews[index])
    }
    return items
  }

  const visibleReviews = getVisibleReviews()

  return (
    <div className='w-full flex justify-center py-14 md:py-2 lg:pb-20 px-4 mb-0 md:mb-14'>
        <div className='w-full max-w-[1370px] bg-[#F3F3F3] rounded-[40px] p-6 md:p-12'>
            {/* Header */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12'>
                <div>
                    <h2 className='text-3xl md:text-5xl font-bold mb-4 md:mb-0'>
                        <span className='text-[#421B75]'>Testimonials</span> <span className='text-[#FF7A00]'>Users</span>
                    </h2>
                    <p className='text-[#5C5C5C] text-base md:text-lg mt-2 max-w-md md:hidden'>
                        Your access to the most trusted and well-rated hospitals near you.
                    </p>
                </div>
                <div className='hidden md:flex gap-3'>
                    <button 
                        onClick={handlePrev}
                        className='w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#421B75] text-white flex items-center justify-center hover:bg-[#FF7A00] transition-colors'
                    >
                        <FaChevronLeft size={16} />
                    </button>
                    <button 
                        onClick={handleNext}
                        className='w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#421B75] text-white flex items-center justify-center hover:bg-[#FF7A00] transition-colors'
                    >
                        <FaChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Reviews Grid */}
            <div className='relative'>
                {/* Left Shadow */}
                <div className='absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-[#F3F3F3] to-transparent z-10 pointer-events-none' />
                
                {/* Right Shadow */}
                <div className='absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-[#F3F3F3] to-transparent z-10 pointer-events-none' />

                <div className='flex md:grid md:grid-cols-3 gap-6 overflow-hidden'>
                {visibleReviews.map((review, index) => {
                    const isActive = index === 1 // Middle card is active
                    return (
                        <div 
                            key={review.id} 
                            className={`min-w-[85%] md:min-w-0 p-6 md:p-8 rounded-3xl transition-all duration-300 ${
                                isActive 
                                ? 'bg-white border border-[#421B75] shadow-sm' 
                                : 'bg-[#ededed] border border-transparent'
                            }`}
                        >
                            {/* Stars */}
                            <div className='flex gap-1 mb-4'>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar 
                                        key={i} 
                                        size={20} 
                                        className={i < review.rating ? 'text-[#FF7A00]' : 'text-gray-300'} 
                                    />
                                ))}
                            </div>

                            {/* Text */}
                            <p className='text-gray-500 text-[15px] leading-relaxed mb-8 min-h-[80px]'>
                                {review.text}
                            </p>

                            {/* User Info */}
                            <div className='flex items-center gap-4'>
                                <div className='relative w-14 h-14 rounded-full overflow-hidden'>
                                    <Image 
                                        src={review.image} 
                                        alt={review.name} 
                                        fill
                                        className='object-cover'
                                    />
                                </div>
                                <div>
                                    <h4 className='text-[#421B75] font-bold text-[16px]'>{review.name}</h4>
                                    <p className='text-gray-500 text-[13px]'>{review.role}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
                </div>
            </div>

            {/* Mobile Navigation Buttons */}
            <div className='flex md:hidden gap-3 mt-8'>
                <button 
                    onClick={handlePrev}
                    className='w-12 h-12 rounded-full bg-[#421B75] text-white flex items-center justify-center hover:bg-[#FF7A00] transition-colors'
                >
                    <FaChevronLeft size={16} />
                </button>
                <button 
                    onClick={handleNext}
                    className='w-12 h-12 rounded-full bg-[#421B75] text-white flex items-center justify-center hover:bg-[#FF7A00] transition-colors'
                >
                    <FaChevronRight size={16} />
                </button>
            </div>
        </div>
    </div>
  )
}
