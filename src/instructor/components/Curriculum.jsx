import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiTrash,
  FiEdit,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import EditSectionModal from "./EditSectionModal";
import LectureVideoModal from "./LectureVideoModal";
import AttachFileModal from "./AttachFileModal";
import LectureCaptionModal from "./LectureCaptionModal";
import LectureDescriptionModal from "./LectureDescriptionModal";
import LectureNotesModal from "./LectureNotesModal";
import api from "../../api";
import LectureQuizModal from "./LectureQuizModal";
import FinalExamModal from "./FinalExamModal";
import CertificateSelectionModal from "./CertificateSelectionModal";

const Curriculum = ({ goToTab, courseId }) => {
  const [sections, setSections] = useState([
    {
      id: 1,
      title: "Section name",
      lectures: [
        { id: 1, name: "Lecture name", showContent: false },
      ],
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [isCaptionModalOpen, setIsCaptionModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [currentLectureId, setCurrentLectureId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isFinalExamModalOpen, setIsFinalExamModalOpen] = useState(false);
const [finalExamQuestions, setFinalExamQuestions] = useState([]);
const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);


  const contentOptions = [
    "Video",
    "Attach File",
    "Captions",
    "Description",
    "Lecture Notes",
    "Add Quiz",
  ];

  const toggleLectureContent = (sectionId, lectureId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lectures: section.lectures.map((lec) =>
                lec.id === lectureId
                  ? { ...lec, showContent: !lec.showContent }
                  : lec
              ),
            }
          : section
      )
    );
  };

  const addSection = () => {
    const newId = sections.length + 1;
    setSections([
      ...sections,
      { id: newId, title: `Section ${newId}`, lectures: [] },
    ]);
  };

  const openEditModal = (sectionId) => {
    setEditingSectionId(sectionId);
    setIsModalOpen(true);
  };

  const updateSectionName = (newName) => {
    setSections(
      sections.map((section) =>
        section.id === editingSectionId
          ? { ...section, title: newName }
          : section
      )
    );
  };

 const addLectureToSection = (sectionId) => {
  setSections((prevSections) =>
    prevSections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            lectures: [
              ...section.lectures,
              {
                id: section.lectures.length + 1,
                name: `Lecture ${section.lectures.length + 1}`,
                showContent: false,
                description: "",
                content: {
                  video_file: null,
                  attached_file: null,
                  captions: "",
                  lecture_notes_text: "",
                  lecture_notes_file: null,
                  quiz_title: "",
                  quiz_questions: [],
                },
              },
            ],
          }
        : section
    )
  );
};



  // Delete entire section by id
  const deleteSection = (sectionId) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  // Delete lecture by lectureId from specific section
  const deleteLecture = (sectionId, lectureId) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lectures: section.lectures.filter(
                (lecture) => lecture.id !== lectureId
              ),
            }
          : section
      )
    );
  };

 const handleVideoUpload = (file, sectionId, lectureId) => {
  setSections((prev) =>
    prev.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            lectures: section.lectures.map((lec) =>
              lec.id === lectureId
                ? {
                    ...lec,
                    content: {
                      ...(lec.content || {}),
                      video_file: file,
                    },
                  }
                : lec
            ),
          }
        : section
    )
  );
};


  const handleAttachFile = (file, sectionId, lectureId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lectures: section.lectures.map((lec) =>
                lec.id === lectureId
                  ? {
                      ...lec,
                      content: {
                        ...lec.content,
                        attached_file: file,
                      },
                    }
                  : lec
              ),
            }
          : section
      )
    );
  };

  const handleSaveCaption = (caption, sectionId, lectureId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lectures: section.lectures.map((lec) =>
                lec.id === lectureId
                  ? {
                      ...lec,
                      content: {
                        ...lec.content,
                        captions: caption,
                      },
                    }
                  : lec
              ),
            }
          : section
      )
    );
  };

  const handleSaveDescription = (desc, sectionId, lectureId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lectures: section.lectures.map((lec) =>
                lec.id === lectureId
                  ? {
                      ...lec,
                      description: desc,
                    }
                  : lec
              ),
            }
          : section
      )
    );
  };

  const handleSaveLectureNotes = (
    { noteText, attachedFile },
    sectionId,
    lectureId
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lectures: section.lectures.map((lec) =>
                lec.id === lectureId
                  ? {
                      ...lec,
                      content: {
                        ...lec.content,
                        lecture_notes_text: noteText,
                        lecture_notes_file: attachedFile,
                      },
                    }
                  : lec
              ),
            }
          : section
      )
    );
  };

  const handleSaveQuiz = ({ quizTitle, questions }, sectionId, lectureId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lectures: section.lectures.map((lec) =>
                lec.id === lectureId
                  ? {
                      ...lec,
                      content: {
                        ...lec.content,
                        quiz_title: quizTitle,
                        quiz_questions: questions,
                      },
                    }
                  : lec
              ),
            }
          : section
      )
    );
  };

   const handleSaveFinalExam = (questions) => {
  setFinalExamQuestions(questions);
};

useEffect(() => {
  const fetchCurriculum = async () => {
    if (!courseId) return;

    try {
      const res = await api.get(`/api/instructor/course-review/${courseId}/`);
      const { lessons } = res.data;

      const mappedSections = lessons.map((lesson, i) => ({
        id: i + 1, // Unique local id
        title: lesson.title,
        lectures: lesson.concepts.map((concept, j) => ({
          id: j + 1,
          name: concept.title,
          description: concept.description || "",
          showContent: false,
          content: (() => {
            const firstContent = concept.contents[0] || {};
            return {
              video_file: null, // can't prefill File object
              attached_file: null,
              lecture_notes_file: null,
              captions: firstContent.captions || "",
              lecture_notes_text: firstContent.lecture_notes_text || "",
              quiz_title: firstContent.quiz?.title || "",
              quiz_questions: firstContent.quiz?.questions || [],
            };
          })()
        }))
      }));

      setSections(mappedSections);
    } catch (error) {
      console.error("Failed to fetch curriculum data:", error);
    }
  };

  fetchCurriculum();
}, []);


const handleCurriculumSubmit = async () => {
  if (!courseId) {
    alert("No course ID found.");
    return;
  }

  const formData = new FormData();

  const lessonsData = sections.map((section) => ({
    title: section.title,
    concepts: section.lectures.map((lecture) => {
      const content = lecture.content || {};
      const contentList = [];

      const sectionId = section.id;
      const lectureId = lecture.id;

      const videoKey = `video_${sectionId}_${lectureId}`;
      const fileKey = `file_${sectionId}_${lectureId}`;
      const notesFileKey = `notes_${sectionId}_${lectureId}`;

      if (content.video_file) {
        formData.append(videoKey, content.video_file);
      }
      if (content.attached_file) {
        formData.append(fileKey, content.attached_file);
      }
      if (content.lecture_notes_file) {
        formData.append(notesFileKey, content.lecture_notes_file);
      }

      const lessonContent = {
        content_type: "text", // optional override if needed
        order: 0,
        video: content.video_file ? videoKey : null,
        pdf: content.attached_file ? fileKey : null,
        text_content: lecture.description || "",
        captions: content.captions || "",
        attached_file: content.attached_file ? fileKey : null,
        lecture_notes_text: content.lecture_notes_text || "",
        lecture_notes_file: content.lecture_notes_file ? notesFileKey : null,
        quiz_title: content.quiz_title || null,
        quiz_questions: content.quiz_questions || [],
      };

      contentList.push(lessonContent);

      return {
        title: lecture.name,
        contents: contentList,
      };
    }),
  }));

  const assignmentsData = finalExamQuestions.map((q) => ({
    question: q.question_text,
    options: q.options || [],
    answer: q.correct_answer,
  }));

  // Append JSON strings to FormData
  formData.append("lessons", JSON.stringify(lessonsData));
  formData.append("assignments", JSON.stringify(assignmentsData));

  setIsSubmitting(true);
  try {
    const res = await api.put(
      `/api/instructor/update-course/${courseId}/curriculum/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.status === 200 || res.status === 201) {
      alert("Curriculum and final exam saved!");
      goToTab("publish");
    } else {
      alert("Something went wrong saving curriculum.");
    }
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.error || "Error saving curriculum or final exam.");
  } finally {
    setIsSubmitting(false);
  }
};




 


  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#00113D]">
        Course Curriculum
      </h2>

      {sections.map((section) => (
        <div
          key={section.id}
          className="border border-white bg-[#F5F7FA] rounded-md p-4"
        >
          <div className="flex items-center justify-between text-sm text-[#00113D] mb-2 font-medium">
            <div>
              <span className="mr-2">☰</span>
              Sections 0{section.id}:{" "}
              <span className="font-normal">{section.title}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <button
                onClick={() => addLectureToSection(section.id)}
                className="text-gray-500 hover:text-blue-600"
                title="Add Lecture"
              >
                <FiPlus />
              </button>

              <button
                onClick={() => openEditModal(section.id)}
                className="text-gray-500 hover:text-blue-600"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => deleteSection(section.id)}
                className="hover:text-red-500"
                title="Delete Section"
              >
                <FiTrash />
              </button>
            </div>
          </div>

          {section.lectures.map((lecture) => (
            <div
              key={lecture.id}
              className="bg-white border border-gray-200 px-4 py-3 rounded mb-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-400">☰</span>
                <span className="text-sm text-gray-700">{lecture.name}</span>
              </div>

              <div className="flex items-center gap-2 relative">
                <button
                  onClick={() => toggleLectureContent(section.id, lecture.id)}
                  className="text-sm text-blue-600 border px-3 py-1 rounded flex items-center gap-1"
                >
                  Contents{" "}
                  {lecture.showContent ? <FiChevronUp /> : <FiChevronDown />}
                </button>

                <button className="text-gray-500 hover:text-blue-600">
                  <FiEdit />
                </button>
                <button
                  onClick={() => deleteLecture(section.id, lecture.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Lecture"
                >
                  <FiTrash />
                </button>

                {/* Content Dropdown */}
                {lecture.showContent && (
                  <div className="absolute top-full right-0 mt-1 w-40 bg-[#FFFFFF] border rounded z-50">
                    {contentOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 cursor-pointer"
                        onClick={() => {
                          setCurrentSectionId(section.id);
                          setCurrentLectureId(lecture.id);
                          if (option === "Video") setIsVideoModalOpen(true);
                          if (option === "Attach File")
                            setIsAttachModalOpen(true);
                          if (option === "Captions")
                            setIsCaptionModalOpen(true);
                          if (option === "Description")
                            setIsDescriptionModalOpen(true);
                          if (option === "Lecture Notes")
                            setIsNotesModalOpen(true);
                          if (option === "Add Quiz") setIsQuizModalOpen(true);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Add Section Button */}
      <div
        className="text-center bg-blue-50 py-3 text-blue-600 font-medium rounded cursor-pointer"
        onClick={addSection}
      >
        Add Sections
      </div>

      {/* Future Add-ons */}
     <div
  className="text-center bg-blue-50 py-3 text-blue-600 font-medium rounded cursor-pointer"
  onClick={() => setIsFinalExamModalOpen(true)}
>
  Add Final Exam
</div>

       <div
      onClick={() => setIsCertificateModalOpen(true)}
      className="text-center bg-blue-50 py-3 text-blue-600 font-medium rounded cursor-pointer"
    >
      🎓 Choose/Build Certificate
    </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button className="px-6 py-2 border text-gray-600 rounded hover:bg-gray-100">
          Previous
        </button>
        <div className="flex gap-3">
          <button className="px-6 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200">
            Save
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleCurriculumSubmit}
          >
            Save & Next
          </button>
        </div>
      </div>
      <EditSectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sectionName={
          sections.find((s) => s.id === editingSectionId)?.title || ""
        }
        onSave={updateSectionName}
      />

      <LectureVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onUpload={handleVideoUpload}
        sectionId={currentSectionId} // ✅ Pass these
        lectureId={currentLectureId}
      />

      <AttachFileModal
        isOpen={isAttachModalOpen}
        onClose={() => setIsAttachModalOpen(false)}
        onAttach={handleAttachFile}
        sectionId={currentSectionId} // ✅ Pass these
        lectureId={currentLectureId}
      />

      <LectureCaptionModal
        isOpen={isCaptionModalOpen}
        onClose={() => setIsCaptionModalOpen(false)}
        onSave={handleSaveCaption}
        sectionId={currentSectionId}
        lectureId={currentLectureId}
      />

      <LectureDescriptionModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        onSave={handleSaveDescription}
        sectionId={currentSectionId}
        lectureId={currentLectureId}
      />

      <LectureNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        onSave={handleSaveLectureNotes}
        sectionId={currentSectionId}
        lectureId={currentLectureId}
      />

      <LectureQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onSave={handleSaveQuiz}
        sectionId={currentSectionId}
        lectureId={currentLectureId}
      />

      <FinalExamModal
  isOpen={isFinalExamModalOpen}
  onClose={() => setIsFinalExamModalOpen(false)}
  onSave={handleSaveFinalExam}
/>

<CertificateSelectionModal
      isOpen={isCertificateModalOpen}
      onClose={() => setIsCertificateModalOpen(false)}
      courseId={courseId}
      onAssign={async (templateId) => {
        await api.post(`/api/courses/${courseId}/set-certificate/`, {
          template_id: templateId,
        });
        alert("Template assigned!");
        setIsCertificateModalOpen(false);
      }}
    />

    </div>
  );
};

export default Curriculum;
