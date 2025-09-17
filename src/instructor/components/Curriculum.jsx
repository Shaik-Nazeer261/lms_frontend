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
import CertificateSelectionModal from "./CertificateSelectionModal";
import EditLectureModal from "./EditLectureModal";
import LectureAudioModal from "./LectureAudioModal";

const Curriculum = ({ goToTab, courseId }) => {
  const [sections, setSections] = useState([
    {
      id: 1,
      title: "Section name",
      lectures: [{ id: 1, name: "Lecture name", showContent: false }],
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [isCaptionModalOpen, setIsCaptionModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [currentLectureId, setCurrentLectureId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [editingLectureIds, setEditingLectureIds] = useState({
    sectionId: null,
    lectureId: null,
  });
  const [openLecture, setOpenLecture] = useState({
    sectionId: null,
    lectureId: null,
  });

  const contentOptions = [
    "Video",
    "Audio",
    "Attach File",
    "Captions",
    "Description",
    "Lecture Notes",
    // "Add Quiz",
  ];
const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser?.role; // "instructor" or "admin"
  const [suggestion, setSuggestion] = useState(null); // ✅ new
  const [approvalStatus, setApprovalStatus] = useState(null); // ✅ new
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".lecture-dropdown")) {
        setOpenLecture({ sectionId: null, lectureId: null });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleLectureContent = (sectionId, lectureId) => {
    setOpenLecture(
      (prev) =>
        prev.sectionId === sectionId && prev.lectureId === lectureId
          ? { sectionId: null, lectureId: null } // close if already open
          : { sectionId, lectureId } // open new dropdown
    );
  };

  const addSection = () => {
    const newId = sections.length + 1;
    setSections([
      ...sections,
      { id: newId, title: `Section ${newId}`, lectures: [], isNew: true },
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

  const openEditLectureModal = (sectionId, lectureId) => {
    setEditingLectureIds({ sectionId, lectureId });
    setIsLectureModalOpen(true);
  };

  const updateLectureName = (newName) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === editingLectureIds.sectionId
          ? {
              ...section,
              lectures: section.lectures.map((lec) =>
                lec.id === editingLectureIds.lectureId
                  ? { ...lec, name: newName }
                  : lec
              ),
            }
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
                  isNew: true, // 👈 mark new
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

  const handleAudioUpload = (file, sectionId, lectureId) => {
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
                        audio_file: file,
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

  useEffect(() => {
    const fetchCurriculum = async () => {
      if (!courseId) return;

      try {
        const res = await api.get(
          `/api/instructor/update-course/${courseId}/curriculum/`
        );
        const { lessons } = res.data;
        setApprovalStatus(res.data.is_curriculum_approved);
        setSuggestion(res.data.curriculum_suggestions);
        const mappedSections = lessons.map((lesson, i) => ({
          id: lesson.id || i + 1,
          title: lesson.title,
          isNew: false, // 👈 fetched sections are NOT new
          lectures: lesson.concepts.map((concept, j) => {
            const content = concept.content || {};
            return {
              id: concept.id || j + 1,
              name: concept.title,
              isNew: false, // 👈 fetched lectures are NOT new
              description: concept.description || content.text_content || "",
              showContent: false,
              content: {
                video_file: content.video ? `${content.video}` : null,
                audio_file: content.audio ? `${content.audio}` : null, // ✅ Added audio
                attached_file: content.attached_file
                  ? `${content.attached_file}`
                  : null,
                lecture_notes_file: content.lecture_notes_file
                  ? `${content.lecture_notes_file}`
                  : null,
                pdf_file: content.pdf ? `${content.pdf}` : null,
                captions: content.captions || "",
                lecture_notes_text: content.lecture_notes_text || "",
                quiz_title: content.quiz?.title || "",
                quiz_questions: content.quiz?.questions || [],
                video_duration: content.video_duration || null, // ✅ Added video duration
                audio_duration: content.audio_duration || null, // ✅ Added audio duration
              },
            };
          }),
        }));

        setSections(mappedSections);
      } catch (error) {
        console.error("Failed to fetch curriculum data:", error);
      }
    };

    fetchCurriculum();
  }, [courseId]);

  const handleCurriculumSubmit = async (moveNext = false) => {
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
        const audioKey = `audio_${sectionId}_${lectureId}`;
        const fileKey = `file_${sectionId}_${lectureId}`;
        const notesFileKey = `notes_${sectionId}_${lectureId}`;

        if (content.video_file) {
          formData.append(videoKey, content.video_file);
        }

        if (content.audio_file) {
          formData.append(audioKey, content.audio_file);
        }

        if (content.attached_file) {
          formData.append(fileKey, content.attached_file);
        }
        if (content.lecture_notes_file) {
          formData.append(notesFileKey, content.lecture_notes_file);
        }

        const lessonContent = {
          content_type: "text",
          order: 0,
          video: content.video_file ? videoKey : null,
          audio: content.audio_file ? audioKey : null,
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
          content: contentList[0],
        };
      }),
    }));

    formData.append("lessons", JSON.stringify(lessonsData));

    setIsSubmitting(true);
    try {
      const res = await api.put(
        `/api/instructor/update-course/${courseId}/curriculum/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200 || res.status === 201) {
        alert("Curriculum and final exam saved!");

        // ✅ Move to next tab only if Save & Next was clicked
        if (moveNext) {
          goToTab("quiz");
        }
      } else {
        alert("Something went wrong while saving the curriculum.");
      }
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.error || "Error saving curriculum or final exam."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestionSubmit = async () => {
    try {
      const response = await api.put(
        `/api/admin/course-curriculum-approval/${courseId}/`,
        {
          is_curriculum_approved: false,
          curriculum_suggestions: suggestionText,
        }
      );

      if (response.status === 200) {
        alert("Suggestion saved ✅");
        setSuggestion(response.data.curriculum_suggestions);
        setApprovalStatus(response.data.is_curriculum_approved);
        setShowSuggestionModal(false);
        setSuggestionText("");
      }
    } catch (err) {
      console.error("Error saving suggestion:", err);
      alert("Failed to save suggestion");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#00113D]">
        Course Curriculum
      </h2>

      {suggestion && (
  <div className="mb-6">
    <h3 className="text-base font-semibold text-[#00113D] mb-2">Suggestion</h3>
    <div>
      <p className="text-sm font-medium text-gray-700 mb-1">Message</p>
      <div className="bg-gray-100 border border-gray-300 rounded-md p-4 text-gray-800 text-sm">
        {suggestion}
      </div>
    </div>
  </div>
)}

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

              {section.isNew && (
                <button
                  onClick={() => openEditModal(section.id)}
                  className="text-gray-500 hover:text-blue-600"
                  title="Edit Section Name"
                >
                  <FiEdit />
                </button>
              )}

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
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLectureContent(section.id, lecture.id);
                  }}
                  className="text-sm text-blue-600 border px-3 py-1 rounded flex items-center gap-1"
                >
                  Contents{" "}
                  {openLecture.sectionId === section.id &&
                  openLecture.lectureId === lecture.id ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                </button>

                {lecture.isNew && (
                  <button
                    onClick={() => openEditLectureModal(section.id, lecture.id)}
                    className="text-gray-500 hover:text-blue-600"
                    title="Edit Lecture Name"
                  >
                    <FiEdit />
                  </button>
                )}

                <button
                  onClick={() => deleteLecture(section.id, lecture.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Lecture"
                >
                  <FiTrash />
                </button>

                {/* Content Dropdown */}
                {openLecture.sectionId === section.id &&
                  openLecture.lectureId === lecture.id && (
                    <div className="absolute top-full right-0 mt-1 w-40 bg-[#FFFFFF] border rounded z-50 lecture-dropdown">
                      {contentOptions.map((option) => (
                        <div
                          key={option}
                          className="px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 cursor-pointer"
                          onClick={() => {
                            setCurrentSectionId(section.id);
                            setCurrentLectureId(lecture.id);
                            if (option === "Video") setIsVideoModalOpen(true);
                            if (option === "Audio") setIsAudioModalOpen(true);
                            if (option === "Attach File")
                              setIsAttachModalOpen(true);
                            if (option === "Captions")
                              setIsCaptionModalOpen(true);
                            if (option === "Description")
                              setIsDescriptionModalOpen(true);
                            if (option === "Lecture Notes")
                              setIsNotesModalOpen(true);
                            if (option === "Add Quiz") setIsQuizModalOpen(true);

                            // setOpenLecture({ sectionId: null, lectureId: null });
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

      <div
        onClick={() => setIsCertificateModalOpen(true)}
        className="text-center bg-blue-50 py-3 text-blue-600 font-medium rounded cursor-pointer"
      >
         Choose/Build Certificate
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          className="px-6 py-2 border text-gray-600 rounded hover:bg-gray-100"
          onClick={() => goToTab("advance")}
        >
          Previous
        </button>

{userRole === "instructor" ? (
          //  Instructor buttons
          <div className="flex gap-4">
            <button
              className="px-6 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
              onClick={() => handleCurriculumSubmit(false)}
              disabled={isSubmitting}
            >
              Save
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => handleCurriculumSubmit(true)}
              disabled={isSubmitting}
            >
              Save & Next
            </button>
          </div>
        ) : (
          //  Admin buttons
          <div className="flex gap-4">
            <button
            className="px-6 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
            onClick={() => setShowSuggestionModal(true)}
          >
            Add Suggestion
          </button>
            <button className="px-6 py-2 border text-gray-600 rounded-md hover:bg-gray-50"
            onClick={() => goToTab("quiz")}
            >
              Next
            </button>
            <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={async () => {
              try {
                const response = await api.put(
                  `/api/admin/course-curriculum-approval/${courseId}/`,
                  {
                    is_curriculum_approved: true,
                    curriculum_suggestions: "",
                  }
                );
                if (response.status === 200) {
                  alert("Curriculum approved!");
                  setApprovalStatus(true);
                  setSuggestion(null);
                  goToTab("quiz");
                }
                  
              } catch (err) {
                alert("Approval failed ");
              }
            }}
            disabled={approvalStatus}
          >
            {approvalStatus ? "Approved" : "Approve & Next"}
          </button>
          </div>
        )}
      </div>

      {showSuggestionModal && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add Suggestion</h3>
            <textarea
              rows="4"
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Enter suggestion..."
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 border rounded-md"
                onClick={() => setShowSuggestionModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleSuggestionSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <EditSectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sectionName={
          sections.find((s) => s.id === editingSectionId)?.title || ""
        }
        onSave={updateSectionName}
      />

      <EditLectureModal
        isOpen={isLectureModalOpen}
        onClose={() => setIsLectureModalOpen(false)}
        lectureName={
          sections
            .find((s) => s.id === editingLectureIds.sectionId)
            ?.lectures.find((l) => l.id === editingLectureIds.lectureId)
            ?.name || ""
        }
        onSave={updateLectureName}
      />

      <LectureVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onUpload={handleVideoUpload}
        sectionId={currentSectionId}
        lectureId={currentLectureId}
        existingVideo={
          sections
            .find((s) => s.id === currentSectionId)
            ?.lectures.find((l) => l.id === currentLectureId)?.content
            ?.video_file || null
        }
      />

      <LectureAudioModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        onUpload={handleAudioUpload}
        sectionId={currentSectionId}
        lectureId={currentLectureId}
        existingAudio={
          sections
            .find((s) => s.id === currentSectionId)
            ?.lectures.find((l) => l.id === currentLectureId)?.content
            ?.audio_file || null
        }
      />

      <AttachFileModal
        isOpen={isAttachModalOpen}
        onClose={() => setIsAttachModalOpen(false)}
        onAttach={handleAttachFile}
        sectionId={currentSectionId}
        lectureId={currentLectureId}
        existingFile={
          sections
            .find((s) => s.id === currentSectionId)
            ?.lectures.find((l) => l.id === currentLectureId)?.content
            ?.attached_file || null
        }
      />

      <LectureCaptionModal
        isOpen={isCaptionModalOpen}
        onClose={() => setIsCaptionModalOpen(false)}
        onSave={handleSaveCaption}
        sectionId={currentSectionId}
        lectureId={currentLectureId}
        existingCaptions={
          sections
            .find((s) => s.id === currentSectionId)
            ?.lectures.find((l) => l.id === currentLectureId)?.content
            ?.captions || ""
        }
      />

      <LectureDescriptionModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        onSave={handleSaveDescription}
        sectionId={currentSectionId}
        lectureId={currentLectureId}
        existingDescription={
          sections
            .find((s) => s.id === currentSectionId)
            ?.lectures.find((l) => l.id === currentLectureId)?.description || ""
        }
      />

      <LectureNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        onSave={handleSaveLectureNotes}
        sectionId={currentSectionId}
        lectureId={currentLectureId}
        existingNotes={{
          noteText:
            sections
              .find((s) => s.id === currentSectionId)
              ?.lectures.find((l) => l.id === currentLectureId)?.content
              ?.lecture_notes_text || "",
          attachedFile:
            sections
              .find((s) => s.id === currentSectionId)
              ?.lectures.find((l) => l.id === currentLectureId)?.content
              ?.lecture_notes_file || null,
        }}
      />

      <LectureQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onSave={handleSaveQuiz}
        sectionId={currentSectionId}
        lectureId={currentLectureId}
        existingQuiz={{
          quizTitle:
            sections
              .find((s) => s.id === currentSectionId)
              ?.lectures.find((l) => l.id === currentLectureId)?.content
              ?.quiz_title || "",
          quizQuestions:
            sections
              .find((s) => s.id === currentSectionId)
              ?.lectures.find((l) => l.id === currentLectureId)?.content
              ?.quiz_questions || [],
        }}
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
