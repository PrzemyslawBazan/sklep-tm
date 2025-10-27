import { Plus, Sparkles } from 'lucide-react';

export default function FormHeader() {
    return (
        <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Dodaj nową usługę</h2>
                        <p className="text-sm text-gray-500 mt-1">Stwórz nową usługę w bazie danych</p>
                    </div>
                </div>
                <Plus className="h-5 w-5 text-gray-400" />
            </div>
        </div>
    );
}