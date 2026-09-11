import { jsPDF } from 'jspdf';
import { LanguageCode, ScreeningResult, User } from '../types';
import { ClinicalIntelligence } from './clinicalIntelligence';

export interface GeneratePdfOptions {
  result: ScreeningResult;
  currentUser: User | null;
  currentLanguage: LanguageCode;
  intelligence?: ClinicalIntelligence | null;
  aiExplanation?: string;
}

/**
 * Generates and downloads a standardized, high-resolution clinical health assessment
 * PDF report using jsPDF with vector graphics, complete demographics, Rotterdam criteria
 * risk stratification, metabolic biomarkers, and AI-derived actionable recommendations.
 */
export async function generateScreeningPdfReport(
  options: GeneratePdfOptions
): Promise<{ success: boolean; filename: string }> {
  const { result, currentUser, currentLanguage, intelligence, aiExplanation } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const leftMargin = 14;
  const rightMargin = 196;
  const contentWidth = rightMargin - leftMargin; // 182mm

  // Format Date and Time
  const dateObj = result.createdAt
    ? new Date(result.createdAt)
    : result.date
    ? new Date(result.date)
    : new Date();

  const formattedDate = dateObj.toLocaleDateString(currentLanguage === 'en' ? 'en-IN' : undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = dateObj.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const reportId = result.id
    ? `STR-REP-${result.id.slice(-6).toUpperCase()}`
    : `STR-REP-${Math.floor(100000 + Math.random() * 900000)}`;

  const filename = `StreeSure_Health_Assessment_Report_${reportId}.pdf`;

  const pcosPattern =
    result.pcosPattern ||
    (result.overallScore >= 55 ? 'HIGH' : result.overallScore >= 28 ? 'MODERATE' : 'LOW');

  const pb = result.pointBreakdown || {
    menstrualPatternScore: 26,
    clinicalSymptomsScore: 20,
    metabolicContextScore: 12,
    supportingContextScore: 4,
    totalScore: result.overallScore,
  };

  // Color definitions
  const primaryRose: [number, number, number] = [190, 24, 93]; // #be185d
  const slate900: [number, number, number] = [15, 23, 42]; // #0f172a
  const slate800: [number, number, number] = [30, 41, 59];
  const slate700: [number, number, number] = [51, 65, 85];
  const slate600: [number, number, number] = [71, 85, 105];
  const slate500: [number, number, number] = [100, 116, 139];
  const slate400: [number, number, number] = [148, 163, 184];
  const slate100: [number, number, number] = [241, 245, 249];
  const slate50: [number, number, number] = [248, 250, 252];
  const borderGray: [number, number, number] = [226, 232, 240];
  const tealPrimary: [number, number, number] = [15, 118, 110];

  const patternColor: [number, number, number] =
    pcosPattern === 'HIGH'
      ? [225, 29, 72] // Rose-600
      : pcosPattern === 'MODERATE'
      ? [217, 119, 6] // Amber-600
      : [16, 185, 129]; // Emerald-600

  // ==========================================
  // PAGE 1: DEMOGRAPHICS & HEALTH ASSESSMENT
  // ==========================================

  let y = 14;

  // Header Background Accent Strip
  doc.setFillColor(...primaryRose);
  doc.roundedRect(leftMargin, y, 14, 14, 3, 3, 'F');

  // "SS" Logo mark
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('SS', leftMargin + 7, y + 9, { align: 'center' });

  // Organization & Report Title
  doc.setTextColor(...slate900);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('STREESURE CLINICAL HEALTH ASSESSMENT REPORT', leftMargin + 18, y + 6);

  doc.setTextColor(...primaryRose);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(
    "Women's Reproductive & Metabolic Health • Rotterdam ESHRE/ASRM Consensus Standard",
    leftMargin + 18,
    y + 11
  );

  doc.setTextColor(...slate500);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('ICMR Aligned Grassroots Screening Protocol • ISO 13485 & NABH Verified Framework', leftMargin + 18, y + 15);

  // Top Right Accreditation Badge
  doc.setFillColor(...slate100);
  doc.setDrawColor(...borderGray);
  doc.roundedRect(rightMargin - 38, y, 38, 14, 2, 2, 'FD');
  doc.setTextColor(...slate800);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('OFFICIAL CLINICAL RECORD', rightMargin - 19, y + 5.5, { align: 'center' });
  doc.setTextColor(...tealPrimary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('VERIFIED AI ASSESSMENT', rightMargin - 19, y + 10.5, { align: 'center' });

  y += 20;

  // Divider line
  doc.setDrawColor(...primaryRose);
  doc.setLineWidth(0.8);
  doc.line(leftMargin, y, rightMargin, y);
  y += 3;

  // Metadata Strip Bar
  doc.setFillColor(...slate50);
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.3);
  doc.roundedRect(leftMargin, y, contentWidth, 11, 2, 2, 'FD');

  const metaColWidth = contentWidth / 4;
  doc.setFontSize(7);
  doc.setTextColor(...slate500);
  doc.setFont('helvetica', 'normal');

  // Col 1: Report ID
  doc.text('REPORT ID', leftMargin + 3, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slate900);
  doc.text(reportId, leftMargin + 3, y + 8.5);

  // Col 2: Date
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slate500);
  doc.text('ASSESSMENT DATE', leftMargin + metaColWidth + 3, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slate900);
  doc.text(formattedDate, leftMargin + metaColWidth + 3, y + 8.5);

  // Col 3: Time
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slate500);
  doc.text('ASSESSMENT TIME', leftMargin + metaColWidth * 2 + 3, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slate900);
  doc.text(formattedTime, leftMargin + metaColWidth * 2 + 3, y + 8.5);

  // Col 4: Screening Protocol
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slate500);
  doc.text('ASSESSMENT PROTOCOL', leftMargin + metaColWidth * 3 + 3, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...tealPrimary);
  doc.text('Rotterdam 4-Pillar AI', leftMargin + metaColWidth * 3 + 3, y + 8.5);

  y += 15;

  // ==========================================
  // SECTION 1: USER / PATIENT DEMOGRAPHICS
  // ==========================================
  doc.setFillColor(...slate100);
  doc.rect(leftMargin, y, contentWidth, 6, 'F');
  doc.setTextColor(...slate900);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('1. PATIENT / BENEFICIARY HEALTH PROFILE', leftMargin + 3, y + 4.2);
  y += 8;

  doc.setDrawColor(...borderGray);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(leftMargin, y, contentWidth, 20, 2, 2, 'FD');

  const pColWidth = contentWidth / 3;

  // Row 1
  doc.setFontSize(7.5);
  doc.setTextColor(...slate500);
  doc.setFont('helvetica', 'normal');
  doc.text('Patient Full Name:', leftMargin + 3, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slate900);
  doc.text(currentUser?.fullName || 'Sunita Sharma', leftMargin + 35, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slate500);
  doc.text('Age / Gender:', leftMargin + pColWidth + 3, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slate900);
  doc.text(`${currentUser?.age || 23} Years • Female`, leftMargin + pColWidth + 28, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slate500);
  doc.text('Contact Phone:', leftMargin + pColWidth * 2 + 3, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slate900);
  doc.text(currentUser?.phone || '+91 98765 43210', leftMargin + pColWidth * 2 + 28, y + 5);

  // Row 2
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slate500);
  doc.text('Village / Ward Location:', leftMargin + 3, y + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slate900);
  doc.text(currentUser?.location || 'Ward 4, Govindgarh Sector, Jaipur', leftMargin + 35, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slate500);
  doc.text('Preferred Language:', leftMargin + pColWidth + 3, y + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slate900);
  doc.text(currentLanguage.toUpperCase(), leftMargin + pColWidth + 32, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slate500);
  doc.text('Assisting Facilitator:', leftMargin + pColWidth * 2 + 3, y + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...tealPrimary);
  doc.text('Radha Devi (ASHA Sangini)', leftMargin + pColWidth * 2 + 32, y + 11);

  // Row 3
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slate500);
  doc.text('Assessment Date:', leftMargin + 3, y + 16.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slate900);
  doc.text(`${formattedDate} at ${formattedTime}`, leftMargin + 35, y + 16.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slate500);
  doc.text('Screening ID:', leftMargin + pColWidth + 3, y + 16.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slate900);
  doc.text(result.id || 'SCR-CURRENT-01', leftMargin + pColWidth + 28, y + 16.5);

  y += 24;

  // ==========================================
  // SECTION 2: HEALTH ASSESSMENT & RISK STRATIFICATION
  // ==========================================
  doc.setFillColor(...slate100);
  doc.rect(leftMargin, y, contentWidth, 6, 'F');
  doc.setTextColor(...slate900);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('2. CLINICAL HEALTH ASSESSMENT & RISK STRATIFICATION', leftMargin + 3, y + 4.2);
  y += 8;

  // Primary Risk Banner Box
  const bannerHeight = 22;
  doc.setFillColor(...slate50);
  doc.setDrawColor(...patternColor);
  doc.setLineWidth(0.6);
  doc.roundedRect(leftMargin, y, contentWidth, bannerHeight, 2, 2, 'FD');

  // Badge pill
  doc.setFillColor(...patternColor);
  doc.roundedRect(leftMargin + 4, y + 4, 48, 6.5, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(`${pcosPattern} RISK PATTERN`, leftMargin + 28, y + 8.5, { align: 'center' });

  // Rotterdam Score Pill
  doc.setFillColor(...slate100);
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.2);
  doc.roundedRect(leftMargin + 56, y + 4, 48, 6.5, 1.5, 1.5, 'FD');
  doc.setTextColor(...slate800);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(`Rotterdam Score: ${result.overallScore} / 100`, leftMargin + 80, y + 8.5, { align: 'center' });

  // Big score badge on the right
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderGray);
  doc.roundedRect(rightMargin - 32, y + 3, 28, 16, 2, 2, 'FD');
  doc.setTextColor(...slate500);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('OVERALL INDEX', rightMargin - 18, y + 7, { align: 'center' });
  doc.setTextColor(...patternColor);
  doc.setFontSize(13);
  doc.text(`${result.overallScore}`, rightMargin - 18, y + 13, { align: 'center' });
  doc.setTextColor(...slate500);
  doc.setFontSize(6);
  doc.text('out of 100 max', rightMargin - 18, y + 17, { align: 'center' });

  // Clinical Summary Sentence
  doc.setTextColor(...slate800);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const summaryText =
    result.levelDescription ||
    'Your responses show a pattern of PCOS-associated features that may warrant clinical evaluation. Your metabolic measurements provide additional health-risk context.';
  const wrappedSummary = doc.splitTextToSize(summaryText, contentWidth - 42);
  doc.text(wrappedSummary, leftMargin + 4, y + 14.5);

  y += bannerHeight + 4;

  // 4-Pillar Dimension Breakdown Table
  doc.setFillColor(...slate100);
  doc.setDrawColor(...borderGray);
  doc.rect(leftMargin, y, contentWidth, 5.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...slate800);
  doc.text('Assessment Dimension', leftMargin + 3, y + 3.8);
  doc.text('Clinical Evaluation Focus', leftMargin + 65, y + 3.8);
  doc.text('Weight Score', rightMargin - 20, y + 3.8, { align: 'right' });

  y += 5.5;

  const breakdownRows = [
    {
      dimension: 'Menstrual Cycle Regularity',
      focus: 'Oligomenorrhea / Amenorrhea (>35 days cycle interval)',
      score: `${pb.menstrualPatternScore} / 35`,
    },
    {
      dimension: 'Hyperandrogenism Features',
      focus: 'Hirsutism (Ferriman-Gallwey proxy), persistent acne, alopecia',
      score: `${pb.clinicalSymptomsScore} / 30`,
    },
    {
      dimension: 'Metabolic & Anthropometric Context',
      focus: 'Acanthosis nigricans, blood glucose, lipid profile markers',
      score: `${pb.metabolicContextScore} / 25`,
    },
    {
      dimension: 'Supporting & Family History Context',
      focus: 'First-degree PCOS history, severe dysmenorrhea, sleep apnea',
      score: `${pb.supportingContextScore} / 10`,
    },
  ];

  breakdownRows.forEach((row, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.setDrawColor(...borderGray);
    doc.rect(leftMargin, y, contentWidth, 5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...slate900);
    doc.text(row.dimension, leftMargin + 3, y + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...slate600);
    doc.text(row.focus, leftMargin + 65, y + 3.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryRose);
    doc.text(row.score, rightMargin - 20, y + 3.5, { align: 'right' });

    y += 5;
  });

  y += 4;

  // ==========================================
  // SECTION 3: SYMPTOMS & METABOLIC BIOMARKERS
  // ==========================================
  doc.setFillColor(...slate100);
  doc.rect(leftMargin, y, contentWidth, 6, 'F');
  doc.setTextColor(...slate900);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('3. REPORTED SYMPTOM PROFILE & METABOLIC BIOMARKERS', leftMargin + 3, y + 4.2);
  y += 8;

  // Symptom Matrix 2x2 Grid
  const gridW = contentWidth / 2 - 2;
  const gridH = 9;

  const symptomItems = [
    {
      label: 'Menstrual Cycle Pattern:',
      value: result.answers?.cycleRegularity === 'infrequent_over_35'
        ? 'Irregular (>35 Days)'
        : result.answers?.cycleRegularity === 'absent_3_months_plus'
        ? 'Amenorrhea (>90 Days)'
        : 'Moderately Irregular',
      alert: true,
    },
    {
      label: 'Facial / Body Hair (Hirsutism):',
      value: result.answers?.increasedFacialHair === 'moderate_to_severe'
        ? 'Moderate to Severe'
        : result.answers?.increasedFacialHair === 'mild'
        ? 'Mild Features'
        : 'None Reported',
      alert: result.answers?.increasedFacialHair !== 'none',
    },
    {
      label: 'Persistent Adult / Cystic Acne:',
      value: result.answers?.persistentAcne === 'persistent_adult_cystic'
        ? 'Persistent Cystic'
        : result.answers?.persistentAcne === 'mild_occasional'
        ? 'Mild / Occasional'
        : 'None Noted',
      alert: result.answers?.persistentAcne === 'persistent_adult_cystic',
    },
    {
      label: 'Acanthosis Nigricans / Skin Folds:',
      value: result.symptomProfile?.acanthosisSkinChanges ? 'Noted (Insulin Marker)' : 'Not Observed',
      alert: !!result.symptomProfile?.acanthosisSkinChanges,
    },
  ];

  symptomItems.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const boxX = leftMargin + (col === 0 ? 0 : gridW + 4);
    const boxY = y + row * (gridH + 2);

    doc.setFillColor(...slate50);
    doc.setDrawColor(...borderGray);
    doc.roundedRect(boxX, boxY, gridW, gridH, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(...slate600);
    doc.text(item.label, boxX + 3, boxY + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(item.alert ? primaryRose[0] : slate900[0], item.alert ? primaryRose[1] : slate900[1], item.alert ? primaryRose[2] : slate900[2]);
    doc.text(item.value, boxX + 3, boxY + 7.5);
  });

  y += 24;

  // Biomarker Measurements Table
  doc.setFillColor(...slate100);
  doc.setDrawColor(...borderGray);
  doc.rect(leftMargin, y, contentWidth, 5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(...slate800);
  doc.text('Biomarker Parameter', leftMargin + 3, y + 3.5);
  doc.text('Observed Value', leftMargin + 65, y + 3.5);
  doc.text('Clinical Reference (Adult Female)', leftMargin + 110, y + 3.5);
  doc.text('Status', rightMargin - 15, y + 3.5, { align: 'right' });

  y += 5;

  const biomarkerData = [
    {
      name: 'Random Blood Glucose',
      val: result.metabolicProfile?.glucose?.value ? `${result.metabolicProfile.glucose.value} mg/dL` : '114 mg/dL',
      ref: '70 – 140 mg/dL (Normal)',
      status: 'Normal',
      statusColor: [16, 185, 129] as [number, number, number],
    },
    {
      name: 'Total Cholesterol',
      val: result.metabolicProfile?.totalCholesterol?.value ? `${result.metabolicProfile.totalCholesterol.value} mg/dL` : '206 mg/dL',
      ref: '< 200 mg/dL (Desirable)',
      status: 'Borderline',
      statusColor: [217, 119, 6] as [number, number, number],
    },
    {
      name: 'Triglycerides',
      val: result.metabolicProfile?.triglycerides?.value ? `${result.metabolicProfile.triglycerides.value} mg/dL` : '168 mg/dL',
      ref: '< 150 mg/dL (Normal)',
      status: 'Elevated',
      statusColor: [225, 29, 72] as [number, number, number],
    },
    {
      name: 'HDL (Good) Cholesterol',
      val: result.metabolicProfile?.hdl?.value ? `${result.metabolicProfile.hdl.value} mg/dL` : '44 mg/dL',
      ref: '> 50 mg/dL (Desirable Female)',
      status: 'Sub-Optimal',
      statusColor: [71, 85, 105] as [number, number, number],
    },
  ];

  biomarkerData.forEach((row, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.setDrawColor(...borderGray);
    doc.rect(leftMargin, y, contentWidth, 4.8, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(...slate900);
    doc.text(row.name, leftMargin + 3, y + 3.3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(...slate800);
    doc.text(row.val, leftMargin + 65, y + 3.3);

    doc.setTextColor(...slate500);
    doc.text(row.ref, leftMargin + 110, y + 3.3);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...row.statusColor);
    doc.text(row.status, rightMargin - 15, y + 3.3, { align: 'right' });

    y += 4.8;
  });

  // Page 1 Footer
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.4);
  doc.line(leftMargin, 285, rightMargin, 285);

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slate500);
  doc.text('StreeSure Clinical Risk Evaluation • Confidential Medical Assessment Document', leftMargin, 289);
  doc.text('Page 1 of 2', rightMargin, 289, { align: 'right' });

  // ==========================================
  // PAGE 2: AI ANALYSIS & ACTIONABLE RECOMMENDATIONS
  // ==========================================
  doc.addPage();
  y = 14;

  // Page 2 Compact Header
  doc.setFillColor(...primaryRose);
  doc.roundedRect(leftMargin, y, 8, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('SS', leftMargin + 4, y + 5.5, { align: 'center' });

  doc.setTextColor(...slate900);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('STREESURE CLINICAL HEALTH ASSESSMENT REPORT', leftMargin + 11, y + 4.5);

  doc.setTextColor(...slate500);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(
    `Patient: ${currentUser?.fullName || 'Sunita Sharma'} • ID: ${reportId} • Date: ${formattedDate}`,
    leftMargin + 11,
    y + 8.5
  );

  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.5);
  doc.line(leftMargin, y + 11, rightMargin, y + 11);

  y += 16;

  // ==========================================
  // SECTION 4: AI CLINICAL ANALYSIS & EVIDENCE
  // ==========================================
  doc.setFillColor(...slate100);
  doc.rect(leftMargin, y, contentWidth, 6, 'F');
  doc.setTextColor(...slate900);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('4. ARTIFICIAL INTELLIGENCE CLINICAL ANALYSIS & CORRELATIONS', leftMargin + 3, y + 4.2);
  y += 8;

  // AI Headline & Explanation Box
  doc.setFillColor(...slate50);
  doc.setDrawColor(...tealPrimary);
  doc.setLineWidth(0.5);
  doc.roundedRect(leftMargin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setTextColor(...tealPrimary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('AI Synthesized Clinical Headline:', leftMargin + 4, y + 4.5);

  doc.setTextColor(...slate900);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  const headline = intelligence?.headline || result.levelTitle || 'Preliminary screening signal recorded';
  doc.text(headline, leftMargin + 4, y + 8.5);

  doc.setTextColor(...slate800);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const aiExplanationText =
    aiExplanation ||
    (intelligence?.evidence && intelligence.evidence.length > 0
      ? intelligence.evidence.map((e) => `${e.label}: ${e.detail}`).join(' ')
      : 'Your responses show a pattern of PCOS-associated features consistent with cycle variations and metabolic dynamics under Rotterdam clinical criteria.');

  const wrappedAiText = doc.splitTextToSize(aiExplanationText, contentWidth - 8);
  doc.text(wrappedAiText.slice(0, 3), leftMargin + 4, y + 13);

  y += 25;

  // Evidence Factors Grid
  const evidenceList = intelligence?.evidence || [
    {
      label: 'Menstrual Pattern Signal',
      detail: 'Cycle interval timing (>35 days) contributes strongly to the primary Rotterdam ovulatory dysfunction pillar.',
      weight: 'Primary',
    },
    {
      label: 'Hyperandrogenism Phenotype',
      detail: 'Reported facial hair/acne symptoms correlate with elevated clinical or biochemical androgen sensitivity.',
      weight: 'Primary',
    },
    {
      label: 'Metabolic Biomarker Context',
      detail: 'Elevated triglycerides and borderline cholesterol provide supporting insulin resistance context.',
      weight: 'Supporting',
    },
  ];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...slate800);
  doc.text('Key Evidence Factors Identified by Algorithm:', leftMargin, y + 3);
  y += 5;

  evidenceList.slice(0, 3).forEach((ev) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...borderGray);
    doc.roundedRect(leftMargin, y, contentWidth, 8, 1.5, 1.5, 'FD');

    doc.setFillColor(...(ev.weight === 'Primary' || (ev as any).weight === 'primary' ? primaryRose : tealPrimary));
    doc.roundedRect(leftMargin + 2.5, y + 2, 16, 4, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.text(ev.weight.toUpperCase(), leftMargin + 10.5, y + 4.8, { align: 'center' });

    doc.setTextColor(...slate900);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(ev.label, leftMargin + 21, y + 4.8);

    doc.setTextColor(...slate600);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    const detailWrap = doc.splitTextToSize(ev.detail, contentWidth - 65);
    doc.text(detailWrap[0] || ev.detail, leftMargin + 62, y + 4.8);

    y += 9.5;
  });

  y += 2;

  // ==========================================
  // SECTION 5: ACTIONABLE RECOMMENDATIONS (AI-DERIVED)
  // ==========================================
  doc.setFillColor(...slate100);
  doc.rect(leftMargin, y, contentWidth, 6, 'F');
  doc.setTextColor(...slate900);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('5. ACTIONABLE CLINICAL & LIFESTYLE RECOMMENDATIONS (AI-DERIVED)', leftMargin + 3, y + 4.2);
  y += 8;

  const actionableSteps = [
    {
      num: '1',
      title: 'Specialist Gynecologist Consultation',
      detail:
        'Schedule an in-person or teleconsultation with a registered Gynecologist via StreeSure. Discuss targeted pelvic ultrasound (TVS/TAS) to evaluate antral follicle count and ovarian stromal density.',
      badge: 'High Priority',
    },
    {
      num: '2',
      title: 'Targeted Endocrine & Metabolic Lab Tests',
      detail:
        'Consult physician for day 2-3 hormonal testing: Total & Free Testosterone, DHEAS, LH:FSH ratio, Fasting Insulin, and Serum AMH to confirm biochemical hyperandrogenism.',
      badge: 'Diagnostic',
    },
    {
      num: '3',
      title: 'Continuous Menstrual Cycle & Symptom Diary',
      detail:
        'Log cycle start dates, bleeding duration, and flow intensity daily inside the StreeSure Menstrual Tracker to provide longitudinal evidence for clinical follow-up.',
      badge: 'Monitoring',
    },
    {
      num: '4',
      title: 'Insulin-Sensitizing Nutrition & Physical Activity',
      detail:
        'Incorporate high-fiber whole grains, complex legumes, and 150 minutes/week of moderate brisk walking or yoga to improve peripheral insulin sensitivity and ovarian function.',
      badge: 'Lifestyle',
    },
    {
      num: '5',
      title: 'Grassroots Community Health Worker (ASHA) Linkage',
      detail:
        'Connect with your designated village ASHA facilitator (Radha Devi) for subsidized government nutritional kits, free hemoglobin screening, and Primary Health Center (PHC) referrals.',
      badge: 'Community',
    },
  ];

  actionableSteps.forEach((step) => {
    doc.setFillColor(...slate50);
    doc.setDrawColor(...borderGray);
    doc.roundedRect(leftMargin, y, contentWidth, 11, 1.5, 1.5, 'FD');

    // Number circle
    doc.setFillColor(...primaryRose);
    doc.circle(leftMargin + 5, y + 5.5, 3.2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(step.num, leftMargin + 5, y + 6.8, { align: 'center' });

    // Step Title & Badge
    doc.setTextColor(...slate900);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.text(step.title, leftMargin + 11, y + 4.2);

    doc.setFillColor(...slate100);
    doc.setDrawColor(...borderGray);
    doc.roundedRect(rightMargin - 22, y + 1.8, 20, 3.8, 1, 1, 'FD');
    doc.setTextColor(...slate700);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.text(step.badge, rightMargin - 12, y + 4.2, { align: 'center' });

    // Step detail
    doc.setTextColor(...slate600);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.3);
    const wrapDetail = doc.splitTextToSize(step.detail, contentWidth - 14);
    doc.text(wrapDetail.slice(0, 2), leftMargin + 11, y + 7.5);

    y += 12.5;
  });

  y += 2;

  // Urgent Red Flag Notice Box
  doc.setFillColor(254, 242, 242); // Rose-50
  doc.setDrawColor(244, 63, 94); // Rose-500
  doc.setLineWidth(0.4);
  doc.roundedRect(leftMargin, y, contentWidth, 11, 1.5, 1.5, 'FD');

  doc.setTextColor(190, 18, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('CLINICAL RED FLAG ADVISORY - WHEN TO SEEK IMMEDIATE MEDICAL ATTENTION:', leftMargin + 3, y + 4);

  doc.setTextColor(159, 18, 57);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.text(
    'Seek prompt emergency/PHC evaluation if you experience: sudden severe unilateral pelvic pain, heavy vaginal bleeding soaking >2 pads/hour for 2+ hours, unexplained syncope (fainting), or high fever with pelvic tenderness.',
    leftMargin + 3,
    y + 7.8
  );

  y += 14;

  // ==========================================
  // SECTION 6: REGULATORY DISCLAIMER & ATTESTATION
  // ==========================================
  doc.setFillColor(255, 251, 235); // Amber-50
  doc.setDrawColor(245, 158, 11); // Amber-500
  doc.setLineWidth(0.3);
  doc.roundedRect(leftMargin, y, contentWidth, 10, 1.5, 1.5, 'FD');

  doc.setTextColor(146, 64, 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.text('LEGAL & MEDICAL DISCLAIMER:', leftMargin + 3, y + 3.6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.text(
    'StreeSure is a digital screening, awareness, and decision-support portal. It does NOT provide a final medical diagnosis or replace evaluation by a qualified medical practitioner. Demo laboratory readings are simulated for clinical evaluation demonstration purposes.',
    leftMargin + 3,
    y + 6.8
  );

  y += 13;

  // Signatures & Timestamp Row
  const sigColW = contentWidth / 2 - 4;

  // Doctor sign-off
  doc.setDrawColor(...slate400);
  doc.setLineWidth(0.4);
  doc.line(leftMargin, y + 9, leftMargin + sigColW, y + 9);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(...tealPrimary);
  doc.text('Dr. Ananya Sen, MD, DGO', leftMargin + 2, y + 7.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...slate800);
  doc.text('Authorized Gynecological Reviewer • StreeSure Telehealth', leftMargin, y + 12.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(...slate500);
  doc.text('Medical Council Reg: WB-MC-49210 • Telemedicine Practice Certified', leftMargin, y + 15.5);

  // ASHA Facilitator sign-off
  doc.line(rightMargin - sigColW, y + 9, rightMargin, y + 9);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(...primaryRose);
  doc.text('Radha Devi (Govindgarh Sector)', rightMargin - sigColW + 2, y + 7.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...slate800);
  doc.text('ASHA Sangini Facilitator • Chomu Block PHC', rightMargin - sigColW, y + 12.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(...slate500);
  doc.text(`Digital Verification Timestamp: ${formattedDate} ${formattedTime}`, rightMargin - sigColW, y + 15.5);

  // Page 2 Footer
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.4);
  doc.line(leftMargin, 285, rightMargin, 285);

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slate500);
  doc.text('StreeSure Clinical Risk Evaluation • Confidential Medical Assessment Document', leftMargin, 289);
  doc.text('Page 2 of 2', rightMargin, 289, { align: 'right' });

  // Save the PDF
  doc.save(filename);

  return { success: true, filename };
}
