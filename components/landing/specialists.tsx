import { Card } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Specialists() {


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


  return (
    <section aria-label="Specialists section" className="specialists-section">
      <Card className="p-10 lg:p-25 px-5 lg:px-20">
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
            <Button className="view-all-button">
              View All
            </Button>
          </div>
        </div>
<div className="p-5 md:p-15 bg-white rounded-2xl">
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-6 md:gap-8 lg:gap-19">
        {specialityList.map((speciality) => (
    <div key={speciality.name} className="mx-auto text-center group cursor-pointer">
            <Link    href={{
            pathname: "/doctor",
            query: {
              query: speciality.name, // specialization name
              city: "Abbottobad",
            },
          }}>
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
            </Link>
    </div>
        ))}
    
    
  </div>
</div>
      </Card>
    </section>
  );
}