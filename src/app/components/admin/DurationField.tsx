import { Clock } from 'lucide-react';
import { ServiceData } from './ServiceForm';

interface DurationFieldProps {
    formData: ServiceData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DurationField({ formData, onInputChange }: DurationFieldProps) {
    const blockDecimals = (e: React.KeyboardEvent) => {
        if (e.key === '.' || e.key === ',') e.preventDefault();
    };

    return (
        <div className="border-t border-[#EDEBE9] pt-5">
            <h3 className="text-xs font-semibold text-[#323130] uppercase tracking-wide mb-4">
                Czas realizacji
            </h3>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#323130] mb-1">
                        <Clock className="w-3.5 h-3.5 text-[#0078D4]" />
                        Minimalna liczba dni
                    </label>
                    <input
                        type="number"
                        name="start_time"
                        value={formData.start_time ?? ''}
                        onChange={onInputChange}
                        onKeyDown={blockDecimals}
                        min={1}
                        step={1}
                        className="w-full px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] placeholder:text-[#A19F9D]"
                        placeholder="np. 7"
                    />
                </div>

                <div className="flex items-end pb-2 text-[#A19F9D] text-sm">—</div>

                <div className="flex-1">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#323130] mb-1">
                        <Clock className="w-3.5 h-3.5 text-[#5C2D91]" />
                        Maksymalna liczba dni
                    </label>
                    <input
                        type="number"
                        name="finish_time"
                        value={formData.finish_time ?? ''}
                        onChange={onInputChange}
                        onKeyDown={blockDecimals}
                        min={1}
                        step={1}
                        className="w-full px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] placeholder:text-[#A19F9D]"
                        placeholder="np. 30"
                    />
                </div>
            </div>

            {formData.start_time && formData.finish_time && Number(formData.start_time) > Number(formData.finish_time) && (
                <p className="mt-2 text-xs text-[#A4262C]">
                    Minimalna liczba dni nie może być większa niż maksymalna.
                </p>
            )}
        </div>
    );
}