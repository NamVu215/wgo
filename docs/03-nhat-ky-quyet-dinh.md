# 03 – Nhật ký quyết định

Ghi lại mọi quyết định quan trọng: **ngày · quyết định · lý do**. Mới nhất ở trên cùng.

---

### 2026-09-13 · Web lên mạng: https://wgo-auc.pages.dev

- **Đã làm:** lưu code bằng Git (tên tác giả **NamVu215**, email `nnamvu01@gmail.com`); đăng nhập Cloudflare bằng Wrangler; tạo dự án Pages `wgo` (tên `wgo.pages.dev` đã có người dùng nên thành `wgo-auc.pages.dev`); tải thẳng web lên bằng `npm run deploy`.
- **Sự cố đã xử lý:** Wrangler 4.131 mặc định chuyển dự án Pages sang Cloudflare Workers, tự thêm adapter máy chủ và sửa cấu hình. Việc này không cần cho web tĩnh và làm build lỗi. Đã hoàn tác và tạo dự án Pages cổ điển (`--force`, chỉ một lần).
- **Đã kiểm tra trên link thật:** các trang trả về 200, trang không tồn tại trả 404; luật bảo mật (CSP, chặn nhúng khung) đã bật; font chữ tải được; đổi quán, tìm kiếm, trạng thái mở cửa chạy đúng, không có lỗi.
- **Còn lại:** nối GitHub khi hết bị chặn; tạo Google Sheet; kiểm chứng dữ liệu và chấm điểm WGo.

### 2026-09-13 · Code xong giai đoạn 1 (chạy trên máy)

- **Kỹ thuật đã chọn:** Astro 7 (web tĩnh) + TypeScript; không dùng thư viện giao diện, chỉ có 1 thư viện (Astro). Dữ liệu đọc lúc build: Google Sheets nếu đã điền `src/config.ts`, nếu chưa thì dùng CSV mẫu.
- **Lý do chọn Google Sheets qua link export CSV** (thay vì "Xuất bản lên web" hay API): không cần khóa bí mật, giữ nguyên giá trị từng ô. Đã xử lý số kiểu Việt Nam (`16,48`, `30.000`).
- **Trạng thái mở cửa tính trên trình duyệt theo giờ Việt Nam** (`Asia/Ho_Chi_Minh`), không theo giờ của máy. Khách nước ngoài để điện thoại giờ quê nhà vẫn thấy đúng.
- **Dòng dữ liệu lỗi bị ẩn chứ không làm hỏng web.** Không đọc được Sheet thì build thất bại để giữ bản cũ.
- **Bảo mật:** chính sách CSP chỉ cho chạy script của WGo, link từ dữ liệu chỉ nhận http(s), không thu thập dữ liệu người dùng.
- **Đã kiểm tra:** 20 kiểm thử tự động đạt; mở thử trên Chrome giả lập điện thoại 390px (sáng/tối), bấm thử đổi quán, tìm không dấu, bộ lọc, lưu, không có lỗi JavaScript.
- **Điều chỉnh nhỏ so với bản vẽ:** thêm "Chiều" trong bộ lọc giờ; card quán ghi "Tới 21:30" thay cho "Mở tới"; quán chưa chấm điểm hiện "—, chưa chấm".
- **Chờ chủ dự án:** tạo tài khoản GitHub + Cloudflare; tên hiển thị trong lịch sử code.
- **Cập nhật cùng ngày:** chủ dự án xác nhận **giữ** nút "Bốc 1 chỗ đang mở trong đây" ở trang Đã lưu. GitHub tạm chặn đăng ký do "hoạt động bất thường" từ mạng của chủ dự án; phương án dự phòng là đưa web lên Cloudflare Pages bằng cách tải thẳng lên (không cần GitHub), nối GitHub sau.

### 2026-09-13 · Chọn giao diện hướng B "Hỏi nhanh"

- **Quyết định:** dùng hướng **B**. Bỏ A và C (vẫn giữ bản vẽ ở trang "Phác thảo cũ" để tham khảo; thẻ quán trên bản đồ của C có thể dùng cho tab Bản đồ ở giai đoạn 2).
- **Đã làm:** vẽ bộ 6 màn hình giai đoạn 1 (Trang chủ, Khám phá, Bộ lọc, Chi tiết, Đã lưu, Chế độ tối) và ghi quy chuẩn vào [06-thiet-ke-giao-dien.md](06-thiet-ke-giao-dien.md).
- **Điều chỉnh để khớp lộ trình:** thanh dưới là Gợi ý · Khám phá · Đã lưu (Bản đồ thêm ở giai đoạn 2); hiện khu vực thay cho khoảng cách vì giai đoạn 1 chưa có GPS; nút "Đổi quán" (bốc ngẫu nhiên) đưa lên giai đoạn 1 vì là linh hồn của hướng B và rất dễ làm.
- **Đề xuất thêm, chờ xác nhận:** nút "Bốc 1 chỗ đang mở" trong trang Đã lưu.

### 2026-09-13 · Chốt vòng 2 (xác nhận mục 5 của file 04)

- **Đã chốt:**
  1. **Google Sheets là nơi duy nhất chứa dữ liệu**, không sửa file dữ liệu bằng tay.
  2. Người khác góp ý qua **Google Form**, chủ dự án duyệt trong Sheet.
  3. **Giữ cột Tag** (không bắt buộc).
  4. **Link riêng từng quán + nút chia sẻ** có ngay từ giai đoạn 1.
  5. Đưa web lên **Cloudflare Pages**.
  6. Theo **lộ trình 5 giai đoạn** trong file 04.
  7. Làm song song: **dựng cấu trúc dữ liệu + dữ liệu mẫu Huế** và **phác thảo giao diện**.
- **Lý do:** xem [04-danh-gia-cau-tra-loi.md](04-danh-gia-cau-tra-loi.md).
- **Đã làm ngay sau đó:**
  - Soạn cấu trúc dữ liệu + hướng dẫn Google Sheets: [05-cau-truc-du-lieu.md](05-cau-truc-du-lieu.md).
  - Dữ liệu mẫu Huế trong `data/hue/`: 22 địa điểm tra từ các bài viết trên mạng, **tất cả chưa kiểm chứng**. Tọa độ ước lượng theo tên đường (OpenStreetMap).
  - Cài **Node.js v26** trên máy (qua Homebrew).
  - Phác thảo **3 hướng giao diện** (A · Quen tay, B · Hỏi nhanh, C · Bản đồ trước): `design/phac-thao/`, [xem online](https://claude.ai/code/artifact/f79a492f-27d2-4d7e-8fcc-194da82b169d).
- **Đang chờ:** chủ dự án chọn hướng giao diện (hoặc kết hợp).

### 2026-09-13 · Chốt từ bộ câu hỏi (vòng 1)
- **Đã chốt:** một web duy nhất, thiết kế cho điện thoại trước + PWA (không làm app riêng) · link công khai · tiếng Việt trước, sẵn sàng thêm tiếng Anh · rating chính là "WGo chấm" (của chủ dự án), tách riêng khỏi đánh giá cộng đồng · mã nguồn trên GitHub, kho công khai · miễn phí hoàn toàn, link miễn phí trước · có dark mode, PWA, offline · bố cục lấy cảm hứng MoMo nhưng tối giản, bản sắc riêng · ưu tiên số 1: chọn món, chỉ đường, giờ mở cửa · không gấp.
- **Lý do:** xem [04-danh-gia-cau-tra-loi.md](04-danh-gia-cau-tra-loi.md).
- **Đang chờ xác nhận** (mục 5 của file 04): Google Sheets làm nguồn dữ liệu duy nhất · góp ý qua Google Form + duyệt · giữ cột Tag · link riêng + chia sẻ · hosting Cloudflare Pages · lộ trình 5 giai đoạn · bước tiếp theo.
- **Máy chủ dự án:** đã có Git, Homebrew. Chưa có Node.js, GitHub CLI.

### 2026-09-13 · Khởi động dự án
- **Quyết định:** Tên dự án là **WGo**. Làm **Huế trước**, không đăng nhập, không backend, trước mắt dùng nội bộ (bạn, người yêu, vài người bạn).
- **Lý do:** Kiểm tra độ khả thi với chi phí và độ phức tạp thấp nhất, rồi mới mở rộng.
- **Việc tiếp theo:** Chủ dự án trả lời [01-bo-cau-hoi.md](01-bo-cau-hoi.md) → chốt MVP → phác thảo giao diện → bắt đầu code.
