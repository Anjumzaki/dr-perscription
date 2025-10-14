import React, { useState } from 'react';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface WritePrescriptionProps {
  data: Medication[];
  onUpdate: (data: Medication[]) => void;
  onSubmit: () => void;
  onPrev: () => void;
  loading: boolean;
  error: string;
}

const WritePrescription: React.FC<WritePrescriptionProps> = ({
  data,
  onUpdate,
  onSubmit,
  onPrev,
  loading,
  error
}) => {
  const [newMedication, setNewMedication] = useState<Medication>({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });
  const [formError, setFormError] = useState('');

  const commonMedications = [
    'Paracetamol', 'Ibuprofen', 'Aspirin', 'Amoxicillin', 'Azithromycin',
    'Omeprazole', 'Metformin', 'Amlodipine', 'Atorvastatin', 'Levothyroxine',
    'Cetirizine', 'Loratadine', 'Pantoprazole', 'Clopidogrel', 'Lisinopril'
  ];

  const commonDosages = [
    '250mg', '500mg', '750mg', '1g', '2.5mg', '5mg', '10mg', '20mg', '25mg', 
    '50mg', '100mg', '200mg', '1 tablet', '2 tablets', '1 capsule', '2 capsules'
  ];

  const commonFrequencies = [
    'Once daily', 'Twice daily', 'Three times daily', 'Four times daily',
    'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours',
    'Before meals', 'After meals', 'At bedtime', 'As needed'
  ];

  const commonDurations = [
    '3 days', '5 days', '7 days', '10 days', '14 days', '21 days', '30 days',
    '1 month', '2 months', '3 months', 'Until finished', 'As directed'
  ];

  const handleInputChange = (field: keyof Medication, value: string) => {
    setNewMedication(prev => ({ ...prev, [field]: value }));
  };

  const addMedication = () => {
    if (!newMedication.name.trim() || !newMedication.dosage.trim() || 
        !newMedication.frequency.trim() || !newMedication.duration.trim()) {
      setFormError('Please fill in all required fields (Name, Dosage, Frequency, Duration)');
      return;
    }

    onUpdate([...data, { ...newMedication }]);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    });
    setFormError('');
  };

  const removeMedication = (index: number) => {
    const updatedMedications = data.filter((_, i) => i !== index);
    onUpdate(updatedMedications);
  };

  const editMedication = (index: number, field: keyof Medication, value: string) => {
    const updatedMedications = data.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    );
    onUpdate(updatedMedications);
  };

  const handleSubmit = () => {
    if (data.length === 0) {
      setFormError('Please add at least one medication to create the prescription');
      return;
    }
    setFormError('');
    onSubmit();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Write Prescription
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add medications, dosages, and instructions for the patient
        </p>
      </div>

      {(error || formError) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error || formError}</p>
        </div>
      )}

      {/* Add New Medication Form */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Add Medication
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Medication Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Medication Name *
            </label>
            <input
              type="text"
              value={newMedication.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter medication name"
              list="common-medications"
            />
            <datalist id="common-medications">
              {commonMedications.map((med) => (
                <option key={med} value={med} />
              ))}
            </datalist>
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Dosage *
            </label>
            <input
              type="text"
              value={newMedication.dosage}
              onChange={(e) => handleInputChange('dosage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., 500mg, 1 tablet"
              list="common-dosages"
            />
            <datalist id="common-dosages">
              {commonDosages.map((dosage) => (
                <option key={dosage} value={dosage} />
              ))}
            </datalist>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frequency *
            </label>
            <input
              type="text"
              value={newMedication.frequency}
              onChange={(e) => handleInputChange('frequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., Twice daily, Every 8 hours"
              list="common-frequencies"
            />
            <datalist id="common-frequencies">
              {commonFrequencies.map((freq) => (
                <option key={freq} value={freq} />
              ))}
            </datalist>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duration *
            </label>
            <input
              type="text"
              value={newMedication.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., 7 days, 2 weeks"
              list="common-durations"
            />
            <datalist id="common-durations">
              {commonDurations.map((duration) => (
                <option key={duration} value={duration} />
              ))}
            </datalist>
          </div>

          {/* Instructions */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Special Instructions (Optional)
            </label>
            <textarea
              value={newMedication.instructions}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., Take with food, Avoid alcohol, Take on empty stomach"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={addMedication}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Add Medication
          </button>
        </div>
      </div>

      {/* Prescribed Medications List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Prescribed Medications ({data.length})
        </h3>
        
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p className="mt-2">No medications added yet</p>
            <p className="text-sm">Add medications using the form above</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((medication, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 dark:border-gray-600">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {medication.name}
                  </h4>
                  <button
                    onClick={() => removeMedication(index)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    title="Remove medication"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Dosage
                    </label>
                    <input
                      type="text"
                      value={medication.dosage}
                      onChange={(e) => editMedication(index, 'dosage', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Frequency
                    </label>
                    <input
                      type="text"
                      value={medication.frequency}
                      onChange={(e) => editMedication(index, 'frequency', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={medication.duration}
                      onChange={(e) => editMedication(index, 'duration', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                
                {medication.instructions && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Instructions
                    </label>
                    <textarea
                      value={medication.instructions}
                      onChange={(e) => editMedication(index, 'instructions', e.target.value)}
                      rows={2}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
        >
          Previous: Vitals & Tests
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            loading
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Creating Prescription...
            </span>
          ) : (
            'Create Prescription'
          )}
        </button>
      </div>
    </div>
  );
};

export default WritePrescription;