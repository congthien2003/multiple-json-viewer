Phong cách Liquid Glass (thường được gọi là Glassmorphism nâng cao) mang lại cảm giác giao diện chiều sâu, bóng bẩy và "mềm" như kính lỏng. Đây là sự kết hợp giữa hiệu ứng làm mờ (blur), độ trong suốt, và các đường viền phát sáng tinh tế.

Dưới đây là bản mô tả chi tiết để bạn gửi cho Agent (như Cursor, Claude, hoặc GPT) thực thi code.

1. Các Đặc Điểm Cốt Lõi (Core Characteristics)
   Để Agent hiểu đúng "vibe" của Liquid Glass, hãy yêu cầu họ tập trung vào 4 yếu tố:

Transparency & Blur: Sử dụng backdrop-filter: blur() để tạo hiệu ứng kính mờ.

Layering (Z-index): Các lớp chồng lên nhau với độ mờ khác nhau để tạo chiều sâu.

Inner Glow & Border: Đường viền cực mảnh (thường là trắng hoặc gradient) để mô phỏng ánh sáng phản chiếu trên cạnh kính.

Vivid Background: Cần một hình nền có màu sắc rực rỡ hoặc gradient chuyển động phía dưới để hiệu ứng kính nổi bật.

2. File Cấu Trúc Giao Diện (UI Blueprint)
   Bạn hãy copy đoạn này và đưa cho Agent:

Yêu cầu kỹ thuật cho Agent:
"Hãy triển khai một giao diện Web Dashboard theo phong cách Liquid Glass (Glassmorphism) sử dụng React/Next.js và Tailwind CSS. Tuân thủ cấu trúc và thông số sau:"

Hệ thống Style (Theme Config):
Glass Card: \* Background: rgba(255, 255, 255, 0.1)

Blur: backdrop-filter: blur(15px) saturate(180%)

Border: 1px solid rgba(255, 255, 255, 0.2)

Shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37)

Typography: Sử dụng font Sans-serif hiện đại (Inter hoặc SF Pro), màu chữ trắng hoặc xám rất nhạt.

Shapes: Bo góc lớn (border-radius: 24px trở lên) để tạo cảm giác "liquid".

3. Cấu Trúc Mã Nguồn Gợi Ý
   Markdown
   /project-root
   ├── /public
   │ └── abstract-bg.jpg (Hình nền gradient rực rỡ)
   ├── /src
   │ ├── /components
   │ │ ├── GlassContainer.jsx (Component bao quanh với hiệu ứng blur)
   │ │ ├── Sidebar.jsx (Menu dọc dạng kính mờ)
   │ │ ├── StatCard.jsx (Các thẻ thông số nhỏ)
   │ │ └── GlassButton.jsx (Nút bấm có hiệu ứng hover phát sáng)
   │ ├── App.js
   │ └── index.css (Chứa các hiệu ứng animation liquid)
4. Đoạn Code CSS Mẫu (Dành cho Agent tham khảo)
   Nếu bạn muốn hiệu ứng thực sự "lỏng", hãy yêu cầu Agent thêm thuộc tính này vào các Card:

CSS
/_ Hiệu ứng viền phát sáng đặc trưng của iOS _/
.liquid-glass {
background: rgba(255, 255, 255, 0.05);
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.15);
border-radius: 30px;
position: relative;
overflow: hidden;
}

/_ Hiệu ứng 'Gloss' bóng bề mặt _/
.liquid-glass::before {
content: "";
position: absolute;
top: 0; left: 0; right: 0;
height: 50%;
background: linear-gradient(
rgba(255, 255, 255, 0.1) 0%,
rgba(255, 255, 255, 0) 100%
);
pointer-events: none;
}
