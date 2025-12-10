"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { getAppointments, deleteAppointment } from "@/lib/api/apis";

interface Appointment {
  id: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  patientName: string;
  phoneNumber: string;
  email: string | null;
  paymentMethod: string;
  amount: number | null;
  status: string;
  notes: string;
  appointmentDate: string | null;
  appointmentTime: string;
  appointmentFor: string;
  userId: number | null;
  doctorId: number;
  medicalHistoryFiles: any | null;
  prescriptionFile: any | null;
  clinicId: number | null;
  isClinicAppointment: boolean;
  appointmentType: any | null;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Added delete handler
  const handleDelete = async (id: number) => {
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((appointment) => appointment.id !== id));
    } catch (err) {
      console.error("Failed to delete appointment:", err);
      alert("Failed to delete appointment.");
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await getAppointments();
        if (Array.isArray(response)) {
          setAppointments(response);
        } else if (response && Array.isArray(response.data)) {
          setAppointments(response.data);
        } else {
          console.error("Unexpected response format from getAppointments:", response);
          setError("Failed to load appointments: Unexpected data format.");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "default"; // Usually black/dark in shadcn default, or primary
      case "completed":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600 text-black";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">Appointments</h2>
          <p className="text-muted-foreground">Manage your clinic's appointments and schedules.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>All Appointments</CardTitle>
            <CardDescription>View and manage all scheduled appointments.</CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search appointments..."
              className="pl-8 w-full md:w-[250px]"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading appointments...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No appointments found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.patientName || "N/A"}</TableCell>
                    <TableCell>{appointment.phoneNumber}</TableCell>
                    <TableCell>{appointment.email || "N/A"}</TableCell>
                    <TableCell className="capitalize">{appointment.paymentMethod}</TableCell>
                    <TableCell>{appointment.amount ? `$${appointment.amount}` : "N/A"}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={appointment.notes}>
                      {appointment.notes || "N/A"}
                    </TableCell>
                    <TableCell>
                      {appointment.appointmentDate
                        ? new Date(appointment.appointmentDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>{appointment.appointmentTime}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(appointment.status) as string}>
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(appointment.id)}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
