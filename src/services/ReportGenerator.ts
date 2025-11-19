/**
 * Report Generator Service
 * 
 * @module services/ReportGenerator
 * @description Service for generating professional reports from case data.
 * Supports multiple report types and output formats.
 * 
 * @ai-context Report generation and document creation service
 * @litigation-grade Professional report outputs with audit trail
 * @version 1.0.0
 */

import type {
  Report,
  ReportFormat,
  ReportSection,
  CaseSummaryReport,
  ActionPlanReport,
  TimelineReport,
  Case,
  Assessment,
  Recommendation,
} from '../types';

/**
 * Report Generator for creating professional documents
 * 
 * @ai-context Central service for report generation
 */
export class ReportGenerator {
  /**
   * Generate a case summary report
   * 
   * @param caseData - Case data
   * @param assessment - Case assessment
   * @param format - Output format
   * @returns Case summary report
   */
  generateCaseSummary(
    caseData: Case,
    assessment: Assessment,
    format: ReportFormat = 'pdf'
  ): CaseSummaryReport {
    const now = new Date().toISOString();
    
    // Build key facts
    const keyFacts = [
      { label: 'Case Reference', value: caseData.caseReferenceNumber },
      { label: 'Status', value: caseData.status },
      { label: 'Priority', value: caseData.priority },
      { label: 'Issue Type', value: caseData.issueType },
      { label: 'Opened Date', value: caseData.timeline.openedDate },
    ];
    
    if (caseData.arrearsAmount) {
      keyFacts.push({
        label: 'Arrears Amount',
        value: `${caseData.currency || 'GBP'} ${caseData.arrearsAmount.toFixed(2)}`,
      });
    }
    
    // Build risk indicators
    const riskIndicators = [
      {
        indicator: 'Overall Risk',
        level: assessment.riskLevel,
        description: `Risk level: ${assessment.riskLevel}`,
      },
      {
        indicator: 'Urgency',
        level: assessment.urgencyScore > 75 ? 'critical' : assessment.urgencyScore > 50 ? 'high' : 'medium' as 'low' | 'medium' | 'high' | 'critical',
        description: `Urgency score: ${assessment.urgencyScore}/100`,
      },
    ];
    
    // Build timeline snapshot
    const timelineSnapshot = {
      openedDate: caseData.timeline.openedDate,
      currentStatus: caseData.status,
      keyMilestones: caseData.timeline.milestones?.map(m => m.name) || [],
      urgentDeadlines: caseData.timeline.milestones
        ?.filter(m => m.isCritical && !m.isCompleted)
        .map(m => `${m.name}: ${m.targetDate}`) || [],
    };
    
    // Build support summary
    const supportSummary = {
      currentSupport: assessment.supportNeeds || [],
      recommendedSupport: [],
      gaps: [],
    };
    
    // Build report sections
    const sections: ReportSection[] = [
      {
        id: 'overview',
        title: 'Case Overview',
        content: caseData.issueDescription,
        order: 1,
        isRequired: true,
      },
      {
        id: 'assessment',
        title: 'Assessment Summary',
        content: assessment.summary,
        order: 2,
        isRequired: true,
      },
      {
        id: 'risk',
        title: 'Risk Analysis',
        content: `Risk Level: ${assessment.riskLevel}, Urgency: ${assessment.urgencyScore}/100`,
        order: 3,
        isRequired: true,
      },
    ];
    
    return {
      metadata: {
        id: `report-${caseData.metadata.id}-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        updatedBy: 'system',
        version: 1,
      },
      documentMetadata: {
        id: `doc-${caseData.metadata.id}-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        updatedBy: 'system',
        version: 1,
        documentType: 'case_summary',
        title: `Case Summary - ${caseData.caseReferenceNumber}`,
        templateVersion: '1.0.0',
        dataSources: [caseData.metadata.id, assessment.metadata.id],
        retentionPeriodDays: 365,
      },
      reportType: 'case_summary',
      title: `Case Summary Report`,
      subtitle: `Case Reference: ${caseData.caseReferenceNumber}`,
      caseId: caseData.metadata.id,
      userId: caseData.userId,
      generatedDate: now,
      sections,
      summary: assessment.summary,
      format,
      templateVersion: '1.0.0',
      caseDetails: caseData,
      assessmentSummary: assessment,
      keyFacts,
      riskIndicators,
      timelineSnapshot,
      supportSummary,
    };
  }
  
  /**
   * Generate an action plan report
   * 
   * @param caseData - Case data
   * @param recommendations - Recommendations
   * @param format - Output format
   * @returns Action plan report
   */
  generateActionPlan(
    caseData: Case,
    recommendations: Recommendation[],
    format: ReportFormat = 'pdf'
  ): ActionPlanReport {
    const now = new Date().toISOString();
    
    // Categorize actions by timeframe
    const immediateActions: ActionPlanReport['immediateActions'] = [];
    const shortTermActions: ActionPlanReport['shortTermActions'] = [];
    const longTermActions: ActionPlanReport['longTermActions'] = [];
    
    for (const rec of recommendations) {
      for (const step of rec.actionSteps) {
        const action = {
          action: step.description,
          responsibility: step.responsibility === 'user' ? 'Client' : 
                        step.responsibility === 'caseworker' ? 'Caseworker' : 'External',
          deadline: step.dueDate || 'TBD',
          resources: rec.resourcesNeeded,
        };
        
        // Categorize based on due date or estimated duration
        if (step.dueDate) {
          const dueDate = new Date(step.dueDate);
          const daysDiff = Math.floor((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff <= 7) {
            immediateActions.push(action);
          } else if (daysDiff <= 30) {
            shortTermActions.push(action);
          } else {
            longTermActions.push({
              ...action,
              timeline: `${daysDiff} days`,
            });
          }
        } else {
          // Default to short-term if no due date
          shortTermActions.push(action);
        }
      }
    }
    
    // Extract goals
    const goals = recommendations.map((rec) => ({
      id: rec.id,
      description: rec.title,
      priority: rec.priority,
      targetDate: rec.actionSteps[0]?.dueDate,
    }));
    
    // Build resources list
    const resources = recommendations.flatMap(rec => 
      (rec.supportingDocuments || []).map(doc => ({
        title: doc,
        description: `Supporting document for ${rec.title}`,
        type: 'document' as const,
        reference: doc,
      }))
    );
    
    // Build sections
    const sections: ReportSection[] = [
      {
        id: 'goals',
        title: 'Strategic Goals',
        content: JSON.stringify(goals),
        order: 1,
        isRequired: true,
      },
      {
        id: 'immediate',
        title: 'Immediate Actions (Next 7 Days)',
        content: JSON.stringify(immediateActions),
        order: 2,
        isRequired: true,
      },
      {
        id: 'short-term',
        title: 'Short-term Actions (Next 30 Days)',
        content: JSON.stringify(shortTermActions),
        order: 3,
        isRequired: true,
      },
    ];
    
    return {
      metadata: {
        id: `report-action-${caseData.metadata.id}-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        updatedBy: 'system',
        version: 1,
      },
      documentMetadata: {
        id: `doc-action-${caseData.metadata.id}-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        updatedBy: 'system',
        version: 1,
        documentType: 'action_plan',
        title: `Action Plan - ${caseData.caseReferenceNumber}`,
        templateVersion: '1.0.0',
        dataSources: [caseData.metadata.id],
        retentionPeriodDays: 365,
      },
      reportType: 'action_plan',
      title: 'Action Plan Report',
      subtitle: `Case Reference: ${caseData.caseReferenceNumber}`,
      caseId: caseData.metadata.id,
      userId: caseData.userId,
      generatedDate: now,
      sections,
      format,
      templateVersion: '1.0.0',
      goals,
      recommendations,
      immediateActions,
      shortTermActions,
      longTermActions,
      successCriteria: recommendations.map(r => r.expectedOutcome),
      resources,
    };
  }
  
  /**
   * Generate a timeline report
   * 
   * @param caseData - Case data
   * @param format - Output format
   * @returns Timeline report
   */
  generateTimeline(
    caseData: Case,
    format: ReportFormat = 'pdf'
  ): TimelineReport {
    const now = new Date().toISOString();
    
    // Build timeline events
    const events = [
      {
        date: caseData.timeline.openedDate,
        title: 'Case Opened',
        description: `Case ${caseData.caseReferenceNumber} was opened`,
        type: 'milestone' as const,
        importance: 'high' as const,
      },
      ...(caseData.timeline.milestones || []).map(m => ({
        date: m.targetDate,
        title: m.name,
        description: m.description,
        type: m.isCritical ? 'deadline' as const : 'milestone' as const,
        importance: m.isCritical ? 'critical' as const : 'medium' as const,
      })),
    ];
    
    // Sort by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Build critical deadlines
    const criticalDeadlines = (caseData.timeline.milestones || [])
      .filter(m => m.isCritical && !m.isCompleted)
      .map(m => ({
        date: m.targetDate,
        description: m.name,
        consequences: 'Failure to meet this deadline may result in adverse outcomes',
      }));
    
    // Build sections
    const sections: ReportSection[] = [
      {
        id: 'timeline',
        title: 'Case Timeline',
        content: JSON.stringify(events),
        order: 1,
        isRequired: true,
      },
      {
        id: 'deadlines',
        title: 'Critical Deadlines',
        content: JSON.stringify(criticalDeadlines),
        order: 2,
        isRequired: true,
      },
    ];
    
    return {
      metadata: {
        id: `report-timeline-${caseData.metadata.id}-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        updatedBy: 'system',
        version: 1,
      },
      documentMetadata: {
        id: `doc-timeline-${caseData.metadata.id}-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        updatedBy: 'system',
        version: 1,
        documentType: 'timeline',
        title: `Timeline - ${caseData.caseReferenceNumber}`,
        templateVersion: '1.0.0',
        dataSources: [caseData.metadata.id],
        retentionPeriodDays: 365,
      },
      reportType: 'timeline',
      title: 'Timeline Report',
      subtitle: `Case Reference: ${caseData.caseReferenceNumber}`,
      caseId: caseData.metadata.id,
      userId: caseData.userId,
      generatedDate: now,
      sections,
      format,
      templateVersion: '1.0.0',
      events,
      criticalDeadlines,
      projectedTimeline: {
        estimatedResolutionDate: caseData.timeline.targetResolutionDate,
        confidenceLevel: 75,
        assumptions: ['Client cooperation', 'Timely responses from third parties'],
      },
    };
  }
  
  /**
   * Export report to specified format
   * 
   * @param report - Report to export
   * @param format - Output format
   * @returns Exported report content
   */
  exportReport(report: Report, format: ReportFormat): string {
    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);
        
      case 'html':
        return this.generateHTML(report);
        
      case 'markdown':
        return this.generateMarkdown(report);
        
      default:
        // For PDF and DOCX, would integrate with appropriate libraries
        return JSON.stringify(report, null, 2);
    }
  }
  
  /**
   * Generate HTML from report
   * 
   * @param report - Report data
   * @returns HTML string
   */
  private generateHTML(report: Report): string {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${report.title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; border-bottom: 2px solid #007bff; }
    h2 { color: #555; margin-top: 30px; }
    .metadata { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .section { margin-bottom: 25px; }
  </style>
</head>
<body>
  <h1>${report.title}</h1>
  ${report.subtitle ? `<p><strong>${report.subtitle}</strong></p>` : ''}
  
  <div class="metadata">
    <p><strong>Generated:</strong> ${new Date(report.generatedDate).toLocaleString()}</p>
    <p><strong>Report Type:</strong> ${report.reportType}</p>
    <p><strong>Case ID:</strong> ${report.caseId}</p>
  </div>
  
  ${report.summary ? `<div class="section"><h2>Summary</h2><p>${report.summary}</p></div>` : ''}
  
  ${report.sections.map(section => `
    <div class="section">
      <h2>${section.title}</h2>
      <div>${typeof section.content === 'string' ? section.content : JSON.stringify(section.content, null, 2)}</div>
    </div>
  `).join('')}
  
  ${report.footer ? `<footer><p>${report.footer}</p></footer>` : ''}
</body>
</html>
    `;
    
    return html;
  }
  
  /**
   * Generate Markdown from report
   * 
   * @param report - Report data
   * @returns Markdown string
   */
  private generateMarkdown(report: Report): string {
    let md = `# ${report.title}\n\n`;
    
    if (report.subtitle) {
      md += `**${report.subtitle}**\n\n`;
    }
    
    md += `**Generated:** ${new Date(report.generatedDate).toLocaleString()}\n`;
    md += `**Report Type:** ${report.reportType}\n`;
    md += `**Case ID:** ${report.caseId}\n\n`;
    
    if (report.summary) {
      md += `## Summary\n\n${report.summary}\n\n`;
    }
    
    for (const section of report.sections) {
      md += `## ${section.title}\n\n`;
      md += typeof section.content === 'string' 
        ? `${section.content}\n\n`
        : `\`\`\`json\n${JSON.stringify(section.content, null, 2)}\n\`\`\`\n\n`;
    }
    
    if (report.footer) {
      md += `---\n\n${report.footer}\n`;
    }
    
    return md;
  }
}
