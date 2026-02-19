import { ServiceData } from './ServiceForm';

interface DescriptionFieldsProps {
    formData: ServiceData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function DescriptionFields({ formData, onInputChange }: DescriptionFieldsProps) {
    return (
        <>
            <div>
                <label htmlFor="description" className="block text-xs font-semibold text-[#323130] mb-1">
                    Krótki opis
                </label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] placeholder:text-[#A19F9D]"
                    placeholder="Krótki opis usługi"
                />
            </div>
            <div>
                <label htmlFor="full_description" className="block text-xs font-semibold text-[#323130] mb-1">
                    Pełny opis
                </label>
                <textarea
                    id="full_description"
                    name="full_description"
                    value={formData.full_description}
                    onChange={onInputChange}
                    rows={4}
                    className="w-full px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] placeholder:text-[#A19F9D] resize-none"
                    placeholder="Szczegółowy opis usługi"
                />
            </div>
        </>
    );
}