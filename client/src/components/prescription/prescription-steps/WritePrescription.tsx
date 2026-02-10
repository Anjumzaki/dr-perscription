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

interface WritePrescriptionProps {
  data: Medication[];
  onUpdate: (data: Medication[]) => void;
  onSubmit: () => void;
  onPrev: () => void;
  loading: boolean;
  error: string;
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
  error
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritePrescription;
