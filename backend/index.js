const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/coupon', require('./routes/coupon.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/admin/dashboard', require('./routes/analytics.routes'));
app.use(errorHandler);



// Test route
app.get('/', (req, res) => {
  res.send('Ecomm API is running...');
});

// Routes (auth will be added soon)
// app.use('/api/auth', require('./routes/auth.routes'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});
