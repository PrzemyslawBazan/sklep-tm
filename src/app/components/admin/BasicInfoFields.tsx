import { ServiceData } from './ServiceForm';

interface BasicInfoFieldsProps {
    formData: ServiceData;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BasicInfoFields({ formData, onNameChange, onInputChange }: BasicInfoFieldsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nazwa usługi *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onNameChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter service name"
                />
            </div>
            <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug
                </label>
                <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50"
                    placeholder="auto-generated-slug"
                />
            </div>
        </div>
    );
}