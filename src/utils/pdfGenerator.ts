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
    // Header background with AP State colors
    pdf.setFillColor(0, 51, 102); // Deep blue
    pdf.rect(0, 0, pageWidth, 60, 'F'); // Increased height significantly for better spacing
    
    // State emblem area (placeholder)
    pdf.setFillColor(255, 255, 255);
    pdf.rect(margin, 12, 28, 28, 'F'); // Larger emblem area
    pdf.setFontSize(7);
    pdf.setTextColor(0, 51, 102);
    pdf.text('AP', margin + 10, 24);
    pdf.text('POLICE', margin + 6, 32);
    
    // Official header text - Left side with proper spacing
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('ANDHRA PRADESH STATE POLICE', margin + 40, 20);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Intelligence Analysis & News Monitoring Division', margin + 40, 30);
    
    pdf.setFontSize(9);
    pdf.text('Daily Intelligence Digest Report', margin + 40, 38);
    
    // Classification and metadata - Right side with much better spacing
    const rightColumnX = pageWidth - 100; // More space from right edge
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Generated: ${format(new Date(), 'dd/MM/yyyy')} IST`, rightColumnX, 16);
    
    pdf.text('CLASSIFICATION: RESTRICTED', rightColumnX, 24);
    
    pdf.text('FOR OFFICIAL USE ONLY', rightColumnX, 32);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('ANDHRA PRADESH POLICE', rightColumnX, 40);
    
    // Add a subtle separator line
    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(0.5);
    pdf.line(margin, 48, pageWidth - margin, 48);
    
    yPosition = 70; // Increased to accommodate larger header
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
  pdf.text('Andhra Pradesh State Police - News Analysis Report', margin, yPosition + 12);
  yPosition += 30;

  // Official document metadata box with enhanced spacing
  pdf.setDrawColor(0, 51, 102);
  pdf.setLineWidth(1.5);
  pdf.rect(margin, yPosition, contentWidth, 55); // Increased height for better spacing
  
  // Inner border for professional look
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.rect(margin + 3, yPosition + 3, contentWidth - 6, 49);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('OFFICIAL DOCUMENT DETAILS', margin + 10, yPosition + 16);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(9);
  
  // Left column with proper spacing
  pdf.text(`Report Date: ${format(new Date(digest.date), 'EEEE, MMMM do, yyyy')}`, margin + 10, yPosition + 26);
  pdf.text(`Analysis Period: ${format(new Date(digest.date), 'yyyy-MM-dd')} (24-hour monitoring cycle)`, margin + 10, yPosition + 33);
  pdf.text(`Generated At: ${format(new Date(digest.generatedAt), 'PPpp')} IST`, margin + 10, yPosition + 40);
  pdf.text(`Reporting Authority: AP State Police Intelligence Division`, margin + 10, yPosition + 47);
  
  // Right column with proper spacing
  pdf.text(`Total News Articles Processed: ${digest.totalArticles}`, margin + 115, yPosition + 26);
  pdf.text(`Operationally Relevant Articles: ${digest.relevantArticles}`, margin + 115, yPosition + 33);
  pdf.text(`Intelligence Topic Clusters: ${digest.topicClusters.length}`, margin + 115, yPosition + 40);
  pdf.text(`Districts Under Analysis: ${digest.districts.length}`, margin + 115, yPosition + 47);
  
  yPosition += 65;

  // Executive Summary
  checkPageBreak(40);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('EXECUTIVE SUMMARY', margin, yPosition);
  yPosition += 18;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  const summaryText = `This daily intelligence digest presents a comprehensive analysis of ${digest.totalArticles} news articles from regional and national media sources covering Andhra Pradesh. Of these, ${digest.relevantArticles} articles were classified as operationally relevant to state police activities. The automated analysis system identified ${digest.topicClusters.length} distinct intelligence clusters requiring attention, with ${digest.topicClusters.filter(c => c.priority === 'high').length} classified as high priority for immediate action. Coverage encompasses all ${digest.districts.length} operational districts of Andhra Pradesh, with particular emphasis on emerging security patterns, public safety concerns, and operational intelligence requirements.`;
  
  const summaryLines = pdf.splitTextToSize(summaryText, contentWidth);
  pdf.text(summaryLines, margin, yPosition);
  yPosition += summaryLines.length * 5 + 25;

  // Critical Alerts Section
  if (alerts.length > 0) {
    checkPageBreak(35);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 51, 102);
    pdf.text('CRITICAL ALERTS & IMMEDIATE ACTION ITEMS', margin, yPosition);
    yPosition += 18;

    alerts.forEach((alert, index) => {
      checkPageBreak(40);
      
      // Alert priority box with better spacing
      const alertColors = {
        high: [255, 235, 235, 220, 38, 38],
        medium: [255, 248, 235, 245, 158, 11],
        low: [235, 248, 255, 59, 130, 246]
      };
      const [bgR, bgG, bgB, borderR, borderG, borderB] = alertColors[alert.priority as keyof typeof alertColors] || alertColors.low;
      
      pdf.setFillColor(bgR, bgG, bgB);
      pdf.rect(margin, yPosition, contentWidth, 35, 'F'); // Increased height for better spacing
      
      pdf.setDrawColor(borderR, borderG, borderB);
      pdf.setLineWidth(1.5);
      pdf.rect(margin, yPosition, contentWidth, 35);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`ALERT ${index + 1}: ${alert.title.toUpperCase()}`, margin + 5, yPosition + 12);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`Priority: ${alert.priority.toUpperCase()} | Type: ${alert.type.toUpperCase()}`, margin + 5, yPosition + 19);
      pdf.text(`Districts: ${alert.districts.join(', ')}`, margin + 5, yPosition + 25);
      
      const descLines = pdf.splitTextToSize(alert.description, contentWidth - 10);
      pdf.text(descLines, margin + 5, yPosition + 30);
      
      if (alert.actionRequired) {
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(220, 38, 38);
        pdf.text('⚠ IMMEDIATE ACTION REQUIRED', margin + 5, yPosition + 32);
      }
      
      yPosition += 40;
    });
    yPosition += 20;
  }

  // District-wise Intelligence Analysis
  checkPageBreak(35);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('DISTRICT-WISE INTELLIGENCE ANALYSIS', margin, yPosition);
  yPosition += 25;

  digest.topicClusters.forEach((cluster, index) => {
    checkPageBreak(60);
    
    // Cluster header with numbering and better spacing
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${index + 1}. ${cluster.title.toUpperCase()}`, margin, yPosition);
    yPosition += 15;
    
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
    pdf.text(`RISK ASSESSMENT: ${cluster.riskLevel.toUpperCase()}`, margin + 90, yPosition);
    yPosition += 15;
    
    // Affected districts
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Affected Districts: ${cluster.affectedDistricts.join(', ')}`, margin, yPosition);
    yPosition += 12;
    
    // Intelligence summary
    pdf.setFont('helvetica', 'normal');
    const summaryLines = pdf.splitTextToSize(cluster.summary, contentWidth);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 4 + 12;
    
    // Operational metrics with better spacing
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Source Articles: ${cluster.articles.length} | Media Sources: ${cluster.trends.sources.join(', ')}`, margin, yPosition);
    yPosition += 5;
    pdf.text(`Sentiment Analysis: ${cluster.trends.sentiment} | Weekly Trend: ${cluster.trends.weeklyTrend}`, margin, yPosition);
    yPosition += 12;
    
    // Recommended actions
    if (cluster.actionItems && cluster.actionItems.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 51, 102);
      pdf.text('Recommended Operational Actions:', margin, yPosition);
      yPosition += 10;
      
      cluster.actionItems.slice(0, 4).forEach((action, actionIndex) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        const actionLines = pdf.splitTextToSize(`${actionIndex + 1}. ${action}`, contentWidth - 10);
        pdf.text(actionLines, margin + 5, yPosition);
        yPosition += actionLines.length * 4 + 4;
      });
      
      if (cluster.actionItems.length > 4) {
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(100, 100, 100);
        pdf.text(`... and ${cluster.actionItems.length - 4} additional operational recommendations`, margin + 5, yPosition);
        yPosition += 8;
      }
    }
    
    yPosition += 20;
  });

  // Statistical Analysis Summary
  checkPageBreak(70);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('STATISTICAL ANALYSIS & TRENDS', margin, yPosition);
  yPosition += 25;

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
  const cellHeight = 14; // Increased for better spacing
  const colWidths = [52, 36, 32, 36];
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
      pdf.text(textLines, cellX + 2, tableY + 9);
      cellX += colWidths[colIndex];
    });
    
    tableY += cellHeight;
  });

  yPosition = tableY + 30;

  // Official Distribution and Authorization
  checkPageBreak(60);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('OFFICIAL DISTRIBUTION', margin, yPosition);
  yPosition += 18;

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
    yPosition += 7; // Increased spacing between items
  });

  yPosition += 20;

  // Authorization and security classification
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('DOCUMENT AUTHORIZATION', margin, yPosition);
  yPosition += 12;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(0, 0, 0);
  pdf.text('This document is generated by the AP State Police Intelligence Analysis System', margin, yPosition);
  yPosition += 6;
  pdf.text('Authorized for official use by sworn law enforcement personnel only', margin, yPosition);
  yPosition += 6;
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
    pdf.text('RESTRICTED - FOR OFFICIAL USE ONLY - ANDHRA PRADESH STATE POLICE', margin, pageHeight - 30);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated: ${format(new Date(), 'dd/MM/yyyy')} IST | Document Classification: RESTRICTED`, margin, pageHeight - 24);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 24);
  }

  // Save with official naming convention
  pdf.save(`AP_State_Police_Intelligence_Digest_${format(new Date(digest.date), 'yyyy-MM-dd')}.pdf`);
};