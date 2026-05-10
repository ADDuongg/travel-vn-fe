# Province — Displayed Fields

> Source type: `src/features/provinces/types.ts`.

---

# Province Detail (`ProvinceDetail`)

## Root fields

| Field                | Type                                                  |
| -------------------- | ----------------------------------------------------- |
| `_id`                | `string`                                              |
| `slug`               | `string`                                              |
| `name`               | `DynamicLocalized` (`Record<string, string>`)         |
| `region`             | `'NORTH' \| 'CENTRAL' \| 'SOUTH' \| undefined`        |
| `population`         | `number \| undefined`                                 |
| `area`               | `number \| undefined`                                 |
| `thumbnail`          | `ImageItem \| undefined`                              |
| `gallery`            | `ImageItem[] \| undefined`                            |
| `highlights`         | `ProvinceHighlight[] \| undefined`                    |
| `wards`              | `Ward[] \| undefined`                                 |
| `translations`       | `Record<string, ProvinceTranslation> \| undefined`    |
| `totalHotels`        | `number \| undefined`                                 |
| `totalTours`         | `number \| undefined`                                 |
| `totalTourGuides`    | `number \| undefined`                                 |

## Nested — `ImageItem`

| Field   | Type                  |
| ------- | --------------------- |
| `url`   | `string`              |
| `alt`   | `string \| undefined` |
| `order` | `number \| undefined` |

## Nested — `ProvinceTranslation`

| Field              | Type                  |
| ------------------ | --------------------- |
| `shortDescription` | `string \| undefined` |
| `description`     | `string \| undefined` |
| `bestTimeToVisit`  | `string \| undefined` |

## Nested — `ProvinceHighlight`

| Field          | Type                                                                  |
| -------------- | --------------------------------------------------------------------- |
| `thumbnail`    | `ImageItem \| undefined`                                              |
| `translations` | `Record<string, { name: string; description?: string }> \| undefined` |
| `name`         | `DynamicLocalized \| undefined` *(legacy fallback)*                   |
| `description`  | `DynamicLocalized \| undefined` *(legacy fallback)*                   |

## Nested — `Ward`

| Field  | Type                                          |
| ------ | --------------------------------------------- |
| `code` | `string`                                      |
| `slug` | `string`                                      |
| `name` | `DynamicLocalized` (`Record<string, string>`) |

---

# Province List (`ProvinceListItem`)

## Card item fields

| Field                | Type                                                  |
| -------------------- | ----------------------------------------------------- |
| `_id`                | `string`                                              |
| `slug`               | `string`                                              |
| `name`               | `DynamicLocalized` (`Record<string, string>`)         |
| `fullName`           | `DynamicLocalized \| undefined`                       |
| `region`             | `'NORTH' \| 'CENTRAL' \| 'SOUTH' \| undefined`        |
| `thumbnail`          | `ImageItem \| undefined`                              |
| `gallery`            | `ImageItem[] \| undefined`                            |
| `translations`       | `Record<string, ProvinceTranslation> \| undefined`    |
| `isPopular`          | `boolean \| undefined`                                |
| `totalHotels`        | `number \| undefined`                                 |
| `totalTours`         | `number \| undefined`                                 |
| `totalTourGuides`    | `number \| undefined`                                 |

## Filter / query fields (`ProvinceListParams`)

| Field       | Type                                              |
| ----------- | ------------------------------------------------- |
| `page`      | `number \| undefined`                             |
| `limit`     | `number \| undefined`                             |
| `search`    | `string \| undefined`                             |
| `region`    | `'NORTH' \| 'CENTRAL' \| 'SOUTH' \| undefined`    |
| `isPopular` | `boolean \| undefined`                            |
| `sort`      | `'name' \| 'displayOrder' \| 'newest' \| undefined` |

## Pagination (`ProvinceListResponse.pagination`)

| Field        | Type     |
| ------------ | -------- |
| `page`       | `number` |
| `limit`      | `number` |
| `total`      | `number` |
| `totalPages` | `number` |
