import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { ServiceData } from './ServiceForm';

interface RequirementsFieldProps {
    formData: ServiceData;
    onRequirementsChange: (requirements: string[]) => void;
}

export default function RequirementsField({ formData, onRequirementsChange }: RequirementsFieldProps) {
    const [newRequirement, setNewRequirement] = useState('');

    const addRequirement = () => {
        if (newRequirement.trim()) {
            onRequirementsChange([...formData.requirements, newRequirement.trim()]);
            setNewRequirement('');
        }
    };

    const removeRequirement = (index: number) => {
        onRequirementsChange(formData.requirements.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addRequirement();
        }
    };

    return (
        <div className="space-y-4 border-t pt-6">
            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Co przygotować? (Wymagania)
                </h3>
                
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a requirement (e.g., skan paszportu)..."
                    />
                    <button
                        type="button"
                        onClick={addRequirement}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Dodaj
                    </button>
                </div>

                {formData.requirements.length > 0 && (
                    <div className="space-y-2">
                        {formData.requirements.map((requirement, index) => (
                            <div 
                                key={index}
                                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg group"
                            >
                                <span className="text-gray-600 text-sm">•</span>
                                <span className="flex-1 text-sm text-gray-700">{requirement}</span>
                                <button
                                    type="button"
                                    onClick={() => removeRequirement(index)}
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