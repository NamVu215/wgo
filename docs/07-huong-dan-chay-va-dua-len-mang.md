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
- Cách đưa lên hiện tại: **tải thẳng từ máy lên** bằng `npm run deploy`.

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
- **Chưa tự động:** đẩy code lên GitHub **chưa** tự cập nhật web, vẫn cần `npm run deploy`. Sắp tới sẽ cài GitHub Actions để tự đưa web lên mỗi lần đẩy code và mỗi ngày (lấy dữ liệu mới từ Sheet). Việc này cần tạo một **API token Cloudflare** và lưu bí mật trong GitHub.

## 5. Kết nối Google Sheets (khi bạn sẵn sàng)

1. Tạo Google Sheet theo [05-cau-truc-du-lieu.md](05-cau-truc-du-lieu.md), mục 4 (nhập 4 file CSV thành 4 tab).
2. Bấm **Chia sẻ** → **Quyền truy cập chung** → **Bất kỳ ai có đường liên kết** → vai trò **Người xem**.
   - Ai có link cũng xem được bảng. Dữ liệu này vốn công khai trên web nên không sao, nhưng **đừng ghi thông tin riêng tư** vào bảng.
3. Gửi mình **link của từng tab**. Link có dạng `.../d/<mã-sheet>/edit#gid=<số>`, số `gid` mỗi tab khác nhau.
4. Mình điền vào `src/config.ts`. Từ đó web đọc thẳng từ Sheet mỗi lần build.

**Sau khi sửa Sheet, làm sao để web cập nhật?**
- Hiện tại: chạy `npm run deploy` (hoặc báo mình).
- Sắp tới: mình sẽ cài **tự động cập nhật mỗi ngày** (GitHub Actions + Cloudflare Deploy Hook), miễn phí.
- Nếu Sheet có dòng lỗi, dòng đó bị **ẩn khỏi web** chứ không làm hỏng web. Nếu không đọc được Sheet (ví dụ quên chia sẻ), lần build đó **thất bại** và web **giữ nguyên bản cũ**.

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
