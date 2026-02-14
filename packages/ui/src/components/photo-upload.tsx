import * as React from 'react';
import { useField } from '@tanstack/react-form';
import type { AnyFormApi } from '@tanstack/react-form';
import { Button } from '@workspace/ui/components/button';
import { Label } from '@workspace/ui/components/label';
import { X, Upload, Image } from '@phosphor-icons/react';

interface PhotoUploadProps {
  name: string;
  label: string;
  form: AnyFormApi; // TanStack Form instance
  maxFiles?: number;
  maxSizeMB?: number;
  onUpload: (files: File[]) => Promise<{ urls: string[] }>;
}

export function PhotoUpload({
  name,
  label,
  form,
  maxFiles = 10,
  maxSizeMB = 10,
  onUpload,
}: PhotoUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const field = useField({
    name,
    form,
    defaultValue: [] as Array<{ url: string }>,
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file count
    const currentPhotos = (field.state.value || []) as Array<{ url: string }>;
    if (currentPhotos.length + files.length > maxFiles) {
      setUploadError(`Maximum ${maxFiles} photos allowed`);
      return;
    }

    // Validate file types and sizes
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files are allowed');
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setUploadError(`File size must be less than ${maxSizeMB}MB`);
        return;
      }
    }

    setUploading(true);
    setUploadError(null);

    try {
      const response = await onUpload(files);
      const newPhotos = response.urls.map((url: string) => ({ url }));
      const currentPhotos = (field.state.value || []) as Array<{ url: string }>;
      const updatedPhotos = [...currentPhotos, ...newPhotos];
      field.setValue(updatedPhotos);
    } catch (err) {
      const error = err as Error;
      setUploadError(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    const currentPhotos = (field.state.value || []) as Array<{ url: string }>;
    const updatedPhotos = currentPhotos.filter((_, i) => i !== index);
    field.setValue(updatedPhotos);
  };

  const currentPhotos = (field.state.value || []) as Array<{ url: string }>;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Upload button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || currentPhotos.length >= maxFiles}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : `Upload Photos (${currentPhotos.length}/${maxFiles})`}
        </Button>
      </div>

      {/* Error message */}
      {uploadError && <div className="text-sm text-destructive">{uploadError}</div>}

      {/* Photo grid */}
      {currentPhotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {currentPhotos.map((photo: { url: string }, index: number) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border">
                <img
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {currentPhotos.length === 0 && !uploading && (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <Image className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No photos uploaded yet. Click upload to add photos.
          </p>
        </div>
      )}
    </div>
  );
}
