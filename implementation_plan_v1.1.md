# Implementation Plan v1.1 — JSON Export (C# / TypeScript)

## Mục tiêu
Triển khai tính năng export từ JSON đã format sang:
- C# class (dùng `System.Text.Json` + `[JsonPropertyName]`)
- TypeScript `interface`

Ràng buộc đã chốt:
1. C# dùng `System.Text.Json`
2. TypeScript dùng `interface`
3. Root name là `Model`
4. Key JSON không hợp lệ thì **bỏ qua** (không sinh vào output)

---

## Quy ước tracking bắt buộc
- Mỗi task đều có checkbox.
- Khi hoàn thành task, **bắt buộc tick** từ `[ ]` thành `[x]`.
- Không chuyển milestone tiếp theo nếu milestone hiện tại còn task chưa tick.

---

## Milestone 0 — Brainstorming Gate (Design First)

- [x] 0.1 Khảo sát context codebase (`components/JsonDisplay.tsx`, `JsonViewer.tsx`, `lib/*`, docs liên quan)
- [x] 0.2 Xác nhận lại requirement cuối cùng với stakeholder (đã chốt 4 điểm ở trên)
- [x] 0.3 Đề xuất 2–3 approach + trade-off + recommendation
- [x] 0.4 Trình bày thiết kế theo section (architecture, data flow, error handling, testing) và nhận approval
- [x] 0.5 Lưu design doc tại `docs/plans/YYYY-MM-DD-json-export-design.md`

**Exit criteria Milestone 0:** Có design được duyệt và được lưu thành tài liệu.

---

## Milestone 1 — Core Codegen Engine

- [x] 1.1 Tạo module `lib/json-codegen.ts`
- [x] 1.2 Implement helpers naming/validation:
  - [x] `toPascalCase` cho C# class/property
  - [x] `toCamelCase` cho TS interface name
  - [x] `isValidIdentifier` + logic skip invalid key
- [x] 1.3 Implement type inference cho JSON:
  - [x] primitive (`string`, `number`, `boolean`, `null`)
  - [x] object lồng nhau
  - [x] array (primitive/object/mixed)
- [x] 1.4 Implement C# generator:
  - [x] output class root `Model`
  - [x] `public <Type> <Property> { get; set; }`
  - [x] `[JsonPropertyName("original_key")]`
  - [x] `using System.Text.Json.Serialization;`
- [x] 1.5 Implement TypeScript generator:
  - [x] output root interface `Model`
  - [x] nested interfaces
  - [x] array/union/null handling tối thiểu hợp lý
- [x] 1.6 Chuẩn hóa format output (indentation/newline/ordering)

**Exit criteria Milestone 1:** Có thể truyền JSON hợp lệ và nhận được code C# + TS interface đúng rule.

---

## Milestone 2 — UI Integration trong `JsonDisplay`

- [x] 2.1 Thêm UI action Export (button/dropdown) cạnh nhóm action hiện tại
- [x] 2.2 Thêm lựa chọn export:
  - [x] Export C# Class
  - [x] Export TypeScript Interface
- [x] 2.3 Kết nối UI với generator từ `lib/json-codegen.ts`
- [x] 2.4 Copy code export vào clipboard
- [x] 2.5 Toast message cho success/failure
- [x] 2.6 Disable/guard export khi JSON empty hoặc invalid

**Exit criteria Milestone 2:** Người dùng export được cả 2 format trực tiếp từ JSON Preview panel.

---

## Milestone 3 — Validation & Quality

- [x] 3.1 Test case: JSON đơn giản
- [x] 3.2 Test case: nested object sâu
- [x] 3.3 Test case: array object
- [x] 3.4 Test case: mixed array
- [x] 3.5 Test case: key không hợp lệ (`"user-name"`, `"1abc"`, `"first name"`) phải bị skip
- [x] 3.6 Test case: root là array/primitive (xác định behavior nhất quán)
- [x] 3.7 Chạy lint/type-check cho file đã chỉnh
- [x] 3.8 Sửa lỗi lint/type phát sinh (nếu có)

**Exit criteria Milestone 3:** Không có lỗi lint/type mới; output đúng với bộ test chính.

---

## Milestone 4 — Handover

- [x] 4.1 Viết hướng dẫn ngắn cách dùng export trong project docs (nếu cần)
- [x] 4.2 Chuẩn bị ví dụ input/output cho C# và TS
- [ ] 4.3 Review final với stakeholder

**Exit criteria Milestone 4:** Tính năng sẵn sàng sử dụng và dễ tracking trạng thái.

---

## Definition of Done (DoD)

- [ ] Tất cả task checkbox đã được tick `[x]`
- [x] Export C# đúng `System.Text.Json` + `[JsonPropertyName]`
- [x] Export TS ở dạng `interface`
- [x] Root name là `Model`
- [x] Key không hợp lệ được bỏ qua hoàn toàn
- [x] Không phát sinh lỗi lint/type mới
- [ ] Stakeholder xác nhận kết quả cuối
