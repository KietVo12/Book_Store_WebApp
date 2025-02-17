// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: []
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Thêm sản phẩm vào giỏ
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(item => item._id === newItem._id);
      if (!existingItem) {
        state.cartItems.push({ ...newItem, quantity: 1 });
      } else {
        existingItem.quantity += 1;
      }
    },
    // Xóa 1 sản phẩm khỏi giỏ
    removeFromCart: (state, action) => {
      const product = action.payload;
      state.cartItems = state.cartItems.filter(item => item._id !== product._id);
    },
    // Xóa toàn bộ giỏ
    clearCart: (state) => {
      state.cartItems = [];
    },
    // Cập nhật số lượng
    updateQuantity: (state, action) => {
      const { productId, newQuantity } = action.payload;
      // Tìm sản phẩm trong cartItems
      const existingItem = state.cartItems.find(item => item._id === productId);
      if (existingItem) {
        existingItem.quantity = Math.max(1, newQuantity);
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
