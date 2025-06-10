import { FaStar, FaPlayCircle } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../api.jsx";
import { useParams } from "react-router-dom";
import {
  FaClock,
  FaSignal,
  FaUserGraduate,
  FaGlobe,
  FaRegCalendarAlt,
  FaCheckCircle,
  FaFileDownload,
  FaCertificate,
  FaClosedCaptioning,
  FaLayerGroup,
  FaFacebookF,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { useRef } from "react";
import { FaChevronDown, FaChevronRight, FaFileAlt } from "react-icons/fa";
import moment from "moment";

const CourseDetails = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = ["Overview", "Curriculum", "Instructor", "Review"];

  const overviewRef = useRef(null);
  const curriculumRef = useRef(null);
  const instructorRef = useRef(null);
  const reviewRef = useRef(null);

  const { id } = useParams(); // URL param like /course/12
  const [courseData, setCourseData] = useState(null);
  const [openIndexes, setOpenIndexes] = useState([]);

  
  

  const toggleLesson = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/api/course-detail-full/${id}/`);
        setCourseData(res.data);
      } catch (err) {
        console.error("Failed to load course:", err);
      }
    };
    fetchCourse();
  }, [id]);

  const handleScroll = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const addToCart = async (courseId) => {
  try {
    const token = localStorage.getItem('access');
    const res = await api.post(`/api/cart/add/${courseId}/`);
    console.log("Added to cart:", res.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};




  const handleBuyNow = async () => {

    const user= JSON.parse(localStorage.getItem("user"));
    try {
      // Step 1: Create Razorpay order on backend
      const res = await api.post(`/api/create-order/${id}/`);

      const { amount, order_id, currency } = res.data;


      // Step 2: Prepare Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // Your Razorpay public key from .env
        amount: amount.toString(),
        currency,
        name: "LMS Platform",
        description: `Payment for course: ${courseData?.title}`,
        order_id,
        handler: async function (response) {
          // Step 3: Verify payment after successful payment
          try {
            await api.post("/api/verify-payment/", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert("Payment successful!");
          } catch (verifyError) {
            console.error("Payment verification failed", verifyError);
            alert("Payment verification failed.");
          }
        },
        

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: {
          color: "#3399cc",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error("Failed to initiate Razorpay", err);
      alert("Unable to process payment. Please try again later.");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await api.post(`/api/wishlist/add/${id}/`);
      alert(response.data.message || "Added to wishlist.");
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      const msg = error.response?.data?.message || "Something went wrong.";
      alert(msg);
    }
  };

  return (
    <div className="flex justify-center px-10">
      <div className="max-w-3xl mx-auto px-8 text-[#00113D]">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-3">
          <span className="text-blue-600">{courseData?.category} </span> /{" "}
          {courseData?.subcategory} / {courseData?.title}
        </div>

        {/* Title + Rating */}
        <h1 className="text-xl font-semibold mb-2 pr-5">{courseData?.title}</h1>
        {courseData?.subtitle && (
          <p className="text-gray-700 text-sm mb-3">{courseData.subtitle}</p>
        )}

        <div className="text-sm text-gray-600 mb-4 flex justify-between">
          <div>
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${
                courseData?.instructor.profile_picture
              }`}
              className="w-10 h-10 inline-block rounded-3xl mr-1"
              alt="Verified"
            />
            Created by{" "}
            <span className="text-blue-600">{courseData?.instructor.name}</span>
          </div>
          <span className="ml-2 text-yellow-500  items-center inline-flex">
            <FaStar className="mr-1" /> {courseData?.rating || "N/A"} 
          </span>
        </div>

        {/* Image & Play */}
        <div className="mb-6">
          {courseData?.demo_video ? (
            <video
              src={`${import.meta.env.VITE_BACKEND_URL}${
                courseData.demo_video
              }`}
              controls
              className="w-full h-80 object-cover rounded"
              poster={`${import.meta.env.VITE_BACKEND_URL}${
                courseData?.course_image
              }`} // Optional image preview
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${
                courseData?.course_image || "/fallback.jpg"
              }`}
              alt="Course"
              className="w-full h-80 object-cover rounded"
            />
          )}
        </div>

        {/* Tabs */}
        {/* Tabs */}
        <div className="flex space-x-6 border-b border-gray-200 mb-4 text-sm">
          <button
            className="text-blue-600 font-medium"
            onClick={() => handleScroll(overviewRef)}
          >
            Overview
          </button>
          <button
            className="text-blue-600 font-medium"
            onClick={() => handleScroll(curriculumRef)}
          >
            Curriculum
          </button>
          <button
            className="text-blue-600 font-medium"
            onClick={() => handleScroll(instructorRef)}
          >
            Instructor
          </button>
          <button
            className="text-blue-600 font-medium"
            onClick={() => handleScroll(reviewRef)}
          >
            Review
          </button>
        </div>

        {/* Overview Tab */}

        <div ref={overviewRef} className="space-y-6 mb-10">
          <section>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p
              className="text-gray-700 text-sm"
              dangerouslySetInnerHTML={{ __html: courseData?.description }}
            ></p>
          </section>

          {courseData?.learning_objectives?.length > 0 && (
            <section className="bg-green-50 border-l-4 border-green-500 p-4">
              <h3 className="font-semibold mb-2">
                What you will learn in this course
              </h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                {courseData.learning_objectives.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {courseData?.target_audiences?.length > 0 && (
            <section>
              <h3 className="font-semibold mb-2">Who this course is for</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {courseData.target_audiences.map((audience, index) => (
                  <li key={index}>{audience}</li>
                ))}
              </ul>
            </section>
          )}

          {courseData?.requirements?.length > 0 && (
            <section>
              <h3 className="font-semibold mb-2">Course requirements</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {courseData.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Curriculum Tab */}

        <div ref={curriculumRef} className="mt-6 text-sm text-gray-700 mb-10">
          <h3 className="text-lg font-semibold mb-4">Curriculum</h3>

          {courseData?.curriculum?.map((lesson, idx) => (
            <div key={idx} className="border-b py-3">
              <div
                onClick={() => toggleLesson(idx)}
                className="flex justify-between items-center cursor-pointer text-[#00113D] font-medium"
              >
                <div className="flex items-center gap-2">
                  {openIndexes.includes(idx) ? (
                    <FaChevronDown className="text-blue-500" />
                  ) : (
                    <FaChevronRight className="text-blue-500" />
                  )}
                  <span>{lesson.lesson_title}</span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-4">
                  <span>{lesson.concept_count} lectures</span>
                  <span className="flex items-center gap-1">
                    <FaClock /> 51m
                  </span>
                </div>
              </div>

              {openIndexes.includes(idx) && (
                <ul className="mt-2 pl-6 text-sm text-gray-700 space-y-2">
                  {lesson.concepts.map((concept, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {concept.title.toLowerCase().includes("lecture") ? (
                        <FaPlayCircle className="text-blue-500" />
                      ) : (
                        <FaFileAlt className="text-gray-500" />
                      )}
                      <span>{concept.title}</span>
                    </li>
                  ))}
                  {lesson.quizzes?.map((quiz, qIdx) => (
                    <li
                      key={`quiz-${qIdx}`}
                      className="flex items-center gap-2 text-yellow-600 font-medium"
                    >
                      <FaFileAlt className="text-yellow-600" />
                      <span>Quiz - {quiz.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Certificate Section */}
          {courseData?.certificate_template && (
            <div className="mb-16">
              <h3 className="text-2xl font-semibold text-[#00113D] mb-6">
                Certificate
              </h3>

              <div className="relative inline-block">
                {/* Blue abstract background shape (optional, just for design like your image) */}
                <div className="absolute -z-10 top-10 left-1/2 transform -translate-x-1/2 w-[400px] h-[200px] bg-blue-400 rounded-full blur-2xl opacity-50"></div>

                {/* Certificate image or iframe preview */}
                <div className="inline-block border-4  border-white shadow-md rounded-md overflow-hidden">
                  <iframe
                    title="Certificate Preview"
                    srcDoc={courseData.certificate_template.html_template}
                    className="w-[400px] h-[350px] bg-white"
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructor Tab */}

        <div ref={instructorRef} className="mt-6 flex gap-6 items-center mb-10">
          <img
        src={`${import.meta.env.VITE_BACKEND_URL}${
            courseData?.instructor.profile_picture || "/default-avatar.png"}`}
            className="w-24 h-24 rounded-full object-cover"
            alt="Instructor"
          />
          <div>
            <h4 className="text-lg font-bold">{courseData?.instructor.name}</h4>
            <p className="text-sm text-gray-500">
              {courseData?.instructor.headline}
            </p>
            <p className="text-sm mt-2 text-gray-700">
              {courseData?.instructor.bio}
            </p>
          </div>
        </div>

        {/* Review Tab */}

        {courseData?.rating && courseData?.rating_breakdown && (

  <div   className="mt-6  pt-4"  ref={reviewRef} >
    <h3 className="font-semibold text-lg text-[#00113D] mb-2 ">Course Rating</h3>

    <div className="flex flex-col lg:flex-row gap-8">
      <div className="bg-[#F9FAFB]  p-4 rounded-md   text-center">
        <p className="text-4xl font-bold text-[#00113D]">{courseData?.rating}</p>
        <div className="flex justify-center mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill={star <= Math.floor(courseData.rating) ? "#3B82F6" : "none"}
              viewBox="0 0 24 24"
              stroke={star <= Math.floor(courseData.rating) ? "#3B82F6" : "#CBD5E0"}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          ))}
        </div>
        <p className="mt-1 text-sm text-[#00113D]">Course Rating</p>
      </div>

<div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-3">
            <div className="flex gap-1 w-32">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  className="w-4 h-4"
                  fill={s <= star ? "#3B82F6" : "none"}
                  stroke="#3B82F6"
                  strokeWidth="1"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 17.27L18.18 21 16.54 13.97 
                      22 9.24l-7.19-.61L12 2 9.19 
                      8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
              ))}
            </div>
            <div className="flex-1 h-2 bg-[#FFEEDC] rounded">
              <div
                className="h-2 bg-blue-400 rounded"
                style={{ width: `${courseData?.rating_breakdown[star]} || 0}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-[#00113D] w-10 text-right">
              {courseData.rating_breakdown[star] > 0
                ? `${courseData.rating_breakdown[star]}%`
                : "< 1%"}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
)}


             {Array.isArray(courseData?.feedback) && (

  <div className="mt-6  pt-6">
    <h3 className="font-semibold text-lg text-[#00113D] mb-4">Students Feedback</h3>
    <div className="space-y-6">
      {courseData.feedback.map((fb, index) => (
        <div key={index} className="flex items-start gap-4  pb-4">
          <img
            src={
              fb.image
                ? `${import.meta.env.VITE_BACKEND_URL}${fb.image}`
                : "/default-avatar.png"
            }
            alt="Student"
            className="w-10 h-10 rounded-full object-cover mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-[#00113D]">{fb.name}</span>
              <span className="text-xs text-gray-500">
  {moment.utc(fb.submitted_at).utcOffset('+05:30').fromNow()}
</span>

            </div>
            <div className="text-yellow-500 mb-2">
              {"★".repeat(fb.rating)}
              {"☆".repeat(5 - fb.rating)}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {fb.comment}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
      </div>
      <div className="w-full p-6  h-fit  shadow-md bg-white text-sm max-w-sm mx-auto">
        {/* Pricing */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-bold text-[#00113D]">
                ₹
                {courseData?.price && courseData?.discount
                  ? (
                      courseData.price -
                      (courseData.price * courseData.discount) / 100
                    ).toFixed(2)
                  : courseData?.price}
              </span>{" "}
              <span className="line-through text-gray-400 ml-2">
                ₹{courseData?.price}
              </span>
            </div>
            <span className="text-blue-600 text-xs bg-blue-100 px-2 py-1 rounded-full">
              {courseData?.discount}% Off
            </span>
          </div>

          <p className="text-red-500 text-xs mt-1 flex items-center">
            <FaRegCalendarAlt className="mr-1" /> 2 days left at this price!
          </p>
        </div>

        {/* Course Info */}
        <div className="border-t border-b py-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-gray-600">
              <FaClock /> Course Duration
            </span>
            <span className="text-[#00113D] font-medium">
              {courseData?.time_duration}
            </span>{" "}
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-gray-600">
              <FaSignal /> Course Level
            </span>
            <span className="text-[#00113D] font-medium text-right">
              {courseData?.level}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-gray-600">
              <FaUserGraduate /> Students Enrolled
            </span>
            <span className="text-[#00113D] font-medium">
              {courseData?.students_enrolled}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-gray-600">
              <FaGlobe /> Language
            </span>
            <span className="text-[#00113D] font-medium">
              {courseData?.language}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-gray-600">
              <FaGlobe /> Subtitle Language
            </span>
            <span className="text-[#00113D] font-medium">
              {courseData?.subtitle_language}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="my-6 space-y-3">
          <button className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600"
            onClick={() => addToCart(courseData?.id)}>
            Add To Cart
          </button>
          <button
            className="w-full bg-blue-100 text-blue-600 font-semibold py-2 rounded hover:bg-blue-200"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>

          <button
            className="w-full border border-gray-300 text-[#00113D] font-medium py-2 rounded hover:bg-gray-50"
            onClick={handleAddToWishlist}
          >
            Add To Wishlist
          </button>
        </div>

        {/* Includes */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 text-[#00113D]">
            This course includes:
          </h4>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-blue-500" /> Lifetime access
            </li>
            <li className="flex items-center gap-2">
              <FaFileDownload className="text-blue-500" /> Free exercises file &
              downloadable resources
            </li>
            <li className="flex items-center gap-2">
              <FaCertificate className="text-blue-500" /> Shareable certificate
              of completion
            </li>
            <li className="flex items-center gap-2">
              <FaClosedCaptioning className="text-blue-500" /> English subtitles
            </li>
            <li className="flex items-center gap-2">
              <FaLayerGroup className="text-blue-500" /> 100% online course
            </li>
          </ul>
        </div>

        {/* Share Section */}
        <div className="border-t mt-6 pt-4">
          <h4 className="font-semibold mb-2 text-[#00113D]">
            Share this course:
          </h4>
          <div className="flex gap-2">
            <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">
              <FiCopy />
            </button>
            <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">
              <FaFacebookF />
            </button>
            <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">
              <FaEnvelope />
            </button>
            <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">
              <FaWhatsapp />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
