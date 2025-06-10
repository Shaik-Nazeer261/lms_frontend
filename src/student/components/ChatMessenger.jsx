import React, { useState, useEffect } from 'react';
import { FaCircle, FaEllipsisH, FaSearch } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import classNames from 'classnames';
import api from '../../api'; // your axios instance
import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';
import User from '../../icons/User.svg';

export default function ChatMessenger() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [chats, setChats] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState(null);
const [editedMessage, setEditedMessage] = useState('');
const [menuMessageId, setMenuMessageId] = useState(null);    // which message’s ⋮ is open
const [replyToMessage, setReplyToMessage] = useState(null);
const [showComposeModal, setShowComposeModal] = useState(false);
const [newMessageText, setNewMessageText] = useState('');
const [selectedTeacher, setSelectedTeacher] = useState('');
const [instructors, setInstructors] = useState([]);






const openMenu = (id) => setMenuMessageId(id);
const closeMenu = () => setMenuMessageId(null);

const startEdit = (msg) => {
  setMenuMessageId(null);
  setEditingMessageId(msg.id);
  setEditedMessage(msg.message);
};

const cancelEdit = () => {
  setEditingMessageId(null);
  setEditedMessage('');
};

const handleEditSubmit = (id) => {
  if (!editedMessage.trim()) return;
  api.put(`/api/chat/private/message/${id}/edit/`, { message: editedMessage })
    .then(() => {
      setChats(chats.map(m => m.id === id ? { ...m, message: editedMessage, is_edited: true } : m));
      cancelEdit();
    })
    .catch(console.error);
};

const deleteMessage = (id) => {
  if (!window.confirm("Delete this message?")) return;
  api.delete(`/api/chat/private/message/${id}/delete/`)
    .then(() => setChats(chats.filter(m => m.id !== id)))
    .catch(console.error);
};




  function formatMessageTime(timestamp) {
  const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;

  if (isToday(date)) {
    return format(date, 'hh:mm a'); // like 04:23 PM
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  if (isThisWeek(date)) {
    return format(date, 'EEEE'); // like Monday, Tuesday
  }
  return format(date, 'MMM d'); // like Apr 12
}

  // Load contact list on mount
  useEffect(() => {
    api.get('/api/chat/private/instructors/')
      .then(res => setContacts(res.data))
      .catch(err => console.error("Error fetching instructors:", err));
  }, []);

  // Load chat when contact changes
  // Fetch contacts again after chat load (to update unread counts)
useEffect(() => {
  if (!selectedContact) return;

  api.get(`/api/chat/private/thread/${selectedContact.instructor_id}/?course_id=${selectedContact.course_id}`)
    .then(res => {
      setChats(res.data);
      // 👇 Fetch latest instructors list again to refresh unread count
      api.get('/api/chat/private/instructors/').then(r => setContacts(r.data));
    })
    .catch(err => console.error("Error fetching chat thread:", err));
}, [selectedContact]);


 const sendMessage = () => {
  if (!inputMessage.trim() || !selectedContact) return;

  const formData = new FormData();
  formData.append("message", inputMessage);
  formData.append("course_id", selectedContact.course_id);
  if (replyToMessage) formData.append("reply_to", replyToMessage.id);

  api.post(`/api/chat/private/thread/${selectedContact.instructor_id}/`, formData)
    .then(res => {
      setChats(prev => [...prev, res.data]);
      setInputMessage('');
      setReplyToMessage(null);
    })
    .catch(err => console.error("Error sending message:", err));
};

useEffect(() => {
  const container = document.querySelector('.overflow-y-auto');
  container?.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
}, [chats]);


useEffect(() => {
  const fetchInstructors = async () => {
    try {
      const res = await api.get('/api/student/enrolled-course-instructors/');
      setInstructors(res.data);
    } catch (err) {
      console.error("Failed to fetch instructors", err);
    }
  };

  fetchInstructors();
}, []);


  return (
    <div className="flex h-screen w-full font-sans space-x-2">
      {/* Sidebar */}
      <div className="w-80 h-full flex flex-col border border-gray-300 ">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold text-blue-900">Message</h2>
          <button
  onClick={() => setShowComposeModal(true)}
  className="bg-[#EBEBFF] border border-[#EBEBFF] text-[#1b1c57] px-4 py-1.5 text-sm rounded font-semibold"
>
  + Compose
</button>

        </div>

        {/* Search */}
        <div className="relative px-4 pb-3">
          <FaSearch className="absolute top-3 left-6 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-3 py-2 rounded w-full text-sm bg-white text-black border"
          />
        </div>

        {/* Instructor List */}
        <div className="overflow-y-auto flex-1">
          {contacts.map(user => (
  <div
    key={user.instructor_id}
    className={classNames(
      'flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 ',
      selectedContact?.instructor_id === user.instructor_id && 'bg-blue-50'
    )}
    onClick={() => setSelectedContact(user)}
  >
    <img
      src={`${import.meta.env.VITE_BACKEND_URL}${user.profile}` || User}
      alt={user.instructor_name}
      className="w-10 h-10 rounded-full"
    />

    <div className="flex-1">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-sm text-gray-900">{user.instructor_name}</h4>
        <span className="text-xs text-gray-500">
 {formatMessageTime(user.last_message_time)}
</span>
        {user.unread_count > 0 && (
          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
            {user.unread_count}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-600 truncate max-w-[180px]">
        {user.last_message || "No messages yet"}
      </p>
    </div>
  </div>
))}

        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex-1  bg-gray-50 flex flex-col border border-gray-300">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white">
              <div className="flex items-center gap-3">
                <img src={`${import.meta.env.VITE_BACKEND_URL}${selectedContact.profile}` || User} className="w-10 h-10 rounded-full" alt={selectedContact.instructor_name} />
                <div>
                  <h4 className="font-semibold">{selectedContact.instructor_name}</h4>
                  <span className="text-sm text-green-600">Active Now</span>
                </div>
              </div>
              <FaEllipsisH className="text-gray-600 cursor-pointer" />
            </div>

            {/* Chat Messages */}
           {/* Chat Messages */}
<div className="flex-1 p-6 overflow-y-auto space-y-4">
  <p className="text-center text-sm text-gray-400">Today</p>
 {chats.map(msg => {
  const isMe = msg.sender_username !== selectedContact.instructor_name;
  return (
    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4 px-2`}>
      <div className="flex flex-col items-start max-w-xs">
        {/* Avatar + time */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
          {!isMe && <img src={selectedContact.profile ? `${import.meta.env.VITE_BACKEND_URL}${selectedContact.profile}` : User} className="w-5 h-5 rounded-full" />}
          <span>{formatMessageTime(msg.timestamp)}</span>
          {msg.is_edited && <span className="italic">(edited)</span>}
        </div>

        {/* Message + actions */}
        <div className="relative">
          {/* Bubble or editing input */}
          {editingMessageId === msg.id
            ? (
              <input
                className="w-full bg-white text-black px-2 py-1 rounded text-sm border"
                value={editedMessage}
                onChange={e => setEditedMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleEditSubmit(msg.id);
                  if (e.key === 'Escape') cancelEdit();
                }}
                onBlur={cancelEdit}
              />
            )
            : (
              <div 
              onDoubleClick={() => {
    if (!isMe) setReplyToMessage(msg);
  }}
              className={`p-3 rounded-lg text-sm whitespace-pre-line break-words
                ${isMe
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-blue-100 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.reply_to_message && (
  <div className="bg-white border-l-4 border-blue-400 p-2 mb-1 text-xs text-gray-700 rounded">
    <span className="font-semibold">{msg.reply_to_message.sender_username}:</span>{" "}
    {msg.reply_to_message.message}
  </div>
)}

                {msg.message}
              </div>
            )
          }

          {/* ⋮ menu trigger */}
          {isMe && editingMessageId !== msg.id && (
            <button
              onClick={() => openMenu(msg.id)}
              className="absolute top-0 right-0 p-1 text-gray-400 hover:text-gray-600"
            >
              ⋮
            </button>
          )}

          {/* Popup menu */}
          {menuMessageId === msg.id && (
            <div
              className="absolute top-6 right-0 bg-white shadow-lg rounded text-xs text-gray-700 z-10"
              onMouseLeave={closeMenu}
            >
              <button
                onClick={() => startEdit(msg)}
                className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
              >
                Edit
              </button>
              <button
                onClick={() => { deleteMessage(msg.id); closeMenu(); }}
                className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-500"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
})}



</div>
{replyToMessage && (
  <div className="bg-gray-100 border-l-4 border-blue-500 p-2 mb-2 rounded relative">
    <p className="text-xs text-gray-600 mb-1">Replying to:</p>
    <p className="text-sm text-gray-800 italic truncate">{replyToMessage.message}</p>
    <button
      onClick={() => setReplyToMessage(null)}
      className="absolute top-1 right-2 text-gray-400 hover:text-red-500"
    >
      ✕
    </button>
  </div>
)}


            {/* Chat Input */}
            <div className="flex items-center p-4 border-t bg-white">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                type="text"
                placeholder="Type your message"
                className="flex-1 border border-gray-300 px-4 py-2 rounded mr-3"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-1"
              >
                Send <IoSend />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a contact to start chatting.
          </div>
        )}
      </div>
      {showComposeModal && (
  <div className="fixed inset-0 bg-[#000000B2] z-50 flex items-center justify-center">
    <div className="bg-white  shadow-lg w-[500px] p-6 relative">
      <button
        className="absolute  right-3 text-gray-500 hover:text-gray-700"
        onClick={() => setShowComposeModal(false)}
      >
        ✕
      </button>

      <h2 className="text-lg font-semibold text-[#1b1c57] mb-4">New Message</h2>

      <label className="text-sm font-medium text-gray-700">Teacher:</label>
      <select
        value={selectedTeacher}
        onChange={(e) => setSelectedTeacher(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
      >
        <option value="">Select...</option>
        {instructors.map(teacher => (
  <option
    key={`${teacher.id}-${teacher.course_id}`}
    value={`${teacher.id}-${teacher.course_id}`}
  >
    {teacher.name} ({teacher.course_title})
  </option>
))}

      </select>

      <label className="text-sm font-medium text-gray-700">Message:</label>
      <textarea
        value={newMessageText}
        onChange={(e) => setNewMessageText(e.target.value)}
        placeholder="Write your message here..."
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 h-24"
      />

      <div className="flex justify-between">
        <button
          onClick={() => setShowComposeModal(false)}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={() => {
  const [instructorId, courseId] = selectedTeacher.split("-");
  const formData = new FormData();
  formData.append("message", newMessageText);

  api.post(`/api/courses/${courseId}/chat/private/${instructorId}/`, formData)
    .then(() => {
      setShowComposeModal(false);
      setNewMessageText('');
      setSelectedTeacher('');
      api.get('/api/chat/private/instructors/').then(r => setContacts(r.data));
    })
    .catch(console.error);
}}

          disabled={!newMessageText || !selectedTeacher}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-1"
        >
          Send Message <IoSend />
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
