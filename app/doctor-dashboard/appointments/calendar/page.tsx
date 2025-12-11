"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAppointmentsForDoctor } from "@/lib/api/apis";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Plus, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// API Response type
interface ApiAppointment {
  id: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  patientName: string;
  phoneNumber: string;
  email: string;
  paymentMethod: string;
  amount: number | null;
  status: string;
  notes: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentFor: string;
  userId: number;
  doctorId: number;
  medicalHistoryFiles: string[];
  prescriptionFile: string | null;
  clinicId: number | null;
  isClinicAppointment: boolean;
  appointmentType: string | null;
}

// Calendar Appointment type
interface CalendarAppointment {
  id: string;
  patient: {
    name: string;
    image: string;
  };
  doctor: string;
  date: Date;
  time: string;
  endTime: string;
  status: string;
  type: string;
  duration: number;
  department: string;
  color: string;
}

// Get color based on status
const getColorByStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "blue";
    case "in progress":
    case "pending":
      return "amber";
    case "completed":
      return "green";
    case "cancelled":
      return "red";
    default:
      return "gray";
  }
};

// Calculate end time based on start time and duration
const calculateEndTime = (startTime: string, durationMinutes: number = 30): string => {
  const [time, period] = startTime.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  
  let totalMinutes = hours * 60 + minutes + durationMinutes;
  if (period === "PM" && hours !== 12) totalMinutes += 12 * 60;
  if (period === "AM" && hours === 12) totalMinutes -= 12 * 60;
  
  let endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  const endPeriod = endHours >= 12 ? "PM" : "AM";
  
  if (endHours > 12) endHours -= 12;
  if (endHours === 0) endHours = 12;
  
  return `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")} ${endPeriod}`;
};

// Transform API response to Calendar format
const transformAppointment = (apiData: ApiAppointment): CalendarAppointment => {
  const formatStatus = (status: string): string => {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const formatType = (type: string | null): string => {
    if (!type) return "Consultation";
    switch (type.toLowerCase()) {
      case "inclinic":
        return "In-Clinic";
      case "online":
        return "Online";
      case "video":
        return "Video Call";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const status = formatStatus(apiData.status);
  const appointmentDate = new Date(apiData.appointmentDate);
  appointmentDate.setHours(0, 0, 0, 0);

  return {
    id: apiData.id.toString(),
    patient: {
      name: apiData.patientName,
      image: "/user-3.png",
    },
    doctor: "Doctor",
    date: appointmentDate,
    time: apiData.appointmentTime,
    endTime: calculateEndTime(apiData.appointmentTime, 30),
    status: status,
    type: formatType(apiData.appointmentType),
    duration: 30,
    department: "General",
    color: getColorByStatus(status),
  };
};

// Time slots for day view
const timeSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

// Days of the week
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const shortDaysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Function to get days in month
const getDaysInMonth = (year: any, month: any) => {
  return new Date(year, month + 1, 0).getDate();
};

// Function to get first day of month
const getFirstDayOfMonth = (year: any, month: any) => {
  return new Date(year, month, 1).getDay();
};

// Function to get status badge variant
const getStatusBadge = (status: any) => {
  switch (status) {
    case "Confirmed":
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-500">
          Confirmed
        </Badge>
      );
    case "In Progress":
      return <Badge className="bg-amber-500">In Progress</Badge>;
    case "Completed":
      return <Badge className="bg-green-500">Completed</Badge>;
    case "Cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    case "Pending":
      return <Badge className="bg-amber-500">Pending</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export default function CalendarPage() {
  const [view, setView] = useState("day"); // day, week, month
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch appointments on mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAppointmentsForDoctor();
        const transformedData = response.map((apt: ApiAppointment) => transformAppointment(apt));
        setAppointments(transformedData);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointments. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Function to get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(
      (appointment) =>
        appointment.date.getDate() === date.getDate() &&
        appointment.date.getMonth() === date.getMonth() &&
        appointment.date.getFullYear() === date.getFullYear()
    );
  };

  // Function to get appointments for a specific week
  const getAppointmentsForWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return appointments.filter((appointment) => appointment.date >= startOfWeek && appointment.date <= endOfWeek);
  };

  // Function to get appointments for a specific month
  const getAppointmentsForMonth = (date: Date) => {
    return appointments.filter(
      (appointment) =>
        appointment.date.getMonth() === date.getMonth() && appointment.date.getFullYear() === date.getFullYear()
    );
  };

  // Navigate to previous period
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === "day") {
      newDate.setDate(currentDate.getDate() - 1);
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() - 7);
    } else if (view === "month") {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to next period
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === "day") {
      newDate.setDate(currentDate.getDate() + 1);
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() + 7);
    } else if (view === "month") {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Format date range for header
  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };

    if (view === "day") {
      return currentDate.toLocaleDateString("en-US", options);
    } else if (view === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Start from Sunday

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Saturday

      return `${startOfWeek.toLocaleDateString("en-US", options)} - ${endOfWeek.toLocaleDateString("en-US", options)}`;
    } else if (view === "month") {
      return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }
  };

  // Get current appointments based on view
  const getCurrentAppointments = () => {
    if (view === "day") {
      return getAppointmentsForDate(currentDate);
    } else if (view === "week") {
      return getAppointmentsForWeek(currentDate);
    } else if (view === "month") {
      return getAppointmentsForMonth(currentDate);
    }
    return [];
  };

  // Filter appointments by doctor if needed
  const filteredAppointments = getCurrentAppointments().filter((appointment) => selectedDoctor === "all" || appointment.doctor.includes(selectedDoctor));

  // Render day view
  const renderDayView = () => {
    const appointmentsForDay = filteredAppointments;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="flex border rounded-md overflow-hidden">
              <div className="md:w-20 p-1 md:p-2 bg-muted flex items-center justify-center border-r">
                <span className="text-xs md:text-sm font-medium">{timeSlot}</span>
              </div>
              <div className="flex-1 p-1 md:p-2 min-h-[80px]">
                {appointmentsForDay
                  .filter((appointment) => appointment.time.includes(timeSlot.split(":")[0]))
                  .map((appointment) => (
                    <div key={appointment.id} className={`p-2 mb-1 rounded-md bg-${appointment.color}-500/10 border border-${appointment.color}-300`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={appointment.patient.image || "/user-2.png"} alt={appointment.patient.name} />
                            <AvatarFallback>{appointment.patient.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{appointment.patient.name}</span>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground max-sm:hidden">
                        <div className="flex justify-between">
                          <span>
                            {appointment.time} - {appointment.endTime}
                          </span>
                          <span>{appointment.type}</span>
                        </div>
                        <div>{appointment.doctor}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Start from Sunday

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    return (
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {weekDays.map((day, index) => (
          <div key={index} className="text-center p-0.5 md:p-2 bg-muted rounded-t-md">
            <div className="font-medium text-xs md:text-sm">{shortDaysOfWeek[index]}</div>
            <div className="text-xs md:text-sm">{day.getDate()}</div>
          </div>
        ))}

        {/* Appointment cells */}
        {weekDays.map((day, index) => {
          const dayAppointments = filteredAppointments.filter((appointment) => appointment.date.getDate() === day.getDate() && appointment.date.getMonth() === day.getMonth() && appointment.date.getFullYear() === day.getFullYear());

          return (
            <div key={index} className="border rounded-b-md md:p-2 min-h-[200px] max-h-[400px] overflow-y-auto">
              {dayAppointments.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs md:text-sm text-muted-foreground">
                  <XCircle className="h-4 w-4 md:h-6 md:w-6 mr-2 md:hidden" />
                  <span className="max-md:hidden">No appointments</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {dayAppointments.map((appointment) => (
                    <div key={appointment.id} className={`md:p-2 rounded-md bg-${appointment.color}-500/10 border border-${appointment.color}-300`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs md:text-sm">{appointment.patient.name}</span>
                        <span className="text-xs max-md:hidden">{appointment.time}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground max-md:hidden">
                        <div>{appointment.type}</div>
                        <div>{appointment.doctor}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render month view
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    // Create array of day numbers with empty spots for the first week
    const days: (number | null)[] = [...Array.from({ length: firstDayOfMonth }, () => null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

    // Pad with empty spots to make complete weeks
    const totalDays = Math.ceil(days.length / 7) * 7;
    const paddedDays = days.concat(Array.from({ length: totalDays - days.length }, () => null));

    // Split into weeks
    const weeks = [];
    for (let i = 0; i < paddedDays.length; i += 7) {
      weeks.push(paddedDays.slice(i, i + 7));
    }

    return (
      <div className="space-y-2">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2">
          {shortDaysOfWeek.map((day) => (
            <div key={day} className="text-center p-0.5 md:p-2 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="space-y-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map((day, dayIndex) => {
                if (day === null) {
                  return <div key={`empty-${dayIndex}`} className="border rounded-md p-0.5 md:p-2 h-24 bg-muted/20"></div>;
                }

                const date = new Date(year, month, day);
                const dayAppointments = filteredAppointments.filter((appointment) => appointment.date.getDate() === day && appointment.date.getMonth() === month && appointment.date.getFullYear() === year);

                const isToday = date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();

                return (
                  <div key={day} className={`border rounded-md p-0.5 md:p-2 h-24 overflow-y-auto ${isToday ? "border-blue-300" : ""}`}>
                    <div className={`text-right text-xs md:text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>{day}</div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map((appointment) => (
                        <div key={appointment.id} className={`p-1 rounded text-xs bg-${appointment.color}-500/10 dark:border border-neutral-500 truncate`}>
                          {appointment.time} - {appointment.patient.name}
                        </div>
                      ))}
                      {dayAppointments.length > 3 && <div className="text-xs text-center text-muted-foreground">+{dayAppointments.length - 3} more</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4 flex-wrap">
        <Button variant="outline" size="icon" asChild>
          <Link href="/doctor-dashboard/appointments">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">Appointment Calendar</h2>
          <p className="text-muted-foreground">View and manage appointments in calendar view.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          <CardTitle>Calendar</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={goToPrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{formatDateRange()}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <Tabs value={view} onValueChange={setView} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Appointments</SelectItem>
                </SelectContent>
              </Select>
             
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading appointments...</span>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <XCircle className="h-12 w-12 text-red-500 mb-2" />
              <h3 className="text-lg font-semibold text-red-600">Error Loading Appointments</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* Calendar views */}
          {!isLoading && !error && (
            <>
              {view === "day" && renderDayView()}
              {view === "week" && renderWeekView()}
              {view === "month" && renderMonthView()}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
