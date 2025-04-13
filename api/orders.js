const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Tạo app Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database tạm (lưu trong biến global)
if (!global.orders) {
  global.orders = [];
  global.orderIdCounter = 1;
}

// API Endpoints
app.post('/api/orders', (req, res) => {
  const { items } = req.body;
  const newOrder = {
    id: global.orderIdCounter++,
    items,
    status: 'Đang xử lý',
    createdAt: new Date()
  };
  global.orders.push(newOrder);
  res.json({ orderId: newOrder.id, message: `Đơn hàng ${newOrder.id} đang xử lý.` });
});

app.get('/api/orders', (req, res) => {
  res.json(global.orders.filter(order => order.status !== 'Xong'));
});

app.put('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = global.orders.find(o => o.id === Number(id));
  if (!order) return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
  order.status = status;
  res.json({ message: `Đơn hàng ${id} đã cập nhật trạng thái: ${status}` });
});

// Export như Vercel Serverless Function
module.exports = app;