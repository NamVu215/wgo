# 06 – Thiết kế giao diện (Hướng B "Hỏi nhanh")

_Chốt ngày: 2026-09-13 · Bản vẽ: [xem online](https://claude.ai/code/artifact/f79a492f-27d2-4d7e-8fcc-194da82b169d) · file gốc trong [design/phac-thao/](../design/phac-thao/)_

## 1. Tinh thần

- Mở web ra là **hỏi đúng câu người dùng đang nghĩ**: "Tối nay ăn gì đây?". Web trả lời luôn bằng **một quán**, không bắt người dùng lướt danh sách dài.
- **Chữ to, viền đậm, ít chữ.** Trẻ trung nhưng không rối mắt.
- Muốn tìm kỹ hơn thì có tab **Khám phá** và **Bộ lọc**. Đây là chỗ bù cho điểm yếu "lên kế hoạch" của hướng B.

## 2. Các màn hình giai đoạn 1

| # | Màn hình | Nội dung chính |
|---|---|---|
| 1 | **Trang chủ – Gợi ý** | Ngày giờ hiện tại · câu hỏi theo buổi (sáng/trưa/chiều/tối/khuya) · chip loại (Ăn no, Ăn vặt, Chè & nước, Cafe, Check-in) · **thẻ 1 quán gợi ý** (ưu tiên quán `noi_bat`, đang mở) với nút **Đi luôn** / **Đổi quán** · hàng "Thèm món gì?" |
| 2 | **Khám phá** | Ô tìm kiếm · chip lọc nhanh (Đang mở, món, giá) · số kết quả + cách sắp xếp · danh sách thẻ quán |
| 3 | **Bộ lọc** | Giờ · Loại · Món · Giá mỗi người · nút "Xem N chỗ" |
| 4 | **Chi tiết quán** | Ảnh · nhãn "Chưa kiểm chứng" · tên · 3 ô: Giờ bán / Giá / WGo chấm · Nên gọi · Mẹo · Tag · Địa chỉ (sao chép) · nút Chia sẻ, Lưu · **Chỉ đường bằng Google Maps** |
| 5 | **Đã lưu** | Danh sách quán đã bấm ♥ (lưu trên máy) · quán đã đóng hiện mờ + giờ mở lại · nút **"Bốc 1 chỗ đang mở trong đây"** |
| 6 | **Chế độ tối** | Mọi màn hình đều có bản tối; nút mặt trăng/mặt trời ở trang chủ |

**Thanh điều hướng dưới:** Gợi ý · Khám phá · **Bản đồ** · Đã lưu (4 mục từ giai đoạn 2; icon nằm trên chữ để vừa màn hình nhỏ).

## 2b. Bổ sung giai đoạn 2 (2026-09-15)

| Màn hình | Nội dung |
|---|---|
| **Bản đồ** | Bản đồ toàn màn hình, nền tông kem (tối: nâu đen) · hàng chip nổi phía trên: Đang mở + các loại · **ghim tròn viền đậm**: vàng + bóng lệch = đang mở, trắng mờ = đã đóng/chưa rõ giờ, đen viền vàng phóng to = đang chọn · icon trong ghim theo loại (bát, cốc, cafe, xiên, máy ảnh) · chạm ghim → **thẻ quán nổi** phía trên thanh dưới (tên, món, trạng thái · khoảng cách · giá · khu vực, nút Chỉ đường / Xem quán / ♥) · nút định vị tròn bên phải, chấm xanh là vị trí người dùng |
| **Khoảng cách** | Khi đã có vị trí: thẻ quán hiện `trạng thái · 1,2 km · giá · khu vực`; trang chủ thêm khoảng cách đầu dòng mô tả |
| **Trang chủ** | Nút chữ gạch chân "Ưu tiên chỗ gần tôi" dưới thẻ gợi ý · thẻ **Cài WGo lên màn hình** ở cuối trang (icon app, nút Cài, Để sau) · bảng hướng dẫn cài trên iPhone |
| **Trang quán** | Khung ảnh cao 240px, **vuốt ngang** khi có nhiều ảnh, nhãn "3 ảnh · vuốt để xem" · dòng "Rằm tới: Thứ Sáu 25/09" dưới giờ mở cửa · "Cách bạn khoảng 1,1 km" dưới địa chỉ · dòng "Xem trên bản đồ WGo" |
| **Icon app** | Nền vàng nghệ, nhãn trắng viền đen xoay −4° có bóng lệch, chữ **WGo** (Bricolage Grotesque 800) |

## 3. Quy chuẩn thiết kế (dùng khi code)

### Màu

| Vai trò | Sáng | Tối |
|---|---|---|
| Nền | `#F6F0E4` (kem) | `#15120E` |
| Bề mặt thẻ | `#FFFDF8` | `#211D17` |
| Chữ chính / viền / nút đậm | `#1A1612` | `#F6EFE2` (chữ), `#E9E1D2` (viền) |
| Chữ phụ | `#6F665A` | `#A89E8E` |
| Đường kẻ nhạt | `#E3D9C6` | `#2E2920` |
| **Màu nhấn (vàng nghệ)** | `#F2B01E` | `#F2B01E` |
| Đang mở | `#1E7F4F` | `#6FD39B` |
| Đã đóng | `#B2472C` | `#F08A6C` |

Chữ nằm trên nền vàng luôn dùng `#1A1612`.

### Chữ
- **Tiêu đề, tên quán, con số:** Bricolage Grotesque (800/700). Dự phòng: Arial Rounded MT Bold, system-ui.
- **Nội dung:** Be Vietnam Pro (400–700). Font thiết kế cho tiếng Việt, dấu đẹp.
- Cỡ chữ: câu hỏi trang chủ 46px · tiêu đề trang 34px · tên quán ở trang chi tiết 38px · tên quán trên thẻ 19–27px · nội dung 14–17px · nhãn nhỏ 12–13px (VIẾT HOA, giãn chữ nhẹ).

### Hình khối
- Viền **2px** màu chữ chính; bo góc **16–24px** cho thẻ, **bo tròn hẳn** cho chip và nút.
- **Bóng đổ lệch** `5px 5px 0` (không mờ) cho thẻ quan trọng; nút chính có bóng lệch màu vàng.
- Chip và nút cao **tối thiểu 44px** để dễ bấm bằng ngón tay.
- Nhãn kiểu "sticker" xoay nhẹ (−4° đến 3°) cho "WGo gợi ý", "Chưa kiểm chứng".
- Icon là nét vẽ (SVG), không dùng emoji trong giao diện.
- Ảnh chưa có thì hiện ô sọc chéo cùng tông màu nền.

## 4. Việc còn mở
- Logo WGo chính thức (hiện chỉ là chữ).
- Ảnh thật cho các quán.
- Chữ trên nút "Đi luôn" có thể đổi thành "Chỉ đường" nếu thấy khó hiểu khi dùng thử.
