-- Bộ đếm lượt ghé WGo: một dòng mỗi ngày (giờ Việt Nam). Không lưu IP hay thông tin người xem.
CREATE TABLE IF NOT EXISTS luot_xem (
  ngay TEXT PRIMARY KEY,
  so INTEGER NOT NULL DEFAULT 0
);
