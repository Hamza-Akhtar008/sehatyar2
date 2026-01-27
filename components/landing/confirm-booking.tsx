"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { getDoctorProfileByDoctorId } from "@/lib/Api/Doctor/doctor_api";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function ConfirmBooking() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<any>(null);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [doctorError, setDoctorError] = useState<string | null>(null);

  const { user } = useAuth();
  const [self, setSelf] = useState(true);
  const [payment, setPayment] = useState<string>("online");
  const [patientName, setPatientName] = useState(user?.fullName);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState(user?.email);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Get booking info from query params
  const doctorId = Number(searchParams.get("doctorId"));
  const appointmentTime = searchParams.get("time") || "";
  const appointmentDate = searchParams.get("date") || "";

  useEffect(() => {
    if (!doctorId) return;
    setDoctorLoading(true);
    getDoctorProfileByDoctorId(doctorId)
      .then(setDoctor)
      .catch(() => setDoctorError("Failed to load doctor profile"))
      .finally(() => setDoctorLoading(false));
  }, [doctorId]);

  return (
    <main className="w-full">
      <section className="mx-auto w-full max-w-[1370px] px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          {/* Left: Form */}
          <Card className="rounded-2xl bg-[#F8F8F8]">
            <CardContent className="p-4 md:p-6">
              <div className="text-[18px] md:text-[16px] font-semibold text-[#414141] mb-3">
                Appointment For
              </div>

              <div className="flex items-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setSelf(true)}
                  className={`px-3 py-1.5 rounded-[12px] text-[14px] font-[600px]  ${
                    self
                      ? "bg-[#4e148c] text-white "
                      : "bg-white text-[#6B7280] "
                  }`}
                >
                  My Self
                </button>
                <button
                  type="button"
                  onClick={() => setSelf(false)}
                  className={`px-3 py-1.5 rounded-[12px] text-[14px] font-[600px]  ${
                    !self
                      ? "bg-[#4e148c] text-white "
                      : "bg-white text-[#414141] "
                  }`}
                >
                  + Someone else
                </button>
              </div>

              <div className="space-y-4 rounded-2xl border border-[#E5E7EB] p-4 md:p-6">
                <div className="space-y-2">
                  <Label className="text-[14px] font-semibold text-[#414141]">Patient Name</Label>
                  <Input
                    placeholder="Enter Your Name"
                    className="h-11 rounded-[12px] border-[#E5E7EB] text-[14px] placeholder:text-[#9CA3AF]"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[14px] font-semibold text-[#414141]">Phone Number</Label>
                  <Input
                    placeholder="03XX-XXXXXXX"
                    className="h-11 rounded-[12px] border-[#E5E7EB] text-[14px] placeholder:text-[#9CA3AF]"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                  />
                <div className="space-y-2">
                  <Label className="text-[14px] font-semibold text-[#414141]">Email (Optional)</Label>
                  <Input
                    placeholder="Enter Email"
                    className="h-11 rounded-[12px] border-[#E5E7EB] text-[14px] placeholder:text-[#9CA3AF]"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[14px] font-semibold text-[#414141]">Notes </Label>
                  <Input
                    placeholder="Write Your Issue here in few words"
                    className="h-11 rounded-[12px] border-[#E5E7EB] text-[14px] placeholder:text-[#9CA3AF]"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[14px] font-semibold text-[#414141]">Select Payment Method</Label>
                  <button
                    type="button"
                    onClick={() => setPayment("online")}
                    className={`flex items-center justify-between w-full h-12 rounded-[12px] border mt-6 px-4 text-[14px] ${
                      payment === "online"
                        ? "bg-white border-[#4e148c]"
                        : "bg-white border-[#4e148c]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                          payment === "online"
                            ? "bg-white border-[#4e148c]"
                            : "bg-white border-[#D1D5DB]"
                        }`}
                      >
                        {payment === "online" && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[#4e148c]" />
                        )}
                      </span>
                      <span className="text-[#414141]">Online Payment</span>
                    </div>
                    <span className="text-[#414141]">{doctor?.FeesPerConsultation}</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Doctor summary */}
          <Card className="rounded-2xl bg-[#F8F8F8]">
            <CardContent className="p-4 md:p-6">
              {/* Dynamic doctor profile */}
              {doctorLoading ? (
                <div className="text-gray-500">Loading doctor info...</div>
              ) : doctorError ? (
                <div className="text-red-500">{doctorError}</div>
              ) : doctor ? (
                <div className="flex items-start gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                    {(doctor.profilePicture || doctor.profilePic) ? (
                      <Image
                        src={doctor.profilePicture || doctor.profilePic || ''}
                        alt={`Dr. ${doctor.user?.fullName || "Doctor"}`}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-[22px] font-semibold text-[#414141]">Dr. {doctor.user?.fullName || "Unknown"}</div>
                    <div className="text-[14px] text-[#52525B]">
                      {doctor.specialization || "Specialist"}
                    </div>
                    <div className="text-[14px] text-[#52525B]">
                      {doctor.availableForVideoConsultation ? "Video consultation" : "In-clinic consultation"}: Rs. {doctor.FeesPerConsultation || doctor.consultationFee?.toLocaleString() || 'N/A'}
                    </div>
                    <div className="inline-flex mt-4 items-center rounded-full px-4 py-2 text-[14px] font-medium text-[#111827]" style={{ background: '#EEEEEE' }}>
                      {appointmentDate && appointmentTime ? `${appointmentDate}, ${appointmentTime}` : "No slot selected"}
                    </div>
                  </div>
                </div>
              ) : null}

             

        <div className="mt-5">
                <Button
                  className="w-full h-10 rounded-full text-[14px] font-medium bg-[#4e148c] hover:bg-[#ff6600] text-white transition-colors duration-200"
                  disabled={!patientName || !phoneNumber || !notes}
                  onClick={() => {
                    // Basic validation
                    if (!patientName?.trim()) {
                      setError("Patient name is required");
                      return;
                    }
                    if (!phoneNumber.trim()) {
                      setError("Phone number is required");
                      return;
                    }
                    if (!notes.trim()) {
                      setError("Notes are required");
                      return;
                    }

                    // Redirect to payment page with all booking data
                    const params = new URLSearchParams({
                      doctorId: String(doctorId),
                      time: appointmentTime,
                      date: appointmentDate,
                      patientName: patientName || "",
                      phoneNumber,
                      email: email || "",
                      notes,
                      appointmentFor: self ? "myself" : "someone else",
                      paymentMethod: payment,
                      amount: doctor?.FeesPerConsultation || doctor?.consultationFee || "5000",
                    });

                    router.push(`/book-appointment/payment?${params.toString()}`);
                  }}
                >
                  Proceed to Payment
                </Button>
                {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
