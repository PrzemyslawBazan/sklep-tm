import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { ServiceData } from './ServiceForm';

interface OverviewFieldsProps {
    formData: ServiceData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onOverviewPointsChange: (points: string[]) => void;
}

export default function OverviewFields({ 
    formData, 
    onInputChange, 
    onOverviewPointsChange 
}: OverviewFieldsProps) {
    const [newPoint, setNewPoint] = useState('');

    const addPoint = () => {
        if (newPoint.trim()) {
            onOverviewPointsChange([...formData.overview_points, newPoint.trim()]);
            setNewPoint('');
        }
    };

    const removePoint = (index: number) => {
        onOverviewPointsChange(formData.overview_points.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addPoint();
        }
    };

    return (
        <div className="space-y-4 border-t pt-6">
            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Przegląd usługi
                </h3>
                
                {/* Overview Text */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opis przeglądu usługi
                    </label>
                    <textarea
                        name="overview"
                        value={formData.overview}
                        onChange={onInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="W ramach usługi realizowany jest wniosek o przyznanie karty pobytu w Polsce. Usługa zawiera:"
                    />
                </div>

                {/* Overview Points */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Overview Punkty
                    </label>
                    
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={newPoint}
                            onChange={(e) => setNewPoint(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Add an overview point..."
                        />
                        <button
                            type="button"
                            onClick={addPoint}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add
                        </button>
                    </div>

                    {formData.overview_points.length > 0 && (
                        <div className="space-y-2">
                            {formData.overview_points.map((point, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg group"
                                >
                                    <span className="text-gray-600 text-sm">•</span>
                                    <span className="flex-1 text-sm text-gray-700">{point}</span>
                                    <button
                                        type="button"
                                        onClick={() => removePoint(index)}
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
        </div>
    );
}