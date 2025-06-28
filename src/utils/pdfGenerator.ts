import jsPDF from 'jspdf';
import { DailyDigest, Alert, TopicCluster } from '../types';
import { format } from 'date-fns';

export const generateProfessionalReport = (digest: DailyDigest, alerts: Alert[]) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add header on each page
  const addPageHeader = () => {
    // Header background
    pdf.setFillColor(25, 25, 112); // Dark blue
    pdf.rect(0, 0, pageWidth, 35, 'F');
    
    // Department logo area (placeholder)
    pdf.setFillColor(255, 255, 255);
    pdf.rect(margin, 8, 20, 20, 'F');
    pdf.setFontSize(8);
    pdf.setTextColor(25, 25, 112);
    pdf.text('DEPT', margin + 6, 20);
    
    // Header text
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('POLICE DEPARTMENT', margin + 30, 15);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Daily Intelligence Digest', margin + 30, 22);
    
    // Date and classification
    pdf.setFontSize(8);
    pdf.text(`Generated: ${format(new Date(), 'PPP')}`, pageWidth - 80, 15);
    pdf.text('CLASSIFICATION: OFFICIAL USE ONLY', pageWidth - 80, 22);
    
    yPosition = 45;
  };

  // Add first page header
  addPageHeader();

  // Document title and metadata
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('DAILY NEWS ANALYSIS DIGEST', margin, yPosition);
  yPosition += 15;

  // Document metadata box
  pdf.setDrawColor(100, 100, 100);
  pdf.setLineWidth(0.5);
  pdf.rect(margin, yPosition, contentWidth, 35);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('REPORT DETAILS', margin + 5, yPosition + 8);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Report Date: ${format(new Date(digest.date), 'EEEE, MMMM do, yyyy')}`, margin + 5, yPosition + 16);
  pdf.text(`Analysis Period: ${format(new Date(digest.date), 'yyyy-MM-dd')} (24-hour cycle)`, margin + 5, yPosition + 22);
  pdf.text(`Generated At: ${format(new Date(digest.generatedAt), 'PPpp')}`, margin + 5, yPosition + 28);
  
  pdf.text(`Total Articles Processed: ${digest.totalArticles}`, margin + 120, yPosition + 16);
  pdf.text(`Relevant Articles: ${digest.relevantArticles}`, margin + 120, yPosition + 22);
  pdf.text(`Topic Clusters Identified: ${digest.topicClusters.length}`, margin + 120, yPosition + 28);
  
  yPosition += 45;

  // Executive Summary
  checkPageBreak(30);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EXECUTIVE SUMMARY', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const summaryText = `This daily digest presents an analysis of ${digest.totalArticles} news articles from various sources, of which ${digest.relevantArticles} were deemed relevant to police operations. The analysis identified ${digest.topicClusters.length} distinct topic clusters requiring attention, with ${digest.topicClusters.filter(c => c.priority === 'high').length} classified as high priority. Coverage spans ${digest.districts.length} operational districts with particular focus on emerging patterns and potential security implications.`;
  
  const summaryLines = pdf.splitTextToSize(summaryText, contentWidth);
  pdf.text(summaryLines, margin, yPosition);
  yPosition += summaryLines.length * 5 + 10;

  // Active Alerts Section
  if (alerts.length > 0) {
    checkPageBreak(20);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ACTIVE ALERTS', margin, yPosition);
    yPosition += 10;

    alerts.forEach((alert, index) => {
      checkPageBreak(25);
      
      // Alert box
      const alertColor = alert.priority === 'high' ? [255, 235, 235] : 
                        alert.priority === 'medium' ? [255, 248, 235] : [235, 248, 255];
      pdf.setFillColor(alertColor[0], alertColor[1], alertColor[2]);
      pdf.rect(margin, yPosition, contentWidth, 20, 'F');
      
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(margin, yPosition, contentWidth, 20);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`ALERT ${index + 1}: ${alert.title.toUpperCase()}`, margin + 3, yPosition + 6);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`Priority: ${alert.priority.toUpperCase()} | Type: ${alert.type.toUpperCase()}`, margin + 3, yPosition + 12);
      
      const descLines = pdf.splitTextToSize(alert.description, contentWidth - 6);
      pdf.text(descLines, margin + 3, yPosition + 17);
      
      yPosition += 25;
    });
    yPosition += 5;
  }

  // Topic Clusters Analysis
  checkPageBreak(20);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOPIC CLUSTER ANALYSIS', margin, yPosition);
  yPosition += 15;

  digest.topicClusters.forEach((cluster, index) => {
    checkPageBreak(40);
    
    // Cluster header
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
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
    pdf.text(`RISK LEVEL: ${cluster.riskLevel.toUpperCase()}`, margin + 60, yPosition);
    yPosition += 8;
    
    // Affected districts
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Affected Districts: ${cluster.affectedDistricts.join(', ')}`, margin, yPosition);
    yPosition += 6;
    
    // Summary
    pdf.setFont('helvetica', 'normal');
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
      
      cluster.actionItems.slice(0, 3).forEach((action, actionIndex) => {
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
    
    yPosition += 8;
  });

  // Statistical Summary
  checkPageBreak(40);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('STATISTICAL SUMMARY', margin, yPosition);
  yPosition += 15;

  // Create summary table
  const tableData = [
    ['Metric', 'Current Period', 'Previous Week', 'Change'],
    ['Total Articles', digest.totalArticles.toString(), '-', `${digest.weeklyComparison.articlesChange > 0 ? '+' : ''}${digest.weeklyComparison.articlesChange}%`],
    ['Relevant Articles', digest.relevantArticles.toString(), '-', `${Math.round((digest.relevantArticles / digest.totalArticles) * 100)}% relevance`],
    ['High Priority Clusters', digest.topicClusters.filter(c => c.priority === 'high').length.toString(), '-', '-'],
    ['Districts Covered', digest.districts.length.toString(), '-', `Top: ${digest.weeklyComparison.topDistricts[0]}`]
  ];

  // Draw table
  const cellHeight = 8;
  const colWidths = [40, 30, 30, 40];
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
  pdf.text('DISTRIBUTION', margin, yPosition);
  yPosition += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('• Chief of Police', margin, yPosition);
  yPosition += 4;
  pdf.text('• Deputy Chiefs', margin, yPosition);
  yPosition += 4;
  pdf.text('• District Commanders', margin, yPosition);
  yPosition += 4;
  pdf.text('• Intelligence Division', margin, yPosition);
  yPosition += 10;

  // Classification footer
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(128, 128, 128);
  pdf.text('OFFICIAL USE ONLY - LAW ENFORCEMENT SENSITIVE', margin, pageHeight - 15);
  pdf.text(`Page ${pdf.internal.getNumberOfPages()} of ${pdf.internal.getNumberOfPages()}`, pageWidth - 40, pageHeight - 15);

  // Add page numbers to all pages
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    if (i > 1) {
      addPageHeader();
    }
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 15);
  }

  // Save the PDF
  pdf.save(`Police_Daily_Digest_${format(new Date(digest.date), 'yyyy-MM-dd')}.pdf`);
};