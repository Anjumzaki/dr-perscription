import React, { useState } from 'react';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  route?: string;
  notes?: string;
}

interface PrescriptionFullData {
  patient: {
    name: string;
    age: number;
    gender: string;
    phone: string;
    email?: string;
    address?: string;
    allergies?: string;
  };
  diagnosis: {
    primaryDiagnosis: string;
    secondaryDiagnosis?: string;
    symptoms: string[];
    duration: string;
    severity: string;
    notes?: string;
  }[];
  lifestyle: {
    dietaryAdvice: string[];
    exerciseRecommendations: string[];
    lifestyleModifications: string[];
    followUpInstructions: string;
  };
  vitals: {
    bloodPressure?: string;
    temperature?: string;
    heartRate?: string;
    weight?: string;
    height?: string;
    bmi?: string;
    oxygenSaturation?: string;
    respiratoryRate?: string;
  };
  tests: {
    orderedTests: string[];
    labResults?: string[];
    imagingResults?: string[];
    testNotes?: string;
  };
  medications: Medication[];
}

interface Doctor {
  name: string;
  specialization?: string;
  licenseNumber?: string;
  phone: string;
  email: string;
}

interface WritePrescriptionProps {
  data: Medication[];
  onUpdate: (data: Medication[]) => void;
  onSubmit: () => void;
  onPrev: () => void;
  loading: boolean;
  error: string;
  validationErrors?: string[];
  prescriptionData?: PrescriptionFullData;
  doctor?: Doctor | null;
}

const strengthOptions = ['5mg', '10mg', '20mg', '25mg', '50mg', '100mg', '200mg', '250mg', '500mg', '750mg', '1000mg', '100mcg', '200mcg'];
const doseOptions = ['1 tablet', '2 tablets', '1 capsule', '2 capsules', '1 puff', '2 puffs', '5ml', '10ml', '5 units', '10 units'];
const frequencyOptions = ['Once a day', 'Twice a day', 'Three times a day', 'Four times a day', 'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'Before meals', 'After meals', 'At bedtime', 'As needed'];
const durationOptions = ['3 days', '5 days', '7 days', '10 days', '14 days', '21 days', '30 days', '1 month', '2 months', '3 months', 'Until finished', 'As directed'];
const routeOptions = [
  { value: 'Oral', icon: '💊' },
  { value: 'Inhaler', icon: '🌬️' },
  { value: 'Nebulizer', icon: '☁️' },
  { value: 'Injection', icon: '💉' },
  { value: 'Topical', icon: '🧴' },
  { value: 'IV', icon: '🩺' },
];

const commonMedicines = [
  'Paracetamol', 'Ibuprofen', 'Aspirin', 'Amoxicillin', 'Azithromycin',
  'Omeprazole', 'Metformin', 'Amlodipine', 'Atorvastatin', 'Levothyroxine',
  'Cetirizine', 'Loratadine', 'Pantoprazole', 'Salbutamol Inhaler', 'Insulin',
  'Clopidogrel', 'Lisinopril', 'Montelukast', 'Prednisolone', 'Dexamethasone',
];

const WritePrescription: React.FC<WritePrescriptionProps> = ({
  data,
  onUpdate,
  onSubmit,
  onPrev,
  loading,
  error,
  validationErrors = [],
  prescriptionData,
  doctor
}) => {
  const medications = Array.isArray(data) ? data : [];

  const [searchMedicine, setSearchMedicine] = useState('');
  const [strength, setStrength] = useState(strengthOptions[7]); // 500mg
  const [dose, setDose] = useState(doseOptions[0]); // 1 tablet
  const [frequency, setFrequency] = useState(frequencyOptions[1]); // Twice a day
  const [duration, setDuration] = useState(durationOptions[2]); // 7 days
  const [route, setRoute] = useState('Oral');
  const [instructionsEn, setInstructionsEn] = useState('');
  const [instructionsUr, setInstructionsUr] = useState('');
  const [pharmacistNotes, setPharmacistNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredMedicines = searchMedicine.trim()
    ? commonMedicines.filter(m => m.toLowerCase().includes(searchMedicine.toLowerCase()))
    : [];

  const selectMedicine = (name: string) => {
    setSearchMedicine(name);
    setSearchFocused(false);
  };

  const addMedication = () => {
    if (!searchMedicine.trim()) {
      setFormError('Please enter or search for a medicine name.');
      return;
    }

    const instructionParts = [instructionsEn, instructionsUr].filter(Boolean);
    const newMed: Medication = {
      name: searchMedicine.trim(),
      dosage: `${strength}, ${dose}`,
      frequency,
      duration,
      route,
      instructions: instructionParts.length > 0 ? instructionParts.join(' | ') : undefined,
      notes: pharmacistNotes || undefined,
    };

    onUpdate([...medications, newMed]);

    // Reset form
    setSearchMedicine('');
    setStrength(strengthOptions[7]);
    setDose(doseOptions[0]);
    setFrequency(frequencyOptions[1]);
    setDuration(durationOptions[2]);
    setRoute('Oral');
    setInstructionsEn('');
    setInstructionsUr('');
    setPharmacistNotes('');
    setFormError('');
  };

  const removeMedication = (index: number) => {
    onUpdate(medications.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (medications.length === 0) {
      setFormError('Please add at least one medication to create the prescription.');
      return;
    }
    setFormError('');
    onSubmit();
  };

  const handlePrint = () => {
    if (!prescriptionData || medications.length === 0) {
      setFormError('Please add at least one medication before printing.');
      return;
    }

    const { patient, diagnosis, lifestyle, vitals, tests } = prescriptionData;
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const vitalsHtml = [
      vitals.bloodPressure && `<span><strong>BP:</strong> ${vitals.bloodPressure}</span>`,
      vitals.heartRate && `<span><strong>HR:</strong> ${vitals.heartRate}</span>`,
      vitals.temperature && `<span><strong>Temp:</strong> ${vitals.temperature}</span>`,
      vitals.oxygenSaturation && `<span><strong>SpO2:</strong> ${vitals.oxygenSaturation}</span>`,
      vitals.respiratoryRate && `<span><strong>RR:</strong> ${vitals.respiratoryRate}</span>`,
      vitals.weight && `<span><strong>Weight:</strong> ${vitals.weight} kg</span>`,
      vitals.height && `<span><strong>Height:</strong> ${vitals.height} cm</span>`,
      vitals.bmi && `<span><strong>BMI:</strong> ${vitals.bmi}</span>`,
    ].filter(Boolean).join('&nbsp;&nbsp;|&nbsp;&nbsp;');

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${patient.name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a1a; padding: 20px; font-size: 13px; }
          .prescription { max-width: 800px; margin: 0 auto; border: 2px solid #2563eb; padding: 0; }

          /* Header */
          .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; }
          .header-left h1 { font-size: 22px; margin-bottom: 2px; }
          .header-left p { font-size: 12px; opacity: 0.9; }
          .header-right { text-align: right; font-size: 11px; }
          .header-right p { margin-bottom: 2px; }

          /* Patient Info */
          .patient-section { padding: 16px 24px; background: #f0f7ff; border-bottom: 1px solid #dbeafe; display: flex; justify-content: space-between; }
          .patient-section .col { flex: 1; }
          .patient-section p { margin-bottom: 3px; font-size: 12px; }
          .patient-section strong { color: #1e40af; }

          /* Vitals Bar */
          .vitals-bar { padding: 10px 24px; background: #fefce8; border-bottom: 1px solid #fef08a; font-size: 11px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
          .vitals-bar strong { color: #854d0e; }

          /* Diagnosis */
          .diagnosis-section { padding: 14px 24px; border-bottom: 1px solid #e5e7eb; }
          .section-title { font-size: 13px; font-weight: 700; color: #1e40af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; border-bottom: 1px solid #dbeafe; padding-bottom: 4px; }
          .diagnosis-item { margin-bottom: 8px; padding: 8px 12px; background: #f9fafb; border-radius: 4px; border-left: 3px solid #2563eb; }
          .diagnosis-item p { font-size: 12px; margin-bottom: 2px; }
          .symptoms-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; align-items: center; }
          .symptoms-label { font-size: 12px; font-weight: 700; color: #374151; margin-right: 6px; }
          .symptom-tag { background: #f3f4f6; color: #374151; padding: 2px 8px; border-radius: 10px; font-size: 11px; margin-left: 0; }

          /* Rx Section */
          .rx-section { padding: 16px 24px; }
          .rx-symbol { font-size: 28px; font-weight: 700; color: #2563eb; font-family: serif; margin-bottom: 10px; }
          .med-table { width: 100%; border-collapse: collapse; }
          .med-table th { background: #1e40af; color: white; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
          .med-table td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
          .med-table tr:nth-child(even) { background: #f9fafb; }
          .med-num { font-weight: 700; color: #111827; text-align: center; width: 36px; }
          .med-name { font-weight: 600; }
          .med-instructions { font-size: 11px; color: #6b7280; margin-top: 2px; }

          /* Advice */
          .advice-section { padding: 14px 24px; border-top: 1px solid #e5e7eb; }
          .advice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .advice-box h4 { font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase; margin-bottom: 4px; }
          .advice-box ul { padding-left: 16px; font-size: 11px; color: #374151; }
          .advice-box ul li { margin-bottom: 2px; }

          /* Tests */
          .tests-section { padding: 14px 24px; border-top: 1px solid #e5e7eb; }
          .test-list { display: flex; flex-wrap: wrap; gap: 6px; }
          .test-tag { background: #fef3c7; color: #92400e; padding: 2px 10px; border-radius: 10px; font-size: 11px; border: 1px solid #fde68a; }

          /* Follow-up */
          .followup { padding: 12px 24px; background: #f0fdf4; border-top: 1px solid #bbf7d0; font-size: 12px; }
          .followup strong { color: #166534; }

          /* Footer */
          .footer { padding: 16px 24px; border-top: 2px solid #2563eb; display: flex; justify-content: space-between; align-items: flex-end; }
          .signature-area { text-align: right; }
          .signature-line { width: 200px; border-top: 1px solid #1a1a1a; margin-top: 40px; margin-left: auto; padding-top: 4px; font-size: 12px; }
          .footer-left { font-size: 10px; color: #6b7280; }

          @media print {
            body { padding: 0; }
            .prescription { border: none; }
            @page { margin: 10mm; size: A4; }
          }
        </style>
      </head>
      <body>
        <div class="prescription">
          <!-- Header -->
          <div class="header">
            <div class="header-left">
              <h1>Dr. ${doctor?.name || 'Doctor'}</h1>
              <p>${doctor?.specialization || 'General Physician'}${doctor?.licenseNumber ? ` | License: ${doctor.licenseNumber}` : ''}</p>
            </div>
            <div class="header-right">
              <p><strong>Date:</strong> ${today}</p>
              ${doctor?.phone ? `<p>Tel: ${doctor.phone}</p>` : ''}
              ${doctor?.email ? `<p>${doctor.email}</p>` : ''}
            </div>
          </div>

          <!-- Patient Info -->
          <div class="patient-section">
            <div class="col">
              <p><strong>Patient:</strong> ${patient.name}</p>
              <p><strong>Age/Gender:</strong> ${patient.age} yrs / ${patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}</p>
              <p><strong>Phone:</strong> ${patient.phone}</p>
            </div>
            <div class="col" style="text-align:right;">
              ${patient.address ? `<p><strong>Address:</strong> ${patient.address}</p>` : ''}
              ${patient.allergies ? `<p style="color:#dc2626;"><strong>Allergies:</strong> ${patient.allergies}</p>` : ''}
            </div>
          </div>

          <!-- Vitals -->
          ${vitalsHtml ? `<div class="vitals-bar">${vitalsHtml}</div>` : ''}

          <!-- Diagnosis -->
          ${diagnosis.length > 0 ? `
          <div class="diagnosis-section">
            <div class="section-title">Diagnosis</div>
            ${diagnosis.map((d, i) => `
              <div class="diagnosis-item">
                <p><strong>${d.primaryDiagnosis}</strong>${d.severity ? ` <span style="color:#9333ea;">(${d.severity})</span>` : ''}</p>
                ${d.secondaryDiagnosis ? `<p style="font-size:11px;color:#6b7280;">${d.secondaryDiagnosis}</p>` : ''}
                ${d.duration ? `<p style="font-size:11px;">Duration: ${d.duration}</p>` : ''}
                ${d.symptoms && d.symptoms.length > 0 ? `<div class="symptoms-list"><strong class=\"symptoms-label\">Symptoms:</strong>${d.symptoms.map(s => `<span class=\"symptom-tag\">${s}</span>`).join('')}</div>` : ''}
                ${d.notes ? `<p style="font-size:11px;color:#6b7280;margin-top:4px;">Note: ${d.notes}</p>` : ''}
              </div>
            `).join('')}
          </div>` : ''}

          <!-- Rx - Medications -->
          <div class="rx-section">
            <div class="rx-symbol">Rx</div>
            <table class="med-table">
              <thead>
                <tr>
                  <th style="width:30px;">#</th>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Route</th>
                </tr>
              </thead>
              <tbody>
                ${medications.map((med, i) => `
                  <tr>
                    <td class="med-num">${i + 1}</td>
                    <td>
                      <span class="med-name">${med.name}</span>
                      ${med.instructions ? `<div class="med-instructions">${med.instructions}</div>` : ''}
                      ${med.notes ? `<div class="med-instructions">Pharmacist: ${med.notes}</div>` : ''}
                    </td>
                    <td>${med.dosage}</td>
                    <td>${med.frequency}</td>
                    <td>${med.duration}</td>
                    <td>${med.route || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Lifestyle Advice -->
          ${(lifestyle.dietaryAdvice.length > 0 || lifestyle.exerciseRecommendations.length > 0 || lifestyle.lifestyleModifications.length > 0) ? `
          <div class="advice-section">
            <div class="section-title">Advice</div>
            <div class="advice-grid">
              ${lifestyle.dietaryAdvice.length > 0 ? `
              <div class="advice-box">
                <h4>Dietary</h4>
                <ul>${lifestyle.dietaryAdvice.map(a => `<li>${a}</li>`).join('')}</ul>
              </div>` : ''}
              ${lifestyle.exerciseRecommendations.length > 0 ? `
              <div class="advice-box">
                <h4>Exercise</h4>
                <ul>${lifestyle.exerciseRecommendations.map(a => `<li>${a}</li>`).join('')}</ul>
              </div>` : ''}
              ${lifestyle.lifestyleModifications.length > 0 ? `
              <div class="advice-box">
                <h4>Lifestyle</h4>
                <ul>${lifestyle.lifestyleModifications.map(a => `<li>${a}</li>`).join('')}</ul>
              </div>` : ''}
            </div>
          </div>` : ''}

          <!-- Ordered Tests -->
          ${tests.orderedTests.length > 0 ? `
          <div class="tests-section">
            <div class="section-title">Ordered Tests</div>
            <div class="test-list">
              ${tests.orderedTests.map(t => `<span class="test-tag">${t}</span>`).join('')}
            </div>
            ${tests.testNotes ? `<p style="font-size:11px;color:#6b7280;margin-top:6px;">Note: ${tests.testNotes}</p>` : ''}
          </div>` : ''}

          <!-- Follow-up -->
          ${lifestyle.followUpInstructions ? `
          <div class="followup">
            <strong>Follow-up:</strong> ${lifestyle.followUpInstructions}
          </div>` : ''}

          <!-- Footer -->
          <div class="footer">
            <div class="footer-left">
              <p>This is a computer-generated prescription.</p>
            </div>
            <div class="signature-area">
              <div class="signature-line">
                Dr. ${doctor?.name || 'Doctor'}<br/>
                <span style="font-size:10px;color:#6b7280;">${doctor?.specialization || ''}</span>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const getRouteIcon = (r: string) => {
    switch (r) {
      case 'Oral': return 'pill';
      case 'Inhaler': return 'air';
      case 'Nebulizer': return 'airwave';
      case 'Injection': return 'syringe';
      case 'Topical': return 'water_drop';
      case 'IV': return 'iv_bag';
      default: return 'medication';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Write Prescription Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Write Prescription
              </h1>

              {(error || formError) && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error || formError}</p>
                </div>
              )}

              {validationErrors.length > 0 && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-red-700 dark:text-red-300 text-sm font-semibold mb-2">Please fix the following before submitting:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((err, i) => (
                      <li key={i} className="text-red-600 dark:text-red-400 text-sm">{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-6">
                {/* Search Medicine */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                    Search Medicine
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={searchMedicine}
                      onChange={(e) => setSearchMedicine(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-gray-400"
                      placeholder="Search by brand or generic name"
                    />
                    {/* Search Dropdown */}
                    {searchFocused && filteredMedicines.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredMedicines.map((med) => (
                          <button
                            key={med}
                            type="button"
                            onMouseDown={() => selectMedicine(med)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {med}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Strength / Dose / Frequency / Duration */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Strength</label>
                    <select
                      value={strength}
                      onChange={(e) => setStrength(e.target.value)}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-primary focus:border-primary px-3 py-2.5"
                    >
                      {strengthOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Dose</label>
                    <select
                      value={dose}
                      onChange={(e) => setDose(e.target.value)}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-primary focus:border-primary px-3 py-2.5"
                    >
                      {doseOptions.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Frequency</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-primary focus:border-primary px-3 py-2.5"
                    >
                      {frequencyOptions.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-primary focus:border-primary px-3 py-2.5"
                    >
                      {durationOptions.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Route */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">Route</label>
                  <div className="flex flex-wrap gap-3">
                    {routeOptions.map((r) => (
                      <label
                        key={r.value}
                        className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md border text-sm transition-colors ${route === r.value
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary/50'
                          }`}
                      >
                        <input
                          type="radio"
                          name="route"
                          value={r.value}
                          checked={route === r.value}
                          onChange={() => setRoute(r.value)}
                          className="hidden"
                        />
                        <span className="w-4 h-4 flex items-center justify-center text-sm">{r.icon}</span>
                        {r.value}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                      Instructions (English)
                    </label>
                    <textarea
                      value={instructionsEn}
                      onChange={(e) => setInstructionsEn(e.target.value)}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-primary focus:border-primary px-3 py-2"
                      placeholder="e.g., Take with food"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                      Instructions (اردو)
                    </label>
                    <textarea
                      value={instructionsUr}
                      onChange={(e) => setInstructionsUr(e.target.value)}
                      dir="rtl"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm text-right focus:ring-primary focus:border-primary px-3 py-2"
                      placeholder="مثال کے طور پر، کھانے کے ساتھ لیں"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Notes for Pharmacist */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                    Notes for Pharmacist/Patient
                  </label>
                  <textarea
                    value={pharmacistNotes}
                    onChange={(e) => setPharmacistNotes(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-primary focus:border-primary px-3 py-2"
                    placeholder="e.g., Use spacer, Rinse mouth after inhaler"
                    rows={2}
                  />
                </div>
              </div>

              {/* Add Medicine Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={addMedication}
                  className="px-6 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Medicine
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Current Prescription & Actions */}
          <div className="space-y-6">
            {/* Current Prescription List */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Current Prescription</h2>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {medications.length} Medicine{medications.length !== 1 ? 's' : ''}
                </span>
              </div>

              {medications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
                  <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-900 dark:text-white text-sm font-semibold">No medicines added yet</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Use the form to add medicines to the prescription.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medications.map((med, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="text-xl">{routeOptions.find(ro => ro.value === med.route)?.icon ?? '💊'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white">{med.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {med.dosage}, {med.frequency}{med.duration ? ` for ${med.duration}` : ''}
                        </p>
                        {med.route && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Route: {med.route}</p>
                        )}
                        {med.instructions && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Note: {med.instructions}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onPrev}
                className="flex-1 px-6 py-3 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-md font-semibold flex items-center justify-center gap-2 transition-colors ${loading
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90'
                  }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Create Prescription
                  </>
                )}
              </button>
            </div>

            {/* Print Button */}
            <div className="mt-3">
              <button
                onClick={handlePrint}
                disabled={medications.length === 0 || !prescriptionData}
                className={`w-full px-6 py-3 rounded-md font-semibold flex items-center justify-center gap-2 transition-colors ${
                  medications.length === 0 || !prescriptionData
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed border border-gray-300'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9V2h12v7M6 14h12v8H6v-8z" />
                </svg>
                Print Prescription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritePrescription;
