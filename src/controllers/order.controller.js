import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    let totalAmount = 0;

    // Calculate price
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error("Product not found");

        const price = product.price * item.quantity;
        totalAmount += price;

        return {
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.product");
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};