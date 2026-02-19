import { ServiceData } from './ServiceForm';
import { Percent, Receipt, CircleCheck } from 'lucide-react';

interface VatOptionsFieldsProps {
    formData: ServiceData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function VatOptionsFields({ formData, onInputChange }: VatOptionsFieldsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
                <label htmlFor="vat_rate" className="flex items-center gap-1.5 text-xs font-semibold text-[#323130] mb-1">
                    <Percent className="w-3.5 h-3.5 text-[#D83B01]" />
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
                    className="w-full px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] placeholder:text-[#A19F9D]"
                    placeholder="0.00"
                />
            </div>
            <div className="flex flex-col justify-center gap-3">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative">
                        <input
                            type="checkbox"
                            name="price_includes"
                            checked={formData.price_includes}
                            onChange={onInputChange}
                            className="peer sr-only"
                        />
                        <div className="w-4 h-4 border border-[#8A8886] rounded-sm bg-white peer-checked:bg-[#0078D4] peer-checked:border-[#0078D4] peer-focus:ring-1 peer-focus:ring-[#0078D4] peer-focus:ring-offset-1 transition-colors">
                            <svg className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 16 16" fill="none">
                                <path d="M12 5L6.5 10.5L4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <svg className="absolute inset-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 16 16" fill="none">
                            <path d="M12 5L6.5 10.5L4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm text-[#323130]">
                        <Receipt className="w-3.5 h-3.5 text-[#0078D4]" />
                        Cena obejmuje VAT
                    </span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={onInputChange}
                            className="peer sr-only"
                        />
                        <div className="w-4 h-4 border border-[#8A8886] rounded-sm bg-white peer-checked:bg-[#0078D4] peer-checked:border-[#0078D4] peer-focus:ring-1 peer-focus:ring-[#0078D4] peer-focus:ring-offset-1 transition-colors">
                            <svg className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 16 16" fill="none">
                                <path d="M12 5L6.5 10.5L4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <svg className="absolute inset-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 16 16" fill="none">
                            <path d="M12 5L6.5 10.5L4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm text-[#323130]">
                        <CircleCheck className="w-3.5 h-3.5 text-[#107C10]" />
                        Usługa jest aktywna
                    </span>
                </label>
            </div>
        </div>
    );
}