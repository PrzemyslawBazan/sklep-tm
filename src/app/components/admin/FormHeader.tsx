import { Plus } from 'lucide-react';

export default function FormHeader() {
    return (
        <div className="px-5 py-4 border-b border-[#EDEBE9] bg-[#FAF9F8]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0078D4] rounded-sm flex items-center justify-center">
                        <Plus className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-[#323130]">Dodaj nową usługę</h2>
                        <p className="text-xs text-[#605E5C]">Stwórz nową usługę w bazie danych</p>
                    </div>
                </div>
            </div>
        </div>
    );
}