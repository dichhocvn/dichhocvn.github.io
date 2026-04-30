# src/
- `styles.css`: gom import các file CSS module.
- `css/`: giao diện theo vùng (base, forms, grid, modals, chat) — xem `src/css/README.md`.
- `js/core/`: tính lá số (`logic.js`, `data.js`, `ansao.js`, phương pháp `trungchauphai.js` / `thaithulang.js`).
- `js/utils/`: `TUVI_DIACHI_UTIL` / `TUVI_THIENCAN_UTIL` / `TUVI_CUNGCHUC_UTIL` (load trước `data.js`).
- `js/render/`: vẽ lá số từ JSON.
- `js/features/`: tab ÂL/DL/Search, theme, layout, tìm lá số, …
- `js/app/`: controller (`lapLaSo`, …).
- `rules/`: nguồn rule theo cung (`.txt`), đồng bộ sang `src/js/rules/rules-data.js` bằng `scripts/sync_rules.py`.
