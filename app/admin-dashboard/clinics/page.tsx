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
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data for clinics
const clinics = [
  {
    id: 1,
    name: "Central City Clinic",
    address: "123 Main St, New York, NY",
    contact: "+1 (555) 123-4567",
    email: "contact@centralclinic.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Westside Health Center",
    address: "456 West Ave, Los Angeles, CA",
    contact: "+1 (555) 987-6543",
    email: "info@westsidehealth.com",
    status: "Active",
  },
  {
    id: 3,
    name: "North Hills Medical",
    address: "789 North Blvd, Chicago, IL",
    contact: "+1 (555) 456-7890",
    email: "support@northhills.com",
    status: "Inactive",
  },
];

export default function ClinicsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Clinics</h2>
          <p className="text-muted-foreground">Manage your clinic locations and details.</p>
        </div>
        <Link href="/admin-dashboard/clinics/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Clinic
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Clinics</CardTitle>
              <CardDescription>A list of all registered clinics.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search clinics..."
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
                <TableHead>Address</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clinics.map((clinic) => (
                <TableRow key={clinic.id}>
                  <TableCell className="font-medium">{clinic.name}</TableCell>
                  <TableCell>{clinic.address}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{clinic.contact}</span>
                      <span className="text-muted-foreground text-xs">{clinic.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={clinic.status === "Active" ? "default" : "secondary"}>
                      {clinic.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
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
