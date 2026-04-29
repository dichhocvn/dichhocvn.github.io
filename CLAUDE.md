# Tử Vi Đẩu Số — Token-First Guide

## Mục tiêu
- Ưu tiên sửa nhanh, đọc ít file nhất, token thấp nhất.

## Luồng đọc mặc định
1. `ARCHITECTURE.md`
2. `src/README.md`
3. Mở đúng file feature liên quan, tránh đọc lan man.

## Entry
- Runtime: `index.html`
- CSS aggregator: `src/styles.css`

## Route task -> file
- Tính lá số từ input: `src/js/core/logic.js`
- Bảng tra dữ liệu sao: `src/js/core/data.js`
- Render từ JSON + highlight + pills (xem hạn chỉ active khi đã chọn năm; center hiển thị Năm hạn): `src/js/render/tuvi-render.js`
- Rule matcher/dialog: `src/js/render/tuvi-render.js`
- Rule runtime data: `src/js/rules/rules-data.js`
- Rule nguồn editable: `src/rules/*.txt`
- Đồng bộ txt -> runtime rules: `python3 scripts/sync_rules.py`
- Đổi Dương↔Âm: `src/js/features/lunar-calendar.js`
- Mũi tên giờ + nhảy ngày/tháng/năm ÂL + init ngày/giờ hiện tại (giờ nav độc lập xem hạn): `src/js/features/gio-controls.js`
- Năm xem hạn: `src/js/features/han-controls.js`
- Chatbot (desktop đang ẩn, nút dưới cùng cột trái disabled vì chưa hỗ trợ bật lại): `src/js/features/chatbot.js`
- Prompt/JSON export: `src/js/features/prompt-export.js`
- Tab tìm kiếm lá số (ngày `dd/mm/yyyy` + quét 12 giờ sinh + Tuần/Triệt tại Mệnh + nav `a/b` + auto clear khi rời Search hoặc bấm Lập lá số + lỗi validate mở dialog trên desktop, message plain không đánh số): `src/js/features/search-laso.js`
- Theme/config: `src/js/features/theme-config.js`
- Responsive/layout: `src/js/features/layout-scale.js`, `layout-responsive.js`, `layout-resize.js`

## CSS modules
- `src/css/base.css`: variables + reset + shell layout (toàn page padding 2px)
- `src/css/chat.css`: chatbot UI
- `src/css/forms.css`: form + tab + wrapper + search nav class-based responsive + margin-bottom 2px cho grid mobile + tab bar sticky desktop khi cuộn
- `src/css/grid.css`: grid/cung/sao/highlight/pills + han-nav class-based responsive
- `src/css/modals.css`: prompt/rule modal

## Quy tắc chỉnh sửa
- Chỉ sửa đúng module liên quan task.
- Không nhúng lại rule lớn vào `tuvi-render.js`.
- Sửa rule ở `src/rules/*.txt`, sau đó chạy sync script.
- Mobile và desktop phải có layout riêng, xử lý độc lập; không giả định một bản sửa UI áp dụng giống nhau cho cả hai.
- Khi fix giao diện mà chưa rõ target là mobile hay desktop, phải hỏi lại để xác nhận trước khi sửa.
- Mỗi lần báo thay đổi giao diện phải ghi rõ phạm vi đang sửa: `mobile` hay `web/desktop`.
- Sau mọi sửa JS: kiểm tra syntax trước khi kết thúc.
- Sau mọi thay đổi tính năng/cấu trúc: **bắt buộc cập nhật docs tương ứng** (`README.md`, `ARCHITECTURE.md`, `CLAUDE.md` khi cần).
- Check docs sync trước khi kết thúc:
  - `python3 scripts/check_docs_sync.py`
- Chạy regression tests trước khi kết thúc:
  - `node tests/run-tests.js`
- Nếu thay đổi logic (lịch/an sao/compute): bắt buộc chạy lại test và đảm bảo pass.