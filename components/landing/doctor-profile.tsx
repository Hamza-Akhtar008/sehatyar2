"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDoctorProfileByDoctorId } from "@/lib/Api/Doctor/doctor_api";
import DoctorProfileTabs from "@/components/landing/DoctorProfileTabs";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface DoctorProfile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  experienceYears: number;
  consultationFee: number;
  FeesPerConsultation?: string; // API field
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
  qualifications?: string;
  availabilities?: {
    availabilityType: string;
    address: string;
    startTime: string;
    endTime: string;
    days: string[];
  }[];
  languages?: string[];
  availableForVideoConsultation: boolean;
  user: {
    fullName: string;
  };
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
  availableToday?: boolean;
  servicesTreatementOffered?: string[];
  education?: { institute: string; degreeName: string; fieldOfStudy?: string }[]; // <-- Add this line
  primarySpecialization?: string[];
  experienceDetails?: string[]; // e.g. ["2000 - 2013, Head of General Surgery, Doctors Hospital and Medical Center"]
  memberships?: string[]; // e.g. ["American Board of Surgery", "Pakistan Medical Commission (PMC)"]
  faqs?: { question: string; answer: string; table?: { location: string; fee: string }[] }[];
  yearsOfExperience?: string | number; // <-- Add this line
  Description?: string; // <-- Add this line
}

type StatProps = { label: string; value: string };

function Stat({ label, value }: StatProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
      <span className="font-medium text-[#111827]">{value}</span>
      <span className="text-[#6B7280]">{label}</span>
    </div>
  );
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="min-w-[120px] text-sm text-[#4B5563]">{label}</span>
      <div className="flex-1 h-[6px] rounded-full bg-[#E5E7EB]">
        <div
          className="h-[6px] rounded-full bg-[#0F766E]"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-10 text-right text-xs text-[#4B5563]">{value}%</span>
    </div>
  );
}

export default function DoctorProfile() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get("doctorId");

  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (!doctorId) {
        setError("No doctor ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getDoctorProfileByDoctorId(Number(doctorId));
        setDoctor(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching doctor profile:", err);
        setError("Failed to load doctor profile");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  if (loading) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4e148c]"></div>
      </main>
    );
  }

  if (error || !doctor) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error || "Doctor not found"}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </main>
    );
  }

  const fullName = doctor.user?.fullName || 'Unknown';
  const displayRating = doctor.rating || 4.5;
  const displayReviews = doctor.reviewCount || 0;

  // Add default FAQs if not present in API
  const defaultFaqs = [
    {
      question: "What are the consultation fees and locations?",
      answer: "Below are the available locations and their respective fees.",
      table: [
        {
          location: doctor.clinicName || doctor.clinicAddress || "Clinic",
          fee: `Rs. ${doctor.FeesPerConsultation || doctor.consultationFee || "N/A"}`
        },
        {
          location: "Online Video Consultation",
          fee: `Rs. ${doctor.FeesPerConsultation || doctor.consultationFee || "N/A"}`
        }
      ]
    },
    {
      question: "What services does the doctor offer?",
      answer: doctor.servicesTreatementOffered && doctor.servicesTreatementOffered.length > 0
        ? doctor.servicesTreatementOffered.join(", ")
        : "Please see the Services tab for details."
    },
    {
      question: "What is the doctor's education background?",
      answer: doctor.education && doctor.education.length > 0
        ? doctor.education.map(e => `${e.degreeName}${e.fieldOfStudy ? ` (${e.fieldOfStudy})` : ""} — ${e.institute}`).join(", ")
        : "Please see the Education tab for details."
    }
  ];

  const reviews = (doctor as any).reviews || [];

  return (
    <main className="max-w-[1370px] mx-auto">
     
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&display=swap');
        .plus-jakarta-sans * {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }
      `}</style>
      <section className="mx-auto w-full max-w-[1370px] px-4 md:px-6 lg:px-4 py-6 md:py-10 plus-jakarta-sans">
       
      
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Left – header card, tabs and feedback */}
          <section>
            {/* Header card  */}
            <Card className="rounded-3xl bg-[#F8F8F8] mb-6 border-0 shadow-none">
              <CardHeader className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8">
                  {/* Doctor Image */}
                  <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border-2 border-gray-100">
                    {(doctor.profilePicture || doctor.profilePic) ? (
                      <Image
                        src={doctor.profilePicture || doctor.profilePic || ''}
                        alt={`Dr. ${fullName}`}
                        fill
                        sizes="128px"
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Doctor Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    {/* Name */}
                    <h1 className="font-bold text-2xl sm:text-3xl lg:text-[2rem] leading-tight text-[#2D2D2D]">
                      Dr. {fullName}
                    </h1>
                    
                    {/* PMDC Verified Badge */}
                    <div className="flex items-center justify-center sm:justify-start mt-2">
                      <span className="inline-flex items-center text-xs py-0.5 px-1">
                        <span className={`w-2 h-2 ${doctor.verified !== false ? 'bg-[#4e148c]' : 'bg-gray-400'} rounded-full mr-1.5`}></span>
                        <span className="text-[#5B5B5B] font-medium">{doctor.verified !== false ? 'PMDC Verified' : 'Not Verified'}</span>
                      </span>
                    </div>
                    
                    {/* Specialization */}
                    <p className="text-[#5B5B5B] text-sm mt-2">
                      {doctor.specialization}
                    </p>
                    
                    {/* Qualifications */}
                    {doctor.qualifications && (
                      <p className="text-[#5B5B5B] text-sm mt-1">
                        {doctor.qualifications}
                      </p>
                    )}
                    
                    {/* Stats Row */}
                    <div className="mt-4 flex flex-wrap items-center gap-6 justify-center sm:justify-start">
                      <div>
                        <p className="text-[#5B5B5B] text-sm font-medium">Under 15 Min</p>
                        <p className="text-[10px] text-[#8A8A8A]">Wait Time</p>
                      </div>
                      <div>
                        <p className="text-[#5B5B5B] text-sm font-medium">{doctor.experienceYears || doctor.yearsOfExperience || 0} Years</p>
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
                </div>
              </CardHeader>
            </Card>
            <DoctorProfileTabs
              servicesTreatementOffered={doctor.servicesTreatementOffered}
              education={doctor.education}
              primarySpecialization={doctor.primarySpecialization}
              experienceDetails={doctor.experienceDetails}
              memberships={doctor.memberships}
              faqs={doctor.faqs && doctor.faqs.length > 0 ? doctor.faqs : defaultFaqs}
              yearsOfExperience={doctor.yearsOfExperience || doctor.experienceYears}
              city={doctor.city}
              country={doctor.country}
              Description={doctor.Description}
              doctorName={doctor.user?.fullName}
              reviews={reviews}           // <-- use the safe reviews variable
              reviewCount={doctor.reviewCount}
            />
          </section>

          {/* Right – booking cards or fallback */}
          <aside className="space-y-4">
            {doctor.availableForVideoConsultation && (
              <Card className="rounded-xl bg-[#F8F8F8]">
                <CardHeader>
                  <CardTitle className="text-[#414141] text-[22px]">
                    Online Video Consultation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#52525B]">Fee:</span>
                    <span className="text-[#111827]">
                      Rs. {(doctor.FeesPerConsultation && doctor.FeesPerConsultation !== "0")
                        ? doctor.FeesPerConsultation
                        : doctor.consultationFee && doctor.consultationFee !== 0
                          ? doctor.consultationFee
                          : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#52525B]">Address:</span>
                    <span className="text-right text-[#111827]">
                      {/* Show online availability address if present, else fallback */}
                      {doctor.availabilities?.find(a => a.availabilityType === "online" && a.address)?.address
                        || "Use phone/laptop for video call"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#52525B]">
                    <span>Available </span>
                    <span>02:00 PM - 03:00 PM</span>
                  </div>
                  <Button
                    className="w-full bg-[#4e148c] mt-2 py-6 hover:bg-[#ff6600] rounded-full text-white"
                    onClick={() => router.push(`/book-appointment?doctorId=${doctor.id}&type=video`)}
                  >
                    Book an Appointment
                  </Button>
                </CardContent>
              </Card>
            )}

            {doctor.clinicName && (
              <Card className="rounded-xl bg-[#F8F8F8]">
                <CardHeader>
                  <CardTitle className="text-[#414141] text-[22px]">{doctor.clinicName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#52525B]">Fee:</span>
                    <span className="text-[#111827]">
                      Rs. {(doctor.FeesPerConsultation && doctor.FeesPerConsultation !== "0")
                        ? doctor.FeesPerConsultation
                        : doctor.consultationFee && doctor.consultationFee !== 0
                          ? doctor.consultationFee
                          : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#52525B]">Address:</span>
                    <span className="text-right text-[#111827]">
                      {/* Show clinic availability address if present, else fallback */}
                      {doctor.availabilities?.find(a => a.availabilityType === "clinic" && a.address)?.address
                        || doctor.clinicAddress
                        || `${doctor.city || ''}, ${doctor.state || ''}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#52525B]">
                    <span>Available </span>
                    <span>02:00 PM - 03:00 PM</span>
                  </div>
                  <Button
                    className="w-full bg-[#4e148c] mt-2 hover:bg-[#ff6600] py-6 rounded-full text-white"
                    onClick={() => router.push(`/book-appointment?doctorId=${doctor.id}`)}
                  >
                    Book an Appointment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Fallback card if no video or clinic info */}
            {!(doctor.availableForVideoConsultation || doctor.clinicName) && (
              <>
                {/* Static Online Video Consultation Card */}
                <Card className="rounded-xl bg-[#F8F8F8]">
                  <CardHeader>
                    <CardTitle className="text-[#414141] text-[22px]">
                      Online Video Consultation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#52525B]">Fee:</span>
                      <span className="text-[#111827]">
                        Rs. {(doctor.FeesPerConsultation && doctor.FeesPerConsultation !== "0")
                          ? doctor.FeesPerConsultation
                          : doctor.consultationFee && doctor.consultationFee !== 0
                            ? doctor.consultationFee
                            : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#52525B]">Address:</span>
                      <span className="text-right text-[#111827] font-semibold">
                        {doctor.availabilities?.find(a => a.availabilityType === "online" && a.address)?.address
                          || "Use phone/laptop for video call"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#52525B]">
                      <span>Available Thu, Oct, 09</span>
                      <span>02:00 PM - 03:00 PM</span>
                    </div>
                    <Button
                      className="w-full bg-[#4e148c] mt-2 py-6 hover:bg-[#ff6600] rounded-full text-white"
                    >
                      Book an Appointment
                    </Button>
                  </CardContent>
                </Card>
                {/* Static Doctors Hospital Card */}
                <Card className="rounded-xl bg-[#F8F8F8]">
                  <CardHeader>
                    <CardTitle className="text-[#414141] text-[22px]">
                      Doctors Hospital
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#52525B]">Fee:</span>
                      <span className="text-[#111827]">
                        Rs. {(doctor.FeesPerConsultation && doctor.FeesPerConsultation !== "0")
                          ? doctor.FeesPerConsultation
                          : doctor.consultationFee && doctor.consultationFee !== 0
                            ? doctor.consultationFee
                            : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#52525B]">Address:</span>
                      <span className="text-right text-[#111827] font-semibold">
                        {doctor.availabilities?.find(a => a.availabilityType === "clinic" && a.address)?.address
                          || "152 A - G / 1, Canal Bank, Johar Town, Lahore"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#52525B]">
                      <span>Available Tomorrow</span>
                      <span>02:00 PM - 03:00 PM</span>
                    </div>
                    <Button
                      className="w-full bg-[#4e148c] mt-2 hover:bg-[#ff6600] py-6 rounded-full text-white"
                    >
                      Book an Appointment
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
