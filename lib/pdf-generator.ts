import jsPDF from "jspdf"

interface PrescriptionData {
    prescriptionContent: string
    date: string
    doctorName?: string
    email?: string
    hospitalName?: string
    patientName?: string
    age?: string
    address?: string
    htmlContent?: string
}

export async function generatePrescriptionPDF(data: PrescriptionData) {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 15
    const contentWidth = pageWidth - 2 * margin
    let yPosition = margin

    // Colors
    const primaryColor: [number, number, number] = [20, 184, 166] // Teal
    const secondaryColor: [number, number, number] = [15, 118, 110] // Darker Teal
    const textColor: [number, number, number] = [31, 41, 55] // Gray 800
    const lightGray: [number, number, number] = [243, 244, 246] // Gray 100
    const mediumGray: [number, number, number] = [107, 114, 128] // Gray 500

    // Helper function to draw rounded rectangle
    const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number, fill?: [number, number, number]) => {
        if (fill) doc.setFillColor(...fill)
        doc.roundedRect(x, y, w, h, r, r, fill ? "F" : "S")
    }

    // ============= HEADER =============
    // Top gradient bar
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, pageWidth, 40, "F")

    // Decorative accent
    doc.setFillColor(...secondaryColor)
    doc.triangle(pageWidth - 80, 0, pageWidth, 0, pageWidth, 40, "F")

    // Logo/Clinic Name
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(255, 255, 255)
    doc.text("SEHATYAR", margin, 18)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("Healthcare Solutions", margin, 26)

    // Rx Symbol
    doc.setFontSize(36)
    doc.setFont("helvetica", "bold")
    doc.text("℞", pageWidth - margin - 25, 28)

    // Doctor Info (right aligned)
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text(data.doctorName || "DR. DOCTOR", pageWidth - margin - 35, 15, { align: "right" })
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.text(data.email || "", pageWidth - margin - 35, 21, { align: "right" })

    yPosition = 50

    // ============= PATIENT & DATE INFO =============
    doc.setFillColor(...lightGray)
    drawRoundedRect(margin, yPosition, contentWidth, 22, 4, lightGray)

    // Patient Name
    doc.setTextColor(...mediumGray)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.text("PATIENT", margin + 8, yPosition + 7)
    doc.setTextColor(...textColor)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(data.patientName || "Patient Name", margin + 8, yPosition + 15)

    // Date
    doc.setTextColor(...mediumGray)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.text("DATE", margin + 85, yPosition + 7)
    doc.setTextColor(...textColor)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(data.date || "", margin + 85, yPosition + 15)

    // Prescription ID
    doc.setTextColor(...mediumGray)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.text("RX NUMBER", margin + 145, yPosition + 7)
    doc.setTextColor(...primaryColor)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(`RX-${Date.now().toString().slice(-8)}`, margin + 145, yPosition + 15)

    yPosition += 32

    // ============= PRESCRIPTION CONTENT =============
    // Parse content and render with formatting
    const lines = data.prescriptionContent.split("\n")

    doc.setTextColor(...textColor)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    const renderLine = (line: string, y: number): number => {
        // Check for page break
        if (y > pageHeight - 35) {
            doc.addPage()
            return margin
        }

        // Empty line
        if (!line.trim()) {
            return y + 4
        }

        // Section headers (bold with decoration)
        const sectionHeaders = ["DIAGNOSIS", "PRESCRIPTION", "ADVICE", "INSTRUCTIONS", "FOLLOW-UP", "NOTES"]
        const isSectionHeader = sectionHeaders.some(header =>
            line.toUpperCase().includes(header) && (line.includes("══") || line.startsWith("**"))
        )

        // Decorative line
        if (line.includes("══════")) {
            doc.setDrawColor(...primaryColor)
            doc.setLineWidth(0.5)
            doc.line(margin, y, margin + contentWidth, y)
            return y + 3
        }

        // Bold text (section headers)
        if (line.startsWith("**") && line.endsWith("**")) {
            const text = line.replace(/\*\*/g, "")
            doc.setFont("helvetica", "bold")
            doc.setFontSize(11)
            doc.setTextColor(...primaryColor)
            doc.text(text, margin, y)
            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            doc.setTextColor(...textColor)
            return y + 6
        }

        // Inline bold
        if (line.includes("**")) {
            doc.setFont("helvetica", "bold")
            const text = line.replace(/\*\*/g, "")
            doc.text(text, margin, y)
            doc.setFont("helvetica", "normal")
            return y + 5
        }

        // Italic text
        if (line.startsWith("_") && line.endsWith("_")) {
            const text = line.replace(/_/g, "")
            doc.setFont("helvetica", "italic")
            doc.setTextColor(...mediumGray)
            doc.text(text, margin, y)
            doc.setFont("helvetica", "normal")
            doc.setTextColor(...textColor)
            return y + 5
        }

        // Bullet points
        if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
            const text = line.trim()
            doc.setFillColor(...primaryColor)
            doc.circle(margin + 3, y - 1.5, 1, "F")
            doc.text(text.substring(1).trim(), margin + 8, y)
            return y + 5
        }

        // Numbered items
        const numberedMatch = line.match(/^(\d+\.)\s*(.*)/)
        if (numberedMatch) {
            doc.setFont("helvetica", "bold")
            doc.setTextColor(...primaryColor)
            doc.text(numberedMatch[1], margin, y)
            doc.setFont("helvetica", "normal")
            doc.setTextColor(...textColor)
            doc.text(numberedMatch[2], margin + 8, y)
            return y + 6
        }

        // Indented content (starts with spaces)
        if (line.startsWith("   ")) {
            doc.setTextColor(...mediumGray)
            doc.setFontSize(9)
            const wrappedLines = doc.splitTextToSize(line.trim(), contentWidth - 15)
            doc.text(wrappedLines, margin + 12, y)
            doc.setFontSize(10)
            doc.setTextColor(...textColor)
            return y + (wrappedLines.length * 4.5)
        }

        // Regular text with word wrap
        const wrappedLines = doc.splitTextToSize(line, contentWidth)
        doc.text(wrappedLines, margin, y)
        return y + (wrappedLines.length * 5)
    }

    // Render all lines
    for (const line of lines) {
        yPosition = renderLine(line, yPosition)
    }

    // ============= SIGNATURE SECTION =============
    const signatureY = Math.max(yPosition + 20, pageHeight - 55)

    if (signatureY < pageHeight - 30) {
        // Signature area
        doc.setDrawColor(...mediumGray)
        doc.setLineWidth(0.3)
        doc.line(pageWidth - margin - 70, signatureY, pageWidth - margin, signatureY)

        doc.setTextColor(...textColor)
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.text(data.doctorName || "DR. DOCTOR", pageWidth - margin - 35, signatureY + 8, { align: "center" })

        doc.setFontSize(8)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(...mediumGray)
        doc.text("Authorized Signature", pageWidth - margin - 35, signatureY + 14, { align: "center" })
    }

    // ============= FOOTER =============
    doc.setFillColor(...secondaryColor)
    doc.rect(0, pageHeight - 20, pageWidth, 20, "F")

    // Decorative element
    doc.setFillColor(...primaryColor)
    doc.triangle(0, pageHeight - 20, 40, pageHeight - 20, 0, pageHeight, "F")

    doc.setFontSize(7)
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "normal")

    // Footer text
    doc.text("This is a computer-generated prescription.", pageWidth / 2, pageHeight - 13, { align: "center" })
    doc.text("For medical emergencies, contact your healthcare provider immediately.", pageWidth / 2, pageHeight - 8, { align: "center" })

    // Return blob
    const pdfBlob = doc.output("blob")
    return pdfBlob
}
