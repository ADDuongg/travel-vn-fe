# Province — tài liệu FE (một file)

Hướng dẫn thống nhất cho **FE Client (public)** và **FE Admin** gọi API Province. Nguồn type: [`src/provinces/provinces.types.ts`](../src/provinces/provinces.types.ts) — copy sang repo FE.

**Mục lục**

1. [Quy ước chung (đa ngôn ngữ, không create)](#1-quy-ước-chung)
2. [FE Client — endpoint & field hiển thị](#2-fe-client--endpoint--field-hiển-thị)
3. [FE Admin — Media + PATCH province](#3-fe-admin--media--patch-province)
4. [Tóm tắt thay đổi (breaking) & migration FE](#4-tóm-tắt-thay-đổi--migration-fe)
5. [Script DB (ops)](#5-script-db-ops)
6. [Tài liệu BE liên quan](#6-tài-liệu-be-liên-quan)

---

## 1. Quy ước chung

- Tỉnh **không** tạo qua API: backend **không** có `POST /api/v1/provinces`. Dữ liệu gốc (`code`, `slug`, `name`, `wards`…) từ **seed / import DB**. Admin chỉ **cập nhật nội dung** (mô tả, ảnh, highlight, số liệu…) qua `PATCH`.
- Tên, `fullName`, `ward.name` là **`Record<locale, string>`** (key chữ thường, vd. `vi`, `en`).
- `highlights[]` dùng **`translations: { [lang]: { name, description? } }`**, không còn `name: { vi, en }` ở cùng cấp.
- Sort/search list trên BE theo **ngôn ngữ active** (collection `languages`, `isActive: true`); nếu rỗng, fallback `vi` / `en`.

---

## 2. FE Client — endpoint & field hiển thị

### 2.1 Endpoint nào gọi

| Use case | Method & path | Ghi chú |
|----------|---------------|---------|
| List có phân trang / lọc | `GET /api/v1/provinces?...` | `{ items, pagination }` — mỗi item **không** có `wards` |
| Chi tiết theo slug | `GET /api/v1/provinces/:slug` | **Có** `wards` + đủ field như list |
| Tỉnh nổi bật | `GET /api/v1/provinces/popular` | Thường **không** có `wards` và **không** có `totalHotels` / `totalTours` / `totalTourGuides` |
| Dropdown (form) | `GET /api/v1/provinces/dropdown` | Nhẹ: `_id`, `code`, `slug`, `name`, `fullName`, `wards?` — không `thumbnail`, `gallery`, counts, mô tả dài… |

Cần **số liệu** (KS / tour / HVN): dùng `GET /provinces` (paginated) hoặc `GET /provinces/:slug`. Đừng dựa counts trên `popular` nếu product cần số chính xác mà response không trả về.

### 2.2 Type: list vs detail

- **`ProvinceListItem`**: dùng cho `items`, `popular` — mọi field nội dung, **trừ** `wards`.
- **`ProvinceDetail`**: = list + **`wards: Ward[]`** (khi gọi theo slug).

### 2.3 Bảng field (hiển thị)

Key đa ngôn ngữ: **chữ thường**; đọc theo `appLocale` rồi fallback (vd. `vi`).

| Field | Ý nghĩa / UI |
|-------|----------------|
| `_id`, `type`, `code`, `slug` | Id, loại, mã, slug URL |
| `name`, `fullName?` | `DynamicLocalized` — tên ngắn / đầy đủ |
| `thumbnail?`, `gallery` | `ImageItem` — bìa, thư viện (sort theo `order` nếu có) |
| `translations[locale]` | `description?`, `shortDescription?`, `bestTimeToVisit?`, `seo?` (title, description, keywords) |
| `isPopular`, `displayOrder`, `isActive` | Badge, thứ tự, ẩn/hiện |
| `region?` | `NORTH` / `CENTRAL` / `SOUTH` |
| `population?`, `area?` | Format theo locale |
| `highlights?` | Mỗi item: `translations[lang].name` / `description?`, `thumbnail?` |
| `totalHotels?`, `totalTours?`, `totalTourGuides?` | Chủ yếu list + detail theo slug |
| `wards` | **Chỉ** detail theo slug — `name` dạng `DynamicLocalized` |
| `createdAt`, `updatedAt` | ISO string |

**`ProvinceTranslation` (trong `translations[locale]`)** — `description`, `shortDescription`, `bestTimeToVisit`, `seo` như bảng trên.

**`ImageItem`**: hiển thị cần `url`; `alt` a11y; `publicId` thường không cần trên public.

### 2.4 Lấy chuỗi theo locale (gợi ý)

```ts
type DynamicLocalized = Record<string, string>;

function pickLocale(
  d: DynamicLocalized | undefined,
  locale: string,
  fallback: string = 'vi',
): string | undefined {
  if (!d || typeof d !== 'object') return undefined;
  return (
    d[locale] ??
    d[fallback] ??
    Object.values(d).find((v) => v?.trim()) ??
    undefined
  );
}

const displayName = pickLocale(province.name, appLocale) ?? '—';

// Highlight: trực tiếp
const title =
  province.highlights?.[i]?.translations[appLocale]?.name ??
  province.highlights?.[i]?.translations['vi']?.name;
```

### 2.5 Phân trang

`GET /api/v1/provinces` trả `items` + `pagination: { page, limit, total, totalPages }`. Query: `page`, `limit`, `region`, `isPopular`, `isActive`, `search`, `sort` — xem `ProvinceQueryParams` trong `provinces.types.ts`.

---

## 3. FE Admin — Media + PATCH province

### 3.1 Hai bước tách bạch

1. **Upload ảnh** — `POST /api/v1/media/upload` (field `file`) hoặc `POST /api/v1/media/upload-multiple` (field `files`). Response chuẩn hóa: **`url`**, **`publicId`**, (tuỳ chọn) `format`, `width`, `height`, `bytes`. Map vào `thumbnail` / `gallery[]` / `highlights[].thumbnail` khi PATCH.
2. **Cập nhật tỉnh** — `PATCH /api/v1/provinces/:id` với `Content-Type: application/json` + `Authorization: Bearer` (admin). **Không** gửi file trên request province; chỉ JSON có `url` / `publicId` lấy từ bước 1.

Upload media **không** dùng `folder` Cloudinary (demo — ảnh phẳng).

### 3.2 Checklist Admin

- Không dùng `FormData` / multipart cho `PATCH` province; gửi object JSON.
- Trước save: upload ảnh → lưu `url` + `publicId` vào state.
- Mỗi `highlights[]` item: `translations` phải có `name` **non-empty** cho **mọi** ngôn ngữ active trên BE (collection `languages`).
- Không làm màn “tạo tỉnh mới” qua API (không có `POST`).

### 3.3 PATCH `PATCH /api/v1/provinces/:id`

- Header: `Content-Type: application/json`, `Authorization: Bearer <token>`.
- Field `translations`, `highlights`, `gallery`, `thumbnail` là JSON object/array, **không** stringify rồi nhét multipart.

**`highlights`:** mỗi phần tử cần `translations` với name đủ cho mọi ngôn ngữ active. Có hỗ trợ tạm **legacy** (shape `name` / `description` cũ) khi service parse; nên ghi mới theo `translations`.

Ví dụ:

```json
{
  "highlights": [
    {
      "translations": {
        "vi": { "name": "Phố cổ", "description": "…" },
        "en": { "name": "Old Quarter", "description": "…" }
      },
      "thumbnail": {
        "url": "https://res.cloudinary.com/.../x.jpg",
        "publicId": "folder/abc123",
        "alt": "",
        "order": 0
      }
    }
  ],
  "thumbnail": { "url": "https://…", "publicId": "…" },
  "gallery": []
}
```

`thumbnail` / `gallery`: nên có `publicId` để BE xóa asset cũ khi thay thế / gỡ khỏi gallery.

### 3.4 TypeScript (admin — copy rút gọn)

Cùng `DynamicLocalized`, `ImageItem`, `ProvinceHighlightItem` như bảng ở mục 2; full type: `src/provinces/provinces.types.ts`.

Response public (`GET` list/detail) cũng dùng `translations` trong `highlights`, không tách `name: { vi, en }` cùng cấp.

---

## 4. Tóm tắt thay đổi & migration FE

| Trước | Sau |
|------|-----|
| `PATCH` province multipart + file | Chỉ **JSON**; file qua `/media/*` |
| `name` cố định `{ vi, en }` | `Record<locale, string>` |
| Highlight `name` / `description` dạng `{ vi, en }` | `translations: { [lang]: { name, description? } }` |

Việc FE cần làm:

1. Thay `province.name.vi` bằng `province.name[lang]` + fallback.
2. Highlight: đọc `highlight.translations[lang].name` (và `description`).
3. Form admin: lặp theo **active languages** từ API khi build `highlights[].translations`.
4. Cập nhật type từ `LocalizedName` cố định sang bản ghi động.

---

## 5. Script DB (ops)

Một lần trên DB cũ: [`docs/migrations/province-highlights-to-translations.mongosh.js`](migrations/province-highlights-to-translations.mongosh.js) — chuyển `highlights[].name` / `description` cũ sang `translations`.

---

## 6. Tài liệu BE liên quan

- [PROVINCE-BE-FIELDS.md](PROVINCE-BE-FIELDS.md) — bối cảnh field (ví dụ có thể cũ; ưu tiên bảng ở đây + `provinces.types.ts`).
- [PROVINCE-ADMIN-FE-BE-PAYLOAD.md](PROVINCE-ADMIN-FE-BE-PAYLOAD.md) — payload admin (cần cập nhật theo JSON-only nếu còn mô tả multipart).
- [PROVINCE-MEDIA-UPLOAD-HANDOFF-BE.md](PROVINCE-MEDIA-UPLOAD-HANDOFF-BE.md) — bàn giao media (cập nhật theo `translations`).

---

**Phiên bản tài liệu:** gộp từ hướng dẫn Client + Update (Admin) — một nơi cho toàn bộ FE.
