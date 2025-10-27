import { ServiceData } from './ServiceForm';

interface DescriptionFieldsProps {
    formData: ServiceData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function DescriptionFields({ formData, onInputChange }: DescriptionFieldsProps) {
    return (
        <>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Krótki opis
                </label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Krótki opis usługi"
                />
            </div>
            <div>
                <label htmlFor="full_description" className="block text-sm font-medium text-gray-700 mb-2">
                    Pełny opis
                </label>
                <textarea
                    id="full_description"
                    name="full_description"
                    value={formData.full_description}
                    onChange={onInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Szczegółowy opis usługi"
                />
            </div>
        </>
    );
}