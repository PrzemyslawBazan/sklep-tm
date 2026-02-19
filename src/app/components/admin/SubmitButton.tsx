import { Save } from 'lucide-react';

interface SubmitButtonProps {
    isSubmitting: boolean;
    onClick: () => void;
}

export default function SubmitButton({ isSubmitting, onClick }: SubmitButtonProps) {
    return (
        <div className="flex justify-end pt-5 border-t border-[#EDEBE9]">
            <button
                type="button"
                onClick={onClick}
                disabled={isSubmitting}
                className="inline-flex items-center px-5 py-2 bg-[#0078D4] hover:bg-[#106EBE] disabled:bg-[#C8C6C4] disabled:cursor-not-allowed text-white text-sm font-semibold rounded-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[#0078D4] focus:ring-offset-1"
            >
                {isSubmitting ? (
                    <>
                        <div className="animate-spin -ml-0.5 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Tworzenie...
                    </>
                ) : (
                    <>
                        <Save className="h-4 w-4 mr-2" />
                        Stwórz usługę
                    </>
                )}
            </button>
        </div>
    );
}