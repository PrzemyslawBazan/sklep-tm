import { ServiceData } from './ServiceForm';

interface BasicInfoFieldsProps {
    formData: ServiceData;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BasicInfoFields({ formData, onNameChange, onInputChange }: BasicInfoFieldsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
                <label htmlFor="name" className="block text-xs font-semibold text-[#323130] mb-1">
                    Nazwa usługi <span className="text-[#A4262C]">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onNameChange}
                    required
                    className="w-full px-3 py-2 text-sm text-[#323130] bg-white border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] placeholder:text-[#A19F9D]"
                    placeholder="Enter service name"
                />
            </div>
            <div>
                <label htmlFor="slug" className="block text-xs font-semibold text-[#323130] mb-1">
                    URL Slug
                </label>
                <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 text-sm text-[#605E5C] bg-[#F3F2F1] border border-[#8A8886] rounded-sm focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] placeholder:text-[#A19F9D]"
                    placeholder="auto-generated-slug"
                />
            </div>
        </div>
    );
}