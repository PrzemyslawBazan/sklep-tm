import React, { useState, useRef } from "react";

interface PhotoUploadFieldProps {
    onPhotoChange: (file: File | null, previewUrl: string | null) => void;
    currentPhotoUrl?: string | null;
}

export default function PhotoUploadField({ onPhotoChange, currentPhotoUrl }: PhotoUploadFieldProps) {
    const [preview, setPreview] = useState<string | null>(currentPhotoUrl ?? null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;

        setIsUploading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            const url = reader.result as string;
            setPreview(url);
            setIsUploading(false);
            onPhotoChange(file, url);
        };
        reader.readAsDataURL(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const handleRemove = () => {
        setPreview(null);
        onPhotoChange(null, null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div>
            <label className="block text-xs font-semibold text-[#323130] mb-1">
                Zdjecie poglądowe
            </label>

            {preview ? (
                <div className="flex items-center gap-4 p-3 border border-[#8A8886] rounded-sm bg-white">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-sm border border-[#E1DFDD]"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#323130] font-semibold truncate">Wybrane zdjecie</p>
                        <p className="text-xs text-[#605E5C] mt-0.5">Click remove to choose a different image</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="px-3 py-1.5 text-xs font-semibold text-[#0078D4] border border-[#0078D4] rounded-sm hover:bg-[#EFF6FC] transition-colors"
                        >
                            Change
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="px-3 py-1.5 text-xs font-semibold text-[#A4262C] border border-[#A4262C] rounded-sm hover:bg-[#FDF3F4] transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`
                        flex flex-col items-center justify-center gap-2 px-4 py-8
                        border-2 border-dashed rounded-sm cursor-pointer transition-colors
                        ${isDragging
                            ? 'border-[#0078D4] bg-[#EFF6FC]'
                            : 'border-[#C8C6C4] bg-[#FAF9F8] hover:border-[#0078D4] hover:bg-[#EFF6FC]'
                        }
                    `}
                >
                    {isUploading ? (
                        <div className="w-5 h-5 border-2 border-[#0078D4] border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <svg className="w-8 h-8 text-[#0078D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <div className="text-center">
                                <p className="text-xs font-semibold text-[#0078D4]">
                                    Kliknij aby wgrać zdjęcie <span className="text-[#605E5C] font-normal">albo przeciągnij</span>
                                </p>
                                <p className="text-xs text-[#A19F9D] mt-0.5">Wspierane formaty: PNG, JPG, WEBP do 10MB</p>
                            </div>
                        </>
                    )}
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
            />
        </div>
    );
}