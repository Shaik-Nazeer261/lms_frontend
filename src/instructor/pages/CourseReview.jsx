import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import api from '../../api';
import { useLocation } from 'react-router-dom';
import Modal from '../components/Modal';

const CoursePlayer = () => {
  const location = useLocation();
  const courseId = location.state?.courseId;
  const [course, setCourse] = useState(null);
  const [activeLecture, setActiveLecture] = useState(null);
  const [openSectionIndex, setOpenSectionIndex] = useState(0);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);

  // Utility function to convert HH:MM:SS → seconds
const toSeconds = (timeStr) => {
  if (!timeStr) return 0;
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return Number(parts[0]) || 0;
};

// Utility function to convert seconds → HH:MM:SS or MM:SS
const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}h ${m}m ${s}s`;
  } else if (m > 0) {
    return `${m}m ${s}s`;
  } else {
    return `${s}s`;
  }
};

  

useEffect(() => {
  if (!courseId) return;

  api.get(`/api/instructor/course-review/${courseId}/`)
    .then(res => {
      const resData = res.data;

      const formattedCourse = {
        title: resData.title,
        subtitle: resData.subtitle,
        demoVideo: resData.demo_video,
        certificate: resData.certificate,
        assignments: resData.assignments,
        is_published: resData.is_published,
        instructor: {
          name: resData.instructor.name,
          image: resData.instructor.profile_picture,
          role: resData.instructor.headline,
          students: 'N/A',
          courses: 'N/A'
        },
        rating: 4.8,
        enrolled: 0,
        duration: 'N/A',
        validTill: 'N/A',
        sections: resData.lessons.map(lesson => ({
          title: lesson.title,
        lectures: lesson.concepts.map(concept => {
  const content = concept.contents[0] || {};

  // Get individual durations in seconds
  const videoDurationSec = toSeconds(content.video_duration);
  const audioDurationSec = toSeconds(content.audio_duration);

  // Sum total duration
  const totalDuration = videoDurationSec + audioDurationSec;

  return {
    id: content.id,
    title: concept.title,
    duration: totalDuration > 0 ? formatDuration(totalDuration) : "N/A",
    video_duration: content.video_duration || null,
    audio_duration: content.audio_duration || null,
    video: content.video,
    audio: content.audio,
    description: content.text_content || '',
    notes: {
      text: content.lecture_notes_text || '',
      download: content.lecture_notes_file || ''
    },
    attachFile: content.attached_file || '',
    quiz: content.quiz || null
  };
})


        }))
      };

      setCourse(formattedCourse);
      setActiveLecture(formattedCourse.sections[0]?.lectures[0] || null);
    })
    .catch(err => console.error('Failed to load course data', err));
}, [courseId]);

const handleFinalPublish = async () => {
  try {
    const res = await api.post(`/api/instructor/final-publish-course/${courseId}/`);
    if (res.status === 200) {
      alert("🎉 Course published successfully!");
    } else {
      alert("Unexpected response while publishing the course.");
    }
  } catch (err) {
    console.error("Final publish failed:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to publish course.");
  }
};


  if (!course) return <div className="p-6">Loading...</div>;

  return (
    <div className="bg-white min-h-screen text-[#00113D]">
      <div className="border-b p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">{activeLecture ? activeLecture.title : 'Lecture name'}</h1>
        <button className="text-sm text-blue-600 border px-3 py-1 rounded">Contents</button>
      </div>

      <div className="px-6 pt-6">
        <h2 className="text-2xl font-semibold mb-4">Course Contents</h2>

        {course.sections.map((section, i) => {
          const isOpen = openSectionIndex === i;
          return (
            <div key={i} className="border rounded mb-4">
              <div
                className="bg-gray-100 p-3 font-medium border-b flex justify-between items-center cursor-pointer"
                onClick={() => setOpenSectionIndex(isOpen ? null : i)}
              >
                <span>{section.title}</span>
                {isOpen ? (
                  <FiChevronDown className="text-gray-600" />
                ) : (
                  <FiChevronRight className="text-gray-600" />
                )}
              </div>

              {isOpen && (
                <div className="divide-y">
                  {section.lectures.map((lec, j) => (
                    <div
                      className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                      key={j}
                      onClick={() => setActiveLecture(lec)}
                    >
                      <span>{lec.title}</span>
                      <span className="text-sm text-gray-500">{lec.duration}</span>
                    </div>
                  ))}
                </div>
              )}

              {isOpen && activeLecture && section.lectures.some(lec => lec.id === activeLecture.id) && (
                <div className="p-4">
  {/* Show Video if present */}
  {activeLecture?.video && (
    <div className="mb-4">
      <video
        key={activeLecture?.id + '-video'}
        className="w-full rounded"
        controls
      >
        <source
          src={`${import.meta.env.VITE_BACKEND_URL}/api${activeLecture.video}`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      {activeLecture.video_duration && (
        <p className="text-sm text-gray-600 mt-2">
          🎥 Duration: {activeLecture.video_duration}
        </p>
      )}
    </div>
  )}

  {/* Show Audio if present */}
  {activeLecture?.audio && (
    <div className="mb-4">
      <audio
        key={activeLecture?.id + '-audio'}
        className="w-full"
        controls
      >
        <source
          src={`${import.meta.env.VITE_BACKEND_URL}/api${activeLecture.audio}`}
          type="audio/mpeg"
        />
        Your browser does not support the audio tag.
      </audio>
      {activeLecture.audio_duration && (
        <p className="text-sm text-gray-600 mt-2">
          🎧 Duration: {activeLecture.audio_duration}
        </p>
      )}
    </div>
  )}

  {/* If neither video nor audio available */}
  {!activeLecture?.video && !activeLecture?.audio && (
    <p className="text-gray-500">
      📄 No video or audio available for this lecture.
    </p>
  )}
</div>

              )}
            </div>
          );
        })}

        <div className="mt-8 border p-4 rounded">
           <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setIsAssignmentOpen(true)}>
    <h3 className="font-semibold text-lg">📘 Final Assignments</h3>
    <span className="text-blue-600 text-sm">View</span>
  </div>

  <Modal isOpen={isAssignmentOpen} onClose={() => setIsAssignmentOpen(false)}>
  <h2 className="text-xl font-bold mb-4">Assignment Questions</h2>
  {course.assignments && course.assignments.length > 0 ? (
    course.assignments.map((assignment, idx) => (
      <div key={assignment.id} className="mb-6 border p-4 rounded bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">
          📝 Assignment {idx + 1}: {assignment.title}
        </h3>
        {assignment.description && (
          <p className="text-gray-600 mb-3">{assignment.description}</p>
        )}
        <p className="text-sm text-gray-500 mb-3">
          ⏳ Time Limit: {assignment.time_limit ? `${assignment.time_limit} mins` : "No limit"}
        </p>

        {assignment.questions && assignment.questions.length > 0 ? (
          <div className="space-y-5">
            {assignment.questions.map((q, qIdx) => (
              <div key={q.id} className="p-4 border rounded bg-white shadow-sm">
                <h4 className="font-medium text-gray-800 mb-2">
                  Q{qIdx + 1}.{" "}
                  {q.question_type === "para_multiplechoice" ? "Read the paragraph carefully:" : q.question}
                </h4>

                {/* Display image if available */}
                {q.image && (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/api${q.image}`}
                    alt="Question"
                    className="w-56 rounded mb-3"
                  />
                )}

                {/* Display audio if available */}
                {q.audio && (
                  <audio controls className="mb-3 w-64">
                    <source
                      src={`${import.meta.env.VITE_BACKEND_URL}/api${q.audio}`}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                )}

                {/* Handle different question types */}
                {q.question_type === "multiplechoice" && (
                  <>
                    <ul className="list-disc pl-6">
                      {q.options.map((opt, i) => (
                        <li
                          key={i}
                          className={`${
                            opt.isCorrect ? "text-green-600 font-semibold" : "text-gray-700"
                          }`}
                        >
                          {opt.text}
                        </li>
                      ))}
                    </ul>
                    {q.answer && (
                      <p className="text-green-700 mt-2 text-sm">✅ Correct Answer: {q.answer}</p>
                    )}
                  </>
                )}

                {q.question_type === "para_multiplechoice" && (
                  <>
                    <p className="text-gray-700 bg-gray-100 p-3 rounded mb-3">
                      {q.paragraph}
                    </p>
                    {q.mcqs && q.mcqs.length > 0 ? (
                      <div className="space-y-3">
                        {q.mcqs.map((mcq, mcqIdx) => (
                          <div key={mcqIdx} className="border p-3 rounded bg-gray-50">
                            <p className="font-medium">
                              {qIdx + 1}.{mcqIdx + 1} {mcq.question}
                            </p>
                            <ul className="list-disc pl-6">
                              {mcq.options.map((opt, optIdx) => (
                                <li
                                  key={optIdx}
                                  className={`${
                                    opt.isCorrect
                                      ? "text-green-600 font-semibold"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {opt.text}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No MCQs added for this paragraph yet.</p>
                    )}
                  </>
                )}

                {q.question_type === "essay" && (
                  <>
                    <p className="text-gray-700">{q.question}</p>
                    <p className="text-sm text-blue-600 mt-2">
                      ✍️ Word Limit: {q.word_limit || "No limit"}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No questions available for this assignment.</p>
        )}
      </div>
    ))
  ) : (
    <p className="text-gray-500">No assignment questions available.</p>
  )}
</Modal>

       <div className="mt-8 border p-4 rounded">
  <div className="flex justify-between items-center mb-4">
    <h3 className="font-semibold text-center w-full">Course Completion Certificate</h3>
  </div>

  {course.certificate ? (
    <div className="flex justify-center">
      {course.certificate.preview_image ? (
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/api${course.certificate.preview_image}`}
          alt="Certificate Preview"
          className="w-64 border"
        />
      ) : course.certificate.html_template ? (
        <div
          className="max-w-xl  border p-4 rounded bg-white text-gray-800 text-center"
          dangerouslySetInnerHTML={{ __html: course.certificate.html_template }}
        />
      ) : (
        <p className="text-sm text-red-500 text-center">No preview or HTML template available.</p>
      )}
    </div>
  ) : (
    <p className="text-sm text-gray-500 text-center">No certificate assigned.</p>
  )}
</div>




        </div>

        {activeLecture && (
          <div className="mt-6 border-t">
            <div className="flex space-x-6 py-3 border-b">
              {['Description', 'Lecture Notes', 'Attach File'].map((tab, idx) => (
                <button key={idx} className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1">
                  {tab} {tab === 'Attach File' && <span className="bg-blue-100 text-blue-600 px-2 rounded ml-1">01</span>}
                </button>
              ))}
            </div>
            <div className="p-4 text-sm">
              <h4 className="font-semibold text-lg mb-2">Lecture Description</h4>
              <p className="mb-4 whitespace-pre-line">{activeLecture.description}</p>
              <h4 className="font-semibold text-lg mb-2">Lecture Notes</h4>
              <p className="mb-4 whitespace-pre-line">{activeLecture.notes.text}</p>
              <a
                href={`${import.meta.env.VITE_BACKEND_URL}/api${activeLecture.notes.download}`}
                className="inline-block bg-gray-100 text-blue-600 px-4 py-2 rounded hover:underline mb-4"
              >
                📄 Download Notes
              </a>
              <h4 className="font-semibold text-lg mb-2">Attach Files</h4>
              <a
                href={`${import.meta.env.VITE_BACKEND_URL}/api${activeLecture.attachFile}`}
                className="block bg-gray-100 p-3 rounded text-blue-600 hover:underline"
              >
                📄 Download Attached File
              </a>
            </div>
          </div>
        )}

        <div className="mt-10 p-6 border rounded bg-gray-50">
          <div className="flex items-center">
            <img src={`${import.meta.env.VITE_BACKEND_URL}/api${course.instructor.image}`} alt="Instructor" className="w-16 h-16 rounded-full mr-4" />
            <div>
              <h4 className="font-bold">{course.instructor.name}</h4>
              <p className="text-sm text-gray-600">{course.instructor.role}</p>
              <p className="text-sm text-gray-500 mt-2">
                ⭐ {course.rating} rating • 👨‍🎓 {course.instructor.students} Students • 📚 {course.instructor.courses} Courses
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm">
            One day {course.instructor.name.split(' ')[0]} had enough with the 9-to-5 grind...{' '}
            <span className="text-blue-600 cursor-pointer">Read more</span>
          </p>
        </div>

        <div className="flex justify-between mt-6">
          <button className="px-6 py-2 border rounded text-gray-600">Back To Course</button>
          <button
  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
  onClick={handleFinalPublish}
  disabled={course.is_published}
>
  {course.is_published ? "✅ Already Published" : "✅ Final Publish"}
</button>

        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
