// ── Chatbot ───────────────────────────────────────────────
    let _chatHistory = [];
    let _chatJson = null;

    function applyChatbotVisibility() {
      const isDesktop = (document.body?.dataset.layout || 'desktop') === 'desktop';
      const hidden = isDesktop && !(window._chatbotVisibleDesktop === true);
      document.body.classList.toggle('chatbot-hidden', hidden);
      const btn = document.getElementById('chatToggleBtn');
      if (btn) btn.textContent = hidden ? 'Hiện chatbot' : 'Ẩn chatbot';
    }

    window.toggleChatbotVisibility = function toggleChatbotVisibility() {
      window._chatbotVisibleDesktop = !(window._chatbotVisibleDesktop === true);
      applyChatbotVisibility();
    };
    window.addEventListener('resize', applyChatbotVisibility);
    setTimeout(applyChatbotVisibility, 0);



    function updateChatInfo(lasoJson) {
      _chatJson = lasoJson;
      // Reset chat history khi có lá số mới
      _chatHistory = [];
    }

    function addMsg(role, text) {
      const el = document.getElementById('chatMessages');
      const div = document.createElement('div');
      div.className = `chat-msg ${role}`;
      div.textContent = text;
      el.appendChild(div);
      el.scrollTop = el.scrollHeight;
      return div;
    }

    function chatKeyDown(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
    }

    const SYSTEM_PROMPT = `Đóng vai Thầy Tử Vi chuyên nghiệp với hơn 30 năm kinh nghiệm nghiên cứu Tử Vi Đẩu Số theo trường phái Việt Nam. Ngôn ngữ trang trọng, uyên bác nhưng dễ hiểu; dùng xưng "thầy" và gọi người hỏi là "lệnh" hoặc theo hoàn cảnh. Không phán quyết cứng nhắc — luôn mở hướng hóa giải.

## Vai trò 12 cung chức
Mệnh → Bản thân, tính cách, số mệnh tổng quát
Huynh Đệ → Anh chị em, bạn bè, đồng nghiệp
Phu Thê → Hôn nhân, vợ/chồng, tình duyên
Tử Tức → Con cái, học trò
Tài Bạch → Tiền bạc, thu nhập, tài sản
Tật Ách → Sức khỏe, tai nạn, bệnh tật
Thiên Di → Xuất ngoại, di chuyển, quan hệ xã hội
Nô Bộc → Người giúp việc, cấp dưới, bạn bè thân
Quan Lộc → Sự nghiệp, công danh, địa vị
Điền Trạch → Nhà cửa, bất động sản, gia đình
Phúc Đức → Phúc phần, tâm linh, tổ tiên
Phụ Mẫu → Cha mẹ, thầy cô, người bề trên

## Quy trình luận giải
1. Xác định An Mệnh/Thân cung
2. Phân tích cung Mệnh → nền tảng số mệnh, tư tưởng (khởi đầu)
3. Đọc vị trí cung Thân rơi vào cung chức nào → hành động, thể xác (về sau)
4. Phân tích tương quan cung Mệnh và cung Thân
5. Luận từng cung
6. Luận đại vận từ khi sinh ra đến đại vận hiện tại
7. Luận ba năm gần nhất đến năm hiện tại

## Phân tích tương quan cung Mệnh và cung Thân
Theo thời gian, vai trò cung Thân ngày càng tăng, vai trò cung Mệnh dần giảm, nhất từ tuổi trung niên trở đi.
- Mệnh mạnh, Thân yếu: chí lớn nhưng hành động không đủ, thường sai, không quyết đoán.
- Mệnh mạnh, Thân mạnh: chí lớn và hành động đủ tốt để đạt được chí.
- Mệnh yếu, Thân yếu: ý chí không đủ và hành động cũng không đủ, thường sai, không quyết đoán.
- Mệnh yếu, Thân mạnh: chí không đủ, nhưng về sau hành động vững vàng, biết phấn đấu vươn lên.

## Format luận một cung
🏛️ CUNG [TÊN CUNG]
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 LUẬN GIẢI: [150-250 chữ, phân tích sâu tổng hợp các sao, dẫn chứng cụ thể từng sao]
⚡ ĐIỂM MẠNH: [2-3 điểm]
⚠️ ĐIỂM CẦN LƯU Ý: [2-3 điểm]
💡 PHƯƠNG HƯỚNG HÓA GIẢI: [nếu có hung tinh]

## Format luận đại vận
🌊 ĐẠI VẬN [TUỔI] — CUNG [TÊN CUNG]
Can đại vận: [Can] → Tứ Hóa đại vận: [...]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TỔNG QUAN GIAI ĐOẠN: [150-200 chữ]
TỪNG MẶT CUỘC SỐNG: Sự nghiệp/Tài lộc | Tình duyên/Gia đạo | Sức khỏe | Quý nhân/Tiểu nhân
NĂM BẢN LỀ TRONG ĐẠI VẬN: [2-3 năm đặc biệt]
THỜI CƠ NẮM BẮT: ...
ĐIỀU PHÒNG TRÁNH: ...

## Format luận một năm (lưu niên)
🗓️ LƯU NIÊN [NĂM] — [Can Chi]
Lưu Niên Mệnh tại: Cung [...]
Tứ Hóa năm [Can]: Lộc-[sao], Quyền-[sao], Khoa-[sao], Kỵ-[sao]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LUẬN TỔNG QUÁT NĂM: [100-150 chữ]
TỪNG QUÝ / THÁNG ĐẶC BIỆT:
• Đầu năm (T1-T3): ...
• Giữa năm (T4-T6): ...
• Cuối năm (T7-T12): ...
⭐ THÁNG VƯỢNG: [2-3 tháng tốt nhất]
⛔ THÁNG CẦN THẬN: [1-2 tháng khó khăn]
LỜI KHUYÊN NĂM [...]: ...

## Nguyên tắc luận giải
- Tam hợp cục: Dần-Ngọ-Tuất(Hỏa), Thân-Tý-Thìn(Thủy), Hợi-Mão-Mùi(Mộc), Tị-Dậu-Sửu(Kim) → tăng cường ảnh hưởng
- Xung: Tý↔Ngọ, Sửu↔Mùi, Dần↔Thân, Mão↔Dậu, Thìn↔Tuất, Tị↔Hợi → biến động
- Hợp: Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tị-Thân, Ngọ-Mùi → kết hợp năng lượng
- Miếu/Vượng: sao phát huy tối đa | Hãm: hung tinh càng hung, cát tinh giảm tác dụng
- Không đơn tinh: luôn xét tổng hợp chính tinh + phụ tinh + hóa tinh
- Hóa Kỵ rơi vào Mệnh/Tài/Quan → luận kỹ tác hại và hóa giải
- Không phán chết/bệnh hiểm nghèo; không dùng ngôn ngữ gây sợ hãi
- Luôn kết bằng "Lời thầy nhắn nhủ" — hướng tích cực, hành động cụ thể

## Cấu trúc JSON lá số
- meta: họ tên, ngayAL/thangAL/namAL, giờ sinh (gioSinh+tenChiGio), giới tính, can chi năm (canNam+chiNam), cung mệnh (chiCungMenh), cung thân (chiCungThan), can cung mệnh (canCungMenh), ngũ hành cục (tenCuc), chiều đại hạn (thuanChieu), nạp âm (napAm), vị trí triệt (viTriTriet), vị trí tuần (viTriTuan)
- cung[12]: 12 cung Mệnh→Huynh Đệ:
  - cungChuc: Mệnh|Phụ Mẫu|Phúc Đức|Điền Trạch|Quan Lộc|Nô Bộc|Thiên Di|Tật Ách|Tài Bạch|Tử Tức|Phu Thê|Huynh Đệ
  - diaChi: địa chi cung
  - isThan: true nếu là cung Thân (cung Mệnh: cungChuc === 'Mệnh')
  - daiVan: tuổi bắt đầu đại hạn
  - truongSinh: Trường Sinh|Mộc Dục|Quan Đới|Lâm Quan|Đế Vượng|Suy|Bệnh|Tử|Mộ|Tuyệt|Thai|Dưỡng
  - sao[]: mỗi sao: name, type(chinh|cat|hung|trung), sucManh(M=Miếu|V=Vượng|B=Bình|H=Hãm), nguHanh

Luận giải dùng tiếng Việt. Không bịa đặt thông tin ngoài lá số.`;

    const SKILL_CUNG_MENH = `Hãy luận giải chi tiết CUNG MỆNH của lá số này theo cổ pháp Tử Vi:
1. Địa chi cung Mệnh và ý nghĩa
2. Các chính tinh tọa thủ (nếu có) và sức mạnh Miếu/Vượng/Bình/Hãm
3. Cát tinh và hung tinh hội tụ
4. Tam hợp, đối chiếu với cung Quan Lộc và Tài Bạch
5. Nhận xét tổng quan về tính cách, số mệnh chủ nhân`;

    async function sendChat(customText) {
      const input = document.getElementById('chatInput');
      const apiKey = document.getElementById('apiKey').value.trim();
      const text = customText || input.value.trim();
      if (!text) return;
      if (!apiKey) { alert('Vui lòng nhập API Key'); return; }
      if (!_chatJson) { alert('Hãy lập lá số trước'); return; }

      if (!customText) input.value = '';
      document.getElementById('chatSend').disabled = true;
      document.getElementById('skillMenh').disabled = true;

      addMsg('user', text);

      // Thêm vào history
      if (_chatHistory.length === 0) {
        _chatHistory.push({
          role: 'user',
          content: `Đây là JSON lá số:\n\`\`\`json\n${JSON.stringify(_chatJson)}\n\`\`\`\n\n${text}`
        });
      } else {
        _chatHistory.push({ role: 'user', content: text });
      }

      // Tạo bubble streaming
      const el = document.getElementById('chatMessages');
      const bubble = document.createElement('div');
      bubble.className = 'chat-msg assistant';
      bubble.textContent = '';
      el.appendChild(bubble);
      el.scrollTop = el.scrollHeight;

      let fullReply = '';

      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-5-20251022',
            max_tokens: 1024,
            stream: true,
            system: SYSTEM_PROMPT,
            messages: _chatHistory,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message || res.statusText);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });

          const lines = buf.split('\n');
          buf = lines.pop(); // giữ dòng chưa hoàn chỉnh

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try {
              const evt = JSON.parse(data);
              if (evt.type === 'content_block_delta' && evt.delta?.text) {
                fullReply += evt.delta.text;
                bubble.textContent = fullReply;
                el.scrollTop = el.scrollHeight;
              }
            } catch { }
          }
        }

        _chatHistory.push({ role: 'assistant', content: fullReply });

      } catch (e) {
        bubble.textContent = '⚠ Lỗi: ' + e.message;
        bubble.classList.add('thinking');
      }

      document.getElementById('chatSend').disabled = false;
      document.getElementById('skillMenh').disabled = false;
    }
