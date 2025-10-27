import { Save } from 'lucide-react';

interface SubmitButtonProps {
    isSubmitting: boolean;
    onClick: () => void;
}

export default function SubmitButton({ isSubmitting, onClick }: SubmitButtonProps) {
    return (
        <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
                type="button"
                onClick={onClick}
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                {isSubmitting ? (
                    <>
                        <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
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