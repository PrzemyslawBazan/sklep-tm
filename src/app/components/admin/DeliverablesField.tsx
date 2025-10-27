import { useState } from 'react';
import { Plus, X } from 'lucide-react';
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Rezultaty
            </label>
            
            {/* Add new deliverable */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newDeliverable}
                    onChange={(e) => setNewDeliverable(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Add a deliverable item..."
                />
                <button
                    type="button"
                    onClick={addDeliverable}
                    disabled={!newDeliverable.trim()}
                    className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            {/* List of deliverables */}
            {formData.deliverables.length > 0 && (
                <div className="space-y-2">
                    {formData.deliverables.map((deliverable, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            <span className="text-sm text-gray-700 flex-1">{deliverable}</span>
                            <button
                                type="button"
                                onClick={() => removeDeliverable(index)}
                                className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {formData.deliverables.length === 0 && (
                <div className="text-sm text-gray-500 italic">
                    Dodaj elementy powyżej.
                </div>
            )}
        </div>
    );
}