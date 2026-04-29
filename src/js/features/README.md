# src/js/features/
Các file độc lập theo tính năng UI.

- `lunar-calendar.js`: đổi Dương↔Âm.
- `gio-controls.js`, `han-controls.js`: điều khiển giờ/năm xem hạn; chỉ khóa điều hướng năm khi tắt Xem hạn, điều hướng giờ vẫn luôn dùng được.
- `chatbot.js`: panel chat (desktop đang ẩn mặc định; nút dưới cùng cột trái hiển thị trạng thái disabled "sắp hỗ trợ", chưa cho bật lại chatbot).
- `prompt-export.js`: modal xuất prompt/json.
- `theme-config.js`: template + css variables; thêm template `lyso.vn` để khóa chỉnh màu thủ công và hiển thị ảnh lá số từ API theo dữ liệu form hiện tại.
- `layout-*.js`: responsive/resize/scale.
- `search-laso.js`: tab tìm kiếm lá số (ngày `dd/mm/yyyy`), tự quét 12 giờ sinh, nav có vị trí `a/b`, rời tab Search rồi sửa dữ liệu sẽ tự xóa kết quả cũ; lỗi validate mở dialog trên desktop (hiển thị message dạng plain, không đánh số); mỗi item kết quả hiển thị số cát tinh/hung tinh mục tiêu (hung có cả Hóa Kỵ, so sánh trực tiếp theo `name` có dấu + lowercase, chỉ bỏ trạng thái miếu/vượng/đắc/hãm; regex marker M/V/B/H chỉ áp dụng khi là token rời để không ăn nhầm chữ đầu tên sao), chủ tinh kèm sức mạnh `(M/V/B/H)`, badge Tuần/Triệt nền đen và phạt điểm cát khí -20 khi có Tuần hoặc Triệt tại Mệnh, cờ Cô/Quả (chỉ hiển thị khi có), giờ sinh dạng khoảng (`1h-3h`); danh sách sort giảm dần theo điểm rồi đến ngày gần mốc bắt đầu hơn; có nút chọn tất cả/bỏ chọn tất cả cho tổ hợp chính tinh Mệnh; đã bỏ các filter phụ Cát tinh/Hung tinh/Tuần-Triệt khỏi UI tìm kiếm.
