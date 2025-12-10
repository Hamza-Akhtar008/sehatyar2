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
import { Plus, Search, Trash } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEffect,useState } from "react";
import { getClinics, deleteClinic } from "@/lib/api/apis";




export default function ClinicsPage() {

  const [clinics, setClinics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteClinic(id);
      setClinics((prev) => prev.filter((clinic) => clinic.id !== id));
    } catch (err) {
      console.error("Failed to delete clinic:", err);
      alert("Failed to delete clinic.");
    }
  };

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setIsLoading(true);
        const fetchedClinics = await getClinics();
        setClinics(fetchedClinics);
      } catch (err) {
        setError("Failed to fetch clinics.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClinics();
  }, []);

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
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading clinics...
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !error && clinics.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No clinics found.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !error && clinics.map((clinic) => (
                <TableRow key={clinic.id}>
                  <TableCell className="font-medium">{clinic.name}</TableCell>
                  <TableCell>{clinic.phone}</TableCell>
                  <TableCell>{clinic.address}</TableCell>
                  <TableCell>
                    <Badge variant={clinic.isActive ? 'default' : 'secondary'}>
                      {clinic.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(clinic.id)}>
                      <Trash className="h-4 w-4 text-red-500" />
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
  