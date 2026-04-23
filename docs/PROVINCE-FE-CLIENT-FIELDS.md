# Province — các field mới cho FE CLIENT

Tài liệu này mô tả các field bổ sung trên `Province` để FE CLIENT (trang public) hiển thị. Tất cả field mới đều **optional**; nếu thiếu, UI nên fallback (`--` hoặc ẩn block).

## Endpoint có dữ liệu đầy đủ (list + counts + nội dung mới)

| Endpoint | Mô tả |
|----------|--------|
| `GET /api/v1/provinces` | Mỗi phần tử trong `items` có các field mới + `totalHotels`, `totalTours`, `totalTourGuides`. |
| `GET /api/v1/provinces/:slug` | Chi tiết tỉnh (kèm `wards`) + cùng bộ field mới và counts. |

## Endpoint không bảo đảm counts / một số field

| Endpoint | Ghi chú |
|----------|---------|
| `GET /api/v1/provinces/popular` | Trả danh sách tỉnh phổ biến; **không** tính sẵn `totalHotels` / `totalTours` / `totalTourGuides` trên response. |
| `GET /api/v1/provinces/dropdown` | Chỉ `_id`, `code`, `slug`, `name`, `fullName`, `wards` — **không** có field mới bên dưới. |

---

## Danh sách field mới (hiển thị public)

### 1. `population?: number`

- Dân số (số nguyên hoặc số thực tùy dữ liệu nhập).
- UI: thẻ thông tin nhanh, so sánh tỉnh.

### 2. `area?: number`

- Diện tích (đơn vị nên thống nhất với nội dung copy, ví dụ km²).
- UI: thẻ thông tin nhanh.

### 3. `bestTimeToVisit?: { vi: string; en: string }`

- Gợi ý thời điểm du lịch tốt, đa ngôn ngữ.
- UI: chọn `vi` hoặc `en` theo locale người dùng.

### 4. `highlights?: Array<ProvinceHighlightItem>`

Mỗi phần tử:

| Field | Kiểu | Mô tả |
|-------|------|--------|
| `name` | `{ vi: string; en: string }` | Tên điểm nhấn (bắt buộc nếu item tồn tại). |
| `thumbnail?` | `ImageItem` | Ảnh đại diện thẻ. |
| `description?` | `{ vi: string; en: string }` | Mô tả ngắn. |

`ImageItem`:

```ts
{
  url: string;
  publicId?: string;
  alt?: string;
  order?: number;
}
```

- UI: section “Điểm nổi bật” / carousel thẻ có ảnh + title + mô tả theo locale.

### 5. Counts (chỉ trên list paginated và detail theo slug)

| Field | Kiểu | Mô tả |
|-------|------|--------|
| `totalHotels?` | `number` | Số khách sạn active gắn tỉnh. |
| `totalTours?` | `number` | Số tour active liên quan tỉnh (điểm đến + khởi hành, không trùng tour). |
| `totalTourGuides?` | `number` | Số hướng dẫn viên active có tỉnh trong `specializedProvinces`. |

- UI: sidebar / thống kê nhanh trên trang chi tiết hoặc card list (nếu cần).

---

## TypeScript gợi ý (copy sang FE)

```ts
interface LocalizedName {
  vi: string;
  en: string;
}

interface ImageItem {
  url: string;
  publicId?: string;
  alt?: string;
  order?: number;
}

interface ProvinceHighlightItem {
  name: LocalizedName;
  thumbnail?: ImageItem;
  description?: LocalizedName;
}

// Mở rộng trên object province từ API list/detail:
interface ProvinceClientExtensions {
  population?: number;
  area?: number;
  bestTimeToVisit?: LocalizedName;
  highlights?: ProvinceHighlightItem[];
  totalHotels?: number;
  totalTours?: number;
  totalTourGuides?: number;
}
```

---

## Gợi ý hiển thị

- `population` / `area`: format số theo locale (ví dụ `8.512.600` hoặc `8.5M`).
- `bestTimeToVisit` / `highlights[].name` / `highlights[].description`: map key `vi` | `en` theo ngôn ngữ app.
- `highlights[].thumbnail`: ưu tiên `url`; `alt` cho accessibility.
- Counts: nếu `undefined` hoặc endpoint là `popular`, không hiển thị block số liệu hoặc gọi thêm API khác nếu product yêu cầu.

---

## Tham chiếu BE

- Contract TypeScript nguồn: [`src/provinces/provinces.types.ts`](../src/provinces/provinces.types.ts) (`ProvinceListItem`, `ProvinceDetail`, `ProvinceHighlightItem`).
- Yêu cầu ban đầu public: [`docs/PROVINCE-BE-FIELDS.md`](PROVINCE-BE-FIELDS.md).
