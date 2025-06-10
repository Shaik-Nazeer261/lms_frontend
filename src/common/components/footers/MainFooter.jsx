import logo from "../../../icons/wlogo.svg"; // Replace with your logo

// Your social icons
import fb from "../../../icons/wfb.svg";
import linkedin from "../../../icons/linkdin.svg";
import twitter from "../../../icons/tweet.svg";
import instagram from "../../../icons/insta.svg";
import youtube from "../../../icons/yt.svg";

export default function MainFooter() {
    return (
      <>
      <footer className="bg-[#001744] text-white px-[23rem] py-12">
      <div className="grid grid-cols-2  ">

        {/* Logo & About */}
        <div className="space-y-4 ml-4">
          <img src={logo} alt="Logo" className="h-28" />
          
          <p className="text-[0.55rem] text-gray-300">
            Aliquam rhoncus ligula est, non pulvinar elit <br/>convallis nec. Donec mattis odio at.
          </p>

          <div className="flex gap-2 mt-4">
            <a href="#"><img src={fb} alt="Facebook" className="h-7 w-7 bg-[#1F2A4C] " /></a>
            <a href="#"><img src={instagram} alt="Instagram" className="h-7 w-7 bg-[#1F2A4C] " /></a>
            <a href="#"><img src={linkedin} alt="LinkedIn" className="h-7 w-7 " /></a>
            <a href="#"><img src={twitter} alt="Twitter" className="h-7 w-7 bg-[#1F2A4C] " /></a>
            <a href="#"><img src={youtube} alt="YouTube" className="h-7 w-7 bg-[#1F2A4C] " /></a>
          </div>
        </div>

        {/* Top 4 Category */}

       <div className=" grid grid-cols-3 gap-8  ">
       <div>
          <h3 className="text-[0.70rem] font-semibold mb-4 uppercase">Top 4 Category</h3>
          <ul className="space-y-2 text-[0.60rem] text-gray-300">
            <li>Development</li>
            <li>Finance & Accounting</li>
            <li>Design</li>
            <li>Business</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-[0.70rem] font-semibold mb-4 uppercase">Quick Links</h3>
          <ul className="space-y-2 text-[0.60rem] text-gray-300">
            <li>About</li>
            <li className="flex justify-between items-center border-b border-gray-300 w-fit pb-1">
              Become Instructor <span className="ml-1">→</span>
            </li>
            <li>Contact</li>
            <li><a href='/career'>Career</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-[0.70rem] font-semibold mb-4 uppercase">Support</h3>
          <ul className="space-y-2 text-[0.60rem] text-gray-300">
            <li>Help Center</li>
            <li>FAQs</li>
            <li>Terms & Condition</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
       </div>
      </div>

      
    </footer>
    {/* Bottom Line */}
    <div className=" border-t border-gray-700 py-4 text-center text-[0.55rem]  bg-[#001744] text-gray-100 ">
    Designed by <a href="#" className="text-white hover:underline text-bold text-[0.80rem]">gadigitalsolutions</a>. All rights reserved
  </div>
  </>
    );
  }
  