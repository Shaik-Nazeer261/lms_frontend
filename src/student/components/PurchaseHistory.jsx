import  { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaRegCreditCard, FaPlayCircle } from 'react-icons/fa';
import api from '../../api.jsx';

const PurchaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [openGroup, setOpenGroup] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/api/payment-history/');
        setHistory(res.data);
      } catch (error) {
        console.error("Failed to fetch payment history", error);
      }
    };
    fetchHistory();
  }, []);

  const formatDateTime = (dateStr) => {
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    return new Date(dateStr).toLocaleString('en-IN', options);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-[#00113D] mb-6">Purchase History</h2>

      {history.map((entry, index) => {
        const totalPaid = entry.courses.reduce((sum, course) => sum + course.paid_amount, 0);

        return (
          <div key={entry.payment.order_id} className="bg-white mb-8 rounded shadow-md">
            {/* Header */}
            <div
              className="flex justify-between items-center px-6 py-4 cursor-pointer bg-blue-50 rounded-t"
              onClick={() => setOpenGroup(openGroup === index ? null : index)}
            >
              <h3 className="text-blue-700 font-semibold text-sm">
                {formatDateTime(entry.payment.timestamp)}
              </h3>
              <div className="text-lg text-gray-600">
                {openGroup === index ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {/* Details */}
            {openGroup === index && (
              <div className="flex flex-col md:flex-row border-t">
                {/* Left: Courses */}
                <div className="flex-1 p-6 space-y-6">
                  {entry.courses.map((course, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${course.image || '/placeholder.jpg'}`}
                        alt="course"
                        className="w-28 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="text-[#00113D] font-semibold text-sm mb-1">{course.title}</div>
                        <div className="text-xs text-gray-500">Course by: {course.instructor}</div>
                      </div>
                      <div className="text-sm text-blue-600 font-semibold mt-2">₹{course.paid_amount}</div>
                    </div>
                  ))}
                </div>

                {/* Right: Payment Summary */}
                <div className="border-t md:border-t-0 md:border-l md:border-[#FFFFFF] p-6 w-full md:w-80 bg-gray-50">
                  <div className="text-[#00113D] font-semibold mb-2">
                    {formatDateTime(entry.payment.timestamp)}
                  </div>

                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <FaPlayCircle className="text-blue-500" />
                      <span>{entry.courses.length} Courses</span>
                    </div>
                    <div>₹{totalPaid.toFixed(2)}</div>
                    <div className="flex items-center gap-2">
                      <FaRegCreditCard className="text-green-500" />
                      <span>Credit Card</span>
                    </div>
                    </div>
                    <div className='flex items-center gap-2'>
                    <div className=" text-[#00113D] font-medium">
                      {entry.payment.card?.name || 'Student'}
                    </div>
                    <div className="text-gray-800 font-semibold text-sm">
                      {entry.payment.card?.last4 ? `**** **** **** ${entry.payment.card.last4}` : ''}
                    </div>
                    {/* <div className="text-gray-400 text-xs">Exp: {entry.payment.card?.expiry || 'N/A'}</div> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PurchaseHistory;
