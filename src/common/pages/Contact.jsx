import React from 'react'
import { Link } from 'react-router-dom'
import fit from '../images/fit.png'
import Envelope from '../../icons/Envelope.svg'
import PaperPlaneRight from '../../icons/PaperPlaneRight.svg'
import map from '../images/map.png'

const Contact = () => {
    const handleCopyEmail = () => {
    navigator.clipboard.writeText("support@lms.com");
    alert("Email copied to clipboard!");
  };
  return (
    <>
    <div className=" text-center">
      <h1 className="text-xl font-semibold text-[#00113D]">Contact</h1>
      <div className="mt-2 text-xs text-gray-500">
        <Link to="/" className="hover:underline">Home</Link> / <span>Contact</span>
      </div>
    </div>

    <section className="bg-white py-11 max-w-5xl mx-auto">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
        
        {/* Text Section */}
        <div className="lg:w-1/2 lg:text-left">
          <h2 className="text-4xl font-bold text-[#00113D] mb-4">
            Connect with us
          </h2>
          <p className="text-gray-600 text-base max-w-xs mb-6">
            Want to chat? We’d love to hear from you! Get in touch with our Customer Success Team to inquire about speaking events, advertising rates, or just say hello.
          </p>
          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-3 rounded"
          >
            <img src={Envelope} alt="Email Icon" className="h-4 w-4" />
            Copy Email
          </button>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2 flex justify-center">
          <img
            src={fit}
            alt="Support Team"
            className="max-w-md w-full object-contain"
          />
        </div>
      </div>
    </section>

    <section className="bg-[#F9FAFB] py-9 max-w-6xl mx-auto">
    <h1 className="text-2xl font-semibold text-[#00113D] text-center ">Contact Us</h1>

      <div className="flex flex-col lg:flex-row items-start  mx-auto gap-15">
      {/* Left: Contact Info */}
      <div className=" w-full lg:max-w-[30rem]  px-10 py-14 space-y-10">
        
      <h2 className="">
        Will you be in Hyderabad or any other branches any time soon? Stop by the office!
        We'd love to meet.
      </h2>

      {/* Address Section */}
      <div className='grid grid-cols-1\2 text-xs '>
        <h4 className="  mb-1 uppercase text-[#58A6FD]">Address</h4>
        <p className="">
          LN's Sri–Nivas Naik's Estates, 403, Road no:1,
          behind Axis Bank, Motilal Nehru Nagar,
          Begumpet, Hyderabad, Telangana 500016
        </p>
      </div>

    

      {/* Phone Number Section */}
      <div className='grid grid-cols-2 text-xs'>
        <h4 className=" mb-1 uppercase text-[#58A6FD]">Phone Number</h4>
        <div className=''>
        <p className="">09989042335</p>
        <p className="">09989042335</p>
        </div>
      </div>

      

      {/* Email Section */}
      <div className='grid grid-cols-2 text-xs'>
        <h4 className=" mb-1 uppercase text-[#58A6FD]">Email Address</h4>
        <div>
        <p className="">help.galms@gmail.com</p>
        <p className="">career.galms@gamil.com</p>
        </div>
      </div>
    
      </div>

      {/* Right: Contact Form */}
      <div className="w-full lg:w-1/2 px-10 py-14 bg-white">
        <h2 className="  text-[#00113D] mb-2">Get In touch</h2>
        <p className="text-gray-500 mb-8 text-xs">
          Feel free contact with us, we love to make new partners & friends
        </p>

        <form className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="First name..."
              className="flex-1 border border-gray-300 px-4 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Last name..."
              className="flex-1 border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-gray-300 px-4 py-2 "
          />

          <input
            type="text"
            placeholder="Message Subject"
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />

          <textarea
            placeholder="Message"
            rows={3}
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />

          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded"
          >
            
             Send Message
             <img src={PaperPlaneRight} alt="Send Icon" className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>


    </section>
    <section className="w-full mt-5">
  <img src={map} alt="Map" className="w-full object-cover" />
</section>


    </>
  )
}

export default Contact