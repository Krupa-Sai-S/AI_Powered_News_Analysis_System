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

  // Helper function to check page break
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 30) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Header with styling
  pdf.setFillColor(30, 64, 175); // AP Blue
  pdf.rect(0, 0, pageWidth, 35, 'F');
  
  // Logo placeholder
  pdf.setFillColor(255, 255, 255);
  pdf.rect(margin, 8, 20, 20, 'F');
  pdf.setFontSize(8);
  pdf.setTextColor(30, 64, 175);
  pdf.text('AP', margin + 7, 20);
  
  // Header text - Updated to use "AP STATE POLICE"
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('AP STATE POLICE', margin + 30, 15);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Intelligence Analysis & News Monitoring Division', margin + 30, 25);
  
  // Date and classification
  pdf.setFontSize(8);
  pdf.text(`Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, pageWidth - 80, 15);
  pdf.text('CLASSIFICATION: OFFICIAL USE ONLY', pageWidth - 80, 22);
  
  yPosition = 45;

  // Document title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('DAILY INTELLIGENCE DIGEST', margin, yPosition);
  yPosition += 15;

  // Document info box
  pdf.setDrawColor(100, 100, 100);
  pdf.setLineWidth(0.5);
  pdf.rect(margin, yPosition, contentWidth, 30);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('REPORT DETAILS', margin + 5, yPosition + 8);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Report Date: ${format(new Date(digest.date), 'EEEE, MMMM do, yyyy')}`, margin + 5, yPosition + 16);
  pdf.text(`Analysis Period: ${format(new Date(digest.date), 'yyyy-MM-dd')} (24-hour cycle)`, margin + 5, yPosition + 22);
  
  pdf.text(`Total Articles: ${digest.totalArticles}`, margin + 120, yPosition + 16);
  pdf.text(`Relevant Articles: ${digest.relevantArticles}`, margin + 120, yPosition + 22);
  
  yPosition += 40;

  // Executive Summary
  checkPageBreak(25);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 64, 175);
  pdf.text('EXECUTIVE SUMMARY', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  const summaryText = `This daily digest presents analysis of ${digest.totalArticles} news articles from regional sources, with ${digest.relevantArticles} deemed operationally relevant. Analysis identified ${digest.topicClusters.length} distinct topic clusters, with ${digest.topicClusters.filter(c => c.priority === 'high').length} classified as high priority. Coverage spans ${digest.districts.length} operational districts of Andhra Pradesh.`;
  
  const summaryLines = pdf.splitTextToSize(summaryText, contentWidth);
  pdf.text(summaryLines, margin, yPosition);
  yPosition += summaryLines.length * 5 + 15;

  // Active Alerts Section
  if (alerts.length > 0) {
    checkPageBreak(20);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 64, 175);
    pdf.text('ACTIVE ALERTS', margin, yPosition);
    yPosition += 10;

    alerts.forEach((alert, index) => {
      checkPageBreak(25);
      
      // Alert priority color
      const alertColor = alert.priority === 'high' ? [255, 235, 235] : 
                        alert.priority === 'medium' ? [255, 248, 235] : [235, 248, 255];
      pdf.setFillColor(alertColor[0], alertColor[1], alertColor[2]);
      pdf.rect(margin, yPosition, contentWidth, 18, 'F');
      
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(margin, yPosition, contentWidth, 18);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`ALERT ${index + 1}: ${alert.title.toUpperCase()}`, margin + 3, yPosition + 6);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`Priority: ${alert.priority.toUpperCase()} | Type: ${alert.type.toUpperCase()}`, margin + 3, yPosition + 12);
      
      const descLines = pdf.splitTextToSize(alert.description, contentWidth - 6);
      pdf.text(descLines, margin + 3, yPosition + 16);
      
      yPosition += 22;
    });
    yPosition += 10;
  }

  // Topic Clusters Analysis
  checkPageBreak(20);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 64, 175);
  pdf.text('TOPIC CLUSTER ANALYSIS', margin, yPosition);
  yPosition += 15;

  digest.topicClusters.forEach((cluster, index) => {
    checkPageBreak(35);
    
    // Cluster header
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${index + 1}. ${cluster.title.toUpperCase()}`, margin, yPosition);
    yPosition += 8;
    
    // Priority and risk indicators
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    const priorityColor = cluster.priority === 'high' ? [255, 0, 0] : 
                         cluster.priority === 'medium' ? [255, 165, 0] : [0, 128, 0];
    pdf.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
    pdf.text(`PRIORITY: ${cluster.priority.toUpperCase()}`, margin, yPosition);
    
    const riskColor = cluster.riskLevel === 'critical' ? [255, 0, 0] : 
                     cluster.riskLevel === 'high' ? [255, 100, 0] : 
                     cluster.riskLevel === 'medium' ? [255, 165, 0] : [0, 128, 0];
    pdf.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
    pdf.text(`RISK: ${cluster.riskLevel.toUpperCase()}`, margin + 60, yPosition);
    yPosition += 8;
    
    // Affected districts
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Districts: ${cluster.affectedDistricts.join(', ')}`, margin, yPosition);
    yPosition += 6;
    
    // Summary
    const summaryLines = pdf.splitTextToSize(cluster.summary, contentWidth);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 4 + 5;
    
    // Article count and sources
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text(`Articles: ${cluster.articles.length} | Sources: ${cluster.trends.sources.join(', ')} | Sentiment: ${cluster.trends.sentiment}`, margin, yPosition);
    yPosition += 8;
    
    // Action items if available
    if (cluster.actionItems && cluster.actionItems.length > 0) {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Recommended Actions:', margin, yPosition);
      yPosition += 5;
      
      cluster.actionItems.slice(0, 3).forEach((action) => {
        pdf.setFont('helvetica', 'normal');
        const actionLines = pdf.splitTextToSize(`• ${action}`, contentWidth - 10);
        pdf.text(actionLines, margin + 5, yPosition);
        yPosition += actionLines.length * 4;
      });
      
      if (cluster.actionItems.length > 3) {
        pdf.setFont('helvetica', 'italic');
        pdf.text(`... and ${cluster.actionItems.length - 3} additional recommendations`, margin + 5, yPosition);
        yPosition += 4;
      }
    }
    
    yPosition += 10;
  });

  // Statistical Summary
  checkPageBreak(40);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 64, 175);
  pdf.text('STATISTICAL SUMMARY', margin, yPosition);
  yPosition += 15;

  // Create summary table
  const tableData = [
    ['Metric', 'Current', 'Analysis'],
    ['Total Articles', digest.totalArticles.toString(), `${Math.round((digest.relevantArticles / digest.totalArticles) * 100)}% relevant`],
    ['High Priority Clusters', digest.topicClusters.filter(c => c.priority === 'high').length.toString(), 'Immediate attention required'],
    ['Districts Covered', digest.districts.length.toString(), `Primary: ${digest.weeklyComparison.topDistricts[0]}`],
    ['Weekly Change', `${digest.weeklyComparison.articlesChange > 0 ? '+' : ''}${digest.weeklyComparison.articlesChange}%`, 'Compared to previous week']
  ];

  // Draw table with styling
  const cellHeight = 8;
  const colWidths = [50, 30, 70];
  let tableY = yPosition;

  tableData.forEach((row, rowIndex) => {
    let cellX = margin;
    
    row.forEach((cell, colIndex) => {
      // Header row styling
      if (rowIndex === 0) {
        pdf.setFillColor(240, 240, 240);
        pdf.rect(cellX, tableY, colWidths[colIndex], cellHeight, 'F');
        pdf.setFont('helvetica', 'bold');
      } else {
        pdf.setFont('helvetica', 'normal');
      }
      
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(cellX, tableY, colWidths[colIndex], cellHeight);
      
      pdf.setFontSize(8);
      pdf.setTextColor(0, 0, 0);
      pdf.text(cell, cellX + 2, tableY + 5);
      cellX += colWidths[colIndex];
    });
    
    tableY += cellHeight;
  });

  yPosition = tableY + 15;

  // Footer section
  checkPageBreak(25);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 64, 175);
  pdf.text('DISTRIBUTION', margin, yPosition);
  yPosition += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(0, 0, 0);
  const distributionList = [
    'Director General of Police, AP',
    'Additional DGP (Intelligence)',
    'Inspector General (Law & Order)',
    'Superintendents of Police - All Districts',
    'Intelligence Division - State HQ'
  ];

  distributionList.forEach((item) => {
    pdf.text(`• ${item}`, margin, yPosition);
    yPosition += 4;
  });

  // Add page numbers and footers to all pages
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Footer line
    pdf.setDrawColor(30, 64, 175);
    pdf.setLineWidth(0.5);
    pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
    
    // Footer text - Updated to use "AP STATE POLICE"
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 64, 175);
    pdf.text('OFFICIAL USE ONLY - AP STATE POLICE', margin, pageHeight - 12);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 12);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, pageWidth - 80, pageHeight - 6);
  }

  // Save the PDF
  pdf.save(`AP_State_Police_Daily_Digest_${format(new Date(digest.date), 'yyyy-MM-dd')}.pdf`);
};