import { useState } from 'react';
import { Plus, X, ListChecks } from 'lucide-react';
import { ServiceData } from './ServiceForm';

interface DeliverablesFieldProps {
    formData: ServiceData;
    onDeliverablesChange: (deliverables: string[]) => void;
}

export default function DeliverablesField({ formData, onDeliverablesChange }: DeliverablesFieldProps) {
    const [newDeliverable, setNewDeliverable] = useState<string>('');

    const addDeliverable = () => {
        if (newDeliverable.trim() && !formData.deliverables.includes(newDeliverable.trim())) {
            const updatedDeliverables = [...formData.deliverables, newDeliverable.trim()];
            onDeliverablesChange(updatedDeliverables);
            setNewDeliverable('');
        }
    };

    const removeDeliverable = (index: number) => {
        const updatedDeliverables = formData.deliverables.filter((_, i) => i !== index);
        onDeliverablesChange(updatedDeliverables);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addDeliverable();
        }
    };

    return (
        <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#323130] mb-1">
                <ListChecks className="w-3.5 h-3.5 text-[#008272]" />
                Rezultaty
            </label>
            
            {/* Add new deliverable */}
            <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    value={newDeliverable}
                    onChange={(e) => setNewDeliverable(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] placeholder:text-[#A19F9D]"
                    placeholder="Add a deliverable item..."
                />
                <button
                    type="button"
                    onClick={addDeliverable}
                    disabled={!newDeliverable.trim()}
                    className="inline-flex items-center justify-center w-9 h-9 bg-[#0078D4] hover:bg-[#106EBE] disabled:bg-[#C8C6C4] disabled:cursor-not-allowed text-white rounded-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[#0078D4] focus:ring-offset-1"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            {/* List of deliverables */}
            {formData.deliverables.length > 0 && (
                <div className="border border-[#EDEBE9] rounded-sm overflow-hidden">
                    {formData.deliverables.map((deliverable, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between px-3 py-2.5 bg-white hover:bg-[#FAF9F8] border-b border-[#EDEBE9] last:border-b-0 group"
                        >
                            <span className="text-sm text-[#323130] flex-1">{deliverable}</span>
                            <button
                                type="button"
                                onClick={() => removeDeliverable(index)}
                                className="ml-2 p-1 text-[#A19F9D] hover:text-[#A4262C] hover:bg-[#FDE7E9] rounded-sm transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {formData.deliverables.length === 0 && (
                <p className="text-xs text-[#605E5C]">
                    Dodaj elementy powyżej.
                </p>
            )}
        </div>
    );
}