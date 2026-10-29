import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Film, Loader2 } from 'lucide-react';
import { uploadMedia } from '../services/adminApi';

interface ImageUploaderProps {
  currentUrl?: string;
  onUploadSuccess: (url: string) => void;
  acceptType?: 'image' | 'video' | 'both';
  label?: string;
  maxSizeMB?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentUrl = '',
  onUploadSuccess,
  acceptType = 'image',
  label = 'Upload Media File',
  maxSizeMB = 25,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl);
  const [manualInput, setManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptString = () => {
    switch (acceptType) {
      case 'video':
        return 'video/mp4,video/webm';
      case 'both':
        return 'image/jpeg,image/png,image/webp,video/mp4,video/webm';
      case 'image':
      default:
        return 'image/jpeg,image/png,image/webp';
    }
  };

  const handleFile = async (file: File) => {
    setError(null);

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds maximum allowed ${maxSizeMB}MB.`);
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const res = await uploadMedia(file, (percent) => {
        setProgress(percent);
      });
      setPreviewUrl(res.url);
      onUploadSuccess(res.url);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to upload file to server.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const isVideo = previewUrl.endsWith('.mp4') || previewUrl.endsWith('.webm');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setManualInput(!manualInput)}
          className="text-[11px] text-[#D4AF37] hover:underline"
        >
          {manualInput ? 'Switch to file upload' : 'Enter URL manually'}
        </button>
      </div>

      {manualInput ? (
        <div>
          <input
            type="text"
            value={previewUrl}
            onChange={(e) => {
              setPreviewUrl(e.target.value);
              onUploadSuccess(e.target.value);
            }}
            placeholder="e.g. /images/portfolio/insta-1.webp or https://..."
            className="w-full bg-[#1C1C1C] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition-all duration-200 relative overflow-hidden bg-[#161616] ${
            isUploading
              ? 'border-[#D4AF37]/50 bg-[#D4AF37]/5'
              : 'border-neutral-700 hover:border-[#D4AF37]/60 hover:bg-[#1a1a1a]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept={getAcceptString()}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-2">
              <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
              <div className="w-full max-w-xs bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#D4AF37] h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-neutral-400">Uploading... {progress}%</p>
            </div>
          ) : previewUrl ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-20 h-20 rounded bg-neutral-900 border border-neutral-700 overflow-hidden shrink-0 flex items-center justify-center">
                {isVideo ? (
                  <Film className="w-8 h-8 text-[#D4AF37]" />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="text-left space-y-1 max-w-xs truncate">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Media uploaded & ready</span>
                </div>
                <p className="text-[11px] text-neutral-400 truncate">{previewUrl}</p>
                <p className="text-[10px] text-neutral-500">Click or drag another file to replace</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <div className="p-3 rounded-full bg-neutral-800/80 text-[#D4AF37]">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs text-neutral-300 font-medium">
                Click to browse or drag and drop file here
              </p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
                {acceptType === 'video'
                  ? 'MP4, WebM (Max 25MB)'
                  : acceptType === 'both'
                  ? 'JPG, PNG, WebP, MP4 (Max 25MB)'
                  : 'JPG, PNG, WebP (Max 25MB)'}
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/30 p-2.5 rounded border border-red-900/50">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
