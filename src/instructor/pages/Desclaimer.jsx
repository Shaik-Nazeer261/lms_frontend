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
        <div className="bg-white rounded-lg p-8 space-y-8">
          <section>
            <p className="text-gray-700 leading-relaxed">
              Welcome to The Learning Hub. Please read this Disclaimer carefully before using our platform.
              By accessing The Learning Hub (insert website link), you accept and agree to be bound by this Disclaimer,
              along with our Terms and Conditions and Privacy Policy.
              If you do not agree with any part of this Disclaimer, please discontinue use of the site and its services immediately.
            </p>
          </section>

          {/* 1. Educational Purpose Only */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Educational Purpose Only</h2>
            <p className="text-gray-700 leading-relaxed">
              The courses, videos, articles, and all other content provided on The Learning Hub are intended solely for
              educational and informational purposes. They are not a substitute for professional advice, certification,
              or services in fields such as legal, medical, financial, or psychological counseling.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              While we strive to ensure the quality and accuracy of the content, The Learning Hub does not guarantee the
              completeness, reliability, or applicability of any information shared on the platform.
            </p>
          </section>

          {/* 2. Instructor-Generated Content */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Instructor-Generated Content</h2>
            <p className="text-gray-700 leading-relaxed">
              Most of the content on The Learning Hub is created by independent instructors. The views, opinions,
              strategies, and recommendations expressed in the courses are solely those of the instructor and do not
              necessarily reflect the views or policies of The Learning Hub.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              The Learning Hub does not assume responsibility for the correctness, validity, legality, or usefulness
              of the content provided by instructors. Learners are encouraged to verify any critical information independently.
            </p>
          </section>

          {/* 3. No Guarantees or Warranties */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. No Guarantees or Warranties</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>The availability, reliability, or performance of the website or its services</li>
              <li>The outcomes or results from taking any course</li>
              <li>The accuracy or timeliness of content</li>
            </ul>
            <p className="text-gray-700 mt-2">
              We do not guarantee job placement, income, or career advancement through any course taken on the platform.
            </p>
          </section>

          {/* 4. Professional and Technical Courses */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Professional and Technical Courses</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>The platform does not issue professional licenses or certifications unless explicitly mentioned</li>
              <li>Users must consult relevant authorities or institutions to validate the course’s acceptance or relevance</li>
              <li>Implementing skills from these courses is done at your own risk</li>
            </ul>
          </section>

          {/* 5. External Links */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. External Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Some content may contain links to third-party websites. These links are provided for convenience and
              informational purposes only. The Learning Hub has no control over, and assumes no responsibility for, the
              content or practices of any third-party sites.
            </p>
          </section>

          {/* 6. User Responsibility */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. User Responsibility</h2>
            <p className="text-gray-700 leading-relaxed">
              It is your responsibility to evaluate the accuracy, completeness, or usefulness of any course or material
              on The Learning Hub before relying on it. You agree to use the platform and its content at your own
              discretion and risk.
            </p>
            <p className="text-gray-700 mt-2">
              You are solely responsible for any consequences resulting from applying the knowledge gained through The Learning Hub.
            </p>
          </section>

          {/* 7. Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Limitation of Liability</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Use or misuse of the platform</li>
              <li>Errors or omissions in any content</li>
              <li>Platform downtime or technical issues</li>
              <li>Any user’s failure to achieve intended results</li>
            </ul>
            <p className="text-gray-700 mt-2">
              This limitation applies even if The Learning Hub has been advised of the possibility of such damages.
            </p>
          </section>

          {/* 8. Modifications */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Modifications</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify this Disclaimer at any time. Updates will be posted on this page with a
              revised effective date. Continued use of the platform after any changes constitutes your acceptance of the new terms.
            </p>
          </section>

          {/* 9. Contact Us */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">9. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions or concerns about this Disclaimer, please contact:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
              <li>Email: [Insert email Address]</li>
              <li>Website: [Insert Website]</li>
              <li>Address: [Insert Office Address]</li>
            </ul>
          </section>

          {/* Reminder */}
          <section>
            <p className="text-gray-700 italic">
              This Disclaimer is part of your agreement with The Learning Hub and should be read in conjunction with our Terms and Conditions and Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
