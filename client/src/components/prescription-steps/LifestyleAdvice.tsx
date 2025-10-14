import React, { useState } from 'react';

interface Lifestyle {
  dietaryAdvice: string[];
  exerciseRecommendations: string[];
  lifestyleModifications: string[];
  followUpInstructions: string;
}

interface LifestyleAdviceProps {
  data: Lifestyle;
  onUpdate: (data: Partial<Lifestyle>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const LifestyleAdvice: React.FC<LifestyleAdviceProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [newDietAdvice, setNewDietAdvice] = useState('');
  const [newExerciseRec, setNewExerciseRec] = useState('');
  const [newLifestyleMod, setNewLifestyleMod] = useState('');

  const commonDietaryAdvice = [
    'Increase water intake (8-10 glasses daily)',
    'Reduce sodium intake',
    'Eat more fruits and vegetables',
    'Limit processed foods',
    'Eat smaller, more frequent meals',
    'Avoid caffeine after 6 PM',
    'Increase fiber intake',
    'Limit sugar consumption',
    'Eat lean proteins',
    'Avoid alcohol',
    'Take meals at regular times',
    'Chew food slowly'
  ];

  const commonExerciseRecommendations = [
    'Walk for 30 minutes daily',
    'Light stretching exercises',
    'Breathing exercises (deep breathing)',
    'Yoga or meditation',
    'Swimming (if possible)',
    'Avoid strenuous activities',
    'Take stairs instead of elevator',
    'Regular physiotherapy sessions',
    'Morning walk in fresh air',
    'Avoid heavy lifting',
    'Rest between activities',
    'Gentle range of motion exercises'
  ];

  const commonLifestyleModifications = [
    'Maintain regular sleep schedule (7-8 hours)',
    'Avoid smoking',
    'Limit screen time before bed',
    'Practice stress management',
    'Maintain proper posture',
    'Keep room well-ventilated',
    'Avoid exposure to allergens',
    'Wear comfortable clothing',
    'Take regular breaks from work',
    'Maintain personal hygiene',
    'Use sunscreen when outdoors',
    'Keep emergency contacts handy'
  ];

  const addToArray = (field: keyof Lifestyle, value: string, setter: (value: string) => void) => {
    if (value.trim() && !(data[field] as string[]).includes(value.trim())) {
      onUpdate({ [field]: [...(data[field] as string[]), value.trim()] });
      setter('');
    }
  };

  const removeFromArray = (field: keyof Lifestyle, index: number) => {
    const updatedArray = (data[field] as string[]).filter((_, i) => i !== index);
    onUpdate({ [field]: updatedArray });
  };

  const addQuickAdvice = (field: keyof Lifestyle, advice: string) => {
    if (!(data[field] as string[]).includes(advice)) {
      onUpdate({ [field]: [...(data[field] as string[]), advice] });
    }
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Lifestyle Advice
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Provide dietary advice, exercise recommendations, and lifestyle modifications
        </p>
      </div>

      <div className="space-y-8">
        {/* Dietary Advice */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Dietary Advice
          </label>
          
          {/* Add New Advice */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newDietAdvice}
              onChange={(e) => setNewDietAdvice(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addToArray('dietaryAdvice', newDietAdvice, setNewDietAdvice)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter dietary advice"
            />
            <button
              type="button"
              onClick={() => addToArray('dietaryAdvice', newDietAdvice, setNewDietAdvice)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Add
            </button>
          </div>

          {/* Quick Add Options */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Quick add common dietary advice:</p>
            <div className="flex flex-wrap gap-2">
              {commonDietaryAdvice.slice(0, 8).map((advice) => (
                <button
                  key={advice}
                  type="button"
                  onClick={() => addQuickAdvice('dietaryAdvice', advice)}
                  disabled={data.dietaryAdvice.includes(advice)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    data.dietaryAdvice.includes(advice)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-600'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30'
                  }`}
                >
                  {advice}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Advice */}
          <div className="flex flex-wrap gap-2">
            {data.dietaryAdvice.map((advice, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm dark:bg-blue-900/20 dark:text-blue-300"
              >
                <span>{advice}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray('dietaryAdvice', index)}
                  className="ml-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Exercise Recommendations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Exercise Recommendations
          </label>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newExerciseRec}
              onChange={(e) => setNewExerciseRec(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addToArray('exerciseRecommendations', newExerciseRec, setNewExerciseRec)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter exercise recommendation"
            />
            <button
              type="button"
              onClick={() => addToArray('exerciseRecommendations', newExerciseRec, setNewExerciseRec)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Quick add common exercise recommendations:</p>
            <div className="flex flex-wrap gap-2">
              {commonExerciseRecommendations.slice(0, 8).map((rec) => (
                <button
                  key={rec}
                  type="button"
                  onClick={() => addQuickAdvice('exerciseRecommendations', rec)}
                  disabled={data.exerciseRecommendations.includes(rec)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    data.exerciseRecommendations.includes(rec)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-600'
                      : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30'
                  }`}
                >
                  {rec}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.exerciseRecommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm dark:bg-green-900/20 dark:text-green-300"
              >
                <span>{rec}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray('exerciseRecommendations', index)}
                  className="ml-1 text-green-500 hover:text-green-700 dark:hover:text-green-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Lifestyle Modifications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Lifestyle Modifications
          </label>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newLifestyleMod}
              onChange={(e) => setNewLifestyleMod(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addToArray('lifestyleModifications', newLifestyleMod, setNewLifestyleMod)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter lifestyle modification"
            />
            <button
              type="button"
              onClick={() => addToArray('lifestyleModifications', newLifestyleMod, setNewLifestyleMod)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Quick add common lifestyle modifications:</p>
            <div className="flex flex-wrap gap-2">
              {commonLifestyleModifications.slice(0, 8).map((mod) => (
                <button
                  key={mod}
                  type="button"
                  onClick={() => addQuickAdvice('lifestyleModifications', mod)}
                  disabled={data.lifestyleModifications.includes(mod)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    data.lifestyleModifications.includes(mod)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-600'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30'
                  }`}
                >
                  {mod}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.lifestyleModifications.map((mod, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm dark:bg-purple-900/20 dark:text-purple-300"
              >
                <span>{mod}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray('lifestyleModifications', index)}
                  className="ml-1 text-purple-500 hover:text-purple-700 dark:hover:text-purple-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Follow-up Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Follow-up Instructions
          </label>
          <textarea
            value={data.followUpInstructions}
            onChange={(e) => onUpdate({ followUpInstructions: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter follow-up instructions (e.g., 'Return in 1 week if symptoms persist', 'Schedule blood test in 2 weeks', etc.)"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
        >
          Previous: Diagnosis
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Next: Vitals & Tests
        </button>
      </div>
    </div>
  );
};

export default LifestyleAdvice;