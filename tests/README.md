# tests/
- `calendar.test.js`: đổi Dương↔Âm, case đặc biệt (Tết, năm nhuận, roundtrip).
- `logic.test.js`: `TUVI_LOGIC.compute` và validate input/shape.
- `stars.test.js`: invariant an sao quan trọng (chính tinh lõi, Triệt).
- `test-lib.js`: loader runtime scripts cho test.
- `run-tests.js`: runner tổng.

## Chạy test
- `node tests/run-tests.js`

## Quy ước
- Khi sửa logic lịch hoặc an sao, bắt buộc chạy lại test.
- Nếu đổi thuật toán, cập nhật test tương ứng và docs routing.
