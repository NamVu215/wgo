# 01 – Bộ câu hỏi trước khi thiết kế WGo

_Tạo ngày: 2026-09-13_

**Cách trả lời:** trả lời ngay trong chat, hoặc ghi vào dòng `→ Trả lời:` dưới mỗi câu. Không cần trả lời hết.
Câu nào bạn **chưa biết hoặc không quan tâm**, cứ ghi "tùy bạn", mình sẽ dùng phương án có ghi **(đề xuất)**.
Các câu có dấu ⭐ là **quan trọng nhất**, ảnh hưởng nhiều tới cách làm.

---

## A. Mục tiêu & người dùng

**A1. ⭐ Tình huống dùng chính là gì?**

- a) Đang ở ngoài đường, mở điện thoại hỏi "giờ này gần đây ăn gì?" **(đề xuất: thiết kế ưu tiên điện thoại)**
- b) Ngồi ở nhà lên kế hoạch trước chuyến đi
- c) Cả hai

→ Trả lời: tôi đang muốn cả a và b, tuy nhiên tôi nghĩ việc làm trên điện thoại sẽ phức tạp hơn nhỉ, tôi nghĩ làm web trước sẽ dễ thực hiện hơn. Tuy nhiên làm web thì phù hợp cho b, còn làm app trên điện thoại thì thuận lợi cho a nhỉ.

**A2. "Chạy trên máy của bạn" nghĩa là gì?**

- a) Chỉ mở trên máy tính của bạn, không đưa lên mạng
- b) Đưa lên mạng bằng một link riêng để bạn, người yêu và vài người bạn mở trên điện thoại **(đề xuất)**

→ Trả lời: b

**A3. Có muốn người khác không mở được web không?** (vì chưa có đăng nhập)

- a) Không sao, ai có link thì xem được, dữ liệu chỉ là danh sách quán **(đề xuất)**
- b) Muốn có một mật khẩu chung đơn giản (lưu ý: không có backend thì cách này chỉ để "che", không bảo mật thật)

→ Trả lời: chỉ cần có link thì mọi người có thể vào xem được, tôi muốn trang web này được public cho mọi người có thể sử dụng dễ dàng

**A4. Tên WGo bạn muốn hiểu theo nghĩa nào?** (để làm slogan, logo)
Ví dụ: _We Go_ (mình cùng đi), _Where to Go_, _Wanna Go?_, _Wander & Go_… hoặc nghĩa riêng của hai bạn?

→ Trả lời: _We Go_ (mình cùng đi), _Where to Go_, _Wanna Go?. Tôi thấy chữ WGo có thể đại diện cho rất nhiều cách hiểu. Tôi chỉ muốn khi mọi người không biết đi đâu, hay muốn lên kế hoạch đi đâu đó thì nhớ tới WGo_

**A5. Bản đầu tiên dùng tiếng Việt, tiếng Anh hay cả hai?**

- a) Chỉ tiếng Việt, nhưng code sẵn để sau thêm tiếng Anh dễ **(đề xuất)**
- b) Song ngữ ngay từ đầu

→ Trả lời: a

---

## B. Tìm kiếm & gợi ý (tính năng cốt lõi)

**B1. ⭐ Bộ lọc nào bạn cần có ngay?** (chọn nhiều)

- [X] Thành phố
- [ ] Khu vực / quận / phường (ví dụ Huế: trung tâm, Vĩ Dạ, Kim Long, bên kia sông Hương…)
- [X] Loại địa điểm: quán ăn, quán nước, cafe, ăn vặt, địa điểm check-in, bar…
- [X] Món cụ thể (bún bò, cơm hến, bánh khoái, chè…)
- [X] Buổi / giờ mở cửa ("đang mở cửa lúc này")
- [X] Mức giá
- [ ] Rating
- [X] Gần tôi (dùng vị trí GPS của điện thoại)
- [ ] Không gian: view đẹp, máy lạnh, ngồi lề đường, yên tĩnh, hợp hẹn hò…
- [ ] Chỗ đỗ xe máy / ô tô
- [ ] Khác: …

→ Trả lời: chỉ mới làm Huế thôi, mở rộng thì tính sau

**B2. ⭐ "Gợi ý" nên hoạt động kiểu nào?**

- a) Lọc rồi hiện danh sách, sắp xếp theo rating hoặc khoảng cách **(đề xuất cho bản đầu)**
- b) Có thêm nút **"Random – hôm nay ăn gì?"** để bốc ngẫu nhiên một quán hợp điều kiện (hợp khi hai người không quyết được 😄)
- c) Có thêm gợi ý lịch trình cả buổi, ví dụ: ăn tối → cafe → chỗ đi dạo

→ Trả lời: khi mới vào trang web thì sẽ đưa ra gợi ý món do tôi đưa thông tin trước. Sau đó sẽ là cả 3 cái a b c. Bạn hãy tính toán mức độ phức tạp, độ khả thi của phương án rồi báo lại cho tôi nhé

**B3. Danh sách món/loại đồ ăn: bạn tự đặt, hay để mình soạn sẵn danh sách món đặc trưng Huế rồi bạn chỉnh?**

→ Trả lời: bạn soạn sẵn đi, mình sẽ tinh chỉnh món ăn và địa điểm sau

**B4. Có cần xem bản đồ ngay trong web không?**

- a) Không, chỉ cần nút "Chỉ đường" mở Google Maps **(đề xuất cho bản đầu)**
- b) Có, hiện các quán thành điểm trên bản đồ

→ Trả lời: lúc đầu sẽ hiện các quán trên bản đồ, sau đó bấm vào quán thì sẽ mở ra Google Maps để chỉ đường

---

## C. Rating & dữ liệu

**C1. ⭐ "Rating" là của ai?**

- a) **Rating riêng của hai bạn** (ví dụ 1–5 sao, kèm nhận xét ngắn) **(đề xuất, đúng tinh thần "quán local có thật")**
- b) Rating Google Maps (bạn tự chép số vào). Lưu ý: tự động lấy từ Google thì **cần backend và tốn phí**, nên bản đầu chưa làm được
- c) Cả hai: hiện rating riêng và rating Google cạnh nhau

→ Trả lời: rating của tôi, chọn a

**C2. Rating có tách riêng từng người không?** Ví dụ: "Vũ chấm 4⭐, người yêu chấm 5⭐"

→ Trả lời: cái này tính sau

**C3. ⭐ Hai bạn có cần dữ liệu đồng bộ giữa hai điện thoại không?**
Ví dụ: bạn đánh dấu "đã đi" hoặc thêm quán trên điện thoại mình, người yêu mở máy họ cũng thấy ngay.

- a) Không cần. Dữ liệu chung do bạn cập nhật lên web; "yêu thích" thì mỗi máy tự lưu riêng **(đề xuất cho bản đầu, không cần backend)**
- b) Cần đồng bộ. Khi đó phải có một nơi lưu trữ online (ví dụ Google Sheets hoặc dịch vụ miễn phí như Supabase/Firebase), phức tạp hơn một chút

→ Trả lời: cần, có thể sẽ nhiều người dùng, và cần nhiều người đóng góp thêm dữ liệu, dữ liệu sẽ có một bản sử dụng để chạy, và một bản góp ý sau đó đồng bộ sau

**C4. ⭐ Bạn muốn thêm/sửa quán bằng cách nào?**

- a) Nhờ mình thêm: bạn gửi tên quán + thông tin, mình cập nhật vào file dữ liệu
- b) Tự điền vào **Google Sheets** (dạng bảng Excel quen thuộc), web tự đọc từ đó **(đề xuất, dễ nhất cho người không code)**
- c) Có một trang **"Thêm quán"** ngay trong web (cần phương án C3-b)
- d) Tự sửa file dữ liệu (mình sẽ hướng dẫn)

→ Trả lời: b và d. Có khả thi không

**C5. ⭐ Mỗi quán cần lưu những thông tin gì?** (đánh dấu cái cần, thêm cái thiếu)

- [X] Tên quán
- [X] Địa chỉ + link Google Maps
- [X] Thành phố, khu vực
- [X] Loại (quán ăn / nước / cafe / check-in…)
- [X] Món nổi bật / món nên gọi
- [X] Giờ mở cửa
- [X] Khoảng giá (ví dụ 30–50k)
- [X] Rating + nhận xét
- [X] Ảnh
- [ ] Tag: local, view đẹp, hẹn hò, đông khách, bình dân…
- [X] Mẹo: "nên đi trước 7h", "hay hết món", "gọi thêm ram"…
- [ ] Đã đi hay chưa / muốn đi
- [X] Số điện thoại, link Facebook/TikTok
- [ ] Khác: …

→ Trả lời:

**C6. Ảnh quán:** tự chụp, lấy từ Google/Facebook, hay chưa cần ảnh ở bản đầu?
(Lưu ý: dùng ảnh người khác chụp có thể dính bản quyền khi web công khai.)

→ Trả lời: tôi sẽ cung cấp ảnh sau

**C7. Hiện tại bạn đã có sẵn danh sách quán ở Huế chưa?** Khoảng bao nhiêu quán? Đang lưu ở đâu (ghi chú điện thoại, Google Maps "Đã lưu", Excel…)?

→ Trả lời: chưa

**C8. Có muốn mình soạn sẵn khoảng 10–20 quán Huế nổi tiếng làm dữ liệu mẫu không?**
(Mình sẽ đánh dấu là "chưa kiểm chứng", để bạn đi thử rồi sửa lại.)

→ Trả lời: có

---

## D. Giao diện & trải nghiệm

**D1. Phong cách giao diện bạn thích?**

- a) Tối giản, sạch sẽ (kiểu Apple / Airbnb)
- b) Trẻ trung, nhiều màu, dễ thương (hợp đi chơi, hẹn hò)
- c) Mang chất Huế / Việt Nam (tím Huế, họa tiết truyền thống…)
- d) Tùy bạn **(mình sẽ đưa 2–3 bản phác thảo để chọn)**

→ Trả lời: tối giản, dễ dùng, nhưng phải mang một chút trẻ trung

**D2. Có web/app nào bạn thích giao diện không?** (Foody, Google Maps, Airbnb, Klook, TikTok…)

→ Trả lời: giao diện giống momo, nhưng phải cải cách để mang sự khác biệt riêng

**D3. Có cần chế độ tối (dark mode) không?**

→ Trả lời: có

**D4. Có muốn "cài" web lên màn hình điện thoại như một app không?** (gọi là PWA, mở nhanh, có icon riêng, không cần App Store)

→ Trả lời: có

**D5. Có cần dùng được khi mất mạng / mạng yếu không?** (ví dụ lúc đi vùng ngoại ô)

→ Trả lời: có

---

## E. Kỹ thuật & vận hành

**E1. ⭐ Lưu mã nguồn ở đâu?**

- a) **GitHub** **(đề xuất: phổ biến, đưa web lên mạng miễn phí dễ nhất)**
- b) GitLab
- c) Chưa có tài khoản nào → mình sẽ hướng dẫn tạo

→ Trả lời: GitHub

**E2. Kho mã nguồn công khai (public) hay riêng tư (private)?**
Lưu ý: nếu dữ liệu nằm trong kho mã, **public = ai cũng xem được danh sách quán và nhận xét của bạn**.

→ Trả lời: công khai 

**E3. Có muốn mua tên miền riêng không?** (ví dụ `wgo.vn` hoặc `wgo.app`, khoảng vài trăm nghìn/năm) Hay dùng link miễn phí trước?

→ Trả lời: link miễn phí trước

**E4. Máy của bạn:** bạn dùng máy Mac (mình thấy vậy). Bạn đã cài **Node.js** hay **Git** chưa? Nếu chưa biết là gì cũng không sao, mình sẽ kiểm tra và hướng dẫn.

→ Trả lời: bạn hãy kiểm tra và hướng dẫn

**E5. Bạn muốn tự hiểu code tới mức nào?**

- a) Chỉ cần dùng được và biết cách thêm quán
- b) Muốn hiểu cơ bản để tự sửa chỗ nhỏ (mình sẽ viết giải thích kỹ hơn)
- c) Muốn học web qua dự án này

→ Trả lời: Chỉ cần dùng được và biết cách thêm quán

**E6. Ngân sách:** hoàn toàn miễn phí, hay chấp nhận tốn chút tiền (tên miền, dịch vụ)?

→ Trả lời: hoàn toàn miễn phí, nếu cần tiền thì tính sau

---

## F. Tương lai (trả lời sơ bộ, để thiết kế không bị "bí" khi mở rộng)

**F1. Khi có người lạ dùng, có muốn họ được thêm quán / đánh giá không?** Nếu có thì cần duyệt trước khi hiện không?

→ Trả lời: có, tôi muốn mọi người được thêm quán và đánh giá, tuy nhiên sẽ cần tôi duyệt

**F2. Có muốn tính năng chia sẻ không?** (gửi link một quán hoặc một danh sách "Top 5 quán bún bò Huế" cho bạn bè qua Zalo/Messenger)

→ Trả lời: chắc không cần đâu

**F3. Quảng cáo sau này:** kiểu Google Ads, hay quán trả tiền để được "đề xuất"?
(Điểm cần cân nhắc: dễ làm mất tính "local, khách quan" của web.)

→ Trả lời: tôi nghĩ là có đấy, tôi vẫn hi vọng cái này có thể giúp tôi kiếm thu nhập :))))

**F4. Có tính năng nào bạn đang nghĩ trong đầu mà chưa kể không?**

→ Trả lời: hiện tại thì không

---

## G. Ưu tiên & thời gian

**G1. ⭐ Bạn muốn có bản dùng thử khi nào?** Có chuyến đi Huế sắp tới không (ngày nào)?

→ Trả lời: không gấp, xây dựng từ từ

**G2. Nếu bản đầu chỉ làm được 3 tính năng, bạn chọn 3 tính năng nào?**

→ Trả lời: chọn món, chỉ đường, giờ mở quán
