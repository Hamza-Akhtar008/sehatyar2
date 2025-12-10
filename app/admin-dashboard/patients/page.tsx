"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Mail, Phone, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getPatients, deletePatient } from "@/lib/api/apis";

interface Patient {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  clinicId: number | null;
  isActive: boolean;
  role: string;
  gender: string;
  country: string;
  city: string;
}

export default function ReceptionistsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Added delete handler
  const handleDelete = async (id: number) => {
    try {
      await deletePatient(id);
      setPatients((prev) => prev.filter((patient) => patient.id !== id));
    } catch (err) {
      console.error("Failed to delete patient:", err);
      alert("Failed to delete patient.");
    }
  };

  useEffect(() => {
    const fetchPatientsData = async () => {
      try {
        setLoading(true);
        const response = await getPatients();
        if (Array.isArray(response)) {
          setPatients(response);
        } else if (response && Array.isArray(response.data)) {
          setPatients(response.data);
        } else {
          console.error("Unexpected response format from getReceptionist:", response);
          setError("Failed to load receptionists: Unexpected data format.");
        }
      } catch (err) {
        console.error("Error fetching receptionists:", err);
        setError("Failed to load receptionists.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientsData();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Patients</h2>
          <p className="text-muted-foreground">View and manage patients.</p>
        </div>
        <Button onClick={() => window.location.href = "/admin-dashboard/patients/add"}>Add Patient</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Patients</CardTitle>
              <CardDescription>A list of all patients across clinics.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search patients..."
                  className="pl-8 w-[250px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading patients...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : patients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No patients found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {patient.fullName ? patient.fullName.charAt(0).toUpperCase() : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{patient.fullName}</div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{patient.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{patient.phoneNumber}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          patient.isActive ? "default" : "secondary"
                        }
                      >
                        {patient.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(patient.id)}>
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
