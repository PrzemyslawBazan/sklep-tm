import { ServiceData } from './ServiceForm';
import { Grid3X3, Coins, Banknote } from 'lucide-react';

interface CategoryPricingFieldsProps {
    formData: ServiceData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function CategoryPricingFields({ formData, onInputChange }: CategoryPricingFieldsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
                <label htmlFor="category" className="flex items-center gap-1.5 text-xs font-semibold text-[#323130] mb-1">
                    <Grid3X3 className="w-3.5 h-3.5 text-[#0078D4]" />
                    Kategoria
                </label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20width%3d%2212%22%20height%3d%2212%22%20viewBox%3d%220%200%2012%2012%22%3e%3cpath%20fill%3d%22%23605E5C%22%20d%3d%22M2%204l4%204%204-4%22%2f%3e%3c%2fsvg%3e')] bg-no-repeat bg-[center_right_12px]"
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
                <label htmlFor="price" className="flex items-center gap-1.5 text-xs font-semibold text-[#323130] mb-1">
                    <Coins className="w-3.5 h-3.5 text-[#107C10]" />
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
                    className="w-full px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] placeholder:text-[#A19F9D]"
                    placeholder="0.00"
                />
            </div>
            <div>
                <label htmlFor="currency" className="flex items-center gap-1.5 text-xs font-semibold text-[#323130] mb-1">
                    <Banknote className="w-3.5 h-3.5 text-[#5C2D91]" />
                    Waluta
                </label>
                <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20width%3d%2212%22%20height%3d%2212%22%20viewBox%3d%220%200%2012%2012%22%3e%3cpath%20fill%3d%22%23605E5C%22%20d%3d%22M2%204l4%204%204-4%22%2f%3e%3c%2fsvg%3e')] bg-no-repeat bg-[center_right_12px]"
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