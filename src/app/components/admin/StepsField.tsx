import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { ServiceData } from './ServiceForm';

interface StepsFieldProps {
    formData: ServiceData;
    onStepsChange: (steps: string[]) => void;
}

export default function StepsField({ formData, onStepsChange }: StepsFieldProps) {
    const [newStep, setNewStep] = useState('');

    const addStep = () => {
        if (newStep.trim()) {
            onStepsChange([...formData.steps, newStep.trim()]);
            setNewStep('');
        }
    };

    const removeStep = (index: number) => {
        onStepsChange(formData.steps.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addStep();
        }
    };

    return (
        <div className="space-y-4 border-t pt-6">
            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Jak działa usługa? (Kroki)
                </h3>
                
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={newStep}
                        onChange={(e) => setNewStep(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Dodaj krok (e.g., 30 min konsultacje ze specjalistą)..."
                    />
                    <button
                        type="button"
                        onClick={addStep}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add
                    </button>
                </div>

                {formData.steps.length > 0 && (
                    <div className="space-y-2">
                        {formData.steps.map((step, index) => (
                            <div 
                                key={index}
                                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg group"
                            >
                                <span className="text-gray-600 text-sm font-medium">{index + 1}.</span>
                                <span className="flex-1 text-sm text-gray-700">{step}</span>
                                <button
                                    type="button"
                                    onClick={() => removeStep(index)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                                >
                                    <X size={16} className="text-red-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}