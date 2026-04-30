# src/js/render/
- `tuvi-render.js`: render UI từ JSON, highlight, an sao lưu theo năm xem hạn; hiển thị Năm hạn trong center info. Với method TTL, render merge thêm bảng lưu method-specific từ `ANSAO_THAITHULANG.TABLES` (`LUU_SAO_THEO_CHI` / `LUU_SAO_THEO_CAN`, gồm `L.Đại Hao`/`L.Tiểu Hao`).
- Nhãn sức mạnh sao hiển thị theo chuẩn `M/V/Đ/B/H`.
- Render chỉ đọc JSON do `TUVI_LOGIC.compute` trả về; quy tắc an sao theo từng phương pháp nằm ở `trungchauphai.js` / `thaithulang.js` và bảng chung trong `data.js` (không nhúng logic an sao vào render).
- `tuvi-render-modules.js`: module tách riêng cho `tuvi-render` (hằng số lớn + rule engine + pill engine Triệt/Tuần/L.Triệt/L.Tuần + center renderer) để giảm kích thước file chính và tối ưu token khi bảo trì. Ô `.center` có `.center-bg` chứa SVG Âm Dương bản gọn (không còn vòng quẻ xung quanh; chỉ hiện khi CFG chọn «Âm Dương vector»); đã bỏ hẳn các dòng phân cách ngang trong bảng info center. Ảnh nền qua `.center::before` / `--laso-center-bg` (`theme-config.js` + `grid.css`).
- Render layer chỉ consume output từ `TUVI_LOGIC.compute(...)`; không đặt dữ liệu an sao đặc thù method trong render.
