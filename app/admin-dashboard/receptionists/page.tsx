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
import { Search, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for receptionists
const receptionists = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma.wilson@medixpro.com",
    phone: "+1 (555) 123-4567",
    clinic: "Central City Clinic",
    status: "Active",
    avatar: "/avatars/01.png",
    initials: "EW",
  },
  {
    id: 2,
    name: "Liam Thompson",
    email: "liam.thompson@medixpro.com",
    phone: "+1 (555) 987-6543",
    clinic: "Westside Health Center",
    status: "Active",
    avatar: "/avatars/02.png",
    initials: "LT",
  },
  {
    id: 3,
    name: "Olivia Martinez",
    email: "olivia.martinez@medixpro.com",
    phone: "+1 (555) 456-7890",
    clinic: "North Hills Medical",
    status: "On Leave",
    avatar: "/avatars/03.png",
    initials: "OM",
  },
  {
    id: 4,
    name: "Noah Johnson",
    email: "noah.johnson@medixpro.com",
    phone: "+1 (555) 234-5678",
    clinic: "Central City Clinic",
    status: "Active",
    avatar: "/avatars/04.png",
    initials: "NJ",
  },
  {
    id: 5,
    name: "Ava Brown",
    email: "ava.brown@medixpro.com",
    phone: "+1 (555) 876-5432",
    clinic: "Eastside Family Practice",
    status: "Inactive",
    avatar: "/avatars/05.png",
    initials: "AB",
  },
];

export default function ReceptionistsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Receptionists</h2>
          <p className="text-muted-foreground">View and manage receptionist staff.</p>
        </div>
        {/* Admin cannot add receptionist, so no Add button here */}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Receptionists</CardTitle>
              <CardDescription>A list of all receptionists across clinics.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search receptionists..."
                  className="pl-8 w-[250px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Clinic</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receptionists.map((receptionist) => (
                <TableRow key={receptionist.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={receptionist.avatar} alt={receptionist.name} />
                        <AvatarFallback>{receptionist.initials}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{receptionist.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{receptionist.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{receptionist.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{receptionist.clinic}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        receptionist.status === "Active" ? "default" : 
                        receptionist.status === "Inactive" ? "destructive" : "secondary"
                      }
                    >
                      {receptionist.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
