/** District/Ward (quận/huyện, phường/xã) – optional, khi API trả về */
export interface DistrictOrWard {
  _id?: string;
  code: string;
  name: { vi: string; en: string };
}

/** Province – GET /api/v1/provinces */
export interface Province {
  _id: string;
  code: string;
  slug: string;
  name: { vi: string; en: string };
  fullName?: { vi: string; en: string };
  /** Quận/huyện, phường/xã – API có thể trả về `wards` (DB) hoặc `districts` */
  districts?: DistrictOrWard[];
  wards?: DistrictOrWard[];
}
