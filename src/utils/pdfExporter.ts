import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportToPdf(
  elementId: string, 
  filename: string = 'bill_invoice.pdf',
  options: {
    format?: 'a4' | 'thermal' | 'auto';
    orientation?: 'portrait' | 'landscape';
  } = {}
) {
  const container = document.getElementById(elementId);
  if (!container) {
    console.error(`Element #${elementId} not found`);
    return;
  }

  // Target the pure document element inside (avoiding any outer UI wrapper, shadows or padding)
  const targetElement = (container.firstElementChild as HTMLElement) || container;

  try {
    const canvas = await html2canvas(targetElement, {
      scale: 3, // Ultra-sharp 300+ DPI output for barcodes, numbers & QR codes
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      ignoreElements: (element) => {
        return (
          element.classList.contains('no-export') ||
          element.classList.contains('no-print') ||
          element.getAttribute('data-no-export') === 'true'
        );
      },
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const { format = 'a4', orientation = 'portrait' } = options;

    if (format === 'thermal') {
      // Thermal receipt dimensions (standard 80mm roll width)
      const widthMm = 80;
      const heightMm = (canvas.height * widthMm) / canvas.width;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [widthMm, heightMm + 6],
      });
      pdf.addImage(imgData, 'PNG', 0, 3, widthMm, heightMm);
      pdf.save(filename);
    } else {
      // Standard A4 document format
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const marginMm = 6;
      const imgWidth = pdfWidth - (marginMm * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= pdfHeight - (marginMm * 2)) {
        // Fits entirely on a single page
        const topOffset = marginMm;
        pdf.addImage(imgData, 'PNG', marginMm, topOffset, imgWidth, imgHeight);
      } else {
        // Multi-page automatic page division
        let heightLeft = imgHeight;
        let position = marginMm;

        pdf.addImage(imgData, 'PNG', marginMm, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - marginMm);

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', marginMm, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
      }

      pdf.save(filename);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try using the browser Print option.');
  }
}

export async function exportToImage(elementId: string, filename: string = 'bill.png') {
  const container = document.getElementById(elementId);
  if (!container) return;

  const targetElement = (container.firstElementChild as HTMLElement) || container;

  try {
    const canvas = await html2canvas(targetElement, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      ignoreElements: (element) => {
        return (
          element.classList.contains('no-export') ||
          element.classList.contains('no-print') ||
          element.getAttribute('data-no-export') === 'true'
        );
      },
    });
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  } catch (error) {
    console.error('Error exporting image:', error);
  }
}

export function triggerPrint() {
  window.print();
}
