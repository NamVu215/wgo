# 07 – Hướng dẫn chạy web & đưa lên mạng

_Cập nhật: 2026-09-15 · Giai đoạn 2_

## 1. Web được làm bằng gì (giải thích ngắn)

| Thành phần | Dùng gì | Vì sao |
|---|---|---|
| Khung web | **Astro** | Tạo ra các trang HTML tĩnh: nhanh, miễn phí, mỗi quán có một link riêng mà Google tìm được |
| Ngôn ngữ | TypeScript + CSS | TypeScript giúp bắt lỗi sớm |
| Dữ liệu | Google Sheets | Bạn sửa dữ liệu như Excel, không đụng code |
| Bản đồ | **MapLibre** + nền bản đồ Huế **lưu ngay trong web** (dữ liệu OpenStreetMap, đóng gói bởi Protomaps) | Miễn phí, không cần mã API, chạy được ở mọi nhà mạng Việt Nam, xem được khi mất mạng |
| Font chữ | Tải về khi build, lưu cùng web | Không phụ thuộc Google Fonts, mất mạng vẫn đúng font |
| Dùng khi mất mạng | **Service worker** (`sw.js`) | Lưu sẵn các trang trên điện thoại sau lần mở đầu tiên |
| Ảnh quán | Link Google Drive trong Sheet → tự tải, thu nhỏ, đổi sang WebP khi build | Bạn chỉ dán link, web vẫn nhẹ |
| Góp ý, đánh giá | Google Form + Apps Script (`apps-script/gop-y.gs`) | Bạn duyệt bằng một cú tick, không cần máy chủ |
| Lượt ghé | Hàm nhỏ trên Cloudflare (`functions/`) + cơ sở dữ liệu **D1** `wgo-luot-xem` | Web tĩnh không tự đếm được. Miễn phí, không lưu thông tin người xem |
| Lưu "Đã lưu", sáng/tối | Bộ nhớ trình duyệt của từng máy | Không cần tài khoản, không cần máy chủ |
| Đưa lên mạng | **Cloudflare Pages** (https://wgo-auc.pages.dev) | Miễn phí, nhanh ở Việt Nam, cho phép chạy quảng cáo sau này |
| Lưu mã nguồn | **GitHub** (https://github.com/NamVu215/wgo) | Lưu lại lịch sử mọi thay đổi |

### Cấu trúc thư mục

```
WGo/
├─ data/hue/            ← dữ liệu mẫu (CSV)
├─ docs/                ← tài liệu dự án (bạn đang đọc)
├─ design/              ← bản vẽ giao diện
├─ apps-script/         ← code Google Apps Script tạo Form góp ý, đánh giá (docs/09)
├─ db/                  ← cấu trúc bảng đếm lượt ghé (D1)
├─ functions/           ← hàm chạy trên Cloudflare: /api/luot-xem
├─ integrations/        ← phần chạy lúc build: tạo sw.js (offline), chép ảnh, chép thư viện bản đồ
├─ public/              ← icon, manifest (cài như app), luật bảo mật (_headers)
│  └─ nen-ban-do/       ← nền bản đồ Huế đã tải sẵn (tạo bằng `npm run tai-ban-do`)
├─ src/
│  ├─ config.ts         ← link Google Sheet, danh sách thành phố (CITIES), link Form góp ý
│  ├─ lib/              ← xử lý dữ liệu, giờ mở cửa, âm lịch, khoảng cách, ảnh
│  ├─ pages/            ← trang chọn thành phố, Đã lưu; [thanhPho]/ = Gợi ý, Khám phá, Bản đồ, từng quán của mỗi thành phố
│  ├─ scripts/          ← phần chạy trên trình duyệt (đổi quán, lọc, bản đồ, vị trí, cài app)
│  └─ styles/           ← màu sắc, chữ, giao diện
├─ scripts/             ← lệnh kiểm tra dữ liệu, tải nền bản đồ
└─ tests/               ← kiểm thử tự động
```

## 2. Chạy web trên máy của bạn

Mở ứng dụng **Terminal**, gõ từng dòng rồi Enter:

```bash
cd ~/Desktop/WGo
npm install          # chỉ cần lần đầu, hoặc khi mình báo có thêm thư viện
npm run dev          # mở web thử
```

Mở trình duyệt vào **http://localhost:4321**. Bấm `Ctrl + C` trong Terminal để tắt.

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy web thử, sửa code thì web tự cập nhật |
| `npm run kiem-tra` | **Kiểm tra dữ liệu**: báo dòng nào lỗi (bị ẩn khỏi web) và dòng nào có cảnh báo |
| `npm test` | Chạy kiểm thử tự động (giờ mở cửa, đọc dữ liệu…) |
| `npm run build` | Tạo bản web hoàn chỉnh vào thư mục `dist/` |
| `npm run deploy` | **Build + đưa lên mạng** (https://wgo-auc.pages.dev) |
| `npm run noi-sheet -- "<link>"` | Nối Google Sheet: tự tìm các tab và ghi vào `src/config.ts` |
| `npm run tai-ban-do [-- vung-tau]` | Tải lại nền bản đồ cho mọi thành phố (hoặc chỉ thành phố ghi sau) theo `bounds` trong `src/config.ts`, mỗi thành phố khoảng 1–2 phút. Chỉ cần khi thêm thành phố, đổi vùng, hoặc cập nhật đường xá mới |

## 3. Web đang chạy ở đâu

**Link chính thức: https://wgo-auc.pages.dev**. Tên `wgo` đã có người dùng nên Cloudflare thêm đuôi `-auc`. Có thể đổi sang tên miền riêng sau.

- Tài khoản Cloudflare: `nnamvu01@gmail.com`, dự án Pages tên **`wgo`**.
- Cách đưa lên: **tự động bằng GitHub Actions** (mục 5), hoặc từ máy bằng `npm run deploy`.

### Cập nhật web sau khi sửa code hoặc dữ liệu

```bash
cd ~/Desktop/WGo
npm run deploy
```

Lệnh này tự build và tải lên, xong trong khoảng 1 phút. Lần đầu trên máy mới, cần chạy `npx wrangler login` và bấm **Allow** trên trình duyệt.

> ⚠️ Không chạy `wrangler deploy` hay `wrangler pages project create` không kèm tùy chọn: bản Wrangler mới sẽ tự đổi web tĩnh sang dạng Worker có máy chủ và sửa file cấu hình. Chỉ dùng `npm run deploy`.

## 4. Mã nguồn trên GitHub

- Kho mã công khai: **https://github.com/NamVu215/wgo**. Máy này đã đăng nhập GitHub bằng công cụ `gh`.
- Lịch sử code ghi tên **NamVu215** với email ẩn danh `182730968+NamVu215@users.noreply.github.com`, không lộ Gmail.
- Đẩy thay đổi lên GitHub: `git push`.
- Mỗi lần đẩy code lên nhánh `main`, GitHub Actions tự kiểm tra và đưa web lên (cần mã Cloudflare, xem mục 5).

## 5. Google Sheet & tự động cập nhật web

**Sheet:** [WGo – Dữ liệu](https://docs.google.com/spreadsheets/d/1ricr-8XcL58OSaPFGEcQccu2pV1QMT8fLpOOU7IWeGo/edit) (đã nối, `src/config.ts`).

### Luồng hằng ngày của bạn

```
Bạn sửa Google Sheet  ──►  GitHub Actions tự chạy (06:00 và 17:00 giờ VN)
                              1. kiểm thử
                              2. đọc Sheet, kiểm tra lỗi dữ liệu
                              3. build web
                              4. đưa lên https://wgo-auc.pages.dev
```

- **Muốn web cập nhật ngay** (không chờ 06:00/17:00): vào [github.com/NamVu215/wgo/actions](https://github.com/NamVu215/wgo/actions) → **Cập nhật web** → **Run workflow** → **Run workflow**. Khoảng 1–2 phút là xong, làm được cả trên điện thoại.
- **Xem dữ liệu có lỗi không:** bấm vào lần chạy gần nhất trong trang Actions. Phần **Summary** có bảng lỗi và cảnh báo theo **số dòng** trong Sheet.
- **Dòng lỗi** bị ẩn khỏi web, không làm hỏng web.
- **Lưới an toàn:** nếu Sheet chỉ còn **dưới 5 địa điểm hợp lệ** (lỡ tay xóa hoặc bị phá), hệ thống **không cập nhật** và giữ nguyên web cũ. Lần chạy đó hiện dấu ❌ đỏ.
- Muốn tự cập nhật từ máy tính thì vẫn dùng được `npm run deploy`.

### ⚠️ Cài một lần: mã Cloudflare cho GitHub

Không có mã này thì GitHub Actions vẫn chạy kiểm tra nhưng **không đưa web lên** (có dòng nhắc màu vàng).

1. Vào [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) → **Create Token** → kéo xuống **Create Custom Token** → **Get started**.
2. Điền:
   - **Token name:** `wgo-github`
   - **Permissions:** chọn `Account` → `Cloudflare Pages` → `Edit`
   - **Account Resources:** `Include` → tài khoản của bạn
3. **Continue to summary** → **Create Token** → bấm **Copy**. Mã chỉ hiện **một lần**.
4. Vào [github.com/NamVu215/wgo/settings/secrets/actions](https://github.com/NamVu215/wgo/settings/secrets/actions) → **New repository secret**:
   - **Name:** `CLOUDFLARE_API_TOKEN`
   - **Secret:** dán mã vừa copy → **Add secret**
5. Vào tab **Actions** → **Cập nhật web** → **Run workflow** để thử.

> Mã này chỉ có quyền sửa Cloudflare Pages. **Không gửi mã qua tin nhắn**, chỉ dán vào GitHub Secrets. GitHub tự che mã trong mọi nhật ký.

### Quyền trên Google Sheet

- **Quyền truy cập chung phải là "Người xem"**. Mã Sheet nằm công khai trong kho GitHub, nên nếu để "Người chỉnh sửa" thì **ai cũng sửa được dữ liệu và thay đổi sẽ tự lên web**.
- Bạn là chủ Sheet nên luôn sửa được khi đăng nhập Google. Muốn cho người khác cùng sửa thì bấm **Chia sẻ** → nhập **email** của họ → **Người chỉnh sửa**.
- Lỡ tay sửa sai: **Tệp → Nhật ký phiên bản** để khôi phục bản cũ.

## 6. Bảo mật: mình đã làm gì

| Rủi ro | Cách xử lý |
|---|---|
| Bị hack máy chủ, lộ cơ sở dữ liệu | Không có máy chủ riêng và không có cơ sở dữ liệu. Web chỉ là các file tĩnh trên Cloudflare |
| Dữ liệu trong Sheet chứa mã độc (ví dụ link `javascript:`) | Mọi chữ đều được hiển thị dạng chữ thường, không chạy như code. Link Facebook/TikTok/Maps chỉ nhận `http(s)://` |
| Web bị nhúng vào trang lừa đảo, bị chèn script lạ | File `public/_headers` bật chính sách bảo mật: chỉ chạy script của chính WGo, cấm nhúng vào trang khác |
| Lộ thông tin cá nhân người dùng | Không thu thập gì. "Đã lưu" và chế độ sáng/tối chỉ nằm trên máy người dùng |
| Vị trí người dùng (gần tôi) | Chỉ hỏi quyền khi người dùng **tự bấm** "Gần tôi" / nút định vị. Vị trí chỉ dùng để tính khoảng cách **ngay trên điện thoại**, không gửi đi đâu, tự quên sau 10 phút hoặc khi đóng tab |
| Web gọi sang dịch vụ khác, lộ lượt xem | Bản đồ, font chữ và ảnh đều lưu ngay trong WGo. Luật bảo mật chỉ cho tải từ chính WGo |
| Bộ đếm lượt ghé | Chỉ lưu một con số mỗi ngày, không IP, không cookie. Chỉ nhận yêu cầu từ chính trang WGo |
| Góp ý chứa thông tin cá nhân, nội dung xấu | Câu trả lời nằm ở Sheet riêng tư. Chỉ nội dung đã duyệt (không email, số điện thoại) mới sang Sheet công khai. Nội dung luôn hiện dạng chữ, không chạy như code hay công thức |
| Lộ mật khẩu hay khóa bí mật trong code công khai | Code không chứa mật khẩu hay khóa nào. File `.env` bị loại khỏi Git |

## 7. Đã có trong giai đoạn 1

- **Gợi ý:** câu hỏi đổi theo buổi (sáng, trưa, chiều, tối, khuya) và nhu cầu (Ăn no, Ăn vặt, Chè & nước, Cafe, Check-in). Hiện **1 quán đang mở**, ưu tiên quán `noi_bat` rồi đến điểm WGo chấm. Có **Đổi quán**, **Đi luôn** (Google Maps) và hàng **Thèm món gì?**. Nếu không có quán nào đang mở, web báo quán mở sớm nhất.
- **Khám phá:** tìm không cần gõ dấu ("bun bo" vẫn ra "Bún bò"); nút nhanh "Đang mở"; bộ lọc theo giờ, buổi, loại, món, giá; sắp xếp theo điểm, giá hoặc tên. Bộ lọc được giữ trên link nên có thể gửi link kết quả cho người khác.
- **Trang quán:** link riêng, giờ mở cửa và trạng thái đang mở/đã đóng theo **giờ Việt Nam** (kể cả quán bán qua nửa đêm, có ngày nghỉ), giá, WGo chấm, nên gọi, mẹo, tag, sao chép địa chỉ, gọi điện, **Chia sẻ** (Zalo/Messenger qua khung chia sẻ của điện thoại), **Lưu**, **Chỉ đường bằng Google Maps**.
- **Đã lưu:** danh sách trên máy, quán đang đóng hiện mờ, nút **Bốc 1 chỗ đang mở trong đây**.
- **Chế độ tối:** tự theo điện thoại, có nút đổi tay ở trang chủ.
- **Kiểm tra dữ liệu** và kiểm thử tự động.

## 8. Đã có trong giai đoạn 2

- **Bản đồ** (tab thứ 3 ở thanh dưới): ghim vàng là chỗ **đang mở**, ghim trắng là đã đóng/chưa rõ giờ. Chạm ghim → thẻ quán có **Chỉ đường**, **Xem quán**, **Lưu**. Lọc nhanh **Đang mở** và theo loại. Nút định vị hiện chấm xanh chỗ bạn đứng. Trang quán có dòng **Xem trên bản đồ WGo**.
- **Gần tôi:** Khám phá có cách xếp **Gần tôi nhất**; trang chủ có nút **Ưu tiên chỗ gần tôi** (ưu tiên chỗ trong 2 km, rồi 5 km). Khi đã cho phép vị trí, mọi thẻ quán hiện khoảng cách ("350 m", "1,2 km").
- **Cài lên màn hình như app (PWA):** trang chủ có thẻ **Cài WGo lên màn hình**. Android/Chrome bấm **Cài**; iPhone hiện hướng dẫn **Chia sẻ → Thêm vào MH chính**.
- **Dùng khi mất mạng:** sau lần mở đầu tiên có mạng, mọi trang (Gợi ý, Khám phá, Đã lưu, trang từng quán) mở được khi mất mạng. Nền bản đồ và ảnh được lưu **khi bạn đã xem qua** chỗ đó. Mất/có mạng lại, web hiện thông báo nhỏ.
- **Ngày nghỉ âm lịch:** quán ghi `ram` hoặc `mung-1` ở cột `ngay_nghi` sẽ tự báo **"Nghỉ rằm · mở lại … ngày mai"** đúng ngày, và trang quán ghi ngày rằm/mùng 1 sắp tới. Lịch âm tính theo giờ Việt Nam, đã kiểm tra với Tết 2024–2027, Trung thu và các tháng nhuận.
- **Ảnh quán:** dán link Google Drive vào cột `anh` (cách làm: [05, mục 5](05-cau-truc-du-lieu.md#5-ảnh-quán)). Trang quán có dải ảnh vuốt ngang, gửi link quán qua Zalo/Messenger sẽ hiện ảnh xem trước.
- **Nút "hôm nay ăn gì?"** đã có từ giai đoạn 1 (Đổi quán, Bốc 1 chỗ đang mở).

### Vì sao bản đồ lưu ngay trong web

Khi làm, mình phát hiện mạng VNPT **không vào được** `openstreetmap.org` (nền bản đồ phổ biến nhất), còn CARTO và Stadia **bắt buộc đăng ký mã**. Vì vậy mình tải sẵn nền bản đồ vùng Huế (khoảng 5 MB) vào `public/nen-ban-do/`. Ưu điểm: không phụ thuộc bên nào, không giới hạn lượt xem, được dùng cả khi có quảng cáo, xem được khi mất mạng.

Khi thêm thành phố mới: thêm vùng vào `src/config.ts` rồi chạy `npm run tai-ban-do` (mình sẽ làm phần này ở giai đoạn mở rộng).

### Thử trên điện thoại

1. Mở https://wgo-auc.pages.dev bằng **Chrome** (Android) hoặc **Safari** (iPhone).
2. Vào tab **Bản đồ**, bấm nút định vị, **Cho phép** vị trí.
3. Cài WGo lên màn hình (thẻ ở cuối trang chủ).
4. Bật **chế độ máy bay**, mở WGo từ màn hình chính: các trang vẫn xem được.

**Chưa có (theo lộ trình):** góp ý qua Google Form, đánh giá cộng đồng (giai đoạn 3); giờ mở cửa theo mùa; thêm thành phố, tiếng Anh (giai đoạn 4).
