# UI Guideline (Internal)

## 1) Product layout principle

- Workspace luôn theo mô hình **2 panel**:
  - **Input** ở bên trái (luôn hiển thị, luôn editable)
  - **Preview** ở bên phải (formatted tree + action bar)
- Không dùng toggle để ẩn vùng nhập JSON.
- Copy/microcopy ưu tiên ngắn, rõ nghĩa, tránh từ mơ hồ:
  - `JSON Input`
  - `JSON Preview`
  - Hint: `Paste JSON here, preview updates in real-time.`

## 2) Design tokens đang dùng

### Color roles

- `--background`: nền toàn app
- `--surface`: nền card/panel chính
- `--surface-muted`: nền phụ
- `--foreground`: text chính
- `--muted-foreground`: text phụ/caption
- `--border`: viền mặc định
- `--border-strong`: viền nhấn
- `--primary`: accent chính
- `--danger` / `--destructive`: trạng thái lỗi
- `--success`: trạng thái hợp lệ/thành công
- `--focus-ring`: focus ring accessibility

### Spacing scale

- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-6`: 24px
- `--space-8`: 32px

### Radius & motion

- `--radius`: 16px (base)
- `--duration-fast`: 150ms
- `--duration-base`: 220ms

## 3) Component behavior rules

### Buttons

- Action chính dùng style primary gradient.
- Action phụ (panel actions) dùng ghost/outline.
- Disabled phải giảm opacity và không nhận pointer events.

### Inputs / Textarea

- Luôn có border rõ ràng.
- Focus dùng ring nhất quán (`focus-visible:ring-*`).
- Placeholder dùng muted color, không cạnh tranh với content.

### Panels

- Panel chính dùng cùng family glass/surface.
- Header panel có title + caption để tạo visual hierarchy.
- Action bar của Preview đặt ở góc phải, gồm `Expand all`, `Collapse all`, `Copy`.

### JSON states

- **Empty**: hiển thị guidance message rõ ràng.
- **Invalid**: hiển thị lỗi human-readable (không để preview trống im lặng).
- **Valid**: cho phép format/minify/copy/expand.

## 4) Accessibility baseline

- Tab order: Header actions -> Tabs -> Input actions -> Input editor -> Preview actions -> Preview content.
- Tất cả control interactive phải có focus-visible rõ.
- Contrast text/viền phải giữ ổn định khi đổi theme (Light, Dark, Monokai, Dracula).

## 5) Theming conventions

- Theme chỉ đổi token semantic, tránh hard-code màu trực tiếp trong component nếu có thể.
- JSON syntax colors có thể riêng theo theme, nhưng container/border/controls theo semantic tokens để đồng bộ toàn app.
