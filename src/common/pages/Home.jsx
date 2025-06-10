import dashboard from "../images/dashboard.png";
import label from "../../icons/label.svg";
import business from "../../icons/business.svg";
import finance from "../../icons/finance.svg";
import it from "../../icons/It.svg";
import personal from "../../icons/personal.svg";
import office from "../../icons/office.svg";
import market from "../../icons/market.svg";
import photo from "../../icons/photo.svg";
import life from "../../icons/life.svg";
import design from "../../icons/design.svg";
import health from "../../icons/health.svg";
import music from "../../icons/music.svg";
import BlueArrow from "../../icons/BlueArrow.svg";
import { useEffect, useState } from "react";
import api from "../../api.jsx"; // Adjust the import path as necessary
import star from "../../icons/Star.svg";
import user from "../../icons/User.svg";
import level from "../../icons/bar-chart.svg";
import clock from "../../icons/Clock.svg";
import instructor from "../images/instructor.png";

const styledCategories = [
  { name: "Academic Subjects", icon: label, bg: "bg-indigo-100" },
  { name: "Business", icon: business, bg: "bg-green-100" },
  { name: "Finance & Accounting", icon: finance, bg: "bg-orange-100" },
  { name: "IT & Software", icon: it, bg: "bg-rose-100" },
  { name: "Personal Development", icon: personal, bg: "bg-blue-100" },
  { name: "Office Productivity", icon: office, bg: "bg-slate-100" },
  { name: "Marketing", icon: market, bg: "bg-purple-100" },
  { name: "Photography & Video", icon: photo, bg: "bg-blue-50" },
  { name: "Lifestyle", icon: life, bg: "bg-orange-50" },
  { name: "Design", icon: design, bg: "bg-indigo-50" },
  { name: "Health & Fitness", icon: health, bg: "bg-green-50" },
  { name: "Music", icon: music, bg: "bg-yellow-50" },
];



const content = {
  title: "Become an instructor",
  description:
    "Instructors from around the world teach millions of students on Udemy. We provide the tools and skills to teach what you love.",
  buttonText: "Start Teaching",
  stepsTitle: "Your teaching & earning steps",
  steps: [
    {
      number: "1",
      text: "Apply to become instructor",
      color: "bg-purple-100 text-purple-600",
    },
    {
      number: "2",
      text: "Build & edit your profile",
      color: "bg-red-100 text-red-600",
    },
    {
      number: "3",
      text: "Create your new course",
      color: "bg-blue-100 text-blue-600",
    },
    {
      number: "4",
      text: "Start teaching & earning",
      color: "bg-green-100 text-green-600",
    },
  ],
};

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/category-course-count/");

        const merged = res.data.map((apiCat) => {
          const styled = styledCategories.find((c) => c.name === apiCat.name);
          return {
            ...apiCat,
            icon: styled?.icon || label,
            bg: styled?.bg || "bg-gray-100",
          };
        });

        setCategories(merged);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
    fetchCourse();
    fetchTopInstructors();
  }, []);
  const [courses, setCourses] = useState([]);
  const [topInstructors, setTopInstrucotrs] = useState([]);


  const fetchCourse = () => {
    api
      .get("/api/courses/")
      .then((res) => {
        setCourses(res.data);
        console.log("crses", res.data); // Now inside the .then block
      })
      .catch((err) => console.error("Error fetching courses:", err));
  };

    const fetchTopInstructors = () => {
    api
      .get("/api/topinsturctors/")
      .then((res) => {
        setTopInstrucotrs(res.data);
        console.log("instructors", res.data); // Now inside the .then block
      })
      .catch((err) => console.error("Error fetching courses:", err));
  };

  const handleRecentCourseDetails = (id) => {
    console.log("id", id);
  };

  const recentCourses = [...courses].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <>
      <div className="relative w-full bg-white overflow-hidden px-32  flex   items-center justify-between">
        {/* LEFT TEXT */}
        <div className="w-1/2 mx-auto my-auto">
          <h1 className="text-5xl  font-sans text-[#0F172A] mb-4">
            Learn Anytime,<br />
             Anywhere. 
          </h1>
          <p className="text-gray-600  mb-6 ">
            Master new skills with expert-led courses on The Learning Hub.
          </p>
          <button className="bg-blue-400 text-white px-3 py-2  text-sm font-medium hover:bg-blue-700">
            Create Account
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className=" mx-auto flex justify-center relative mb-10 md:mb-0 ">
          <div className="relative">
            <img src={dashboard} alt="Students" className="w-[360px] h-auto" />

            {/* Community bubble */}
            {/* <div className="absolute bottom-0 right-28  rounded-lg    translate-y-1/4 translate-x-1/6
          ">
            <img src={community} alt="avatars" className="" />
            
          </div> */}
          </div>
        </div>
      </div>
      <div className="px-6 py-12 md:px-20 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-slate-900 mb-10">
          Browse top category
        </h2>
        <div className="grid grid-cols-4   gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`flex items-center p-4 rounded-lg shadow-sm ${cat.bg} hover:shadow-md transition-all`}
            >
              <img src={cat.icon} alt={cat.name} className="w-10 h-10 mr-4" />
              <div>
                <h3 className="text-md font-semibold text-slate-900">
                  {cat.name}
                </h3>
                <p className="text-sm text-slate-600">
                  {cat.course_count} Courses
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <span className="text-xs text-slate-600 mb-2 mr-2">
            We have more category & subcategory.
          </span>
          &nbsp;
          <a
            href="#"
            className="text-blue-600 font-medium text-xs hover:underline"
          >
            Browse All{" "}
            <img src={BlueArrow} alt="arrow" className="inline-block w-5 h-5" />
          </a>
        </div>
      </div>

      <div className="px-6 bg-white max-w-6xl mx-auto py-12">
        <div className="text-3xl font-semibold text-center text-slate-900 items-center mb-2">
          Best selling courses
        </div>
     <p className="text-gray-500 text-xs max-w-xl mx-auto text-center mb-8">
      Tried, tested, and trusted by thousands of learners.<br />
These top picks are helping people upskill across the globe.
      </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
          {courses.map(
            (
              course // here You need to add the filter by field (enrolled_students_count )top number of this field and render 6 only
            ) => (
              <div
                key={course.id}
                className="border border-gray-200 rounded-md overflow-hidden shadow hover:shadow-lg transition-all"
              >
                <img
                  src={course.course_image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-700">
                      {course?.category?.name}
                    </span>
                    <span className="text-blue-600 font-semibold">
                      {course.price}
                    </span>
                  </div>
                  <h3 className="text-md font-medium text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 space-x-2">
                    <span className="text-yellow-500">★</span>
                    <span>
                      {Number.isInteger(course.average_rating)
                        ? `${course.average_rating}.0`
                        : course.average_rating}
                    </span>
                    <span className="ml-2">{course.students} students</span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <div className=" py-12 bg-white  max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900 mb-2">
              Our feature courses
            </h2>
          </div>
          <p className="text-gray-500 text-xs max-w-xl">
            Handpicked by our experts to keep you ahead.

            <br />
Explore high-impact learning for today’s world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map(
            (
              course // here you need to fetch the featured courses by field(more rating course , top average_rating field number)
            ) => (
              <div
                key={course.id}
                className="flex bg-white shadow rounded-lg overflow-hidden"
              >
                <img
                  src={course.course_image} // observe the images in this page from that course
                  alt={course.title}
                  className="w-1/3 h-full object-cover"
                />
                <div className="p-4 flex-1">
                  <div
                    className={`text-xs font-bold px-2 py-1 rounded mb-2 inline-block ${course.badgeColor}`}
                  >
                    {course?.category?.name}
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-1 truncate">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {course.instructor_name}
                  </p>

                  <div className="flex justify-between items-center mb-2">
                    <p className="text-blue-800 font-semibold text-md">
                      ₹{course.price}
                    </p>

                    {/* <p className="line-through text-gray-400 text-sm">
                    ₹{course.originalPrice}
                  </p> */}
                  </div>

                  <div className="flex items-center text-sm text-gray-700 mb-3">
                    <img src={star} alt="rating" className="w-4 h-4 mr-1" />
                    {Number.isInteger(course.average_rating)
                      ? `${course.average_rating}.0`
                      : course.average_rating}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <img src={user} alt="students" className="w-4 h-4" />
                      {course.enrolled_students_count} students
                    </div>
                    <div className="flex items-center gap-1">
                      <img src={level} alt="level" className="w-4 h-4" />
                      {course.course_level}
                    </div>
                    <div className="flex items-center gap-1">
                      <img src={clock} alt="duration" className="w-4 h-4" />
                      {course.time_duration}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Recently Added Courses Section */}

      <div className="min-h-screen px-20 bg-gray-50 font-sans">
        <section className="py-12 px-6  bg-white ">
          <div className=" max-w-6xl mx-auto ">
            <div className="flex flex-col lg:flex-row gap-10 ">
              <div className="flex-[2]  ">
                <h2 className="text-3xl font-semibold mb-8 text-gray-800  items-center">
                  Recently added courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
                  {recentCourses.map(
                    (
                      course // here created_at i need to render recent courses
                    ) => (
                      <div
                        key={course.id}
                        onClick={() => handleRecentCourseDetails(course.id)}
                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={course.course_image || "/placeholder.svg"}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
                            {course?.category?.name}
                          </span>
                          <span className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1.5 rounded-md font-semibold">
                            {course.price}
                          </span>
                        </div>
                        <div className="p-5">
                          <h3 className="text-base font-semibold mb-4 leading-tight text-gray-800 line-clamp-2">
                            {course.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-400 text-base">
                                ★
                              </span>
                              <span className="font-semibold text-gray-800">
                                {Number.isInteger(course.average_rating)
                                  ? `${course.average_rating}.0`
                                  : course.average_rating}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {course.enrolled_students_count} students
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300">
                  Browse All Course →
                </button>
              </div>

        {/* this is the course Details card where you need to show when the course is clicked  */}

              {/* <div className="flex-1">
                <div className="bg-white rounded-xl p-6 shadow-md sticky top-5">
                  <div className="flex gap-4 mb-5">
                    <img
                      src="/placeholder.svg?height=60&width=60"
                      alt="Instructor"
                      className="w-15 h-15 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1 text-gray-800 leading-tight">
                        {featuredCourse.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {featuredCourse.instructor}
                      </p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400 text-lg">★</span>
                      <span className="font-semibold text-gray-800">
                        {featuredCourse.rating}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {featuredCourse.ratingText}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>👥</span>
                        <span>{featuredCourse.students}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>📊</span>
                        <span>{featuredCourse.level}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>⏱️</span>
                        <span>{featuredCourse.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-5 p-4 bg-gray-50 rounded-lg">
                    <span className="text-2xl font-bold text-green-600">
                      {featuredCourse.currentPrice}
                    </span>
                    <span className="text-base text-gray-500 line-through">
                      {featuredCourse.originalPrice}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      {featuredCourse.discount}
                    </span>
                    <span className="ml-auto text-xl text-gray-400 cursor-pointer hover:text-red-500 transition-colors">
                      ♡
                    </span>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 mb-4 tracking-wide">
                      WHAT YOU'LL LEARN
                    </h4>
                    <ul className="space-y-2">
                      {featuredCourse.learningPoints.map((point, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 leading-relaxed"
                        >
                          <span className="text-green-500 mr-2">✓</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-lg mb-3 transition-colors duration-300 flex items-center justify-center gap-2">
                    <span>🛒</span>
                    Add To Cart
                  </button>
                  <button className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-3 rounded-lg transition-all duration-300">
                    Course Detail
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </section>

        {/* Become Instructor Section */}

        <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-xl overflow-hidden max-w-6xl mx-auto mt-10 px-6">
          {/* Left section */}
          <div className="bg-gradient-to-r from-[#001744] to-[#58A6FD] text-white p-8 flex justify-between items-center lg:w-1/2">
            {/* Text content */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
              <p className="text-sm lg:text-base mb-6">{content.description}</p>
              <button className="bg-white text-blue-700 hover:bg-gray-100 px-5 py-2 rounded-full font-medium flex items-center gap-2 transition">
                {content.buttonText} →
              </button>
            </div>

            {/* Image */}

            <img
              src={instructor}
              alt="Instructor"
              className="w-[100px] lg:w-[180px] ml-4"
            />
          </div>

          {/* Right section */}
          <div className="bg-white p-8 lg:w-1/2 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {content.stepsTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              {content.steps.map((step) => (
                <div key={step.number} className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base ${step.color} text-${step.textColor}`}
                  >
                    {step.number}
                  </div>
                  <span className="text-[#1c1d1f] text-base font-medium">
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Instructors Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-center text-3xl font-semibold mb-12 text-gray-800">
              Top instructor of the month
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
              {topInstructors.map((obj) => (
                <div
                  key={obj.instructor.id}
                  className="bg-white rounded-xl p-6 text-center shadow-md hover:-translate-y-1 transition-transform duration-300"
                >
                  <div
                    className={`w-30 h-30 ${instructor.bgColor} rounded-full mx-auto mb-5 flex items-center justify-center overflow-hidden`}
                  >
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${obj.instructor.profile_picture}`}
                      alt={obj.instructor.user.username}
                      className="w-25 h-25 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-gray-800">
                      {obj.instructor.user.username}
                    </h3>
                    <p className="text-gray-500 mb-4 text-sm">
                      {obj.instructor.headline}
                    </p>
                    <div className="flex justify-center gap-4 text-sm">
                      <span className="text-yellow-400 font-semibold">
                        ★ {obj.average_rating}
                      </span>
                      <span className="text-gray-500">
                        {obj.total_students} students 
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-500">
              Thousands of students waiting for a instructor. Start teaching &
              earning now!{" "}
              <a
                href="#"
                className="text-blue-500 font-semibold hover:underline"
              >
                Become instructor →
              </a>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
