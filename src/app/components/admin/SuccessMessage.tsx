interface SuccessMessageProps {
    show: boolean;
}

export default function SuccessMessage({ show }: SuccessMessageProps) {
    if (!show) return null;
    
    return (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="h-2 w-2 bg-white rounded-full"></div>
                    </div>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                        Usługa stworzona pomyślnie!
                    </p>
                </div>
            </div>
        </div>
    );
}