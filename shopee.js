fetch('https://duza-backend.onrender.com/api/shopee-webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        // Đây là mã thẻ ngân hàng (ID) của sếp
        user_id: '81a8b826-4009-4e04-8357-594bf6d9bca7', 
        // Bắn thử 50.000 VNĐ tiền hoa hồng
        cashback_amount: 50000 
    })
})
.then(res => res.json())
.then(data => console.log("✅ BÁO CÁO TỪ SHOPEE:", data));