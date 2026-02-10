import React, { useState } from 'react';

interface DiagnosisEntry {
  primaryDiagnosis: string;
  secondaryDiagnosis?: string;
  symptoms: string[];
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

interface PatientDiagnosisProps {
  data: DiagnosisEntry[];
  onUpdate: (data: DiagnosisEntry[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

const icdCodes = [
  { code: 'A01.0', label: 'Typhoid fever' },
  { code: 'A09', label: 'Infectious gastroenteritis and colitis' },
  { code: 'B34.9', label: 'Viral infection, unspecified' },
  { code: 'E11', label: 'Type 2 diabetes mellitus' },
  { code: 'I10', label: 'Essential (primary) hypertension' },
  { code: 'J06.9', label: 'Acute upper respiratory infection' },
  { code: 'J18.9', label: 'Pneumonia, unspecified' },
  { code: 'J20.9', label: 'Acute bronchitis, unspecified' },
  { code: 'J45', label: 'Asthma' },
  { code: 'K21', label: 'Gastro-esophageal reflux disease' },
  { code: 'K29.7', label: 'Gastritis, unspecified' },
  { code: 'M54.5', label: 'Low back pain' },
  { code: 'N39.0', label: 'Urinary tract infection' },
  { code: 'R50.9', label: 'Fever, unspecified' },
  { code: 'R51', label: 'Headache' },
];

const PatientDiagnosis: React.FC<PatientDiagnosisProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [icdCode, setIcdCode] = useState('');
  const [diagnosisText, setDiagnosisText] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleAddDiagnosis = () => {
    const primaryDiagnosis = icdCode || diagnosisText.trim();

    if (!primaryDiagnosis) {
      setError('Please select an ICD-10 code or enter a diagnosis.');
      return;
    }

    const newDiagnosis: DiagnosisEntry = {
      primaryDiagnosis: icdCode ? icdCode : diagnosisText.trim(),
      secondaryDiagnosis: icdCode ? diagnosisText.trim() || undefined : undefined,
      symptoms: [],
      duration: '',
      severity,
      notes: notes.trim() || undefined,
    };

    onUpdate([...data, newDiagnosis]);

    // Reset form
    setIcdCode('');
    setDiagnosisText('');
    setSeverity('mild');
    setNotes('');
    setError('');
  };

  const handleRemoveDiagnosis = (index: number) => {
    onUpdate(data.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (data.length === 0) {
      setError('Please add at least one diagnosis before proceeding.');
      return;
    }
    setError('');
    onNext();
  };

  const getSeverityLabel = (sev: string) => sev.charAt(0).toUpperCase() + sev.slice(1);

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8">
        {/* Diagnosis Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Patient Diagnosis
            </h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
              Enter the patient's diagnosis details below.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* ICD Code + Free Text Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="icd-code">
                    ICD-10 Code
                  </label>
                  <select
                    id="icd-code"
                    value={icdCode}
                    onChange={(e) => setIcdCode(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white px-3 py-2"
                  >
                    <option value="">Select a code or enter diagnosis below</option>
                    {icdCodes.map((item) => (
                      <option key={item.code} value={`${item.code} - ${item.label}`}>
                        {item.code} - {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="diagnosis">
                    Diagnosis (Free Text)
                  </label>
                  <input
                    id="diagnosis"
                    type="text"
                    value={diagnosisText}
                    onChange={(e) => setDiagnosisText(e.target.value)}
                    placeholder="e.g., Acute Bronchitis"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
              </div>

              {/* Severity Radio Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Severity / Stage
                </label>
                <div className="flex items-center gap-4 flex-wrap">
                  {(['mild', 'moderate', 'severe'] as const).map((level) => (
                    <label key={level} className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="severity"
                        checked={severity === level}
                        onChange={() => setSeverity(level)}
                        className="form-radio h-4 w-4 text-primary border-gray-300 dark:border-gray-600 focus:ring-primary"
                      />
                      <span className="ml-2 text-gray-900 dark:text-gray-200">
                        {getSeverityLabel(level)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="notes">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional comments here..."
                  rows={3}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white px-3 py-2"
                />
              </div>

              {/* Add Diagnosis Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleAddDiagnosis}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Diagnosis
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Added Diagnoses List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Added Diagnoses {data.length > 0 && `(${data.length})`}
            </h2>
          </div>
          <div className="p-6 sm:p-8">
            {data.length === 0 ? (
              <p className="text-center text-gray-400 dark:text-gray-500 py-4">
                No diagnoses added yet. Use the form above to add one.
              </p>
            ) : (
              <ul className="space-y-4">
                {data.map((diagnosis, index) => (
                  <li
                    key={index}
                    className="p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {diagnosis.primaryDiagnosis}
                        </p>
                        {diagnosis.secondaryDiagnosis && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {diagnosis.secondaryDiagnosis}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Severity: <span className="font-medium text-gray-900 dark:text-white">{getSeverityLabel(diagnosis.severity)}</span>
                        </p>
                        {diagnosis.notes && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {diagnosis.notes}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDiagnosis(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-2 pb-8">
          <button
            onClick={onPrev}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Previous: Patient
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Next: Lifestyle Advice
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDiagnosis;
