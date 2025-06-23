import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onImagesChange: (images: string[]) => void;
}

export function ImageUploader({ onImagesChange }: ImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageUrls = acceptedFiles.map(file => URL.createObjectURL(file));
    onImagesChange(imageUrls);
  }, [onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 4
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
      {isDragActive ? (
        <p>Drop the images here...</p>
      ) : (
        <div>
          <p>Drag & drop images here, or click to select</p>
          <p className="text-sm text-muted-foreground mt-1">
            Up to 4 images (JPEG, PNG, GIF, WebP)
          </p>
        </div>
      )}
    </div>
  );
}
