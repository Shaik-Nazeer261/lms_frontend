export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <nav className="text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Terms and Conditions</span>
          </nav>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-lg  p-8 space-y-8">
          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using this Learning Management System (LMS), you agree to be bound by these Terms and
              Conditions. If you do not agree with any part of these terms, you must not use the platform.
            </p>
          </section>

          {/* 2. User Accounts */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">2. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed">
              To access certain features of the LMS, you may be required to register for an account. You are responsible
              for maintaining the confidentiality of your account credentials and for all activities that occur under
              your account. The organization reserves the right to suspend or terminate accounts at its discretion,
              especially in cases of misuse or violation of these terms.
            </p>
          </section>

          {/* 3. Use of Content */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">3. Use of Content</h2>
            <p className="text-gray-700 leading-relaxed">
              All content provided on this platform, including but not limited to text, videos, documents, graphics, and
              assessments, is for personal, non-commercial use unless otherwise stated. You may not copy, distribute, or
              modify any content without prior written permission from the content owner or administrator.
            </p>
          </section>

          {/* 4. Code of Conduct */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">4. Code of Conduct</h2>
            <p className="text-gray-700 leading-relaxed">
              Users must use the LMS respectfully and responsibly. This includes refraining from posting inappropriate
              content, engaging in harassment, violating intellectual property rights, or attempting to disrupt the
              platform's functionality. Any behavior deemed abusive or unethical may result in suspension or permanent
              ban from the system.
            </p>
          </section>

          {/* 5. Intellectual Property */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content and materials on this LMS, unless explicitly stated otherwise, are the intellectual property
              of the organization or its licensors. Unauthorized use, reproduction, or distribution of any part of the
              content may result in legal action.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
