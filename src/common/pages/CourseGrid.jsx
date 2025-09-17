import { FaStar, FaUser } from "react-icons/fa";
import "../../styles/scrollbar.css";
import faders from "../../icons/faders.svg";
import search from "../../icons/search.svg";
import Cpu from "../../icons/Cpu.svg";
import wcpu from "../../icons/wcpu.svg";

import React, { useEffect, useState } from "react";
import api from "../../api"; // Ensure this points to your axios instance
import { Link } from "react-router-dom";


// const courses = new Array(100).fill(null).map((_, i) => ({
//   id: i,
//   title: `Sample Course Title ${i + 1}`,
//   image: `https://www.shutterstock.com/image-photo/elearning-education-internet-lessons-online-600nw-2158034833.jpg`,
//   price: 1500,
//   rating: 4 + (i % 2 ? 0.5 : 0),
//   students: `${(100000 + i * 12345).toLocaleString()} students`,
//   category: "DEVELOPMENTS",
// }));

const ITEMS_PER_PAGE = 24;

const CourseGrid = () => {
  const [currentPage, setCurrentPage] = useState(1);
   const [categories, setCategories] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [showCategories, setShowCategories] = useState(true);
const [expandedCategories, setExpandedCategories] = useState({});
const [courses, setCourses] = useState([]);


//filter
const [selectedRatings, setSelectedRatings] = useState([]);
const [selectedLevels, setSelectedLevels] = useState([]);
const [priceRange, setPriceRange] = useState({ min: "", max: "" });
const [filteredCourses, setFilteredCourses] = useState([]);
const user = JSON.parse(localStorage.getItem("user")) || {};
const [selectedDurations, setSelectedDurations] = useState([]);
const [searchQuery, setSearchQuery] = useState("");




useEffect(() => {
  const applyFilters = () => {
    let filtered = [...courses];


    if (searchQuery.trim() !== "") {
  filtered = filtered.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );
}


    // ✅ Subcategory filter
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(course =>
        selectedSubcategories.includes(course.subcategory?.id)
      );
    }

    

    // ✅ Rating filter
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(course =>
        selectedRatings.some(rating => course.average_rating >= rating)
      );
    }

    // ✅ Level filter
    if (selectedLevels.length > 0) {
      filtered = filtered.filter(course =>
        selectedLevels.includes(course.course_level)
      );
    }

    if (selectedDurations.length > 0) {
  filtered = filtered.filter((course) => {
    const duration = parseInt(course.time_duration);
    if (!duration || isNaN(duration)) return false;

    if (selectedDurations.includes("6-12 Months") && duration >= 180) return true;
    if (selectedDurations.includes("3-6 Months") && duration >= 90 && duration < 180) return true;
    if (selectedDurations.includes("1-3 Months") && duration >= 30 && duration < 90) return true;
    if (selectedDurations.includes("1-4 Weeks") && duration >= 7 && duration < 30) return true;
    if (selectedDurations.includes("1-7 Days") && duration < 7) return true;

    return false;
  });
}


    // ✅ Price range filter
    const min = parseFloat(priceRange.min);
    const max = parseFloat(priceRange.max);
    if (!isNaN(min)) {
      filtered = filtered.filter(course => parseFloat(course.price) >= min);
    }
    if (!isNaN(max)) {
      filtered = filtered.filter(course => parseFloat(course.price) <= max);
    }

    setFilteredCourses(filtered);
  };

  applyFilters();
}, [courses, selectedSubcategories,  selectedRatings, selectedLevels, priceRange, selectedDurations, searchQuery]);



 useEffect(() => {
  api.get("/api/category-subcategory/") // updated endpoint
    .then((res) => setCategories(res.data))
    .catch((err) => console.error("Error fetching categories:", err));


     // Get courses
  api.get("/api/courses/")
    .then((res) => setCourses(res.data))
    .catch((err) => console.error("Error fetching courses:", err));
    
}, []);


  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const toggleCategory = (id) => {
  setExpandedCategories((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};

const getFilterCounts = (courses) => {
  const subcategoryCount = {};
  const levelCount = {};
  const ratingCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const durationCount = {
    "6-12 Months": 0,
    "3-6 Months": 0,
    "1-3 Months": 0,
    "1-4 Weeks": 0,
    "1-7 Days": 0,
  };

  courses.forEach((course) => {
    // ✅ Subcategory count
    const subId = course.subcategory?.id;
    if (subId) {
      subcategoryCount[subId] = (subcategoryCount[subId] || 0) + 1;
    }

    // ✅ Level count
    const level = course.course_level?.toLowerCase();
    if (level) {
      levelCount[level] = (levelCount[level] || 0) + 1;
    }

    // ✅ Rating count
    const rating = Math.floor(course.average_rating || 0);
    for (let i = 1; i <= rating; i++) {
      ratingCount[i] += 1;
    }

    // ✅ Duration count (parse course.time_duration like "120 Day")
    const duration = parseInt(course.time_duration);
    if (duration >= 180) {
      durationCount["6-12 Months"] += 1;
    } else if (duration >= 90) {
      durationCount["3-6 Months"] += 1;
    } else if (duration >= 30) {
      durationCount["1-3 Months"] += 1;
    } else if (duration >= 7) {
      durationCount["1-4 Weeks"] += 1;
    } else if (duration > 0) {
      durationCount["1-7 Days"] += 1;
    }
  });

  return { subcategoryCount, levelCount, ratingCount, durationCount };
};

const { subcategoryCount, levelCount, ratingCount, durationCount } = getFilterCounts(courses);



  return (
    <div className="max-w-6xl mx-auto my-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 items-center">
          <button
  onClick={() => setShowFilter(!showFilter)}
  className="border border-gray-400 px-3 py-2 rounded flex text-sm"
>
  <img src={faders} alt="Filter" className="w-4 h-4 mr-2" />
  Filter
</button>

          <div className="relative w-60">
            <img
              src={search}
              alt="Search"
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
            />
            <input
  type="text"
  placeholder="search courses"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="pl-10 pr-3 py-2 border border-gray-300 rounded text-sm w-full"
/>

          </div>
        </div>
        <div className="text-sm">
          <label className="mr-2">Sort by:</label>
          <select className="border border-gray-300 px-2 py-1 rounded">
            <option>Trending</option>
            <option>Most Reviewed</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
     <div className="flex gap-6 mt-6">
  {/* Sidebar Filter Panel */}
{showFilter && (
  <div className="w-64 bg-white p-4 rounded shadow-md text-sm  max-h-[85vh] overflow-y-auto space-y-6">
    
    {/* CATEGORY Filter */}
    <div>
      <div onClick={() => setShowCategories(!showCategories)} className="flex justify-between items-center font-semibold cursor-pointer mb-2">
        <span className="text-gray-700">CATEGORY</span>
        <span>{showCategories ? "▾" : "▸"}</span>
      </div>
      {showCategories && categories.map((category) => {
        const hasSelectedSubcategory = category.subcategories.some(sub =>
    selectedSubcategories.includes(sub.id)
  );

  return (
    <div key={category.id} className="mb-2">
      <div
        onClick={() => toggleCategory(category.id)}
        className="flex justify-between items-center cursor-pointer font-medium text-gray-800  py-1 hover:bg-gray-50 rounded"
      >
        <span className="flex items-center gap-2">
          {hasSelectedSubcategory ? (
            <img src={Cpu} className="text-blue-500 w-4 h-4" />
          ) : (
            <img src={wcpu} className="text-gray-400 w-4 h-4" />
          )}
          {category.name}
        </span>
        <span>{expandedCategories[category.id] ? "▾" : "▸"}</span>
      </div>

      {/* Subcategories */}
      {expandedCategories[category.id] && (
        <ul className=" mt-1 text-gray-700 space-y-1">
          {category.subcategories.map((sub) => (
            <li key={sub.id}>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={sub.id}
                  checked={selectedSubcategories.includes(sub.id)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const id = parseInt(e.target.value);
                    setSelectedSubcategories((prev) =>
                      checked ? [...prev, id] : prev.filter((sid) => sid !== id)
                    );
                  }}
                />
               <div className="flex justify-between w-full pr-2">
  <span>{sub.name}</span>
  <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
    {subcategoryCount[sub.id] || 0}
  </span>
</div>

              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
})}
    </div>

   

    {/* RATING */}
    <div>
      <div className="flex justify-between items-center font-semibold cursor-pointer mb-2">
        <span className="text-gray-700">RATING</span>
        <span>▾</span>
      </div>
      <ul className="ml-2 space-y-1 text-gray-700">
        {[5, 4, 3, 2, 1].map((star) => (
          <li key={star}>
            <label className="inline-flex items-center space-x-2">
              <input
  type="checkbox"
  value={star}
  checked={selectedRatings.includes(star)}
  onChange={(e) => {
    const value = parseInt(e.target.value);
    setSelectedRatings((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  }}
/>

              <span>⭐ {star} Star & up ({ratingCount[star] || 0})</span>
            </label>
          </li>
        ))}
      </ul>
    </div>

    {/* COURSE LEVEL */}
    <div>
      <div className="flex justify-between items-center font-semibold cursor-pointer mb-2">
        <span className="text-gray-700">COURSE LEVEL</span>
        <span>▾</span>
      </div>
      <ul className="ml-2 space-y-1 text-gray-700">
       {["All Level", "Beginner", "Intermediate", "Advanced"].map((level, i) => {
  const key = level.toLowerCase();
  return (
    <li key={i}>
      <label className="inline-flex items-center space-x-2">
       <input
          type="checkbox"
          value={level.toLowerCase()}
          checked={selectedLevels.includes(level.toLowerCase())}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedLevels((prev) =>
              e.target.checked ? [...prev, val] : prev.filter((l) => l !== val)
            );
          }}
        />
        <span>{level} ({levelCount[key] || 0})</span>
      </label>
    </li>
  );
})}

      </ul>
    </div>

    {/* PRICE */}
    <div>
      <div className="flex justify-between items-center font-semibold cursor-pointer mb-2">
        <span className="text-gray-700">PRICE</span>
        <span>▾</span>
      </div>
      <div className="space-y-2 ml-2">
        <div className="flex gap-2 text-xs">
  <input
    type="number"
    value={priceRange.min}
    onChange={(e) =>
      setPriceRange((prev) => ({ ...prev, min: e.target.value }))
    }
    className="border rounded px-2 py-1 w-20"
    placeholder="$ min"
  />
  <input
    type="number"
    value={priceRange.max}
    onChange={(e) =>
      setPriceRange((prev) => ({ ...prev, max: e.target.value }))
    }
    className="border rounded px-2 py-1 w-20"
    placeholder="$ max"
  />
</div>

        <div className="space-y-1">
          {/* <label className="inline-flex items-center space-x-2">
            <input type="checkbox" />
            <span>Paid</span>
          </label>
          <label className="inline-flex items-center space-x-2">
            <input type="checkbox" />
            <span>Free</span>
          </label> */}
        </div>
      </div>
    </div>

    {/* DURATION */}
    <div>
      <div className="flex justify-between items-center font-semibold cursor-pointer mb-2">
        <span className="text-gray-700">DURATION</span>
        <span>▾</span>
      </div>
      <ul className="ml-2 space-y-1 text-gray-700">
        {["6-12 Months", "3-6 Months", "1-3 Months", "1-4 Weeks", "1-7 Days"].map((dur, i) => (
          <li key={i}>
            <label className="inline-flex items-center space-x-2">
              <input
  type="checkbox"
  value={dur}
  checked={selectedDurations.includes(dur)}
  onChange={(e) => {
    const value = e.target.value;
    setSelectedDurations((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((d) => d !== value)
    );
  }}
/>

              <span>{dur} ({durationCount[dur] || 0})</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}




  {/* Course Grid */}
  <div className={`grid ${showFilter ? "grid-cols-3" : "grid-cols-4"} gap-6 flex-1`}>
   {paginatedCourses.map((course) => (
    <Link
  to={
    course.enrolled_student_ids.includes(user.id)
      ? `/student/watch-course/${course.id}`
      : `/course-details/${course.id}`
  }
  key={course.id}
>
 

  <div
    key={course.id}
    className=" overflow-hidden bg-white  shadow-sm hover:shadow-md transition duration-300"
  >
    {/* Course Image */}
    <img
      src={course.course_image}
      alt={course.title}
      className="w-full h-48 object-cover"
    />

    {/* Card Body */}
    <div className="p-4 flex flex-col justify-between h-40">
      {/* Category & Title */}
      <div>
        <div className="flex items-center justify-between">
        <span className="bg-blue-50 text-blue-600 text-[11px] font-semibold px-2 py-1 rounded uppercase tracking-wide">
          {course.category?.name || "Uncategorized"}
        </span>
        <span className="text-blue-600 font-semibold text-sm">
          ₹{Number(course.price).toLocaleString()}
        </span>
        </div>
        <h3 className="mt-2 text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
          {course.title}
        </h3>
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t mt-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            {course.average_rating ?? 0}
          </span>
          
        </div>
        <span className="flex items-center gap-1">
            <FaUser />
            {Number(course.enrolled_students_count).toLocaleString()} students
          </span>
      </div>
    </div>
  </div>
  </Link>
))}


  </div>
</div>


      {/* Pagination */}
      <div className="mt-10 flex justify-center items-center gap-2 text-sm">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 disabled:opacity-50"
        >
          ←
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-10 h-10 rounded-full ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-blue-50 text-blue-800"
            } flex items-center justify-center hover:bg-blue-100`}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default CourseGrid;
