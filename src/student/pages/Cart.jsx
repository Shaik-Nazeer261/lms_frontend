import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import api from '../../api.jsx';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);


  const fetchCartItems = async () => {
      try {
        const res = await api.get(`/api/cart/`);
        setCartItems(res.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

  useEffect(() => {
    
    fetchCartItems();
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.course_price), 0);
 const totalDiscount = cartItems.reduce((sum, item) => {
  const price = parseFloat(item.course_price);
  const discountPercent = parseFloat(item.course_discount || 0);
  return sum + (price * (discountPercent / 100));
}, 0);

  const total = subtotal - totalDiscount;

  const handleBulkCheckout = async () => {
  try {
    

    const courseIds = cartItems.map(item => item.course_id); // adjust field if necessary

    const res = await api.post(
      `/api/create-bulk-order/`,
      { course_ids: courseIds });

    const { amount, order_id, currency, key } = res.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY, // Your Razorpay key
      amount: amount.toString(),
      currency,
      name: 'LMS Platform',
      description: 'Bulk Course Payment',
      order_id,
      handler: async function (response) {
        try {
          await api.post(
            `/api/verify-bulk-payment/`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          alert('Payment successful! You have been enrolled in your courses.');
          window.location.href = '/student/profile'; // or wherever you show enrolled courses
        } catch (verifyError) {
          console.error('Verification failed:', verifyError);
          alert('Payment verification failed!');
        }
      },
      prefill: {
        name: 'Student Name',
        email: 'student@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Checkout failed:', error);
    alert('Something went wrong. Please try again.');
  }
};


const handleRemoveFromCart = async (courseId) => {
  try {
    await api.delete(`/api/cart/remove/${courseId}/`);
    // Update UI by removing the item from state
    await fetchCartItems(); // Re-fetch cart items to update the UI
    alert('Course removed from cart.');
  } catch (error) {
    console.error("Failed to remove item:", error);
    alert('Failed to remove course from cart.');
  }
};


  return (
    <div className="mx-auto bg-gray-100">
      <div className="text-center mb-20">
        <h1 className="text-xl font-semibold text-[#00113D]">Shopping Cart</h1>
        <p className="mt-2 text-xs text-gray-500">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-1">/</span>
          <span className="text-[#00113D]">Shopping Cart</span>
        </p>
      </div>

      <div className="px-44">
        <h2 className="text-xl font-semibold text-[#00113D] mb-6">Shopping Cart ({cartItems.length})</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="bg-white flex-1 shadow-sm rounded overflow-hidden">
            <div className="grid grid-cols-12 font-semibold text-sm px-6 py-3 text-gray-600">
              <div className="col-span-6">COURSE</div>
              <div className="col-span-3 text-center">PRICES</div>
              <div className="col-span-3 text-right">ACTION</div>
            </div>

            {cartItems.map((item) => {
              const price = parseFloat(item.course_price);
const discountPercent = parseFloat(item.course_discount || 0);
const discountAmount = price * (discountPercent / 100);
const finalPrice = price - discountAmount;


              return (
                <div key={item.id} className="grid grid-cols-12 items-center px-6 py-4 gap-2">
                  <div className="col-span-6 flex items-start gap-3">
                    <img src={item.course_image || "/placeholder.jpg"} alt={item.course_title} className="w-20 h-16 object-cover rounded" />
                    <div>
                      <div className="flex items-center text-sm text-yellow-500 gap-1">
                        <FaStar size={12} />
                        <span>{item.average_rating}</span>
                        <span className="text-gray-400 text-xs ml-1">({item.total_feedbacks} Reviews)</span>
                      </div>
                      <div className="font-semibold text-sm text-[#00113D]">{item.course_title}</div>
                      <div className="text-xs text-gray-500 mt-1">Course by: {item.instructor_name}</div>
                    </div>
                  </div>

                  <div className="col-span-3 text-center text-sm">
                    <span className="text-[#0070F3] font-semibold">₹{finalPrice.toFixed(2)}</span>
                    {totalDiscount > 0 && (
                      <span className="ml-2 text-gray-400 line-through">₹{price}</span>
                    )}
                  </div>

                  <div
  onClick={() => handleRemoveFromCart(item.course)}
  className="col-span-3 text-right text-red-500 text-sm font-medium cursor-pointer hover:underline"
>
  Remove
</div>

                </div>
              );
            })}
          </div>

          {/* Summary Panel */}
          <div className="w-full lg:w-80 p-6 rounded shadow-md bg-white">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-500">-₹{totalDiscount.toFixed(2)}</span>
              </div>
            </div>

            <hr className="my-4 border-gray-600" />

            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button
  onClick={handleBulkCheckout}
  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold flex items-center justify-center gap-2"
>
  Proceed To Checkout <span>→</span>
</button>


            <div className="mt-6 text-sm text-gray-400">
              <label className="block mb-2 text-gray-700 font-semibold">Apply coupon code</label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="save8"
                  className="flex-1 px-3 py-2 rounded-l text-black border"
                />
                <button className="bg-gray-800 text-white px-4 py-2 rounded-r font-medium">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
