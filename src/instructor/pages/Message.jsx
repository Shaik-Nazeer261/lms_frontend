import  { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import classNames from 'classnames';
import api from '../../api.jsx';
import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';
import User from '../../icons/User.svg';
import { useLocation } from 'react-router-dom';


export default function Message() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [chats, setChats] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [replyToMessage, setReplyToMessage] = useState(null);
  const location = useLocation();
const notificationData = location.state;  // may be undefined


useEffect(() => {
  api.get('/api/chat/private/students-with-last-message/')
    .then(res => {
      setContacts(res.data);

      if (notificationData) {
        const match = res.data.find(
          (u) => u.username === notificationData.username
        );
        if (match) setSelectedContact(match);
      }
    })
    .catch(err => console.error("Error fetching students:", err));
}, []);


  function formatMessageTime(timestamp) {
    if (!timestamp) return '';
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;
    if (isNaN(date)) return '';
    if (isToday(date)) return format(date, 'hh:mm a');
    if (isYesterday(date)) return 'Yesterday';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d');
  }

  useEffect(() => {
    api.get('/api/chat/private/students-with-last-message/')
      .then(res => setContacts(res.data))
      .catch(err => console.error("Error fetching students:", err));
  }, []);

  useEffect(() => {
    if (!selectedContact) return;
    api.get(`/api/chat/private/thread/${selectedContact.student_id}/?course_id=${selectedContact.course_id}`)
      .then(res => {
        setChats(res.data);
        api.get('/api/chat/private/students-with-last-message/').then(r => setContacts(r.data));
      })
      .catch(err => console.error("Error fetching chat thread:", err));
  }, [selectedContact]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !selectedContact) return;

    const formData = new FormData();
    formData.append("message", inputMessage);
    formData.append("course_id", selectedContact.course_id);
    if (replyToMessage) formData.append("reply_to", replyToMessage.id);

    api.post(`/api/chat/private/thread/${selectedContact.student_id}/`, formData)
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

  return (
    <div className="flex h-screen w-full font-sans space-x-2">
      {/* Sidebar */}
      <div className="w-80 h-full flex flex-col border border-gray-300 ">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold text-blue-900">Message</h2>
        </div>

        <div className="relative px-4 pb-3">
          <FaSearch className="absolute top-3 left-6 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-3 py-2 rounded w-full text-sm bg-white text-black border"
          />
        </div>

        <div className="overflow-y-auto flex-1">
          {contacts.map(user => (
            <div
              key={user.student_id}
              className={classNames(
                'flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 ',
                selectedContact?.student_id === user.student_id && 'bg-blue-50'
              )}
              onClick={() => setSelectedContact(user)}
            >
              <img
                src={user.profile_picture ? `${import.meta.env.VITE_BACKEND_URL}${user.profile_picture}` : User}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm text-gray-900">{user.username}</h4>
                  <span className="text-xs text-gray-500">{formatMessageTime(user.timestamp)}</span>
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
      <div className="flex-1 bg-gray-50 flex flex-col border border-gray-300">
        {selectedContact ? (
          <>
            <div className="flex items-center justify-between p-4 border-b bg-white">
              <div className="flex items-center gap-3">
                <img
                  src={selectedContact.profile_picture ? `${import.meta.env.VITE_BACKEND_URL}${selectedContact.profile_picture}` : User}
                  className="w-10 h-10 rounded-full"
                  alt={selectedContact.username}
                />
                <div>
                  <h4 className="font-semibold">{selectedContact.username}</h4>
                  <span className="text-sm text-green-600">Active Now</span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <p className="text-center text-sm text-gray-400">Today</p>
              {chats.map(msg => {
                const isMe = msg.sender_username !== selectedContact.username;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4 px-2`}>
                    <div className="flex flex-col items-start max-w-xs">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        {!isMe && (
                          <img
                            src={selectedContact.profile_picture ? `${import.meta.env.VITE_BACKEND_URL}${selectedContact.profile_picture}` : User}
                            className="w-5 h-5 rounded-full"
                          />
                        )}
                        <span>{formatMessageTime(msg.timestamp)}</span>
                        {msg.is_edited && <span className="italic">(edited)</span>}
                      </div>
                      <div className={`p-3 rounded-lg text-sm whitespace-pre-line break-words ${isMe ? 'bg-blue-500 text-white rounded-br-none' : 'bg-blue-100 text-gray-800 rounded-bl-none'}`}>
                        {msg.reply_to_message && (
                          <div className="bg-white border-l-4 border-blue-400 p-2 mb-1 text-xs text-gray-700 rounded">
                            <span className="font-semibold">{msg.reply_to_message.sender_username}:</span> {msg.reply_to_message.message}
                          </div>
                        )}
                        {msg.message}
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
                <button onClick={() => setReplyToMessage(null)} className="absolute top-1 right-2 text-gray-400 hover:text-red-500">✕</button>
              </div>
            )}

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
    </div>
  );
}
