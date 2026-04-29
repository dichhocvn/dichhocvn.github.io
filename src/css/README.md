# src/css/
- `base.css`: variables, reset, shell layout (toàn page padding 2px; cột trái desktop cao 100vh; khi chatbot ẩn thì `#formArea` chiếm full chiều cao còn lại).
- `chat.css`: UI chat panel + nút toggle chatbot cố định dưới cùng cột trái desktop; có trạng thái disabled màu xám khi chưa hỗ trợ bật lại chatbot.
- `forms.css`: form input, tab, grid wrapper, search chips; tách class cho search nav để style mobile/desktop riêng + lề dưới lá số (grid) 2px; khi chatbot ẩn trên desktop thì tab panel active (`form/search/cfg`) giãn full-height; tab bar sticky ở đầu vùng form desktop khi cuộn.
- `grid.css`: cung/sao/grid/highlight/pills; tách class cho cụm điều hướng xem hạn để style mobile/desktop riêng; tăng lớp hiển thị khu chính tinh và chỉnh header để vị trí 1/3 có width bằng nhau, vị trí 2 luôn centered và không bị đại vận che; sao hung (vị trí 6) được căn phải theo cột hung (`col-hung` align-items:flex-end), giữ một dòng và cho phép tràn về bên trái để đủ chữ; cát tinh vẫn cho phép overflow.
- `modals.css`: prompt modal + rule modal.
