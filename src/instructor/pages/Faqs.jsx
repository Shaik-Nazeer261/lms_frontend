"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const Faqs = () => {

  const [activeTab, setActiveTab] = useState("tab1")
  const [activeAccordion, setActiveAccordion] = useState("accordion4")

  // Tabs data with different questions for each tab
  const tabsData = {
   tab1: {
  name: "About The Learning Hub",
  faqs: [
    {
      id: "tab9-faq1",
      question: "What is The Learning Hub?",
      answer: "The Learning Hub is an online learning platform that connects learners and instructors through high-quality, self-paced courses across a wide range of subjects.",
    },
    {
      id: "tab9-faq2",
      question: "How do I sign up on The Learning Hub?",
      answer: "You can sign up using your email or social login via the “Sign Up” button on the homepage.",
    },
    {
      id: "tab9-faq3",
      question: "Is The Learning Hub free to use?",
      answer: "Browsing the platform is free. However, most courses are paid, unless marked as free by instructors.",
    },
    {
      id: "tab9-faq4",
      question: "How can I enroll in a course?",
      answer: "Simply click on the course, select “Enroll Now,” and complete the payment process.",
    },
    {
      id: "tab9-faq5",
      question: "Do I get a certificate after course completion?",
      answer: "Yes, upon successful completion, a digital certificate will be available for download.",
    },
    {
      id: "tab9-faq6",
      question: "Can I access courses on mobile?",
      answer: "Absolutely. The Learning Hub is optimized for both desktop and mobile access.",
    },
    {
      id: "tab9-faq7",
      question: "What types of courses are offered?",
      answer: "We offer courses in technology, business, design, personal development, health, and more.",
    },
    {
      id: "tab9-faq8",
      question: "Can I preview a course before purchasing?",
      answer: "Many courses offer free previews to help you decide before enrolling.",
    },
    {
      id: "tab9-faq9",
      question: "How do I contact support?",
      answer: "You can reach our support team via the Contact page or email us at [Insert email]",
    },
    {
      id: "tab9-faq10",
      question: "Is my payment information safe?",
      answer: "Yes, all transactions are encrypted and processed through secure gateways.",
    },
    {
      id: "tab9-faq11",
      question: "Can I request a refund?",
      answer: "Yes, we offer refunds based on our Refund Policy. Generally, requests must be made within 7 days of enrollment.",
    },
    {
      id: "tab9-faq12",
      question: "Can I access a course forever?",
      answer: "Yes, once enrolled, you get lifetime access unless stated otherwise.",
    },
    {
      id: "tab9-faq13",
      question: "How do I become an instructor?",
      answer: "Visit the “Become an Instructor” page and apply with your course idea or credentials.",
    },
    {
      id: "tab9-faq14",
      question: "Can I teach more than one course?",
      answer: "Yes, instructors can create and manage multiple courses.",
    },
    {
      id: "tab9-faq15",
      question: "What are the earnings for instructors?",
      answer: "Instructors earn a revenue share from each sale, details of which are provided in the Instructor Dashboard.",
    },
    {
      id: "tab9-faq16",
      question: "Can instructors update their course content?",
      answer: "Yes, you can update or revise your course content at any time.",
    },
    {
      id: "tab9-faq17",
      question: "What format can I upload content in?",
      answer: "The Learning hub supports video, audio, PDFs, quizzes, and downloadable resources.",
    },
    {
      id: "tab9-faq18",
      question: "Can organizations or teams enroll?",
      answer: "Yes, we offer bulk enrollment and team learning solutions for enterprises.",
    },
    {
      id: "tab9-faq19",
      question: "Is there a mobile app?",
      answer: "Currently, The Learning Hub is mobile-browser friendly. The app version is in development.",
    },
    {
      id: "tab9-faq20",
      question: "Are there live sessions?",
      answer: "Some instructors may offer live classes or webinars in addition to recorded lessons.",
    },
    {
      id: "tab9-faq21",
      question: "Do instructors need teaching experience?",
      answer: "Not necessarily. You just need deep knowledge and the ability to present it clearly.",
    },
    {
      id: "tab9-faq22",
      question: "Is there any course moderation or quality check?",
      answer: "Yes, all courses go through a review process before being published.",
    },
    {
      id: "tab9-faq23",
      question: "What languages are supported?",
      answer: "English is the primary language, but multi-language support is being developed.",
    },
    {
      id: "tab9-faq24",
      question: "Can I download the course content?",
      answer: "Videos cannot be downloaded for offline use due to licensing restrictions, but PDFs and resources may be downloadable.",
    },
    {
      id: "tab9-faq25",
      question: "How do I delete my account?",
      answer: "Contact support@galms.com with your registered email, and we’ll assist you.",
    },
  ],
},

  }

  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
    setActiveAccordion(null)
  }

  const handleAccordionClick = (accordionId) => {
    setActiveAccordion(activeAccordion === accordionId ? null : accordionId)
  }

  return (
    
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-semibold mb-2">FAQs</h1>
        <div className="text-gray-500">
          <span>Home</span> / <span>FAQs</span>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar - Tabs */}
          <div className="md:w-1/4">
            <div className="bg-white border rounded-md overflow-hidden">
              {Object.keys(tabsData).map((tabId) => (
                <div
                  key={tabId}
                  className={`border-b last:border-b-0 cursor-pointer ${
                    activeTab === tabId ? "bg-blue-500 text-white" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleTabClick(tabId)}
                >
                  <div className="px-4 py-3">{tabsData[tabId].name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle - Accordion */}
          <div className="md:w-2/4">
            <div className="bg-white border rounded-md overflow-hidden">
              {tabsData[activeTab].faqs.map((faq) => (
                <div key={faq.id} className="border-b last:border-b-0">
                  <div
                    className={`flex justify-between items-center px-6 py-4 cursor-pointer ${
                      activeAccordion === faq.id ? "bg-gray-800 text-white" : ""
                    }`}
                    onClick={() => handleAccordionClick(faq.id)}
                  >
                    <div>{faq.question}</div>
                    <div>
                      {activeAccordion === faq.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  {activeAccordion === faq.id && (
                    <div className="px-6 py-4 bg-white text-gray-700">
                      {typeof faq.answer === "string" ? <p>{faq.answer}</p> : faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar - Contact form */}
          <div className="md:w-1/4">
            <div className="bg-gray-100 border rounded-md p-6">
              <h2 className="text-lg font-semibold mb-1">Don't find your answer!</h2>
              <p className="text-gray-600 text-sm mb-4">
                Don't worry, write your question here and our support team will help you.
              </p>
              <form>
                <div className="mb-3">
                  <input type="text" placeholder="Subject" className="w-full px-3 py-2 border rounded-md" />
                </div>
                <div className="mb-4">
                  <textarea placeholder="Message" className="w-full px-3 py-2 border rounded-md h-24"></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Submit Question
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Faqs
