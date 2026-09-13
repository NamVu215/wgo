# WGo

Web gợi ý **ăn gì, uống gì, đi đâu** khi đi chơi ở Việt Nam, dựa trên kinh nghiệm thật của người đi.
Bắt đầu với **Huế**, sau đó mở rộng ra Đà Nẵng, Nha Trang, Vũng Tàu, TP. Hồ Chí Minh và Thủ Đức.

> Trạng thái: **Giai đoạn 1 – Lõi** · đang chạy tại **https://wgo-auc.pages.dev** · dữ liệu mẫu chưa kiểm chứng

## Chạy thử

```bash
npm install
npm run dev        # mở http://localhost:4321
npm run kiem-tra   # kiểm tra dữ liệu
npm test           # kiểm thử tự động
npm run deploy     # đưa bản mới lên mạng
```

Chi tiết (đưa lên GitHub, Cloudflare Pages, nối Google Sheets, bảo mật): [docs/07-huong-dan-chay-va-dua-len-mang.md](docs/07-huong-dan-chay-va-dua-len-mang.md)

## Tài liệu

| File | Nội dung |
|---|---|
| [docs/00-tong-quan.md](docs/00-tong-quan.md) | Ý tưởng, mục tiêu, phạm vi, lộ trình dự kiến |
| [docs/01-bo-cau-hoi.md](docs/01-bo-cau-hoi.md) | Bộ câu hỏi và câu trả lời ban đầu |
| [docs/02-tinh-nang.md](docs/02-tinh-nang.md) | Danh sách tính năng: bản đầu tiên (MVP) và các tính năng có thể thêm sau |
| [docs/03-nhat-ky-quyet-dinh.md](docs/03-nhat-ky-quyet-dinh.md) | Nhật ký: đã quyết định gì, vì sao, vào ngày nào |
| [docs/04-danh-gia-cau-tra-loi.md](docs/04-danh-gia-cau-tra-loi.md) | Đánh giá câu trả lời: khả thi, độ phức tạp, góp ý, lộ trình chỉnh lại |
| [docs/05-cau-truc-du-lieu.md](docs/05-cau-truc-du-lieu.md) | Các cột dữ liệu, quy tắc ghi giờ, cách đưa dữ liệu lên Google Sheets |
| [docs/06-thiet-ke-giao-dien.md](docs/06-thiet-ke-giao-dien.md) | Thiết kế đã chốt (hướng B): các màn hình, màu, chữ, quy chuẩn |
| [docs/07-huong-dan-chay-va-dua-len-mang.md](docs/07-huong-dan-chay-va-dua-len-mang.md) | Cách chạy web, đưa lên mạng, nối Google Sheets, bảo mật, những gì đã có |
| [data/hue/](data/hue/) | Dữ liệu mẫu Huế (CSV): 22 địa điểm, 14 món, 6 loại, 17 tag |
| [design/phac-thao/](design/phac-thao/) | Bản vẽ giao diện · [xem online](https://claude.ai/code/artifact/f79a492f-27d2-4d7e-8fcc-194da82b169d) |
