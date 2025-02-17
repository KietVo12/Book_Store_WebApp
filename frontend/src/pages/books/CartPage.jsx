import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import {
  clearCart,
  removeFromCart,
  updateQuantity
} from "../../redux/features/cart/cartSlice";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  // Tính tổng (nếu có quantity thì nhân, nếu chưa có thì mặc định = 1)
  const totalPrice = cartItems
    .reduce((acc, item) => acc + (item.newPrice * (item.quantity || 1)), 0)
    .toFixed(2);

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleUpdateQuantity = (product, newQuantity) => {
    dispatch(updateQuantity({ productId: product._id, newQuantity }));
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 mb-16">
      <h1 className="text-2xl font-bold mb-6">Shopping cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty</p>
      ) : (
        <div className="bg-white shadow-md rounded p-4">
          {/* Nút Clear Cart nằm bên phải */}
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-lg font-medium">Items in your cart</span>
            <button
              onClick={handleClearCart}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Clear Cart
            </button>
          </div>

          {/* Bảng hiển thị sản phẩm */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-700">
                  <th className="py-2 px-2">Product</th>
                  <th className="py-2 px-2 w-28">Price</th>
                  <th className="py-2 px-2 w-32">Quanlity</th>
                  <th className="py-2 px-2 w-28">Total</th>
                  <th className="py-2 px-2 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((product) => {
                  const quantity = product.quantity || 1;
                  const itemTotal = (product.newPrice * quantity).toFixed(2);

                  return (
                    <tr
                      key={product._id}
                      className="border-b last:border-b-0 text-sm"
                    >
                      {/* Cột Sản phẩm: ảnh + tên + category */}
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-3">
                          <img
                            alt={product.title}
                            src={getImgUrl(product.coverImage)}
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <div>
                            <p className="font-semibold">{product.title}</p>
                            <p className="text-gray-500 text-xs">
                              Category: {product.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Cột Giá */}
                      <td className="py-3 px-2 text-gray-900 font-medium">
                        ${product.newPrice}
                      </td>

                      <td className="py-3 px-2">
                    <div className="flex flex-1 flex-wrap items-end justify-between space-y-2 text-sm">
                    {/* Nút +/- để tăng/giảm quantity */}
                        <div className="flex items-center">
                    <button
                        onClick={() => handleUpdateQuantity(product, (product.quantity || 1) - 1)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                    >
                        -
                    </button>
                    <span className="px-3">
                        {product.quantity || 1}
                    </span>
                    <button
                        onClick={() => handleUpdateQuantity(product, (product.quantity || 1) + 1)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                    >
                        +
                    </button>
                    </div>
                {/* Xóa dòng <p className="">{quantity}</p> để không hiển thị lặp */}
                    </div>
                        </td>
                        
                      {/* Cột Tổng */}
                      <td className="py-3 px-2 text-gray-900 font-medium">
                        ${itemTotal}
                      </td>

                      {/* Cột Remove */}
                      <td className="py-3 px-2">
                        <button
                          onClick={() => handleRemoveFromCart(product)}
                          className="text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Khu vực tổng & Checkout */}
          <div className="flex justify-end mt-4">
            <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-50 p-4 rounded shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 font-semibold">Tổng</span>
                <span className="text-gray-800 font-bold">${totalPrice}</span>
              </div>
              <Link
                to="/checkout"
                className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-2 rounded"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
