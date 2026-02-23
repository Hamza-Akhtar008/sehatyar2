"use client"
import { registerDoctor } from "@/lib/Api/Auth/api";
import { toast, Toaster } from "react-hot-toast";
import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useLocation } from "@/src/contexts/LocationContext";
import { MapPin } from "lucide-react";

const PRIMARY = "#ff8331"
const GENDER_BG = "#4e148c"
const GENDER_ACTIVE = "#ff8331"
const BORDER = "#BDBDBD"

// Extracted outside RegisterPage so React keeps a stable reference and doesn't
// unmount/remount on every parent re-render (which was destroying the input ref
// and causing focus loss after selecting a dropdown item).
const AutocompleteField = ({
  label,
  placeholder,
  inputValue,
  setInputValue,
  selectedItems,
  allOptions,
  fieldName,
  dropdownOpen,
  setDropdownOpen,
  onAddItem,
  onRemoveItem,
}: {
  label: string
  placeholder: string
  inputValue: string
  setInputValue: (value: string) => void
  selectedItems: string[]
  allOptions: string[]
  fieldName: "primarySpecializations" | "servicesTreatment" | "conditionsTreatment"
  dropdownOpen: boolean
  setDropdownOpen: (open: boolean) => void
  onAddItem: (field: "primarySpecializations" | "servicesTreatment" | "conditionsTreatment", value: string) => void
  onRemoveItem: (field: "primarySpecializations" | "servicesTreatment" | "conditionsTreatment", value: string) => void
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

  const normalizedInput = inputValue.trim()
  const [debouncedInput, setDebouncedInput] = useState(normalizedInput)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedInput(normalizedInput.toLowerCase()), 150)
    return () => clearTimeout(t)
  }, [normalizedInput])

  const uniqueOptions = useMemo(() => Array.from(new Set(allOptions)), [allOptions])
  const loweredUniqueOptions = useMemo(() => uniqueOptions.map((o) => o.toLowerCase()), [uniqueOptions])

  const filteredOptions = useMemo(() => {
    if (!debouncedInput) return uniqueOptions.filter((o) => !selectedItems.includes(o)).slice(0, 8)
    return uniqueOptions.filter((option, i) => !selectedItems.includes(option) && loweredUniqueOptions[i].includes(debouncedInput))
  }, [debouncedInput, uniqueOptions, loweredUniqueOptions, selectedItems])

  const focusInput = () => {
    // Use requestAnimationFrame to ensure focus happens after React re-render
    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1))
      setDropdownOpen(true)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        onAddItem(fieldName, filteredOptions[highlightedIndex])
        focusInput()
      } else {
        const value = inputValue.trim()
        if (value) {
          onAddItem(fieldName, value)
          focusInput()
        }
      }
    } else if (e.key === "Escape") {
      setDropdownOpen(false)
    }
  }

  return (
    <div>
      <label className="block text-[12px] font-medium text-[#343434] mb-3">{label}</label>
      <div className="relative">
        <div
          className="border rounded-[12px] p-4 min-h-[120px] flex flex-wrap gap-3 items-start content-start"
          style={{ borderColor: BORDER }}
        >
          {selectedItems.map((item) => (
            <div
              key={item}
              className="flex items-center justify-between gap-2 px-4 py-2 rounded-full bg-[#f0f0f0] text-[#343434] text-sm"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => onRemoveItem(fieldName, item)}
                className="flex items-center justify-center w-5 h-5 rounded-full bg-[#343434] text-white hover:bg-[#1a1a1a] transition-colors"
              >
                ✕
              </button>
            </div>
          ))}

          <input
            type="text"
            placeholder={selectedItems.length === 0 ? placeholder : "Add more..."}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setDropdownOpen(true)
              setHighlightedIndex(-1)
            }}
            ref={inputRef}
            onFocus={() => {
              setDropdownOpen(true)
              setHighlightedIndex(-1)
            }}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
            onKeyDown={onKeyDown}
            className="flex-1 min-w-[150px] outline-none bg-transparent text-sm text-[#343434]"
            style={{ minHeight: selectedItems.length === 0 ? "60px" : "auto" }}
          />
        </div>

        {dropdownOpen && filteredOptions.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 border rounded-[12px] bg-white shadow-lg z-10 max-h-52 overflow-auto"
            style={{ borderColor: BORDER }}
          >
            {filteredOptions.map((option, idx) => (
              <button
                key={option}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault() // prevent input blur
                  onAddItem(fieldName, option)
                  focusInput()
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`w-full text-left px-4 py-3 transition-colors text-sm text-[#343434] border-b last:border-b-0 ${
                  idx === highlightedIndex ? "bg-[#f0f0f0]" : "hover:bg-[#f9f9f9]"
                }`}
                style={{ borderColor: BORDER }}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {inputValue && !allOptions.map((o) => o.toLowerCase()).includes(inputValue.trim().toLowerCase()) && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              onAddItem(fieldName, inputValue)
              focusInput()
            }}
            className="absolute right-4 top-4 px-3 py-1 rounded-full text-xs font-medium text-white transition-colors"
            style={{ background: PRIMARY }}
          >
            Add
          </button>
        )}
      </div>
    </div>
  )
}

const RegisterPage = () => {
  const router = useRouter();
  
  // Use global location context for city autocomplete
  const { 
    citySuggestions, 
    getCitySuggestions, 
    clearCitySuggestions 
  } = useLocation();
  
  // City autocomplete UI state
  const [isCityFocused, setIsCityFocused] = useState(false);
  const [cityFocusedIndex, setCityFocusedIndex] = useState(-1);
  const cityInputRef = useRef<HTMLInputElement>(null);
  
  const [userFields, setUserFields] = useState({
    fullName: "",
    gender: "male",
    country: "Pakistan",
    city: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [profilePic, setProfilePic] = useState("");
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const allFieldsFilled =
    userFields.fullName.trim() &&
    userFields.country.trim() &&
    userFields.city.trim() &&
    userFields.email.trim() &&
    userFields.phoneNumber.trim() &&
    userFields.password.trim() &&
    userFields.confirmPassword.trim();

  const [loading, setLoading] = useState(false); // loader for submit button
  
  // Handle city input change with autocomplete
  const handleCityInputChange = useCallback((value: string) => {
    setUserFields(prev => ({ ...prev, city: value }));
    setCityFocusedIndex(-1);
    getCitySuggestions(value);
  }, [getCitySuggestions]);

  // Handle city selection from suggestions
  const handleCitySelect = useCallback((suggestion: string) => {
    const cityName = suggestion.split(",")[0];
    setUserFields(prev => ({ ...prev, city: cityName }));
    clearCitySuggestions();
    setIsCityFocused(false);
  }, [clearCitySuggestions]);

  // Handle city keyboard navigation
  const handleCityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!citySuggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCityFocusedIndex((prev) => (prev + 1) % citySuggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCityFocusedIndex((prev) => (prev - 1 + citySuggestions.length) % citySuggestions.length);
    } else if (e.key === "Enter" && cityFocusedIndex >= 0) {
      e.preventDefault();
      handleCitySelect(citySuggestions[cityFocusedIndex]);
    }
  };

  // Handler for registration submit
 const handleRegister = async () => {
  if (userFields.password !== userFields.confirmPassword) {
    setPasswordError("Password and Confirm Password do not match.");
    return;
  }
  setPasswordError(null);

  // 2️⃣ Step control
  if (step !== 2) {
    setStep(2);
    return;
  }

  // 3️⃣ Ensure education list exists
  const finalEducation =
    educationList.length > 0
      ? educationList
      : [
          {
            degreeName: formData.education || "",
            institute: "",
            fieldOfStudy: "",
          },
        ];

  // 4️⃣ Build FormData
  const formDataToSend = new FormData();

  // 🟦 USER OBJECT
  const userData = {
    fullName: userFields.fullName,
    gender: gender,
    country: userFields.country,
    city: userFields.city,
    email: userFields.email,
    phoneNumber: userFields.phoneNumber,
    password: userFields.password,
    
  };

  formDataToSend.append("user", JSON.stringify(userData));

  // 🟧 DOCTOR PROFILE
  const doctorProfileData = {
    yearsOfExperience: Number(formData.yearsOfExperience),
    FeesPerConsultation: formData.FeesPerConsultation || "0",
    Description:   "",

    primarySpecialization: formData.primarySpecializations || [],
    servicesTreatementOffered: formData.servicesTreatment || [],
    conditionTreatments: formData.conditionsTreatment || [],

    education: finalEducation,
  };


  
  formDataToSend.append("doctorProfile", JSON.stringify(doctorProfileData));

if(profilePicFile)
{
  
  formDataToSend.append("profilePic", profilePicFile);
}

for (let entry of formDataToSend.entries()) {
  console.log(entry[0], entry[1]);
}

  // 5️⃣ Submit
  setLoading(true); // start loader
  try {
    await registerDoctor(formDataToSend);
    toast.success("Registration successful!");
    router.push("/login"); 
  } catch (error: any) {
    console.log(error)
    toast.error(error?.response?.data?.message || "Registration failed. Please try again.");
    console.error("Registration error:", error);
  } finally {
    setLoading(false); // stop loader
  }
};
  
  // Handle adding an education entry
  const addEducationEntry = () => {
    if (educationFields.degreeName.trim()) {
      setEducationList(prev => [...prev, {...educationFields}]);
      setEducationFields({
        degreeName: "",
        institute: "",
        fieldOfStudy: ""
      });
      setShowEducationPopup(false);
    }
  };
  
  // Handle removing an education entry
  const removeEducationEntry = (index: number) => {
    setEducationList(prev => prev.filter((_, i) => i !== index));
  };
  const [step, setStep] = useState(1)
  const [gender, setGender] = useState<"male" | "female">("male")

  // Add education fields
  const [showEducationPopup, setShowEducationPopup] = useState(false);
  const [educationFields, setEducationFields] = useState({
    degreeName: "",
    institute: "",
    fieldOfStudy: ""
  });
  
  // Track the full education array
  const [educationList, setEducationList] = useState<Array<{
    degreeName: string;
    institute: string;
    fieldOfStudy: string;
  }>>([]);
  
  // Handle user field changes
  const handleUserFieldChange = (field: string, value: string) => {
    setUserFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const [specializationInput, setSpecializationInput] = useState("")
  const [treatmentInput, setTreatmentInput] = useState("")
  const [conditionInput, setConditionInput] = useState("")
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)



  const [formData, setFormData] = useState({
    title: "",
    yearsOfExperience: "",
    primarySpecializations: [] as string[],
    servicesTreatment: [] as string[],
    conditionsTreatment: [] as string[],
    education: "",
    FeesPerConsultation: "", 
  })

  const specializations = [
  "Allergy and Immunology",
  "Anesthesiology",
  "Cardiology",
  "Cardiothoracic Surgery",
  "Cardiovascular Surgery",
  "Clinical Neurophysiology",
  "Clinical Pharmacology",
  "Colon and Rectal Surgery",
  "Community Medicine",
  "Critical Care Medicine",
  "Dental Surgery",
  "Dermatology",
  "Diagnostic Radiology",
  "Emergency Medicine",
  "Endocrinology, Diabetes & Metabolism",
  "Family Medicine",
  "Gastroenterology",
  "General Practice",
  "General Surgery",
  "Genetics and Genomics",
  "Geriatric Medicine",
  "Gynecologic Oncology",
  "Hand Surgery",
  "Head and Neck Surgery",
  "Hematology",
  "Hepatology",
  "Hospital Medicine",
  "Infectious Disease",
  "Internal Medicine",
  "Interventional Cardiology",
  "Interventional Radiology",
  "Legal Medicine",
  "Maternal and Fetal Medicine",
  "Medical Oncology",
  "Medical Toxicology",
  "Neonatal-Perinatal Medicine",
  "Nephrology",
  "Neurocritical Care",
  "Neurodevelopmental Disabilities",
  "Nerve Doctor",
  "Neurology",
  "Neuromuscular Medicine",
  "Neuroradiology",
  "Neurosurgery",
  "Nuclear Medicine",
  "Obstetrics & Gynecology",
  "Gynecology",
  "Gynecologist",
  "Occupational Medicine",
  "Oncology",
  "Ophthalmology",
  "Optometry",
  "Oral and Maxillofacial Surgery",
  "Orthopedic Surgery",
  "Otolaryngology (ENT)",
  "Pain Medicine",
  "Palliative Care",
  "Pathology",
  "Pediatric Allergy & Immunology",
  "Pediatric Anesthesiology",
  "Pediatric Cardiology",
  "Pediatric Critical Care Medicine",
  "Pediatric Dermatology",
  "Pediatric Emergency Medicine",
  "Pediatric Endocrinology",
  "Pediatric Gastroenterology",
  "Pediatric Hematology & Oncology",
  "Pediatric Infectious Diseases",
  "Pediatric Nephrology",
  "Pediatric Neurology",
  "Pediatric Neurosurgery",
  "Pediatric Oncology",
  "Pediatric Ophthalmology",
  "Pediatric Orthopedics",
  "Pediatric Otolaryngology",
  "Pediatric Pathology",
  "Pediatric Pulmonology",
  "Pediatric Radiology",
  "Pediatric Rheumatology",
  "Pediatric Surgery",
  "Pediatric Urology",
  "Pediatrics",
  "Physical Medicine & Rehabilitation",
  "Plastic Surgery",
  "Preventive Medicine",
  "Psychiatry",
  "Psychosomatic Medicine",
  "Public Health",
  "Pulmonary Disease",
  "Radiation Oncology",
  "Radiology",
  "Reproductive Endocrinology and Infertility",
  "Rheumatology",
  "Sleep Medicine",
  "Spinal Cord Injury Medicine",
  "Sports Medicine",
  "Surgical Critical Care",
  "Thoracic Surgery",
  "Transplant Surgery",
  "Trauma Surgery",
  "Urology",
  "Vascular Neurology",
  "Vascular Surgery",
  "Adolescent Medicine",
  "Aerospace Medicine",
  "Biochemical Genetics",
  "Chemical Pathology",
  "Clinical Biochemistry",
  "Clinical Cytogenetics",
  "Clinical Immunology",
  "Clinical Microbiology",
  "Clinical Pathology",
  "Clinical Psychology",
  "Community Health",
  "Dental Public Health",
  "Developmental Pediatrics",
  "Endodontics",
  "Epidemiology",
  "Forensic Medicine",
  "Forensic Pathology",
  "Gastrointestinal Surgery",
  "General Internal Medicine",
  "Geriatric Psychiatry",
  "Health Informatics",
  "Hematopathology",
  "Hospice and Palliative Medicine",
  "Immunopathology",
  "Interventional Neuroradiology",
  "Laboratory Medicine",
  "Laparoscopic Surgery",
  "Lifestyle Medicine",
  "Maxillofacial Surgery",
  "Medical Biochemistry",
  "Medical Genetics",
  "Medical Microbiology",
  "Military Medicine",
  "Molecular Pathology",
  "Musculoskeletal Radiology",
  "Neonatology",
  "Neuroendocrinology",
  "Neuroimaging",
  "Neurointerventional Surgery",
  "Neuropathology",
  "Neuropsychiatry",
  "Nuclear Cardiology",
  "Occupational Health",
  "Oncologic Surgery",
  "Oral Medicine",
  "Oral Pathology",
  "Orthodontics",
  "Orthopedic Oncology",
  "Pain Rehabilitation",
  "Pediatric Dentistry",
  "Pediatric Emergency Care",
  "Pediatric Gastrohepatic Surgery",
  "Pediatric Infectious Medicine",
  "Pediatric Intensive Care",
  "Pediatric Neuroradiology",
  "Pediatric Pathology",
  "Pediatric Plastic Surgery",
  "Pediatric Rehabilitation",
  "Pediatric Thoracic Surgery",
  "Perinatal Medicine",
  "Phlebology",
  "Physician Executive",
  "Plastic and Reconstructive Surgery",
  "Primary Care",
  "Proctology",
  "Pulmonology (Respiratory Medicine)",
  "Radiologic Physics",
  "Rehabilitation Psychology",
  "Reproductive Medicine",
  "Rural Medicine",
  "Sleep Disorders Medicine",
  "Spine Surgery",
  "Surgical Oncology",
  "Tropical Medicine",
  "Undersea and Hyperbaric Medicine",
  "Urgent Care Medicine",
  "Urogynecology",
  "Vascular and Interventional Radiology",
  "Virology",
  "Women's Health",
  "Wound Care Medicine"
]
  const treatments = [
    "Cupping Therapy",
    "Acupuncture",
    "Massage Therapy",
    "Herbal Treatment",
    "Physical Therapy",
    "Homeopathy",
  ]
  const conditions = [
    // Shown on landing page carousel
    "High Blood Pressure",
    "Piles",
    "Diarrhea",
    "Acne",
    "Pregnancy",
    "Fever",
    "Heart Attack",
    // Cardiovascular
    "Hypertension",
    "Low Blood Pressure",
    "Chest Pain",
    "Heart Failure",
    "Arrhythmia",
    "Stroke",
    "Angina",
    "Coronary Artery Disease",
    "Peripheral Vascular Disease",
    // Gastrointestinal
    "Constipation",
    "Acid Reflux / GERD",
    "Irritable Bowel Syndrome",
    "Peptic Ulcer",
    "Liver Disease",
    "Hepatitis",
    "Jaundice",
    "Hemorrhoids",
    "Appendicitis",
    "Gallstones",
    "Nausea & Vomiting",
    "Bloating",
    // Respiratory
    "Asthma",
    "Bronchitis",
    "Pneumonia",
    "Tuberculosis",
    "Shortness of Breath",
    "Cough",
    "Sinusitis",
    "Allergic Rhinitis",
    "Sleep Apnea",
    // Skin / Dermatology
    "Eczema",
    "Psoriasis",
    "Skin Allergy",
    "Fungal Infection",
    "Rash",
    "Dandruff",
    "Warts",
    "Hair Loss",
    "Vitiligo",
    // Musculoskeletal
    "Back Pain",
    "Knee Pain",
    "Arthritis",
    "Joint Pain",
    "Neck Pain",
    "Gout",
    "Osteoporosis",
    "Fracture",
    "Sciatica",
    // Neurological
    "Migraine",
    "Headache",
    "Epilepsy",
    "Vertigo / Dizziness",
    "Parkinson's Disease",
    "Anxiety",
    "Depression",
    "Insomnia",
    "Memory Loss",
    // Hormonal / Metabolic
    "Diabetes",
    "Diabetes Type 1",
    "Diabetes Type 2",
    "Thyroid Disorder",
    "Hypothyroidism",
    "Hyperthyroidism",
    "PCOS",
    "Obesity",
    "High Cholesterol",
    // Urinary / Renal
    "Kidney Stones",
    "Urinary Tract Infection",
    "Kidney Disease",
    "Prostate Problems",
    "Incontinence",
    // Eye / ENT
    "Eye Infection",
    "Cataract",
    "Glaucoma",
    "Ear Infection",
    "Tonsillitis",
    "Hearing Loss",
    "Nasal Polyps",
    // Women's Health
    "Menstrual Disorders",
    "PCOS",
    "Infertility",
    "Menopause",
    "Uterine Fibroids",
    "Endometriosis",
    // Children's Health
    "Growth Disorders",
    "Childhood Asthma",
    "Malnutrition",
    "Developmental Delay",
    // Dental
    "Toothache",
    "Gum Disease",
    "Tooth Decay",
    "Mouth Ulcer",
    // Other
    "Anemia",
    "Dehydration",
    "Malaria",
    "Dengue",
    "Typhoid",
    "COVID-19",
    "Chickenpox",
    "Weight Loss",
    "Fatigue",
    "Cupping Therapy",
    "Acupuncture",
    "Massage Therapy",
    "Herbal Treatment",
    "Physiotherapy",
    "Chiropractic",
  ]

  const addItem = (field: "primarySpecializations" | "servicesTreatment" | "conditionsTreatment", value: string) => {
    if (value.trim() && !formData[field].includes(value)) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }))
      if (field === "primarySpecializations") setSpecializationInput("")
      if (field === "servicesTreatment") setTreatmentInput("")
      if (field === "conditionsTreatment") setConditionInput("")
    }
  }

  const removeItem = (field: "primarySpecializations" | "servicesTreatment" | "conditionsTreatment", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }))
  }

  const getFilteredOptions = (input: string, allOptions: string[], selectedItems: string[]) => {
    return allOptions.filter(
      (option) => option.toLowerCase().includes(input.toLowerCase()) && !selectedItems.includes(option),
    )
  }



  // Add this function to handle file upload
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

  // Password match check on change
  useEffect(() => {
    if (
      userFields.password &&
      userFields.confirmPassword &&
      userFields.password !== userFields.confirmPassword
    ) {
      setPasswordError("Password and Confirm Password do not match.");
    } else {
      setPasswordError(null);
    }
  }, [userFields.password, userFields.confirmPassword]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white">
      {/* <Toaster position="top-right" /> */}
      <div className="w-full max-w-[672px] px-4 md:px-0 pt-14 pb-10">
        {/* Header */}
        <div className="mx-auto flex flex-col items-center gap-[30px] w-full max-w-[560px]">
          <Image src="/images/logo.svg" alt="Sehatyar" width={200} height={40} className="object-contain" priority />
          <h1 className="text-[28px] font-semibold leading-none tracking-tight text-[#4e148c]">
            Registration <span style={{ color: PRIMARY }}>Form</span>
          </h1>
        </div>

        {step === 1 && (
          <>
            {/* Full Name */}
            <div className="relative mt-6 mb-6">
              <label className="absolute -top-3 left-6 bg-white px-2 text-[15px] font-medium text-gray-500 z-10">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Full name"
                className="w-full h-[56px] rounded-[12px] border border-gray-300 px-6 text-[15px] outline-none focus:border-[#4e148c] transition-colors bg-white placeholder:text-gray-400"
                value={userFields.fullName}
                onChange={(e) => setUserFields({ ...userFields, fullName: e.target.value })}
              />
            </div>

            {/* Gender */}
            <div className="mt-4 mb-6">
              <div className="inline-flex items-center p-1 rounded-full" style={{ background: "#4e148c" }}>
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`px-6 h-[38px] rounded-full text-white font-medium transition-colors ${
                    gender === "male" ? "bg-[#ff8331]" : ""
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`px-6 h-[38px] rounded-full text-white font-medium transition-colors ${
                    gender === "female" ? "bg-[#ff8331]" : ""
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Country / City */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative">
                <label className="absolute -top-3 left-6 bg-white px-2 text-[15px] font-medium text-gray-500 z-10">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Pakistan"
                  className="w-full h-[56px] rounded-[12px] border border-gray-300 px-6 text-[15px] outline-none bg-white text-gray-500"
                  value={userFields.country}
                  onChange={(e) => setUserFields({ ...userFields, country: e.target.value })}
                  disabled
                />
              </div>
              <div className="relative">
                <label className="absolute -top-3 left-6 bg-white px-2 text-[15px] font-medium text-gray-500 z-10">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={cityInputRef}
                    type="text"
                    placeholder="Abbottabad"
                    className="w-full h-[56px] rounded-[12px] border border-gray-300 px-6 text-[15px] outline-none focus:border-[#4e148c] transition-colors bg-white placeholder:text-gray-400"
                    value={userFields.city}
                    onChange={(e) => handleCityInputChange(e.target.value)}
                    onFocus={() => setIsCityFocused(true)}
                    onBlur={() => setTimeout(() => setIsCityFocused(false), 200)}
                    onKeyDown={handleCityKeyDown}
                  />
                </div>
                
                {/* City Suggestions Dropdown */}
                {isCityFocused && citySuggestions.length > 0 && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-[12px] shadow-lg z-50 max-h-[200px] overflow-y-auto"
                    style={{ borderColor: BORDER }}
                  >
                    {citySuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion}
                        type="button"
                        onMouseDown={() => handleCitySelect(suggestion)}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors text-sm ${
                          index === cityFocusedIndex 
                            ? "bg-[#5fe089] text-white" 
                            : "hover:bg-gray-100 text-[#343434]"
                        }`}
                      >
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Email / Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative">
                <label className="absolute -top-3 left-6 bg-white px-2 text-[15px] font-medium text-gray-500 z-10">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="lendar@gmail.com"
                  className="w-full h-[56px] rounded-[11px] border border-gray-300 px-6 text-[15px] outline-none focus:border-[#4e148c] transition-colors bg-white placeholder:text-gray-400"
                  value={userFields.email}
                  onChange={(e) => setUserFields({ ...userFields, email: e.target.value })}
                />
              </div>
              <div className="relative">
                <label className="absolute -top-3 left-6 bg-white px-2 text-[15px] font-medium text-gray-500 z-10">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="03100057572"
                  className="w-full h-[56px] rounded-[12px] border border-gray-300 px-6 text-[15px] outline-none focus:border-[#4e148c] transition-colors bg-white placeholder:text-gray-400"
                  value={userFields.phoneNumber}
                  onChange={(e) => setUserFields({ ...userFields, phoneNumber: e.target.value })}
                />
              </div>
            </div>

            {/* Password / Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative">
                <label className="absolute -top-3 left-6 bg-white px-2 text-[15px] font-medium text-gray-500 z-10">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Full name"
                  className="w-full h-[56px] rounded-[12px] border border-gray-300 px-6 text-[15px] outline-none focus:border-[#4e148c] transition-colors bg-white placeholder:text-gray-400"
                  value={userFields.password}
                  onChange={(e) => setUserFields({ ...userFields, password: e.target.value })}
                />
              </div>
              <div className="relative">
                <label className="absolute -top-3 left-6 bg-white px-2 text-[15px] font-medium text-gray-500 z-10">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Full name"
                  className="w-full h-[56px] rounded-[12px] border border-gray-300 px-6 text-[15px] outline-none focus:border-[#4e148c] transition-colors bg-white placeholder:text-gray-400"
                  value={userFields.confirmPassword}
                  onChange={(e) => setUserFields({ ...userFields, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            {/* Show password error below confirm password */}
            {passwordError && (
              <div className="w-full text-red-600 text-center text-sm font-medium mt-2 mb-2">
                {passwordError}
              </div>
            )}

            {/* Next Button */}
            <button
              type="button"
              onClick={() => {
                if (userFields.password !== userFields.confirmPassword) {
                  setPasswordError("Password and Confirm Password do not match.");
                  return;
                }
                setPasswordError(null);
                setStep(2);
              }}
              className="btn-wipe-up w-full mt-6 h-[56px] rounded-full text-white font-semibold text-[18px] transition-colors hover:bg-[#3d1070]"
              style={{ background: "#4e148c" }}
              disabled={
                !(
                  userFields.fullName.trim() &&
                  userFields.country.trim() &&
                  userFields.city.trim() &&
                  userFields.email.trim() &&
                  userFields.phoneNumber.trim() &&
                  userFields.password.trim() &&
                  userFields.confirmPassword.trim() &&
                  userFields.password === userFields.confirmPassword
                )
              }
            >
              <span className="relative z-10">Next</span>
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {/* Upload Icon */}
            <div className="mt-8 flex justify-center">
              <div
                className="w-[100px] h-[100px] rounded-full border-2 border-dashed flex items-center justify-center relative"
                style={{ borderColor: BORDER }}
              >
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"
                    />
                  </svg>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>

            {/* Title / Years of Experience */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-[#343434] mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Dr."
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full h-[63px] rounded-[12px] border px-4 text-sm outline-none bg-white text-[#343434] placeholder:text-gray-400"
                  style={{ borderColor: BORDER }}
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#343434] mb-2">
                  Year of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="15"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData((prev) => ({ ...prev, yearsOfExperience: e.target.value }))}
                  className="w-full h-[63px] rounded-[12px] border px-4 text-sm outline-none bg-white text-[#343434] placeholder:text-gray-400"
                  style={{ borderColor: BORDER }}
                />
              </div>
            </div>
            {/* Specialization and Treatment Sections */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary Specialization */}
              <div>
                <label className="block text-[12px] font-medium text-[#343434] mb-3">
                  Primary Specialization <span className="text-red-500">*</span>
                </label>
                <AutocompleteField
                  label=" "
                  placeholder="Search or type specialization..."
                  inputValue={specializationInput}
                  setInputValue={setSpecializationInput}
                  selectedItems={formData.primarySpecializations}
                  allOptions={specializations}
                  fieldName="primarySpecializations"
                  dropdownOpen={openDropdown === "specialization"}
                  setDropdownOpen={(open) => setOpenDropdown(open ? "specialization" : null)}
                  onAddItem={addItem}
                  onRemoveItem={removeItem}
                />
              </div>
              {/* Services Treatment Offer */}
              <div>
                <label className="block text-[12px] font-medium text-[#343434] mb-3">
                  Services Treatment Offer <span className="text-red-500">*</span>
                </label>
                <AutocompleteField
                  label=''
                  placeholder="Search or type treatment..."
                  inputValue={treatmentInput}
                  setInputValue={setTreatmentInput}
                  selectedItems={formData.servicesTreatment}
                  allOptions={treatments}
                  fieldName="servicesTreatment"
                  dropdownOpen={openDropdown === "treatment"}
                  setDropdownOpen={(open) => setOpenDropdown(open ? "treatment" : null)}
                  onAddItem={addItem}
                  onRemoveItem={removeItem}
                />
              </div>
            </div>
            {/* Conditions and Education Sections */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Conditions Treatment */}
              <AutocompleteField
                label="Conditions Treatment"
                placeholder="Search or type condition..."
                inputValue={conditionInput}
                setInputValue={setConditionInput}
                selectedItems={formData.conditionsTreatment}
                allOptions={conditions}
                fieldName="conditionsTreatment"
                dropdownOpen={openDropdown === "condition"}
                setDropdownOpen={(open) => setOpenDropdown(open ? "condition" : null)}
                onAddItem={addItem}
                onRemoveItem={removeItem}
              />

              {/* Education */}
              <div>
                <label className="block text-[12px] font-medium text-[#343434] mb-3">
                  Education <span className="text-red-500">*</span>
                </label>
                <div
                  className="border rounded-[12px] p-4 min-h-[120px] flex flex-col"
                  style={{ borderColor: BORDER }}
                >
                  {/* Display education entries */}
                  {educationList.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {educationList.map((edu, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div>
                            <div className="font-medium">{edu.degreeName}</div>
                            <div className="text-xs text-gray-600">
                              {edu.institute} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}
                            </div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeEducationEntry(index)}
                            className="text-red-500 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <input
                    type="text"
                    placeholder="B.E.M.S. Ayub Medical College, Pakistan, 12"
                    value={formData.education}
                    onChange={(e) => setFormData((prev) => ({ ...prev, education: e.target.value }))}
                    className="w-full outline-none bg-transparent text-sm text-[#343434]"
                  />
                  
                  <button
                    type="button"
                    onClick={() => setShowEducationPopup(true)}
                    className="mt-2 self-end text-sm font-medium px-3 py-1 rounded-full"
                    style={{ background: PRIMARY, color: "#0b3b22" }}
                  >
                    Add Details
                  </button>
                </div>
              </div>
            </div>

            {/* Fees Per Consultation field */}
            <div className="mt-4">
              <label className="block text-[12px] font-medium text-[#343434] mb-2">
                Fees Per Consultation
              </label>
              <input
                type="number"
                placeholder="500"
                value={formData.FeesPerConsultation}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, FeesPerConsultation: e.target.value }))
                }
                className="w-full h-[63px] rounded-[12px] border px-4 text-sm outline-none bg-white text-[#343434] placeholder:text-gray-400"
                style={{ borderColor: BORDER }}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 h-[48px] md:h-[54px] rounded-full text-white font-semibold   bg-[#ff6600]"
              >
                Back
              </button>
              <button
                type="button"
                className="btn-wipe-up flex-1 h-[48px] md:h-[54px] rounded-full text-white bg-[#551e91] font-semibold"
                onClick={handleRegister}
                disabled={
                  !(
                    allFieldsFilled &&
                    formData.yearsOfExperience.trim() &&
                    formData.primarySpecializations.length > 0 &&
                    formData.servicesTreatment.length > 0 &&
                    educationList.length > 0 // <-- validation only for popup
                  ) ||
                  !!passwordError ||
                  loading // disable while loading
                }
              >
                <span className="relative z-10">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </span>
              </button>
            </div>
            {passwordError && (
              <div className="w-full text-red-600 text-center text-sm font-medium mt-2 mb-2">
                {passwordError}
              </div>
            )}
          </>
        )}
        
        {/* Education popup */}
        {showEducationPopup && (
          <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-5 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Education Details</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree Name
                  </label>
                  <input
                    type="text"
                    value={educationFields.degreeName}
                    onChange={(e) => setEducationFields(prev => ({
                      ...prev, 
                      degreeName: e.target.value
                    }))}
                    placeholder="e.g., MBBS, MD, Ph.D."
                    className="w-full h-10 rounded border px-3 text-sm outline-none bg-white text-[#343434]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institute
                  </label>
                  <input
                    type="text"
                    value={educationFields.institute}
                    onChange={(e) => setEducationFields(prev => ({
                      ...prev, 
                      institute: e.target.value
                    }))}
                    placeholder="e.g., Harvard Medical School"
                    className="w-full h-10 rounded border px-3 text-sm outline-none bg-white text-[#343434]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={educationFields.fieldOfStudy}
                    onChange={(e) => setEducationFields(prev => ({
                      ...prev, 
                      fieldOfStudy: e.target.value
                    }))}
                    placeholder="e.g., Medicine, Cardiology"
                    className="w-full h-10 rounded border px-3 text-sm outline-none bg-white text-[#343434]"
                  />
                </div>
              </div>
              
              <div className="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEducationPopup(false)}
                  className="px-4 py-2 border rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addEducationEntry}
                  className="px-4 py-2 rounded-md text-sm text-white font-medium"
                  style={{ background: PRIMARY }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RegisterPage
