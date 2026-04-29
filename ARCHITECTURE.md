# Architecture Routing (Token-First)

## Quick route task -> file
- Tinh toan la so tu input -> `src/js/core/logic.js`
- Bang tra sao, du lieu co dinh -> `src/js/core/data.js`
- Render la so tu JSON (xem han chi active khi co nam cu the; center hien Nam han da chon) -> `src/js/render/tuvi-render.js`
- Rule parser/matcher + dialog rule -> `src/js/render/tuvi-render.js` + `src/js/rules/rules-data.js`
- Sua/noi dung rule theo cung -> `src/rules/*.txt` (nguon editable) va dong bo sang `src/js/rules/rules-data.js`
- Doi Duong<->Am, helper lich -> `src/js/features/lunar-calendar.js`
- Nhan mui ten gio + nhay ngay/thang/nam AL + init ngay/gio hien tai AL/DL (gio nav doc lap voi xem han) -> `src/js/features/gio-controls.js`
- Nam xem han -> `src/js/features/han-controls.js`
- Prompt export/JSON export -> `src/js/features/prompt-export.js`
- Tab tìm kiếm lá số theo khoảng ngày `dd/mm/yyyy` + quét toàn bộ 12 giờ + nav `a/b` + auto clear kết quả khi rời Search hoặc bấm Lập lá số + dialog lỗi validate trên desktop (message plain, không đánh số) + item kết quả có cát/hung mục tiêu (hung gồm Hóa Kỵ; so sánh theo `name` có dấu + lowercase, chỉ bỏ marker miếu/vượng/đắc/hãm; regex marker M/V/B/H áp dụng theo token rời để không sót sao), hiển thị chủ tinh kèm `(M/V/B/H)`, giờ sinh dạng khoảng (`1h-3h`), badge Tuần/Triệt nền đen và trừ 20 điểm cát khí khi có Tuần hoặc Triệt tại Mệnh, Cô/Quả (chỉ hiện khi có); sort theo điểm giảm dần rồi gần ngày bắt đầu; hỗ trợ chọn tất cả/bỏ chọn tất cả tổ hợp chính tinh Mệnh; đã bỏ filter phụ Cát/Hung/Tuần-Triệt khỏi UI; khi template `lyso.vn` vẫn dùng thuật toán local để tìm, nhưng lúc mở từng kết quả thì render ảnh API -> `src/js/features/search-laso.js`
- Theme/template + API ảnh lyso.vn (khóa config thủ công, ẩn legend/prompt khi ở mode API, URL ảnh có năm xem hạn từ `namXem`) -> `src/js/features/theme-config.js`
- Chatbot (desktop đang ẩn; nút dưới cùng cột trái hiện trạng thái disabled, chưa cho bật lại) -> `src/js/features/chatbot.js`
- CSS layout co ban (toàn page padding 2px; desktop khi chatbot ẩn thì formArea chiếm full chiều cao còn lại) -> `src/css/base.css`
- CSS chat -> `src/css/chat.css`
- CSS form/tab/grid wrapper (search nav class-based + responsive + margin-bottom 2px cho grid mobile; tab panel full-height trên desktop khi chatbot ẩn; tab bar sticky trên desktop khi cuộn form) -> `src/css/forms.css`
- CSS grid cung/sao/highlight/pill (han-nav class-based + responsive; tăng z-index khu chính tinh, chỉnh header vị trí 1/3 cân nhau để vị trí 2 centered; cát tinh cho phép overflow, sao hung vị trí 6 căn phải theo cột hung, một dòng và canh mép phải ổn định để không đè viền) -> `src/css/grid.css`
- CSS modal prompt/rule -> `src/css/modals.css`

## Definition of Done (docs sync)
- Nếu thêm/bớt tính năng, đổi kiến trúc, đổi route file:
  - cập nhật README của folder liên quan
  - cập nhật `ARCHITECTURE.md` nếu route task -> file thay đổi
  - cập nhật `CLAUDE.md` nếu guideline/rule thao tác thay đổi
- Chạy check: `python3 scripts/check_docs_sync.py`

## Regression tests
- Chạy test quan trọng: `node tests/run-tests.js`
- Bao phủ: Dương↔Âm lịch, `TUVI_LOGIC.compute`, kiểm tra an sao lõi (Tử Vi/Thiên Phủ/Thất Sát/Phá Quân), vị trí Triệt.
- Test chia module theo chức năng trong `tests/*.test.js`.
