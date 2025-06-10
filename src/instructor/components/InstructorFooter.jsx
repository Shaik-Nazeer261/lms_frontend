import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-4 bg-white  text-sm text-gray-500">
      <div className="text-center md:text-left mb-2 md:mb-0">
        © 2025 – GA LMS, Designed by{' '}
        <a href="https://gadjitsolutions.com" className="text-[#00113D] font-medium hover:underline">
          gadjitsolutions.
        </a>{' '}
        All rights reserved
      </div>
      <div className="flex gap-4">
        <Link to="/faqs" className="hover:underline">
          FAQs
        </Link>
        <Link to="/privacy-policy" className="hover:underline">
          Privacy Policy
        </Link>
        <Link to="/terms" className="hover:underline">
          Terms & Condition
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
