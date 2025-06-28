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
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    // State emblem area (placeholder)
    pdf.setFillColor(255, 255, 255);
    pdf.rect(margin, 8, 24, 24, 'F');
    pdf.setFontSize(6);
    pdf.setTextColor(0, 51, 102);
    pdf.text('AP', margin + 8, 18);
    pdf.text('POLICE', margin + 4, 24);
    
    // Official header text
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('ANDHRA PRADESH STATE POLICE', margin + 35, 16);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Intelligence Analysis & News Monitoring Division', margin + 35, 24);
    pdf.setFontSize(9);
    pdf.text('Daily Intelligence Digest Report', margin + 35, 30);
    
    // Classification and metadata
    pdf.setFontSize(8);
    pdf.text(`Generated: ${format(new Date(), 'PPP')} IST`, pageWidth - 85, 12);
    pdf.text('CLASSIFICATION: RESTRICTED', pageWidth - 85, 18);
    pdf.text('FOR OFFICIAL USE ONLY', pageWidth - 85, 24);
    pdf.text('ANDHRA PRADESH POLICE', pageWidth - 85, 30);
    
    yPosition = 50;
  };

  // Add first page header
  addPageHeader();

  // Document title and metadata
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('DAILY INTELLIGENCE DIGEST', margin, yPosition);
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Andhra Pradesh State Police - News Analysis Report', margin, yPosition + 8);
  yPosition += 20;

  // Official document metadata box
  pdf.setDrawColor(0, 51, 102);
  pdf.setLineWidth(1);
  pdf.rect(margin, yPosition, contentWidth, 45);
  
  // Inner border
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.rect(margin + 2, yPosition + 2, contentWidth - 4, 41);
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('OFFICIAL DOCUMENT DETAILS', margin + 8, yPosition + 12);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(9);
  pdf.text(`Report Date: ${format(new Date(digest.date), 'EEEE, MMMM do, yyyy')}`, margin + 8, yPosition + 20);
  pdf.text(`Analysis Period: ${format(new Date(digest.date), 'yyyy-MM-dd')} (24-hour monitoring cycle)`, margin + 8, yPosition + 26);
  pdf.text(`Generated At: ${format(new Date(digest.generatedAt), 'PPpp')} IST`, margin + 8, yPosition + 32);
  pdf.text(`Reporting Authority: AP State Police Intelligence Division`, margin + 8, yPosition + 38);
  
  pdf.text(`Total News Articles Processed: ${digest.totalArticles}`, margin + 110, yPosition + 20);
  pdf.text(`Operationally Relevant Articles: ${digest.relevantArticles}`, margin + 110, yPosition + 26);
  pdf.text(`Intelligence Topic Clusters: ${digest.topicClusters.length}`, margin + 110, yPosition + 32);
  pdf.text(`Districts Under Analysis: ${digest.districts.length}`, margin + 110, yPosition + 38);
  
  yPosition += 55;

  // Executive Summary
  checkPageBreak(35);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('EXECUTIVE SUMMARY', margin, yPosition);
  yPosition += 12;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  const summaryText = `This daily intelligence digest presents a comprehensive analysis of ${digest.totalArticles} news articles from regional and national media sources covering Andhra Pradesh. Of these, ${digest.relevantArticles} articles were classified as operationally relevant to state police activities. The automated analysis system identified ${digest.topicClusters.length} distinct intelligence clusters requiring attention, with ${digest.topicClusters.filter(c => c.priority === 'high').length} classified as high priority for immediate action. Coverage encompasses all ${digest.districts.length} operational districts of Andhra Pradesh, with particular emphasis on emerging security patterns, public safety concerns, and operational intelligence requirements.`;
  
  const summaryLines = pdf.splitTextToSize(summaryText, contentWidth);
  pdf.text(summaryLines, margin, yPosition);
  yPosition += summaryLines.length * 5 + 15;

  // Critical Alerts Section
  if (alerts.length > 0) {
    checkPageBreak(25);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 51, 102);
    pdf.text('CRITICAL ALERTS & IMMEDIATE ACTION ITEMS', margin, yPosition);
    yPosition += 12;

    alerts.forEach((alert, index) => {
      checkPageBreak(30);
      
      // Alert priority box
      const alertColors = {
        high: [255, 235, 235, 220, 38, 38],
        medium: [255, 248, 235, 245, 158, 11],
        low: [235, 248, 255, 59, 130, 246]
      };
      const [bgR, bgG, bgB, borderR, borderG, borderB] = alertColors[alert.priority as keyof typeof alertColors] || alertColors.low;
      
      pdf.setFillColor(bgR, bgG, bgB);
      pdf.rect(margin, yPosition, contentWidth, 25, 'F');
      
      pdf.setDrawColor(borderR, borderG, borderB);
      pdf.setLineWidth(1);
      pdf.rect(margin, yPosition, contentWidth, 25);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`ALERT ${index + 1}: ${alert.title.toUpperCase()}`, margin + 4, yPosition + 8);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`Priority: ${alert.priority.toUpperCase()} | Type: ${alert.type.toUpperCase()} | Districts: ${alert.districts.join(', ')}`, margin + 4, yPosition + 14);
      
      const descLines = pdf.splitTextToSize(alert.description, contentWidth - 8);
      pdf.text(descLines, margin + 4, yPosition + 19);
      
      if (alert.actionRequired) {
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(220, 38, 38);
        pdf.text('⚠ IMMEDIATE ACTION REQUIRED', margin + 4, yPosition + 23);
      }
      
      yPosition += 30;
    });
    yPosition += 10;
  }

  // District-wise Intelligence Analysis
  checkPageBreak(25);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('DISTRICT-WISE INTELLIGENCE ANALYSIS', margin, yPosition);
  yPosition += 15;

  digest.topicClusters.forEach((cluster, index) => {
    checkPageBreak(50);
    
    // Cluster header with numbering
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${index + 1}. ${cluster.title.toUpperCase()}`, margin, yPosition);
    yPosition += 10;
    
    // Priority and risk assessment
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
    
    // Risk level indicator
    const riskColors = {
      critical: [220, 38, 38],
      high: [245, 101, 101],
      medium: [245, 158, 11],
      low: [34, 197, 94]
    };
    const [rR, rG, rB] = riskColors[cluster.riskLevel as keyof typeof riskColors] || [100, 100, 100];
    pdf.setTextColor(rR, rG, rB);
    pdf.text(`RISK ASSESSMENT: ${cluster.riskLevel.toUpperCase()}`, margin + 70, yPosition);
    yPosition += 10;
    
    // Affected districts
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Affected Districts: ${cluster.affectedDistricts.join(', ')}`, margin, yPosition);
    yPosition += 8;
    
    // Intelligence summary
    pdf.setFont('helvetica', 'normal');
    const summaryLines = pdf.splitTextToSize(cluster.summary, contentWidth);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 4 + 8;
    
    // Operational metrics
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Source Articles: ${cluster.articles.length} | Media Sources: ${cluster.trends.sources.join(', ')} | Sentiment Analysis: ${cluster.trends.sentiment} | Weekly Trend: ${cluster.trends.weeklyTrend}`, margin, yPosition);
    yPosition += 8;
    
    // Recommended actions
    if (cluster.actionItems && cluster.actionItems.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 51, 102);
      pdf.text('Recommended Operational Actions:', margin, yPosition);
      yPosition += 6;
      
      cluster.actionItems.slice(0, 4).forEach((action, actionIndex) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        const actionLines = pdf.splitTextToSize(`${actionIndex + 1}. ${action}`, contentWidth - 10);
        pdf.text(actionLines, margin + 5, yPosition);
        yPosition += actionLines.length * 4 + 2;
      });
      
      if (cluster.actionItems.length > 4) {
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(100, 100, 100);
        pdf.text(`... and ${cluster.actionItems.length - 4} additional operational recommendations`, margin + 5, yPosition);
        yPosition += 5;
      }
    }
    
    yPosition += 12;
  });

  // Statistical Analysis Summary
  checkPageBreak(50);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('STATISTICAL ANALYSIS & TRENDS', margin, yPosition);
  yPosition += 15;

  // Enhanced statistics table
  const tableData = [
    ['Intelligence Metric', 'Current Period', 'Comparison', 'Trend Analysis'],
    ['Total News Articles Monitored', digest.totalArticles.toString(), 'Previous Week', `${digest.weeklyComparison.articlesChange > 0 ? '+' : ''}${digest.weeklyComparison.articlesChange}%`],
    ['Operationally Relevant Articles', digest.relevantArticles.toString(), 'Relevance Rate', `${Math.round((digest.relevantArticles / digest.totalArticles) * 100)}%`],
    ['High Priority Intelligence Clusters', digest.topicClusters.filter(c => c.priority === 'high').length.toString(), 'Critical Items', `${Math.round((digest.topicClusters.filter(c => c.priority === 'high').length / digest.topicClusters.length) * 100)}%`],
    ['Districts with Active Monitoring', digest.districts.length.toString(), 'Primary Focus', digest.weeklyComparison.topDistricts[0]],
    ['Media Source Coverage', '6 Major Sources', 'Regional & National', 'Comprehensive Coverage']
  ];

  // Professional table styling
  const cellHeight = 10;
  const colWidths = [50, 35, 30, 35];
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
      
      // Text positioning
      const textLines = pdf.splitTextToSize(cell, colWidths[colIndex] - 4);
      pdf.text(textLines, cellX + 2, tableY + 6);
      cellX += colWidths[colIndex];
    });
    
    tableY += cellHeight;
  });

  yPosition = tableY + 20;

  // Official Distribution and Authorization
  checkPageBreak(40);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('OFFICIAL DISTRIBUTION', margin, yPosition);
  yPosition += 12;

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
    yPosition += 5;
  });

  yPosition += 10;

  // Authorization and security classification
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 51, 102);
  pdf.text('DOCUMENT AUTHORIZATION', margin, yPosition);
  yPosition += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(0, 0, 0);
  pdf.text('This document is generated by the AP State Police Intelligence Analysis System', margin, yPosition);
  yPosition += 4;
  pdf.text('Authorized for official use by sworn law enforcement personnel only', margin, yPosition);
  yPosition += 4;
  pdf.text(`Document ID: APSP-IAS-${format(new Date(), 'yyyyMMdd')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, margin, yPosition);

  // Security footer on all pages
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    if (i > 1) {
      addPageHeader();
    }
    
    // Footer
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 51, 102);
    pdf.text('RESTRICTED - FOR OFFICIAL USE ONLY - ANDHRA PRADESH STATE POLICE', margin, pageHeight - 20);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated: ${format(new Date(), 'PPP')} IST | Document Classification: RESTRICTED`, margin, pageHeight - 15);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 15);
  }

  // Save with official naming convention
  pdf.save(`AP_State_Police_Intelligence_Digest_${format(new Date(digest.date), 'yyyy-MM-dd')}.pdf`);
};