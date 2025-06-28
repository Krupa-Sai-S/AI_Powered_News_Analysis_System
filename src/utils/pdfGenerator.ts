import jsPDF from 'jspdf';
import { DailyDigest, Alert } from '../types';
import { format } from 'date-fns';

export const generateProfessionalReport = (digest: DailyDigest, alerts: Alert[]) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Simple header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AP State Police Daily Report', margin, yPosition);
  yPosition += 15;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Date: ${format(new Date(digest.date), 'MMMM dd, yyyy')}`, margin, yPosition);
  yPosition += 10;
  pdf.text(`Generated: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}`, margin, yPosition);
  yPosition += 20;

  // Summary section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Summary', margin, yPosition);
  yPosition += 15;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Total Articles: ${digest.totalArticles}`, margin, yPosition);
  yPosition += 8;
  pdf.text(`Relevant Articles: ${digest.relevantArticles}`, margin, yPosition);
  yPosition += 8;
  pdf.text(`Topic Clusters: ${digest.topicClusters.length}`, margin, yPosition);
  yPosition += 8;
  pdf.text(`Districts Covered: ${digest.districts.length}`, margin, yPosition);
  yPosition += 20;

  // Alerts section
  if (alerts.length > 0) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Active Alerts', margin, yPosition);
    yPosition += 15;

    alerts.forEach((alert, index) => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}. ${alert.title}`, margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Priority: ${alert.priority} | Type: ${alert.type}`, margin + 5, yPosition);
      yPosition += 8;
      
      const descLines = pdf.splitTextToSize(alert.description, contentWidth - 10);
      pdf.text(descLines, margin + 5, yPosition);
      yPosition += descLines.length * 5 + 10;
    });
    yPosition += 10;
  }

  // Topic clusters section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Topic Clusters', margin, yPosition);
  yPosition += 15;

  digest.topicClusters.forEach((cluster, index) => {
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${index + 1}. ${cluster.title}`, margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Priority: ${cluster.priority} | Districts: ${cluster.affectedDistricts.join(', ')}`, margin + 5, yPosition);
    yPosition += 8;

    const summaryLines = pdf.splitTextToSize(cluster.summary, contentWidth - 10);
    pdf.text(summaryLines, margin + 5, yPosition);
    yPosition += summaryLines.length * 5;

    pdf.text(`Articles: ${cluster.articles.length} | Sentiment: ${cluster.trends.sentiment}`, margin + 5, yPosition);
    yPosition += 15;
  });

  // Footer
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`AP State Police - Page ${i} of ${totalPages}`, margin, pageHeight - 10);
    pdf.text(`Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, pageWidth - 80, pageHeight - 10);
  }

  // Save the PDF
  pdf.save(`AP_State_Police_Report_${format(new Date(digest.date), 'yyyy-MM-dd')}.pdf`);
};