// import React from 'react'
import Image from 'next/image'

export default function DoctorByCondition() {
  return (
    <div className='w-full flex justify-center py-10 md:py-14 lg:py-10 px-4'>
        <div className='w-full max-w-[1370px]'>
            <div className='flex bg-[#4e148c] py-10 xl:py-[60px] md:px-[90px] px-5 rounded-[32px] relative '>
                <div className='w-full md:w-6/12 lg:w-7/12 xl:w-6/12 relative z-50'>
                    <h1 className='text-white text-4xl pb-5 md:pb-10'>Download the <span className='text-white'>Sehat Yar App</span></h1>
                    <p className='text-white text-lg font-light pr-32 md:pr-0'>Book trusted doctors and manage your health with ease.
                        Because your health deserves better.
                    </p>
                    <div className='flex gap-[18px] py-8 xl:py-16 flex-col md:flex-row'>
                        <Image src="/images/store1.svg" alt="App Store 1" className='w-[180px]' width={180} height={50}/>
                        <Image src="/images/store2.svg" alt="App Store 2" className='w-[180px]' width={180} height={50}/>
                    </div>
                </div>
                {/* Mobile View Image */}
                <div className='md:hidden absolute -right-[-10px] -bottom-[26px] w-[160px] h-[200px]'>
                     <Image src="/images/mobiledevice.svg" alt="Mobile App" className='w-full h-full object-contain' width={160} height={200}/>
                </div>
                <div><Image src="/images/mobile.svg" alt="Play Store" className='hidden md:flex h-[400px] w-80 lg:h-[480px] lg:w-[480px]  xl:h-[600px] xl:w-[480px] 2xl:h-[600px] 2xl:w-[440px] absolute z-10 bottom-0 right-10 xl:right-20 object-contain' width={480} height={600}/></div>
            </div>
        </div>
    </div>
  )
}