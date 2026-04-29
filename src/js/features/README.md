# src/js/features/
Các file độc lập theo tính năng UI.

- `lunar-calendar.js`: đổi Dương↔Âm.
- `gio-controls.js`, `han-controls.js`: điều khiển giờ/năm xem hạn; chỉ khóa điều hướng năm khi tắt Xem hạn, điều hướng giờ vẫn luôn dùng được.
- `chatbot.js`: panel chat (desktop đang ẩn mặc định; nút dưới cùng cột trái hiển thị trạng thái disabled "sắp hỗ trợ", chưa cho bật lại chatbot).
- `prompt-export.js`: modal xuất prompt/json.
- `theme-config.js`: template + css variables.
- `layout-*.js`: responsive/resize/scale.
- `search-laso.js`: tab tìm kiếm lá số (ngày `dd/mm/yyyy`), tự quét 12 giờ sinh, Tuần/Triệt chỉ xét tại cung Mệnh, nav có vị trí `a/b`, rời tab Search rồi sửa dữ liệu sẽ tự xóa kết quả cũ; lỗi validate mở dialog trên desktop (hiển thị message dạng plain, không đánh số).
