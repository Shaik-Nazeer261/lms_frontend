export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Disclaimer</h1>
          <nav className="text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Disclaimer</span>
          </nav>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-lg  p-8 space-y-8">
          {/* Educational Purpose Only */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Educational Purpose Only</h2>
            <p className="text-gray-700 leading-relaxed">
              This Learning Management System (LMS) is provided solely for educational and training purposes. All
              materials, courses, and resources available through this platform are intended to support learning and
              professional development. The content should not be considered as professional advice or relied upon as a
              substitute for qualified guidance.
            </p>
          </section>

          {/* Accuracy of Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Accuracy of Information</h2>
            <p className="text-gray-700 leading-relaxed">
              While efforts are made to ensure the accuracy and reliability of the information presented, the
              organization makes no guarantees regarding its completeness, timeliness, or applicability. Content may be
              updated, modified, or removed at any time without prior notice.
            </p>
          </section>

          {/* User Responsibility */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Responsibility</h2>
            <p className="text-gray-700 leading-relaxed">
              Users are expected to use the LMS responsibly and ethically. It is the user's responsibility to verify the
              relevance and correctness of any information before applying it in real-world situations. The organization
              is not liable for any damages, losses, or consequences that may result from the misuse of the information
              provided.
            </p>
          </section>

          {/* Third-Party Content */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Content</h2>
            <p className="text-gray-700 leading-relaxed">
              This platform may contain links to third-party websites, tools, or external resources. These links are
              provided for convenience and informational purposes only. The organization does not endorse, control, or
              take responsibility for the content or practices of any external sites.
            </p>
          </section>

          {/* Terms of Use */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Terms of Use</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using this LMS, users agree to comply with all applicable policies, including the
              platform's terms of service, privacy policy, and any institutional codes of conduct. Violations may result
              in restricted access or disciplinary action, depending on the nature of the breach.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
