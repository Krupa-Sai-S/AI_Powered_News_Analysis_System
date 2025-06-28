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
    // MASSIVE HEADER BACKGROUND - MUCH LARGER HEIGHT
    pdf.setFillColor(0, 51, 102); // Deep blue
    pdf.rect(0, 0, pageWidth, 100, 'F'); // INCREASED HEIGHT to 100px (was 80px)
    
    // State emblem area (placeholder) - REPOSITIONED
    pdf.setFillColor(255, 255, 255);
    pdf.rect(margin, 20, 35, 35, 'F'); // Larger emblem area, moved down
    pdf.setFontSize(8);
    pdf.setTextColor(0, 51, 102);
    pdf.text('AP', margin + 14, 35);
    pdf.text('POLICE', margin + 10, 45);
    
    // LEFT SIDE - Official header text with MAXIMUM SPACING
    const leftColumnX = margin + 45; // More space from emblem
    
    pdf.setFontSize(18); // Larger font
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('ANDHRA PRADESH STATE POLICE', leftColumnX, 30); // Moved down
    
    pdf.setFontSize(11); // Larger font
    pdf.setFont('helvetica', 'normal');
    pdf.text('Intelligence Analysis & News Monitoring Division', leftColumnX, 45); // 15px gap
    
    pdf.setFontSize(10);
    pdf.text('Daily Intelligence Digest Report', leftColumnX, 58); // 13px gap
    
    // RIGHT SIDE - Classification and metadata with EXTREME SPACING
    const rightColumnX = pageWidth - 140; // MUCH MORE space from right edge (was -120, now -140)
    
    pdf.setFontSize(9); // Larger font
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Generated: ${format(new Date(), 'dd/MM/yyyy')} IST`, rightColumnX, 25); // Moved down
    
    pdf.text('CLASSIFICATION: RESTRICTED', rightColumnX, 40); // 15px gap
    
    pdf.text('FOR OFFICIAL USE ONLY', rightColumnX, 55); // 15px gap
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('ANDHRA PRADESH POLICE', rightColumnX, 70); // 15px gap
    
    // Add multiple separator lines for maximum visual separation
    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(1);
    
    // Main horizontal separator
    pdf.line(margin, 85, pageWidth - margin, 85);
    
    // Vertical separator between left and right content
    pdf.line(rightColumnX - 15, 20, rightColumnX - 15, 75);
    
    // Additional decorative lines
    pdf.setLineWidth(0.5);
    pdf.line(margin, 82, pageWidth - margin, 82);
    pdf.line(margin, 88, pageWidth - margin, 88);
    
    yPosition = 110; // SIGNIFICANTLY INCREASED to accommodate much larger header (was 90, now 110)
  };

  // Add first page header
  addPageHeader();

  // Document title and metadata with enhanced spacing
  pdf.setFontSize(24); // Larger title
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('DAILY INTELLIGENCE DIGEST', margin, yPosition);
  
  pdf.setFontSize(16); // Larger subtitle
  pdf.setTextColor(0, 0, 0);
  pdf.text('Andhra Pradesh State Police - News Analysis Report', margin, yPosition + 20); // Increased gap
  yPosition += 45; // More space after title

  // Official document metadata box with enhanced spacing
  pdf.setDrawColor(0, 51, 102);
  pdf.setLineWidth(2); // Thicker border
  pdf.rect(margin, yPosition, contentWidth, 70); // Increased height for better spacing
  
  // Inner border for professional look
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.rect(margin + 4, yPosition + 4, contentWidth - 8, 62);
  
  pdf.setFontSize(14); // Larger header
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('OFFICIAL DOCUMENT DETAILS', margin + 12, yPosition + 20);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10); // Larger text
  
  // Left column with enhanced spacing
  pdf.text(`Report Date: ${format(new Date(digest.date), 'EEEE, MMMM do, yyyy')}`, margin + 12, yPosition + 35);
  pdf.text(`Analysis Period: ${format(new Date(digest.date), 'yyyy-MM-dd')} (24-hour monitoring cycle)`, margin + 12, yPosition + 45);
  pdf.text(`Generated At: ${format(new Date(digest.generatedAt), 'PPpp')} IST`, margin + 12, yPosition + 55);
  pdf.text(`Reporting Authority: AP State Police Intelligence Division`, margin + 12, yPosition + 65);
  
  // Right column with enhanced spacing - MAXIMUM SEPARATION
  const rightDataX = margin + 140; // Even more separation between columns
  pdf.text(`Total News Articles Processed: ${digest.totalArticles}`, rightDataX, yPosition + 35);
  pdf.text(`Operationally Relevant Articles: ${digest.relevantArticles}`, rightDataX, yPosition + 45);
  pdf.text(`Intelligence Topic Clusters: ${digest.topicClusters.length}`, rightDataX, yPosition + 55);
  pdf.text(`Districts Under Analysis: ${digest.districts.length}`, rightDataX, yPosition + 65);
  
  yPosition += 85; // More space after metadata box

  // Executive Summary
  checkPageBreak(50);
  pdf.setFontSize(18); // Larger section header
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('EXECUTIVE SUMMARY', margin, yPosition);
  yPosition += 25; // Increased spacing

  pdf.setFontSize(11); // Larger body text
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  const summaryText = `This daily intelligence digest presents a comprehensive analysis of ${digest.totalArticles} news articles from regional and national media sources covering Andhra Pradesh. Of these, ${digest.relevantArticles} articles were classified as operationally relevant to state police activities. The automated analysis system identified ${digest.topicClusters.length} distinct intelligence clusters requiring attention, with ${digest.topicClusters.filter(c => c.priority === 'high').length} classified as high priority for immediate action. Coverage encompasses all ${digest.districts.length} operational districts of Andhra Pradesh, with particular emphasis on emerging security patterns, public safety concerns, and operational intelligence requirements.`;
  
  const summaryLines = pdf.splitTextToSize(summaryText, contentWidth);
  pdf.text(summaryLines, margin, yPosition);
  yPosition += summaryLines.length * 6 + 35; // More space after summary

  // Critical Alerts Section
  if (alerts.length > 0) {
    checkPageBreak(50);
    pdf.setFontSize(18); // Larger section header
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 51, 102);
    pdf.text('CRITICAL ALERTS & IMMEDIATE ACTION ITEMS', margin, yPosition);
    yPosition += 25; // Increased spacing

    alerts.forEach((alert, index) => {
      checkPageBreak(55);
      
      // Alert priority box with enhanced spacing
      const alertColors = {
        high: [255, 235, 235, 220, 38, 38],
        medium: [255, 248, 235, 245, 158, 11],
        low: [235, 248, 255, 59, 130, 246]
      };
      const [bgR, bgG, bgB, borderR, borderG, borderB] = alertColors[alert.priority as keyof typeof alertColors] || alertColors.low;
      
      pdf.setFillColor(bgR, bgG, bgB);
      pdf.rect(margin, yPosition, contentWidth, 50, 'F'); // Increased height
      
      pdf.setDrawColor(borderR, borderG, borderB);
      pdf.setLineWidth(2); // Thicker border
      pdf.rect(margin, yPosition, contentWidth, 50);
      
      pdf.setFontSize(12); // Larger alert title
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`ALERT ${index + 1}: ${alert.title.toUpperCase()}`, margin + 8, yPosition + 15);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`Priority: ${alert.priority.toUpperCase()} | Type: ${alert.type.toUpperCase()}`, margin + 8, yPosition + 25);
      pdf.text(`Districts: ${alert.districts.join(', ')}`, margin + 8, yPosition + 35);
      
      const descLines = pdf.splitTextToSize(alert.description, contentWidth - 16);
      pdf.text(descLines, margin + 8, yPosition + 42);
      
      if (alert.actionRequired) {
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(220, 38, 38);
        pdf.text('⚠ IMMEDIATE ACTION REQUIRED', margin + 8, yPosition + 47);
      }
      
      yPosition += 55; // Increased spacing between alerts
    });
    yPosition += 30; // More space after alerts section
  }

  // District-wise Intelligence Analysis
  checkPageBreak(50);
  pdf.setFontSize(18); // Larger section header
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('DISTRICT-WISE INTELLIGENCE ANALYSIS', margin, yPosition);
  yPosition += 35; // Increased spacing

  digest.topicClusters.forEach((cluster, index) => {
    checkPageBreak(80);
    
    // Cluster header with numbering and enhanced spacing
    pdf.setFontSize(14); // Larger cluster title
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${index + 1}. ${cluster.title.toUpperCase()}`, margin, yPosition);
    yPosition += 22; // Increased spacing
    
    // Priority and risk assessment with enhanced spacing
    pdf.setFontSize(10); // Larger indicators
    pdf.setFont('helvetica', 'bold');
    
    // Priority indicator
    const priorityColors = {
      high: [220, 38, 38],
      medium: [245, 158, 11],
      low: [34, 197, 94]
    };
    const [pR, pG, pB] = priorityColors[cluster.priority as keyof typeof priorityColors] || [100, 100, 100];
    pdf.setTextColor(pR, pG, pB);
    pdf.text(`PRIORITY: ${cluster.priority.toUpperCase()}`, margin, yPosition);
    
    // Risk level indicator with enhanced spacing
    const riskColors = {
      critical: [220, 38, 38],
      high: [245, 101, 101],
      medium: [245, 158, 11],
      low: [34, 197, 94]
    };
    const [rR, rG, rB] = riskColors[cluster.riskLevel as keyof typeof riskColors] || [100, 100, 100];
    pdf.setTextColor(rR, rG, rB);
    pdf.text(`RISK ASSESSMENT: ${cluster.riskLevel.toUpperCase()}`, margin + 120, yPosition); // Increased separation
    yPosition += 22; // Increased spacing
    
    // Affected districts
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Affected Districts: ${cluster.affectedDistricts.join(', ')}`, margin, yPosition);
    yPosition += 18; // Increased spacing
    
    // Intelligence summary
    pdf.setFont('helvetica', 'normal');
    const summaryLines = pdf.splitTextToSize(cluster.summary, contentWidth);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 5 + 18; // Increased spacing
    
    // Operational metrics with enhanced spacing
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Source Articles: ${cluster.articles.length} | Media Sources: ${cluster.trends.sources.join(', ')}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Sentiment Analysis: ${cluster.trends.sentiment} | Weekly Trend: ${cluster.trends.weeklyTrend}`, margin, yPosition);
    yPosition += 18; // Increased spacing
    
    // Recommended actions
    if (cluster.actionItems && cluster.actionItems.length > 0) {
      pdf.setFontSize(11); // Larger action header
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 51, 102);
      pdf.text('Recommended Operational Actions:', margin, yPosition);
      yPosition += 15; // Increased spacing
      
      cluster.actionItems.slice(0, 4).forEach((action, actionIndex) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        const actionLines = pdf.splitTextToSize(`${actionIndex + 1}. ${action}`, contentWidth - 12);
        pdf.text(actionLines, margin + 8, yPosition);
        yPosition += actionLines.length * 5 + 6; // Increased spacing
      });
      
      if (cluster.actionItems.length > 4) {
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(100, 100, 100);
        pdf.text(`... and ${cluster.actionItems.length - 4} additional operational recommendations`, margin + 8, yPosition);
        yPosition += 12;
      }
    }
    
    yPosition += 30; // More space between clusters
  });

  // Statistical Analysis Summary
  checkPageBreak(100);
  pdf.setFontSize(18); // Larger section header
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('STATISTICAL ANALYSIS & TRENDS', margin, yPosition);
  yPosition += 35; // Increased spacing

  // Enhanced statistics table with better spacing
  const tableData = [
    ['Intelligence Metric', 'Current Period', 'Comparison', 'Trend Analysis'],
    ['Total News Articles Monitored', digest.totalArticles.toString(), 'Previous Week', `${digest.weeklyComparison.articlesChange > 0 ? '+' : ''}${digest.weeklyComparison.articlesChange}%`],
    ['Operationally Relevant Articles', digest.relevantArticles.toString(), 'Relevance Rate', `${Math.round((digest.relevantArticles / digest.totalArticles) * 100)}%`],
    ['High Priority Intelligence Clusters', digest.topicClusters.filter(c => c.priority === 'high').length.toString(), 'Critical Items', `${Math.round((digest.topicClusters.filter(c => c.priority === 'high').length / digest.topicClusters.length) * 100)}%`],
    ['Districts with Active Monitoring', digest.districts.length.toString(), 'Primary Focus', digest.weeklyComparison.topDistricts[0]],
    ['Media Source Coverage', '6 Major Sources', 'Regional & National', 'Comprehensive Coverage']
  ];

  // Professional table styling with enhanced spacing
  const cellHeight = 18; // Increased for better spacing
  const colWidths = [58, 42, 38, 42]; // Adjusted widths
  let tableY = yPosition;

  tableData.forEach((row, rowIndex) => {
    let cellX = margin;
    
    row.forEach((cell, colIndex) => {
      // Header row styling
      if (rowIndex === 0) {
        pdf.setFillColor(0, 51, 102);
        pdf.rect(cellX, tableY, colWidths[colIndex], cellHeight, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10); // Larger header text
      } else {
        // Alternating row colors
        if (rowIndex % 2 === 0) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(cellX, tableY, colWidths[colIndex], cellHeight, 'F');
        }
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(9); // Larger body text
      }
      
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(cellX, tableY, colWidths[colIndex], cellHeight);
      
      // Text positioning with better vertical centering
      const textLines = pdf.splitTextToSize(cell, colWidths[colIndex] - 6);
      pdf.text(textLines, cellX + 3, tableY + 12); // Better vertical centering
      cellX += colWidths[colIndex];
    });
    
    tableY += cellHeight;
  });

  yPosition = tableY + 40; // More space after table

  // Official Distribution and Authorization
  checkPageBreak(80);
  pdf.setFontSize(16); // Larger section header
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('OFFICIAL DISTRIBUTION', margin, yPosition);
  yPosition += 25; // Increased spacing

  const distributionList = [
    'Director General of Police, Andhra Pradesh',
    'Additional Director General (Intelligence)',
    'Inspector General (Law & Order)',
    'Deputy Inspector General (Coastal Security)',
    'Superintendents of Police - All Districts',
    'Additional Superintendents of Police',
    'Deputy Superintendents of Police',
    'Intelligence Division - State Headquarters',
    'Coastal Security Group',
    'Special Branch - All Districts'
  ];

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10); // Larger distribution text
  distributionList.forEach((recipient, index) => {
    pdf.text(`${index + 1}. ${recipient}`, margin + 8, yPosition);
    yPosition += 10; // Increased spacing between items
  });

  yPosition += 30; // More space before authorization

  // Authorization and security classification
  pdf.setFontSize(12); // Larger authorization header
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('DOCUMENT AUTHORIZATION', margin, yPosition);
  yPosition += 18; // Increased spacing

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9); // Larger authorization text
  pdf.setTextColor(0, 0, 0);
  pdf.text('This document is generated by the AP State Police Intelligence Analysis System', margin, yPosition);
  yPosition += 10;
  pdf.text('Authorized for official use by sworn law enforcement personnel only', margin, yPosition);
  yPosition += 10;
  pdf.text(`Document ID: APSP-IAS-${format(new Date(), 'yyyyMMdd')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, margin, yPosition);

  // Security footer on all pages with enhanced spacing
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    if (i > 1) {
      addPageHeader();
    }
    
    // Footer with proper spacing from bottom
    pdf.setFontSize(9); // Larger footer text
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 51, 102);
    pdf.text('RESTRICTED - FOR OFFICIAL USE ONLY - ANDHRA PRADESH STATE POLICE', margin, pageHeight - 40);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated: ${format(new Date(), 'dd/MM/yyyy')} IST | Document Classification: RESTRICTED`, margin, pageHeight - 32);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 50, pageHeight - 32);
  }

  // Save with official naming convention
  pdf.save(`AP_State_Police_Intelligence_Digest_${format(new Date(digest.date), 'yyyy-MM-dd')}.pdf`);
};