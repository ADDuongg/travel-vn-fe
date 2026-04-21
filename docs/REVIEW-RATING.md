# Review & rating (Tour, Room, Hotel, Guide)

Tài liệu mô tả collection `reviews`, các loại entity được đánh giá, API public / user / admin, và gợi ý tab **My Reviews** trên client dashboard.

---

## Data model

### Collection: `reviews`

Schema: [`src/review/schema/ewview.schema.ts`](../src/review/schema/ewview.schema.ts)

| Field | Type | Mô tả |
|--------|------|--------|
| `entityType` | enum | `ROOM`, `HOTEL`, `TOUR`, `BLOG`, `GUIDE` |
| `entityId` | ObjectId | Id document được review (room, hotel, tour, …) |
| `rating` | number (1–5) | Tuỳ chọn |
| `comment` | string | Tuỳ chọn |
| `userId` | ObjectId → User | User đăng nhập (review không anonymous) |
| `isAnonymous` | boolean | Anonymous flow (không gắn `userId`) |
| `isApproved` | boolean | Public list chỉ hiển thị `true` |
| `approvedAt` | Date | Set khi admin approve |
| `createdAt` / `updatedAt` | Date | Timestamps |

**Lưu ý:** `upsert` hiện set `isApproved: true` ngay khi tạo/cập nhật (xem service). Rating tổng hợp (`ratingSummary` trên Tour / Room / TourGuide) được cập nhật khi có `rating` cho các loại tương ứng; `HOTEL` / `BLOG` trong enum chưa có nhánh recalc trong service.

### Indexes

Trong schema: `entityType + entityId`, `userId`, `isApproved`, `createdAt`.

---

## Entity summary (chung cho FE)

Một số API trả thêm object **`entitySummary`** với field chuẩn hoá:

```ts
entitySummary: {
  name: string;        // hiển thị tiêu đề dòng review
  thumbnailUrl: string; // URL ảnh đại diện (có thể rỗng)
}
```

Cách resolve theo `entityType`:

| `entityType` | `name` | `thumbnailUrl` |
|--------------|--------|------------------|
| `TOUR` | `translations[lang].name` → fallback `vi` → bất kỳ lang có `name` | `tour.thumbnail.url` |
| `ROOM` | `translations[lang].name` (fallback như trên) | `room.thumbnail.url` |
| `HOTEL` | `translations[lang].name` (fallback như trên) | `hotel.thumbnail.url` |
| `GUIDE` | `translations[lang].shortBio` hoặc `bio` (fallback `vi` rồi các lang khác). Tour guide **không** có field `name` trong translations. | `gallery[0].url` nếu có |
| `BLOG` | Chưa có model resolve trong backend → `''` / `''` | |

Query **`lang`** (ví dụ `vi`, `en`) phải khớp key trong `translations` của entity. Mặc định nếu không gửi: **`vi`**.

---

## API

Base path: **`/api/v1/reviews`**

### 1. Public: danh sách review theo entity

`GET /api/v1/reviews`

| Query | Bắt buộc | Mô tả |
|--------|-----------|--------|
| `entityType` | Có | `TOUR`, `ROOM`, … |
| `entityId` | Có | Mongo ObjectId string |
| `page` | Không | Mặc định `1` |
| `limit` | Không | Mặc định `10` |

Chỉ trả review **`isApproved: true`**, sort `createdAt` giảm dần.

---

### 2. User (JWT): review của mình cho **một** entity

`GET /api/v1/reviews/me`

**Headers:** `Authorization: Bearer <access_token>`

| Query | Bắt buộc |
|--------|-----------|
| `entityType` | Có |
| `entityId` | Có |

Trả một document review của `userId` trong token (hoặc `null` nếu không đăng nhập / không có review).

---

### 3. User (JWT): danh sách review của mình (My Reviews)

`GET /api/v1/reviews/me/list`

**Headers:** `Authorization: Bearer <access_token>`

| Query | Bắt buộc | Mô tả |
|--------|-----------|--------|
| `entityType` | Không | Lọc theo một loại (vd chỉ `TOUR`) |
| `page` | Không | Mặc định `1` |
| `limit` | Không | Mặc định `20`, tối đa `100` |
| `isApproved` | Không | **Không gửi:** chỉ lấy review đã duyệt (`isApproved: true`), đồng bộ với list public. `true` / `false` để lọc rõ ràng |
| `lang` | Không | Ngôn ngữ cho `entitySummary.name` (mặc định `vi`) |

**Response:**

```json
{
  "data": [
    {
      "_id": "...",
      "entityType": "TOUR",
      "entityId": "...",
      "userId": "...",
      "rating": 5,
      "comment": "...",
      "isAnonymous": false,
      "isApproved": true,
      "createdAt": "...",
      "updatedAt": "...",
      "entitySummary": {
        "name": "Ha Long 2N1D",
        "thumbnailUrl": "https://..."
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42
  }
}
```

Mỗi phần tử `data` là review lean + `entityId` / `userId` dạng string (tiện cho FE) + `entitySummary`.

---

### 4. User (JWT): tạo / cập nhật review

`POST /api/v1/reviews`

**Headers:** `Authorization: Bearer <access_token>`

**Body (JSON):**

| Field | Bắt buộc |
|--------|-----------|
| `entityType` | Có |
| `entityId` | Có |
| `rating` | Ít nhất một trong `rating` hoặc `comment` |
| `comment` | (như trên) |
| `isAnonymous` | Không |

Logic upsert theo `entityType` + `entityId` + `userId` (từ JWT).

---

### 5. Admin

- `GET /api/v1/reviews/admin` — list + pagination (có `populate` user).
- `PATCH /api/v1/reviews/:id/approve` — duyệt review.
- `DELETE /api/v1/reviews/:id` — xoá review.

*(Hiện các route admin chưa thấy guard trong controller; nếu production cần bảo vệ role admin.)*

---

## Gợi ý FE: tab “My Reviews”

1. Gọi `GET /api/v1/reviews/me/list?page=1&limit=20&lang=vi` (hoặc `lang` theo locale UI).
2. Hiển thị list: dùng `entitySummary.name` + `entitySummary.thumbnailUrl`, kèm `rating`, `comment`, `entityType`, `createdAt`.
3. Deep link tới chi tiết tour/room/hotel/guide: dùng `entityType` + `entityId` (slug nếu cần thì gọi thêm API detail theo id).
4. Filter theo loại: thêm `entityType=TOUR` (v.v.).
5. Xem review chờ duyệt (nếu sau này flow có pending): `?isApproved=false`. Mặc định không gửi `isApproved` = chỉ bản đã duyệt.

---

## File liên quan

| File | Vai trò |
|------|---------|
| [`src/review/review.controller.ts`](../src/review/review.controller.ts) | HTTP routes |
| [`src/review/review.service.ts`](../src/review/review.service.ts) | Business + DB + `entitySummary` |
| [`src/review/review.module.ts`](../src/review/review.module.ts) | Mongoose models |
| [`src/review/schema/ewview.schema.ts`](../src/review/schema/ewview.schema.ts) | Schema `Review` |
