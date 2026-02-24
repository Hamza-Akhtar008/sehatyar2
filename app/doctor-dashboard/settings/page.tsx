"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  User,
  Stethoscope,
  GraduationCap,
  Plus,
  Trash2,
  Save,
  Pencil,
  Image as ImageIcon
} from "lucide-react"

interface Education {
  institute?: string
  degreeName?: string
  fieldOfStudy?: string
}

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    yearsOfExperience: "",
    FeesPerConsultation: "",
    Description: "",
    primarySpecialization: "",
    profilePic: "",
  })
  
  const [education, setEducation] = useState<Education[]>([])
  const [servicesTreatementOffered, setServicesTreatementOffered] = useState<string[]>([])
  const [conditionTreatments, setConditionTreatments] = useState<string[]>([])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [doctorId, setDoctorId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user_data")
    if (!stored) return
    
    try {
      const parsed = JSON.parse(stored)
      const docId = parsed.doctorId
      const uId = parsed.id
      setUserId(uId?.toString())
      setDoctorId(docId?.toString())
      
      if (docId) {
        fetchProfile(docId)
      }
    } catch (err) {
      console.error("Error parsing user data:", err)
    }
  }, [])

  const fetchProfile = async (docId: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}doctor-profile/${docId}`, { 
        cache: "no-store" 
      })
      if (!res.ok) throw new Error("Failed to load profile")
      
      const data = await res.json()
      
      setFormData({
        fullName: data.user?.fullName || "",
        yearsOfExperience: data.yearsOfExperience || "",
        FeesPerConsultation: data.FeesPerConsultation || "",
        Description: data.Description || "",
        primarySpecialization: Array.isArray(data.primarySpecialization) 
          ? data.primarySpecialization.join(", ") 
          : "",
        profilePic: data.profilePic || "",
      })
      
      setServicesTreatementOffered(data.servicesTreatementOffered || [])
      setConditionTreatments(data.conditionTreatments || [])
      setEducation(data.education || [])
    } catch (e: any) {
      setError(e.message || "Error loading profile")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    setEducation((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const addEducation = () => {
    setEducation((prev) => [...prev, { institute: "", degreeName: "", fieldOfStudy: "" }])
  }

  const removeEducation = (index: number) => {
    setEducation((prev) => prev.filter((_, i) => i !== index))
  }

  const addService = () => {
    setServicesTreatementOffered((prev) => [...prev, ""])
  }

  const removeService = (index: number) => {
    setServicesTreatementOffered((prev) => prev.filter((_, i) => i !== index))
  }

  const handleServiceChange = (index: number, value: string) => {
    setServicesTreatementOffered((prev) => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  const addCondition = () => {
    setConditionTreatments((prev) => [...prev, ""])
  }

  const removeCondition = (index: number) => {
    setConditionTreatments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleConditionChange = (index: number, value: string) => {
    setConditionTreatments((prev) => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  const handleEdit = () => setEditMode(true)
  
  const handleCancelEdit = () => {
    setEditMode(false)
    if (doctorId) {
      fetchProfile(doctorId)
    }
  }

  const handleSaveChanges = async () => {
    if (!userId || !doctorId) return
    setSaving(true)
    setError(null)
    
    try {
      // Update user profile (fullName)
      const userPayload = {
        fullName: formData.fullName,
      }
      
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      })
      
      if (!userRes.ok) throw new Error("Failed to update user profile")
      
      // Update doctor profile
      const doctorPayload = {
        yearsOfExperience: formData.yearsOfExperience,
        FeesPerConsultation: formData.FeesPerConsultation ? Number(formData.FeesPerConsultation) : null,
        Description: formData.Description || null,
        profilePic: formData.profilePic || "",
        primarySpecialization: formData.primarySpecialization
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        servicesTreatementOffered: servicesTreatementOffered.filter(Boolean),
        conditionTreatments: conditionTreatments.filter(Boolean),
        education: education.filter(
          (e) => e.institute || e.degreeName || e.fieldOfStudy
        ),
      }
      
      const doctorRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}doctor-profile/${doctorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorPayload),
      })
      
      if (!doctorRes.ok) throw new Error("Failed to update doctor profile")
      
      setEditMode(false)
      toast.success("Profile updated successfully!")
    } catch (err: any) {
      setError(err.message || "Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground font-medium">Loading profile settings...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Doctor Profile Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your professional information and public profile</p>
        </div>
        <div className="flex gap-2">
          {!editMode ? (
            <Button onClick={handleEdit} className="min-w-[120px]">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button onClick={handleCancelEdit} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSaveChanges} disabled={saving} className="min-w-[140px]">
                {saving ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium border border-destructive/20">
          {error}
        </div>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="specialization">Specialization</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>Update your personal and professional identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex flex-col sm:flex-row gap-6 items-start">
               <div className="relative group shrink-0">
                  <div className="w-28 h-28 rounded-xl bg-muted overflow-hidden flex items-center justify-center border-2 border-border transition-all duration-300 relative">
                    {formData.profilePic ? (
                      <img
                        src={formData.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 opacity-50 mb-1" />
                        <span className="text-[10px] font-medium uppercase tracking-wider opacity-60">No Image</span>
                      </div>
                    )}
                    
                    {editMode && (
                        <div 
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                          onClick={() => {
                            const input = document.createElement("input")
                            input.type = "file"
                            input.accept = "image/*"
                            input.onchange = (e: any) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  setFormData((prev) => ({ ...prev, profilePic: reader.result as string }))
                                }
                                reader.readAsDataURL(file)
                              }
                            }
                            input.click()
                          }}
                        >
                          <span className="text-white text-xs font-medium">Change Photo</span>
                        </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 w-full space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        name="fullName"
                        value={formData.fullName} 
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="e.g. Dr. John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                      <Input 
                        id="yearsOfExperience" 
                        name="yearsOfExperience"
                        type="number" 
                        value={formData.yearsOfExperience} 
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="e.g. 10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="FeesPerConsultation">Fees Per Consultation ($)</Label>
                      <Input 
                        id="FeesPerConsultation" 
                        name="FeesPerConsultation"
                        type="number" 
                        value={formData.FeesPerConsultation} 
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="e.g. 150"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="Description">About Me / Biography</Label>
                <Textarea
                  id="Description"
                  name="Description"
                  className="min-h-[120px]"
                  value={formData.Description}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="Describe your medical expertise, approach to patient care, and any notable achievements..."
                />
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Specialization Tab */}
        <TabsContent value="specialization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="mr-2 h-5 w-5" />
                Medical Specialization
              </CardTitle>
              <CardDescription>Define your specialties and healthcare services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="primarySpecialization">Primary Specializations <span className="text-muted-foreground font-normal">(Comma separated)</span></Label>
                <Input 
                  id="primarySpecialization" 
                  name="primarySpecialization"
                  value={formData.primarySpecialization} 
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="e.g. Cardiology, Internal Medicine"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Services Offered</Label>
                  {editMode && (
                    <Button type="button" onClick={addService} size="sm" variant="outline" className="h-8">
                      <Plus className="mr-2 h-4 w-4" /> Add Service
                    </Button>
                  )}
                </div>
                
                {servicesTreatementOffered.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-md border border-dashed">No services specifically added.</div>
                ) : (
                  <div className="grid gap-3">
                    {servicesTreatementOffered.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder="e.g., Echocardiography"
                          value={service}
                          onChange={(e) => handleServiceChange(index, e.target.value)}
                          disabled={!editMode}
                        />
                        {editMode && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeService(index)}
                            className="text-destructive shrink-0 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Conditions Treated</Label>
                  {editMode && (
                    <Button type="button" onClick={addCondition} size="sm" variant="outline" className="h-8">
                      <Plus className="mr-2 h-4 w-4" /> Add Condition
                    </Button>
                  )}
                </div>
                
                {conditionTreatments.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-md border border-dashed">No conditions specifically added.</div>
                ) : (
                  <div className="grid gap-3">
                    {conditionTreatments.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder="e.g., Hypertension"
                          value={condition}
                          onChange={(e) => handleConditionChange(index, e.target.value)}
                          disabled={!editMode}
                        />
                        {editMode && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeCondition(index)}
                            className="text-destructive shrink-0 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b mb-6">
              <div className="space-y-1">
                <CardTitle className="flex items-center text-xl font-bold">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Education & Training
                </CardTitle>
                <CardDescription>Manage your academic qualifications</CardDescription>
              </div>
              {editMode && (
                <Button onClick={addEducation} size="sm" variant="outline" className="font-medium">
                  <Plus className="mr-2 h-4 w-4" /> Add Degree
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-8">
              {education.length === 0 ? (
                 <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
                   No education records added yet.
                 </div>
              ) : education.map((item, index) => (
                <div key={index} className="space-y-4 relative group p-4 border rounded-lg bg-card">
                  {editMode && (
                    <div className="absolute right-2 top-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 h-8 font-medium"
                        onClick={() => removeEducation(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                  )}
                  <div className="grid gap-4 md:grid-cols-3 mt-4">
                    <div className="space-y-2">
                      <Label>Degree / Certification</Label>
                      <Input 
                        value={item.degreeName || ""} 
                        onChange={(e) => handleEducationChange(index, "degreeName", e.target.value)}
                        disabled={!editMode} 
                        placeholder="e.g. MBBS" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Field of Study</Label>
                      <Input 
                        value={item.fieldOfStudy || ""} 
                        onChange={(e) => handleEducationChange(index, "fieldOfStudy", e.target.value)}
                        disabled={!editMode} 
                        placeholder="e.g. Medicine" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input 
                        value={item.institute || ""} 
                        onChange={(e) => handleEducationChange(index, "institute", e.target.value)}
                        disabled={!editMode} 
                        placeholder="e.g. Harvard Univ." 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
