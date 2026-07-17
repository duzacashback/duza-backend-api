// --- CỔNG CHÍNH HỨNG TIỀN TỪ ACCESSTRADE ---
app.get('/api/postback', async (req, res) => {
    // Đã sửa lại tên biến chuẩn xác 100% với đường ống AccessTrade
    const user_id = req.query.user_id; 
    const cashback_amount = parseInt(req.query.reward);

    if (!user_id || !cashback_amount) {
        return res.status(400).send("Lỗi: AccessTrade gửi thiếu mã User hoặc số tiền!");
    }

    console.log(`\n🔔 [ACCESSTRADE BÁO ĐƠN] Khách: ${user_id} | Hoa hồng: ${cashback_amount} VNĐ`);

    // Ghi nhận tiền vào ví (Database)
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
    res.send("DUZA: Da nhan lenh tu AccessTrade va cong tien thanh cong!");
});