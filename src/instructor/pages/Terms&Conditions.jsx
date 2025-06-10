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

        {/* Terms Content */}
        <div className="bg-white rounded-lg p-8 space-y-8">
          <section>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using The Learning Hub, you agree to these terms:
            </p>
          </section>

          {/* 1. Account Usage */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Account Usage</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>You must be 18 years or older to register.</li>
              <li>You are responsible for maintaining the confidentiality of your account.</li>
            </ul>
          </section>

          {/* 2. Course Enrollment */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Course Enrollment</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Once enrolled, you have a non-transferable license to access course materials.</li>
              <li>Sharing or reselling content is prohibited.</li>
            </ul>
          </section>

          {/* 3. Instructor Content */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Instructor Content</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Instructors retain ownership of their content but grant The Learning Hub a license to distribute it.</li>
              <li>All content must comply with copyright and decency laws.</li>
            </ul>
          </section>

          {/* 4. Payments & Refunds */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Payments & Refunds</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>All prices are clearly stated. Refunds are issued only as per our refund policy.</li>
              <li>Taxes may apply depending on your location.</li>
            </ul>
          </section>

          {/* 5. Platform Changes */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Platform Changes</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify or discontinue any feature without notice.
            </p>
          </section>

          {/* 6. Termination */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              The Learning Hub may suspend or terminate your account for violation of the terms or misuse of the platform.
            </p>
          </section>

          {/* 7. Limitation of Liability */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              The Learning Hub is not liable for indirect or incidental damages arising from course use or platform downtime.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
