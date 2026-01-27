import React from 'react'
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from 'react-icons/fa'

export default function Footer2() {
  return (
    <div className='w-full px-4 py-6 flex justify-center'>
        <div className='max-w-[1370px] w-full bg-[#4e148c] p-8 text-white rounded-[28px] sm:rounded-[32px] md:rounded-full px-5 sm:px-8 md:px-12 py-5 sm:py-4 md:py-7 flex flex-col-reverse md:flex-row justify-between items-center shadow-lg gap-4 md:gap-0'>
            <div className='text-[13px] font-medium tracking-wide text-center md:text-left opacity-90'>
                © Sehatyar. All rights reserved. Designed & Developed by Firnas.tech
            </div>
            
            <div className='flex items-center gap-6'>
                <span className='text-[13px] font-medium opacity-90'>Connect with us</span>
                <div className='flex gap-2.5'>
                    <a
                      href="#"
                      className='w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center border border-white/70 rounded-full text-white hover:bg-[#FF7A00] transition-all duration-300'
                    >
                        <FaTwitter size={14} />
                    </a>
                    
                    <a
                      href="#"
                      className='w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center border border-white/70 rounded-full text-white hover:bg-[#FF7A00] transition-all duration-300'
                    >
                        <FaFacebookF size={14} />
                    </a>
                    
                    <a
                      href="#"
                      className='w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center border border-white/70 rounded-full text-white hover:bg-[#FF7A00] transition-all duration-300'
                    >
                        <FaInstagram size={15} />
                    </a>
                    
                    <a
                      href="#"
                      className='w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center border border-white/70 rounded-full text-white hover:bg-[#FF7A00] transition-all duration-300'
                    >
                        <FaGithub size={15} />
                    </a>
                </div>
            </div>
        </div>
    </div>
  )
}