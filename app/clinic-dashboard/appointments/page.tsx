"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Check, Clock, Download, Filter, MoreHorizontal, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
type Appointment = {
  id: string;
  patient: {
    name: string;
    image: string;
  };
  doctor: string;
  date: string;
  time: string;
  status: string;
  type: string;
  duration: string;
  department: string;
};
// Get unique values for filter options
function getUniqueValues<T>(data: T[], key: keyof T | string): string[] {
  const keyStr = String(key); // Ensure key is treated as a string

  return [
    ...new Set(
      data.map((item) => {
        if (keyStr.includes(".")) {
          const [parent, child] = keyStr.split(".");
          return (item as any)[parent]?.[child];
        }
        return (item as any)[keyStr];
      })
    ),
  ];
}

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [filters, setFilters] = useState<any>({
    status: [],
    type: [],
    doctor: [],
    department: [],
    duration: [],
  });
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    phoneNumber: "",
    email: "",
    paymentMethod: "cash",
    amount: 0,
    notes: "",
    appointmentDate: new Date().toISOString().split("T")[0],
    appointmentTime: "10:00",
    appointmentFor: "myself",
    doctorId: 0,
    userId: 0, // In reality, fetch from context, but exposing as requested
    prescriptionFile: "",
    appointmentType: "Check-up",
    status: "Confirmed"
  });

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}appointments/by/clinic`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped = data.map((item: any) => ({
             id: item.id?.toString(),
             patient: {
                name: item.patientName || item.patient?.user?.fullName || "Unknown",
                image: item.patient?.profilePic || "/user-2.png"
             },
             doctor: item.doctor?.user?.fullName ? `Dr. ${item.doctor.user.fullName}` : "Unknown Doctor",
             date: item.appointmentDate ? item.appointmentDate.split("T")[0] : new Date().toISOString().split("T")[0],
             time: item.appointmentTime || "10:00 AM",
             status: item.status || "Pending",
             type: item.appointmentType || "Visit",
             duration: "30 min",
             department: item.doctor?.primarySpecialization?.[0] || "General"
          }));
          setAppointments(mapped);
          setFilteredAppointments(mapped);
        }
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };

  const [doctors, setDoctors] = useState<any[]>([]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}doctor-profile/by/clinic`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDoctors(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      
      const payload = {
        patientName: formData.patientName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        paymentMethod: formData.paymentMethod,
        amount: formData.amount.toString(),
        notes: formData.notes,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        appointmentFor: formData.appointmentFor,
        doctorId: Number(formData.doctorId) || 0,
      };
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}appointments/by/clinic`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
         toast.success("Appointment successfully created!");
         setFormData({
           patientName: "",
           phoneNumber: "",
           email: "",
           paymentMethod: "cash",
           amount: 0,
           notes: "",
           appointmentDate: new Date().toISOString().split("T")[0],
           appointmentTime: "10:00",
           appointmentFor: "myself",
           doctorId: 0,
           userId: 0,
           prescriptionFile: "",
           appointmentType: "Check-up",
           status: "Confirmed"
         });
         setIsAddOpen(false);
         fetchAppointments(); 
      } else {
         const errData = await res.json();
         toast.error(errData.message || "Failed to create appointment.");
      }
    } catch(err) {
      toast.error("Error creating appointment. Please check your network.");
    }
  };

  // Get unique values for filter options dynamically off fetched data
  const statusOptions = getUniqueValues(appointments, "status");
  const typeOptions = getUniqueValues(appointments, "type");
  const doctorOptions = getUniqueValues(appointments, "doctor");
  const departmentOptions = getUniqueValues(appointments, "department");
  const durationOptions = getUniqueValues(appointments, "duration");

  // Apply filters and search
  useEffect(() => {
    let result = [...appointments];

    // Apply tab filter first
    if (activeTab === "upcoming") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      result = result.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate > today && appointment.status !== "Cancelled";
      });
    } else if (activeTab === "today") {
      const today = new Date().toISOString().split("T")[0];
      result = result.filter((appointment) => appointment.date === today);
    } else if (activeTab === "completed") {
      result = result.filter((appointment) => appointment.status === "Completed");
    } else if (activeTab === "cancelled") {
      result = result.filter((appointment) => appointment.status === "Cancelled");
    }

    // Apply search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter((appointment) => appointment.patient.name.toLowerCase().includes(search) || appointment.doctor.toLowerCase().includes(search) || appointment.type.toLowerCase().includes(search) || appointment.department.toLowerCase().includes(search));
    }

    // Apply filters
    let hasActiveFilters = false;

    if (filters.status.length > 0) {
      result = result.filter((appointment) => filters.status.includes(appointment.status));
      hasActiveFilters = true;
    }

    if (filters.type.length > 0) {
      result = result.filter((appointment) => filters.type.includes(appointment.type));
      hasActiveFilters = true;
    }

    if (filters.doctor.length > 0) {
      result = result.filter((appointment) => filters.doctor.includes(appointment.doctor));
      hasActiveFilters = true;
    }

    if (filters.department.length > 0) {
      result = result.filter((appointment) => filters.department.includes(appointment.department));
      hasActiveFilters = true;
    }

    if (filters.duration.length > 0) {
      result = result.filter((appointment) => filters.duration.includes(appointment.duration));
      hasActiveFilters = true;
    }

    setIsFiltersApplied(hasActiveFilters);
    setFilteredAppointments(result);
  }, [activeTab, searchTerm, filters]);

  // Handle filter changes
  const handleFilterChange = (filterType: any, value: any) => {
    setFilters((prev: any) => {
      const newFilters = { ...prev };

      if (newFilters[filterType].includes(value)) {
        // Remove the value if it's already selected
        newFilters[filterType] = newFilters[filterType].filter((item: any) => item !== value);
      } else {
        // Add the value if it's not selected
        newFilters[filterType] = [...newFilters[filterType], value];
      }

      return newFilters;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: [],
      type: [],
      doctor: [],
      department: [],
      duration: [],
    });
    setSearchTerm("");
  };

  // Get badge variant based on status
  const getBadgeVariant = (status: any) => {
    switch (status) {
      case "Confirmed":
        return { variant: "outline", className: "border-blue-500 text-blue-500" };
      case "In Progress":
        return { variant: "default", className: "bg-amber-500" };
      case "Completed":
        return { variant: "success", className: "bg-green-500" };
      case "Cancelled":
        return { variant: "destructive", className: "bg-red-500" };
      default:
        return { variant: "outline", className: "" };
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">Appointments</h2>
            <p className="text-muted-foreground">Manage your clinic's appointments and schedules.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/clinic-dashboard/appointments/calendar">
                <Calendar className="mr-2 h-4 w-4" />
                Calendar View
              </Link>
            </Button>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Appointment</DialogTitle>
                  <DialogDescription>Quickly add an appointment using the required payload.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddAppointment} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Patient Name</Label>
                      <Input required value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input required value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} placeholder="+1234567890" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Input value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} placeholder="cash" />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" required value={formData.appointmentDate} onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input type="time" required value={formData.appointmentTime} onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Input value={formData.appointmentType} onChange={(e) => setFormData({...formData, appointmentType: e.target.value})} placeholder="Check-up" />
                    </div>
                    <div className="space-y-2">
                      <Label>Doctor</Label>
                      <Select 
                        value={formData.doctorId ? formData.doctorId.toString() : ""} 
                        onValueChange={(val) => setFormData({...formData, doctorId: Number(val)})}
                      >
                         <SelectTrigger>
                           <SelectValue placeholder="Select Doctor" />
                         </SelectTrigger>
                         <SelectContent>
                           {doctors.map((doc: any) => (
                             <SelectItem key={doc.id} value={doc.id?.toString()}>
                               {doc.user?.fullName ? `Dr. ${doc.user?.fullName}` : `Doctor #${doc.id}`}
                             </SelectItem>
                           ))}
                         </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Add notes here..." />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                    <Button type="submit">Create Appointment</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Appointments</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          {/* Tab content - shared structure for all tabs */}
          {["all", "upcoming", "today", "completed", "cancelled"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue}>
              <Card>
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="mb-3">
                      {tabValue === "all" && "All Appointments"}
                      {tabValue === "upcoming" && "Upcoming Appointments"}
                      {tabValue === "today" && "Today's Appointments"}
                      {tabValue === "completed" && "Completed Appointments"}
                      {tabValue === "cancelled" && "Cancelled Appointments"}
                    </CardTitle>
                    <CardDescription>
                      {tabValue === "all" && "View and manage all scheduled appointments."}
                      {tabValue === "upcoming" && "View and manage future scheduled appointments."}
                      {tabValue === "today" && "View and manage appointments scheduled for today."}
                      {tabValue === "completed" && "View all completed appointments."}
                      {tabValue === "cancelled" && "View all cancelled appointments."}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="search" placeholder="Search appointments..." className="pl-8 w-full md:w-[250px]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                      {searchTerm && (
                        <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setSearchTerm("")}>
                          <X className="h-4 w-4" />
                          <span className="sr-only">Clear search</span>
                        </Button>
                      )}
                    </div>

                    {/* Filter dropdown */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={isFiltersApplied ? "default" : "outline"} size="icon" className={isFiltersApplied ? "bg-primary text-primary-foreground" : ""}>
                          <Filter className="h-4 w-4" />
                          <span className="sr-only">Filter</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="end">
                        <div className="p-4 border-b">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Filters</h4>
                            <Button variant="ghost" size="sm" onClick={clearFilters} disabled={!isFiltersApplied && !searchTerm}>
                              Reset
                            </Button>
                          </div>
                        </div>
                        <ScrollArea className="h-[300px]">
                          <div className="p-4 space-y-4">
                            {/* Status filter */}
                            <div>
                              <h5 className="font-medium mb-2">Status</h5>
                              <div className="space-y-2">
                                {statusOptions.map((status: any) => (
                                  <div key={status} className="flex items-center space-x-2">
                                    <Checkbox id={`status-${status}`} checked={filters.status.includes(status)} onCheckedChange={() => handleFilterChange("status", status)} />
                                    <Label htmlFor={`status-${status}`} className="flex items-center">
                                      <Badge variant={getBadgeVariant(status).variant as any} className={`${getBadgeVariant(status).className} mr-2`}>
                                        {status}
                                      </Badge>
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Type filter */}
                            <div>
                              <h5 className="font-medium mb-2">Appointment Type</h5>
                              <div className="space-y-2">
                                {typeOptions.map((type: any) => (
                                  <div key={type} className="flex items-center space-x-2">
                                    <Checkbox id={`type-${type}`} checked={filters.type.includes(type)} onCheckedChange={() => handleFilterChange("type", type)} />
                                    <Label htmlFor={`type-${type}`}>{type}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Doctor filter */}
                            <div>
                              <h5 className="font-medium mb-2">Doctor</h5>
                              <div className="space-y-2">
                                {doctorOptions.map((doctor) => (
                                  <div key={doctor} className="flex items-center space-x-2">
                                    <Checkbox id={`doctor-${doctor}`} checked={filters.doctor.includes(doctor)} onCheckedChange={() => handleFilterChange("doctor", doctor)} />
                                    <Label htmlFor={`doctor-${doctor}`}>{doctor}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Department filter */}
                            <div>
                              <h5 className="font-medium mb-2">Department</h5>
                              <div className="space-y-2">
                                {departmentOptions.map((department: any) => (
                                  <div key={department} className="flex items-center space-x-2">
                                    <Checkbox id={`department-${department}`} checked={filters.department.includes(department)} onCheckedChange={() => handleFilterChange("department", department)} />
                                    <Label htmlFor={`department-${department}`}>{department}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Duration filter */}
                            <div>
                              <h5 className="font-medium mb-2">Duration</h5>
                              <div className="space-y-2">
                                {durationOptions.map((duration: any) => (
                                  <div key={duration} className="flex items-center space-x-2">
                                    <Checkbox id={`duration-${duration}`} checked={filters.duration.includes(duration)} onCheckedChange={() => handleFilterChange("duration", duration)} />
                                    <Label htmlFor={`duration-${duration}`}>{duration}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>

                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table className="whitespace-nowrap">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead className="table-cell">Doctor</TableHead>
                        <TableHead>{tabValue === "today" ? "Time" : "Date & Time"}</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="table-cell">Type</TableHead>
                        <TableHead className="table-cell">Duration</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="whitespace-nowrap">
                      {filteredAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={appointment.patient.image || "/user-2.png"} alt={appointment.patient.name} />
                                <AvatarFallback>{appointment.patient.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{appointment.patient.name}</p>
                                <p className="text-sm text-muted-foreground md:hidden">{appointment.doctor}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="table-cell">{appointment.doctor}</TableCell>
                          <TableCell>
                            <div>
                              {tabValue !== "today" && <p>{appointment.date}</p>}
                              <p className={`text-sm ${tabValue === "today" ? "" : "text-muted-foreground"}`}>{appointment.time}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getBadgeVariant(appointment.status).variant as any} className={getBadgeVariant(appointment.status).className}>
                              {appointment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="table-cell">{appointment.type}</TableCell>
                          <TableCell className="table-cell">{appointment.duration}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link href={`/appointments/${appointment.id}`}>View details</Link>
                                </DropdownMenuItem>

                                {appointment.status !== "Completed" && appointment.status !== "Cancelled" && (
                                  <>
                                    <DropdownMenuItem asChild>
                                      <Link href={`/appointments/${appointment.id}/edit`}>Edit appointment</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href={`/appointments/${appointment.id}/reschedule`}>Reschedule</Link>
                                    </DropdownMenuItem>
                                  </>
                                )}

                                {appointment.status === "Confirmed" && (
                                  <DropdownMenuItem>
                                    <Check className="mr-2 h-4 w-4" /> Mark as in progress
                                  </DropdownMenuItem>
                                )}

                                {appointment.status === "In Progress" && (
                                  <DropdownMenuItem>
                                    <Check className="mr-2 h-4 w-4" /> Mark as completed
                                  </DropdownMenuItem>
                                )}

                                {appointment.status === "Completed" && (
                                  <>
                                    <DropdownMenuItem>View medical record</DropdownMenuItem>
                                    <DropdownMenuItem>Create follow-up</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Generate invoice</DropdownMenuItem>
                                  </>
                                )}

                                {appointment.status === "Cancelled" && (
                                  <DropdownMenuItem asChild>
                                    <Link href={`/appointments/${appointment.id}/reschedule`}>Reschedule appointment</Link>
                                  </DropdownMenuItem>
                                )}

                                {appointment.status !== "Cancelled" && appointment.status !== "Completed" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setCancelDialogOpen(true)} className="text-red-600">
                                      Cancel appointment
                                    </DropdownMenuItem>
                                  </>
                                )}

                                {appointment.status === "Cancelled" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">Delete permanently</DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Empty state */}
                  {filteredAppointments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      {searchTerm || isFiltersApplied ? (
                        <>
                          <Filter className="h-12 w-12 text-muted-foreground mb-2" />
                          <h3 className="text-lg font-semibold">No matching appointments</h3>
                          <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
                          <Button variant="outline" className="mt-4" onClick={clearFilters}>
                            Clear all filters
                          </Button>
                        </>
                      ) : (
                        <>
                          {tabValue === "all" && (
                            <>
                              <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
                              <h3 className="text-lg font-semibold">No appointments</h3>
                              <p className="text-muted-foreground">There are no appointments to display.</p>
                            </>
                          )}
                          {tabValue === "upcoming" && (
                            <>
                              <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
                              <h3 className="text-lg font-semibold">No upcoming appointments</h3>
                              <p className="text-muted-foreground">There are no upcoming appointments scheduled.</p>
                            </>
                          )}
                          {tabValue === "today" && (
                            <>
                              <Clock className="h-12 w-12 text-muted-foreground mb-2" />
                              <h3 className="text-lg font-semibold">No appointments today</h3>
                              <p className="text-muted-foreground">There are no appointments scheduled for today.</p>
                            </>
                          )}
                          {tabValue === "completed" && (
                            <>
                              <Check className="h-12 w-12 text-muted-foreground mb-2" />
                              <h3 className="text-lg font-semibold">No completed appointments</h3>
                              <p className="text-muted-foreground">There are no completed appointments to display.</p>
                            </>
                          )}
                          {tabValue === "cancelled" && (
                            <>
                              <X className="h-12 w-12 text-muted-foreground mb-2" />
                              <h3 className="text-lg font-semibold">No cancelled appointments</h3>
                              <p className="text-muted-foreground">There are no cancelled appointments to display.</p>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to cancel this appointment?</AlertDialogTitle>
            <AlertDialogDescription>This action is irreversible. If you cancel the appointment, the patient will be notified and the appointment will be deleted.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setCancelDialogOpen(false)} className="bg-red-500 text-neutral-50 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
