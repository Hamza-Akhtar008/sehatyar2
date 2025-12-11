"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileTextIcon, Loader2, Save, Calendar, User, Stethoscope } from "lucide-react"
import { format } from "date-fns"
import RichTextEditor from "@/components/rich-text-editor"
import { generatePrescriptionPDF } from "@/lib/pdf-generator"
import { useAuth } from "@/context/AuthContext"
import { patchAppointment } from "@/lib/api/apis"

interface PrescriptionModalProps {
  patient: {
    name: string
    email?: string
    phone?: string
  }
  appointmentId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function PrescriptionModal({ patient, appointmentId, open, onOpenChange, onSuccess }: PrescriptionModalProps) {
  const { user } = useAuth()
  const [isGenerating, setIsGenerating] = useState(false)
  const [prescriptionContent, setPrescriptionContent] = useState("")
  const [editorKey, setEditorKey] = useState(0) // Used to force remount editor
  const currentDate = new Date()

  // Get doctor info
  const doctorEmail = user?.email || ""
  const doctorName = doctorEmail.split("@")[0] || "Doctor"

  // Default prescription template with nice formatting
  const getDefaultTemplate = () => {
    return `<b>══════════════════════════════════════</b>
<b>DIAGNOSIS</b>
<b>══════════════════════════════════════</b>

• Primary: <i>[Enter primary diagnosis]</i>
• Secondary: <i>[Enter secondary diagnosis if any]</i>


<b>══════════════════════════════════════</b>
<b>PRESCRIPTION</b>
<b>══════════════════════════════════════</b>

<b>1. Medication Name</b>
   Dosage: [e.g., 500mg]
   Frequency: [e.g., Twice daily after meals]
   Duration: [e.g., 7 days]

<b>2. Medication Name</b>
   Dosage: [e.g., 10ml]
   Frequency: [e.g., Once daily at bedtime]
   Duration: [e.g., 5 days]


<b>══════════════════════════════════════</b>
<b>ADVICE & INSTRUCTIONS</b>
<b>══════════════════════════════════════</b>

• Drink plenty of fluids
• Get adequate rest
• Avoid cold beverages
• Complete the full course of medication


<b>══════════════════════════════════════</b>
<b>FOLLOW-UP</b>
<b>══════════════════════════════════════</b>

Schedule follow-up visit after: <b>7 days</b>

<i>Contact immediately if symptoms worsen</i>`
  }

  // Reset content on open
  useEffect(() => {
    if (open) {
      setPrescriptionContent(getDefaultTemplate())
      setEditorKey(prev => prev + 1) // Force remount editor with fresh content
    }
  }, [open])

  // Sanitize HTML for PDF
  const sanitizeForPDF = (html: string): string => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = html

    const getLines = (el: HTMLElement | ChildNode): string[] => {
      const lines: string[] = []

      if (el.nodeType === 3) {
        // Text node
        const text = el.textContent || ""
        text.split("\n").forEach(line => {
          const cleaned = line.replace(/\u200B/g, "").replace(/\u00A0/g, " ")
          if (cleaned.trim()) lines.push(cleaned)
        })
      } else if (el instanceof HTMLElement) {
        const tag = el.tagName.toLowerCase()
        
        if (tag === "br") {
          lines.push("")
        } else if (tag === "li") {
          lines.push("• " + (el.textContent || "").trim())
        } else if (tag === "b" || tag === "strong") {
          lines.push(`**${el.textContent || ""}**`)
        } else if (tag === "i" || tag === "em") {
          lines.push(`_${el.textContent || ""}_`)
        } else if (tag === "p" || tag === "div") {
          el.childNodes.forEach(child => {
            lines.push(...getLines(child))
          })
          lines.push("") // Add line break after block elements
        } else {
          el.childNodes.forEach(child => {
            lines.push(...getLines(child))
          })
        }
      }
      return lines
    }

    let lines: string[] = []
    tempDiv.childNodes.forEach(child => {
      lines.push(...getLines(child))
    })

    // Clean up multiple empty lines
    const result: string[] = []
    let prevEmpty = false
    lines.forEach(line => {
      if (line.trim() === "") {
        if (!prevEmpty) {
          result.push("")
          prevEmpty = true
        }
      } else {
        result.push(line)
        prevEmpty = false
      }
    })

    return result.join("\n")
  }

  const onSubmit = async () => {
    if (!prescriptionContent.trim()) return
    
    setIsGenerating(true)

    try {
      const cleanedContent = sanitizeForPDF(prescriptionContent)

      // Generate PDF blob
      const pdfBlob = await generatePrescriptionPDF({
        doctorName: `DR. ${doctorName.toUpperCase()}`,
        email: doctorEmail,
        patientName: patient.name,
        prescriptionContent: cleanedContent,
        date: format(currentDate, "MMMM dd, yyyy"),
        htmlContent: prescriptionContent,
      })

      // Convert Blob to File
      const pdfFile = new File([pdfBlob], `prescription-${Date.now()}.pdf`, { type: "application/pdf" })

      // Create FormData
      const formData = new FormData()
      formData.append("prescriptionFile", pdfFile)

      // Send to API
      await patchAppointment(formData, appointmentId)

      // Reset
      setPrescriptionContent("")

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white shrink-0">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileTextIcon className="h-6 w-6" />
            </div>
            Medical Prescription
          </DialogTitle>
          
          {/* Info Cards */}
          <div className="flex flex-wrap gap-4 mt-4">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                <div>
                  <p className="text-xs text-teal-200">Patient</p>
                  <p className="font-semibold text-sm">{patient.name}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <div>
                  <p className="text-xs text-teal-200">Date</p>
                  <p className="font-semibold text-sm">{format(currentDate, "MMM dd, yyyy")}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-3 flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                <div>
                  <p className="text-xs text-teal-200">Doctor</p>
                  <p className="font-semibold text-sm">DR. {doctorName.toUpperCase()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogHeader>

        {/* Editor Section */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Write your prescription below. Use the toolbar to format text. 
              The template includes sections for <b>Diagnosis</b>, <b>Prescription</b>, <b>Advice</b>, and <b>Follow-up</b>.
            </p>
          </div>
          
          <RichTextEditor
            key={editorKey}
            value={prescriptionContent}
            onChange={setPrescriptionContent}
            className="min-h-[450px]"
            placeholder="Start typing your prescription..."
          />
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-gray-50 border-t shrink-0">
          <div className="flex items-center justify-between w-full">
            <p className="text-xs text-muted-foreground">
              Prescription will be saved as PDF and attached to this appointment
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button 
                onClick={onSubmit}
                disabled={isGenerating || !prescriptionContent.trim()}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Prescription
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
