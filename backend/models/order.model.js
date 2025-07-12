const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    discountPercent: {
      type: Number,
      default: 0,
    },
    ecoDelivery: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered'],
      default: 'Processing',
    },
    appliedCoupon: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
