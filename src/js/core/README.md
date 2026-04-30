# src/js/core/
- `data.js`: constants/lookup tables dùng chung cho mọi phương pháp an sao.
- `ansao.js`: shared core an sao (phần dùng chung giữa các phương pháp).
- `trungchauphai.js`: method Trung châu phái Vương Đình Chi + giữ các bảng đặc thù method (`TU_HOA`, `SUC_MANH_LABEL`, `HOA_TINH_KHOI`, `LINH_TINH_KHOI`, `SAO_THEO_THANG`, `SAO_HANH`).
- `thaithulang.js`: method Thái Thứ Lang (bảng sao theo giờ/năm/tháng/can lưu sẵn dạng index đã xử lý, không giữ raw mapping; Tứ Hóa + M/V/Đ/B/H theo TTL; riêng Tuần/Triệt giữ y hệt Trung Châu; phần còn lại dùng shared core).
- `logic.js`: router compute theo method, xuất `TUVI_LOGIC.compute(...)`.
- Các tiện ích index/lookup chung cho địa chi, thiên can, cung chức nằm ở `src/js/utils/`.
- Chuẩn trạng thái sức mạnh dùng thống nhất `M/V/Đ/B/H` (không dùng `D`).
- Bảng sao theo thiên can hiện dùng quy tắc `Lưu Hà`: Giáp-Dậu, Ất-Tuất, Bính-Mùi, Đinh-Thân, Mậu-Tý, Kỷ-Ngọ, Canh-Mão, Tân-Thìn, Nhâm-Hợi, Quý-Dần.
