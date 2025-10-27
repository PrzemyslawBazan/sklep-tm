import { ServiceData } from './ServiceForm';

interface VatOptionsFieldsProps {
    formData: ServiceData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function VatOptionsFields({ formData, onInputChange }: VatOptionsFieldsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="vat_rate" className="block text-sm font-medium text-gray-700 mb-2">
                    Wskaźnik VAT (%)
                </label>
                <input
                    type="number"
                    id="vat_rate"
                    name="vat_rate"
                    value={formData.vat_rate}
                    onChange={onInputChange}
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="0.00"
                />
            </div>
            <div className="flex flex-col justify-center space-y-4">
                <label className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        name="price_includes"
                        checked={formData.price_includes}
                        onChange={onInputChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Cena obejmuje VAT</span>
                </label>
                <label className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={onInputChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Usługa jest aktywna</span>
                </label>
            </div>
        </div>
    );
}