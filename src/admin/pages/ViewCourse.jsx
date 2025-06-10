import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

const AdminCourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/api/admin/course/${courseId}/`);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
        setError("Could not load course details.");
      }
    };

    fetchCourse();
  }, [courseId]);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!course) return <div className="p-6">Loading course details...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-3xl font-bold text-blue-900">{course.title}</h1>
        <p className="text-gray-700 mt-1">{course.subtitle}</p>
      </div>

      {/* Demo Video */}
      {course.demoVideo && (
        <video src={`${import.meta.env.VITE_BACKEND_URL}${course.demoVideo}`} controls className="w-full rounded-md shadow" />
      )}

      {/* Instructor Info */}
      <div className="flex items-center gap-4 mt-4">
        <img src={`${import.meta.env.VITE_BACKEND_URL}${course.instructor.image}`} alt="Instructor" className="w-16 h-16 rounded-full" />
        <div>
          <p className="font-bold">{course.instructor.name}</p>
          <p className="text-sm text-gray-600">{course.instructor.role}</p>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div><strong>Published:</strong> {course.is_published ? 'Yes' : 'No'}</div>
        <div><strong>Lectures:</strong> {course.lectureCount}</div>
        <div><strong>Sections:</strong> {course.sectionCount}</div>
        <div><strong>Students Enrolled:</strong> {course.enrolled}</div>
      </div>

      {/* Certificate Info */}
      {course.certificateTemplate && (
        <div className="p-4 bg-green-50 border rounded-md">
          <h3 className="text-lg font-semibold text-green-700 mb-1">Certificate Template</h3>
          <p>Name: {course.certificateTemplate.name} ({course.certificateTemplate.file_type})</p>
         {course.certificateTemplate.preview_image ? (
  <img
    src={course.certificateTemplate.preview_image}
    alt="Certificate Preview"
    className="mt-2 w-32 border rounded"
  />
) : course.certificateTemplate.file_type === 'html' && course.certificateTemplate.html_template ? (
  <div
    className="mt-2 p-4 border rounded bg-white shadow"
    dangerouslySetInnerHTML={{ __html: course.certificateTemplate.html_template }}
  />
) : (
  <p className="text-sm text-gray-500 mt-2">No preview available.</p>
)}

        </div>
      )}

      {/* Sections */}
      {course.sections.map((section, secIdx) => (
        <div key={section.id} className="border p-4 rounded-md shadow-sm bg-white">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">{secIdx + 1}. {section.title}</h3>
          <p className="text-sm text-gray-500 mb-4">Lectures: {section.lectureCount}</p>

          {/* Lectures */}
          {section.lectures.map((lecture, i) => (
            <div key={lecture.content_id} className="border-l-4 border-blue-400 pl-4 mb-4">
              <p className="font-medium">{lecture.title}</p>
              
              {lecture.video && <video src={`${import.meta.env.VITE_BACKEND_URL}${lecture.video}`} controls className="mt-2 w-full rounded" />}
              {lecture.description && <p className="mt-2">{lecture.description}</p>}

              {/* Notes */}
              {lecture.notes.text && (
                <p className="mt-2 text-sm italic text-gray-700">Note: {lecture.notes.text}</p>
              )}
              {lecture.notes.download && (
                <a href={`${import.meta.env.VITE_BACKEND_URL}${lecture.notes.download}`} className="text-blue-500 text-sm underline block mt-1" target="_blank" rel="noreferrer">Download Notes</a>
              )}
              {lecture.attachFile && (
                <a href={`${import.meta.env.VITE_BACKEND_URL}${lecture.attachFile}`} className="text-blue-500 text-sm underline block mt-1" target="_blank" rel="noreferrer">Download Attachment</a>
              )}

              {/* Content Quiz (if any) */}
              {lecture.quiz.length > 0 && (
                <div className="mt-2 p-3 bg-yellow-50 rounded border">
                  <h4 className="font-semibold text-yellow-700">Lecture Quiz</h4>
                  {lecture.quiz.map((q, qIdx) => (
                    <div key={q.id} className="mt-1">
                      <p className="font-medium">{qIdx + 1}. {q.question}</p>
                      <ul className="list-disc pl-5 text-sm">
                        {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Section Practice Paper */}
          {section.practicePaper.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border rounded">
              <h4 className="font-semibold text-blue-800">Practice Quiz</h4>
              {section.practicePaper.map((q, idx) => (
                <div key={q.id} className="mt-2">
                  <p className="font-medium">{q.question}</p>
                  <ul className="list-disc pl-5 text-sm">
                    {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Final Assignments */}
      {course.finalAssignment.length > 0 && (
        <div className="p-4 bg-purple-50 border rounded-md">
          <h3 className="text-xl font-semibold text-purple-700 mb-2">Final Assignment</h3>
          {course.finalAssignment.map((a, idx) => (
            <div key={a.id} className="mb-2">
              <p className="font-medium">{a.question}</p>
              <ul className="list-disc pl-6 text-sm text-gray-700">
                {a.options.map((opt, i) => <li key={i}>{opt}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

     
    </div>
  );
};

export default AdminCourseDetail;
