"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, CalendarClock, Clock, CheckCircle, ChevronLeft, ChevronRight, User, Phone, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/context/AuthContext";
import { getAppointmentsForDoctor } from "@/lib/api/apis";

const getFormattedDate = (d: string | Date | number) => {
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const generateDates = (days = 30) => {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    const ddd = date.toLocaleDateString("en-US", { weekday: "short" });
    dates.push({
      label: `${ddd} ${date.getDate()}`,
      value: getFormattedDate(date),
    });
  }
  return dates;
};

const allDays = generateDates(30);
const today = getFormattedDate(new Date());

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    async function fetchData() {
      const doctorId = user?.doctorId || user?.id;
      if (!doctorId) return;
      setLoading(true);
      try {
        const [appData, patData] = await Promise.all([
          getAppointmentsForDoctor(),
          import('@/lib/api/apis').then(m => m.getPatientsForDoctor())
        ]);
        let arr = Array.isArray(appData) ? appData : (Array.isArray(appData?.upcomingAppointments) ? appData.upcomingAppointments : (Array.isArray(appData?.appointments) ? appData.appointments : []));
        setAppointments(arr);
        setPatients(Array.isArray(patData) ? patData : (patData?.data || []));
      } catch {
        setAppointments([]);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const pendingAppointments = appointments.filter(a => a.status === "pending" || a.status === "Scheduled");
  const completedAppointments = appointments.filter(a => a.status === "completed" || a.status === "Completed");
  const todayAppointments = appointments.filter((a) => {
    if (!a.appointmentDate) return false;
    return getFormattedDate(a.appointmentDate) === today;
  });

  const filteredAppointments = appointments.filter((a) => {
    if (!a.appointmentDate) return false;
    return getFormattedDate(a.appointmentDate) === selectedDate;
  });

  return (
    <div className="flex min-h-[calc(100vh-89.6px)] w-full flex-col h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <main className="flex-1 space-y-6 pb-6 w-full">
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Welcome back, Dr. {user?.name?.split(' ')[0] || "Sarah"}</h2>
          <p className="text-muted-foreground">Here's what's happening with your patients today.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Total Appointments Card */}
          <div className="bg-card rounded-lg overflow-hidden border border-blue-100 dark:border-blue-900/60 shadow-sm">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                    <CalendarClock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium text-slate-600 dark:text-slate-300">Total Appointments</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-slate-800 dark:text-white">
                  {loading ? "..." : (todayAppointments.length || appointments.length)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total consultations</p>
              </div>
              <div className="mt-6">
                <Link href="/doctor-dashboard/appointments">
                  <button className="flex items-center justify-between w-full text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    <span>View Schedule</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Pending Appointments Card */}
          <div className="bg-card rounded-lg overflow-hidden border border-emerald-100 dark:border-emerald-900/60 shadow-sm">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="font-medium text-slate-600 dark:text-slate-300">Pending Appointments</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-slate-800 dark:text-white">
                  {loading ? "..." : pendingAppointments.length}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Awaiting consultation</p>
              </div>
              <div className="mt-6">
                <Link href="/doctor-dashboard/appointments">
                  <button className="flex items-center justify-between w-full text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                    <span>View Pending</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Completed Appointments Card */}
          <div className="bg-card rounded-lg overflow-hidden border border-amber-100 dark:border-amber-900/60 shadow-sm">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="font-medium text-slate-600 dark:text-slate-300">Completed Appointments</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-slate-800 dark:text-white">
                  {loading ? "..." : completedAppointments.length}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Finished consultations</p>
              </div>
              <div className="mt-6">
                <Link href="/doctor-dashboard/appointments">
                  <button className="flex items-center justify-between w-full text-sm text-amber-600 dark:text-amber-400 font-medium hover:underline">
                    <span>View History</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="md:grid max-md:space-y-4 gap-4 md:grid-cols-2 lg:grid-cols-7 w-full h-fit">
          {/* Upcoming Appointments Card */}
          <Card className="col-span-4 shadow-sm border-emerald-100 dark:border-emerald-900/40">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your next pending appointments</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px] overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
              {loading ? (
                <div className="text-center py-10 text-muted-foreground text-sm">Loading...</div>
              ) : pendingAppointments.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">No upcoming appointments.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {pendingAppointments.slice(0, 5).map((a, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center justify-between bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-[18px] px-4 py-3"
                    >
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/50 flex justify-center items-center text-emerald-600 dark:text-emerald-400">
                          {a.profilepicture || a.doctor?.profilePic || a.patient?.profilePic ? (
                            <Image
                              src={a.profilepicture || a.doctor?.profilePic || a.patient?.profilePic}
                              alt={a.patientName || a.name || a.patient?.name || "Profile"}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <User size={20} />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-[14px] md:text-[15px] text-slate-800 dark:text-slate-100">
                            {a.patientName || a.name || a.patient?.name || "Unknown Patient"}
                          </div>
                          <div className="text-[12px] text-slate-500 dark:text-slate-400">
                            {a.specialty || a.appointmentFor || "Consultation"}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start sm:items-end">
                        <span className="text-[12px] text-slate-600 dark:text-slate-300 mb-1 sm:mr-1">
                          {a.appointmentTime || a.time || a.startTime}
                        </span>
                        <span
                          className={`px-3 py-1 text-[11px] rounded-full font-semibold text-center bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400`}
                        >
                          {a.status || "Scheduled"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Patients Card */}
          <Card className="col-span-3 shadow-sm border-purple-100 dark:border-purple-900/40">
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>Patients you recently consulted</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px] overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
              {loading ? (
                <div className="text-center py-10 text-muted-foreground text-sm">Loading...</div>
              ) : patients.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">No recent patients.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {patients.slice(0, 5).map((p, i) => (
                    <div key={i} className="flex items-center justify-between bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-[18px] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-purple-100 dark:bg-purple-900/50 flex justify-center items-center text-purple-600 dark:text-purple-400">
                          {p.profilePic || p.img ? (
                            <Image
                              src={p.profilePic || p.img}
                              alt={p.name || p.patientName || "User"}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <User size={20} />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="font-medium text-[14px] sm:text-[15px] text-slate-800 dark:text-slate-100 truncate max-w-[140px] sm:max-w-[180px]">
                            {p.name || p.patientName || p.fullName || `${p.firstName || ''} ${p.lastName || ''}`.trim() || "Unknown Patient"}
                          </div>
                          <div className="text-[12px] text-slate-500 dark:text-slate-400">
                            {p.time || p.appointmentTime || p.defaultTime || "Recent"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-purple-50 dark:hover:bg-purple-900/50 transition">
                          <Phone size={14} className="text-slate-600 dark:text-slate-300" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-purple-50 dark:hover:bg-purple-900/50 transition">
                          <MessageSquare size={14} className="text-slate-600 dark:text-slate-300" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
        </Card>
      </div>

      <div className="w-full">
        {/* Calendar View Card */}
        <Card className="w-full shadow-sm border-blue-100 dark:border-blue-900/40">
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>Select a date to view your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent className="h-[430px] flex flex-col">
            <div className="flex flex-col h-full space-y-4">
              {/* Horizontal scroll for days */}
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-[38px] w-[38px] rounded-full bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-[#334155] flex-shrink-0" onClick={() => {
                    const currentIndex = allDays.findIndex(d => d.value === selectedDate);
                    if (currentIndex > 0) setSelectedDate(allDays[currentIndex - 1].value);
                }}>
                  <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </Button>

                <div className="flex gap-2.5 overflow-x-auto scrollbar-none py-1 w-full [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
                  {allDays.map((d, i) => (
                    <button
                      key={i}
                      className={`px-5 py-2 rounded-[20px] text-[14px] font-medium whitespace-nowrap transition-colors ${
                        selectedDate === d.value
                          ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1e293b] dark:text-[#9ca3af] dark:hover:bg-[#334155]"
                      }`}
                      onClick={() => setSelectedDate(d.value)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>

                <Button variant="ghost" size="icon" className="h-[38px] w-[38px] rounded-full bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-[#334155] flex-shrink-0" onClick={() => {
                    const currentIndex = allDays.findIndex(d => d.value === selectedDate);
                    if (currentIndex < allDays.length - 1) setSelectedDate(allDays[currentIndex + 1].value);
                }}>
                  <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pb-2 pr-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
                {loading ? (
                  <div className="flex items-center justify-center w-full min-h-[160px] text-slate-500 text-[15px]">Loading appointments...</div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="flex items-center justify-center w-full min-h-[160px] text-slate-600 dark:text-[#9ca3af] text-[15px]">No appointments for this date.</div>
                ) : (
                  <div className="grid gap-3">
                    {filteredAppointments.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-[18px] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900 min-w-[550px]"
                      >
                        <div className="flex items-center gap-4">
                          {a.doctor?.profilePic || a.profilepicture || a.patient?.profilePic ? (
                            <Image
                              src={a.doctor?.profilePic || a.profilepicture || a.patient?.profilePic}
                              alt={a.patientName || a.name || a.patient?.name || "Profile"}
                              width={48}
                              height={48}
                              className="rounded-full h-10 w-10 sm:h-12 sm:w-12 object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                              <User size={24} />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-[15px] sm:text-[16px] text-slate-800 dark:text-slate-100">
                              {a.patientName || a.name || a.patient?.name || "Unknown Patient"}
                            </div>
                            <div className="text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400">
                              {a.specialty || a.appointmentFor || "Consultation"}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="text-[12px] sm:text-[13px] font-medium text-slate-600 dark:text-slate-300">
                            {a.appointmentTime || a.time || a.startTime}
                          </span>
                          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                            {a.status || "Confirmed"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      </main>
    </div>
  );
}
