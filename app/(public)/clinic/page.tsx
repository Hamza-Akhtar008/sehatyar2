import React from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StarIcon } from 'lucide-react'
export default function Clinic() {
  const experiencedDoctors = [
    {
      id: 1,
      name: "Brig.(R) Dr. Muhammad Ramzan Ch",
      image: "/images/doctors/d1.png",
      verified: true,
      specialization: "Urologist, Andrologist, Male Sexual Health Specialist",
      qualification: "M.B.B.S., F.C.P.S. (Urologist), F.I.C.S, Dip in Urology",
      rating: 4.5,
      totalRatings: 4.9,
      reviews: 1784,
    },
    {
      id: 2,
      name: "Brig.(R) Dr. Muhammad Ramzan Ch",
      image: "/images/doctors/d2.png",
      verified: true,
      specialization: "Urologist, Andrologist, Male Sexual Health Specialist",
      qualification: "M.B.B.S., F.C.P.S. (Urologist), F.I.C.S, Dip in Urology",
      rating: 4.5,
      totalRatings: 4.9,
      reviews: 1784,
    },
    {
      id: 3,
      name: "Brig.(R) Dr. Muhammad Ramzan Ch",
      image: "/images/doctors/d3.png",
      verified: true,
      specialization: "Urologist, Andrologist, Male Sexual Health Specialist",
      qualification: "M.B.B.S., F.C.P.S. (Urologist), F.I.C.S, Dip in Urology",
      rating: 4.5,
      totalRatings: 4.9,
      reviews: 1784,
    },
 
  ];

  const specialityList = [
  { name: 'Dermatologist', icon: '/assets/specialityIcons/Dermatologist.png' },
  { name: 'Gynecologist', icon: '/assets/specialityIcons/Gynecologist.png' },
  { name: 'Gastroenterologist', icon: '/assets/specialityIcons/Cardiologist.png' },
  { name: 'Urologist', icon: '/assets/specialityIcons/Urologist.png' },
  { name: 'Dentist', icon: '/assets/specialityIcons/Dentist.png' },
  { name: 'Obesity Specialist', icon: '/assets/specialityIcons/ObesitySpecialist.png' },
  { name: 'ENT Specialist', icon: '/assets/specialityIcons/ENTSpecialist.png' },
  { name: 'Orthopedic Surgeon', icon: '/assets/specialityIcons/OrthopedicSurgeon.png' },
  { name: 'Sexologist', icon: '/assets/specialityIcons/Sexologist.png' },
  { name: 'Neurologist', icon: '/assets/specialityIcons/Neurologist.png' },
  { name: 'Child Specialist', icon: '/assets/specialityIcons/ChildSpecialist.png' },
  { name: 'Pulmonologist', icon: '/assets/specialityIcons/Pulmonologist.png' },
  { name: 'Eye Specialist', icon: '/assets/specialityIcons/EyeSpecialist.png' },
  { name: 'Medical Specialist', icon: '/assets/specialityIcons/MedicalSpecialist.png' },
]



    const locationIcon = <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 9.5C6.33696 9.5 5.70107 9.23661 5.23223 8.76777C4.76339 8.29893 4.5 7.66304 4.5 7C4.5 6.33696 4.76339 5.70107 5.23223 5.23223C5.70107 4.76339 6.33696 4.5 7 4.5C7.66304 4.5 8.29893 4.76339 8.76777 5.23223C9.23661 5.70107 9.5 6.33696 9.5 7C9.5 7.3283 9.43534 7.65339 9.3097 7.95671C9.18406 8.26002 8.99991 8.53562 8.76777 8.76777C8.53562 8.99991 8.26002 9.18406 7.95671 9.3097C7.65339 9.43534 7.3283 9.5 7 9.5ZM7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 12.25 7 20 7 20C7 20 14 12.25 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0Z" fill="#414141"/>
</svg>
  return (
<div className=''>
    <div className='pt-12.5 pb-3 px-10 lg:px-25'>
        <p>Home / Pakistan / Abbottabad / Doctors Hospital</p>
        <div className='sm:flex mt-10 mb-5 sm:justify-between'>
            {/* <div className=''> */}
            <div className='flex flex-col sm:flex-row gap-10 bg-[#F8F8F8] rounded-4xl p-10 items-center'>
                <Image src="/images/hospital.png" alt="Hospital Image" width={120}  height={120} className='min-w-36 min-h-36 rounded-full'/>
            {/* </div> */}
            <div className='flex flex-col gap-3 sm:text-start text-center'>
                <h1 className='text-2xl font-semibold'>Doctors Hospital</h1>
                <p className='text-sm'>152 A - G / 1, Canal Bank, Johar Town, Lahore</p>
                <div className='flex gap-3'>
                <button className='bg-[#5FE089] py-3 px-15 rounded-4xl'>Call Helpline</button>
                  <button className='border-[1px] border-[#414141] py-3 px-5.5 rounded-3xl'>
{locationIcon}
                  </button>
                </div>
            </div>
            
</div>


 

        </div>

    </div>
  <section aria-label="Specialists section" className="specialists-section">
      <Card className="px-5 lg:px-20 rounded-4xl">
        {/* Title + Description */}
        <div className="specialists-header">
          <div className="specialists-title-container">
            <h2 className="specialists-title mb-5 md:mb-10">
              Doctors <span className="specialists-title-accent">Speciality</span>
            </h2>
            <p className="specialists-description mb-5 md:mb-10">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <br></br>
               Vehicula massa in enim luctus. Rutrum arcu.
            </p>
          </div>

          {/* View All button opposite the heading */}
          <div className="specialists-button-container">
            <Button className="view-all-button font-medium">
              View more Specialization
            </Button>
          </div>
        </div>
<div className="p-5 md:p-15 bg-white rounded-2xl">
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-6 md:gap-8 lg:gap-19">
        {specialityList.map((speciality) => (
    <div key={speciality.name} className="mx-auto text-center group cursor-pointer">
      <div className="w-25 h-25 rounded-full bg-[#003F31] transition-colors mb-3.5 p-2 hover:bg-[#5FE089]">
          <div className="mx-auto">
            <Image 
              src={speciality.icon} 
              alt={speciality.name} 
              width={50} 
              height={50}  
              className="w-15 h-20 mx-auto p-2.5 transition-transform group-hover:scale-110 "
            />
          </div>
      </div>
            <p className="text-sm font-medium text-gray-700  transition-colors">
              {speciality.name}
            </p>
    </div>
        ))}
    
    
  </div>
</div>
      </Card>
    </section>

    <section className=" px-5 lg:px-25 py-8">
      <div className='bg-[#F8F8F8] px-5 md:px-21 py-15 rounded-4xl'>

      <div className="md:flex justify-between items-center pb-15">
        <h2 className="text-4xl font-semibold">Most Experienced Doctors in <span className="text-[#5FE089]">Doctors Hospital</span></h2>
        <Button variant="outline" className="bg-[#01503F] rounded-4xl px-8 py-2.5 text-white hover:bg-[#5FE089]">
          View more Doctors
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-15">
        {experiencedDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white p-5 md:p-10 rounded-4xl md:flex items-center justify-between">
            <div className="md:flex gap-10 justify-items-center md:justify-items-start md:text-start text-center">
              <Image
                src={doctor.image}
                alt={doctor.name}
                width={110}
                height={110}
                className="min-w-32 min-h-32 rounded-full"
              />
              <div className='flex flex-col items-center md:items-start md:gap-0 gap-2'>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl md:text-[1.75rem] lg:text-3xl font-semibold text-[#414141] ">{doctor.name}</h3>
                </div>
                 <div className="flex items-center justify-center sm:justify-start"> 
              <span className="inline-flex items-center text-green-600 text-xs py-1 px-2.5 bg-[#E8E8E8] rounded-2xl">
                <span className={`w-2 h-2 ${doctor.verified ? 'bg-green-500' : 'bg-gray-400'} rounded-full mr-1`}></span>
                <span className="text-[#3D3D3D]">{doctor.verified !== false ? 'PMDC Verified' : 'Not Verified'}</span>
              </span>
            </div>
                <p className="text-sm text-gray-600 pb-1">{doctor.specialization}</p>
                <p className="text-sm text-gray-600">{doctor.qualification}</p>



                <div className="flex flex-col gap-1 mt-1 ">
                  <div className='flex gap-6'>

                  <div>
                    <p className='text-xs font-normal text-gray-600'>Under 15 Min</p>
                    <p className='text-[8px] font-normal text-gray-500'>Wait Time</p>
                  </div>

                    <div>
                    <p className='text-xs font-normal text-gray-600'>42 Years</p>
                    <p className='text-[8px] font-normal text-gray-500'>Experience</p>
                  </div>
                  <div className='flex flex-col'>
                    <div className='flex items-center'>
 {[...Array(3)].map((_, index) => (
                    <StarIcon
                      key={index}
                      className={`w-3 h-3 ${
                        index < Math.floor(doctor.rating)
                          ? 'text-yellow-400 fill-current '
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-1 font-normal">{doctor.totalRatings}</span>
                    </div>
                 <div className='text-[8px] font-normal text-gray-500'>{doctor.reviews} Reviews</div>
                  </div>
                  </div>

                </div>



              </div>
            </div>
            <div className="flex flex-col gap-1.5 items-center md:items-end">
              <div>

              <Button className="bg-white text-black border hover:bg-gray-50 rounded-4xl border-black">
                View Profile
              </Button>
              </div>

              <div>
              <Button className="bg-[#5FE089] text-black hover:bg-[#4bc06e] rounded-4xl">
                Book an Appointment
              </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
            </div>

    </section>
    </div>
  )
}
