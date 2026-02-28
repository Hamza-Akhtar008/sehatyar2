"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, XCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAppointmentsByPatientId } from "@/lib/api/apis";

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
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getBadgeStyles = (status: string) => {
   switch (status) {
    case "Confirmed":
      return "bg-blue-500/10 border-blue-300 text-blue-700 dark:text-blue-400";
    case "In Progress":
      return "bg-amber-500/10 border-amber-300 text-amber-700 dark:text-amber-400";
    case "Completed":
      return "bg-green-500/10 border-green-300 text-green-700 dark:text-green-400";
    case "Cancelled":
      return "bg-red-500/10 border-red-300 text-red-700 dark:text-red-400";
    default:
      return "bg-gray-500/10 border-gray-300 text-gray-700 dark:text-gray-400";
  }
}

export default function CalendarPage() {
  const [view, setView] = useState("day"); // day, week, month
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userStr = localStorage.getItem("user_data") || localStorage.getItem("user");
        if (!userStr) return;

        const user = JSON.parse(userStr);
        if (user && user.id) {
          const data = await getAppointmentsByPatientId(user.id);
          const mappedAppointments = data.map((item: any) => {
              // Ensure consistent date parsing
              let appointmentDate = new Date();
              if (item.appointmentDate) {
                const datePart = item.appointmentDate.split("T")[0];
                appointmentDate = new Date(datePart);
                appointmentDate.setHours(0, 0, 0, 0);
              }
              const status = item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Pending";
            return {
            id: item.id.toString(),
            patient: {
              name: item.patientName || "Unknown",
              image: "/user-2.png", 
            },
            doctor: item.doctor?.user?.fullName || "Unknown Doctor",
            date: appointmentDate,
            time: item.appointmentTime,
            endTime: calculateEndTime(item.appointmentTime, 30), // Assuming 30 mins if not provided
            status: status,
            type: item.appointmentType || "Consultation",
            duration: 30, // Default duration
            department: item.doctor?.primarySpecialization?.[0] || "General",
            style: getBadgeStyles(status),
          }});
          setAppointments(mappedAppointments);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
      if(!startTime) return "";
      // Simple parse assumes "HH:MM AM/PM" format
      let [time, modifier] = startTime.split(' ');
      let [hours, minutes] = time.split(':');
      let h = parseInt(hours);
      let m = parseInt(minutes);

      if (modifier === 'PM' && h < 12) h += 12;
      if (modifier === 'AM' && h === 12) h = 0;
      
      let date = new Date();
      date.setHours(h, m + durationMinutes);
      
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }


  // Function to get appointments for a specific date
  const getAppointmentsForDate = (date: any) => {
    return appointments.filter((appointment) => appointment.date.getDate() === date.getDate() && appointment.date.getMonth() === date.getMonth() && appointment.date.getFullYear() === date.getFullYear());
  };

  // Function to get appointments for a specific week
  const getAppointmentsForWeek = (date: any) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Saturday

    return appointments.filter((appointment) => appointment.date >= startOfWeek && appointment.date <= endOfWeek);
  };

  // Function to get appointments for a specific month
  const getAppointmentsForMonth = (date: any) => {
    return appointments.filter((appointment) => appointment.date.getMonth() === date.getMonth() && appointment.date.getFullYear() === date.getFullYear());
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
                  .filter((appointment) => {
                      // Basic check if timeSlot is within the appointment time range. 
                      // This is a simplification; ideally we'd parse times properly.
                      const slotHour = parseInt(timeSlot.split(':')[0]); // e.g., 08, 09
                      const slotAmPm = timeSlot.split(' ')[1]; // AM/PM
                      const appTime = appointment.time;
                      
                      return appTime.startsWith(timeSlot.split(':')[0]) && appTime.endsWith(slotAmPm);
                  })
                  .map((appointment) => (
                    <div key={appointment.id} className={`p-2 mb-1 rounded-md border ${appointment.style}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={"/placeholder-user.jpg"} alt={appointment.doctor} />
                            <AvatarFallback>{appointment.doctor.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{appointment.doctor}</span>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground/80 max-sm:hidden">
                        <div className="flex justify-between">
                          <span>
                            {appointment.time} - {appointment.endTime}
                          </span>
                          <span>{appointment.type}</span>
                        </div>
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
                    <div key={appointment.id} className={`md:p-2 rounded-md border ${appointment.style}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs md:text-sm truncate mr-2">{appointment.doctor}</span>
                        <span className="text-xs max-md:hidden whitespace-nowrap">{appointment.time}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground/80 max-md:hidden">
                        <div className="truncate">{appointment.type}</div>
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
                        <div key={appointment.id} className={`p-1 border rounded text-xs truncate ${appointment.style}`}>
                          {appointment.time} - {appointment.doctor}
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
          <Link href="/patient-dashboard/appointments">
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
              {/* Doctor filter could be dynamic too, but keeping it simple/mock for now as user didn't ask */}
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {/* We could dynamically populate this list from unique doctors in appointments */}
                </SelectContent>
              </Select>
              {/* <Button href="/patient-dashboard/appointments/add">
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button> */}
            </div>
          </div>

          {view === "day" && renderDayView()}
          {view === "week" && renderWeekView()}
          {view === "month" && renderMonthView()}
        </CardContent>
      </Card>
    </div>
  );
}
