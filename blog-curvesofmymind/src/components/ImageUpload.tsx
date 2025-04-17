"use client";
import { XIcon } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

interface ImageUploadProps {
    onChange: (url: string) => void;
    value: string;
    endpoint: "imageUploader";
}

function ImageUpload({ endpoint, onChange, value }: ImageUploadProps) {
    if (value) {
        return (
            <div className="relative flex items-center justify-center py-2 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={value}
                    alt="Upload"
                    className="w-50 rounded-md object-cover max-w-full max-h-full h-full"
                />
                <button
                    onClick={() => onChange("")}
                    className="absolute top-3 right-2 p-1 bg-red-500 rounded-full shadow-sm"
                    type="button"
                >
                    <XIcon className="h-4 w-4 text-white" />
                </button>
            </div>
        );
    }
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].ufsUrl);
            }}
            onUploadError={(error: Error) => {
                console.error(error);
            }}
            className="bg-black text-white"
        />
    );
}
export default ImageUpload;
