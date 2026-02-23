"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { SearchFunction } from "@/lib/Public/api"
import DoctorHero from "@/components/ui/doctorHero"

// When a user searches for a short/common name, also search these aliases
// so doctors registered under the full formal name are still returned.
const QUERY_ALIASES: Record<string, string[]> = {
  // Specialization aliases
  "gynecology":               ["Gynecology", "Obstetrics & Gynecology", "Gynecologist"],
  "gynecologist":             ["Gynecology", "Obstetrics & Gynecology", "Gynecologist"],
  "obstetrics":               ["Obstetrics & Gynecology"],
  "ent":                      ["Otolaryngology (ENT)", "Otolaryngology"],
  "otolaryngology":           ["Otolaryngology (ENT)", "Otolaryngology"],
  "orthopedic":               ["Orthopedic Surgery", "Orthopedic"],
  "orthopedics":              ["Orthopedic Surgery", "Orthopedic"],
  "orthopaedic":              ["Orthopedic Surgery", "Orthopedic"],
  "dentistry":                ["Dental Surgery", "Dentistry"],
  "dental":                   ["Dental Surgery", "Dentistry"],
  "dentist":                  ["Dental Surgery"],
  "cardiology":               ["Cardiology", "Interventional Cardiology"],
  "neurology":                ["Neurology", "Clinical Neurophysiology"],
  "psychiatry":               ["Psychiatry", "Psychosomatic Medicine"],
  "dermatology":              ["Dermatology"],
  "gastroenterology":         ["Gastroenterology", "Gastrointestinal Surgery"],
  "urology":                  ["Urology", "Urogynecology"],
  "obesity":                  ["Obesity", "Bariatric Surgery", "General Practice", "Internal Medicine"],
  "pediatrics":               ["Pediatrics"],
  "oncology":                 ["Oncology", "Medical Oncology", "Surgical Oncology", "Gynecologic Oncology"],

  // Condition → specialization mappings (landing page carousel conditions)
  "high blood pressure":      ["Cardiology", "Internal Medicine", "General Practice", "Family Medicine"],
  "hypertension":             ["Cardiology", "Internal Medicine", "General Practice", "Family Medicine"],
  "piles":                    ["Colon and Rectal Surgery", "General Surgery", "General Practice"],
  "hemorrhoids":              ["Colon and Rectal Surgery", "General Surgery"],
  "diarrhea":                 ["Gastroenterology", "General Practice", "Family Medicine", "Internal Medicine"],
  "acne":                     ["Dermatology"],
  "pregnancy":                ["Obstetrics & Gynecology", "Gynecology", "Maternal and Fetal Medicine"],
  "fever":                    ["General Practice", "Family Medicine", "Internal Medicine", "Pediatrics"],
  "heart attack":             ["Cardiology", "Interventional Cardiology", "Cardiovascular Surgery"],
  "chest pain":               ["Cardiology", "Internal Medicine", "Emergency Medicine"],
  "heart failure":            ["Cardiology", "Internal Medicine"],
  "stroke":                   ["Neurology", "Neurosurgery", "Vascular Neurology"],
  "diabetes":                 ["Endocrinology, Diabetes & Metabolism", "Internal Medicine", "General Practice"],
  "diabetes type 1":          ["Endocrinology, Diabetes & Metabolism"],
  "diabetes type 2":          ["Endocrinology, Diabetes & Metabolism", "Internal Medicine"],
  "thyroid":                  ["Endocrinology, Diabetes & Metabolism", "Internal Medicine"],
  "hypothyroidism":           ["Endocrinology, Diabetes & Metabolism"],
  "hyperthyroidism":          ["Endocrinology, Diabetes & Metabolism"],
  "pcos":                     ["Obstetrics & Gynecology", "Gynecology", "Endocrinology, Diabetes & Metabolism"],
  "asthma":                   ["Pulmonary Disease", "Internal Medicine", "Pediatrics"],
  "cough":                    ["General Practice", "Pulmonary Disease", "Internal Medicine"],
  "shortness of breath":      ["Pulmonary Disease", "Cardiology", "Internal Medicine"],
  "back pain":                ["Orthopedic Surgery", "Physical Medicine & Rehabilitation", "Neurology"],
  "knee pain":                ["Orthopedic Surgery", "Physical Medicine & Rehabilitation"],
  "joint pain":               ["Rheumatology", "Orthopedic Surgery"],
  "arthritis":                ["Rheumatology", "Orthopedic Surgery"],
  "migraine":                 ["Neurology"],
  "headache":                 ["Neurology", "General Practice"],
  "epilepsy":                 ["Neurology"],
  "anxiety":                  ["Psychiatry", "Psychosomatic Medicine"],
  "depression":               ["Psychiatry", "Psychosomatic Medicine"],
  "insomnia":                 ["Psychiatry", "Sleep Medicine", "Neurology"],
  "kidney stones":            ["Urology", "Nephrology"],
  "urinary tract infection":  ["Urology", "General Practice"],
  "uti":                      ["Urology", "General Practice"],
  "kidney disease":           ["Nephrology"],
  "eczema":                   ["Dermatology"],
  "psoriasis":                ["Dermatology"],
  "hair loss":                ["Dermatology"],
  "skin allergy":             ["Dermatology", "Allergy and Immunology"],
  "allergy":                  ["Allergy and Immunology", "Dermatology"],
  "eye infection":            ["Ophthalmology"],
  "cataract":                 ["Ophthalmology"],
  "ear infection":            ["Otolaryngology (ENT)", "Otolaryngology"],
  "tonsillitis":              ["Otolaryngology (ENT)", "Otolaryngology", "General Practice"],
  "toothache":                ["Dental Surgery"],
  "gum disease":              ["Dental Surgery"],
  "malaria":                  ["Internal Medicine", "Infectious Disease", "General Practice"],
  "dengue":                   ["Internal Medicine", "Infectious Disease", "General Practice"],
  "typhoid":                  ["Internal Medicine", "Infectious Disease", "General Practice"],
  "hepatitis":                ["Gastroenterology", "Hepatology", "Internal Medicine"],
  "liver disease":            ["Gastroenterology", "Hepatology"],
  "anemia":                   ["Hematology", "Internal Medicine", "General Practice"],
  "infertility":              ["Obstetrics & Gynecology", "Gynecology", "Urology"],
  "menstrual disorders":      ["Obstetrics & Gynecology", "Gynecology"],
  "high cholesterol":         ["Cardiology", "Internal Medicine", "General Practice"],
  "weight loss":              ["Endocrinology, Diabetes & Metabolism", "General Practice", "Internal Medicine"],
  "fatigue":                  ["Internal Medicine", "General Practice"],
  "vertigo":                  ["Neurology", "Otolaryngology (ENT)"],
  "gout":                     ["Rheumatology", "Internal Medicine"],
  "prostate":                 ["Urology"],
  "cancer":                   ["Oncology", "Medical Oncology"],
}

/** Resolve a raw query string into the list of specialization terms to search */
function resolveQueries(query: string): string[] {
  const key = query.trim().toLowerCase()
  const aliases = QUERY_ALIASES[key]
  if (aliases && aliases.length > 0) return aliases
  // No alias found → just search the original term as-is
  return [query.trim()]
}

export default function Page() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const city  = searchParams.get("city")  || ""

  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)

        const terms = resolveQueries(query)

        /** Fetch all alias terms with a given city param, return merged+deduped list */
        const fetchAndMerge = async (cityParam: string): Promise<any[]> => {
          const results = await Promise.allSettled(
            terms.map((term) => SearchFunction(term, cityParam))
          )
          const seen = new Set<number>()
          const merged: any[] = []
          for (const result of results) {
            if (result.status === "fulfilled" && Array.isArray(result.value)) {
              for (const doctor of result.value) {
                if (!seen.has(doctor.id)) {
                  seen.add(doctor.id)
                  merged.push(doctor)
                }
              }
            }
          }
          return merged
        }

        // Fetch with the city filter (always respect the selected city)
        const doctors = await fetchAndMerge(city)

        console.log(`Doctors for "${query}" (terms: ${terms.join(", ")}) in "${city}":`, doctors)
        setDoctors(doctors)
      } catch (error) {
        console.error("Error fetching doctors:", error)
        setDoctors([])
      } finally {
        setLoading(false)
      }
    }
    if (query || city) {
      fetchDoctors()
    } else {
      setLoading(false)
    }
  }, [query, city])

  return (
   <div className='mx-2 md:mx-8 xl:mx-25 my-18'>
    <DoctorHero
      doctors={doctors}
      loading={loading}
      specialization={query}
      city={city}
    />
   </div>
  )
}
