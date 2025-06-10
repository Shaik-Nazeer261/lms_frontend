import { Link } from 'react-router-dom'
import image from '../images/Image.png'
import users from '../../icons/Users.svg';
import notebook from '../../icons/Notebook.svg';
import GlobeHemisphereWest from '../../icons/GlobeHemisphereWest.svg';
import CircleWavyCheck from '../../icons/CircleWavyCheck.svg';
import Stack from '../../icons/Stack.svg';
import CheckCircle from '../../icons/CheckCircle.svg'
import blank from '../images/blank.png'
import newspaper from '../../icons/NewspaperClipping.svg'
import identity from '../../icons/IdentificationCard.svg'
import playcircle from '../../icons/PlayCircle.svg'
import handshake from '../../icons/Handshake.svg'
import english from '../images/english.png'
import { FaEnvelope, FaQuoteLeft } from 'react-icons/fa';
import arrow from '../../icons/BlueArrow.svg'
import help from '../images/help.png'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import images from '../images/Images.png'
import teacher from '../images/teacher.png'
import quotes from '../../icons/Quotes.svg'



const features = [
  {
    title: 'Tech your students as you want.',
    description:
      'Morbi quis lorem non orci fermentum euismod. Nam sapien tellus, aliquam nec porttitor vel, pellentesque at metus.',
  },
  {
    title: 'Manage your course, payment in one place',
    description:
      'Sed et mattis urna. Sed tempus fermentum est, eu lobortis nibh consequat eu. Nullam vel libero pharetra, euismod turpis et, elementum enim.',
  },
  {
    title: 'Chat with your students',
    description:
      'Nullam mattis lectus ac diam egestas posuere. Praesent auctor massa orci, ut fermentum eros dictum id.',
  },
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

const steps = [
  {
    id: 1,
    icon: <img src={newspaper} />,
    bg: 'bg-[#564FFD1A]',
    title: 'Apply to become instructor.',
    description:
      'Sed et mattis urna. Sed tempus fermentum est, eu lobortis nibh consequat eu.',
  },
  {
    id: 2,
    icon: <img src={identity}/>,
    bg: 'bg-[#FFF0F0]',
    title: 'Setup & edit your profile.',
    description:
      'Duis non ipsum at leo efficitur pulvinar. Morbi semper nisi eget accumsan ullamcorper.',
  },
  {
    id: 3,
    icon: <img src={playcircle} />,
    bg: 'bg-[#F1F8FF]',
    title: 'Create your new course',
    description:
      'Praesent congue ornare nibh sed ullamcorper. Proin venenatis tellus non turpis scelerisque.',
  },
  {
    id: 4,
    icon: <img src={handshake} />,
    bg: 'bg-[#E1F7E3]',
    title: 'Start teaching & earning',
    description:
      'Praesent congue ornare nibh sed ullamcorper. Proin venenatis tellus non turpis scelerisque.',
  },
];

const supportPoints = [
  "Sed nec dapibus orci integer nisl turpis, eleifend sit amet aliquam vel.",
  "Those who are looking to reboot their work life and try a new profession that.",
  "Nunc auctor consequat lorem, in posuere enim hendrerit sed.",
  "Duis ornare enim ullamcorper congue.",
];
 

const BecomeInstructor = () => {
  return (
    <>
    <div className="bg-[#F8FAFC] py-5 text-center">
      <h1 className="text-xl font-semibold text-[#00113D]">Become an Instructor</h1>
      <div className="mt-2 text-xs text-gray-500">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[#00113D]">Become an instructor</span>
      </div>
    </div>
    <div className="bg-white items-center px-6 flex    mx-auto max-w-6xl">
      {/* Text Section */}
      <div className="w-1/2 text-left ">
        <h2 className="text-4xl  font-semibold text-[#00113D] mb-4">
          Become an Instructor
        </h2>
        <p className="text-gray-600 text-lg mb-6 max-w-[29rem]">
          Become an instructor & start teaching with 26k certified instructors. Create a success story with 67.1k Students — Grow yourself with 71 countries.
        </p>
        <button className="bg-[#58A6FD] hover:bg-blue-600 text-white font-medium py-2 px-6  shadow">
          Get Started
        </button>
      </div>

      {/* Image Section */}
      <div className="w-1/2 flex justify-center">
        <img src={image} alt="Excited Instructor" className="max-w-xs md:max-w-md drop-shadow-xl" />
      </div>
    </div>

    <div className="flex  justify-between  max-w-6xl mx-auto  py-8 bg-[#F1F8FF] px-7">
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

    <section className="flex bg-white max-w-6xl px-6 my-5 items-center mx-auto">
        <div class='w-1/2'>
            <img src={blank} className='w-[27rem] h-[24rem]'/>
        </div>
      <div className="w-1/2 mx-auto px-20 py-2">
        <h2 className="text-2xl  font-semibold text-[#00113D] mb-4">
          Why you’ll start teaching on GA LMS
        </h2>
        <p className="text-gray-600 text-sm mb-8">
          Praesent congue ornare nibh sed ullamcorper. Proin venenatis tellus non turpis scelerisque, vitae auctor arcu ornare. Cras vitae nulla a purus mollis venenatis.
        </p>

        <div className="space-y-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <img src={CheckCircle}/>
              <div>
                <h3 className=" text-xs font-bold text-[#00113D]">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-[#F8FAFC] py-16 px-6 items-center mx-auto text-center max-w-6xl">
      <h2 className="text-3xl md:text-3xl font-semibold text-[#00113D] mb-12">
        How you'll become<br />successful instructor
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-white p-6 rounded-md shadow-sm hover:shadow-md transition text-sm"
          >
            <div className={`w-16 h-16 mx-auto flex items-center justify-center rounded mb-4 ${step.bg}`}>
              {step.icon}
            </div>
            <h3 className="font-semibold text-[#00113D] mb-2 whitespace-nowrap">
              {step.id}. {step.title}
            </h3>
            <p className=" text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-white px-6  py-10 items-center mx-auto max-w-6xl">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between   mx-auto">
        {/* Text Section */}
        <div className="w-[27rem]">
          <h2 className="text-3xl md:text-3xl font-semibold text-[#00113D] mb-4">
            Instructor rules &<br />regulations
          </h2>
          <p className="text-gray-500 mb-6 text-sm ">
            Sed auctor, nisl non elementum ornare, turpis orci consequat arcu, at iaculis quam leo nec libero. Aenean mollis turpis velit, id laoreet sem luctus in. Etiam et egestas lorem.
          </p>
          <ul className="list-disc list-inside text-[#00113D] space-y-2 text-sm ">
            <li>Sed ullamcorper libero quis condimentum pellentesque.</li>
            <li>Nam leo tortor, tempus et felis non.</li>
            <li>Porttitor faucibus erat. Integer eget purus non massa ultricies pretium ac sed eros.</li>
            <li>Vestibulum ultrices commodo tellus. Etiam eu lectus sit amet turpis.</li>
          </ul>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2">
          <img
            src={english}
            alt="Instructor rules"
            className="rounded-md w-full max-w-md "
          />
        </div>
      </div>
    </section>

     
      <div className="flex flex-col md:flex-row items-center  gap-10 max-w-6xl mx-auto py-10">
        {/* Image */}
        <div className="md:w-1/2">
          <img
            src={help}
            alt="Support"
            className="w-full max-w-md rounded-md "
          />
        </div>

        {/* Content */}
        <div className="md:w-[27rem] text-left">
          <h2 className="text-3xl md:text-3xl font-semibold text-[#00113D] mb-4">
            Don’t worry we’re always<br />here to help you
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Mauris aliquet ornare tortor, ut mollis arcu luctus quis. Phasellus nec augue malesuada, sagittis ligula vel, faucibus metus. Nam viverra metus eget nunc dignissim.
          </p>

          <ul className="space-y-3 mb-6 text-xs">
            {supportPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3 text-[#00113D] ">
                <img src={arrow} className=''/>
                {point}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 bg-white p-4 rounded-md shadow-sm w-fit mx-auto md:mx-0">
            <div className=" p-2 rounded-full">
              <FaEnvelope className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase">Email us, anytime anywhere</p>
              <p className="text-blue-600 font-medium text-xs">help.galms@gamil.com</p>
            </div>
          </div>
        </div>
      </div>
   
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mx-auto max-w-6xl py-10">
        {/* Left Column */}
        <div className="lg:w-[22rem]     ">
          <h2 className="text-3xl md:text-3xl font-semibold mb-4 leading-snug">
            20k+ Instructor created<br />their success story with<br />eduguard
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            Nunc euismod sapien non felis eleifend porttitor. Maecenas dictum eros justo, id commodo ante laoreet nec. Phasellus aliquet, orci id pellentesque mollis.
          </p>

          {/* Quote Box */}
          <div className="bg-[#F1F8FF] text-black p-6 rounded-md shadow-sm mb-6">
            <img src={quotes} className='w-9'/>
            <p className="text-sm leading-relaxed">
              Nulla sed malesuada augue. Morbi interdum vulputate imperdiet. Pellentesque ullamcorper auctor ante, egestas interdum quam facilisis commodo. Phasellus efficitur quis ex in consectetur. Mauris tristique suscipit metus, a molestie dui dapibus vel.
            </p>
          </div>

          {/* Arrows */}
          <div className="flex gap-3">
            <button className="bg-white text-black p-2 rounded hover:bg-gray-200">
              <FiArrowLeft />
            </button>
            <button className="bg-[#58A6FD] text-white p-2  hover:bg-blue-700">
              <FiArrowRight />
            </button>
          </div>
        </div>

        {/* Right Column - Collage Image */}
        <div className=" w-1/2 flex justify-center">
          <img
            src={images}
            alt="Instructor Success Stories"
            className=" w-full max-w-2xl"
          />
        </div>
      </div>

    <section className="bg-[#001744] text-white px-6 md:px-20 py-16 border-b border-gray-700 ">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between ">
        {/* Left content */}
        <div className="md:w-[21rem] text-center md:text-left">
          <h2 className="text-3xl md:text-3xl font-semibold leading-snug mb-4">
            Start teaching with us<br />and inspire others
          </h2>
          <p className="text-gray-300 mb-6 text-sm">
            Become an instructor & start teaching with 26k certified instructors.
            Create a success story with 67.1k Students — Grow yourself with 71 countries.
          </p>
          <button className="bg-[#58A6FD] hover:bg-blue-600 text-white font-semibold py-2 px-6  shadow">
            Register Now
          </button>
        </div>

        {/* Right Image (split image) */}
        <div className="md:w-1/2 flex ">
          <img
            src={teacher}
            alt="Instructor split visual"
            className="w-[30rem] rounded"
          />
        </div>
      </div>
    </section>

    </>
  )
}

export default BecomeInstructor