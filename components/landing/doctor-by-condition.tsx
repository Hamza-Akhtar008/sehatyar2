// import React from 'react'
import Image from 'next/image'

export default function DoctorByCondition() {
  return (
    <div className='w-full flex justify-center pt-1 pb-0 md:pt-10 lg:pt-9 px-2 relative z-10'>
        <div className='w-full max-w-[1370px] relative'>
            <div className='flex bg-[#4e148c] py-10 xl:py-[60px] md:px-[90px] px-5 rounded-[32px] relative overflow-visible'>
                {/* Left content — fixed width so phone doesn't push it */}
                <div className='w-full md:w-1/2 relative z-50'>
                    <h1 className='text-white text-[22px] md:text-4xl pb-3 md:pb-6 font-medium'>Download the <span className='text-white'>Sehat Yar App</span></h1>
                    <p className='text-white text-sm md:text-lg font-light md:pr-0'>Book trusted doctors and manage your health with ease.
                        Because your health deserves better.
                    </p>
                    <div className='flex gap-[18px] pt-4 pb-0 md:py-4 flex-col md:flex-row'>
                        <Image src="/images/store1.svg" alt="App Store 1" className='w-[140px] md:w-[180px]' width={180} height={50}/>
                        <Image src="/images/store2.svg" alt="App Store 2" className='w-[140px] md:w-[180px]' width={180} height={50}/>
                    </div>
                </div>
                {/* Mobile View Image (small screens) - independent, overflows above */}
            </div>
            {/* Mobile phone - absolutely positioned, independent of card height */}
            <div className='md:hidden absolute bottom-0 right-4 z-[100]'>
                <Image
                    src="/images/mobiledevice.svg"
                    alt="Mobile App"
                    className='w-36 object-contain object-bottom'
                    style={{ height: '220px' }}
                    width={144}
                    height={220}
                />
            </div>
            {/* Desktop Phone - absolutely positioned on the wrapper, fully independent of card height */}
            <div className='hidden md:block absolute bottom-0 right-[8%] xl:right-[12%] z-[100]'>
                <Image
                    src="/images/mobile.svg"
                    alt="Mobile App"
                    className='w-64 lg:w-72 xl:w-80 2xl:w-96 object-contain object-bottom'
                    style={{ height: '480px' }}
                    width={320}
                    height={420}
                />
            </div>
        </div>
    </div>
  )
}