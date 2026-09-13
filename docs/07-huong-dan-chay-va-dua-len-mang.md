# 07 – Hướng dẫn chạy web & đưa lên mạng

_Cập nhật: 2026-09-13 · Giai đoạn 1_

## 1. Web được làm bằng gì (giải thích ngắn)

| Thành phần | Dùng gì | Vì sao |
|---|---|---|
| Khung web | **Astro** | Tạo ra các trang HTML tĩnh: nhanh, miễn phí, mỗi quán có một link riêng mà Google tìm được |
| Ngôn ngữ | TypeScript + CSS | TypeScript giúp bắt lỗi sớm |
| Dữ liệu | Google Sheets (hiện tạm dùng file CSV mẫu trong `data/hue/`) | Bạn sửa dữ liệu như Excel, không đụng code |
| Lưu "Đã lưu", sáng/tối | Bộ nhớ trình duyệt của từng máy | Không cần tài khoản, không cần máy chủ |
| Đưa lên mạng | **Cloudflare Pages** (https://wgo-auc.pages.dev) | Miễn phí, nhanh ở Việt Nam, cho phép chạy quảng cáo sau này |
| Lưu mã nguồn | **GitHub** (https://github.com/NamVu215/wgo) | Lưu lại lịch sử mọi thay đổi |

### Cấu trúc thư mục

```
WGo/
├─ data/hue/            ← dữ liệu mẫu (CSV)
├─ docs/                ← tài liệu dự án (bạn đang đọc)
├─ design/              ← bản vẽ giao diện
├─ public/              ← favicon, luật bảo mật (_headers), ảnh quán (anh/hue/…)
├─ src/
│  ├─ config.ts         ← chỗ điền link Google Sheet
│  ├─ lib/              ← xử lý dữ liệu, giờ mở cửa, kiểm tra lỗi
│  ├─ pages/            ← các trang: Gợi ý, Khám phá, Đã lưu, trang từng quán
│  ├─ scripts/          ← phần chạy trên trình duyệt (đổi quán, lọc, lưu, chia sẻ)
│  └─ styles/           ← màu sắc, chữ, giao diện
├─ scripts/             ← lệnh kiểm tra dữ liệu
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
| Lộ thông tin cá nhân người dùng | Không thu thập gì. "Đã lưu" và chế độ sáng/tối chỉ nằm trên máy người dùng. Web không xin quyền vị trí ở giai đoạn 1 |
| Lộ mật khẩu hay khóa bí mật trong code công khai | Code không chứa mật khẩu hay khóa nào. File `.env` bị loại khỏi Git |

## 7. Đã có trong giai đoạn 1

- **Gợi ý:** câu hỏi đổi theo buổi (sáng, trưa, chiều, tối, khuya) và nhu cầu (Ăn no, Ăn vặt, Chè & nước, Cafe, Check-in). Hiện **1 quán đang mở**, ưu tiên quán `noi_bat` rồi đến điểm WGo chấm. Có **Đổi quán**, **Đi luôn** (Google Maps) và hàng **Thèm món gì?**. Nếu không có quán nào đang mở, web báo quán mở sớm nhất.
- **Khám phá:** tìm không cần gõ dấu ("bun bo" vẫn ra "Bún bò"); nút nhanh "Đang mở"; bộ lọc theo giờ, buổi, loại, món, giá; sắp xếp theo điểm, giá hoặc tên. Bộ lọc được giữ trên link nên có thể gửi link kết quả cho người khác.
- **Trang quán:** link riêng, giờ mở cửa và trạng thái đang mở/đã đóng theo **giờ Việt Nam** (kể cả quán bán qua nửa đêm, có ngày nghỉ), giá, WGo chấm, nên gọi, mẹo, tag, sao chép địa chỉ, gọi điện, **Chia sẻ** (Zalo/Messenger qua khung chia sẻ của điện thoại), **Lưu**, **Chỉ đường bằng Google Maps**.
- **Đã lưu:** danh sách trên máy, quán đang đóng hiện mờ, nút **Bốc 1 chỗ đang mở trong đây**.
- **Chế độ tối:** tự theo điện thoại, có nút đổi tay ở trang chủ.
- **Kiểm tra dữ liệu** và **20 kiểm thử tự động**.

**Chưa có (theo lộ trình):** bản đồ, gần tôi (GPS), dùng khi mất mạng, cài lên màn hình như app, tính ngày âm lịch, ảnh quán thật, góp ý qua Google Form.
