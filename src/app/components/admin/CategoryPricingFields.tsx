import { ServiceData } from './ServiceForm';

interface CategoryPricingFieldsProps {
    formData: ServiceData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function CategoryPricingFields({ formData, onInputChange }: CategoryPricingFieldsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Kategoria
                </label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                    <option value="">Wybierz kategorie</option>
                    <option value="accounting">Księgowe</option>
                    <option value="hr">Kadrowe</option>
                    <option value="legal">Prawne</option>
                    <option value="immigration">Imigracyjne</option>
                    <option value="tax">Doradztwo podatkowe</option>
                </select>
            </div>
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Cena
                </label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={onInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="0.00"
                />
            </div>
            <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                    Waluta
                </label>
                <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="PLN">PLN</option>
                </select>
            </div>
        </div>
    );
}