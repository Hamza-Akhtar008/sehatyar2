"use client";

import { createIndividualDoctorProfile } from "@/lib/api/apis";
import { toast } from "sonner";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Upload, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea"; // Keeping for safety if needed

// --- Local Data & Types ---

// Mock Cities
const CITIES = [
  "Abbottabad", "Bahawalpur", "Faisalabad", "Gujranwala", "Hyderabad", 
  "Islamabad", "Karachi", "Lahore", "Multan", "Peshawar", "Quetta", 
  "Rawalpindi", "Sargodha", "Sialkot", "Sukkur"
];

const SPECIALIZATIONS = [
  "Allergy and Immunology", "Anesthesiology", "Cardiology", "Dermatology", 
  "Emergency Medicine", "Endocrinology", "Family Medicine", "Gastroenterology", 
  "General Surgery", "Hematology", "Infectious Disease", "Internal Medicine", 
  "Nephrology", "Neurology", "Obstetrics & Gynecology", "Oncology", 
  "Ophthalmology", "Orthopedic Surgery", "Otolaryngology (ENT)", "Pathology", 
  "Pediatrics", "Physical Medicine & Rehabilitation", "Plastic Surgery", 
  "Psychiatry", "Pulmonology", "Radiology", "Rheumatology", "Urology"
];

const TREATMENTS = [
  "Cupping Therapy", "Acupuncture", "Massage Therapy", "Herbal Treatment", 
  "Physical Therapy", "Homeopathy"
];

const CONDITIONS = [
  "Back Pain", "Headache", "Arthritis", "Depression", "Anxiety", "Diabetes", 
  "Hypertension", "Obesity"
];

export default function AddDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // --- State for User Fields ---
  const [userFields, setUserFields] = useState({
    fullName: "",
    gender: "male",
    country: "Pakistan", // Default as per snippet
    city: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // --- State for Doctor Profile ---
  const [profilePic, setProfilePic] = useState("");
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

  const [doctorData, setDoctorData] = useState({
    title: "",
    yearsOfExperience: "",
    primarySpecializations: [] as string[],
    servicesTreatment: [] as string[],
    conditionsTreatment: [] as string[],
    education: "", // temp input for fallback
    FeesPerConsultation: "",
  });

  // Education list
  const [educationList, setEducationList] = useState<Array<{
    degreeName: string;
    institute: string;
    fieldOfStudy: string;
  }>>([]);

  const [showEducationPopup, setShowEducationPopup] = useState(false);
  const [educationFields, setEducationFields] = useState({
    degreeName: "",
    institute: "",
    fieldOfStudy: ""
  });

  // --- City Autocomplete State ---
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [isCityFocused, setIsCityFocused] = useState(false);
  const [cityFocusedIndex, setCityFocusedIndex] = useState(-1);
  const cityInputRef = useRef<HTMLInputElement>(null);

  // --- Autocomplete Helper State ---
  const [specializationInput, setSpecializationInput] = useState("");
  const [treatmentInput, setTreatmentInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // --- Handlers ---

  const handleCityInputChange = (value: string) => {
    setUserFields(prev => ({ ...prev, city: value }));
    if (!value.trim()) {
      setCitySuggestions([]);
      return;
    }
    const filtered = CITIES.filter(c => c.toLowerCase().includes(value.toLowerCase()));
    setCitySuggestions(filtered);
    setCityFocusedIndex(-1);
  };

  const handleCitySelect = (city: string) => {
    setUserFields(prev => ({ ...prev, city }));
    setCitySuggestions([]);
    setIsCityFocused(false);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePicFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addEducationEntry = () => {
    if (educationFields.degreeName.trim()) {
      setEducationList(prev => [...prev, { ...educationFields }]);
      setEducationFields({ degreeName: "", institute: "", fieldOfStudy: "" });
      setShowEducationPopup(false);
    }
  };

  const removeEducationEntry = (index: number) => {
    setEducationList(prev => prev.filter((_, i) => i !== index));
  };

  const addItem = (field: "primarySpecializations" | "servicesTreatment" | "conditionsTreatment", value: string) => {
    if (value.trim() && !doctorData[field].includes(value)) {
      setDoctorData((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }));
      if (field === "primarySpecializations") setSpecializationInput("");
      if (field === "servicesTreatment") setTreatmentInput("");
      if (field === "conditionsTreatment") setConditionInput("");
      setOpenDropdown(null);
    }
  };

  const removeItem = (field: "primarySpecializations" | "servicesTreatment" | "conditionsTreatment", value: string) => {
    setDoctorData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }));
  };

  const handleRegister = async () => {
    if (userFields.password !== userFields.confirmPassword) {
      setPasswordError("Password and Confirm Password do not match.");
      toast.error("Passwords do not match");
      return;
    }
    setPasswordError(null);

    // Basic validation
    if (
      !userFields.fullName.trim() ||
      !userFields.email.trim() ||
      !userFields.password.trim() ||
      !doctorData.yearsOfExperience.trim()
    ) {
      toast.error("Please fill in all required fields (Name, Email, Password, Experience)");
      return;
    }

    // Prepare Education
    let finalEducation = [...educationList];
    if (finalEducation.length === 0 && doctorData.education.trim()) {
      finalEducation.push({
        degreeName: doctorData.education,
        institute: "",
        fieldOfStudy: "",
      });
    }

    const formDataToSend = new FormData();

    const userData = {
      fullName: userFields.fullName,
      gender: userFields.gender,
      country: userFields.country,
      city: userFields.city,
      email: userFields.email,
      phoneNumber: userFields.phoneNumber,
      password: userFields.password,
       role: "individual_doctor" 
    };
    formDataToSend.append("user", JSON.stringify(userData));

    const doctorProfileData = {
      yearsOfExperience: Number(doctorData.yearsOfExperience),
      FeesPerConsultation: doctorData.FeesPerConsultation || "0",
      Description: "",
      primarySpecialization: doctorData.primarySpecializations,
      servicesTreatementOffered: doctorData.servicesTreatment,
      conditionTreatments: doctorData.conditionsTreatment,
      education: finalEducation,
    };
    formDataToSend.append("doctorProfile", JSON.stringify(doctorProfileData));

    if (profilePicFile) {
      formDataToSend.append("profilePic", profilePicFile);
    }

    setLoading(true);
    try {
      await createIndividualDoctorProfile(formDataToSend);
      toast.success("Doctor registered successfully!");
      router.push("/admin-dashboard/individual-doctors");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin-dashboard/individual-doctors">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">Add Doctor</h1>
          <p className="text-muted-foreground">Register a new doctor in the system.</p>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="professional">Professional Details</TabsTrigger>
        </TabsList>

        {/* --- PERSONAL TAB --- */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic personal details for the doctor.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <Label>Full Name <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="Enter full name" 
                    value={userFields.fullName}
                    onChange={(e) => setUserFields({ ...userFields, fullName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select 
                    value={userFields.gender} 
                    onValueChange={(val) => setUserFields({ ...userFields, gender: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={userFields.country} disabled />
                </div>

                <div className="space-y-2 relative">
                  <Label>City <span className="text-red-500">*</span></Label>
                  <Input
                    ref={cityInputRef}
                    placeholder="Search city..."
                    value={userFields.city}
                    onChange={(e) => handleCityInputChange(e.target.value)}
                    onFocus={() => setIsCityFocused(true)}
                    onBlur={() => setTimeout(() => setIsCityFocused(false), 200)}
                  />
                  {isCityFocused && citySuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-[200px] overflow-y-auto">
                      {citySuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onMouseDown={() => handleCitySelect(suggestion)}
                          className="w-full text-left px-4 py-2 hover:bg-muted text-sm"
                        >
                          <MapPin className="inline w-3 h-3 mr-2" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email <span className="text-red-500">*</span></Label>
                  <Input 
                    type="email" 
                    placeholder="example@gmail.com"
                    value={userFields.email}
                    onChange={(e) => setUserFields({ ...userFields, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone Number <span className="text-red-500">*</span></Label>
                  <Input 
                    type="tel"
                    placeholder="03001234567"
                    value={userFields.phoneNumber}
                    onChange={(e) => setUserFields({ ...userFields, phoneNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password <span className="text-red-500">*</span></Label>
                  <Input 
                    type="password"
                    value={userFields.password}
                    onChange={(e) => setUserFields({ ...userFields, password: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password <span className="text-red-500">*</span></Label>
                  <Input 
                    type="password"
                    value={userFields.confirmPassword}
                    onChange={(e) => setUserFields({ ...userFields, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
              
              {passwordError && (
                <div className="text-red-500 text-sm">{passwordError}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- PROFESSIONAL TAB --- */}
        <TabsContent value="professional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>Profile specific details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Profile Pic */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center relative overflow-hidden bg-muted">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-sm text-muted-foreground">Upload Profile Picture</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <Label>Title <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="Dr." 
                    value={doctorData.title}
                    onChange={(e) => setDoctorData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Years of Experience <span className="text-red-500">*</span></Label>
                  <Input 
                    type="number"
                    placeholder="e.g. 5" 
                    value={doctorData.yearsOfExperience}
                    onChange={(e) => setDoctorData(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                  />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-4">
                  <AutocompleteField
                    label="Primary Specializations"
                    placeholder="Start typing..."
                    inputValue={specializationInput}
                    setInputValue={setSpecializationInput}
                    selectedItems={doctorData.primarySpecializations}
                    allOptions={SPECIALIZATIONS}
                    fieldName="primarySpecializations"
                    dropdownOpen={openDropdown === "specialization"}
                    setDropdownOpen={(open: boolean) => setOpenDropdown(open ? "specialization" : null)}
                    addItem={addItem}
                    removeItem={removeItem}
                  />

                  <AutocompleteField
                    label="Services / Treatments Offered"
                    placeholder="Start typing..."
                    inputValue={treatmentInput}
                    setInputValue={setTreatmentInput}
                    selectedItems={doctorData.servicesTreatment}
                    allOptions={TREATMENTS}
                    fieldName="servicesTreatment"
                    dropdownOpen={openDropdown === "treatment"}
                    setDropdownOpen={(open: boolean) => setOpenDropdown(open ? "treatment" : null)}
                    addItem={addItem}
                    removeItem={removeItem}
                  />

                   <AutocompleteField
                    label="Conditions Treated"
                    placeholder="Start typing..."
                    inputValue={conditionInput}
                    setInputValue={setConditionInput}
                    selectedItems={doctorData.conditionsTreatment}
                    allOptions={CONDITIONS}
                    fieldName="conditionsTreatment"
                    dropdownOpen={openDropdown === "condition"}
                    setDropdownOpen={(open: boolean) => setOpenDropdown(open ? "condition" : null)}
                    addItem={addItem}
                    removeItem={removeItem}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fees per Consultation (PKR)</Label>
                  <Input 
                    type="number"
                    placeholder="1000"
                    value={doctorData.FeesPerConsultation}
                    onChange={(e) => setDoctorData(prev => ({ ...prev, FeesPerConsultation: e.target.value }))}
                  />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Education</Label>
                  <div className="border rounded-md p-4 space-y-3">
                    {educationList.map((edu, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-secondary p-2 rounded">
                        <div className="text-sm">
                          <strong>{edu.degreeName}</strong> — {edu.institute} ({edu.fieldOfStudy})
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeEducationEntry(idx)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2 items-center">
                      <Input 
                        placeholder="Quick add degree... (or click Add Details)"
                        value={doctorData.education}
                        onChange={(e) => setDoctorData(prev => ({ ...prev, education: e.target.value }))}
                      />
                      <Button type="button" onClick={() => setShowEducationPopup(true)}>Add Details</Button>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={handleRegister} disabled={loading}>
          {loading ? "Submitting..." : "Save Doctor"}
        </Button>
      </div>

       {/* Education Modal */}
       {showEducationPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-background rounded-lg p-6 w-full max-w-md shadow-lg border">
            <h3 className="text-lg font-semibold mb-4">Add Education</h3>
            <div className="space-y-4">
               <div>
                  <Label>Degree Name</Label>
                  <Input 
                    value={educationFields.degreeName} 
                    onChange={(e) => setEducationFields(p => ({ ...p, degreeName: e.target.value }))}
                    placeholder="e.g. MBBS"
                  />
               </div>
               <div>
                  <Label>Institute</Label>
                  <Input 
                    value={educationFields.institute} 
                    onChange={(e) => setEducationFields(p => ({ ...p, institute: e.target.value }))}
                    placeholder="e.g. University of Health Sciences"
                  />
               </div>
               <div>
                  <Label>Field of Study</Label>
                  <Input 
                    value={educationFields.fieldOfStudy} 
                    onChange={(e) => setEducationFields(p => ({ ...p, fieldOfStudy: e.target.value }))}
                    placeholder="e.g. Medicine"
                  />
               </div>
               <div className="flex justify-end gap-2 pt-2">
                 <Button variant="outline" onClick={() => setShowEducationPopup(false)}>Cancel</Button>
                 <Button onClick={addEducationEntry}>Add</Button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// --- Reusable Autocomplete Component ---

function AutocompleteField({
  label,
  placeholder,
  inputValue,
  setInputValue,
  selectedItems,
  allOptions,
  fieldName,
  dropdownOpen,
  setDropdownOpen,
  addItem,
  removeItem,
}: {
  label: string;
  placeholder: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  selectedItems: string[];
  allOptions: string[];
  fieldName: "primarySpecializations" | "servicesTreatment" | "conditionsTreatment";
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  addItem: (field: "primarySpecializations" | "servicesTreatment" | "conditionsTreatment", value: string) => void;
  removeItem: (field: "primarySpecializations" | "servicesTreatment" | "conditionsTreatment", value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const filteredOptions = useMemo(() => {
    const unique = Array.from(new Set(allOptions as string[]));
    const lowerInput = inputValue.toLowerCase();
    if (!inputValue) return unique.filter((o) => !selectedItems.includes(o)).slice(0, 8);
    return unique.filter((o) => 
      !selectedItems.includes(o) && o.toLowerCase().includes(lowerInput)
    );
  }, [inputValue, allOptions, selectedItems]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
      setDropdownOpen(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        addItem(fieldName, filteredOptions[highlightedIndex]);
        setHighlightedIndex(-1);
      } else if (inputValue.trim()) {
        addItem(fieldName, inputValue.trim());
      }
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <div className="border rounded-md p-2 min-h-[3rem] flex flex-wrap gap-2 items-center bg-background focus-within:ring-1 focus-within:ring-ring">
          {selectedItems.map((item) => (
             <span key={item} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm">
               {item}
               <button type="button" onClick={() => removeItem(fieldName, item)} className="hover:bg-destructive/20 rounded-full p-0.5">
                 <X className="w-3 h-3" />
               </button>
             </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none text-sm min-w-[120px]"
            placeholder={selectedItems.length === 0 ? placeholder : ""}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setDropdownOpen(true);
              setHighlightedIndex(-1);
            }}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
            onKeyDown={onKeyDown}
          />
        </div>

        {dropdownOpen && filteredOptions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-md z-50 max-h-52 overflow-auto text-popover-foreground">
             {filteredOptions.map((option, idx) => (
                <button
                  key={option}
                  type="button"
                  onMouseDown={(e) => {
                     e.preventDefault(); // Prevent blurring the input field immediately
                     addItem(fieldName, option);
                     setTimeout(() => inputRef.current?.focus(), 0);
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`w-full text-left px-3 py-2 text-sm ${
                    idx === highlightedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                  }`}
                >
                  {option}
                </button>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
