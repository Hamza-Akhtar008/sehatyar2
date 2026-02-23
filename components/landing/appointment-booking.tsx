"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { useEffect, useState } from "react"
import { getDoctorProfileByDoctorId } from "@/lib/Api/Doctor/doctor_api"
import { getAvailability, type Slot as AvailabilitySlot } from "@/lib/availability"
import { useRef } from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"

interface DoctorProfile {
  id: number
  userId: number
  firstName: string
  lastName: string
  specialization: string
  licenseNumber: string
  experienceYears: number
  consultationFee: number
  FeesPerConsultation?: string
  bio?: string
  clinicAddress?: string
  clinicName?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  phoneNumber?: string
  profilePicture?: string
  profilePic?: string
  qualifications?: string
  languages?: string[]
  availableForVideoConsultation: boolean
  user: {
    fullName: string
  }
  rating?: number
  reviewCount?: number
  verified?: boolean
  availableToday?: boolean
}

interface TimeSlot {
  time: string
  available: boolean
  slotId?: number
}

interface HospitalAvailability {
  hospitalName: string
  slots: TimeSlot[]
}

interface DayAvailability {
  date: string
  dayName: string
  hospitals: HospitalAvailability[]
}
const generateTimeSlots = (startTime: string, endTime: string): string[] => {
  const slots: string[] = []
  const [startHour, startMin] = startTime.split(":").map(Number)
  const [endHour, endMin] = endTime.split(":").map(Number)

  let currentHour = startHour
  let currentMin = startMin

  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const hour12 = currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour
    const period = currentHour >= 12 ? "PM" : "AM"
    const timeStr = `${hour12.toString().padStart(2, "0")}:${currentMin.toString().padStart(2, "0")} ${period}`
    slots.push(timeStr)

    currentMin += 30
    if (currentMin >= 60) {
      currentMin = 0
      currentHour++
    }
  }

  return slots
}

const GREEN_PRIMARY = "#5FE089"

// Helper function to categorize slots into morning, afternoon, evening
const categorizeSlots = (slots: TimeSlot[]) => {
  const morning: TimeSlot[] = []
  const afternoon: TimeSlot[] = []
  const evening: TimeSlot[] = []

  slots.forEach((slot) => {
    const timeStr = slot.time
    const isPM = timeStr.includes("PM")
    const hourMatch = timeStr.match(/^(\d{1,2})/)
    const hour = hourMatch ? parseInt(hourMatch[1]) : 0

    if (!isPM || hour === 12) {
      // AM times or 12 PM
      if (hour < 12 || (hour === 12 && !isPM)) {
        morning.push(slot)
      } else {
        afternoon.push(slot)
      }
    } else {
      // PM times
      if (hour < 5 || hour === 12) {
        afternoon.push(slot)
      } else {
        evening.push(slot)
      }
    }
  })

  return { morning, afternoon, evening }
}

function Slot({
  label,
  available = true,
  selected = false,
  onClick,
}: {
  label: string
  available?: boolean
  selected?: boolean
  onClick?: () => void
}) {
  return (
    <button
      disabled={!available}
      className={
        `h-10 min-w-[84px] mt-5 rounded-[12px] border px-3 text-[12px] transition-colors ` +
        (selected
          ? "bg-[#5FE089] text-[#414141] border-[#01503F]"
          : available
            ? "bg-white text-[#414141] border-[#414141] hover:bg-gray-50"
            : "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed")
      }
      onClick={available ? onClick : undefined}
    >
      {label}
    </button>
  )
}

function SlotRow({
  title,
  slots,
  selectedSlot,
  onSlotClick,
}: {
  title: string
  slots: TimeSlot[]
  selectedSlot: string | null
  onSlotClick: (time: string) => void
}) {
  if (slots.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-[#5B5B5B]">{title}</div>
      <div className="flex flex-wrap gap-3">
        {slots.map((slot, idx) => (
          <button
            key={idx}
            disabled={!slot.available}
            onClick={() => slot.available && onSlotClick(slot.time)}
            className={`
              transition-all duration-200
              rounded-full border-2 cursor-pointer px-5 py-2.5 text-sm font-medium
              ${
                slot.available
                  ? selectedSlot === slot.time
                    ? "bg-[#4e148c] text-white border-[#4e148c]"
                    : "bg-white text-[#5B5B5B] border-[#E5E5E5] hover:border-[#4e148c] hover:text-[#4e148c]"
                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              }
            `}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  )
}
  



export  function DayTabs({
  days,
  selectedDay,
  onDaySelect,
}: {
  days: DayAvailability[]
  selectedDay: number
  onDaySelect: (index: number) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 150
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="border-b border-[#E5E7EB] pb-0 relative">
      {/* Left scroll button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-1.5 rounded-full shadow-sm z-10 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-[#5B5B5B]" />
      </button>

      <div
        ref={scrollRef}
        className="overflow-x-auto scroll-smooth no-scrollbar mx-10"
      >
        <div className="flex items-center justify-between min-w-max">
          {days.slice(0, 7).map((day, i) => (
            <button
              key={i}
              onClick={() => onDaySelect(i)}
              className={`
                text-sm py-4 px-6 font-medium transition-all whitespace-nowrap relative
                ${i === selectedDay
                  ? "text-[#4e148c]"
                  : "text-[#5B5B5B] hover:text-[#4e148c]"
                }
              `}
            >
              {day.dayName}
              {i === selectedDay && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-[#4e148c] rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right scroll button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-1.5 rounded-full shadow-sm z-10 transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-[#5B5B5B]" />
      </button>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}


export default function AppointmentBooking() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const doctorId = searchParams.get("doctorId")
  const consultationType = searchParams.get("type")

  const [doctor, setDoctor] = useState<DoctorProfile | null>(null)
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([])
  const [daySchedules, setDaySchedules] = useState<DayAvailability[]>([])
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!doctorId) {
        setError("No doctor ID provided")
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        const [doctorData, availabilityData] = await Promise.all([
          getDoctorProfileByDoctorId(Number(doctorId)),
          getAvailability(Number(doctorId)),
        ])

        setDoctor(doctorData)
        setAvailability(
          availabilityData.filter(
            (slot: AvailabilitySlot) =>
              slot.isActive &&
              (consultationType === "video" ? slot.availabilityType === "online" : slot.availabilityType === "clinic"),
          ),
        )
        setError(null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load appointment data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [doctorId, consultationType])

  useEffect(() => {
    if (availability.length === 0) {
      setDaySchedules([])
      return
    }

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const today = new Date()
    const schedules: DayAvailability[] = []

    // Group availability by day of week
    const availabilityByDay = availability.reduce(
      (acc, slot) => {
        if (!acc[slot.dayOfWeek]) {
          acc[slot.dayOfWeek] = []
        }
        acc[slot.dayOfWeek].push(slot)
        return acc
      },
      {} as Record<string, AvailabilitySlot[]>,
    )

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dayName = daysOfWeek[date.getDay()]
      const daySlots = availabilityByDay[dayName] || []

      const hospitalMap = new Map<string, TimeSlot[]>()

   daySlots.forEach((slot) => {
  if (slot.startTime && slot.endTime) {
    const hospitalName =
      slot.availabilityType == "clinic"
        ? `${slot.address}`
        : "Online Consultation"

    const timeSlots = generateTimeSlots(slot.startTime, slot.endTime)

    if (!hospitalMap.has(hospitalName)) {
      hospitalMap.set(hospitalName, [])
    }

    timeSlots.forEach((time) => {
      const slotObj: TimeSlot = {
        time,
        available: true,
        slotId: slot.id,
      }
      hospitalMap.get(hospitalName)?.push(slotObj)
    })
  }
})


      const hospitals: HospitalAvailability[] = Array.from(hospitalMap.entries()).map(([hospitalName, slots]) => ({
        hospitalName,
        slots,
      }))

      const dateStr = i === 0 ? "Today" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

      schedules.push({
        date: date.toISOString().split("T")[0],
        dayName: `${dateStr}, ${dayName.slice(0, 3)}`,
        hospitals,
      })
    }

    setDaySchedules(schedules)
  }, [availability])

  const handleSlotClick = (time: string) => {
    setSelectedSlot(time)
  }

  if (loading) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4e148c]"></div>
      </main>
    )
  }

  if (error || !doctor) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error || "Doctor not found"}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </main>
    )
  }

  const fullName = doctor.user?.fullName || "Unknown"
  const consultationTypeText =
    consultationType === "video" || doctor.availableForVideoConsultation
      ? "Online Video Consultation"
      : "In-Clinic Consultation"

  const currentDaySchedule = daySchedules[selectedDayIndex]

  return (
    <main className="w-full">
      <section className="mx-auto max-w-[1370px] py-6 md:py-8">
        {/* Mobile Layout: Reordered with doctor info first */}
        <div className="lg:hidden space-y-4">
          {/* Doctor Info Card - Mobile */}
          <Card className="rounded-2xl bg-[#F8F8F8] border-0 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Doctor Image with yellow background */}
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[#F5A623] flex-shrink-0">
                  {doctor.profilePicture || doctor.profilePic ? (
                    <Image
                      src={doctor.profilePicture || doctor.profilePic || ""}
                      alt={`Dr. ${fullName}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Doctor Info */}
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[#2D2D2D]">Dr. {fullName}</h3>
                  <p className="text-xs text-[#5B5B5B] mt-0.5">{consultationTypeText}</p>
                  <p className="text-base font-bold text-[#2D2D2D] mt-1">
                    Fee: Rs. {doctor.FeesPerConsultation || doctor.consultationFee?.toLocaleString() || "1,500"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar and Slots - Mobile */}
          <Card className="rounded-2xl bg-[#F8F8F8] border-0 shadow-none">
            <CardContent className="p-4">
              {daySchedules.length > 0 ? (
                <>
                  <DayTabs days={daySchedules} selectedDay={selectedDayIndex} onDaySelect={setSelectedDayIndex} />

                  <div className="mt-6 space-y-6">
                    {currentDaySchedule && currentDaySchedule.hospitals.length > 0 ? (
                      <>
                        {currentDaySchedule.hospitals.map((hospital, idx) => (
                          <SlotRow
                            key={idx}
                            title={hospital.hospitalName}
                            slots={hospital.slots}
                            selectedSlot={selectedSlot}
                            onSlotClick={handleSlotClick}
                          />
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500 text-sm">No slots available for this day</div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">No availability found for this doctor</div>
              )}
            </CardContent>
          </Card>

          {/* Reviews Section - Mobile */}
          <div className="space-y-3">
            <div className="text-base font-semibold text-[#414141] px-1">
              Reviews about Dr. {fullName} {doctor.reviewCount ? `(${doctor.reviewCount})` : ""}
            </div>

            {[1, 2, 3].map((i) => (
              <Card key={i} className="rounded-xl bg-[#F8F8F8] border-0 shadow-none">
                <CardContent className="p-4">
                  <div className="text-[#111827] font-semibold text-sm mb-1">I recommend the doctor</div>
                  <div className="text-xs text-[#6B7280] mb-2">"Very good"</div>
                  <div className="text-[10px] text-[#9CA3AF] flex items-center justify-between">
                    <span>Verified Patient: M*** **n.</span>
                    <span>5 days ago</span>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-start">
              <button
                className="flex items-center gap-2 border border-[#414141] rounded-[10px] px-4 py-2 text-[#414141] text-[13px] bg-white hover:bg-[#F3F4F6] transition-colors"
                type="button"
              >
                <ChevronDown className="w-4 h-4" />
                Load More Reviews
              </button>
            </div>
          </div>

          {/* Sticky Confirm Booking Button - Mobile */}
          <div className="sticky bottom-0 left-0 right-0 bg-white pt-3 pb-4 -mx-4 px-4 border-t border-[#E5E5E5]">
            <Button
              className="w-full h-11 rounded-full text-[14px] font-medium bg-[#4e148c] hover:bg-[#ff6600] text-white transition-colors duration-200"
              disabled={!selectedSlot}
              onClick={() => {
                if (!selectedSlot) return
                router.push(
                  `/book-appointment/confirm?doctorId=${doctorId}&time=${encodeURIComponent(selectedSlot)}&date=${daySchedules[selectedDayIndex]?.date}`,
                )
              }}
            >
              Confirm Booking
            </Button>
          </div>
        </div>

        {/* Desktop Layout: Original two-column grid */}
        <div className="hidden lg:grid grid-cols-[1fr_420px] gap-6">
          {/* Left side: calendar and slots */}
          <Card className="rounded-3xl bg-[#F8F8F8] border-0 shadow-none">
            <CardContent className="p-5 md:p-8">
              {daySchedules.length > 0 ? (
                <>
                  <DayTabs days={daySchedules} selectedDay={selectedDayIndex} onDaySelect={setSelectedDayIndex} />

                  <div className="mt-8 space-y-8">
                    {currentDaySchedule && currentDaySchedule.hospitals.length > 0 ? (
                      <>
                        {currentDaySchedule.hospitals.map((hospital, idx) => (
                          <SlotRow
                            key={idx}
                            title={hospital.hospitalName}
                            slots={hospital.slots}
                            selectedSlot={selectedSlot}
                            onSlotClick={handleSlotClick}
                          />
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-10 text-gray-500">No slots available for this day</div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-10 text-gray-500">No availability found for this doctor</div>
              )}
            </CardContent>
          </Card>

          {/* Right side: doctor info and reviews */}
          <div className="space-y-4">
            <Card className="rounded-3xl bg-[#F8F8F8] border-0 shadow-none">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center gap-5">
                  {/* Doctor Image with yellow background */}
                  <div className="relative h-20 w-20 overflow-hidden rounded-full bg-[#F5A623] flex-shrink-0">
                    {doctor.profilePicture || doctor.profilePic ? (
                      <Image
                        src={doctor.profilePicture || doctor.profilePic || ""}
                        alt={`Dr. ${fullName}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Doctor Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2D2D2D]">Dr. {fullName}</h3>
                    <p className="text-sm text-[#5B5B5B] mt-0.5">{consultationTypeText}</p>
                    <p className="text-lg font-bold text-[#2D2D2D] mt-2">
                      Fee: Rs. {doctor.FeesPerConsultation || doctor.consultationFee?.toLocaleString() || "1,500"}
                    </p>
                  </div>
                </div>
                
                {/* Confirm Booking Button */}
                <div className="mt-6">
                  <Button
                    className="w-full h-12 rounded-full text-[15px] font-medium bg-[#4e148c] hover:bg-[#ff6600] text-white transition-colors duration-200"
                    disabled={!selectedSlot}
                    onClick={() => {
                      if (!selectedSlot) return
                      router.push(
                        `/book-appointment/confirm?doctorId=${doctorId}&time=${encodeURIComponent(selectedSlot)}&date=${daySchedules[selectedDayIndex]?.date}`,
                      )
                    }}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="text-[18px] font-semibold text-[#414141] px-1">
              Reviews about Dr. {fullName} {doctor.reviewCount ? `(${doctor.reviewCount})` : ""}
            </div>

            {[1, 2, 3].map((i) => (
              <Card key={i} className="rounded-2xl bg-[#F8F8F8] border-0 shadow-none">
                <CardContent className="p-5">
                  <div className="text-[#111827] font-semibold mb-2">I recommend the doctor</div>
                  <div className="text-sm text-[#6B7280] mb-3">"Very good"</div>
                  <div className="text-[11px] text-[#9CA3AF] flex items-center justify-between">
                    <span>Verified Patient: M*** **n.</span>
                    <span>5 days ago</span>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-start pt-2">
              <button
                className="flex items-center gap-2 border border-[#414141] rounded-[12px] px-6 py-2 text-[#414141] text-[14px] bg-white hover:bg-[#F3F4F6] transition-colors"
                type="button"
              >
                <ChevronDown className="w-[18px] h-[18px]" />
                Load More Reviews
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
