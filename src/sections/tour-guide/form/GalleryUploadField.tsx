import React, { useRef, useState } from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUploadMediaMultiple } from '@/features/media/hooks';
import type { TourGuideGalleryItem } from '@/features/tour-guide/types';
import { cn } from '@/lib/utils';

const DEFAULT_MAX_GALLERY = 10;

export interface GalleryUploadFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  disabled?: boolean;
  maxItems?: number;
  onDirtyChange?: () => void;
}

function reorderOrders(items: TourGuideGalleryItem[]): TourGuideGalleryItem[] {
  return items.map((item, index) => ({ ...item, order: index }));
}

export function GalleryUploadField<T extends FieldValues>({
  control,
  name,
  disabled = false,
  maxItems = DEFAULT_MAX_GALLERY,
  onDirtyChange,
}: GalleryUploadFieldProps<T>) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadMediaMultiple();
  const [localError, setLocalError] = useState<string | null>(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const items = (field.value as TourGuideGalleryItem[] | undefined) ?? [];

        const setItems = (next: TourGuideGalleryItem[]) => {
          field.onChange(reorderOrders(next));
        };

        const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
          const files = e.target.files ? Array.from(e.target.files) : [];
          e.target.value = '';
          if (files.length === 0) return;

          const remaining = maxItems - items.length;
          if (remaining <= 0) {
            setLocalError(t('tour_guide.field_gallery_max', { max: maxItems }));
            return;
          }

          const toUpload = files.slice(0, remaining);
          setLocalError(null);

          try {
            const uploaded = await uploadMutation.mutateAsync(toUpload);
            const appended: TourGuideGalleryItem[] = uploaded.map(
              (u, i) => ({
                url: u.url,
                publicId: u.publicId,
                alt: '',
                order: items.length + i,
              }),
            );
            setItems([...items, ...appended]);
            onDirtyChange?.();
          } catch (err: unknown) {
            const msg =
              err && typeof err === 'object' && 'message' in err
                ? String((err as { message: string }).message)
                : t('tour_guide.media_upload_error_desc');
            setLocalError(msg);
          }
        };

        const removeAt = (index: number) => {
          const next = items.filter((_, i) => i !== index);
          setItems(next);
          onDirtyChange?.();
        };

        const move = (index: number, delta: number) => {
          const j = index + delta;
          if (j < 0 || j >= items.length) return;
          const next = [...items];
          [next[index], next[j]] = [next[j], next[index]];
          setItems(next);
          onDirtyChange?.();
        };

        const updateAlt = (index: number, alt: string) => {
          const next = items.map((it, i) =>
            i === index ? { ...it, alt } : it,
          );
          setItems(next);
          onDirtyChange?.();
        };

        const isUploading = uploadMutation.isPending;
        const canAddMore = items.length < maxItems;

        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={disabled || isUploading || !canAddMore}
                onChange={handleFiles}
              />
              <Button
                type="button"
                variant="outline"
                disabled={disabled || isUploading || !canAddMore}
                className="gap-2"
                onClick={() => inputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <ImagePlus className="size-4" aria-hidden />
                )}
                {t('tour_guide.field_gallery_upload')}
              </Button>
            </div>

            {isUploading ? (
              <p className="text-xs text-muted-foreground">
                {t('tour_guide.field_gallery_uploading')}
              </p>
            ) : null}

            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground rounded-lg border border-dashed border-border px-4 py-8 text-center">
                {t('tour_guide.field_gallery_empty', { max: maxItems })}
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) => (
                  <li
                    key={`${item.publicId ?? item.url}-${index}`}
                    className={cn(
                      'rounded-xl border border-border bg-card p-3 shadow-sm space-y-2',
                    )}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                      <img
                        src={item.url}
                        alt={item.alt || t('tour_guide.gallery_alt')}
                        className="size-full object-cover"
                      />
                    </div>
                    <Input
                      placeholder={t(
                        'tour_guide.field_gallery_alt_placeholder',
                      )}
                      value={item.alt ?? ''}
                      disabled={disabled}
                      onChange={(e) => updateAlt(index, e.target.value)}
                    />
                    <div className="flex flex-wrap gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-8"
                        disabled={disabled || index === 0}
                        onClick={() => move(index, -1)}
                        aria-label={t('tour_guide.field_gallery_move_up')}
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-8"
                        disabled={disabled || index === items.length - 1}
                        onClick={() => move(index, 1)}
                        aria-label={t('tour_guide.field_gallery_move_down')}
                      >
                        <ArrowDown className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        disabled={disabled}
                        onClick={() => removeAt(index)}
                        aria-label={t('common.remove')}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {localError ? (
              <Alert variant="destructive">
                <AlertTitle>
                  {t('tour_guide.media_upload_error_title')}
                </AlertTitle>
                <AlertDescription>{localError}</AlertDescription>
              </Alert>
            ) : null}
          </div>
        );
      }}
    />
  );
}

