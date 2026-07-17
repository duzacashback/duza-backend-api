const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json()); 

// Khóa két sắt Supabase của sếp
const supabaseUrl = 'https://kvntupzemammuhdqwtnx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2bnR1cHplbWFtbXVoZHF3dG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNTQ3MzMsImV4cCI6MjA5OTczMDczM30.T7-kmbjF2svl4KvJ08E0AnwpnLK9viWk-GvLPx4yFfs';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- CỔNG CHÍNH HỨNG TIỀN TỪ ACCESSTRADE ---
app.get('/api/postback', async (req, res) => {
    const user_id = req.query.aff_sub1;
    const cashback_amount = parseInt(req.query.commission);

    if (!user_id || !cashback_amount) {
        return res.status(400).send("Lỗi: AccessTrade gửi thiếu mã User hoặc số tiền!");
    }

    console.log(`\n🔔 [ACCESSTRADE BÁO ĐƠN] Khách: ${user_id.substring(0,8)}... \vert{} Hoa hồng: ${cashback_amount} VNĐ`);

    const { data: userData } = await supabase
        .from('users')
        .select('pending_balance')
        .eq('id', user_id)
        .single();

    let currentBalance = userData ? userData.pending_balance : 0;
    let newBalance = currentBalance + cashback_amount;

    await supabase
        .from('users')
        .update({ pending_balance: newBalance })
        .eq('id', user_id);

    console.log(`=> 💰 Đã tự động bơm ${cashback_amount} VNĐ vào ví khách hàng thành công!`);
    res.send("DUZA: Đã nhận lệnh từ AccessTrade và cộng tiền thành công!");
});

// BẬT CÔNG TẮC VÀ GIỮ TRẠM SỐNG LÂU TRÊN CỔNG MỚI (8080)
app.listen(8080, () => {
    console.log("🚀 Trạm thu sóng DUZA đã BẬT. Đang ngóng tiền từ AccessTrade dội về tại CỔNG 8080...");
    console.log("⚠️ (Lưu ý: Bảng đen này cứ đứng im tức là hệ thống đang chạy ngon, sếp đừng bấm gì thêm nhé!)");
}).on('error', (err) => {
    console.error("❌ Báo động: Cổng 8080 đang bị kẹt hoặc lỗi!", err);
});