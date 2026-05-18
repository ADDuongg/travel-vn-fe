import React, { useRef, useState } from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUploadMedia } from '@/features/media/hooks';
import type { TourGuideCv } from '@/features/tour-guide/types';

type CvValue = TourGuideCv | null | undefined;

export interface CvUploadFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  disabled?: boolean;
  onDirtyChange?: () => void;
}

export function CvUploadField<T extends FieldValues>({
  control,
  name,
  disabled = false,
  onDirtyChange,
}: CvUploadFieldProps<T>) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadMedia();
  const [localError, setLocalError] = useState<string | null>(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const value = field.value as CvValue;
        const displayName =
          value && 'filename' in value && value.filename
            ? value.filename
            : value?.url?.split('/').pop() ?? '';

        const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (!file) return;
          setLocalError(null);
          try {
            const item = await uploadMutation.mutateAsync(file);
            const next: TourGuideCv = {
              url: item.url,
              publicId: item.publicId,
              filename: file.name,
              format: item.format,
            };
            field.onChange(next);
            onDirtyChange?.();
          } catch (err: unknown) {
            const msg =
              err && typeof err === 'object' && 'message' in err
                ? String((err as { message: string }).message)
                : t('tour_guide.media_upload_error_desc');
            setLocalError(msg);
          }
        };

        const handleRemove = () => {
          field.onChange(null);
          onDirtyChange?.();
          setLocalError(null);
        };

        const isUploading = uploadMutation.isPending;

        return (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                disabled={disabled || isUploading}
                onChange={handleFile}
              />
              <Button
                type="button"
                variant="outline"
                disabled={disabled || isUploading}
                className="gap-2"
                onClick={() => inputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Upload className="size-4" aria-hidden />
                )}
                {value
                  ? t('tour_guide.field_cv_replace')
                  : t('tour_guide.field_cv_upload')}
              </Button>
              {value && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={disabled || isUploading}
                    className="text-destructive hover:text-destructive"
                    onClick={handleRemove}
                  >
                    {t('tour_guide.field_cv_remove')}
                  </Button>
                  <a
                    href={value.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {t('tour_guide.download_cv')}
                  </a>
                  {displayName ? (
                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {displayName}
                    </span>
                  ) : null}
                </>
              )}
            </div>
            {isUploading ? (
              <p className="text-xs text-muted-foreground">
                {t('tour_guide.field_cv_uploading')}
              </p>
            ) : null}
            {localError ? (
              <Alert variant="destructive">
                <AlertTitle>{t('tour_guide.media_upload_error_title')}</AlertTitle>
                <AlertDescription>{localError}</AlertDescription>
              </Alert>
            ) : null}
          </div>
        );
      }}
    />
  );
}

