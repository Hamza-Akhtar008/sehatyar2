"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getReceptionists, addReceptionist, AddReceptionistPayload } from "@/lib/api/apis";
import { Calendar, Loader2, Mail, MapPin, Phone, Plus, User, UserPlus, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/lib/types";
import { useRouter } from "next/navigation";

interface Receptionist {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  country: string;
  city: string;
  role: string;
  isActive: boolean;
  isOnline: boolean;
  createdAt: string;
  clinicId: number | null;
}

interface DoctorProfileResponse {
  id: number;
  receptionist: Receptionist | null;
}

export default function ReceptionistPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [receptionist, setReceptionist] = useState<Receptionist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<AddReceptionistPayload>({
    fullName: "",
    gender: "male",
    country: "",
    city: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "receptionist",
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Check if user is individual doctor
  useEffect(() => {
    if (user && user.role !== UserRole.INDIVIDUALDOCTOR) {
      router.push("/doctor-dashboard");
    }
  }, [user, router]);

  // Fetch receptionist
  useEffect(() => {
    const fetchReceptionist = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data: DoctorProfileResponse = await getReceptionists();
        // Extract receptionist from the response
        setReceptionist(data?.receptionist || null);
      } catch (err) {
        console.error("Failed to fetch receptionist:", err);
        setError("Failed to load receptionist data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === UserRole.INDIVIDUALDOCTOR) {
      fetchReceptionist();
    }
  }, [user]);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic validation
    if (!formData.fullName.trim()) {
      setFormError("Full name is required");
      return;
    }
    if (!formData.email.trim()) {
      setFormError("Email is required");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setFormError("Phone number is required");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      await addReceptionist(formData);
      
      // Refresh receptionist data
      const data: DoctorProfileResponse = await getReceptionists();
      setReceptionist(data?.receptionist || null);
      
      // Reset form and close dialog
      setFormData({
        fullName: "",
        gender: "male",
        country: "",
        city: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "receptionist",
      });
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error("Failed to add receptionist:", err);
      setFormError(err.response?.data?.message || "Failed to add receptionist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Receptionist</h1>
          <p className="text-muted-foreground">
            {receptionist ? "Manage your receptionist" : "Add a receptionist to help manage your appointments"}
          </p>
        </div>
        
        {/* Only show Add button if no receptionist exists */}
        {!receptionist && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Receptionist
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Add Receptionist
                </DialogTitle>
                <DialogDescription>
                  Enter the details for your receptionist. They will be able to manage appointments on your behalf.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  {formError && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                      {formError}
                    </div>
                  )}
                  
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+92 300 1234567"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value: "male" | "female" | "other") =>
                          setFormData(prev => ({ ...prev, gender: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Min 6 characters"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Country"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Receptionist
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="py-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* No Receptionist State */}
      {!error && !receptionist && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Receptionist Added</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add a receptionist to help manage your appointments, patient bookings, and schedule.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Receptionist
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Receptionist Card */}
      {!error && receptionist && (
        <Card className="max-w-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Your Receptionist
              </CardTitle>
              <Badge className={receptionist.isActive ? "bg-green-500" : "bg-gray-500"}>
                {receptionist.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <CardDescription>
              Managing appointments on your behalf
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Section */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {receptionist.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{receptionist.fullName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="capitalize">{receptionist.gender}</Badge>
                  {receptionist.isOnline && (
                    <Badge className="bg-green-100 text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1 inline-block"></span>
                      Online
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{receptionist.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{receptionist.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {receptionist.city || "N/A"}, {receptionist.country || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{formatDate(receptionist.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> Your receptionist can log in with their email and password to manage 
                appointments, view patient bookings, and help with your schedule.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
