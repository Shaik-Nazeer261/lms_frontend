  import  { useEffect, useMemo, useRef, useState } from 'react';
  import image from '../../icons/Image.svg';
  import bpc from '../../icons/bpc.svg';
  import JoditEditor from 'jodit-react';
  import api from '../../api.jsx'; // adjust this import if needed

  const AdvanceInformation = ({ goToTab, courseId }) => {
    const [whatYouWillLearn, setWhatYouWillLearn] = useState(['', '', '', '']);
    const [targetAudience, setTargetAudience] = useState(['', '', '', '']);
    const [requirements, setRequirements] = useState(['', '', '', '']);
    const [thumbnail, setThumbnail] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const editor = useRef(null);
    const [description, setDescription] = useState('');

    const config = useMemo(() => ({
      readonly: false,
      placeholder: 'Start typing...',
    }), []);

    const handleChange = (listSetter, index, value) => {
      listSetter(prev => {
        const updated = [...prev];
        updated[index] = value;
        return updated;
      });
    };

    const handleAdd = (listSetter) => {
      listSetter(prev => [...prev, '']);
    };

    useEffect(() => {
    const fetchAdvancedInfo = async () => {
      if (!courseId) return;


      try {
        const res = await api.get(`/api/instructor/update-course/${courseId}/advanced/`);

        const data = res.data;

        setDescription(data.description || "");
        setWhatYouWillLearn(data.learning_objectives || [""]);
        setTargetAudience(data.target_audiences || [""]);
        setRequirements(data.requirements || [""]);

        // Optional: preload preview URLs for course_image and demo_video
        if (data.course_image) {
          setThumbnail(`${import.meta.env.VITE_BACKEND_URL}${data.course_image}`);
        }
        if (data.demo_video) {
          setTrailer(`${import.meta.env.VITE_BACKEND_URL}${data.demo_video}`);
        }

      } catch (error) {
        console.error("Failed to load advanced info", error);
      }
    };

    fetchAdvancedInfo();
  }, [courseId]);


    const handleSubmit = async () => {
      if (!courseId) {
    alert("No draft course ID found.");
    return;
  }


      const formData = new FormData();
      formData.append('description', description);
      whatYouWillLearn.forEach(item => formData.append('objectives[]', item));
      targetAudience.forEach(item => formData.append('target_audiences[]', item));
      requirements.forEach(item => formData.append('requirements[]', item));
      if (thumbnail) formData.append('course_image', thumbnail);
      if (trailer) formData.append('demo_video', trailer);

      try {
        const res = await api.put(`/api/instructor/update-course/${courseId}/advanced/`, formData);


        if (res.status === 200) {
          alert('Advanced info saved!');
          goToTab('curriculum');
        } else {
          alert('Failed to save. Check your inputs.');
        }
      } catch (err) {
        console.error(err);
        alert('Submission failed.');
      }
    };

    const trailerPreview = useMemo(() => {
  if (!trailer) return null;
  return trailer instanceof File
    ? URL.createObjectURL(trailer)
    : trailer; // backend URL
}, [trailer]);


    return (
      <div className="space-y-10">
        <h2 className="text-xl font-semibold text-[#00113D]">Advance Informations</h2>

        {/* Upload section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Course Thumbnail */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#00113D]">Course Thumbnail</h3>
            <div className="flex gap-6 items-start">
              <div className="w-64 h-36 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
                <img
  src={
    thumbnail instanceof File
      ? URL.createObjectURL(thumbnail)
      : thumbnail || image
  }
  alt="thumbnail"
  className="object-contain w-20 h-20"
/>

              </div>
              <div className="flex flex-col justify-center">
                <p className="text-xs text-gray-600 mb-1">
                  Upload your course Thumbnail here. <span className="font-semibold text-[#00113D]">1200x800</span>.
                </p>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Course Trailer */}
         <div className="space-y-4">
  <h3 className="text-sm font-semibold text-[#00113D]">Course Trailer</h3>
  <div className="flex gap-6 items-start">
    <div className="w-64 h-36 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
      {trailerPreview ? (
        <video controls className="object-contain w-full h-full">
          <source src={trailerPreview} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img src={bpc} alt="trailer" className="object-contain w-20 h-20" />
      )}
    </div>
    <div className="flex flex-col justify-center">
      <p className="text-xs text-gray-600 mb-4 max-w-md">
        Students watching a promo video are <strong>5–10x</strong> more likely to enroll.
      </p>
      <input
        type="file"
        accept="video/mp4"
        onChange={(e) => setTrailer(e.target.files[0])}
        className="text-sm"
      />
    </div>
  </div>
</div>

        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Course Description</label>
          <JoditEditor ref={editor} value={description} onChange={setDescription} config={config} />
        </div>

        {/* Reusable Sections */}
        {[
          { title: "What you will teach in this course", data: whatYouWillLearn, setter: setWhatYouWillLearn },
          { title: "Target Audience", data: targetAudience, setter: setTargetAudience },
          { title: "Course requirements", data: requirements, setter: setRequirements },
        ].map((section, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-700">
                {section.title} ({section.data.length}/8)
              </h3>
              {section.data.length < 8 && (
                <button className="text-blue-600 text-sm font-medium" onClick={() => handleAdd(section.setter)}>+ Add new</button>
              )}
            </div>
            {section.data.map((item, index) => (
            <div key={index} className="mb-3 relative">
    <label className="text-xs text-gray-400 ml-1">
      {String(index + 1).padStart(2, '0')}
    </label>
    
    <div className="relative">
      <input
        type="text"
        maxLength={120}
        placeholder={`${section.title}...`}
        value={item}
        onChange={(e) => handleChange(section.setter, index, e.target.value)}
        className="w-full border border-gray-300 px-4 py-2 pr-12 rounded-md mt-1"
      />

      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
        {item.length}/120
      </span>
    </div>
  </div>

            ))}
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <button className="px-6 py-2 border text-gray-600 rounded hover:bg-gray-100" onClick={() => goToTab('basic')}>Previous</button>
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200">Save</button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={handleSubmit}>Save & Next</button>
          </div>
        </div>
      </div>
    );
  };

  export default AdvanceInformation;
