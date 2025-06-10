import React from 'react'
import Profile from '../pages/Profile';
import enrolled from '../../icons/enrolled.svg';
import instructors from '../../icons/instructors.svg';
import active from '../../icons/active.svg';
import complete from '../../icons/complete.svg';
import Buttonleft from '../../icons/Buttonleft.svg';
import Buttonright from '../../icons/Buttonright.svg';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import api from '../../api'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';


const Profiledb = () => {
  const sliderRef = useRef(null); // ref to scrollable container
  const [summary, setSummary] = useState({
    total_enrolled_courses: 0,
    active_courses: 0,
    completed_courses: 0,
    unique_instructors: 0
  });
const [courses, setCourses] = useState([]);
  const navigate = useNavigate();


 useEffect(() => {
  const fetchSummary = async () => {
    try {
      const res = await api.get('/api/student/course-summary/');
      setSummary(res.data);
    } catch (error) {
      console.error("Failed to load course summary", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get('/api/student/enrolled-courses/');
      setCourses(res.data.slice(0, 5)); // show 5 in slider
    } catch (error) {
      console.error("Failed to load enrolled courses", error);
    }
  };

  fetchSummary();
  fetchCourses();
}, []);


  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };
  return (
    <div className='bg-white shadow-sm '>
       <div className="mt-6 flex gap-6 text-sm justify-between">
  <div className="bg-[#F1F8FF] py-4 flex rounded w-56">
    <img src={enrolled} alt="Enrolled Courses" className="w-8 h-8 mb-2 my-auto mx-3" />
    <div>
      <p className="text-xl text-[#00113D]">{summary.total_enrolled_courses}</p>
      <p className="text-gray-500 mt-1">Enrolled Courses</p>
    </div>
  </div>
  <div className="bg-[#EBEBFF] py-4 flex rounded w-56">
    <img src={active} alt="Active Courses" className="w-8 h-8 mb-2 my-auto mx-3" />
    <div>
      <p className="text-xl text-[#00113D]">{summary.active_courses}</p>
      <p className="text-gray-500 mt-1">Active Courses</p>
    </div>
  </div>
  <div className="bg-[#E1F7E3] py-4 flex rounded w-56">
    <img src={complete} alt="Completed Courses" className="w-8 h-8 mb-2 my-auto mx-3" />
    <div>
      <p className="text-xl text-[#00113D]">{summary.completed_courses}</p>
      <p className="text-gray-500 mt-1">Completed Courses</p>
    </div>
  </div>
  <div className="bg-[#FFF2E5] py-4 flex rounded w-56">
    <img src={instructors} alt="Instructors" className="w-8 h-8 mb-2 my-auto mx-3" />
    <div>
      <p className="text-xl text-[#00113D]">{summary.unique_instructors}</p>
      <p className="text-gray-500 mt-1">Course Instructors</p>
    </div>
  </div>
</div>


      {/* Course Slider Section */}
      <div className="flex justify-between">
        <span className="text-lg font-bold text-[#00113D] mt-10 mb-4">Let’s start learning, Arjun</span>
         {/* Navigation buttons (optional) */}
        <div className="flex my-auto justify-center gap-1 ml-4">
  <button onClick={scrollLeft}>
    <img src={Buttonleft} alt="Previous" className="w-9 h-9 bg-white cursor-pointer" />
  </button>
  <button onClick={scrollRight}>
    <img src={Buttonright} alt="Next" className="w-9 h-9 bg-white cursor-pointer" />
  </button>
</div>

      </div>
      <div  ref={sliderRef} className="flex gap-6 overflow-x-auto hide-scrollbar">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white w-[16.8rem] shadow  overflow-hidden flex-shrink-0"
          >
            <img src={`${import.meta.env.VITE_BACKEND_URL}${course.image}`} alt={course.title} className="w-full h-36 object-cover" />


            <div className="p-4">
              <h4 className="text-sm font-semibold leading-tight mb-1">{course.title}</h4>
              <p className="text-xs text-gray-600 mb-3">{course.lecture}</p>
              <div className="flex justify-between items-center">
                <button
  onClick={() => navigate(`/student/watch-course/${course.id}`)}
  className="text-blue-600 bg-blue-100 text-xs font-medium px-3 py-1 rounded hover:bg-blue-200"
>
  Watch Lecture
</button>
                <span className="text-green-500 text-xs font-semibold">{course.progress} Finish</span>
              </div>
            </div>
          </div>
        ))}
       
      </div>
    </div>
  )
}

export default Profiledb