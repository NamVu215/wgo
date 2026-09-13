# 08 – Kiểm chứng 22 địa điểm mẫu ở Huế

_Ngày: 2026-09-13 · Người làm: Claude (tra cứu online, **chưa ai đi tận nơi**)_

## 1. Cách làm

- Đối chiếu từng quán qua **nhiều nguồn**: bài báo (VnExpress, Dân Việt), Foody, trang du lịch, Facebook của quán, và **OpenStreetMap** (bản đồ mở, cho tọa độ và đôi khi cả giờ mở cửa).
- **Nguyên tắc khi các nguồn ghi giờ khác nhau:** lấy **khoảng giờ chung** mà mọi nguồn đều nói là mở. Như vậy khi WGo báo "Đang mở" thì gần như chắc chắn quán đang mở. Nhược điểm: có lúc quán mở mà WGo báo đóng.
- **Nguyên tắc về giá:** lấy **khoảng rộng nhất** trong các nguồn, vì giá chỉ để tham khảo.
- Thêm mức kiểm chứng mới cho cột `kiem_chung`:

| Giá trị | Nghĩa | Hiện trên web |
|---|---|---|
| `roi` | **Bạn đã đi thử** và xác nhận | "WGo đã đi thử", không có nhãn |
| `online` | Đã đối chiếu nhiều nguồn trên mạng | Nhãn "Đã đối chiếu online" |
| `chua` | Chưa kiểm chứng, hoặc các nguồn mâu thuẫn | Nhãn "Chưa kiểm chứng" |

## 2. Kết quả tổng quát

- **19 quán `online`**, **3 quán `chua`** (Bún bò Mệ Kéo, Cơm hến bà Cam, Chùa Thiên Mụ).
- **Không phát hiện quán nào đã đóng cửa hẳn.** Tuy vậy, đa số nguồn là bài viết từ 2022–2025.
- **Lỗi nghiêm trọng đã sửa:**
  - **Quán Tài Phú** bị ghi sai địa chỉ: 110 Đinh Tiên Hoàng là của một quán khác. Địa chỉ đúng là **2-4 Điện Biên Phủ** (theo Facebook của quán và OpenStreetMap). Số điện thoại cũ cũng có thể là của quán kia nên đã xóa.
  - **Tọa độ lệch xa** (nút Chỉ đường sẽ dẫn sai chỗ): Bà Cư lệch **~1,7 km**, Bánh khoái Lạc Thiện **~1,4 km**, Tài Phú **~2,3 km**, Bún bò Mệ Kéo **~1,8 km**, Cơm hến Hoa Đông **~300 m**, Cầu Trường Tiền **~200 m**, Chè Hẻm **~1,5 km**.
- **Giờ mở cửa sai đáng kể:** Cơm hến Hoa Đông ghi bán sáng, thực tế bán cả ngày (7:00–21:30). Quán Thúy ghi mở từ 12:30, các nguồn mới hơn ghi 15:00. Bà Tý ghi tới 22:00, nguồn khác ghi 19:00.

## 3. Chi tiết từng địa điểm

Độ tin cậy tọa độ: 🎯 lấy từ OpenStreetMap theo đúng tên quán · 📍 ước lượng theo số nhà/địa danh gần đó (sai số có thể 100–300 m) · 🛣️ chỉ theo tên đường (có thể sai nhiều).

| Địa điểm | Đã sửa | Tọa độ | Cần xác nhận khi đến |
|---|---|---|---|
| Bún bò Mệ Kéo `chua` | Địa chỉ 94 → **20 Bạch Đằng**; giờ 06:30–08:00; giá 30–50k | 📍 | **Số nhà 20 hay 94 Bạch Đằng** (các nguồn mâu thuẫn); giá hiện tại |
| Bún bò Mụ Rơi | Giờ 06:30–09:30 | 🛣️ | Vị trí số 48 Nguyễn Chí Diễu |
| Bún bò Bà Nga | Tọa độ | 🎯 | – |
| Bún bò Hạnh | – | 🛣️ | Vị trí số 69 Đặng Văn Ngữ |
| Cơm hến Hoa Đông | Giờ **07:00–21:30** (trước: chỉ sáng); tọa độ | 🎯 | – |
| Cơm hến bà Cam `chua` | Giờ 07:00–12:00 | 🛣️ | **Địa chỉ** (49 Cồn Hến / Tùng Thiện Vương / Trương Định) và giờ bán |
| Quán Bà Đỏ | Tọa độ | 🎯 | – |
| Huế Xưa | Giá 15–150k; tọa độ | 📍 | Giờ mở cửa |
| Bà Cư (Cung An Định) | Tọa độ (**lệch 1,7 km**) | 📍 | – |
| Quán Thúy | Giờ **15:00–20:00**; tọa độ | 🎯 | Số nhà 16 hay 19 Phạm Hồng Thái |
| Bánh canh O Thu | Giờ **15:00–18:00** (trước: chưa rõ); giá 10–22k | 🛣️ | Vị trí số 374 Chi Lăng |
| Bánh khoái Lạc Thiện | Tọa độ (**lệch 1,4 km**) | 🎯 | – |
| Quán Tài Phú | **Địa chỉ sai → 2-4 Điện Biên Phủ**; khu vực; tọa độ; xóa SĐT | 🎯 | Giờ mở cửa, số điện thoại |
| Quán Bà Tý | Giờ 16:00–19:00; giá 6–40k; ghi chú có cơ sở 2 | 🎯 | Giờ đóng cửa thật (19h hay 22h) |
| Chè Hẻm | Giá 12–25k; tọa độ | 📍 | Vị trí kiệt 29 Hùng Vương |
| The Time Coffee | Địa chỉ "Tầng 5, 18 Lê Lợi"; giờ 06:30–22:30; SĐT | 📍 | – |
| Tan.cafe | Giờ 06:30–22:00; tọa độ; ghi chú cơ sở 2 | 🎯 | – |
| Café Vỹ Dạ Xưa | Giờ 07:00–22:00 | 🛣️ | Vị trí số 131 Nguyễn Sinh Cung |
| Đại Nội | Giờ **07:00–17:00** (trước: chưa rõ); ghi chú mùa hè | 🎯 | – |
| Cầu Trường Tiền | Tọa độ | 🎯 | – |
| Chùa Thiên Mụ `chua` | Giờ 08:00–18:00 | 🎯 | Giờ mở cửa (mới có 1 nguồn) |
| Lăng Khải Định | Giờ 07:00–17:30; ghi chú giờ theo mùa | 🎯 | – |

## 4. Giới hạn còn lại

- **Giờ theo mùa** (Đại Nội, lăng tẩm mở sớm hơn vào mùa hè): WGo chưa hỗ trợ, nên đang ghi khoảng giờ chung và để giờ mùa hè trong cột `meo`.
- **Tọa độ 🛣️ và 📍**: cách chắc nhất là lúc đến quán, mở Google Maps, nhấn giữ đúng chỗ rồi dán tọa độ vào Sheet.
- **Điểm WGo chấm và nhận xét**: vẫn để trống. Đây là phần chỉ bạn làm được sau khi đi thử.

## 5. Nguồn đã dùng

- [VnExpress – 6 quán bún bò nên thử khi đến Huế](https://vnexpress.net/6-quan-bun-bo-nen-thu-khi-den-hue-4910981.html)
- [Dân Việt – Quán bún bò Huế 70 năm](https://danviet.vn/mon-an-dac-san-o-hue-co-gi-ngon-o-quan-bun-bo-hue-co-tuoi-doi-70-nam-20241031172614802-d1192617.html)
- [Foody – Chè Hẻm](https://www.foody.vn/hue/che-hem-hung-vuong) · [Quán Hoa Đông](https://www.foody.vn/hue/quan-hoa-dong) · [Quán Thúy](https://www.foody.vn/hue/thuy-banh-canh-nam-pho) · [O Thu](https://www.foody.vn/hue/banh-canh-nam-pho-banh-beo-o-thu) · [Bà Tý](https://www.foody.vn/hue/bun-thit-nuong-dao-duy-tu) · [Huế Xưa](https://www.foody.vn/hue/hue-xua-banh-beo-nam-loc) · [Cơm hến bà Cam](https://www.foody.vn/hue/com-hen-ba-cam) · [Bún Hạnh](https://www.foody.vn/hue/bun-hanh-dang-van-ngu) · [Vỹ Dạ Xưa](https://www.foody.vn/hue/vy-da-xua-nguyen-sinh-cung)
- [Facebook – Nem lụi Tài Phú, 02-04 Điện Biên Phủ](https://www.facebook.com/100057459879451/posts/1335123831746267/) · [cotrang.org – Quán Tài Phú](https://www.cotrang.org/quan-an-tai-phu-o-hue-dia-diem-thuong-thuc-dac-san-nem-lui-va-banh-khoai-ngon-menu-review-n497.html)
- [Facebook – Quán Bà Tý](https://www.facebook.com/quanbaty/posts/606315965412738/)
- [cotrang.org – The Time Coffee](https://www.cotrang.org/the-time-coffee-hue-quan-cafe-view-song-huong-tho-mong-menu-review-n1296.html) · [cautruongtien.vn – Chè Hẻm](https://cautruongtien.vn/che-hem-hung-vuong/)
- [AEON MALL Huế – 19 quán cơm hến](https://hue.aeonmall-vietnam.com/cam-nang-aeon-mall-hue/com-hen-hue.html) · [Phượt 3 Miền – bánh bèo nậm lọc](https://phuot3mien.com/quan-banh-beo-nam-loc-ngon-o-hue.html)
- [sovaba.travel – Giá vé Đại Nội 2026](https://sovaba.travel/blog/bai-viet-gia-ve-dai-noi-hue-moi-nhat) · [phanvantravel.com – Lăng Khải Định 2026](https://phanvantravel.com/gia-ve-lang-khai-dinh)
- [OpenStreetMap](https://www.openstreetmap.org) (dữ liệu © OpenStreetMap contributors, giấy phép ODbL)
