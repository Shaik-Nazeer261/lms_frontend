import { useEffect, useState } from "react";
import { FaStar, FaHeart } from "react-icons/fa";
import api from "../../api.jsx"; // ✅ your axios instance

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get("/api/wishlist/");
        setWishlist(res.data);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-6 text-black">
        Wishlist ({wishlist.length})
      </h2>

      {/* Header Row */}
      <div className="grid grid-cols-12 font-semibold text-gray-500 text-sm pb-2 mb-4">
        <div className="col-span-7">COURSE</div>
        <div className="col-span-2">PRICES</div>
        <div className="col-span-3">ACTION</div>
      </div>

      {/* Course Rows */}
      <div className="grid gap-6">
        {wishlist.map((course) => (
          <div
            key={course.id}
            className="grid grid-cols-12 items-center pb-4"
          >
            {/* Course Info */}
            <div className="col-span-7 flex items-start gap-4">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${course.course_image}`}
                alt="course"
                className="w-28 h-24 object-cover rounded-md"
              />
              <div>
                <div className="flex items-center text-orange-500 font-semibold text-sm">
                  <FaStar className="mr-1" />
                  {course.average_rating}{" "}
                  <span className="text-gray-500 font-normal ml-1">
                    ({course.rated_members.toLocaleString()} Review
                    {course.rated_members !== 1 ? "s" : ""})
                  </span>
                </div>
                <p className="text-lg font-medium mt-1">{course.course_title}</p>
                <p className="text-gray-600 text-sm mt-1">
                  Course by: {course.instructor_name}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="col-span-2 text-blue-500 font-semibold text-lg">
              ₹{course.price}
            </div>

            {/* Actions */}
            <div className="col-span-3 flex gap-2 justify-end">
              <button className="bg-gray-100 text-sm font-medium px-4 py-2 rounded">
                Buy Now
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded">
                Add To Cart
              </button>
              <div className="p-2 bg-gray-100 rounded">
                <FaHeart className="text-blue-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
