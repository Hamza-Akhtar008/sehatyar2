import React, { useState } from 'react'
import { Input } from '../ui/input'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import Link from 'next/link';

const doctorSpecialties = [
  { id: 1, name: 'Cardiology', icon: '/assets/specialityIcons/Dermatologist.png', isOnline: true },
  { id: 2, name: 'Gynecologist', icon: '/assets/specialityIcons/Gynecologist.png', isOnline: true },
  { id: 3, name: 'Gastroenterologist', icon: '/assets/specialityIcons/Cardiologist.png', isOnline: true },
  { id: 4, name: 'Urologist', icon: '/assets/specialityIcons/Urologist.png', isOnline: true },
  { id: 5, name: 'Dentist', icon: '/assets/specialityIcons/Dentist.png', isOnline: true },
  { id: 6, name: 'Obesity Specialist', icon: '/assets/specialityIcons/ObesitySpecialist.png', isOnline: true },
  { id: 7, name: 'ENT Specialist', icon: '/assets/specialityIcons/ENTSpecialist.png', isOnline: true },
  { id: 8, name: 'Orthopedic Surgeon', icon: '/assets/specialityIcons/OrthopedicSurgeon.png', isOnline: true },
  { id: 9, name: 'Sexologist', icon: '/assets/specialityIcons/Sexologist.png', isOnline: true },
  { id: 10, name: 'Neurologist', icon: '/assets/specialityIcons/Neurologist.png', isOnline: true },
  { id: 11, name: 'Child Specialist', icon: '/assets/specialityIcons/ChildSpecialist.png', isOnline: true },
  { id: 12, name: 'Pulmonologist', icon: '/assets/specialityIcons/Pulmonologist.png', isOnline: true },

];

// Doctor card component
const DoctorCard = ({ name, isOnline, icon }: {
  name: string;
  isOnline: boolean;
  icon: string;
}) => {
  return (
    <Link href={{
            pathname: "/doctor",
            query: {
              query: name, // specialization name
              
            },
          }}>
    <div className="group flex items-center py-3 px-3 sm:py-4 sm:px-6.5 transition-all rounded-2xl sm:rounded-4xl border-[1px] border-[#A6A6A6] gap-2 sm:gap-2.5 hover:bg-[#F4F4F4] hover:border-none">
      <div className='bg-[var(--brand-primary)] group-hover:bg-[var(--brand-primary-hover)] p-2 sm:p-3 rounded-full flex-shrink-0 transition-colors duration-200'>
        <Image src={icon} alt={name} width={20} height={20} className='w-4 h-4 sm:w-5 sm:h-5'/>
      </div>
      <div className='flex flex-col gap-0.5 sm:gap-1 min-w-0'>
      <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-900 mb-0 truncate">{name}</h3>
      <button className='text-start'>
        <span className={cn(
        "px-2 sm:px-3 py-0.5 text-[10px] sm:text-xs font-medium rounded-full transition-colors duration-200",
        isOnline ? "bg-[#ede0f7] group-hover:bg-[var(--brand-primary-hover)] text-[var(--brand-primary)] group-hover:text-white" : "bg-gray-100 text-gray-800"
      )}>
        {isOnline ? 'Online' : 'Offline'}
      </span>
        </button>
      </div>
    </div>
    </Link>
  );
};

export default function ConsultOnline() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter doctors based on search query
  const filteredDoctors = doctorSpecialties.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="w-full mx-auto px-2 sm:px-0 bg-white">
      {/* Title - visible on mobile */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center block sm:hidden">Consult Online</h2>
      
      {/* Search Input */}
      <div className="flex items-center text-sm sm:text-base bg-[#F4F4F4] text-[#616161] rounded-full px-3 sm:px-5 py-2.5 sm:py-4 mb-4 sm:mb-6 mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#616161] w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <Input
          type="text"
          placeholder="Search for specialization"
          className="hero-input border-none shadow-none bg-transparent focus:ring-0 h-full w-full placeholder:text-[#616161] placeholder:text-xs sm:placeholder:text-sm placeholder:font-light"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>


      {/* Grid of doctors */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto pr-1'>
        {filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            name={doctor.name}
            isOnline={doctor.isOnline}
            icon={doctor.icon}
          />
        ))}
      </div>
    </div>
  )
}
