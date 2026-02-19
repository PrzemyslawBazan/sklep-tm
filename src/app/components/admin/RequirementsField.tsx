import { useState } from 'react';
import { Plus, X, ClipboardList } from 'lucide-react';
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
        <div className="border-t border-[#EDEBE9] pt-5">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold text-[#323130] uppercase tracking-wide mb-4">
                <ClipboardList className="w-3.5 h-3.5 text-[#D83B01]" />
                Co przygotować? (Wymagania)
            </h3>
            
            <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] placeholder:text-[#A19F9D]"
                    placeholder="Add a requirement (e.g., skan paszportu)..."
                />
                <button
                    type="button"
                    onClick={addRequirement}
                    disabled={!newRequirement.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0078D4] hover:bg-[#106EBE] disabled:bg-[#C8C6C4] disabled:cursor-not-allowed text-white text-sm rounded-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[#0078D4] focus:ring-offset-1"
                >
                    <Plus className="h-4 w-4" />
                    Dodaj
                </button>
            </div>

            {formData.requirements.length > 0 && (
                <div className="border border-[#EDEBE9] rounded-sm overflow-hidden">
                    {formData.requirements.map((requirement, index) => (
                        <div 
                            key={index}
                            className="flex items-center gap-2.5 px-3 py-2.5 bg-white hover:bg-[#FAF9F8] border-b border-[#EDEBE9] last:border-b-0 group"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D83B01] flex-shrink-0" />
                            <span className="flex-1 text-sm text-[#323130]">{requirement}</span>
                            <button
                                type="button"
                                onClick={() => removeRequirement(index)}
                                className="p-1 text-[#A19F9D] hover:text-[#A4262C] hover:bg-[#FDE7E9] rounded-sm transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {formData.requirements.length === 0 && (
                <p className="text-xs text-[#605E5C]">
                    Dodaj wymagania powyżej.
                </p>
            )}
        </div>
    );
}