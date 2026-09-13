# 04 – Đánh giá câu trả lời: khả thi, độ phức tạp, góp ý

_Ngày: 2026-09-13 · Dựa trên [01-bo-cau-hoi.md](01-bo-cau-hoi.md)_

Ký hiệu: ✅ hợp lý · ⚠️ làm được nhưng cần lưu ý · ❌ mâu thuẫn hoặc nên đổi
Độ phức tạp: ★☆☆☆☆ (rất dễ) → ★★★★★ (rất khó)

---

## 1. Kết luận nhanh

**Khả thi: CÓ.** Ba tính năng bạn chọn ở G2 (chọn món, chỉ đường, giờ mở cửa) đều dễ làm, **miễn phí** và **không cần backend**.

Có ba điều cần nói thẳng:

1. **Phạm vi đã phình to so với ý tưởng ban đầu.** Ban đầu là "web cho 2 người, không backend". Theo câu trả lời thì bây giờ là: web công khai, nhiều người đóng góp, có duyệt, có bản đồ, GPS, dùng khi mất mạng, cài như app, dark mode, sau này có quảng cáo. Vẫn làm được **nếu chia giai đoạn**. Làm hết một lúc thì dễ bỏ dở giữa chừng.
2. **Khó nhất không phải code mà là dữ liệu.** Web gợi ý chỉ hay khi có đủ quán và thông tin đúng. Hiện bạn chưa có quán nào (C7). Một web cộng đồng không có dữ liệu thì không ai đóng góp. Đây là rủi ro số 1.
3. **"Không backend" vẫn giữ được**, kể cả khi có người đóng góp và cần duyệt: dùng **Google Sheets + Google Form** làm "backend miễn phí không cần viết code". Chỉ khi cần đăng nhập, tải ảnh trực tiếp trên web, hoặc có hàng nghìn lượt đóng góp thì mới cần backend thật.

---

## 2. Nhận xét từng câu

### A1 – Web hay app? ❌ Hiểu nhầm cần gỡ

Bạn nghĩ "web hợp để lên kế hoạch, app hợp để dùng ngoài đường". **Thực tế không cần chọn.**

- Một trang web **thiết kế ưu tiên điện thoại** mở trên điện thoại vẫn đẹp và dễ dùng như app.
- Kết hợp **PWA** (D4) thì web có icon trên màn hình chính, mở toàn màn hình, dùng được khi mất mạng. Người dùng gần như không phân biệt được với app.
- **App thật** (lên App Store/Google Play) tốn khoảng **2,5 triệu/năm** cho tài khoản Apple, phải qua duyệt và phải viết thêm code. Hiện không cần.

**Kết luận:** làm **một web duy nhất**, thiết kế cho điện thoại trước, trên máy tính tự giãn ra để lên kế hoạch. Như vậy đáp ứng cả a và b. Độ phức tạp ★★☆☆☆.

### A2, A3, A5 ✅
Công khai, chỉ tiếng Việt, code sẵn để sau thêm tiếng Anh. Hợp lý.

### A4 – Ý nghĩa tên ✅
"Không biết đi đâu thì nhớ tới WGo" là một định vị tốt. Gợi ý slogan: **"WGo – Đi đâu đây?"** hoặc **"We Go. Where to go."**
⚠️ Trước khi mua tên miền hoặc làm logo nên kiểm tra chưa có thương hiệu nào trùng tên "WGo" ở Việt Nam.

### B1 – Bộ lọc ⚠️
Các bộ lọc bạn chọn đều hợp lý. Có vài điểm cần lưu ý:

- **"Gần tôi" và bản đồ bắt buộc mỗi quán phải có tọa độ (vĩ độ, kinh độ).** Link Google Maps dạng rút gọn (`maps.app.goo.gl/...`) **không đọc được tọa độ ngay trong trình duyệt**. Có hai cách xử lý:
  - Khi tạo web, mình viết đoạn tự động mở link rút gọn để lấy tọa độ. Cách này khả thi nhưng có thể hỏng nếu Google đổi cách làm link.
  - Dự phòng: trong Google Sheets có cột tọa độ. Trên Google Maps, **nhấn giữ vào quán** là có thể copy tọa độ.
- **Bạn bỏ "Khu vực" nhưng lại cần "lên kế hoạch ở nhà" (A1-b).** Bản đồ sẽ bù cho việc này, nên chấp nhận được.
- **Bạn bỏ "Tag" (C5)** trong khi tầm nhìn là "cafe view đẹp, chỗ check-in, quán local". Theo mình tag là cách rẻ nhất để lọc những thứ đó. **Đề xuất giữ cột Tag, không bắt buộc điền.**
- **"Thành phố"**: dữ liệu có sẵn cột thành phố, nhưng khi chỉ có Huế thì **ẩn** ô chọn cho gọn.

### B2 – Gợi ý: trang chủ + a + b + c

| Phần | Khả thi | Độ phức tạp | Ghi chú |
|---|---|---|---|
| Trang chủ hiện "gợi ý của WGo" do bạn chọn | ✅ | ★☆☆☆☆ | Thêm một cột "Nổi bật" trong Sheet |
| a) Lọc + sắp xếp theo rating / khoảng cách | ✅ | ★★☆☆☆ | |
| b) "Hôm nay ăn gì?" (bốc ngẫu nhiên) | ✅ | ★☆☆☆☆ | Rẻ mà vui, nên làm sớm |
| c) Gợi ý lịch trình ăn → cafe → dạo | ⚠️ | ★★★★☆ | Xem bên dưới |

**Nói thẳng về (c):** thuật toán không khó. Cái khó là **cần nhiều dữ liệu**. Với 20 quán thì "lịch trình" sẽ gợi ý đi vòng vèo, không có ý nghĩa. Đề xuất:
- Trước mắt làm bản nhẹ: trong trang chi tiết quán có mục **"Gần đây có gì?"**, hiện các quán cafe hoặc chỗ check-in trong bán kính khoảng 1 km. Độ phức tạp ★★☆☆☆.
- Khi có từ **khoảng 80–100 địa điểm trở lên** thì mới làm lịch trình đầy đủ.

### B3, C8 – Mình soạn sẵn món + quán mẫu ⚠️
Làm được. Tuy nhiên **giờ mở cửa, giá, tọa độ mà mình soạn có thể sai hoặc đã cũ** (quán đổi giờ, chuyển địa điểm, đóng cửa). Mình sẽ tra cứu trên mạng để bớt sai, gắn nhãn **"Chưa kiểm chứng"**, và bạn cần đi thử để xác nhận. Không nên công khai rộng khi dữ liệu còn nhãn này.

### B4 – Bản đồ ✅ (có chỉnh nhỏ)
- Dùng **OpenStreetMap + Leaflet**: miễn phí, không cần tài khoản. Độ phức tạp ★★☆☆☆.
- **Góp ý trải nghiệm:** chạm vào điểm trên bản đồ mà **nhảy ngay sang Google Maps thì rất khó chịu** (lỡ tay là rời web). Nên làm: chạm vào điểm → hiện **thẻ tóm tắt quán** (tên, món, giờ, giá) → trên thẻ có nút **"Chỉ đường"** mới mở Google Maps.
- ⚠️ Khi web đông người dùng, bản đồ miễn phí của OpenStreetMap có giới hạn sử dụng. Lúc đó chuyển sang dịch vụ bản đồ có gói miễn phí lớn hơn. Việc này tính sau.

### C1, C2 – Rating của bạn ✅ (cần thiết kế trước cho F1)
Sau này người khác cũng được đánh giá (F1), nên ngay từ đầu mình sẽ tách thành hai loại:
- **"WGo chấm"**: rating của bạn, là rating chính thức.
- **"Cộng đồng"**: đánh giá của người khác, hiện riêng.

Nếu không tách từ đầu thì sau này đổi sẽ rất lằng nhằng.

### C3 – Đồng bộ + bản chạy & bản góp ý ⚠️ Ý đúng, nhưng nên hiểu lại

Thứ bạn mô tả ("một bản chạy, một bản góp ý rồi đồng bộ sau") thực chất là **quy trình góp ý có kiểm duyệt**. Làm được mà không cần backend:

```
Người dùng ──► Google Form "Góp ý quán / đánh giá"
                     │
                     ▼
         Sheet "Chờ duyệt"  (RIÊNG TƯ, chỉ bạn xem)
                     │  bạn tick ✅ duyệt
                     ▼
         Sheet "Dữ liệu chính"  (web đọc từ đây)
                     │  tự động mỗi vài giờ, hoặc bạn bấm nút
                     ▼
         GitHub tạo lại web ──► Web WGo cập nhật
```

- Độ phức tạp ★★★☆☆. Mình thiết lập một lần, sau đó bạn chỉ cần tick duyệt.
- **Còn "yêu thích" thì vẫn lưu trên từng máy.** Muốn đồng bộ yêu thích giữa hai điện thoại thì cần đăng nhập, mà đăng nhập thì cần backend. Chưa nên làm.
- ⚠️ Google Form **không chặn được spam tốt**. Với vài chục góp ý mỗi tuần thì duyệt tay vẫn ổn. Nếu bị spam nhiều thì bật chế độ "bắt đăng nhập Google mới gửi được".

### C4 – Google Sheets (b) + tự sửa file (d) ❌ Chọn một thôi

Dùng **hai nơi cùng chứa dữ liệu** chắc chắn sẽ lệch nhau: sửa bên này thì bên kia bị ghi đè. Ngoài ra, với người không code, sửa file dữ liệu trực tiếp **chỉ cần thiếu một dấu phẩy là cả web lỗi**.

**Đề xuất:** **Google Sheets là nơi duy nhất chứa dữ liệu.** Cách (d) chỉ dùng khi mình cần sửa khẩn cấp.
Thêm một điểm cộng: lúc tạo web, mình sẽ cho **kiểm tra lỗi dữ liệu tự động** (thiếu tên, sai định dạng giờ…). Dòng lỗi sẽ bị bỏ qua và báo lại cho bạn, không làm hỏng web.

### C5 – Thông tin mỗi quán ⚠️ Giờ mở cửa khó hơn bạn nghĩ

Quán ở Huế có rất nhiều kiểu giờ:
- Bán hai buổi: `06:00–10:00` và `15:00–20:00`
- Bán qua nửa đêm: `18:00–01:00`
- Nghỉ một ngày trong tuần (ví dụ thứ Hai)
- **Nghỉ hoặc bán chay ngày rằm, mùng 1 âm lịch** (rất phổ biến ở Huế)
- "Bán tới khi hết"

→ Mình sẽ đặt ra một **quy tắc ghi giờ đơn giản** trong Sheet, kèm ví dụ mẫu. Tính âm lịch làm được, độ phức tạp ★★★☆☆.
Nhưng nói thẳng: **"đang mở cửa" chỉ đúng khi dữ liệu giờ đúng.** Đây là việc của dữ liệu, code không tự biết được.

Các trường còn lại (tên, địa chỉ, món, giá, mẹo, điện thoại, Facebook/TikTok) đều ★☆☆☆☆.

### C6 – Ảnh ⚠️ Phần phiền nhất
- Ảnh do bạn cung cấp: mình **nén nhỏ** rồi lưu cùng web. Miễn phí, ổn cho vài trăm ảnh. Độ phức tạp ★★☆☆☆.
- **Không nên** dùng link ảnh Google Drive hay Facebook: hay bị chặn hoặc hết hạn.
- Ảnh do **người khác gửi** qua Google Form: họ phải đăng nhập Google, ảnh vào Drive của bạn, bạn duyệt rồi chuyển vào web. Làm được nhưng thủ công. **Để giai đoạn sau.**

### D1, D2 – Tối giản, trẻ trung, "giống MoMo" ⚠️
- Lấy từ MoMo: **cách bố cục** (lưới icon danh mục ở trang chủ, thanh điều hướng dưới đáy, thẻ bo tròn). Đây là kiểu người Việt đã quen tay.
- **Không lấy** màu hồng đặc trưng, logo hay phong cách nhận diện của MoMo: dễ bị coi là nhái thương hiệu, và web sẽ không có bản sắc riêng.
- Lưu ý: MoMo là siêu ứng dụng **rất dày thông tin**, ngược với "tối giản". Mình sẽ giữ bố cục quen thuộc nhưng **ít chữ, nhiều khoảng trống**, và chọn một màu chủ đạo riêng cho WGo. Sẽ có 2–3 bản phác thảo để bạn chọn.

### D3 – Dark mode ✅ ★☆☆☆☆ nếu làm ngay từ đầu (thêm vào sau thì mệt hơn nhiều).
### D4 – PWA ✅ ★★☆☆☆
### D5 – Dùng khi mất mạng ⚠️ ★★★☆☆
- Khi mất mạng **vẫn xem được**: danh sách quán, chi tiết, giờ mở cửa, lọc, "hôm nay ăn gì".
- Khi mất mạng **không dùng được**: **bản đồ** (chỉ hiện những vùng đã xem trước đó) và **chỉ đường Google Maps**.
- Dữ liệu offline là bản của lần mở gần nhất khi còn mạng.

### E1, E2, E3, E6 – GitHub, công khai, miễn phí ✅ (có một đề xuất)
- **Nơi đưa web lên mạng:** mình đề xuất **Cloudflare Pages** thay vì Vercel hay GitHub Pages. Lý do: **gói miễn phí của Vercel không cho dùng vào mục đích thương mại**, mà bạn có ý định chạy quảng cáo (F3). GitHub Pages cũng không dành cho mục đích thương mại. Cloudflare Pages miễn phí, cho phép dùng thương mại, không giới hạn lượt truy cập và chạy nhanh ở Việt Nam. Link sẽ có dạng `wgo.pages.dev`.
- ⚠️ **Kho mã công khai + Sheet dữ liệu chính công khai là ổn.** Nhưng **Sheet "Chờ duyệt" tuyệt đối để riêng tư**, vì có thể chứa email hoặc số điện thoại của người góp ý.

### E4 – Máy của bạn (đã kiểm tra)
| Công cụ | Trạng thái | Cần làm |
|---|---|---|
| Git | ✅ Đã có (2.55) | Không |
| Homebrew | ✅ Đã có | Không |
| Node.js | ❌ Chưa có | Mình cài giúp bằng 1 lệnh (khi bắt đầu code) |
| GitHub CLI (`gh`) | ❌ Chưa có | Mình cài, bạn đăng nhập GitHub một lần |
| Tài khoản Google, GitHub, Cloudflare | ? | Bạn tự tạo hoặc đăng nhập, mình hướng dẫn từng bước |

### E5 – Chỉ cần dùng và thêm quán ✅
Rất khớp với phương án Google Sheets: bạn **không bao giờ phải đụng vào code**. Mình sẽ viết file **"Hướng dẫn thêm quán"** có ảnh minh họa.

### F1 – Người khác thêm quán, đánh giá, bạn duyệt ✅ Khả thi (xem C3)
⚠️ Hai lưu ý khi web lớn:
- **Đánh giá chê quán có tên thật** có thể bị quán phản ứng. Việc bạn duyệt trước là điểm cộng.
- Ở Việt Nam, web có **nội dung do người dùng đăng** và **có thu nhập** có thể phải tuân theo quy định về trang thông tin điện tử và mạng xã hội (Nghị định 147/2024/NĐ-CP). **Chưa cần lo lúc nhỏ**, nhưng nên tìm hiểu trước khi chạy quảng cáo hoặc có nhiều người dùng.

### F2 – Không cần chia sẻ ❌ Mình phản biện
Bạn muốn "mọi người nhớ tới WGo". Web cộng đồng lan truyền chủ yếu nhờ **người này gửi link cho người kia** ("ê, tối nay đi quán này nè").
- Cho mỗi quán **một đường link riêng** + **nút Chia sẻ** (dùng sẵn khung chia sẻ Zalo, Messenger của điện thoại): độ phức tạp ★☆☆☆☆, gần như miễn phí.
- Link riêng từng quán cũng giúp **Google tìm thấy WGo** khi người ta search "bún bò Huế ngon".
→ **Đề xuất: làm bản đơn giản ngay từ đầu.**

### F3 – Quảng cáo kiếm thu nhập ⚠️ Kỳ vọng cần thực tế
- **Google AdSense** thường **yêu cầu tên miền riêng** (không nhận link miễn phí dạng `.pages.dev`). Vì vậy lúc đó sẽ tốn khoảng vài trăm nghìn/năm cho tên miền.
- Thu nhập quảng cáo từ người xem ở Việt Nam **khá thấp**. Ước lượng rất thô: **vài chục nghìn đồng cho mỗi 1.000 lượt xem trang**. Muốn có 1–2 triệu/tháng cần **hàng chục nghìn đến hàng trăm nghìn lượt xem mỗi tháng**.
- **Quán trả tiền để được đề xuất** mang lại nhiều tiền hơn nhưng **phá niềm tin**, mà niềm tin chính là giá trị của WGo. Nếu làm thì bắt buộc: **ghi rõ "Được tài trợ"**, và **không bao giờ thay đổi rating "WGo chấm"**.
- Hướng hợp với khách nước ngoài: **link tiếp thị liên kết** (đặt tour, đặt phòng).
→ Tất cả để sau khi có người dùng thật. **Code bây giờ không cần làm gì cho quảng cáo.**

### G1, G2 ✅
Không gấp, và ưu tiên "chọn món, chỉ đường, giờ mở cửa" là **bộ lõi rất chuẩn**: đúng thứ cần khi đứng ngoài đường lúc đói.

---

## 3. Bảng tổng hợp độ phức tạp

| Tính năng | Độ phức tạp | Chi phí | Giai đoạn đề xuất |
|---|---|---|---|
| Chọn món / loại địa điểm | ★☆☆☆☆ | 0đ | 1 |
| Giờ mở cửa + "đang mở" (giờ thường) | ★★☆☆☆ | 0đ | 1 |
| Giờ theo âm lịch (rằm, mùng 1) | ★★★☆☆ | 0đ | 2 |
| Nút chỉ đường Google Maps | ★☆☆☆☆ | 0đ | 1 |
| Trang chủ gợi ý của WGo | ★☆☆☆☆ | 0đ | 1 |
| Lọc giá, sắp xếp rating | ★☆☆☆☆ | 0đ | 1 |
| Dark mode | ★☆☆☆☆ | 0đ | 1 |
| Dữ liệu từ Google Sheets + kiểm tra lỗi | ★★★☆☆ | 0đ | 1 |
| Link riêng từng quán + chia sẻ | ★☆☆☆☆ | 0đ | 1 |
| "Hôm nay ăn gì?" | ★☆☆☆☆ | 0đ | 2 |
| Bản đồ + thẻ quán | ★★☆☆☆ | 0đ | 2 |
| Gần tôi (GPS) | ★★☆☆☆ | 0đ | 2 |
| PWA cài lên màn hình | ★★☆☆☆ | 0đ | 2 |
| Dùng offline | ★★★☆☆ | 0đ | 2 |
| Ảnh quán (của bạn) | ★★☆☆☆ | 0đ | 2 |
| "Gần đây có gì?" | ★★☆☆☆ | 0đ | 3 |
| Góp ý qua Google Form + duyệt | ★★★☆☆ | 0đ | 3 |
| Đánh giá cộng đồng | ★★★☆☆ | 0đ | 3 |
| Lịch trình đầy đủ | ★★★★☆ | 0đ | 4 (khi có ≥ 80 địa điểm) |
| Tiếng Anh | ★★☆☆☆ (code) + nhiều công dịch | 0đ | 4 |
| Thành phố mới | ★☆☆☆☆ (code) + rất nhiều công dữ liệu | 0đ | 4 |
| Tên miền riêng | ★☆☆☆☆ | ~vài trăm nghìn/năm | 5 |
| Quảng cáo | ★★☆☆☆ | cần tên miền | 5 |
| Đăng nhập, đồng bộ yêu thích, tải ảnh trên web | ★★★★☆ | có thể phát sinh phí | 5+ (cần backend thật) |

---

## 4. Lộ trình đề xuất (chỉnh lại)

| Giai đoạn | Nội dung | Điều kiện để qua giai đoạn sau |
|---|---|---|
| **1 – Lõi** | Trang chủ gợi ý · chọn món/loại · giờ mở cửa + "đang mở" · giá · chi tiết quán · chỉ đường · link riêng + chia sẻ · dark mode · dữ liệu từ Google Sheets · 15–20 quán mẫu | Hai bạn dùng thật ở Huế thấy tiện |
| **2 – Như app** | Bản đồ · gần tôi · "hôm nay ăn gì?" · PWA · offline · ảnh · giờ âm lịch | Có **≥ 50 địa điểm đã kiểm chứng** |
| **3 – Cộng đồng** | Google Form góp ý + duyệt · đánh giá cộng đồng · "gần đây có gì?" | Có người ngoài thật sự dùng |
| **4 – Mở rộng** | Lịch trình · tiếng Anh · Đà Nẵng và các thành phố khác | |
| **5 – Kiếm tiền** | Tên miền · quảng cáo · (có thể) backend, đăng nhập | Có lượng truy cập đáng kể |

**Góp ý quan trọng nhất:** đừng mời người khác đóng góp trước khi **chính bạn** đã có khoảng 50 địa điểm chất lượng ở Huế. Người ta đóng góp vào nơi đã có sẵn nội dung, không đóng góp vào trang trống.

---

## 5. Cần bạn xác nhận

1. **Google Sheets là nơi duy nhất chứa dữ liệu** (bỏ việc tự sửa file)? → Đồng ý / Không
2. Người khác góp ý qua **Google Form**, bạn duyệt trong Sheet (thay vì trang "Thêm quán" ngay trong web)? → Đồng ý / Không
3. **Giữ cột Tag** (không bắt buộc) để lọc "view đẹp, check-in, local"? → Đồng ý / Không
4. **Link riêng từng quán + nút chia sẻ** ngay từ giai đoạn 1? → Đồng ý / Không
5. Đưa web lên **Cloudflare Pages** (cho phép quảng cáo sau này)? → Đồng ý / Không
6. Đồng ý với **lộ trình 5 giai đoạn** ở mục 4? → Đồng ý / Muốn đổi…
7. Bước tiếp theo: **phác thảo giao diện trước** hay **dựng Google Sheet mẫu + dữ liệu Huế trước**?
