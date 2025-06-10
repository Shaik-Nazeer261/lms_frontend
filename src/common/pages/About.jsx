import { Link } from 'react-router-dom'
import teamImage from '../images/team.png'
import netflix from '../../icons/netflix.svg';
import youtube from '../../icons/youtube.svg';
import googlec from '../../icons/googlec.svg';
import lenovo from '../../icons/lenovo.svg';
import slack from '../../icons/slack.svg';
import verizon from '../../icons/verizon.svg';
import lexmmark from '../../icons/lexmark.svg';
import micro from '../../icons/micro.svg';
import users from '../../icons/Users.svg';
import notebook from '../../icons/Notebook.svg';
import GlobeHemisphereWest from '../../icons/GlobeHemisphereWest.svg';
import CircleWavyCheck from '../../icons/CircleWavyCheck.svg';
import Stack from '../../icons/Stack.svg';
import twoBusinessPartners from '../images/two-business-partners.png';
import Gallery from '../images/Gallery.png';
import upquote from '../../icons/upquote.svg';
import downquote from '../../icons/downquote.svg';



const logos = [
  { name: "Netflix", src:netflix },
  { name: "YouTube", src:youtube  },
  { name: "Google", src: googlec },
  { name: "Lenovo", src: lenovo },
  { name: "Slack", src: slack },
  { name: "Verizon", src: verizon },
  { name: "Lexmark", src: lexmmark },
  { name: "Microsoft", src: micro }
];

const stats = [
  {
    label: 'Students',
    value: '67.1k',
    icon: users
  },
  {
    label: 'Certified Instructor',
    value: '26k',
    icon: notebook
  },
  {
    label: 'Country Language',
    value: '72',
    icon: GlobeHemisphereWest
  },
  {
    label: 'Success Rate',
    value: '99.9%',
    icon: CircleWavyCheck
  },
  {
    label: 'Trusted Companies',
    value: '57',
    icon: Stack
  }
];

const testimonials = [
  {
    quote: "LMS fit us like a glove. Their team curates fresh, up-to-date courses from their marketplace and makes them available to customers.",
    name: "Sundar Pichai",
    title: "Chief Chairman of",
    company: "Google"
  },
  {
    quote: "LMS responds to the needs of the business in an agile and global manner. It’s truly the best solution for our employees and their careers.",
    name: "Satya Nadella",
    title: "CEO of",
    company: "Microsoft"
  },
  {
    quote: "In total, it was a big success, I would get emails about what a fantastic resource it was.",
    name: "Ted Sarandos",
    title: "Chief Executive Officer of",
    company: "Netflix"
  }
];

const About = () => {
  return (
    <>
    
     <div className=" text-center">
      <h1 className="text-xl font-semibold text-[#00113D]">About</h1>
      <div className="mt-2 text-xs text-gray-500">
        <Link to="/" className="hover:underline">Home</Link> / <span>About</span>
      </div>

       


    </div>
     <div className="flex flex-col lg:flex-row items-center justify-between max-w-5xl mx-auto px-5 py-12">
      {/* Text Content */}
      <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
        <h2 className="text-5xl font-bold text-[#E9EAF0] mb-2">2019–2025</h2>
        <h3 className="text-3xl max-w-xs font-semibold text-[#00113D] mb-4 ">
          Empowering Minds. Transforming Futures.
        </h3>
        <p className="text-gray-500 text-base max-w-sm leading-relaxed">
          At The Learning Hub, we believe that education is the foundation of progress — and that learning should be accessible, flexible, and empowering for everyone, everywhere.
Born out of a passion to bridge the gap between knowledge seekers and knowledge sharers, The Learning Hub is more than just an e-learning platform. We are a global learning ecosystem where curious minds meet skilled instructors, and career goals become realities.

        </p>
      </div>

      {/* Image */}
      <div className="lg:w-1/2 max-w-md lg:max-w-none">
        <img
          src={teamImage}
          alt="Team"
          className="rounded shadow-md object-cover w-full h-full"
        />
      </div>
    </div>
    
    <section className=" px-5 bg-white max-w-5xl mx-auto mt-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row  justify-between ">
        {/* Text Section */}
        <div className="max-w-md my-auto">
          <h2 className="text-xl font-bold text-[#00113D] mb-3">
            We Just keep growing <br /> with 6.3k Companies
          </h2>
          <p className="text-gray-500 text-sm">
            To become a leading global platform where anyone can teach, learn, and transform their life — one course at a time.
          </p>
        </div>

        {/* Company Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 max-w-[40rem] ">
          {logos.map((logo) => (
            <div key={logo.name} className="bg-white   flex ">
              <img src={logo.src} alt={logo.name} className="h-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
     <div className="flex flex-wrap justify-center sm:justify-between items-center gap-6 max-w-6xl mx-auto  py-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="flex items-center space-x-2 text-[#00113D]">
            <img src={stat.icon} alt={stat.label} className="h-8 w-8" />
            {/* <div className="text-[#00113D] text-2xl">{stat.icon}</div> */}
          <div className="text-left">
            <p className="text-lg font-semibold leading-tight">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>

    </section>
    

    <section className="bg-[#f3f8fe] py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        {/* Image Section */}
        <div className="lg:w-1/2">
          <img
            src={twoBusinessPartners}
            alt="Team Mission"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Text Section */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <p className=" text-blue-500 font-semibold text-xs ">
            Our One Billion Mission
          </p>
          <h2 className=" sm:text-2xl font-semibold text-[#00113D] mb-4 ">
            Our one billion mission <br className="hidden sm:block" />
            sounds bold, We agree.
          </h2>
          <p className="text-gray-600 text-sm max-w-lg">
            To make high-quality education affordable, accessible, and actionable, empowering learners and educators to grow together through innovation and collaboration.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-[#f9fbfc] py-20 px-5 max-w-5xl mx-auto">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        
        {/* Left: Text Section */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <p className=" text-blue-500 font-semibold text-xs ">Our Gallery</p>
          <h2 className=" sm:text-2xl font-semibold text-[#00113D] mb-4 ">
            Join the Movement
          </h2>
          <p className="text-gray-600 text-sm max-w-[19rem] mb-4">
            Whether you’re here to teach the next generation, upgrade your skills, or follow a passion, The Learning Hub is where your journey begins.
          </p>
          <button className="bg-blue-500 text-white px-5 py-2 text-xs  font-medium hover:bg-blue-600 transition">
            Join Our Team →
          </button>
        </div>

        {/* Right: Collage Image */}
        <div className="lg:w-3/4 w-full">
          <img
            src={Gallery}
            alt="Gallery Collage"
            className="rounded-lg shadow-md w-full object-cover"
          />
        </div>
      </div>
    </section>

    <section className="bg-white py-16 px-6 max-w-5xl mx-auto">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 text-center">
        {testimonials.map((testimonial, idx) => (
          <div
            key={idx}
            className="bg-[#f5f8fc] p-6 rounded-md relative max-w-xs "
          >
            <img src={upquote} alt="Quote" className="absolute -top-1 w-5" />
            <p className="text-[#00113D] text-sm font-medium leading-relaxed mb-6">
              {testimonial.quote}
            </p>
            <img src={downquote} alt="Quote" className="absolute bottom-18 right-4 w-5 " />
            <div className=" text-sm mt-10">
              <p className="font-semibold text-[#00113D]">{testimonial.name}</p>
              <p className="text-gray-500">
                {testimonial.title} <span className="text-[#00113D]">{testimonial.company}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
    </>
  )
}

export default About