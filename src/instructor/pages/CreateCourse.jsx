import  { useState } from 'react';
import BasicInformation from '../components/BasicInformation.jsx';
import AdvanceInformation from '../components/AdvanceInformation.jsx';
import Curriculum from '../components/Curriculum.jsx';
import PublishCourse from '../components/PublishCourse.jsx';
import stack from '../../icons/wstack.svg';
import ClipboardText from '../../icons/ClipboardText.svg'
import MonitorPlay from '../../icons/MonitorPlay.svg'
import PlayCircle from '../../icons/PlayCircle.svg'
import { FaCheck } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';


const TABS = [
  {
    id: 'basic',
    label: 'Basic Information',
    icon: <img src={stack}/>,
  },
  {
    id: 'advance',
    label: 'Advance Information',
    icon: <img src={ClipboardText}/>,
  },
  {
    id: 'curriculum',
    label: 'Curriculum',
    icon: <img src={MonitorPlay}/>,
  },
  {
    id: 'publish',
    label: 'Publish Course',
    icon: <img src={PlayCircle}/>,
  },
];

const CreateCourse = () => {
  const location = useLocation();
const [courseId, setCourseId] = useState(location.state?.courseId || null);
const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'basic');


 const renderComponent = ({ goToTab }) => {
  const sharedProps = { goToTab, courseId, setCourseId }; // 👈 add this

  switch (activeTab) {
    case 'basic':
      return <BasicInformation {...sharedProps} />;
    case 'advance':
      return <AdvanceInformation {...sharedProps} />;
    case 'curriculum':
      return <Curriculum {...sharedProps} />;
    case 'publish':
      return <PublishCourse {...sharedProps} />;
    default:
      return null;
  }
};



  return (
    <div className="px-6 py-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#E9EAF0] mb-6 justify-between space-x-10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center gap-2 relative pb-3 ${
              activeTab === tab.id
                ? 'text-[#00113D] font-semibold border-b-2 border-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>

            {tab.complete && tab.id !== activeTab && (
              <FaCheck className="text-green-500 ml-1" />
            )}

            {tab.progress && tab.id === activeTab && (
              <span className="ml-2 text-green-600 text-xs">{tab.progress}</span>
            )}
          </button>
        ))}
      </div>

      {/* Render Section */}
      <div>{renderComponent({ goToTab: setActiveTab })}</div>
    </div>
  );
};

export default CreateCourse;
