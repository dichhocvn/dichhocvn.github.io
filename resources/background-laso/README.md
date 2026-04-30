# Ảnh nền ô trung tâm (thông tin lá số)

Đặt file ảnh vào thư mục này (đường dẫn từ gốc project: `resources/background-laso/`). Danh sách file dùng trong app là mảng **`LASO_BG_FILES`** trong `src/js/features/theme-config.js` — thêm/bớt tên file trong mảng cho khớp file thực tế.

Trong Cấu hình, dropdown hiển thị **tên không đuôi** (ví dụ `nen1` cho `nen1.jpg`). Option **Âm Dương vector** dùng SVG có sẵn trong ô giữa; **Không nền** ẩn cả ảnh lẫn SVG.

Mở `index.html` qua `file://` vẫn load được ảnh cùng thư mục project: JS gán `--laso-center-bg` bằng URL **tuyệt đối** (`new URL(..., location)`), vì nếu chỉ dùng path tương đối trong biến CSS, trình duyệt resolve `url()` theo file **stylesheet** (`src/css/`) → sai đường dẫn.
