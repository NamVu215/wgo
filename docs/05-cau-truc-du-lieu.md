# 05 – Cấu trúc dữ liệu & hướng dẫn Google Sheets

_Cập nhật: 2026-09-13_

Dữ liệu WGo nằm trong **một file Google Sheets** gồm 4 trang tính (tab). Bản mẫu đã được soạn sẵn trong thư mục [data/hue/](../data/hue/):

| Tab | File mẫu | Nội dung |
|---|---|---|
| `dia-diem` | [dia-diem.csv](../data/hue/dia-diem.csv) | Mỗi dòng là **một địa điểm** (quán ăn, cafe, chỗ check-in…) · 22 dòng mẫu |
| `mon` | [mon.csv](../data/hue/mon.csv) | Danh sách **món** · 14 món đặc trưng Huế |
| `loai` | [loai.csv](../data/hue/loai.csv) | **Loại địa điểm** · 6 loại |
| `tags` | [tags.csv](../data/hue/tags.csv) | **Tag** dùng để lọc · 17 tag |

> ⚠️ **Toàn bộ 22 địa điểm mẫu đều ở trạng thái `kiem_chung = chua`.** Mình tra từ các bài viết trên mạng (cột `nguon`), nhưng các nguồn **có chỗ mâu thuẫn nhau**, ví dụ giờ bán Cơm hến Hoa Đông hay giá vé Lăng Khải Định. **Tọa độ chỉ là ước lượng** theo tên đường. Cột `wgo_cham` và `nhan_xet` để trống vì đó là phần **bạn** tự điền sau khi đi thử.

---

## 1. Tab `dia-diem`: ý nghĩa từng cột

Cột có dấu ✱ là **bắt buộc**. Dòng thiếu cột bắt buộc sẽ **không hiện lên web** và bị báo lỗi, nhưng không làm hỏng web.

| Cột | Ý nghĩa | Cách ghi | Ví dụ |
|---|---|---|---|
| `id` ✱ | Mã riêng, dùng làm **link của quán** (`wgo…/hue/bun-bo-me-keo`) | chữ thường, không dấu, nối bằng `-`. **Không đổi sau khi đã chia sẻ link** | `bun-bo-me-keo` |
| `trang_thai` ✱ | Có hiện trên web không | `hien` / `an` (đóng cửa, tạm ẩn) | `hien` |
| `noi_bat` | Hiện ở mục **"WGo gợi ý"** trên trang chủ | `co` hoặc để trống | `co` |
| `ten` ✱ | Tên địa điểm | | `Bún bò Mệ Kéo` |
| `thanh_pho` ✱ | Thành phố | `hue`, sau này `da-nang`, `nha-trang`… | `hue` |
| `khu_vuc` | Khu vực quen gọi | chữ tự do | `Vỹ Dạ` |
| `loai` ✱ | Loại địa điểm | một `id` trong tab `loai` | `quan-an` |
| `mon` | Các món quán bán (để lọc) | `id` trong tab `mon`, nhiều món cách nhau bằng `\|` | `com-hen\|bun-hen` |
| `mon_nen_goi` | Món nên gọi | chữ tự do | `Bún bò giò chả` |
| `dia_chi` ✱ | Địa chỉ | | `94 Bạch Đằng, Huế` |
| `vi_do`, `kinh_do` ✱ | Tọa độ, dùng cho **bản đồ** và **gần tôi** | số thập phân | `16.487923` / `107.580139` |
| `link_google_maps` | Link quán trên Google Maps (không bắt buộc, nút chỉ đường vẫn chạy nhờ tọa độ) | dán link | |
| `gio_mo_cua` | Giờ mở cửa (xem **mục 2**) | | `06:00-10:00, 15:00-20:00` |
| `ngay_nghi` | Ngày nghỉ (xem **mục 2**) | | `T2` |
| `gia_tu`, `gia_den` | Khoảng giá (đồng) | chỉ ghi số, không ghi "k" | `30000` / `50000` |
| `wgo_cham` | **Rating của bạn** | `1` → `5`, có thể ghi `4.5` | `5` |
| `nhan_xet` | Nhận xét của bạn | chữ tự do | |
| `meo` | Mẹo | nhiều mẹo cách nhau bằng dấu `.` | `Nên tới trước 7h` |
| `tags` | Tag để lọc | `id` trong tab `tags`, cách nhau bằng `\|` | `local\|hen-ho` |
| `dien_thoai`, `facebook`, `tiktok` | Liên hệ | | |
| `anh` | Tên file ảnh | nhiều ảnh cách nhau bằng `\|` | `me-keo-1.jpg` |
| `kiem_chung` | Bạn đã đi và xác nhận thông tin chưa | `roi` / `chua` | `chua` |
| `nguon` | Thông tin lấy từ đâu | | `vnexpress.net` |
| `cap_nhat` | Ngày cập nhật gần nhất | `YYYY-MM-DD` | `2026-09-13` |

## 2. Quy tắc ghi giờ mở cửa

| Trường hợp | `gio_mo_cua` | `ngay_nghi` |
|---|---|---|
| Một buổi | `06:00-10:00` | |
| Hai buổi | `06:00-10:00, 15:00-20:00` | |
| Bán qua nửa đêm | `18:00-01:00` | |
| Mở cả ngày | `00:00-24:00` | |
| Chưa biết giờ | _(để trống)_ → web hiện "Chưa rõ giờ" | |
| Nghỉ thứ Hai | | `T2` |
| Nghỉ thứ Hai và Chủ nhật | | `T2\|CN` |
| Nghỉ ngày rằm, mùng 1 âm lịch | | `ram\|mung-1` |

- Luôn ghi giờ dạng **24h, 2 chữ số**: `06:00`, không ghi `6h` hay `6:00 sáng`.
- Quán hay "bán tới khi hết" thì ghi giờ thường thấy, kèm mẹo trong cột `meo`.
- Nghỉ theo âm lịch sẽ được xử lý ở **giai đoạn 2**. Trước đó web chỉ hiện dòng chữ nhắc.

## 3. Cách lấy tọa độ trên Google Maps

1. Mở **Google Maps** trên điện thoại hoặc máy tính, tìm quán.
2. **Nhấn giữ** (điện thoại) hoặc **chuột phải** (máy tính) **đúng vị trí quán**.
3. Một dãy số hiện ra, ví dụ `16.48792, 107.58014`. Bấm vào để **copy**.
4. Số **trước** dấu phẩy dán vào `vi_do`, số **sau** dán vào `kinh_do`.

## 4. Đưa dữ liệu mẫu lên Google Sheets (làm một lần)

1. Vào [sheets.google.com](https://sheets.google.com) → tạo bảng tính trống, đặt tên **WGo – Dữ liệu**.
2. Đổi tên tab đầu tiên thành `dia-diem`.
3. Chọn **Tệp → Nhập → Tải lên** → chọn file `data/hue/dia-diem.csv` → ở "Vị trí nhập" chọn **Thay thế trang tính hiện tại** → **Nhập dữ liệu**.
4. Bấm dấu **+** ở góc dưới để tạo tab mới tên `mon`. Nhập `mon.csv` như bước 3. Làm tương tự với `loai` và `tags`.
5. Tạm thời **không cần chia sẻ** file. Bước kết nối web với Sheet mình sẽ hướng dẫn khi bắt đầu code.

> 💡 Mẹo: bấm **Xem → Cố định → 1 hàng** để dòng tiêu đề luôn hiện khi cuộn xuống.

## 5. Quy trình góp ý (giai đoạn 3, ghi lại để không quên)

- Một **file Google Sheets riêng**, **riêng tư**, tên **WGo – Chờ duyệt**, nhận câu trả lời từ Google Form.
- Bạn kiểm tra, **copy các dòng hợp lệ** sang tab `dia-diem` của file chính (sau này có thể tự động bằng một ô tick).
- **Không bao giờ** công khai file "Chờ duyệt" vì có thể chứa thông tin cá nhân của người gửi.
