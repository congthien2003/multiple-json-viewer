# UI Design Guidelines & Refactor Principles

Dựa trên bộ token `oklch` mới trong `globals.css` và **Vercel Web Interface Guidelines**, dưới đây là bộ quy chuẩn thiết kế để refactor và phát triển đồng bộ toàn bộ component trong hệ thống.

---

## 1. Color System & Theming (Hệ màu OKLCH)

Hệ thống đã chuyển sang sử dụng `oklch` nhằm cung cấp dải màu rộng hơn, tươi sáng hơn và duy trì độ tương phản nhất quán cho Light/Dark mode.

### 1.1 Nguyên tắc sử dụng Token

- **Tuyệt đối KHÔNG hardcode màu sắc** (VD: `bg-[#123]`, `text-gray-500`). Chỉ sử dụng các class của Tailwind đã được map với biến CSS.
- **Nền & Bề mặt (Surfaces):**
  - **Main Background:** Dùng `bg-background` cho trang chính.
  - **Cards & Panes:** Dùng `bg-card` cho các cụm nội dung tách biệt để phân tách rõ không gian.
  - **Dropdown/Modals:** Dùng `bg-popover`.
- **Primary & Accents:**
  - Nút bấm chính (Call to Action), các trạng thái active: Dùng `bg-primary text-primary-foreground`.
  - Các state thông báo, biểu đồ: Dùng hệ màu Chart (`chart-1` đến `chart-5`).
- **Typography Colors:**
  - Text chính: `text-foreground`.
  - Text phụ/giải nghĩa: `text-muted-foreground`.
  - Tuyệt đối KHÔNG hardcode opacity trên text (Vd: `text-white/50`), thay vào đó phải gọi Semantic Token (`text-muted-foreground`).

---

## 2. Component Refactoring Rules (Theo Vercel Guidelines)

Khi refactor hoặc xây dựng component mới, phải tuân thủ nghiêm ngặt các quy tắc sau:

### 2.1 Interactive & Focus States

- **Focus Ring là bắt buộc:** Tất cả component có thể tương tác (Button, Input, Checkbox, Link) PHẢI có state focus rõ nhận diện.
  - Dùng class: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
  - Ưu tiên `:focus-visible` thay vì `:focus` thông thường để tránh tạo viền khi click chuột thông thường.
- **Hover States:** Button, link và tab phải có phản hồi thị giác khi hover (VD: làm tối nền `hover:bg-accent/80` hoặc sáng lên `hover:brightness-110`).

### 2.2 Forms & Inputs

- **Solid Forms:** Không sử dụng hiệu ứng kính mờ (glassmorphism/blur) cho form input. Dùng nền solid (`bg-transparent` hoặc `bg-card`) kết hợp với border mảnh `border-input`.
- **Labeling:** Mọi input phải có `<Label>` trỏ đúng `id` của input thông qua `htmlFor`.
- **Validation:** Bắt buộc có trạng thái báo lỗi form màu đỏ đặc trưng, dùng các token `destructive`.
- Tắt tính năng kiểm tra chính tả (tự sửa lỗi) mặc định ở các vùng không cần thiết (email, mã code, chuỗi JSON): `spellCheck={false}`.

### 2.3 Animations & Transitions

- **Hiệu năng cao:** Chỉ animate (chuyển động) các thuộc tính thân thiện với GPU là `transform` và `opacity`. Tuyệt đối không animate `width`, `height`, `margin`, `padding`.
- **Không dùng `transition: all`**: Hãy xác định rõ thuộc tính cần chuyển đổi (VD: `transition-colors`, `transition-opacity`, `transition-transform`).

### 2.4 Typography & Data Display

- Cắt gọt text dài (Truncation): Luôn bọc các chuỗi ký tự bất định (tên file, JSON keys lạ, titles) bằng `truncate`, `line-clamp-1` hoặc `break-words`.
- Empty states: Khi mảng dữ liệu rỗng, luôn hiển thị giao diện "Empty State" thay vì render một mảng vỡ, trống trải.
- Số liệu Data/Dashboard: Dùng class `tabular-nums` để các con số căn gióng đều nhau, không bị giật, nhảy cỡ khi con số đếm thay đổi.

### 2.5 Modals, Drawers & Safe Layouts

- **Overlay:** Black drops (lớp nền sau Modal/Dialog) dùng màu đen mờ tĩnh `bg-black/80`.
- **Chặn Focus:** Không cho phép Tab thoát khỏi Modal đang mở (Sử dụng chuẩn Shadcn/Radix).
- **Overscroll Behavior:** Thêm `overscroll-contain` vào các component độc lập (như Editor text area) để ngăn chặn việc ngầm cuộn luôn cả background của trang web mẹ (scroll chaining).

---

## 3. Checklist cho quá trình Refactor giao diện

Dành riêng cho dev khi tiến hành chỉnh sửa file UI:

1. [ ] Xóa ngay các class màu khai báo chết (`bg-slate-800`, `text-blue-500`) và thay bằng cấu trúc `bg-X`, `text-Y` từ bộ Token.
2. [ ] Loại bỏ hoàn toàn các class thuộc về kính mờ cũ (như `.liquid-glass-X`, `.backdrop-blur`, `bg-white/10`).
3. [ ] Chuyển các bo góc thủ công sang chuẩn UI: `rounded-md`, `rounded-lg`, `rounded-xl`.
4. [ ] Kiểm tra lại `.dark` mode: Bằng cách dùng Token, tự động Dark mode đã được xử lý (trừ phi có những component đè CSS thủ công `dark:bg-red-500` thì cần dọn dẹp).
5. [ ] Cập nhật toàn bộ file Modal và Input để không còn bị trùng lấp Alpha Channels dẫn tới UI xuyên suốt (Transparent).
