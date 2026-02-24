"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CalendarDays, FileText, RefreshCw } from "lucide-react"

export function RecentPrescriptions({ appointments = [] }: { appointments?: any[] }) {
  const prescriptions = appointments.slice(0, 5).map((a, i) => {
    const name = a.patientName || a.name || a.patient?.name || "Unknown Patient";
    const avatar = a.profilepicture || a.doctor?.profilePic || a.patient?.profilePic || "/user-2.png";
    const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || "P";
    
    return {
      id: a.id || a._id || i,
      patient: {
        name,
        avatar,
        initials,
      },
      date: a.appointmentTime || a.time || a.startTime || "Today",
      medications: a.prescription ? [a.prescription] : [`Review medication for ${a.specialty || a.appointmentFor || "consultation"}`],
      status: "Active",
    };
  });

  if (prescriptions.length === 0) {
     return <div className="p-8 text-center text-slate-500 text-sm">No recent prescriptions available.</div>;
  }

  return (
    <div className="space-y-4">
      {prescriptions.map((prescription) => (
        <div key={prescription.id} className="rounded-lg border p-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={prescription.patient.avatar || "/user-2.png"} alt={prescription.patient.name} />
                <AvatarFallback>{prescription.patient.initials}</AvatarFallback>
              </Avatar>
              <div className="font-medium">{prescription.patient.name}</div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="mr-1 h-3 w-3" />
              {prescription.date}
            </div>
          </div>
          <div className="mt-2">
            <ul className="list-inside list-disc space-y-1 text-sm">
              {prescription.medications.map((med, index) => (
                <li key={index}>{med}</li>
              ))}
            </ul>
          </div>
          <div className="mt-3 flex justify-end space-x-2">
            <Button size="sm" variant="ghost" href="/prescriptions/1">
              <FileText className="mr-2 h-3 w-3" />
              View
            </Button>
            <Button size="sm" variant="ghost" href="/prescriptions/1/renew">
              <RefreshCw className="mr-2 h-3 w-3" />
              Renew
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
