/** Response item from POST /api/v1/client/media/upload(-multiple) */
export interface MediaUploadItem {
  url: string;
  publicId: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}
