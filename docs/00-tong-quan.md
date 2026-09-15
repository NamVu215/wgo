# 00 – Tổng quan dự án WGo

_Cập nhật lần cuối: 2026-09-13_

## 1. Ý tưởng gốc (theo lời chủ dự án)

- Một trang web **phiên bản cộng đồng**: **không cần đăng nhập, không cần backend**.
- Trước mắt chỉ **mình và người yêu** dùng khi đi chơi, sau đó có thể thêm vài người bạn.
- Các khu vực: **Huế, Đà Nẵng, Vũng Tàu, Nha Trang, TP. Hồ Chí Minh, Thủ Đức**.
- Cách dùng: chọn **món**, **khu vực**, **giờ**, **loại đồ ăn**… → web **gợi ý nên đi đâu** trong khu vực đó, kèm **rating** của quán.
- Dữ liệu quán sẽ **tự thêm dần**.
- **Làm Huế trước** để xem có khả thi không, rồi mới mở rộng.
- Tên **WGo** vì có thể mang nhiều tầng nghĩa (xem câu hỏi về ý nghĩa tên trong bộ câu hỏi).

## 2. Tầm nhìn dài hạn (chưa làm ngay)

- Cho **người nước ngoài** dùng khi du lịch Việt Nam → cần tiếng Anh.
- Nơi chia sẻ:
  - quán **local** đáng đi, quán **ngon của dân địa phương**
  - **địa điểm đẹp** để đi chơi, check-in
  - **quán nước ngon**, **cafe view đẹp**
- Có thể **chạy quảng cáo** để có thu nhập.
- Có thể mở rộng thêm người dùng, thêm tính năng cộng đồng.

## 3. Nguyên tắc làm việc

1. **Đơn giản trước, thêm dần sau.** Mỗi giai đoạn phải dùng được thật khi đi chơi.
2. Chủ dự án **chưa từng code web** → mọi việc kỹ thuật (thiết kế, bảo mật, lưu trữ, đưa lên mạng) sẽ được làm giúp và **giải thích lại bằng ngôn ngữ dễ hiểu**: đã làm gì, làm như thế nào, cách tự thêm dữ liệu.
3. Mọi quyết định được ghi lại trong [03-nhat-ky-quyet-dinh.md](03-nhat-ky-quyet-dinh.md).
4. Mã nguồn sẽ lưu trên **GitHub** (hoặc GitLab, tùy bạn chọn).

## 4. Lộ trình dự kiến (sẽ chỉnh sau khi có câu trả lời)

> **Cập nhật 2026-09-16:** lộ trình đã chỉnh ở [04](04-danh-gia-cau-tra-loi.md). Thực tế đã có Huế, Vũng Tàu, TP. Hồ Chí Minh, Thủ Đức, Phước Thái (làm trước Đà Nẵng). Việc đã làm từng ngày xem [03](03-nhat-ky-quyet-dinh.md). Bảng dưới là dự kiến ban đầu.

| Giai đoạn | Mục tiêu | Kết quả |
|---|---|---|
| 0 | Hỏi – đáp, chốt yêu cầu | Các file `.md` này |
| 1 | Bản đầu tiên (MVP) cho **Huế** | Web lọc/gợi ý quán, xem trên điện thoại, có vài chục quán mẫu |
| 2 | Dùng thử thực tế khi đi chơi | Sửa lỗi, chỉnh giao diện, thêm dữ liệu |
| 3 | Thêm thành phố khác | Đà Nẵng → các nơi còn lại |
| 4 | Tiếng Anh, chia sẻ cho người khác | Bản song ngữ, link công khai |
| 5 | Tính năng cộng đồng / quảng cáo | Cần cân nhắc backend, đăng nhập (tính sau) |

## 5. Gợi ý kỹ thuật ban đầu (giải thích đơn giản)

> Chỉ là đề xuất, sẽ chốt sau khi bạn trả lời bộ câu hỏi.

- **"Không backend" nghĩa là gì?** Web chỉ gồm các file (giao diện + dữ liệu quán) được đưa lên một dịch vụ lưu trữ miễn phí.
  Không có máy chủ riêng, không có cơ sở dữ liệu, nên **gần như không có gì để bị hack** và **không tốn tiền**.
- **Dữ liệu quán** nằm trong một file dạng bảng/danh sách (ví dụ `hue.json`). Muốn thêm quán thì sửa file đó, hoặc sau này dùng Google Sheets rồi đồng bộ vào.
- **Đưa lên mạng miễn phí:** GitHub Pages, Vercel hoặc Netlify → có link dạng `wgo.vercel.app`, mở được trên điện thoại.
- **Bản đồ:** mở thẳng Google Maps khi bấm vào quán (đơn giản, miễn phí), hoặc hiển thị bản đồ trong web bằng OpenStreetMap (cũng miễn phí).
- **Yêu thích / đã đi / ghi chú riêng:** lưu ngay trên trình duyệt của từng máy. Hạn chế: **không tự đồng bộ** giữa điện thoại của bạn và của người yêu (xem câu hỏi C3).
