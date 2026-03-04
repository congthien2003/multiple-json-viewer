# JSON Export Design — C# / TypeScript

## 1) Bối cảnh và mục tiêu
Tính năng cần cho phép người dùng export trực tiếp từ JSON đã parse/format trong panel preview sang:
- C# class dùng `System.Text.Json` với `[JsonPropertyName("...")]`
- TypeScript `interface`

Yêu cầu bắt buộc đã chốt:
1. C# dùng `System.Text.Json`
2. TypeScript dùng `interface`
3. Root name là `Model`
4. Key JSON không hợp lệ thì bỏ qua hoàn toàn

## 2) Kiến trúc
Thiết kế tách làm 2 lớp:

- `lib/json-codegen.ts`
  - Chứa logic infer type và sinh code (không phụ thuộc UI)
  - Export API:
    - `generateCSharpClasses(value, rootName)`
    - `generateTypeScriptInterfaces(value, rootName)`

- `components/JsonDisplay.tsx`
  - Giữ vai trò orchestration UI
  - Gọi generator theo action người dùng
  - Copy output vào clipboard và hiển thị toast

Cách tách này giúp phần codegen dễ test và tái sử dụng.

## 3) Data flow
1. Người dùng nhập JSON ở panel Input
2. `JsonDisplay` parse JSON thành `parsedResult.data`
3. Người dùng chọn `Export C#` hoặc `Export TypeScript`
4. UI gọi generator tương ứng, root name = `Model`
5. Kết quả code được copy vào clipboard
6. Toast thông báo thành công hoặc thất bại

## 4) Quy tắc mapping type

### C#
- Primitive:
  - `string` -> `string`
  - `number` -> `int`/`double`
  - `boolean` -> `bool`
  - `null` -> `object?`
- Object -> class lồng nhau
- Array:
  - homogeneous primitive -> `List<T>`
  - object -> `List<NestedClass>`
  - mixed/khó xác định -> `List<object>`
- Property format:
  - `[JsonPropertyName("original_key")]`
  - `public Type Property { get; set; }`

### TypeScript
- Primitive -> `string | number | boolean | null`
- Object -> `interface`
- Array -> `(T)[]`
- Mixed array/object -> union type
- Root interface name: `Model`

## 5) Key invalid strategy
- Chỉ giữ key thỏa regex identifier (`^[A-Za-z_][A-Za-z0-9_]*$`)
- Key không hợp lệ bị bỏ qua trong cả C# và TypeScript

## 6) Error handling
- JSON rỗng/invalid: không cho export, hiển thị toast hướng dẫn
- Clipboard lỗi: toast failure
- Generator fallback cho root không phải object: wrap thành `value`

## 7) UI/UX
- Thêm nút `Export` ở action bar panel preview
- Dropdown gồm:
  - `Export C# Class (Model)`
  - `Export TypeScript Interface (Model)`
- Giữ nguyên các action hiện có: Expand/Collapse/Copy

## 8) Kiểm thử
Bộ case chính:
- JSON đơn giản
- JSON nested nhiều tầng
- Array object
- Mixed array
- Key không hợp lệ (`user-name`, `1abc`, `first name`) phải bị bỏ qua
- Root là primitive/array

## 9) Kết quả kỳ vọng
- Người dùng có thể copy model code dùng ngay
- Output đúng chuẩn naming/attribute đã chốt
- Không làm ảnh hưởng behavior hiện tại của preview JSON
