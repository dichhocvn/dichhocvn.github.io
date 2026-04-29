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
- Tab tìm kiếm lá số theo khoảng ngày `dd/mm/yyyy` + bộ lọc sao + quét toàn bộ 12 giờ + Tuần/Triệt chỉ tại Mệnh + nav `a/b` + auto clear kết quả khi rời Search hoặc bấm Lập lá số + dialog lỗi validate trên desktop (message plain, không đánh số) -> `src/js/features/search-laso.js`
- Chatbot (desktop đang ẩn; nút dưới cùng cột trái hiện trạng thái disabled, chưa cho bật lại) -> `src/js/features/chatbot.js`
- CSS layout co ban (toàn page padding 2px; desktop khi chatbot ẩn thì formArea chiếm full chiều cao còn lại) -> `src/css/base.css`
- CSS chat -> `src/css/chat.css`
- CSS form/tab/grid wrapper (search nav class-based + responsive + margin-bottom 2px cho grid mobile; tab panel full-height trên desktop khi chatbot ẩn; tab bar sticky trên desktop khi cuộn form) -> `src/css/forms.css`
- CSS grid cung/sao/highlight/pill (han-nav class-based + responsive) -> `src/css/grid.css`
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
