"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PrescriptionModal } from "@/components/prescription-modal";
import { getAppointmentById, getPatientAppointments } from "@/lib/api/apis";
import { Activity, AlertCircle, ArrowLeft, Calendar, CheckCircle2, Clock, CreditCard, FileText, Loader2, Mail, Phone, Pill, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  medicalHistoryFiles: string[] | null;
  prescriptionFile: string | null;
  clinicId: number | null;
  isClinicAppointment: boolean;
  appointmentType: string | null;
}

export default function AppointmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [appointment, setAppointment] = useState<ApiAppointment | null>(null);
  const [patientAppointments, setPatientAppointments] = useState<ApiAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);

  // Fetch current appointment
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAppointmentById(id);
        setAppointment(data);
      } catch (err) {
        console.error("Failed to fetch appointment:", err);
        setError("Failed to load appointment details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAppointment();
    }
  }, [id]);

  // Fetch patient's appointment history
  useEffect(() => {
    const fetchPatientHistory = async () => {
      if (!appointment?.userId) return;
      
      try {
        setIsLoadingHistory(true);
        const data = await getPatientAppointments(appointment.userId.toString());
        const sortedAppointments = data
          .filter((apt: ApiAppointment) => apt.id !== appointment.id)
          .sort((a: ApiAppointment, b: ApiAppointment) => 
            new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
          );
        setPatientAppointments(sortedAppointments);
      } catch (err) {
        console.error("Failed to fetch patient history:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchPatientHistory();
  }, [appointment?.userId, appointment?.id]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <AlertCircle className="shrink-0 h-4 w-4 text-blue-500" />;
      case "pending":
        return <Clock className="shrink-0 h-4 w-4 text-amber-500" />;
      case "completed":
        return <CheckCircle2 className="shrink-0 h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="shrink-0 h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatType = (type: string | null) => {
    if (!type) return "Consultation";
    switch (type.toLowerCase()) {
      case "inclinic": return "In-Clinic";
      case "online": return "Online";
      case "video": return "Video Call";
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error || !appointment) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <XCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Appointment</h2>
          <p className="text-muted-foreground mb-4">{error || "Appointment not found"}</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="icon" asChild>
            <Link href="/doctor-dashboard/appointments">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-xl lg:text-2xl font-bold">Appointment Details</h2>
          {getStatusBadge(appointment.status)}
        </div>
        <div className="flex gap-2">
          {appointment.status.toLowerCase() !== "cancelled" && (
            <Button onClick={() => setPrescriptionModalOpen(true)} size="sm">
              <Pill className="mr-2 h-4 w-4" />
              Add Prescription
            </Button>
          )}
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        
        {/* LEFT COLUMN - Patient Appointment History */}
        <Card className="xl:max-h-[calc(100vh-140px)] xl:overflow-y-auto">
          <CardHeader className="pb-3 sticky top-0 bg-card z-10 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-primary" />
              Patient History
            </CardTitle>
            <CardDescription>
              {appointment.patientName}
              {patientAppointments.length > 0 && ` • ${patientAppointments.length} previous visits`}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading...</span>
              </div>
            ) : patientAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No previous appointments</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-3">
                  {patientAppointments.map((apt) => {
                    const statusStyles: Record<string, { bg: string; border: string; Icon: typeof CheckCircle2 }> = {
                      completed: { bg: "bg-green-500", border: "border-green-500", Icon: CheckCircle2 },
                      pending: { bg: "bg-amber-500", border: "border-amber-500", Icon: Clock },
                      confirmed: { bg: "bg-blue-500", border: "border-blue-500", Icon: AlertCircle },
                      cancelled: { bg: "bg-red-500", border: "border-red-500", Icon: XCircle },
                    };
                    const style = statusStyles[apt.status.toLowerCase()] || { bg: "bg-gray-500", border: "border-gray-500", Icon: Calendar };
                    
                    return (
                      <div key={apt.id} className="relative pl-10">
                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ${style.bg} flex items-center justify-center`}>
                          <style.Icon className="h-3 w-3 text-white" />
                        </div>
                        <div className={`p-3 rounded-lg border-l-4 ${style.border} bg-muted/30`}>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-semibold text-sm">{formatDate(apt.appointmentDate)}</span>
                            {getStatusBadge(apt.status)}
                          </div>
                          <p className="text-xs text-muted-foreground">{apt.appointmentTime} • {formatType(apt.appointmentType)}</p>
                          {apt.notes && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{apt.notes}</p>}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex gap-2">
                              {apt.prescriptionFile && (
                                <a href={apt.prescriptionFile} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline flex items-center gap-1">
                                  <Pill className="h-3 w-3" /> Rx
                                </a>
                              )}
                            </div>
                            <Link href={`/doctor-dashboard/appointments/${apt.id}`}>
                              <Button variant="ghost" size="sm" className="h-6 text-xs px-2">View →</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* RIGHT COLUMN - Current Appointment Details */}
        <div className="space-y-4">
          {/* Current Appointment Info */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription>Current Appointment</CardDescription>
                  <CardTitle className="text-lg">{formatDate(appointment.appointmentDate)}</CardTitle>
                </div>
                <Badge variant="outline" className={appointment.appointmentType === "inclinic" ? "border-blue-500 text-blue-500" : "border-purple-500 text-purple-500"}>
                  {formatType(appointment.appointmentType)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Patient Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">{appointment.patientName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{appointment.patientName}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{appointment.phoneNumber}</span>
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{appointment.email}</span>
                  </div>
                </div>
              </div>

              {/* Time & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="font-semibold flex items-center gap-1"><Clock className="h-4 w-4" />{appointment.appointmentTime}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(appointment.status)}
                    <span className="font-semibold capitalize">{appointment.status}</span>
                  </div>
                </div>
              </div>

              {/* Issue/Notes */}
              {appointment.notes && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-1">Issue / Reason</p>
                  <p className="text-sm">{appointment.notes}</p>
                </div>
              )}

              {/* Payment */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{appointment.paymentMethod}</span>
                </div>
                {appointment.amount && <span className="font-semibold">Rs. {appointment.amount}</span>}
              </div>

              {/* Files */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Prescription</p>
                  {appointment.prescriptionFile ? (
                    <a href={appointment.prescriptionFile} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline flex items-center gap-1 text-sm">
                      <Pill className="h-4 w-4" /> View
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not added</span>
                  )}
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Medical Files</p>
                  {appointment.medicalHistoryFiles && appointment.medicalHistoryFiles.length > 0 ? (
                    <span className="text-blue-600 flex items-center gap-1 text-sm">
                      <FileText className="h-4 w-4" /> {appointment.medicalHistoryFiles.length} file(s)
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start text-sm h-9" onClick={() => setPrescriptionModalOpen(true)}>
                <Pill className="mr-2 h-4 w-4" />
                {appointment.prescriptionFile ? "Update Rx" : "Add Rx"}
              </Button>
              {appointment.status.toLowerCase() !== "completed" && appointment.status.toLowerCase() !== "cancelled" && (
                <Button variant="outline" className="justify-start text-sm h-9" asChild>
                  <Link href={`/doctor-dashboard/appointments/${appointment.id}/reschedule`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Reschedule
                  </Link>
                </Button>
              )}
              {appointment.status.toLowerCase() === "pending" && (
                <Button className="justify-start text-sm h-9 bg-green-600 hover:bg-green-700 col-span-2">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Prescription Modal */}
      <PrescriptionModal
        patient={{
          name: appointment.patientName,
          email: appointment.email,
          phone: appointment.phoneNumber,
        }}
        appointmentId={appointment.id.toString()}
        open={prescriptionModalOpen}
        onOpenChange={setPrescriptionModalOpen}
        onSuccess={() => {
          const refreshAppointment = async () => {
            try {
              const data = await getAppointmentById(id);
              setAppointment(data);
            } catch (err) {
              console.error("Failed to refresh appointment:", err);
            }
          };
          refreshAppointment();
        }}
      />
    </div>
  );
}
