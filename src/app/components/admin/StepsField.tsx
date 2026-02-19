import { useState } from 'react';
import { Plus, X, GitCommitHorizontal } from 'lucide-react';
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
        <div className="border-t border-[#EDEBE9] pt-5">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold text-[#323130] uppercase tracking-wide mb-4">
                <GitCommitHorizontal className="w-3.5 h-3.5 text-[#008272]" />
                Jak działa usługa? (Kroki)
            </h3>
            
            <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] placeholder:text-[#A19F9D]"
                    placeholder="Dodaj krok (e.g., 30 min konsultacje ze specjalistą)..."
                />
                <button
                    type="button"
                    onClick={addStep}
                    disabled={!newStep.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0078D4] hover:bg-[#106EBE] disabled:bg-[#C8C6C4] disabled:cursor-not-allowed text-white text-sm rounded-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[#0078D4] focus:ring-offset-1"
                >
                    <Plus className="h-4 w-4" />
                    Add
                </button>
            </div>

            {formData.steps.length > 0 && (
                <div className="border border-[#EDEBE9] rounded-sm overflow-hidden">
                    {formData.steps.map((step, index) => (
                        <div 
                            key={index}
                            className="flex items-center gap-3 px-3 py-2.5 bg-white hover:bg-[#FAF9F8] border-b border-[#EDEBE9] last:border-b-0 group"
                        >
                            <span className="w-5 h-5 rounded-sm bg-[#0078D4] text-white text-xs font-medium flex items-center justify-center flex-shrink-0">
                                {index + 1}
                            </span>
                            <span className="flex-1 text-sm text-[#323130]">{step}</span>
                            <button
                                type="button"
                                onClick={() => removeStep(index)}
                                className="p-1 text-[#A19F9D] hover:text-[#A4262C] hover:bg-[#FDE7E9] rounded-sm transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {formData.steps.length === 0 && (
                <p className="text-xs text-[#605E5C]">
                    Dodaj kroki powyżej.
                </p>
            )}
        </div>
    );
}