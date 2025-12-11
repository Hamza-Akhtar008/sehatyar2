"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getPatientAppointments } from "@/lib/api/apis";
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Droplet, 
  FileText, 
  Loader2, 
  Mail, 
  MapPin, 
  Phone, 
  Pill, 
  User, 
  XCircle,
  AlertCircle,
  Activity,
  Download
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Patient type (matches the one from patients page)
interface Patient {
  id: string;
  name: string;
  image: string;
  age: number;
  gender: string;
  status: string;
  lastVisit: string;
  condition: string;
  email: string;
  phone: string;
  bloodGroup: string;
  city: string;
  country: string;
  allergies: string[];
}

// Appointment type from API
interface Appointment {
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
  medicalHistoryFiles: string[] | null;
  prescriptionFile: string | null;
  clinicId: number | null;
  isClinicAppointment: boolean;
  appointmentType: string | null;
}

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load patient data from sessionStorage
  useEffect(() => {
    const storedPatient = sessionStorage.getItem(`patient_${userId}`);
    if (storedPatient) {
      setPatient(JSON.parse(storedPatient));
    }
  }, [userId]);

  // Fetch appointments for this patient
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoadingAppointments(true);
        setError(null);
        const data = await getPatientAppointments(userId);
        // Sort appointments by date (newest first)
        const sortedAppointments = data.sort((a: Appointment, b: Appointment) => 
          new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
        );
        setAppointments(sortedAppointments);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointment history.");
      } finally {
        setIsLoadingAppointments(false);
      }
    };

    if (userId) {
      fetchAppointments();
    }
  }, [userId]);

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case "pending":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Confirmed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get timeline icon and color
  const getTimelineStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return { icon: CheckCircle2, color: "bg-green-500", borderColor: "border-green-500" };
      case "pending":
        return { icon: Clock, color: "bg-amber-500", borderColor: "border-amber-500" };
      case "confirmed":
        return { icon: AlertCircle, color: "bg-blue-500", borderColor: "border-blue-500" };
      case "cancelled":
        return { icon: XCircle, color: "bg-red-500", borderColor: "border-red-500" };
      default:
        return { icon: Calendar, color: "bg-gray-500", borderColor: "border-gray-500" };
    }
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // If no patient data, show loading or error
  if (!patient) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading patient details...</p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Patient Details</h1>
          <p className="text-muted-foreground">View complete patient information and appointment history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center pb-2">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={patient.image} alt={patient.name} />
              <AvatarFallback className="text-2xl">{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{patient.name}</CardTitle>
            <CardDescription>Patient ID: {patient.id}</CardDescription>
            <Badge className={patient.status === "Active" ? "bg-green-500 mt-2" : "bg-gray-500 mt-2"}>
              {patient.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            
            {/* Personal Info */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Age</p>
                  <p className="font-medium">{patient.age} years</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium">{patient.gender}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Blood Group</p>
                  <p className="font-medium flex items-center gap-1">
                    <Droplet className="h-3 w-3 text-red-500" />
                    {patient.bloodGroup}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Visit</p>
                  <p className="font-medium">{patient.lastVisit}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Contact Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{patient.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.city}, {patient.country}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Allergies */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Allergies
              </h4>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.length > 0 ? (
                  patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="outline" className="border-red-300 text-red-600">
                      {allergy}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No known allergies</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Appointment History
            </CardTitle>
            <CardDescription>
              All appointments for this patient ({appointments.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAppointments ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading appointments...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                <XCircle className="h-12 w-12 mx-auto mb-4" />
                <p>{error}</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No appointments found for this patient</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                
                <div className="space-y-6">
                  {appointments.map((appointment) => {
                    const style = getTimelineStyle(appointment.status);
                    const Icon = style.icon;
                    
                    return (
                      <div key={appointment.id} className="relative pl-12">
                        {/* Timeline dot */}
                        <div className={`absolute left-0 top-1 w-8 h-8 rounded-full ${style.color} flex items-center justify-center`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        
                        {/* Appointment card */}
                        <Card className={`border-l-4 ${style.borderColor}`}>
                          <CardContent className="p-4">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                              <div>
                                <p className="font-semibold">{formatDate(appointment.appointmentDate)}</p>
                                <p className="text-sm text-muted-foreground">{appointment.appointmentTime}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(appointment.status)}
                                <Badge variant="outline">
                                  {appointment.appointmentType === "inclinic" ? "In-Clinic" : appointment.appointmentType || "Consultation"}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Issue/Notes */}
                            {appointment.notes && (
                              <div className="mb-3 p-3 bg-muted rounded-lg">
                                <p className="text-sm font-medium flex items-center gap-1 mb-1">
                                  <FileText className="h-3 w-3" />
                                  Issue/Notes:
                                </p>
                                <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                              </div>
                            )}
                            
                            {/* Files */}
                            <div className="flex flex-wrap gap-4 text-sm">
                              {appointment.prescriptionFile && (
                                <a 
                                  href={appointment.prescriptionFile} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-green-600 hover:underline"
                                >
                                  <Pill className="h-4 w-4" />
                                  View Prescription
                                </a>
                              )}
                              {appointment.medicalHistoryFiles && appointment.medicalHistoryFiles.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-blue-600" />
                                  <span className="text-blue-600">{appointment.medicalHistoryFiles.length} Medical File(s)</span>
                                  {appointment.medicalHistoryFiles.map((file, idx) => (
                                    <a 
                                      key={idx}
                                      href={file} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      <Download className="h-4 w-4" />
                                    </a>
                                  ))}
                                </div>
                              )}
                              {appointment.amount && (
                                <span className="text-muted-foreground">
                                  Amount: Rs. {appointment.amount}
                                </span>
                              )}
                            </div>
                            
                            {/* View Details Link */}
                            <div className="mt-3 pt-3 border-t">
                              <Link href={`/doctor-dashboard/appointments/${appointment.id}`}>
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  View Full Details →
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
