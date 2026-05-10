# Tour — Displayed Fields

> Source type: `src/features/tours/types.ts`.  
> List UI: `src/pages/tour/TourList.tsx`, `src/sections/tour/components/TourCard.tsx`, `TourFilter.tsx`, `TourListHeroSearch.tsx`.  
> Detail UI: `src/pages/tour/TourDetail.tsx` và các section trong `src/sections/tour/tour-detail/`.

---

# Tour List (`TourListItem` + filters)

## Card (`TourCard`) — fields actually rendered

| Field | Usage |
| ----- | ----- |
| `_id` | Link tới trang chi tiết (`ROUTES.TOUR.DETAIL`), `FavoriteButton` (`entityId`). |
| `slug` | Fallback tên khi không có `translations.*.name`. |
| `translations[lang].name` | Tiêu đề card (fallback `vi` → `en`). |
| `translations[lang].shortDescription` | Mô tả ngắn dưới tiêu đề (fallback `vi` → `en`). |
| `destinations[]` | Tìm `isMainDestination === true` → `provinceId` populated → `name[lang]` cho badge / dòng địa điểm. |
| `thumbnail.url` | Ảnh card (fallback Unsplash nếu thiếu). |
| `thumbnail.alt` | *(optional)* — detail header dùng `alt`; card đặt `alt=""` trên `<img>`. |
| `ratingSummary.average` | Badge sao overlay + dòng đánh giá dưới mô tả. |
| `ratingSummary.total` | Copy “số review” khi `total > 0`. |
| `pricing.basePrice` | Giá gạch ngang khi có sale %; giá hiển thị = base hoặc sau giảm. |
| `sale.isActive` | Badge “Featured” / “Special”, styling pill khi không có tên điểm đến. |
| `sale.type` | Chỉ **PERCENT** được dùng để tính `salePrice` trong card. |
| `sale.value` | Phần trăm giảm khi `type === 'PERCENT'`. |
| `duration.days`, `duration.nights` | Chip thời lượng. |
| `isFavorited` | Trạng thái ban đầu của `FavoriteButton` (khi API trả về và có Authorization). |

## Filter / query (`TourQueryParams` qua `TourFilter` + hero search)

| Field | Ghi chú |
| ----- | ------- |
| `page` | Phân trang (mặc định kết hợp `limit: 12`). |
| `limit` | Cố định 12 khi apply filter. |
| `sortBy` | `newest`, `price_asc`, `price_desc`, `duration_asc`, `duration_desc`, `rating`. |
| `destinationId` | Province `_id` — từ hero search hoặc filter “destination”. |
| `departureProvinceId` | Province `_id` — chỉ từ `TourFilter`. |
| `tourType` | `DOMESTIC` \| `INTERNATIONAL` \| `DAILY`. |
| `difficulty` | `EASY` \| `MODERATE` \| `CHALLENGING` \| `DIFFICULT`. |
| `minPrice`, `maxPrice` | Số dương mới gửi lên API. |
| `minDays`, `maxDays` | Số ngày (preset hoặc nhập tay). |
| `search` | Chuỗi tìm (hero + filter). |

**Hero search** (`TourListHeroSearch`) chỉ set `search` và `destinationId` (map sang `destinationId` trong query).

## Pagination (`TourPaginatedResponse.pagination`)

| Field | Type |
| ----- | ---- |
| `page` | `number` |
| `limit` | `number` |
| `total` | `number` |
| `totalPages` | `number` |

---

# Tour Detail (`Tour`)

Kế thừa toàn bộ field của `TourListItem`, cộng thêm các phần dưới đây theo **section**.

## Root — dùng chung header / sidebar / booking

| Field | Component | Usage |
| ----- | --------- | ----- |
| `_id` | `TourHeader`, `TourReviews`, `TourRelated`, `TourBookingForm`, `TourFloatingBookingBar` | Favorite, reviews entity id, loại trừ tour hiện tại ở “related”, POST booking, availability query. |
| `isFavorited` | `TourHeader` (`FavoriteButton`) | Giống list. |
| `gallery[]` | `TourHeader` | Ảnh lớn + lưới phụ + dialog; mỗi item: `url`, `alt`, `_id` optional. |
| `thumbnail` | `TourHeader` | Ghép vào đầu danh sách ảnh gallery (`url`, `alt`, `_id` optional). |
| `translations[lang].name` | `TourHeader`, share title | Fallback `vi` → `en` → `slug`. |
| `translations[lang].shortDescription` | `TourHeader` | Fallback `vi` → `en`. |
| `duration.days`, `duration.nights` | `TourHeader` | Dòng “duration” trong meta row. |
| `capacity.maxGuests` | `TourHeader`, `TourBookingForm` | Hiển thị max khách; giới hạn select người lớn. |
| `schedule.departureDays` | `TourHeader` | Nếu có phần tử: hiển thị chuỗi join `', '`. |
| `ratingSummary` | `TourHeader`, `TourReviews` | Điểm + số review; truyền vào `EntityReviewSection`. |
| `destinations` + populated `provinceId` | `TourHeader` | Badge địa điểm chính (`isMainDestination`). |
| `tourType` | `TourHeader` | Badge text thô (enum string). |
| `pricing`, `sale` | `TourSidebar`, `TourFloatingBookingBar` | Giá “from”, badge sale — logic giống `TourCard` (sale **PERCENT**). |
| `contact.phone`, `contact.email`, `contact.hotline` | `TourSidebar` | Khối “Need help?” khi có ít nhất một field. |

## Nested — `TourTranslation` (theo ngôn ngữ UI)

| Field | Section | Usage |
| ----- | ------- | ----- |
| `description` | `TourDetail` | Overview — đoạn văn `whitespace-pre-line`. |
| `exclusions[]` | `TourDetail` | Danh sách “What’s not included”. |
| `inclusions[]` | `TourIncluded` | Ưu tiên: nếu có `inclusions` thì hiển thị (icon heuristic theo text). |
| `highlights[]` | `TourExpect` | “What to expect”. |

## Nested — `TourItineraryDay`

| Field | Usage (`TourItinerary`) |
| ----- | ----------------------- |
| `dayNumber` | Thứ tự ngày, key accordion. |
| `translations[lang].title` | Fallback `vi` → `en`. |
| `translations[lang].description` | Nội dung accordion. |
| `translations[lang].meals` | Dòng phụ “Meals: …”. |
| `translations[lang].accommodation` | Dòng phụ “Stay: …”. |

## Nested — amenities (khi không có `inclusions`)

| Field | Usage (`TourIncluded`) |
| ----- | ---------------------- |
| `amenities[].name` | Record theo locale hoặc string. |
| `amenities[].icon` | Map tới icon có sẵn (`wifi`, `meals`, …); không khớp → `Check`. |

---

## Sections không đọc payload tour

| Section | Ghi chú |
| ------- | ------- |
| `TourMap` | iframe Google Maps URL **cố định** trong component — không bind field tour. |
| `TourFAQ` | Chỉ `t('tour.detail.faq_*')` — không dùng data API tour. |

---

## Related tours (`TourRelated`)

- Gọi `useFeaturedToursQuery(6)`; chỉ dùng `currentTour._id` để **lọc bỏ** tour hiện tại.
- Card hiển thị giống list (`TourCard` → bảng **Tour List / Card** ở trên).

---

## Booking sidebar / drawer (`TourBookingForm`)

| Nguồn | Usage |
| ----- | ----- |
| `tour._id` | `useTourAvailabilityQuery(tour._id, month)` và `POST` booking. |
| `tour.capacity.maxGuests` | Số option tối đa cho người lớn (default max 20 nếu thiếu). |

Dữ liệu ngày khởi hành/slots lấy từ API **availability** (`TourAvailabilityItem`), không nằm trong object `Tour` tĩnh.

---

# Fields trên `TourListItem` / `Tour` thường không hiển thị trực tiếp trên list & detail UI hiện tại

Các field sau có trong type nhưng **không** thấy dùng cho render chính trên hai trang public này (có thể dùng chỗ khác hoặc dự phòng backend):  
`code`, `departureProvinceId`, `tourType` (trên **list card** không hiện), `capacity.minGuests`, `capacity.privateAvailable`, `difficulty`, `transportTypes`, `bookingConfig`, `pricing.currency` / `childPrice` / … (card chỉ fmtMoney base), `thumbnail.publicId`, `isActive`, `createdAt`, `updatedAt`, `sale` kiểu **FIXED**, `schedule.fixedDepartures`, `translations.seo`, `translations.notes`, `translations.cancellationPolicy`, v.v.

*Nếu backend bổ sung hiển thị, cập nhật lại bảng và component tương ứng.*
