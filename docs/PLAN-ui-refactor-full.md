# PLAN: UI Refactor (To Flat Design & OKLCH Theme)

## Lựa chọn Agent & Vai trò

- **Dẫn dắt chính:** `frontend-specialist` (Thực thi design tokens chuẩn Vercel và hệ thống Tailwind CSS).
- **Phụ trách chuẩn hóa code:** `clean-code` (Đảm bảo code React tinh gọn, loại bỏ CSS thừa mứa).
- **Kiểm định:** `web-design-guidelines` (Review khả năng truy cập, UX/UI, accessibility trên các forms/modals).

---

## 🛑 Socratic Gate (Cần xác nhận từ User trước khi code)

Trước khi bước vào giai đoạn thực thi sửa code hàng loạt, tôi cần xác nhận ngắn gọn về Design Scope:

1. **Về các component `Shadcn UI` gốc:** Bạn có muốn giữ lại thiết kế chuẩn Shadcn UI thay vì các tùy biến màu hard-code cũ không? (VD: Khôi phục lại viền mỏng 1px của Button/Input, dùng bg-background thay vì màu đen mờ hiện tại của Shadcn?).
2. **Về `glass-container.tsx`:** Component này dường như vẫn còn tồn tại trong folder `components/ui/`. Bạn xác nhận đồng ý xóa sổ hoàn toàn component này chứ?
3. **Về `Dropdown Menu` & `Select`**: Bạn có muốn chuyển các panel popover/dropdown thành dạng Solid hoàn toàn không có `backdrop-blur` thay vì dạng mờ như trước không?

📌 **_Xin hãy trả lời ngắn gọn (Ví dụ: "Đồng ý hết", hoặc "Chỉ giữ lại blur cho dropdown menu")._**

---

## 📌 Phân rã tiến độ (Task Breakdown)

### Phase 1: Dọn dẹp & Xác lập lại Shadcn UI Components

> _Mục tiêu: Quét lại thư mục `components/ui` để biến nó thành hệ thống "Solid UI" chuẩn Tailwind v4 + OKLCH token._

- [ ] Xóa triệt để file `components/ui/glass-container.tsx` (nếu còn).
- [ ] Refactor `button.tsx`: Khẳng định lại UI `variant` mặc định (bỏ các class hardcode phức tạp), dùng background/border/text từ semantic tokens, kiểm tra Focus state.
- [ ] Refactor `dropdown-menu.tsx` & `select.tsx`: Loại bỏ blur, sửa lại background (`bg-popover`), thay đổi viền sang `border-border`, chỉnh padding/margin tương tác.
- [ ] Refactor `switch.tsx`: Đảm bảo matching với primary color.
- [ ] Refactor `alert.tsx` & `badge.tsx`: Chuyển màu qua hệ thống màu cảnh báo mới (Semantic Destructive/Success/Warning).
- [ ] Kiểm tra lại `input.tsx` & `textarea.tsx` (dù đã sửa đợt trước, vẫn cần đảm bảo full compliance với `docs/UI.md`). Tính trót lọt của Focus Rings.

### Phase 2: Refactor Components Nghiệp vụ

> _Mục tiêu: Đưa các page/component đang cấu thành giao diện chính đi theo form UI mới._

- [ ] **`JsonViewer.tsx`**: Review cấu trúc chia Panel. Kiểm tra vùng overscroll-behavior. Tránh tình trạng resize panel gây lỗi Layout.
- [ ] **`ThemeSelector.tsx`**: Đảm bảo các swatch màu Flat, padding/margin gọn gàng, drop-down button sử dụng đúng token.
- [ ] **`JsonDisplay.tsx` / `JsonEditor.tsx`**: Đảm bảo màu sắc hiển thị code highlight đồng bộ với tone nền (Đặc biệt background của view và border-radius).
- [ ] **`KeyboardHelpDialog.tsx` & `NewTabDialog.tsx`**: Khẳng định Solid Backdrops & Modal Windows. Cập nhật icon, tiêu đề the Chicago Style (Title Case).
- [ ] **`TabItem.tsx`**: Rà soát lại tooltip, dropdown mini.

### Phase 3: Rà soát & Đánh giá chất lượng Design

> _Mục tiêu: Theo dõi và bắt lỗi UX/Accessibility cuối cùng trước khi Ship._

- [ ] Chạy audit theo nguyên tắc `web-design-guidelines`: Kiểm tra độ tương phản (contrast), focus-visible, text wrap, tabular-nums (ở những nơi hiển thị số/thời gian nếu có).
- [ ] Đảm bảo Empty States thật sự Clean (Như UI "No Tabs" ở JsonViewer).
- [ ] Test các màn hình bằng `npm run dev` trên tất cả 4 chế độ Theme (Light / Dark / Monokai / Dracula).

---

## 💡 Hướng dẫn kiểm duyệt

- Toàn bộ file này được tạo dựa trên `docs/UI.md` vừa thống nhất, mục đích là định hình rõ vùng cần tác động.
- Nó sẽ không tự động làm gì cho đến khi chạy lệnh thực thi.
