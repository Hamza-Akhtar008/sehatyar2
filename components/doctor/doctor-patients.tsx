"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function DoctorPatients({ appointments = [] }: { appointments?: any[] }) {
  const patients = appointments.map((a, i) => {
    const name = a.patientName || a.name || a.patient?.name || "Unknown Patient";
    const avatar = a.profilepicture || a.doctor?.profilePic || a.patient?.profilePic || "/user-2.png";
    const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || "P";
    
    return {
      id: a.id || a._id || i,
      name,
      avatar,
      initials,
      age: a.patient?.age || a.age || "--",
      gender: a.patient?.gender || a.gender || "Unknown",
      reason: a.specialty || a.appointmentFor || "Consultation",
      status: a.status || (i % 3 === 0 ? "Urgent" : i % 2 === 0 ? "New Patient" : "Regular"), // Fallback variations
    };
  });

  if (patients.length === 0) {
    return <div className="p-8 text-center text-slate-500 text-sm">No patients scheduled for today.</div>;
  }

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <div
          key={patient.id}
          className="flex items-center justify-between gap-4 flex-wrap rounded-lg border p-3 transition-all hover:bg-accent"
        >
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={patient.avatar || "/user-2.png"} alt={patient.name} />
              <AvatarFallback>{patient.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{patient.name}</div>
              <div className="text-sm text-muted-foreground">
                {patient.age} yrs • {patient.gender}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge
              variant={patient.status === "Urgent" ? "default" : "outline"}
              className={
                patient.status === "Urgent" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : ""
              }
            >
              {patient.status}
            </Badge>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                History
              </Button>
              <Button size="sm">Examine</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
