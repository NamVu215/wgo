# 03 – Nhật ký quyết định

Ghi lại mọi quyết định quan trọng: **ngày · quyết định · lý do**. Mới nhất ở trên cùng.

---

### 2026-09-16 · Quán nước, trà sữa · khu vực mới Phước Thái (Đồng Nai)

- **Quán nước, trà sữa cho 4 khu vực:** 12 chỗ, 4 món nước mới. Chủ dự án đồng ý ghi Sheet ("Ghi luôn"): khớp **360/360 ô**, 65 dòng cũ giữ nguyên.
- **Chủ dự án muốn ưu tiên Thủ Đức, Vũng Tàu và thêm khu vực Phước Thái (Đồng Nai).**
  - Phước Thái: mã `phuoc-thai`, vùng dọc Quốc lộ 51 phía nam sân bay Long Thành, nền bản đồ 1,7 MB.
  - Nguồn online về Phước Thái rất ít, mới có 3 chỗ. Cần chủ dự án bổ sung quán mình biết.
  - Thêm 3 chỗ Thủ Đức, 2 chỗ Vũng Tàu, 3 món mới.
- **Loại bỏ có lý do:** tiệm bánh mì không tên (Vũng Tàu) từng làm 94 người ngộ độc; Ki-ốt Trà (Huế) bị đánh giá chất lượng thấp.
- Chi tiết, nguồn: [12-quan-nuoc-phuoc-thai.md](12-quan-nuoc-phuoc-thai.md).

### 2026-09-15 · Mở rộng: TP. Hồ Chí Minh và Thủ Đức

- **Chủ dự án chọn thêm TP. Hồ Chí Minh, và Thủ Đức là một khu vực riêng.** Trên web đây là 2 lựa chọn tách biệt (mã `ho-chi-minh` và `thu-duc`), mỗi nơi có trang chủ, Khám phá, Bản đồ riêng.
  - Lý do tách: Thủ Đức cách trung tâm 10–20 km, thường đi một chuyến riêng. Gộp chung thì bản đồ và "Gần tôi" dễ gợi ý chỗ quá xa.
  - TP.HCM = các quận nội thành cũ. Thủ Đức = Quận 2, Quận 9, Thủ Đức cũ và Làng Đại học. Chi tiết: [11-tp-hcm-thu-duc.md](11-tp-hcm-thu-duc.md).
- **Nền bản đồ:** TP.HCM 16,7 MB, Thủ Đức 15,2 MB (khu đô thị dày nên nặng hơn Huế, Vũng Tàu). Chỉ tải về máy khi người dùng mở trang Bản đồ.
- **Sửa lỗi bản đồ:** trước đây vùng bản đồ thấp mà các ghim trải rộng theo chiều ngang (như Thủ Đức) thì điện thoại cầm dọc không hiện đủ ghim lúc mở. Nay bản đồ luôn thu nhỏ vừa đủ thấy mọi ghim trước, rồi mới giới hạn vùng kéo. Vùng tải của Thủ Đức cũng được làm cao hơn.
- **Sửa lỗi hiển thị:** ô Giờ/Giá ở trang quán bị cắt chữ khi dài (ví dụ "100–5…"). Nay chữ dài tự thu nhỏ lại.
- **Dữ liệu đề xuất:** 25 địa điểm (TP.HCM 17, Thủ Đức 8; 21 `online`, 4 `chua`), 8 món, 2 tag mới (`michelin`, `view-song-sai-gon`).
- **Ghi vào Sheet:** chủ dự án đồng ý ("ghi vào sheet luôn đi"). Claude chỉ **thêm dòng mới** ở cuối 3 tab, tải về đối chiếu: **khớp 752/752 ô**, 39 dòng cũ giữ nguyên, số điện thoại giữ số 0 ở đầu. Kiểm tra dữ liệu: 64 địa điểm, 0 lỗi, 0 cảnh báo. Đã bấm cập nhật web, kiểm tra trên web thật: đủ 4 khu vực, bản đồ TP.HCM 17 ghim, Thủ Đức 8/8 ghim trong màn hình.
- **Chờ chủ dự án:** **đổi quyền link Sheet về "Người xem"** (vẫn đang để ai có link cũng sửa được); (không bắt buộc) thêm `ho-chi-minh`, `thu-duc` vào ô chọn cột `thanh_pho`.

### 2026-09-15 · Mở rộng: Vũng Tàu

- **Chủ dự án chọn Vũng Tàu** là thành phố thứ hai (trước Đà Nẵng như lộ trình cũ) và nhờ đề xuất luôn quán local.
- **Web chạy nhiều thành phố:**
  - Link theo thành phố: `/hue/…`, `/vung-tau/…` (trang chủ, Khám phá, Bản đồ, từng quán). Link quán Huế cũ giữ nguyên.
  - Mở `wgo-auc.pages.dev` lần đầu: trang **"Bạn đang ở đâu?"** để chọn thành phố. Lần sau tự mở thành phố đã chọn. Nút tên thành phố ở đầu trang để đổi.
  - Link cũ `/kham-pha/`, `/ban-do/` vẫn chạy (mở thành phố đã chọn, giữ bộ lọc).
  - **Đã lưu** gộp mọi thành phố, thẻ quán ghi tên thành phố. "Bốc 1 chỗ" ưu tiên thành phố đang xem.
  - Thành phố chỉ hiện trên web khi Sheet có ít nhất 1 địa điểm của thành phố đó. Dòng ghi `thanh_pho` chưa có trong WGo bị báo lỗi; tọa độ nằm ngoài thành phố bị cảnh báo.
  - Nền bản đồ Vũng Tàu (bán đảo tới Long Hải) tải sẵn, 4,3 MB.
- **Dữ liệu:** 17 địa điểm Vũng Tàu (14 `online`, 3 `chua`), 7 món, 1 tag. Chi tiết và nguồn: [10-vung-tau.md](10-vung-tau.md).
- **Ghi vào Sheet:** chủ dự án mở quyền sửa và cho phép Claude tự thêm. Claude chỉ **thêm dòng mới** vào cuối tab `dia-diem`, `mon`, `tags` (không sửa dòng cũ), rồi tải về đối chiếu: **khớp 520/520 ô**, 22 dòng Huế giữ nguyên.
- **Chờ chủ dự án:** (1) **đổi quyền link Sheet về "Người xem"**; (2) (không bắt buộc) thêm `vung-tau` vào ô chọn cột `thanh_pho`; (3) khi đi Vũng Tàu, xác nhận các mục ghi trong cột "Cần xác nhận" của file 10.
- **Lưu ý Apps Script góp ý:** dòng nháp "Gợi ý quán mới" vẫn mặc định `thanh_pho = hue`. Khi điền nốt dòng nháp, sửa lại thành phố cho đúng.
- **Nhắc lại góp ý cũ:** lộ trình khuyên có khoảng 50 địa điểm chất lượng ở một thành phố trước khi mở rộng. Hiện Huế 22, Vũng Tàu 17, chưa chỗ nào có WGo chấm hay ảnh.

### 2026-09-15 · Giai đoạn 3 – Cộng đồng (bắt đầu) + lượt ghé

- **Chủ dự án chốt:** góp ý **không bắt đăng nhập** (spam nhiều thì bật sau) · người đánh giá **tự chọn hiện tên hoặc ẩn danh** · điểm cộng đồng hiện khi có **từ 3 đánh giá** · tạo Form bằng **Apps Script**.
- **Đã làm:**
  - `apps-script/gop-y.gs`: tạo 2 Form (Đánh giá quán, Góp ý), Sheet chờ duyệt **riêng tư**, tab `danh-gia` trong Sheet dữ liệu; tick "Duyệt ✅" thì đưa đánh giá lên, bỏ tick thì gỡ; gợi ý quán mới thành dòng nháp đang ẩn trong `dia-diem`.
  - Web: khối **Cộng đồng** trên trang quán (điểm, số lượt, 5 nhận xét mới nhất, nút Đánh giá), link **Báo cho WGo**, ô **Gợi ý quán mới** ở Khám phá. Nút chỉ hiện khi đã có link Form.
  - **"Gần đây có gì?"** trên trang quán: tối đa 4 chỗ trong 1 km, ưu tiên loại khác (ăn xong gợi ý cafe, chè, check-in).
  - **Lượt ghé WGo** ở cuối trang chủ (yêu cầu thêm của chủ dự án).
- **Quyết định về lượt ghé:** web tĩnh không tự đếm được, nên thêm **một hàm nhỏ trên Cloudflare Pages + cơ sở dữ liệu D1** (`wgo-luot-xem`, gắn vào dự án Pages với tên `DB`).
  - Đây là "máy chủ" đầu tiên của WGo, nhưng rất nhỏ: chỉ cộng một con số mỗi ngày.
  - Miễn phí tới khoảng 100.000 lượt/ngày. Không lưu IP hay thông tin người xem. Chỉ nhận yêu cầu gửi từ chính trang WGo.
  - Đã cân nhắc rồi bỏ: Cloudflare Web Analytics (số chỉ cập nhật 2 lần/ngày, phải sửa quyền mã Cloudflare, khó cộng dồn từ đầu) và dịch vụ đếm của bên thứ ba (dễ bị chặn, lộ lượt xem).
- **Nhắc lại góp ý cũ:** nên có khoảng 50 địa điểm chất lượng trước khi mời người ngoài đóng góp. Hiện có 22 địa điểm, chưa có WGo chấm và ảnh.
- **Đã nối (cùng ngày):** chủ dự án chạy `caiDat` thành công (lần đầu bị Canceled do chưa bấm hết bước cho phép quyền). Đã điền 2 link Form vào `src/config.ts`, nối tab `danh-gia` (gid 2011447134). Đã kiểm tra: 2 Form mở được không cần đăng nhập, tên quán điền sẵn đúng.

### 2026-09-15 · Giai đoạn 2 – Như app

- **Đã làm:** bản đồ, gần tôi, cài lên màn hình (PWA), dùng khi mất mạng, ảnh quán, ngày nghỉ âm lịch. Chi tiết và cách thử: [07, mục 8](07-huong-dan-chay-va-dua-len-mang.md#8-đã-có-trong-giai-đoạn-2).
- **Nền bản đồ lưu ngay trong web** (MapLibre + dữ liệu OpenStreetMap đóng gói bởi Protomaps, vùng Huế khoảng 5 MB).
  - **Lý do:** thử thật thì DNS của VNPT **không phân giải** `openstreetmap.org` (cả `tile.` và `www.`), nên bản đồ OSM thường sẽ trắng nền với nhiều người dùng Việt Nam. CARTO hiện đè chữ "API KEY REQUIRED" lên bản đồ, Stadia cần đăng ký tài khoản và chỉ miễn phí phi thương mại.
  - Tự lưu thì miễn phí, không cần mã, không giới hạn lượt xem, **được dùng khi có quảng cáo**, và xem được offline.
  - Cập nhật đường xá: `npm run tai-ban-do` (lấy bản Protomaps mới nhất).
- **Font chữ tự lưu** (Astro Fonts) thay cho Google Fonts: offline vẫn đúng font, không gửi lượt xem cho Google, luật bảo mật chặt hơn (chỉ tải từ chính WGo).
- **Offline:** lưu sẵn mọi trang và file giao diện (khoảng 1,9 MB trước nén) sau lần mở đầu. Trang luôn thử lấy bản mới trước; nếu mạng không trả lời trong 3,5 giây thì dùng bản đã lưu. Nền bản đồ và ảnh chỉ lưu **khi đã xem qua**, để lần đầu vào web không tốn 5 MB dữ liệu di động. Phiên bản offline chỉ đổi khi nội dung đổi, nên 2 lần cập nhật mỗi ngày không bắt điện thoại tải lại nếu Sheet không đổi.
- **Ảnh quán qua Google Drive:** cột `anh` nhận link Drive. Lúc build web tự tải, xoay đúng chiều, thu nhỏ còn 480px và 1080px, đổi sang WebP. Ảnh lỗi chỉ là cảnh báo. GitHub Actions nhớ ảnh đã xử lý để không tải lại.
- **Gần tôi:** chỉ hỏi quyền vị trí khi người dùng tự bấm. Vị trí không rời điện thoại, nhớ tối đa 10 phút trong tab. Trang chủ ưu tiên chỗ đang mở trong 2 km, rồi 5 km.
- **Âm lịch:** tự tính theo thuật toán Hồ Ngọc Đức (múi giờ +7), kiểm thử với Tết 2024–2027, Trung thu 2024–2026, rằm tháng Giêng 2023, tháng 2 nhuận 2023 và tháng 6 nhuận 2025.
- **Kiểm thử:** 34 kiểm thử tự động; đã chạy thử trên trình duyệt điện thoại giả lập: bản đồ sáng/tối, định vị, tắt hẳn máy chủ rồi mở lại các trang.
- **Chờ chủ dự án:**
  1. Thử trên điện thoại thật: cài app, cho phép vị trí, bật chế độ máy bay (07, mục 8).
  2. Sửa ghi chú ô tiêu đề `anh` trong Sheet và bắt đầu thêm ảnh (05, mục 5).
- **Đã thử rồi bỏ:** thư viện Leaflet với nền OpenStreetMap, rồi nền CARTO (lý do ở trên).

### 2026-09-13 · Tự động cập nhật đã chạy thật

- Chủ dự án đã lưu mã Cloudflare vào GitHub Secrets (`CLOUDFLARE_API_TOKEN`).
- Đã chạy thử workflow `Cập nhật web` bằng tay (lần chạy 34759573656). Tất cả các bước đều đạt, kể cả **Đưa lên Cloudflare Pages**. Kiểm tra dữ liệu: 22 địa điểm hợp lệ, 0 lỗi, 0 cảnh báo.
- Đã xem web thật: trang chủ mở bình thường, trang Khám phá có đủ 22 địa điểm. Riêng trang Tài Phú đã hiện đúng địa chỉ Điện Biên Phủ kèm nhãn "Đã đối chiếu online".
- **Từ nay:** sửa Sheet xong thì web tự cập nhật lúc 06:00 và 17:00. Muốn cập nhật ngay thì vào GitHub → Actions → Cập nhật web → Run workflow.

### 2026-09-13 · Dữ liệu đã sửa vào Sheet, cài tự động cập nhật

- **Sửa Sheet:** chủ dự án bật quyền chỉnh sửa qua link. Claude dùng Chrome chạy ẩn dán dữ liệu đã kiểm chứng vào tab `dia-diem`, rồi tải về so từng ô: **khớp 644/644 ô**. Tab `huong-dan` cũng được cập nhật theo quy trình mới. Web đã đưa lên với dữ liệu mới.
- **Phân công từ nay:** chủ dự án tự thêm, sửa, xóa và kiểm chứng dữ liệu trên Sheet. Phần kỹ thuật tích hợp chạy tự động.
- **Tự động:** GitHub Actions `Cập nhật web` chạy khi đẩy code, lúc 06:00 và 17:00 giờ VN, hoặc bấm tay. Các bước: kiểm thử → kiểm tra dữ liệu (bảng lỗi trong Summary) → build → đưa lên Cloudflare Pages.
- **Lưới an toàn:** Sheet còn dưới 5 địa điểm hợp lệ thì không cập nhật, giữ web cũ.
- **Lỗi đã sửa:** `node --test tests/` chạy được trên Node 26 nhưng lỗi trên Node 24 (GitHub). Đổi sang `node --test "tests/*.test.ts"`.
- **Chờ chủ dự án:** (1) **đổi quyền link Sheet về "Người xem"** (mã Sheet công khai trên GitHub, để quyền sửa thì ai cũng phá được); (2) tạo mã Cloudflare và lưu vào GitHub Secrets; (3) (không bắt buộc) thêm `online` vào ô chọn cột kiem_chung.

### 2026-09-13 · Nối Google Sheet & kiểm chứng online 22 địa điểm

- **Google Sheet "WGo – Dữ liệu"** đã nối vào web (`npm run noi-sheet`). Dữ liệu đọc về khớp 100% từng ô với file gốc. Web trên mạng đã đọc từ Sheet.
- **Thêm mức kiểm chứng `online`** (đối chiếu nhiều nguồn) bên cạnh `roi` (đã đi thử) và `chua`.
- **Nguyên tắc khi nguồn mâu thuẫn:** giờ lấy khoảng chung (để "Đang mở" đáng tin), giá lấy khoảng rộng.
- **Kết quả:** 19 `online`, 3 `chua`. Sửa địa chỉ sai của Quán Tài Phú, 7 tọa độ lệch 200 m – 2,3 km, giờ mở cửa của 13 địa điểm. Chi tiết: [08-kiem-chung-du-lieu.md](08-kiem-chung-du-lieu.md).
- **Cách áp dụng vào Sheet:** Claude không ghi được vào Google Sheet, và Sheet chưa bị ai sửa (đã so từng ô). Vì vậy tạo lại `WGo-du-lieu.xlsx` để chủ dự án nhập đè ("Thay thế bảng tính"), sau đó chạy lại `npm run noi-sheet` vì số gid của các tab sẽ đổi.

### 2026-09-13 · Nối GitHub, chuẩn bị Google Sheet

- **GitHub:** kho công khai https://github.com/NamVu215/wgo. Trước khi đẩy lần đầu, đã đổi email trong toàn bộ lịch sử code sang email ẩn danh của GitHub để không lộ Gmail trên kho công khai.
- **Google Sheet:** Claude không có quyền vào Google Drive nên tạo sẵn file `WGo-du-lieu.xlsx` (đặt trên Desktop, không nằm trong kho mã) để chủ dự án nhập vào Sheets. Thêm lệnh `npm run noi-sheet` tự tìm gid từng tab.
- **Nhận thêm ngày dạng 13/09/2026** ở cột cap_nhat (21 kiểm thử đạt).
- **Tiếp theo:** chủ dự án nhập file và gửi link Sheet → nối và kiểm tra → deploy → kiểm chứng 22 quán.

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
