import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from "lucide-react"

const PrivacyPolicy = () => {


  const [activeTab, setActiveTab] = useState("tab1")
    const [activeAccordion, setActiveAccordion] = useState("accordion4")
  
    // Tabs data with different questions for each tab
    const tabsData = {
      tab1: {
        name: "Nulla tempor odio ut fringilla",
        faqs: [
          {
            id: "accordion1",
            question: "Fusce placerat interdum magna, ut ultricies odio pharetra pulvinar.",
            answer: "",
          },
          {
            id: "accordion2",
            question: "Proin lacinia lobortis metus, ut faucibus eros ullamcorper et.",
            answer: "",
          },
          {
            id: "accordion3",
            question: "Etiam a nisl dui. Integer sed eros sed leo blandit interdum eget nec",
            answer: "",
          },
          {
            id: "accordion4",
            question: "Nulla id ligula ligula.",
            answer: (
              <div>
                <p className="mb-4">
                  Aliquam semper tellus vel lacus rutrum mollis. Nunc vitae iaculis lacus, id fringilla leo. Nulla dictum,
                  enim nec bibendum auctor, lorem mi rutrum urna, sed luctus urna nibh sit amet velit. Sed varius sem
                  semper leo ultricies tincidunt. Etiam id ligula ut augue auctor molestie ut quis felis.
                </p>
                <ol className="list-decimal pl-6 mb-4 space-y-1">
                  <li>Sed lorem elit, aliquam vel neque condimentum, blandit cursus nisi.</li>
                  <li>Cras ullamcorper posuere felis et vehicula.</li>
                  <li>Donec dignissim metus felis, non posuere arcu finibus a.</li>
                </ol>
                <p className="mb-4">
                  Sed interdum dignissim odio, vitae mollis nisi congue nec. Ut tellus metus, posuere vel odio ut,
                  ullamcorper rutrum ex. Curabitur porttitor sem nec felis mollis, nec laoreet leo iaculis.
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Donec ut massa</li>
                  <li>ac magna iaculis imperdiet ut viverra arcu.</li>
                </ul>
                <p>
                  Proin quis elementum velit, eget efficitur nulla. Donec tellus massa, faucibus id nulla sit amet,
                  feugiat viverra justo. Curabitur auctor nibh ut ante lacinia, ac finibus sem pulvinar. Suspendisse
                  vestibulum in dolor eget sodales. Curabitur justo risus, vehicula ac mollis sit amet, gravida sed erat.
                </p>
              </div>
            ),
          },
          {
            id: "accordion5",
            question: "Etiam non tellus non dolor suscipit vehicula.",
            answer: "",
          },
          {
            id: "accordion6",
            question: "Vestibulum pellentesque ex magna.",
            answer: "",
          },
          {
            id: "accordion7",
            question: "Ut ullamcorper est sit amet quam aliquet mattis.",
            answer: "",
          },
        ],
      },
      tab2: {
        name: "Donec malesuada",
        faqs: [
          {
            id: "tab2-faq1",
            question: "What is your return policy?",
            answer: "Our return policy allows returns within 30 days of purchase with original receipt.",
          },
          {
            id: "tab2-faq2",
            question: "How do I track my order?",
            answer: "You can track your order by logging into your account and viewing your order history.",
          },
          {
            id: "tab2-faq3",
            question: "Do you offer international shipping?",
            answer: "Yes, we offer international shipping to most countries. Shipping rates vary by location.",
          },
        ],
      },
      tab3: {
        name: "Quisque",
        faqs: [
          {
            id: "tab3-faq1",
            question: "How do I reset my password?",
            answer: "You can reset your password by clicking the 'Forgot Password' link on the login page.",
          },
          {
            id: "tab3-faq2",
            question: "Is my personal information secure?",
            answer: "Yes, we use industry-standard encryption to protect your personal information.",
          },
        ],
      },
      tab4: {
        name: "Toquam, in accumsan",
        faqs: [
          {
            id: "tab4-faq1",
            question: "What payment methods do you accept?",
            answer: "We accept credit cards, PayPal, and bank transfers.",
          },
          {
            id: "tab4-faq2",
            question: "How long does shipping take?",
            answer:
              "Shipping typically takes 3-5 business days for domestic orders and 7-14 days for international orders.",
          },
        ],
      },
      tab5: {
        name: "Ut sed orci",
        faqs: [
          {
            id: "tab5-faq1",
            question: "Do you offer bulk discounts?",
            answer: "Yes, we offer discounts for bulk orders. Please contact our sales team for more information.",
          },
        ],
      },
      tab6: {
        name: "Nullam non ante",
        faqs: [
          {
            id: "tab6-faq1",
            question: "How can I become a distributor?",
            answer: "To become a distributor, please fill out the distributor application form on our website.",
          },
        ],
      },
      tab7: {
        name: "Phasellus",
        faqs: [
          {
            id: "tab7-faq1",
            question: "What is your warranty policy?",
            answer: "Our products come with a 1-year warranty against manufacturing defects.",
          },
        ],
      },
      tab8: {
        name: "Etiam eu libero elementum",
        faqs: [
          {
            id: "tab8-faq1",
            question: "How do I contact customer support?",
            answer: "You can contact customer support by email, phone, or through the contact form on our website.",
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
       
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy