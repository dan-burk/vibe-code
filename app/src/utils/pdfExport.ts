import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportWorkspaceToPDF(): Promise<void> {
  const workspace = document.getElementById('workspace')
  if (!workspace) {
    throw new Error('Workspace element not found')
  }

  // Show loading state
  const originalBg = workspace.style.backgroundColor
  workspace.style.backgroundColor = '#ffffff'

  try {
    // Capture the workspace as canvas
    const canvas = await html2canvas(workspace, {
      useCORS: true,
      logging: false,
    })

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    // Calculate dimensions to fit on page
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 15 // mm

    const imgWidth = pageWidth - margin * 2
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Add title
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Math Scribe - Work', margin, margin)

    // Add date
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    pdf.text(date, margin, margin + 7)

    // Add the workspace image
    const imgData = canvas.toDataURL('image/png')
    const imgY = margin + 12

    // Check if image fits on one page
    if (imgHeight > pageHeight - imgY - margin) {
      // Scale down to fit
      const scaleFactor = (pageHeight - imgY - margin) / imgHeight
      pdf.addImage(
        imgData,
        'PNG',
        margin,
        imgY,
        imgWidth * scaleFactor,
        imgHeight * scaleFactor
      )
    } else {
      pdf.addImage(imgData, 'PNG', margin, imgY, imgWidth, imgHeight)
    }

    // Generate filename with date
    const filename = `math-work-${new Date().toISOString().split('T')[0]}.pdf`

    // Save the PDF
    pdf.save(filename)
  } finally {
    // Restore original background
    workspace.style.backgroundColor = originalBg
  }
}
