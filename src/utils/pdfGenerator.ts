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

  // Color scheme for AP State Police
  const colors = {
    primary: [0, 51, 102],      // Deep blue
    secondary: [25, 118, 210],   // Medium blue
    accent: [13, 71, 161],       // Dark blue
    success: [46, 125, 50],      // Green
    warning: [255, 152, 0],      // Orange
    danger: [211, 47, 47],       // Red
    light: [245, 245, 245],      // Light gray
    white: [255, 255, 255]       // White
  };

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Enhanced header design
  const addPageHeader = () => {
    // Main header background with gradient effect
    pdf.setFillColor(...colors.primary);
    pdf.rect(0, 0, pageWidth, 120, 'F');
    
    // Secondary header strip
    pdf.setFillColor(...colors.secondary);
    pdf.rect(0, 90, pageWidth, 30, 'F');
    
    // Official emblem area
    pdf.setFillColor(...colors.white);
    pdf.rect(margin, 15, 50, 50, 'F');
    pdf.setDrawColor(...colors.primary);
    pdf.setLineWidth(2);
    pdf.rect(margin, 15, 50, 50);
    
    // Emblem content
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.primary);
    pdf.text('AP', margin + 18, 35);
    pdf.text('STATE', margin + 12, 45);
    pdf.text('POLICE', margin + 10, 55);
    
    // Main title section - LEFT ALIGNED
    const titleX = margin + 70;
    
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.white);
    pdf.text('AP STATE POLICE', titleX, 35);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Intelligence Analysis & News Monitoring Division', titleX, 50);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Daily Intelligence Digest Report', titleX, 62);
    
    // Classification section - RIGHT ALIGNED
    const classificationX = pageWidth - 150;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Generated: ${format(new Date(), 'dd/MM/yyyy')} IST`, classificationX, 25);
    
    pdf.setFontSize(9);
    pdf.text('CLASSIFICATION: RESTRICTED', classificationX, 38);
    pdf.text('FOR OFFICIAL USE ONLY', classificationX, 50);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('AP STATE POLICE', classificationX, 62);
    
    // Decorative elements
    pdf.setDrawColor(...colors.white);
    pdf.setLineWidth(1);
    pdf.line(margin, 75, pageWidth - margin, 75);
    
    // Status indicator
    pdf.setFillColor(...colors.success);
    pdf.circle(pageWidth - 30, 100, 3, 'F');
    pdf.setFontSize(8);
    pdf.setTextColor(...colors.white);
    pdf.text('ACTIVE', pageWidth - 45, 105);
    
    yPosition = 140;
  };

  // Add first page header
  addPageHeader();

  // Document title with enhanced styling
  pdf.setFillColor(...colors.light);
  pdf.rect(margin, yPosition, contentWidth, 40, 'F');
  pdf.setDrawColor(...colors.primary);
  pdf.setLineWidth(1);
  pdf.rect(margin, yPosition, contentWidth, 40);
  
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.primary);
  pdf.text('DAILY INTELLIGENCE DIGEST', margin + 10, yPosition + 15);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...colors.accent);
  pdf.text('AP State Police - Comprehensive News Analysis Report', margin + 10, yPosition + 28);
  
  yPosition += 55;

  // Document metadata in professional table format
  const metadataHeaders = ['Report Details', 'Analysis Metrics'];
  const metadataData = [
    [`Report Date: ${format(new Date(digest.date), 'EEEE, MMMM do, yyyy')}`, `Total Articles: ${digest.totalArticles}`],
    [`Analysis Period: 24-hour monitoring cycle`, `Relevant Articles: ${digest.relevantArticles}`],
    [`Generated: ${format(new Date(digest.generatedAt), 'PPpp')} IST`, `Topic Clusters: ${digest.topicClusters.length}`],
    [`Authority: AP State Police Intelligence`, `Districts Covered: ${digest.districts.length}`]
  ];

  // Metadata table
  const tableStartY = yPosition;
  const colWidth = contentWidth / 2;
  const rowHeight = 15;

  // Table headers
  pdf.setFillColor(...colors.primary);
  pdf.rect(margin, tableStartY, colWidth, rowHeight, 'F');
  pdf.rect(margin + colWidth, tableStartY, colWidth, rowHeight, 'F');
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.white);
  pdf.text(metadataHeaders[0], margin + 5, tableStartY + 10);
  pdf.text(metadataHeaders[1], margin + colWidth + 5, tableStartY + 10);

  // Table data
  metadataData.forEach((row, index) => {
    const rowY = tableStartY + rowHeight + (index * rowHeight);
    
    // Alternating row colors
    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, rowY, contentWidth, rowHeight, 'F');
    }
    
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(margin, rowY, colWidth, rowHeight);
    pdf.rect(margin + colWidth, rowY, colWidth, rowHeight);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(row[0], margin + 5, rowY + 10);
    pdf.text(row[1], margin + colWidth + 5, rowY + 10);
  });

  yPosition = tableStartY + rowHeight + (metadataData.length * rowHeight) + 30;

  // Executive Summary with enhanced design
  checkPageBreak(60);
  
  pdf.setFillColor(...colors.secondary);
  pdf.rect(margin, yPosition, contentWidth, 25, 'F');
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.white);
  pdf.text('EXECUTIVE SUMMARY', margin + 10, yPosition + 16);
  
  yPosition += 35;

  const summaryText = `This comprehensive intelligence digest analyzes ${digest.totalArticles} news articles from regional and national sources across Andhra Pradesh. Our automated analysis identified ${digest.relevantArticles} operationally relevant articles, generating ${digest.topicClusters.length} distinct intelligence clusters. ${digest.topicClusters.filter(c => c.priority === 'high').length} clusters require immediate attention. Coverage spans all ${digest.districts.length} AP districts with focus on security patterns, public safety, and operational intelligence.`;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  const summaryLines = pdf.splitTextToSize(summaryText, contentWidth - 20);
  
  pdf.setFillColor(248, 249, 250);
  pdf.rect(margin, yPosition, contentWidth, summaryLines.length * 5 + 20, 'F');
  pdf.setDrawColor(...colors.secondary);
  pdf.setLineWidth(0.5);
  pdf.rect(margin, yPosition, contentWidth, summaryLines.length * 5 + 20);
  
  pdf.text(summaryLines, margin + 10, yPosition + 15);
  yPosition += summaryLines.length * 5 + 40;

  // Critical Alerts Section
  if (alerts.length > 0) {
    checkPageBreak(80);
    
    pdf.setFillColor(...colors.danger);
    pdf.rect(margin, yPosition, contentWidth, 25, 'F');
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.white);
    pdf.text('CRITICAL ALERTS & IMMEDIATE ACTIONS', margin + 10, yPosition + 16);
    
    yPosition += 35;

    alerts.forEach((alert, index) => {
      checkPageBreak(70);
      
      const alertColors = {
        high: [255, 235, 235],
        medium: [255, 248, 235],
        low: [235, 248, 255]
      };
      
      const borderColors = {
        high: [220, 38, 38],
        medium: [245, 158, 11],
        low: [59, 130, 246]
      };
      
      const bgColor = alertColors[alert.priority as keyof typeof alertColors] || alertColors.low;
      const borderColor = borderColors[alert.priority as keyof typeof borderColors] || borderColors.low;
      
      pdf.setFillColor(...bgColor);
      pdf.rect(margin, yPosition, contentWidth, 60, 'F');
      
      pdf.setDrawColor(...borderColor);
      pdf.setLineWidth(2);
      pdf.rect(margin, yPosition, contentWidth, 60);
      
      // Alert header
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`ALERT ${index + 1}: ${alert.title.toUpperCase()}`, margin + 8, yPosition + 15);
      
      // Alert metadata
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Priority: ${alert.priority.toUpperCase()} | Type: ${alert.type.toUpperCase()} | Districts: ${alert.districts.join(', ')}`, margin + 8, yPosition + 28);
      
      // Alert description
      const descLines = pdf.splitTextToSize(alert.description, contentWidth - 16);
      pdf.text(descLines, margin + 8, yPosition + 40);
      
      if (alert.actionRequired) {
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...colors.danger);
        pdf.text('⚠ IMMEDIATE ACTION REQUIRED', margin + 8, yPosition + 52);
      }
      
      yPosition += 70;
    });
    yPosition += 20;
  }

  // Intelligence Analysis Section
  checkPageBreak(60);
  
  pdf.setFillColor(...colors.accent);
  pdf.rect(margin, yPosition, contentWidth, 25, 'F');
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.white);
  pdf.text('DISTRICT-WISE INTELLIGENCE ANALYSIS', margin + 10, yPosition + 16);
  
  yPosition += 35;

  digest.topicClusters.forEach((cluster, index) => {
    checkPageBreak(100);
    
    // Cluster header with numbering
    pdf.setFillColor(240, 242, 247);
    pdf.rect(margin, yPosition, contentWidth, 20, 'F');
    pdf.setDrawColor(...colors.primary);
    pdf.setLineWidth(1);
    pdf.rect(margin, yPosition, contentWidth, 20);
    
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.primary);
    pdf.text(`${index + 1}. ${cluster.title.toUpperCase()}`, margin + 8, yPosition + 13);
    
    yPosition += 30;
    
    // Priority and risk indicators
    const priorityColors = {
      high: colors.danger,
      medium: colors.warning,
      low: colors.success
    };
    
    const riskColors = {
      critical: colors.danger,
      high: [255, 87, 34],
      medium: colors.warning,
      low: colors.success
    };
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    
    // Priority badge
    const pColor = priorityColors[cluster.priority as keyof typeof priorityColors] || colors.success;
    pdf.setTextColor(...pColor);
    pdf.text(`PRIORITY: ${cluster.priority.toUpperCase()}`, margin, yPosition);
    
    // Risk badge
    const rColor = riskColors[cluster.riskLevel as keyof typeof riskColors] || colors.success;
    pdf.setTextColor(...rColor);
    pdf.text(`RISK ASSESSMENT: ${cluster.riskLevel.toUpperCase()}`, margin + 150, yPosition);
    
    yPosition += 20;
    
    // Affected districts
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Affected Districts: ${cluster.affectedDistricts.join(', ')}`, margin, yPosition);
    yPosition += 15;
    
    // Summary
    const summaryLines = pdf.splitTextToSize(cluster.summary, contentWidth);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 5 + 15;
    
    // Metrics
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Source Articles: ${cluster.articles.length} | Media Sources: ${cluster.trends.sources.join(', ')}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Sentiment Analysis: ${cluster.trends.sentiment} | Weekly Trend: ${cluster.trends.weeklyTrend}`, margin, yPosition);
    yPosition += 15;
    
    // Action items
    if (cluster.actionItems && cluster.actionItems.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text('Recommended Operational Actions:', margin, yPosition);
      yPosition += 12;
      
      cluster.actionItems.slice(0, 3).forEach((action, actionIndex) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        const actionLines = pdf.splitTextToSize(`${actionIndex + 1}. ${action}`, contentWidth - 12);
        pdf.text(actionLines, margin + 8, yPosition);
        yPosition += actionLines.length * 5 + 3;
      });
      
      if (cluster.actionItems.length > 3) {
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(100, 100, 100);
        pdf.text(`... and ${cluster.actionItems.length - 3} additional recommendations`, margin + 8, yPosition);
        yPosition += 8;
      }
    }
    
    yPosition += 25;
  });

  // Statistical Summary
  checkPageBreak(120);
  
  pdf.setFillColor(...colors.success);
  pdf.rect(margin, yPosition, contentWidth, 25, 'F');
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.white);
  pdf.text('STATISTICAL ANALYSIS & TRENDS', margin + 10, yPosition + 16);
  
  yPosition += 35;

  // Enhanced statistics table
  const statsData = [
    ['Intelligence Metric', 'Current Period', 'Comparison', 'Trend Analysis'],
    ['Total News Articles', digest.totalArticles.toString(), 'Previous Week', `${digest.weeklyComparison.articlesChange > 0 ? '+' : ''}${digest.weeklyComparison.articlesChange}%`],
    ['Relevant Articles', digest.relevantArticles.toString(), 'Relevance Rate', `${Math.round((digest.relevantArticles / digest.totalArticles) * 100)}%`],
    ['High Priority Clusters', digest.topicClusters.filter(c => c.priority === 'high').length.toString(), 'Critical Items', `${Math.round((digest.topicClusters.filter(c => c.priority === 'high').length / digest.topicClusters.length) * 100)}%`],
    ['Districts Monitored', digest.districts.length.toString(), 'Primary Focus', digest.weeklyComparison.topDistricts[0]],
    ['Media Sources', '6 Major Outlets', 'Coverage Type', 'Regional & National']
  ];

  const cellHeight = 20;
  const colWidths = [60, 40, 40, 40];
  let tableY = yPosition;

  statsData.forEach((row, rowIndex) => {
    let cellX = margin;
    
    row.forEach((cell, colIndex) => {
      if (rowIndex === 0) {
        pdf.setFillColor(...colors.primary);
        pdf.rect(cellX, tableY, colWidths[colIndex], cellHeight, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...colors.white);
        pdf.setFontSize(10);
      } else {
        if (rowIndex % 2 === 0) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(cellX, tableY, colWidths[colIndex], cellHeight, 'F');
        }
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(9);
      }
      
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(cellX, tableY, colWidths[colIndex], cellHeight);
      
      const textLines = pdf.splitTextToSize(cell, colWidths[colIndex] - 6);
      pdf.text(textLines, cellX + 3, tableY + 13);
      cellX += colWidths[colIndex];
    });
    
    tableY += cellHeight;
  });

  yPosition = tableY + 30;

  // Distribution and Authorization
  checkPageBreak(100);
  
  pdf.setFillColor(...colors.secondary);
  pdf.rect(margin, yPosition, contentWidth, 25, 'F');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.white);
  pdf.text('OFFICIAL DISTRIBUTION', margin + 10, yPosition + 16);
  
  yPosition += 35;

  const distributionList = [
    'Director General of Police, Andhra Pradesh',
    'Additional Director General (Intelligence)',
    'Inspector General (Law & Order)',
    'Deputy Inspector General (Coastal Security)',
    'Superintendents of Police - All Districts',
    'Additional Superintendents of Police',
    'Intelligence Division - State Headquarters',
    'Coastal Security Group',
    'Special Branch - All Districts'
  ];

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  distributionList.forEach((recipient, index) => {
    pdf.text(`${index + 1}. ${recipient}`, margin + 8, yPosition);
    yPosition += 12;
  });

  yPosition += 20;

  // Authorization
  pdf.setFillColor(245, 245, 245);
  pdf.rect(margin, yPosition, contentWidth, 40, 'F');
  pdf.setDrawColor(...colors.primary);
  pdf.rect(margin, yPosition, contentWidth, 40);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.primary);
  pdf.text('DOCUMENT AUTHORIZATION', margin + 8, yPosition + 15);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Generated by AP State Police Intelligence Analysis System', margin + 8, yPosition + 25);
  pdf.text(`Document ID: APSP-IAS-${format(new Date(), 'yyyyMMdd')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, margin + 8, yPosition + 35);

  // Add headers and footers to all pages
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    if (i > 1) {
      addPageHeader();
    }
    
    // Professional footer
    pdf.setFillColor(...colors.primary);
    pdf.rect(0, pageHeight - 30, pageWidth, 30, 'F');
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.white);
    pdf.text('RESTRICTED - FOR OFFICIAL USE ONLY - AP STATE POLICE', margin, pageHeight - 18);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated: ${format(new Date(), 'dd/MM/yyyy')} IST | Classification: RESTRICTED`, margin, pageHeight - 10);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 50, pageHeight - 10);
  }

  // Save with official naming
  pdf.save(`AP_State_Police_Intelligence_Digest_${format(new Date(digest.date), 'yyyy-MM-dd')}.pdf`);
};