# src/js/render/
- `tuvi-render.js`: render UI từ JSON, highlight, an sao lưu theo năm xem hạn; hiển thị Năm hạn trong center info.
- Nhãn sức mạnh sao hiển thị theo chuẩn `M/V/Đ/B/H`.
- Render chỉ đọc dữ liệu sao từ output compute; quy tắc bảng an sao (vd `Lưu Hà` theo can năm) nằm ở `src/js/core/data.js` và method file tương ứng.
- `tuvi-render-modules.js`: module tách riêng cho `tuvi-render` (hằng số lớn + rule engine + pill engine Triệt/Tuần/L.Triệt/L.Tuần + center renderer) để giảm kích thước file chính và tối ưu token khi bảo trì. Ô `.center` có `.center-bg` chứa SVG Âm Dương bản gọn (không còn vòng quẻ xung quanh; chỉ hiện khi CFG chọn «Âm Dương vector»); đã bỏ hẳn các dòng phân cách ngang trong bảng info center. Ảnh nền qua `.center::before` / `--laso-center-bg` (`theme-config.js` + `grid.css`).
- Render layer chỉ consume output từ `TUVI_LOGIC.compute(...)`; không đặt dữ liệu an sao đặc thù method trong render.
