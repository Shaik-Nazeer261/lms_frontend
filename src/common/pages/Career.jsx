import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import career from "../images/career.png";
import Union from "../images/Union.png";
import CheckCircle from "../../icons/CheckCircle.svg";
import food from "../../icons/food.svg";
import growth from "../../icons/growth.svg";
import sofa from "../../icons/sofa.svg";
import gift from "../../icons/gift.svg";
import salary from "../../icons/salary.svg";
import member from "../../icons/member.svg";
import cup from "../../icons/cup.svg";
import spoons from "../../icons/spoons.svg";
import Gallery1 from "../images/Gallery1.png";
import netflix from "../../icons/netflix.svg";
import youtube from "../../icons/youtube.svg";
import googlec from "../../icons/googlec.svg";
import lenovo from "../../icons/lenovo.svg";
import slack from "../../icons/slack.svg";
import verizon from "../../icons/verizon.svg";
import lexmmark from "../../icons/lexmark.svg";
import micro from "../../icons/micro.svg";
import api from "../../api";
import { ArrowRight, MapPin, Briefcase, Calendar } from "lucide-react";

const logos = [
  { name: "Netflix", src: netflix },
  { name: "YouTube", src: youtube },
  { name: "Google", src: googlec },
  { name: "Lenovo", src: lenovo },
  { name: "Slack", src: slack },
  { name: "Verizon", src: verizon },
  { name: "Lexmark", src: lexmmark },
  { name: "Microsoft", src: micro },
];

const perks = [
  {
    title: "Healthy Food & Snacks",
    icon: <img src={food} alt="Food Icon" />,
    bg: "bg-blue-50",
  },
  {
    title: "Personal Career Growth",
    icon: <img src={growth} alt="Career Growth Icon" />,
    bg: "bg-indigo-100",
  },
  {
    title: "Vacation & Paid Time Off",
    icon: <img src={sofa} alt="Sofa Icon" />,
    bg: "bg-green-100",
  },
  {
    title: "Special Allowance & Bonuse",
    icon: <img src={gift} alt="Gift Icon" />,
    bg: "bg-orange-100",
  },
  {
    title: "Competitive Salary",
    icon: <img src={salary} alt="Salary Icon" />,
    bg: "bg-green-100",
  },
  {
    title: "Well-being memberships",
    icon: <img src={member} alt="Membership Icon" />,
    bg: "bg-blue-50",
  },
  {
    title: "Maternity/Paternity Benefits",
    icon: <img src={cup} alt="Cup Icon" />,
    bg: "bg-blue-50",
  },
  {
    title: "LMS Annual Events",
    icon: <img src={spoons} alt="Spoons Icon" />,
    bg: "bg-indigo-100",
  },
];

const jobList = [
  {
    title: "Product Designer (UI/UX Designer)",
    location: "Hyderabad",
    type: "Full-Time",
    vacancies: "01 Vacancy",
    deadline: "30 June, 2025",
  },
  {
    title: "Social Media Manager",
    location: "Hyderabad",
    type: "Full-Time",
    vacancies: "01 Vacancy",
    deadline: "30 June, 2025",
  },
  {
    title: "Director of Accounting",
    location: "Hyderabad",
    type: "Full-Time",
    vacancies: "03 Vacancy",
    deadline: "30 June, 2025",
  },
  {
    title: "Principal Software Engineer",
    location: "Hyderabad",
    type: "Full-Time",
    vacancies: "01 Vacancy",
    deadline: "30 June, 2025",
  },
];

const Career = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  // Here I need write the function that fetches the all jobs and functionality in this component

  const fetchData = async () => {
    try {
      console.log("running fetch function ");

      const res = await api.get("/api/jobs/");

      console.log("Fetched jobs:", res.data);
      setJobs(res.data);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    }
  };

  return (
    <>
      <div className=" text-center">
        <h1 className="text-xl font-semibold text-[#00113D]">Career</h1>
        <div className="mt-2 text-xs text-gray-500">
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          / <span>Career</span>
        </div>
      </div>

      <div className="max-w-6xl  mx-auto flex flex-col-reverse lg:flex-row  justify-between">
        {/* Text Content */}
        <div className="w-1/2 text-left my-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#00113D] mb-4">
            Join the most incredible <br /> & creative team.
          </h2>
          <p className="text-gray-500 text-base mb-6">
            Proin gravida enim augue, dapibus ultrices eros feugiat et. <br />
            Pellentesque bibendum orci felis, sit amet efficitur felis lacinia
            ac. <br />
            Mauris gravida justo ac nunc consectetur.
          </p>
          <button className="bg-[#58A6FD] hover:bg-blue-600 text-white px-6 py-3 rounded font-medium shadow-md transition">
            View Open Positions
          </button>
        </div>

        {/* Image */}
        <div className="w-1/2 mb-8 ">
          <img src={career} alt="Join Team" className="" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex   gap-10  mt-8">
        {/* Team Images */}
        <div className=" w-1/2 lg:w-1/2">
          <img src={Union} alt="Team member 1" className="w-[30rem] " />
        </div>

        {/* Text + Features */}
        <div className="max-w-[28rem] lg:w-1/2 text-left ">
          <h2 className="text-2xl md:text-2xl font-bold text-[#00113D] mb-4">
            Why you will join our team
          </h2>
          <p className="text-gray-600 mb-8">
            Quisque leo leo, suscipit sed arcu sit amet, iaculis feugiat felis.
            Vestibulum non consectetur tortor. Morbi at orci vehicula, vehicula
            mi ut, vestibulum odio.
          </p>

          {/* Feature Cards */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 bg-white p-5  shadow-md">
              <img src={CheckCircle} alt="circle mt-1" />
              <div>
                <h4 className="text-xs font-semibold text-[#00113D]">
                  Ut justo ligula, vehicula sed egestas vel.
                </h4>
                <p className="text-xs text-gray-600">
                  Quisque leo leo, suscipit sed arcu sit amet, iaculis feugiat
                  felis. Vestibulum non consectetur tortor. Morbi at orci
                  vehicula, vehicula mi ut.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-5 rounded-lg shadow-md">
              <img src={CheckCircle} alt="circle mt-1" />
              <div>
                <h4 className="text-xs font-semibold text-[#00113D]">
                  Aenean vitae leo leo praesent ullamcorper ac.
                </h4>
                <p className="text-xs text-gray-600">
                  Aenean vitae leo leo. Praesent ullamcorper ac libero et
                  mattis. Aenean vel erat at neque viverra feugiat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#00113D] mb-12 text-center">
          Our Perks & Benefits
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {perks.map((perk, idx) => (
            <div
              key={idx}
              className={`${perk.bg} rounded-md p-4   justify-center shadow-sm w-[14rem] `}
            >
              <div className=" mb-4 w-10 ">{perk.icon}</div>
              <p className="text-sm font-medium text-[#00113D] ">
                {perk.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 my-20">
        {/* Left Text Section */}

        <div className="lg:w-1/2">
          <p className="text-xs text-blue-500 font-medium uppercase mb-2">
            Our Gallery
          </p>
          <h2 className="text-2xl md:text-2xl font-bold text-[#00113D] mb-4">
            We’ve been here <br /> almost 2 years
          </h2>
          <p className="text-gray-600 text-xs leading-relaxed max-w-xs">
            Fusce lobortis leo augue, sit amet tristique nisi commodo in.
            Aliquam ac libero quis tellus venenatis imperdiet. Sed sed nunc
            libero. Curabitur in urna ligula. Torquent per conubia nostra.
          </p>
        </div>

        {/* Right Image Collage */}

        <div className="lg:w-3/4">
          <img
            src={Gallery1}
            alt="Office and team collage"
            className=" w-full h-auto object-cover"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex gap-20 ">
        {/* Text Section */}

        <div className="max-w-md my-auto">
          <h2 className="text-xl font-bold text-[#00113D] mb-3">
            We Just keep growing <br /> with 6.3k Companies
          </h2>
          <p className="text-gray-500 text-sm">
            Nullam egestas tellus at enim ornare tristique. <br />
            Class aptent taciti sociosqu ad litora torquent
          </p>
        </div>

        {/* Company Logos */}

        <div className="grid grid-cols-2 sm:grid-cols-4 max-w-[45rem] ">
          {logos.map((logo) => (
            <div key={logo.name} className="bg-white   flex ">
              <img src={logo.src} alt={logo.name} className="h-28 " />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto text-center my-10 ">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#00113D] mb-12">
          Our all open positions (04)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {jobs?.map((job, index) => (
            <div
              key={index}
              className="bg-white shadow-sm rounded-md overflow-hidden text-left"
              onClick={() => navigate(`/career/${job.id}`)}
            >
              <div className="p-5">
                <h3 className="font-semibold text-[#00113D] text-sm md:text-base mb-3">
                  {job.job_title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4 text-green-500" />
                    {job.job_type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    {job.vacancies} Vacancies
                  </span>
                </div>
              </div>

              <div className="border-t px-5 py-3 flex items-center justify-between bg-blue-50">
                <span className="text-xs text-red-500 font-medium">
                  Deadline: {job.last_date_to_apply}
                </span>
                <button className="p-1 bg-white rounded shadow hover:bg-gray-100 transition">
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Career;
