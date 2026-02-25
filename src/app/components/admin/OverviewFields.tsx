import { useState } from 'react';
import { Plus, X, FileText, List, Tag } from 'lucide-react';
import { ServiceData } from './ServiceForm';

interface UdCode {
    id: number;
    name: string;
}

interface OverviewFieldsProps {
    formData: ServiceData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onOverviewPointsChange: (points: string[]) => void;
    udCodes: { id: number; name: string }[];
    onUdCodeAdded: (code: { id: number; name: string }) => void;
}


export default function OverviewFields({ 
    formData, 
    onInputChange, 
    onOverviewPointsChange,
    udCodes,
    onUdCodeAdded,
}: OverviewFieldsProps) {
    const [newPoint, setNewPoint] = useState('');
    const [newUdCodeName, setNewUdCodeName] = useState('');
    const [isAddingUdCode, setIsAddingUdCode] = useState(false);

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

    const handleAddUdCode = async () => {
        if (!newUdCodeName.trim()) return;
        const res = await fetch('/api/ud-codes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newUdCodeName.trim() }),
        });
    const text = await res.text(); // read as text first
    console.log('Response status:', res.status);
    console.log('Response body:', text);

    if (!res.ok) {
        console.error('Failed to create UD code:', text);
        return;
    }

    const created: UdCode = JSON.parse(text);
        onUdCodeAdded(created);
        setNewUdCodeName('');
        setIsAddingUdCode(false);
    };

    return (
        <div className="border-t border-[#EDEBE9] pt-5">
            <h3 className="text-xs font-semibold text-[#323130] uppercase tracking-wide mb-4">
                Przegląd usługi
            </h3>

            <div className="mb-5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#323130] mb-1">
                    <Tag className="w-3.5 h-3.5 text-[#0078D4]" />
                    Kod UD
                </label>
                <div className="flex gap-2">
                    <select
                        name="ud_code"
                        value={formData.ud_code ?? ''}
                        onChange={onInputChange}
                        className="flex-1 px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4]"
                    >
                        <option value="">Wybierz lub dodaj kod UD</option>
                        {udCodes.map(code => (
                            <option key={code.id} value={String(code.id)}>
                                {code.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() => setIsAddingUdCode(v => !v)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#0078D4] text-[#0078D4] hover:bg-[#EFF6FC] text-sm rounded-sm transition-colors focus:outline-none"
                    >
                        <Plus className="h-4 w-4" />
                        New
                    </button>
                </div>

                {isAddingUdCode && (
                    <div className="flex gap-2 mt-2">
                        <input
                            type="text"
                            value={newUdCodeName}
                            onChange={e => setNewUdCodeName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddUdCode()}
                            placeholder="Enter new UD code name..."
                            className="flex-1 px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] placeholder:text-[#A19F9D]"
                        />
                        <button
                            type="button"
                            onClick={handleAddUdCode}
                            disabled={!newUdCodeName.trim()}
                            className="px-3 py-2 bg-[#0078D4] hover:bg-[#106EBE] disabled:bg-[#C8C6C4] disabled:cursor-not-allowed text-white text-sm rounded-sm transition-colors"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsAddingUdCode(false); setNewUdCodeName(''); }}
                            className="p-2 text-[#A19F9D] hover:text-[#A4262C] hover:bg-[#FDE7E9] rounded-sm transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
            
            <div className="mb-5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#323130] mb-1">
                    <FileText className="w-3.5 h-3.5 text-[#0078D4]" />
                    Opis przeglądu usługi
                </label>
                <textarea
                    name="overview"
                    value={formData.overview}
                    onChange={onInputChange}
                    rows={3}
                    className="w-full px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] placeholder:text-[#A19F9D] resize-none"
                    placeholder="W ramach usługi realizowany jest wniosek o przyznanie karty pobytu w Polsce. Usługa zawiera:"
                />
            </div>

            <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#323130] mb-1">
                    <List className="w-3.5 h-3.5 text-[#5C2D91]" />
                    Overview Punkty
                </label>
                
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={newPoint}
                        onChange={(e) => setNewPoint(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] placeholder:text-[#A19F9D]"
                        placeholder="Add an overview point..."
                    />
                    <button
                        type="button"
                        onClick={addPoint}
                        disabled={!newPoint.trim()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0078D4] hover:bg-[#106EBE] disabled:bg-[#C8C6C4] disabled:cursor-not-allowed text-white text-sm rounded-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[#0078D4] focus:ring-offset-1"
                    >
                        <Plus className="h-4 w-4" />
                        Add
                    </button>
                </div>

                {formData.overview_points.length > 0 && (
                    <div className="border border-[#EDEBE9] rounded-sm overflow-hidden">
                        {formData.overview_points.map((point, index) => (
                            <div 
                                key={index}
                                className="flex items-center gap-2.5 px-3 py-2.5 bg-white hover:bg-[#FAF9F8] border-b border-[#EDEBE9] last:border-b-0 group"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0078D4] flex-shrink-0" />
                                <span className="flex-1 text-sm text-[#323130]">{point}</span>
                                <button
                                    type="button"
                                    onClick={() => removePoint(index)}
                                    className="p-1 text-[#A19F9D] hover:text-[#A4262C] hover:bg-[#FDE7E9] rounded-sm transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {formData.overview_points.length === 0 && (
                    <p className="text-xs text-[#605E5C]">Dodaj punkty powyżej.</p>
                )}
            </div>
        </div>
    );
}
