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
import { getAppointments } from "@/lib/api/apis";

// Time slots for day view
const timeSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

// Days of the week
const shortDaysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const [view, setView] = useState("month"); // Default to month view to see more data
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAppointments();
        console.log("Fetched appointments:", data); // Debug logging
        const appointmentsList = Array.isArray(data) ? data : (data.data || []);
        
        const transformedAppointments = appointmentsList
          .filter((appt: any) => appt.appointmentDate) // Only show appointments with dates
          .map((appt: any) => {
            const date = new Date(appt.appointmentDate);
            let color = "blue";
            const status = appt.status?.toLowerCase() || "pending";
            
            if (status === "completed") color = "green";
            else if (status === "cancelled") color = "red";
            else if (status === "pending") color = "amber";
            
            return {
              id: String(appt.id),
              patient: {
                name: appt.patientName || "Unknown Patient",
                image: "/user-2.png",
              },
              doctor: appt.doctorId ? `Doctor #${appt.doctorId}` : "Unassigned",
              date: date,
              time: appt.appointmentTime || "12:00 PM",
              endTime: appt.appointmentTime || "12:30 PM", // Placeholder
              status: appt.status || "Pending",
              type: appt.appointmentType || "Appointment",
              duration: 30,
              department: "General",
              color: color,
            };
          });
          
        setAppointments(transformedAppointments);
        
        // Auto-navigate to the latest appointment so the user sees data immediately
        if (transformedAppointments.length > 0) {
            const sorted = [...transformedAppointments].sort((a, b) => b.date.getTime() - a.date.getTime());
            setCurrentDate(sorted[0].date);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Helper functions that now rely on the 'appointments' state
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((appointment) => 
      appointment.date.getDate() === date.getDate() && 
      appointment.date.getMonth() === date.getMonth() && 
      appointment.date.getFullYear() === date.getFullYear()
    );
  };

  const getAppointmentsForWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Saturday
    
    // Normalize to start of day for comparison
    const start = new Date(startOfWeek); start.setHours(0,0,0,0);
    const end = new Date(endOfWeek); end.setHours(23,59,59,999);

    return appointments.filter((appointment) => appointment.date >= start && appointment.date <= end);
  };

  const getAppointmentsForMonth = (date: Date) => {
    return appointments.filter((appointment) => 
      appointment.date.getMonth() === date.getMonth() && 
      appointment.date.getFullYear() === date.getFullYear()
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
  const filteredAppointments = getCurrentAppointments().filter((appointment) => selectedDoctor === "all" || String(appointment.doctor).includes(selectedDoctor));

  // Render day view
  const renderDayView = () => {
    const appointmentsForDay = filteredAppointments;

    return (
      <div className="space-y-4">
        {appointmentsForDay.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground">No appointments for this day.</div>
        ) : (
        <div className="grid grid-cols-1 gap-4">
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="flex border rounded-md overflow-hidden">
              <div className="md:w-20 p-1 md:p-2 bg-muted flex items-center justify-center border-r">
                <span className="text-xs md:text-sm font-medium">{timeSlot}</span>
              </div>
              <div className="flex-1 p-1 md:p-2 min-h-[50px]">
                {appointmentsForDay
                  .filter((appointment) => {
                      const slotHour = parseInt(timeSlot.split(":")[0], 10);
                      const apptHour = parseInt(appointment.time?.split(":")[0] || "0", 10);
                      
                      const slotPeriod = timeSlot.split(" ")[1];
                      const apptPeriod = appointment.time?.split(" ")[1]; 
                      
                      if (apptPeriod && slotPeriod) {
                          return apptHour === slotHour && apptPeriod === slotPeriod;
                      }
                      
                      return apptHour === slotHour; 
                  })
                  .map((appointment) => (
                    <div key={appointment.id} className={`p-2 mb-1 rounded-md bg-${appointment.color}-500/10 border border-${appointment.color}-300`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={appointment.patient.image} alt={appointment.patient.name} />
                            <AvatarFallback>{appointment.patient.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{appointment.patient.name}</span>
                        </div>
                        <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                           {appointment.status}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground flex justify-between">
                         <span>{appointment.time}</span>
                         <span>{appointment.doctor}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        )}
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
           const dayAppointments = appointments.filter((appointment) => 
               appointment.date.getDate() === day.getDate() && 
               appointment.date.getMonth() === day.getMonth() && 
               appointment.date.getFullYear() === day.getFullYear()
           );

          return (
            <div key={index} className="border rounded-b-md md:p-2 min-h-[200px] max-h-[400px] overflow-y-auto">
              {dayAppointments.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs md:text-sm text-muted-foreground">
                  <span className="max-md:hidden">No appointments</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {dayAppointments.map((appointment) => (
                    <div key={appointment.id} className={`md:p-2 rounded-md bg-${appointment.color}-500/10 border border-${appointment.color}-300 p-1`}>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-xs md:text-sm truncate">{appointment.patient.name}</span>
                        <span className="text-xs text-muted-foreground">{appointment.time}</span>
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

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

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
                const dayAppointments = appointments.filter((appointment) => 
                    appointment.date.getDate() === day && 
                    appointment.date.getMonth() === month && 
                    appointment.date.getFullYear() === year
                );

                const isToday = date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();

                return (
                  <div key={day} className={`border rounded-md p-0.5 md:p-2 h-24 overflow-y-auto ${isToday ? "border-blue-300" : ""}`}>
                    <div className={`text-right text-xs md:text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>{day}</div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map((appointment) => (
                        <div key={appointment.id} className={`p-1 rounded text-xs bg-${appointment.color}-500/10 dark:border border-neutral-500 truncate`} title={`${appointment.time} - ${appointment.patient.name}`}>
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
          <Link href="/admin-dashboard/appointments">
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
              {/* Doctor filter could be dynamic but leaving static for now or just 'all' */}
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {/* We could populate this from data if we extract doctors */}
                </SelectContent>
              </Select>
              <Button asChild>
                  <Link href="/admin-dashboard/appointments/add">
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Link>
              </Button>
            </div>
          </div>

          {loading ? (
             <div className="py-20 text-center">Loading calendar...</div>
          ) : (
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
