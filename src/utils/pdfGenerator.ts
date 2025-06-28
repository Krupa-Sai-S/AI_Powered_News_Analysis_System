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
    // Header background with AP State colors - MUCH LARGER HEIGHT
    pdf.setFillColor(0, 51, 102); // Deep blue
    pdf.rect(0, 0, pageWidth, 80, 'F'); // SIGNIFICANTLY INCREASED HEIGHT to 80px
    
    // State emblem area (placeholder)
    pdf.setFillColor(255, 255, 255);
    pdf.rect(margin, 15, 30, 30, 'F'); // Larger emblem area
    pdf.setFontSize(7);
    pdf.setTextColor(0, 51, 102);
    pdf.text('AP', margin + 12, 28);
    pdf.text('POLICE', margin + 8, 36);
    
    // LEFT SIDE - Official header text with MUCH MORE SPACING
    const leftColumnX = margin + 40; // Start position for left text
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('ANDHRA PRADESH STATE POLICE', leftColumnX, 25); // First line
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Intelligence Analysis & News Monitoring Division', leftColumnX, 35); // Second line with 10px gap
    
    pdf.setFontSize(9);
    pdf.text('Daily Intelligence Digest Report', leftColumnX, 45); // Third line with 10px gap
    
    // RIGHT SIDE - Classification and metadata with MAXIMUM SPACING
    const rightColumnX = pageWidth - 120; // MUCH MORE space from right edge (was -100, now -120)
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Generated: ${format(new Date(), 'dd/MM/yyyy')} IST`, rightColumnX, 20); // First line
    
    pdf.text('CLASSIFICATION: RESTRICTED', rightColumnX, 30); // 10px gap
    
    pdf.text('FOR OFFICIAL USE ONLY', rightColumnX, 40); // 10px gap
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('ANDHRA PRADESH POLICE', rightColumnX, 50); // 10px gap
    
    // Add separator lines for better visual separation
    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(0.5);
    // Horizontal separator
    pdf.line(margin, 65, pageWidth - margin, 65);
    // Vertical separator between left and right content
    pdf.line(rightColumnX - 10, 15, rightColumnX - 10, 55);
    
    yPosition = 90; // INCREASED to accommodate much larger header (was 70, now 90)
  };

  // Add first page header
  addPageHeader();

  // Document title and metadata with better spacing
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('DAILY INTELLIGENCE DIGEST', margin, yPosition);
  
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Andhra Pradesh State Police - News Analysis Report', margin, yPosition + 15); // Increased gap
  yPosition += 35; // More space after title

  // Official document metadata box with enhanced spacing
  pdf.setDrawColor(0, 51, 102);
  pdf.setLineWidth(1.5);
  pdf.rect(margin, yPosition, contentWidth, 60); // Increased height for better spacing
  
  // Inner border for professional look
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.rect(margin + 3, yPosition + 3, contentWidth - 6, 54);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('OFFICIAL DOCUMENT DETAILS', margin + 10, yPosition + 18);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(9);
  
  // Left column with proper spacing
  pdf.text(`Report Date: ${format(new Date(digest.date), 'EEEE, MMMM do, yyyy')}`, margin + 10, yPosition + 30);
  pdf.text(`Analysis Period: ${format(new Date(digest.date), 'yyyy-MM-dd')} (24-hour monitoring cycle)`, margin + 10, yPosition + 38);
  pdf.text(`Generated At: ${format(new Date(digest.generatedAt), 'PPpp')} IST`, margin + 10, yPosition + 46);
  pdf.text(`Reporting Authority: AP State Police Intelligence Division`, margin + 10, yPosition + 54);
  
  // Right column with proper spacing - INCREASED SEPARATION
  const rightDataX = margin + 125; // More separation between columns
  pdf.text(`Total News Articles Processed: ${digest.totalArticles}`, rightDataX, yPosition + 30);
  pdf.text(`Operationally Relevant Articles: ${digest.relevantArticles}`, rightDataX, yPosition + 38);
  pdf.text(`Intelligence Topic Clusters: ${digest.topicClusters.length}`, rightDataX, yPosition + 46);
  pdf.text(`Districts Under Analysis: ${digest.districts.length}`, rightDataX, yPosition + 54);
  
  yPosition += 75; // More space after metadata box

  // Executive Summary
  checkPageBreak(40);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('EXECUTIVE SUMMARY', margin, yPosition);
  yPosition += 20; // Increased spacing

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  const summaryText = `This daily intelligence digest presents a comprehensive analysis of ${digest.totalArticles} news articles from regional and national media sources covering Andhra Pradesh. Of these, ${digest.relevantArticles} articles were classified as operationally relevant to state police activities. The automated analysis system identified ${digest.topicClusters.length} distinct intelligence clusters requiring attention, with ${digest.topicClusters.filter(c => c.priority === 'high').length} classified as high priority for immediate action. Coverage encompasses all ${digest.districts.length} operational districts of Andhra Pradesh, with particular emphasis on emerging security patterns, public safety concerns, and operational intelligence requirements.`;
  
  const summaryLines = pdf.splitTextToSize(summaryText, contentWidth);
  pdf.text(summaryLines, margin, yPosition);
  yPosition += summaryLines.length * 5 + 30; // More space after summary

  // Critical Alerts Section
  if (alerts.length > 0) {
    checkPageBreak(40);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 51, 102);
    pdf.text('CRITICAL ALERTS & IMMEDIATE ACTION ITEMS', margin, yPosition);
    yPosition += 20; // Increased spacing

    alerts.forEach((alert, index) => {
      checkPageBreak(45);
      
      // Alert priority box with better spacing
      const alertColors = {
        high: [255, 235, 235, 220, 38, 38],
        medium: [255, 248, 235, 245, 158, 11],
        low: [235, 248, 255, 59, 130, 246]
      };
      const [bgR, bgG, bgB, borderR, borderG, borderB] = alertColors[alert.priority as keyof typeof alertColors] || alertColors.low;
      
      pdf.setFillColor(bgR, bgG, bgB);
      pdf.rect(margin, yPosition, contentWidth, 40, 'F'); // Increased height
      
      pdf.setDrawColor(borderR, borderG, borderB);
      pdf.setLineWidth(1.5);
      pdf.rect(margin, yPosition, contentWidth, 40);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`ALERT ${index + 1}: ${alert.title.toUpperCase()}`, margin + 5, yPosition + 12);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`Priority: ${alert.priority.toUpperCase()} | Type: ${alert.type.toUpperCase()}`, margin + 5, yPosition + 20);
      pdf.text(`Districts: ${alert.districts.join(', ')}`, margin + 5, yPosition + 27);
      
      const descLines = pdf.splitTextToSize(alert.description, contentWidth - 10);
      pdf.text(descLines, margin + 5, yPosition + 34);
      
      if (alert.actionRequired) {
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(220, 38, 38);
        pdf.text('⚠ IMMEDIATE ACTION REQUIRED', margin + 5, yPosition + 37);
      }
      
      yPosition += 45; // Increased spacing between alerts
    });
    yPosition += 25; // More space after alerts section
  }

  // District-wise Intelligence Analysis
  checkPageBreak(40);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('DISTRICT-WISE INTELLIGENCE ANALYSIS', margin, yPosition);
  yPosition += 30; // Increased spacing

  digest.topicClusters.forEach((cluster, index) => {
    checkPageBreak(70);
    
    // Cluster header with numbering and better spacing
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${index + 1}. ${cluster.title.toUpperCase()}`, margin, yPosition);
    yPosition += 18; // Increased spacing
    
    // Priority and risk assessment with better spacing
    pdf.setFontSize(9);
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
    
    // Risk level indicator with proper spacing
    const riskColors = {
      critical: [220, 38, 38],
      high: [245, 101, 101],
      medium: [245, 158, 11],
      low: [34, 197, 94]
    };
    const [rR, rG, rB] = riskColors[cluster.riskLevel as keyof typeof riskColors] || [100, 100, 100];
    pdf.setTextColor(rR, rG, rB);
    pdf.text(`RISK ASSESSMENT: ${cluster.riskLevel.toUpperCase()}`, margin + 100, yPosition); // Increased separation
    yPosition += 18; // Increased spacing
    
    // Affected districts
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Affected Districts: ${cluster.affectedDistricts.join(', ')}`, margin, yPosition);
    yPosition += 15; // Increased spacing
    
    // Intelligence summary
    pdf.setFont('helvetica', 'normal');
    const summaryLines = pdf.splitTextToSize(cluster.summary, contentWidth);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 4 + 15; // Increased spacing
    
    // Operational metrics with better spacing
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Source Articles: ${cluster.articles.length} | Media Sources: ${cluster.trends.sources.join(', ')}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Sentiment Analysis: ${cluster.trends.sentiment} | Weekly Trend: ${cluster.trends.weeklyTrend}`, margin, yPosition);
    yPosition += 15; // Increased spacing
    
    // Recommended actions
    if (cluster.actionItems && cluster.actionItems.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 51, 102);
      pdf.text('Recommended Operational Actions:', margin, yPosition);
      yPosition += 12; // Increased spacing
      
      cluster.actionItems.slice(0, 4).forEach((action, actionIndex) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        const actionLines = pdf.splitTextToSize(`${actionIndex + 1}. ${action}`, contentWidth - 10);
        pdf.text(actionLines, margin + 5, yPosition);
        yPosition += actionLines.length * 4 + 5; // Increased spacing
      });
      
      if (cluster.actionItems.length > 4) {
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(100, 100, 100);
        pdf.text(`... and ${cluster.actionItems.length - 4} additional operational recommendations`, margin + 5, yPosition);
        yPosition += 10;
      }
    }
    
    yPosition += 25; // More space between clusters
  });

  // Statistical Analysis Summary
  checkPageBreak(80);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('STATISTICAL ANALYSIS & TRENDS', margin, yPosition);
  yPosition += 30; // Increased spacing

  // Enhanced statistics table with better spacing
  const tableData = [
    ['Intelligence Metric', 'Current Period', 'Comparison', 'Trend Analysis'],
    ['Total News Articles Monitored', digest.totalArticles.toString(), 'Previous Week', `${digest.weeklyComparison.articlesChange > 0 ? '+' : ''}${digest.weeklyComparison.articlesChange}%`],
    ['Operationally Relevant Articles', digest.relevantArticles.toString(), 'Relevance Rate', `${Math.round((digest.relevantArticles / digest.totalArticles) * 100)}%`],
    ['High Priority Intelligence Clusters', digest.topicClusters.filter(c => c.priority === 'high').length.toString(), 'Critical Items', `${Math.round((digest.topicClusters.filter(c => c.priority === 'high').length / digest.topicClusters.length) * 100)}%`],
    ['Districts with Active Monitoring', digest.districts.length.toString(), 'Primary Focus', digest.weeklyComparison.topDistricts[0]],
    ['Media Source Coverage', '6 Major Sources', 'Regional & National', 'Comprehensive Coverage']
  ];

  // Professional table styling with better spacing
  const cellHeight = 16; // Increased for better spacing
  const colWidths = [54, 38, 34, 38]; // Adjusted widths
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
        pdf.setFontSize(9);
      } else {
        // Alternating row colors
        if (rowIndex % 2 === 0) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(cellX, tableY, colWidths[colIndex], cellHeight, 'F');
        }
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(8);
      }
      
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(cellX, tableY, colWidths[colIndex], cellHeight);
      
      // Text positioning with better vertical centering
      const textLines = pdf.splitTextToSize(cell, colWidths[colIndex] - 4);
      pdf.text(textLines, cellX + 2, tableY + 10); // Better vertical centering
      cellX += colWidths[colIndex];
    });
    
    tableY += cellHeight;
  });

  yPosition = tableY + 35; // More space after table

  // Official Distribution and Authorization
  checkPageBreak(70);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('OFFICIAL DISTRIBUTION', margin, yPosition);
  yPosition += 20; // Increased spacing

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
  pdf.setFontSize(9);
  distributionList.forEach((recipient, index) => {
    pdf.text(`${index + 1}. ${recipient}`, margin + 5, yPosition);
    yPosition += 8; // Increased spacing between items
  });

  yPosition += 25; // More space before authorization

  // Authorization and security classification
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('DOCUMENT AUTHORIZATION', margin, yPosition);
  yPosition += 15; // Increased spacing

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(0, 0, 0);
  pdf.text('This document is generated by the AP State Police Intelligence Analysis System', margin, yPosition);
  yPosition += 8;
  pdf.text('Authorized for official use by sworn law enforcement personnel only', margin, yPosition);
  yPosition += 8;
  pdf.text(`Document ID: APSP-IAS-${format(new Date(), 'yyyyMMdd')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, margin, yPosition);

  // Security footer on all pages with proper spacing
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    if (i > 1) {
      addPageHeader();
    }
    
    // Footer with proper spacing from bottom
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 51, 102);
    pdf.text('RESTRICTED - FOR OFFICIAL USE ONLY - ANDHRA PRADESH STATE POLICE', margin, pageHeight - 35);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated: ${format(new Date(), 'dd/MM/yyyy')} IST | Document Classification: RESTRICTED`, margin, pageHeight - 28);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 28);
  }

  // Save with official naming convention
  pdf.save(`AP_State_Police_Intelligence_Digest_${format(new Date(digest.date), 'yyyy-MM-dd')}.pdf`);
};