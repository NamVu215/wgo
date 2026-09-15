# 05 – Cấu trúc dữ liệu & hướng dẫn Google Sheets

_Cập nhật: 2026-09-15_

Dữ liệu WGo nằm trong **một file Google Sheets** gồm 4 trang tính (tab). Bản mẫu đã được soạn sẵn trong thư mục [data/hue/](../data/hue/):

| Tab | File mẫu | Nội dung |
|---|---|---|
| `dia-diem` | [dia-diem.csv](../data/hue/dia-diem.csv) | Mỗi dòng là **một địa điểm** (quán ăn, cafe, chỗ check-in…) · 22 dòng mẫu |
| `mon` | [mon.csv](../data/hue/mon.csv) | Danh sách **món** · 14 món đặc trưng Huế |
| `loai` | [loai.csv](../data/hue/loai.csv) | **Loại địa điểm** · 6 loại |
| `tags` | [tags.csv](../data/hue/tags.csv) | **Tag** dùng để lọc · 17 tag |
| `danh-gia` | _(Apps Script tạo)_ | **Đánh giá cộng đồng đã duyệt**: `ma, quan, sao, nhan_xet, ten, ngay`. Không sửa tay, duyệt ở Sheet chờ duyệt ([09](09-cong-dong.md)) |

> ⚠️ **Cập nhật 2026-09-13:** đã đối chiếu online cả 22 địa điểm, xem [08-kiem-chung-du-lieu.md](08-kiem-chung-du-lieu.md). Nội dung dưới đây là ghi chú ban đầu.
>
> **Ban đầu toàn bộ 22 địa điểm mẫu đều ở trạng thái `kiem_chung = chua`.** Mình tra từ các bài viết trên mạng (cột `nguon`), nhưng các nguồn **có chỗ mâu thuẫn nhau**, ví dụ giờ bán Cơm hến Hoa Đông hay giá vé Lăng Khải Định. **Tọa độ chỉ là ước lượng** theo tên đường. Cột `wgo_cham` và `nhan_xet` để trống vì đó là phần **bạn** tự điền sau khi đi thử.

---

## 1. Tab `dia-diem`: ý nghĩa từng cột

Cột có dấu ✱ là **bắt buộc**. Dòng thiếu cột bắt buộc sẽ **không hiện lên web** và bị báo lỗi, nhưng không làm hỏng web.

| Cột | Ý nghĩa | Cách ghi | Ví dụ |
|---|---|---|---|
| `id` ✱ | Mã riêng, dùng làm **link của quán** (`wgo…/hue/bun-bo-me-keo`) | chữ thường, không dấu, nối bằng `-`. **Không đổi sau khi đã chia sẻ link** | `bun-bo-me-keo` |
| `trang_thai` ✱ | Có hiện trên web không | `hien` / `an` (đóng cửa, tạm ẩn) | `hien` |
| `noi_bat` | Hiện ở mục **"WGo gợi ý"** trên trang chủ | `co` hoặc để trống | `co` |
| `ten` ✱ | Tên địa điểm | | `Bún bò Mệ Kéo` |
| `thanh_pho` ✱ | Thành phố | `hue` hoặc `vung-tau` (sau này `da-nang`, `nha-trang`…). Thành phố mới cần Claude thêm vào web trước | `vung-tau` |
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
| `anh` | Ảnh quán (xem **mục 5**) | **link Google Drive** của ảnh, tối đa 4 ảnh, cách nhau bằng `\|`. Ảnh đầu tiên là ảnh chính | `https://drive.google.com/file/d/…/view?usp=sharing` |
| `kiem_chung` | Mức kiểm chứng | `roi` (bạn đã đi thử) / `online` (đã đối chiếu nhiều nguồn) / `chua` | `online` |
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
- **Nghỉ theo âm lịch** (`ram`, `mung-1`): web tự tính lịch âm, đúng ngày sẽ báo quán nghỉ. Tháng nhuận cũng tính.

## 3. Cách lấy tọa độ trên Google Maps

1. Mở **Google Maps** trên điện thoại hoặc máy tính, tìm quán.
2. **Nhấn giữ** (điện thoại) hoặc **chuột phải** (máy tính) **đúng vị trí quán**.
3. Một dãy số hiện ra, ví dụ `16.48792, 107.58014`. Bấm vào để **copy**.
4. Số **trước** dấu phẩy dán vào `vi_do`, số **sau** dán vào `kinh_do`.

## 4. Google Sheet đang dùng

- **[WGo – Dữ liệu](https://docs.google.com/spreadsheets/d/1ricr-8XcL58OSaPFGEcQccu2pV1QMT8fLpOOU7IWeGo/edit)**: nơi duy nhất chứa dữ liệu. **Sửa trực tiếp trên Sheet**, không nhập file đè lên nữa.
- Web tự cập nhật 2 lần/ngày, hoặc bấm Run workflow (xem [07](07-huong-dan-chay-va-dua-len-mang.md), mục 5).
- **Việc nhỏ nên làm một lần:** ô chọn của cột `kiem_chung` (cột **Z**) mới có `roi`, `chua`. Vào **Dữ liệu → Xác thực dữ liệu** → bấm quy tắc của cột Z → thêm mục `online` → **Xong**. Nếu không làm, ô có chữ `online` sẽ hiện tam giác đỏ nhỏ nhưng web vẫn đọc đúng.
- File `WGo-du-lieu.xlsx` chỉ dùng cho lần tạo Sheet đầu tiên.

## 5. Quy trình góp ý (giai đoạn 3, ghi lại để không quên)

- Một **file Google Sheets riêng**, **riêng tư**, tên **WGo – Chờ duyệt**, nhận câu trả lời từ Google Form.
- Bạn kiểm tra, **copy các dòng hợp lệ** sang tab `dia-diem` của file chính (sau này có thể tự động bằng một ô tick).
- **Không bao giờ** công khai file "Chờ duyệt" vì có thể chứa thông tin cá nhân của người gửi.

## 5. Ảnh quán

Web tự tải ảnh từ Google Drive, thu nhỏ và nén lại khi cập nhật (06:00, 17:00 hoặc khi bấm Run workflow). Bạn **không cần** tự thu nhỏ ảnh.

**Cách thêm ảnh (làm được trên điện thoại):**

1. Mở **Google Drive**, tạo một thư mục tên `WGo ảnh` (chỉ cần làm một lần).
2. Tải ảnh quán lên thư mục đó.
3. Chạm **⋮** cạnh ảnh → **Chia sẻ** → **Quyền truy cập chung** → chọn **Bất kỳ ai có đường liên kết** (Người xem).
   Mẹo: chia sẻ **cả thư mục** như vậy một lần, mọi ảnh bỏ vào sau đều dùng được.
4. Chạm **⋮** cạnh ảnh → **Sao chép đường liên kết**.
5. Dán vào cột `anh` của quán. Nhiều ảnh thì cách nhau bằng dấu `|`.

**Lưu ý:**

- Chỉ dùng **ảnh bạn tự chụp** hoặc được chủ ảnh cho phép. Không lấy ảnh trên Foody, Facebook, Google Maps của người khác.
- Link **Google Photos** không dùng được, hãy đưa ảnh lên Drive.
- Ảnh lỗi (link sai, chưa chia sẻ) **không làm hỏng web**: quán vẫn hiện, chỉ thiếu ảnh, và có cảnh báo trong phần **Summary** của lần chạy trên GitHub, ví dụ: `dòng 16 (che-hem): ảnh: Google Drive không cho tải (HTTP 404). Kiểm tra link và bật "Bất kỳ ai có đường liên kết"`.
- Nên chụp **dọc hoặc ngang đều được**; web cắt vừa khung. Ảnh món ăn hoặc mặt tiền quán là dễ nhận ra nhất.

**Nên sửa ghi chú trong Sheet (một lần):** ô tiêu đề `anh` trong tab `dia-diem` đang ghi "Tên file ảnh (sẽ hướng dẫn sau)". Bấm chuột phải vào ô → **Chỉnh sửa ghi chú**, thay bằng:

> Link Google Drive của ảnh (đã bật "Bất kỳ ai có đường liên kết"). Tối đa 4 ảnh, cách nhau bằng |. Ảnh đầu là ảnh chính.

## 6. Thêm thành phố mới

1. Nhắn Claude tên thành phố. Claude thêm vào danh sách `CITIES` trong `src/config.ts` (mã, tên, vùng bản đồ) và tải nền bản đồ (`npm run tai-ban-do -- <mã>`).
2. Thêm địa điểm vào **cùng tab `dia-diem`**, cột `thanh_pho` ghi mã thành phố (ví dụ `vung-tau`). Món mới thêm vào tab `mon` như bình thường.
3. Thành phố tự hiện trên web ở lần cập nhật sau, khi đã có ít nhất 1 địa điểm hợp lệ.
4. `id` quán phải khác nhau **trên toàn bộ Sheet** (kể cả khác thành phố), và không được đặt là `kham-pha`, `ban-do`, `da-luu`.
