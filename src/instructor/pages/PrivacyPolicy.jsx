import { useState } from 'react'
import { ChevronDown, ChevronUp } from "lucide-react"

const PrivacyPolicy = () => {


  const [activeTab, setActiveTab] = useState("tab1")
    const [activeAccordion, setActiveAccordion] = useState("accordion4")
  
    // Tabs data with different questions for each tab
    const tabsData = {
      tab1: {
  name: "Privacy Policy",
  faqs: [
    {
      id: "accordion1",
      question: "How we handle your privacy at The Learning Hub",
      answer: (
        <div className="space-y-4">
          <p>The Learning Hub respects your privacy and is committed to protecting the personal data you share with us.</p>

          <div>
            <h3 className="font-semibold mb-1">1. Information We Collect:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Personal Identification (Name, Email, Contact Info)</li>
              <li>Course Activity Data</li>
              <li>Payment & Billing Details</li>
              <li>Cookies & Device Information</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-1">2. How We Use Your Data:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>To manage your account and learning experience</li>
              <li>To personalize content recommendations</li>
              <li>For customer service and support</li>
              <li>For analytics and platform improvement</li>
              <li>For marketing communications (you can opt out anytime)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-1">3. Sharing Your Data:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>We do not sell your personal information.</li>
              <li>Data may be shared with:
                <ul className="list-disc pl-6 space-y-1">
                  <li>Payment processors</li>
                  <li>Email service providers</li>
                  <li>Legal authorities, if required</li>
                </ul>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-1">4. Cookie Policy:</h3>
            <p>We use cookies to track website activity and improve functionality. You may control cookies via your browser settings.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">5. Data Security:</h3>
            <p>We use encryption, secure servers, and regular audits to protect your data.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">6. Your Rights:</h3>
            <p>You have the right to access, update, or delete your data at any time. Email: <a href="mailto:privacy@galms.com" className="text-blue-600 underline">privacy@galms.com</a></p>
          </div>
        </div>
      ),
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
        <h1 className="text-3xl font-semibold mb-2">Privacy Policy</h1>
        <div className="text-gray-500">
          <span>Home</span> / <span>Privacy Policy</span>
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
       
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy