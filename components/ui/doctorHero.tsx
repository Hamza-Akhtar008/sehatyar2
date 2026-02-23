"use client";
import React from 'react'
import { useRouter } from 'next/navigation';
import { Star, User } from 'lucide-react';
import Image from 'next/image';

// helper formatters (non-breaking, used only for display)
const capitalizeWords = (s: string) => s.replace(/\b\w/g, c => c.toUpperCase());
const formatSpecializations = (spec?: string | string[]) => {
  if (!spec) return '';
  const arr = Array.isArray(spec) ? spec : spec.split(',').map(s => s.trim());
  return arr.filter(Boolean).map(capitalizeWords).join(', ');
};
type Education = { institute: string; degreeName: string; fieldOfStudy?: string }
const formatEducation = (education?: Education[]) => {
  if (!education?.length) return '';
  return education
    .map(e => `${e.degreeName}${e.fieldOfStudy ? ` (${e.fieldOfStudy})` : ''}`)
    .join(', ');
};
const computeAvgRating = (reviews?: { rating?: number }[]) => {
  if (!reviews?.length) return undefined;
  const ratings = reviews
    .map(r => Number(r?.rating))
    .filter(v => Number.isFinite(v) && v > 0);
  if (ratings.length === 0) return undefined;
  const avg = ratings.reduce((sum, v) => sum + v, 0) / ratings.length;
  return Number(avg.toFixed(1));
};

// Doctor interface type definition matching API response
interface Doctor {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  specialization: string;                // legacy single string
  primarySpecialization?: string[];      // new API: ["cardiology", "Internal Medicine"]
  licenseNumber: string;
  experienceYears: number;               // legacy number
  yearsOfExperience?: string | number;   // new API: "5"
  consultationFee: number;
  FeesPerConsultation?: string;          // API field
  bio?: string;
  clinicAddress?: string;
  clinicName?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  phoneNumber?: string;
  profilePicture?: string;
  profilePic?: string; // API field
  qualifications?: string;               // legacy string
  education?: Education[];               // new API array
  languages?: string[];
  availableForVideoConsultation: boolean;
  user : { fullName: string; city?: string; country?: string; }
  rating?: number;
  reviewCount?: number;
  reviews?: { rating?: number }[];       // new API array
  verified?: boolean;
  availableToday?: boolean;
  // extras from API we don't render here but keep for future
  servicesTreatementOffered?: string[];
  conditionTreatments?: string[];
}

// Specialization aliases mapping
const specializationAliases: Record<string, string[]> = {
  'dermatologist': ['Skin Specialist', 'ماہرامراض جلد', 'Skin Doctor', 'Mahir-e-imraz-e-jild'],
  'cardiology': ['Heart Specialist', 'ماہر امراض قلب', 'Heart Doctor', 'Mahir-e-imraz-e-qalb'],
  'neurologist': ['Brain Specialist', 'ماہر امراض دماغ', 'Nerve Doctor', 'Mahir-e-imraz-e-dimagh'],
  'orthopedic': ['Bone Specialist', 'ماہر امراض ہڈی', 'Bone Doctor', 'Mahir-e-imraz-e-haddi'],
  'gynecologist': ['Women Specialist', 'ماہر امراض نسواں', 'Lady Doctor', 'Mahir-e-imraz-e-niswan'],
  'pediatrician': ['Child Specialist', 'ماہر امراض اطفال', 'Kids Doctor', 'Mahir-e-imraz-e-atfaal'],
  'psychiatrist': ['Mental Health Specialist', 'ماہر نفسیات', 'Mind Doctor', 'Mahir-e-nafsiyat'],
  'ophthalmologist': ['Eye Specialist', 'ماہر امراض چشم', 'Eye Doctor', 'Mahir-e-imraz-e-chashm'],
  'ent specialist': ['ENT Doctor', 'ماہر کان ناک گلا', 'Ear Nose Throat Doctor', 'Mahir-e-kan-nak-gala'],
  'dentist': ['Dental Specialist', 'دانتوں کا ڈاکٹر', 'Teeth Doctor', 'Mahir-e-dandan'],
  'general physician': ['Family Doctor', 'جنرل ڈاکٹر', 'GP', 'Aam Doctor'],
  'urologist': ['Kidney Specialist', 'ماہر امراض گردہ', 'Urinary Doctor', 'Mahir-e-imraz-e-gurda'],
  'pulmonologist': ['Lung Specialist', 'ماہر امراض پھیپھڑے', 'Chest Doctor', 'Mahir-e-imraz-e-phephre'],
  'gastroenterologist': ['Stomach Specialist', 'ماہر امراض معدہ', 'Digestive Doctor', 'Mahir-e-imraz-e-meda'],
  'endocrinologist': ['Diabetes Specialist', 'ماہر ذیابیطس', 'Hormone Doctor', 'Mahir-e-ziabetus'],
  'nephrologist': ['Kidney Specialist', 'ماہر امراض گردہ', 'Kidney Doctor', 'Mahir-e-gurda'],
  'oncologist': ['Cancer Specialist', 'ماہر سرطان', 'Cancer Doctor', 'Mahir-e-sartan'],
  'rheumatologist': ['Joint Specialist', 'ماہر جوڑوں کے امراض', 'Arthritis Doctor', 'Mahir-e-joron-ke-amraz'],
  'allergist': ['Allergy Specialist', 'ماہر الرجی', 'Allergy Doctor', 'Mahir-e-allergy'],
  'physiotherapist': ['Physical Therapy Specialist', 'فزیو تھراپسٹ', 'Physio', 'Mahir-e-physiotherapy'],
};

// Helper to get aliases for a specialization
const getSpecializationAliases = (spec?: string): string | null => {
  if (!spec) return null;
  const normalizedSpec = spec.toLowerCase().trim();
  
  // Direct match
  if (specializationAliases[normalizedSpec]) {
    return specializationAliases[normalizedSpec].join(', ');
  }
  
  // Partial match
  for (const [key, aliases] of Object.entries(specializationAliases)) {
    if (normalizedSpec.includes(key) || key.includes(normalizedSpec)) {
      return aliases.join(', ');
    }
  }
  
  return null;
};

// Doctor Card component
const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/doctor-profile?doctorId=${doctor.id}`);
  };
  const handleBookAppointment = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/book-appointment?doctorId=${doctor.id}`);
  };
  const handleVideoConsultation = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/book-appointment?doctorId=${doctor.id}&type=video`);
  };

  // safely derive display fields from new API first, then fall back
  const fullName =
    doctor.user?.fullName ||
    [doctor.firstName, doctor.lastName].filter(Boolean).join(' ') ||
    'Unknown';

  const displaySpecialization =
    doctor.specialization ||
    formatSpecializations(doctor.primarySpecialization);

  const displayQualifications =
    doctor.qualifications || formatEducation(doctor.education);

  const expYears =
    doctor.experienceYears ??
    (doctor.yearsOfExperience !== undefined
      ? Number(doctor.yearsOfExperience)
      : undefined);

  const reviewsCount =
    Array.isArray(doctor.reviews)
      ? doctor.reviews.length
      : (doctor.reviewCount ?? 0);

  const avgRating =
    Array.isArray(doctor.reviews) && doctor.reviews.length > 0
      ? computeAvgRating(doctor.reviews)
      : (doctor.rating ?? undefined);

  const displayRating = avgRating ?? 4.5;
  const displayReviews = reviewsCount ?? 0;

  const feeVal =
    doctor.FeesPerConsultation != null
      ? Number(doctor.FeesPerConsultation)
      : doctor.consultationFee;
  const displayFee =
    feeVal != null && !Number.isNaN(Number(feeVal))
      ? Number(feeVal).toLocaleString()
      : '1500';

  const doctorLocation = [
    doctor.user?.city || doctor.city,
    doctor.user?.country || doctor.country
  ].filter(Boolean).join(', ');

  return (
    <div className="bg-[#F8F8F8] rounded-3xl p-6 sm:p-7 md:p-8 cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={handleClick}>
      <div className="flex flex-col lg:flex-row items-start gap-5 lg:gap-8">
        {/* Doctor Image */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0 relative border-2 border-gray-100 mx-auto lg:mx-0">
          {(doctor.profilePicture || (doctor.profilePic && doctor.profilePic !== "")) ? (
            <Image 
              src={doctor.profilePicture || doctor.profilePic || ''} 
              alt={`Dr. ${fullName}`}
              fill
              sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
              className="object-cover"
              priority
            />
          ) : (
            <User className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
          )}
        </div>

        {/* Doctor Info */}
        <div className="flex-1 flex flex-col lg:flex-row justify-between w-full gap-5">
          <div className="flex flex-col gap-y-1.5 text-center lg:text-left">
            {/* Name */}
            <h2 className="text-xl sm:text-2xl lg:text-[1.65rem] font-semibold text-[#2D2D2D]">{fullName}</h2>

            {/* Location & PMDC Verified Badge */}
            <div className="flex items-center justify-center lg:justify-start -ml-1">
              <span className="inline-flex items-center text-xs py-0.5 px-1">
                <span className={`w-2 h-2 shrink-0 ${doctor.verified !== false ? 'bg-[#4e148c]' : 'bg-gray-400'} rounded-full mr-1.5`}></span>
                <span className="text-[#5B5B5B] font-medium">
                  {doctorLocation ? `${doctorLocation} | ` : ''}
                  {doctor.verified !== false ? 'PMDC Verified' : 'Not Verified'}
                </span>
              </span>
            </div>

            {/* Specialization */}
            <p className="text-[#5B5B5B] text-sm font-normal">
              {displaySpecialization}
            </p>

            {/* Qualifications */}
            {displayQualifications && (
              <p className="text-[#5B5B5B] text-sm font-normal">
                {displayQualifications}
              </p>
            )}

            {/* Experience & Rating Row */}
            <div className="flex items-center gap-6 justify-center lg:justify-start mt-1">
              <div>
                <p className="text-[#5B5B5B] text-sm font-medium">{expYears ?? 0} Years</p>
                <p className="text-[10px] text-[#8A8A8A]">Experience</p>
              </div>
              <div>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(3)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-[#FACC15] stroke-none" />
                    ))}
                  </div>
                  <span className="ml-1 text-sm font-medium text-[#5B5B5B]">{displayRating}</span>
                </div>
                <p className="text-[10px] text-[#8A8A8A]">{displayReviews} Reviews</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 items-center lg:items-end w-full lg:w-auto">
            <button 
              onClick={handleVideoConsultation}
              className="btn-wipe-up w-full lg:w-[200px] inline-flex items-center justify-center gap-2 whitespace-nowrap py-2.5 px-5 text-sm font-medium border border-[#E5E5E5] text-[#2D2D2D] rounded-full bg-white hover:text-white hover:border-[#ff6600] transition-colors duration-300"
            >
              <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
              <span className="relative z-10">Video Consultation</span>
            </button>
            <button 
              onClick={handleBookAppointment}
              className="btn-wipe-up w-full lg:w-[200px] inline-flex items-center justify-center whitespace-nowrap bg-[#4e148c] text-white rounded-full py-2.5 px-5 text-sm font-medium"
            >
              <span className="relative z-10">Book an Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Consultation Info Card */}
      <div className="mt-6 bg-white p-4 sm:p-5 rounded-2xl border-l-4 border-[#7C3AED] shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <p className="font-medium text-[#2D2D2D] text-sm sm:text-base">
              {doctor.availableForVideoConsultation ? 'Online Video Consultation' : 'In-Clinic Consultation'}
            </p>
            {doctor.availableToday !== false && (
              <div className="flex items-center mt-1.5">
                <span className="inline-flex items-center text-xs">
                  <span className="w-2 h-2 bg-[#4e148c] rounded-full mr-1.5"></span>
                  <span className="text-[#4e148c] font-medium">Available today</span>
                </span>
              </div>
            )}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#2D2D2D]">
            Rs {displayFee}
          </div>
        </div>
      </div>
    </div>
  );
};

interface DoctorHeroProps {
  doctors: Doctor[];
  loading?: boolean;
  specialization?: string;
  city?: string;
}

export default function DoctorHero({ doctors, loading = false, specialization = '', city = '' }: DoctorHeroProps) {
  // List of filter buttons
  const filterButtons = [
    'Female Doctors',
    'Doctors Near Me',
    'Most Experience',
    'Video Consultation'
  ]

  const breadcrumb = city && specialization 
    ? `Home / Pakistan / ${city} / ${specialization} in ${city}`
    : 'Home / Pakistan / Doctors';

  const title = specialization && city
    ? `${doctors.length} Best ${specialization} in ${city}`
    : `${doctors.length} Doctors`;

  return (
    <div className='px-4 sm:px-0 max-w-[1370px] mx-auto'>
      <div className='flex flex-col'>
        <p className='text-xs sm:text-sm description mb-0'>{breadcrumb}</p>
        <h1 className='text-2xl sm:text-3xl md:text-[2rem] lg:text-[2.5rem] m-0 text-[#323232] my-6 sm:my-7 md:my-8 lg:my-10'>
          {title} <span className='text-[#ff781e]'> | Top Specialists </span> 
        </h1>
        {getSpecializationAliases(specialization) && (
          <p className='text-base sm:text-base md:text-lg description'>
            Also known as {getSpecializationAliases(specialization)}
          </p>
        )}
        <div className='mt-6 sm:mt-7 md:mt-8 lg:mt-10 flex flex-wrap gap-2 sm:gap-2.5 md:gap-3'>
          {filterButtons.map((text, index) => (
            <button 
              key={index} 
              className='btn-wipe-up text-xs sm:text-sm py-2 sm:py-2 md:py-2.5 px-3 sm:px-4 md:px-5 border-[1px] text-gray-700 hover:text-white border-[#003F31] hover:border-white rounded-3xl transition-colors duration-300'
            >
              <span className="relative z-10">{text}</span>
            </button>
          ))}
        </div>
      </div>

      <div className='my-8 sm:my-9 md:my-10 lg:my-12'>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4e148c]"></div>
          </div>
        ) : doctors.length > 0 ? (
          <div className='grid grid-cols-1 gap-4 sm:gap-5'>
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor}/>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg sm:text-xl text-gray-500">No doctors found. Please try different search criteria.</p>
          </div>
        )}
      </div> 
    </div>
  )
}