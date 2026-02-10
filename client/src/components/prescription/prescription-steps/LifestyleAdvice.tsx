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

    {/* ===== GRID LAYOUT ===== */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* ===== DIETARY ADVICE BOX ===== */}
      <div className="bg-white dark:bg-gray-800 border rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Dietary Advice</h3>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newDietAdvice}
            onChange={(e) => setNewDietAdvice(e.target.value)}
            onKeyPress={(e) =>
              e.key === 'Enter' &&
              addToArray('dietaryAdvice', newDietAdvice, setNewDietAdvice)
            }
            className="flex-1 px-3 py-2 border rounded-md"
            placeholder="Enter dietary advice"
          />
          <button
            type="button"
            onClick={() =>
              addToArray('dietaryAdvice', newDietAdvice, setNewDietAdvice)
            }
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Add
          </button>
        </div>

        {/* QUICK ADD - DIET */}
        <div className="mb-3">
          <p className="text-xs mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {commonDietaryAdvice.slice(0, 8).map((advice) => (
              <button
                key={advice}
                type="button"
                onClick={() => addQuickAdvice('dietaryAdvice', advice)}
                disabled={data.dietaryAdvice.includes(advice)}
                className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
              >
                {advice}
              </button>
            ))}
          </div>
        </div>

        {/* SELECTED */}
        <div className="flex flex-wrap gap-2">
          {data.dietaryAdvice.map((advice, index) => (
            <div key={index} className="px-3 py-1 bg-blue-100 rounded-full">
              {advice}
              <button onClick={() => removeFromArray('dietaryAdvice', index)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ===== EXERCISE BOX ===== */}
      <div className="bg-white dark:bg-gray-800 border rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Exercise Recommendations</h3>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newExerciseRec}
            onChange={(e) => setNewExerciseRec(e.target.value)}
            onKeyPress={(e) =>
              e.key === 'Enter' &&
              addToArray('exerciseRecommendations', newExerciseRec, setNewExerciseRec)
            }
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <button
            type="button"
            onClick={() =>
              addToArray('exerciseRecommendations', newExerciseRec, setNewExerciseRec)
            }
            className="px-4 py-2 bg-primary text-white"
          >
            Add
          </button>
        </div>

        {/* QUICK ADD - EXERCISE */}
        <div className="mb-3">
          <p className="text-xs mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {commonExerciseRecommendations.slice(0, 8).map((rec) => (
              <button
                key={rec}
                type="button"
                onClick={() =>
                  addQuickAdvice('exerciseRecommendations', rec)
                }
                disabled={data.exerciseRecommendations.includes(rec)}
                className="px-2 py-1 text-xs rounded-full bg-green-100"
              >
                {rec}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.exerciseRecommendations.map((rec, index) => (
            <div key={index} className="px-3 py-1 bg-green-100 rounded-full">
              {rec}
              <button onClick={() =>
                removeFromArray('exerciseRecommendations', index)
              }>
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* ===== FULL WIDTH ===== */}
    <div className="mt-6 bg-white dark:bg-gray-800 border rounded-xl p-4">

      <h3 className="font-semibold mb-3">
        Lifestyle Modifications & Follow-up
      </h3>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newLifestyleMod}
          onChange={(e) => setNewLifestyleMod(e.target.value)}
          onKeyPress={(e) =>
            e.key === 'Enter' &&
            addToArray('lifestyleModifications', newLifestyleMod, setNewLifestyleMod)
          }
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <button
          onClick={() =>
            addToArray('lifestyleModifications', newLifestyleMod, setNewLifestyleMod)
          }
          className="px-4 py-2 bg-primary text-white"
        >
          Add
        </button>
      </div>

      {/* QUICK ADD - LIFESTYLE */}
      <div className="mb-3">
        <p className="text-xs mb-2">Quick add:</p>
        <div className="flex flex-wrap gap-2">
          {commonLifestyleModifications.slice(0, 8).map((mod) => (
            <button
              key={mod}
              onClick={() =>
                addQuickAdvice('lifestyleModifications', mod)
              }
              disabled={data.lifestyleModifications.includes(mod)}
              className="px-2 py-1 text-xs rounded-full bg-purple-100"
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {data.lifestyleModifications.map((mod, index) => (
          <div key={index} className="px-3 py-1 bg-purple-100 rounded-full">
            {mod}
            <button
              onClick={() =>
                removeFromArray('lifestyleModifications', index)
              }
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Follow-up Instructions <span className="text-gray-400 font-normal">(Optional)</span>
      </label>

      <textarea
        value={data.followUpInstructions}
        onChange={(e) =>
          onUpdate({ followUpInstructions: e.target.value })
        }
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="e.g., Follow up in 2 weeks, Return if symptoms worsen"
      />
    </div>

    {/* NAV */}
    <div className="flex justify-between mt-6">
      <button onClick={onPrev}>Previous</button>
      <button onClick={handleNext}>Next</button>
    </div>
  </div>
);


};

export default LifestyleAdvice;