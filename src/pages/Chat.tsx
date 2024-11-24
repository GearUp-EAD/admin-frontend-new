import React, { useState } from 'react';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';

const contacts = [
  {
    id: 1,
    name: 'Johnson D.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    status: 'online',
    lastMessage: 'Hey, about my last order...',
    time: '2m ago',
  },
  {
    id: 2,
    name: 'Dianne I.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    status: 'offline',
    lastMessage: 'Thank you for your help!',
    time: '1h ago',
  },
  {
    id: 3,
    name: 'Penny L.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    status: 'online',
    lastMessage: 'When will my order arrive?',
    time: '3h ago',
  },
];

const messages = [
  {
    id: 1,
    sender: 'Johnson D.',
    content: 'Hey, I have a question about my last order.',
    time: '10:30 AM',
    isCustomer: true,
  },
  {
    id: 2,
    sender: 'Me',
    content: 'Of course! How can I help you?',
    time: '10:31 AM',
    isCustomer: false,
  },
  {
    id: 3,
    sender: 'Johnson D.',
    content: 'I ordered the basketball shoes, but I think I need a different size.',
    time: '10:32 AM',
    isCustomer: true,
  },
];

const Chat = () => {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [newMessage, setNewMessage] = useState('');

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="bg-white rounded-xl shadow-sm h-full flex">
        {/* Contacts Sidebar */}
        <div className="w-80 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold">Messages</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedContact.id === contact.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={contact.image}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium">{contact.name}</h3>
                      <span className="text-xs text-gray-500">{contact.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={selectedContact.image}
                alt={selectedContact.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-4">
                <h3 className="font-medium">{selectedContact.name}</h3>
                <p className="text-sm text-gray-500">
                  {selectedContact.status === 'online' ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Phone className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Video className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isCustomer ? '' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.isCustomer
                      ? 'bg-gray-100'
                      : 'bg-[#8B4513] text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">{message.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
              />
              <button className="p-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D]">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;