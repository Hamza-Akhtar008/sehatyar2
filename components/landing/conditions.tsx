import { Card } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Specialists() {


const specialityList = [
  { name: 'Fever', icon: '/assets/conditionIcons/Fever.png' },
  { name: 'Heart Attack', icon: '/assets/conditionIcons/HeartAttack.png' },
  { name: 'Pregnancy', icon: '/assets/conditionIcons/Pregnancy.png' },
  { name: 'High Blood Pressure', icon: '/assets/conditionIcons/HighBloodPressure.png' },
  { name: 'Piles', icon: '/assets/conditionIcons/Piles.png' },
  { name: 'Diarrhea', icon: '/assets/conditionIcons/Diarrhea.png' },
  { name: 'Acne', icon: '/assets/conditionIcons/Acne.png' },

]


  return (
    <section aria-label="Specialists section" className="specialists-section">
      <Card className="p-10 lg:p-25 px-5 lg:px-20">
        {/* Title + Description */}
        <div className="specialists-header">
          <div className="specialists-title-container">
            <h2 className="specialists-title mb-5 md:mb-10">
              Doctor by <span className="specialists-title-accent">condition</span>
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

        {/* Specialists image - full width & responsive height */}
        {/* <div className="specialists-image-container ">
          <div className="specialists-image-wrapper rounded-4xl">
            <Image
              src="/assets/specialityIcons/Dermatologist.png"
              alt="Dermatologist"
              fill
              className="specialists-image bg-green-500"
            />
          </div>
        </div> */}
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
  );
}