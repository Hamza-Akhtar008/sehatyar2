import React from 'react'
import Image from 'next/image'

export default function Footer() {
  return (
    <div className='w-full flex justify-center py-10 md:py-14 lg:py-20 px-4'>
        <div className='w-full max-w-[1370px] flex flex-col gap-8'>
            {/* Logo and Description */}
            <div className='md:hidden'>
                <Image src="/images/logo.svg" width={180} height={40} alt="sehatyar-logo"/>
                <p className='mt-6 text-[15px] leading-relaxed text-[#66627f]'>
                    Sehatyar is a complete hospital and clinic management system offering smart appointment scheduling, online consultations, seamless billing, and comprehensive healthcare management across Abbottabad, Mansehra, Haripur, and Battagram.
                </p>
            </div>

            {/* Desktop Layout */}
            <div className='hidden md:flex md:gap-6 lg:gap-10 xl:gap-16'>
                {/* Logo and Description - Deskotop */}
                <div className='md:w-[35%] lg:w-[30%]'>
                    <Image src="/images/logo.svg" width={200} height={60} alt="sehatyar-logo"/>
                   
                    <p className='mt-3 text-[15px] leading-relaxed text-[#66627f] mt-3'>
                        Sehatyar is a complete hospital and clinic management system offering smart appointment scheduling, online consultations, seamless billing, and comprehensive healthcare management across Abbottabad, Mansehra, Haripur, and Battagram.
                    </p>
                </div>

                {/* Company Links - Desktop */}
                <div className='md:w-[15%]'>
                    <ul className='flex flex-col gap-4'>
                        <li className='uppercase font-bold text-[#FF6B35] text-sm mb-1'>COMPANY</li>
                        <li className='text-[15px] text-[#66627f] hover:text-[#FF6B35] cursor-pointer transition-colors'>Doctors</li>
                        <li className='text-[15px] text-[#66627f] hover:text-[#FF6B35] cursor-pointer transition-colors'>Clinics</li>
                        <li className='text-[15px] text-[#66627f] hover:text-[#FF6B35] cursor-pointer transition-colors'>How It's Works</li>
                        <li className='text-[15px] text-[#66627f] hover:text-[#FF6B35] cursor-pointer transition-colors'>About Us</li>
                    </ul>
                </div>

                {/* More Links - Desktop */}
                <div className='md:w-[15%]'>
                    <ul className='flex flex-col gap-4'>
                        <li className='font-bold uppercase text-[#FF6B35] text-sm mb-1'>MORE</li>
                        <li className='text-[15px] text-[#66627f] hover:text-[#FF6B35] cursor-pointer transition-colors'>FAQs</li>
                        <li className='text-[15px] text-[#66627f] hover:text-[#FF6B35] cursor-pointer transition-colors'>Process</li>
                        <li className='text-[15px] text-[#66627f] hover:text-[#FF6B35] cursor-pointer transition-colors'>Privacy Policy</li>
                        <li className='text-[15px] text-[#66627f] hover:text-[#FF6B35] cursor-pointer transition-colors'>Payment Terms</li>
                        <li className='text-[15px] text-[#66627f] hover:text-[#FF6B35] cursor-pointer transition-colors'>Contact Us</li>
                    </ul>
                </div>

                {/* Feature Cards - Desktop */}
                <div className='flex flex-col gap-5 md:w-[28%] lg:w-[24%]'>
                    {/* PMDC Verified Doctors */}
                    <div className='flex items-center bg-[#F9F9F9] rounded-full py-3.5 px-3 gap-2.5'>
                        <div className='flex-shrink-0 ml-1'>
                            <Image 
                                src="/images/one.svg" 
                                width={28} 
                                height={28} 
                                alt="tick-icon"
                                style={{ filter: 'invert(56%) sepia(53%) saturate(2644%) hue-rotate(342deg) brightness(101%) contrast(101%)' }}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <h3 className='text-sm text-[#FF6B35] font-bold mb-1'>PMDC Verified Doctors</h3>
                            <p className='text-[13px] text-[#66627f]'>Authentic & updates information</p>
                        </div>
                    </div>

                    {/* Reliable Customer Support */}
                    <div className='flex items-center bg-[#ff6600] rounded-full py-3.5 px-3 gap-2.5'>
                        <div className='flex-shrink-0 ml-1'>
                            <Image src="/images/two.svg" width={28} height={28} alt="support-icon" className="brightness-0 invert"/>
                        </div>
                        <div className='flex flex-col'>
                            <h3 className='text-sm text-white font-bold '>Reliable Customer Support</h3>
                            <p className='text-[13px] text-white'>7 days a week</p>
                        </div>
                    </div>

                    {/* Secure Online Payment */}
                    <div className='flex items-center bg-[#F9F9F9] rounded-full py-3.5 px-3 gap-2.5'>
                        <div className='flex-shrink-0 ml-1'>
                            <Image 
                                src="/images/three.svg" 
                                width={28} 
                                height={28} 
                                alt="security-icon"
                                style={{ filter: 'invert(56%) sepia(53%) saturate(2644%) hue-rotate(342deg) brightness(101%) contrast(101%)' }}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <h3 className='text-[13px] text-[#FF6B35] font-bold leading-tight'>Secure Online Payment</h3>
                            <p className='text-[11px] text-[#66627f]'>Secure checkout</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Links - Two Column Grid */}
            <div className='md:hidden grid grid-cols-2 gap-8'>
                {/* Company Links - Mobile */}
                <div>
                    <ul className='flex flex-col gap-3'>
                        <li className='uppercase font-bold text-[#FF6B35] text-sm mb-1'>COMPANY</li>
                        <li className='text-[14px] text-[#66627f]'>Doctors</li>
                        <li className='text-[14px] text-[#66627f]'>Clinics</li>
                        <li className='text-[14px] text-[#66627f]'>How It's Works</li>
                        <li className='text-[14px] text-[#66627f]'>About Us</li>
                    </ul>
                </div>

                {/* More Links - Mobile */}
                <div>
                    <ul className='flex flex-col gap-3'>
                        <li className='font-bold uppercase text-[#FF6B35] text-sm mb-1'>MORE</li>
                        <li className='text-[14px] text-[#66627f]'>FAQs</li>
                        <li className='text-[14px] text-[#66627f]'>Process</li>
                        <li className='text-[14px] text-[#66627f]'>Privacy Policy</li>
                        <li className='text-[14px] text-[#66627f]'>Payment Terms</li>
                        <li className='text-[14px] text-[#66627f]'>Contact Us</li>
                    </ul>
                </div>
            </div>

            {/* Feature Cards - Mobile */}
            <div className='md:hidden flex flex-col gap-5'>
                {/* PMDC Verified Doctors */}
                <div className='flex items-center bg-[#F9F9F9] rounded-full py-3 px-2.5 gap-2.5'>
                    <div className='flex-shrink-0 ml-1'>
                        <Image 
                            src="/images/one.png" 
                            width={24} 
                            height={24} 
                            alt="tick-icon"
                            style={{ filter: 'invert(56%) sepia(53%) saturate(2644%) hue-rotate(342deg) brightness(101%) contrast(101%)' }}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <h3 className='text-[10px] sm:text-[11px] text-[#FF6B35] font-bold leading-tight'>PMDC Verified Doctors</h3>
                        <p className='text-[9px] text-[#66627f]'>Authentic information</p>
                    </div>
                </div>

                {/* Reliable Customer Support */}
                <div className='flex items-center bg-[#FF6B35] rounded-full py-3 px-2.5 gap-2.5'>
                    <div className='flex-shrink-0 ml-1'>
                        <Image src="/images/two.svg" width={24} height={24} alt="support-icon" className="brightness-0 invert"/>
                    </div>
                    <div className='flex flex-col'>
                        <h3 className='text-[10px] sm:text-[11px] text-white font-bold leading-tight'>Reliable Customer Support</h3>
                        <p className='text-[9px] text-white'>7 days a week</p>
                    </div>
                </div>

                {/* Secure Online Payment */}
                <div className='flex items-center bg-[#F9F9F9] rounded-full py-3 px-2.5 gap-2.5'>
                    <div className='flex-shrink-0 ml-1'>
                        <Image 
                            src="/images/three.svg" 
                            width={24} 
                            height={24} 
                            alt="security-icon"
                            style={{ filter: 'invert(56%) sepia(53%) saturate(2644%) hue-rotate(342deg) brightness(101%) contrast(101%)' }}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <h3 className='text-[10px] sm:text-[11px] text-[#FF6B35] font-bold leading-tight'>Secure Online Payment</h3>
                        <p className='text-[9px] text-[#66627f]'>Secure checkout</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}