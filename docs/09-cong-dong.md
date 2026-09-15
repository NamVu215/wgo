# 09 – Cộng đồng: góp ý, đánh giá, lượt ghé

_Cập nhật: 2026-09-15 · Giai đoạn 3_

## 1. Đã chốt

| Câu hỏi | Quyết định |
|---|---|
| Người gửi có phải đăng nhập Google? | **Không** (dễ gửi). Nếu bị spam nhiều thì bật bắt đăng nhập (mục 6) |
| Có hiện tên người đánh giá? | **Người gửi tự chọn**: "Hiện tên tôi" hoặc "Ẩn danh" |
| Khi nào hiện điểm cộng đồng? | Khi quán có **từ 3 đánh giá đã duyệt** trở lên. Dưới 3 thì vẫn hiện nhận xét, ghi "Cần thêm N đánh giá để hiện điểm" |
| Tạo Form thế nào? | **Apps Script** tự tạo (file [apps-script/gop-y.gs](../apps-script/gop-y.gs)) |

## 2. Luồng hoạt động

```
Người dùng bấm "Đánh giá quán này" / "Báo cho WGo" / "Gợi ý quán mới"
        │  (Google Form, tự điền sẵn tên quán)
        ▼
Sheet "WGo – Góp ý chờ duyệt (riêng tư)"  ← chỉ bạn xem được
        │  bạn tick ô "Duyệt ✅"
        ▼
Tab "danh-gia" trong Sheet dữ liệu WGo    ← chỉ chứa nội dung đã duyệt
        │  06:00 / 17:00 hoặc bấm Run workflow
        ▼
Web WGo hiện điểm + nhận xét
```

- **Riêng tư:** tên thật, cách liên hệ, câu trả lời chưa duyệt chỉ nằm ở Sheet chờ duyệt. Sheet dữ liệu công khai chỉ nhận **mã quán, số sao, nhận xét, tên (nếu người gửi chọn hiện), ngày**.
- **An toàn:** nội dung người dùng gõ luôn hiện dạng chữ thường trên web. Nội dung bắt đầu bằng `=` không bị Google Sheets chạy thành công thức.

## 3. Cài đặt (một lần, khoảng 5 phút, nên làm trên máy tính)

1. Đăng nhập **đúng tài khoản Google đang sở hữu Sheet dữ liệu WGo**.
2. Mở [github.com/NamVu215/wgo/blob/main/apps-script/gop-y.gs](https://github.com/NamVu215/wgo/blob/main/apps-script/gop-y.gs) → bấm nút **Copy raw file** (biểu tượng 2 tờ giấy, góc phải trên khung code).
3. Mở [script.google.com](https://script.google.com) → **Dự án mới**.
4. Xóa hết đoạn `function myFunction() {…}` có sẵn → **dán** code vừa copy → bấm biểu tượng **Lưu** (đĩa mềm). Đổi tên dự án (chữ "Dự án không có tiêu đề" ở góc trái) thành `WGo góp ý`.
5. Ở thanh trên, ô chọn hàm: chọn **`caiDat`** → bấm **▶ Chạy**.
6. Google hỏi quyền:
   - **Xem lại quyền** → chọn tài khoản của bạn.
   - Hiện "**Google chưa xác minh ứng dụng này**" → bấm **Nâng cao** → **Chuyển tới WGo góp ý (không an toàn)** → **Cho phép**.
   - Vì sao an toàn: đây là code của chính bạn, chạy trong tài khoản của bạn. Google cảnh báo vì code chưa nộp cho Google kiểm duyệt. Script chỉ tạo Form, tạo Sheet và ghi vào Sheet WGo.
7. Chờ khoảng 30 giây. Bảng **Nhật ký thực thi** hiện ra ở dưới. Copy toàn bộ dòng ngay sau `===== DÁN CHO CLAUDE =====` (bắt đầu bằng `{"danhGiaForm":`) và **gửi cho Claude**.
8. Claude nối link vào web. Từ lần cập nhật sau, trang quán có nút **Đánh giá quán này**, **Báo cho WGo**; trang Khám phá có **Gợi ý quán mới**.

**Nên bật thông báo email:** mở Form (link trong nhật ký) → tab **Câu trả lời** → **⋮** → **Nhận thông báo qua email khi có câu trả lời mới**. Làm cho cả 2 Form.

## 4. Duyệt hằng ngày

Mở Sheet **WGo – Góp ý chờ duyệt (riêng tư)** trong Google Drive (làm được trên điện thoại bằng app Google Sheets).

**Tab "Đánh giá chờ duyệt":**

| Việc | Cách làm |
|---|---|
| Cho lên web | Tick ô **Duyệt ✅**. Cột **Ghi chú WGo** ghi "Đã duyệt" |
| Gỡ khỏi web | Bỏ tick |
| Sửa lỗi chính tả, xóa từ tục trước khi duyệt | Sửa ngay trong ô **Nhận xét** rồi mới tick. Dòng đã duyệt mà sửa lại thì bản trên web cũng được sửa |
| Spam, quảng cáo | Không tick, hoặc xóa luôn dòng đó |

**Tab "Góp ý chờ duyệt":**

- **Gợi ý quán mới:** tick **Duyệt ✅** → script thêm một **dòng nháp đang ẩn** (cột `thanh_pho` mặc định `hue`, nhớ sửa nếu là quán Vũng Tàu, TP.HCM hay Thủ Đức) (`trang_thai = an`) vào cuối tab `dia-diem`, nội dung góp ý nằm trong ghi chú của ô tên. Bạn điền nốt tọa độ, giờ, loại… rồi đổi `trang_thai` thành `hien`.
- **Thông tin sai / quán đóng cửa / góp ý khác:** tự sửa trong tab `dia-diem`, rồi tick **Duyệt ✅** để đánh dấu đã xử lý.

> ⚠️ Không đổi tên câu hỏi trong Form, không đổi tên các tab và tiêu đề cột, vì script tìm cột theo tên.

**Nếu duyệt không chạy:** tick mà cột Ghi chú WGo không đổi sau vài giây, mở lại [script.google.com](https://script.google.com) → dự án **WGo góp ý** → chọn hàm **`caiLaiTrigger`** → **Chạy**.

## 5. Lượt ghé WGo

Cuối trang chủ hiện "**12.345 lượt ghé WGo · 87 hôm nay**", tính chung cho mọi người.

- **Một lượt ghé** = một người mở WGo. Xem nhiều trang liên tục chỉ tính 1 lượt; rời web hơn 30 phút rồi quay lại thì tính lượt mới.
- Đếm bằng một hàm nhỏ chạy trên Cloudflare (`functions/api/luot-xem.ts`) và cơ sở dữ liệu **D1** tên `wgo-luot-xem`. **Miễn phí** tới khoảng 100.000 lượt ghé mỗi ngày.
- **Không lưu** IP, vị trí, thiết bị hay bất kỳ thông tin nào của người xem. Mỗi ngày chỉ lưu **một con số**.
- Máy tìm kiếm và bot không chạy JavaScript thì không được tính. Người cố tình gửi yêu cầu giả vẫn có thể làm tăng số, nên con số chỉ để tham khảo.
- Mất mạng thì dòng này tự ẩn.

## 6. Khi bị spam

1. Mở cả 2 Form → **Cài đặt** → **Câu trả lời** → bật **Giới hạn 1 câu trả lời** (bắt buộc đăng nhập Google, mỗi tài khoản gửi 1 lần).
   Với Form Đánh giá: giới hạn này tính cho cả Form, tức mỗi người chỉ đánh giá được **1 quán**. Nếu muốn mỗi người đánh giá nhiều quán, chỉ bật **Yêu cầu đăng nhập** mà không giới hạn số lần (nếu Google hiện tùy chọn này), hoặc nhắn Claude để chỉnh.
2. Tạm tắt nhận câu trả lời: Form → tab **Câu trả lời** → tắt **Chấp nhận câu trả lời**. Nút trên web vẫn còn nhưng Form sẽ báo đang đóng.
3. Muốn gỡ hẳn nút khỏi web: nhắn Claude xóa link trong `src/config.ts` (mục `COMMUNITY`).
