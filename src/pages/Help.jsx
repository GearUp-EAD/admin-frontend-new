import React from 'react';
import { Mail, Phone, MessageCircle, FileText, Book, Video } from 'lucide-react';

const Help = () => {
  const helpCategories = [
    {
      icon: <Book className="w-8 h-8 text-[#8B4513]" />,
      title: 'Documentation',
      description: 'Read our detailed guides and documentation',
    },
    {
      icon: <Video className="w-8 h-8 text-[#8B4513]" />,
      title: 'Video Tutorials',
      description: 'Watch step-by-step video tutorials',
    },
    {
      icon: <FileText className="w-8 h-8 text-[#8B4513]" />,
      title: 'FAQs',
      description: 'Find answers to common questions',
    },
  ];

  const faqs = [
    {
      question: 'How do I add a new product?',
      answer: 'Navigate to Products page and click on "Add Product" button. Fill in the required details and submit the form.',
    },
    {
      question: 'How can I process orders?',
      answer: 'Go to Orders page, select the order you want to process, and update its status accordingly.',
    },
    {
      question: 'How do I manage inventory?',
      answer: 'Visit the Products page, where you can view and update stock levels for each product.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Help Center</h2>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {helpCategories.map((category) => (
          <div key={category.title} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4">{category.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
            <p className="text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-12">
        <h3 className="text-xl font-semibold mb-6">Frequently Asked Questions</h3>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
              <h4 className="text-lg font-medium mb-2">{faq.question}</h4>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-6">Contact Support</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <Mail className="w-6 h-6 text-[#8B4513]" />
            <div>
              <p className="font-medium">Email Support</p>
              <p className="text-sm text-gray-600">support@elitegear.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Phone className="w-6 h-6 text-[#8B4513]" />
            <div>
              <p className="font-medium">Phone Support</p>
              <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <MessageCircle className="w-6 h-6 text-[#8B4513]" />
            <div>
              <p className="font-medium">Live Chat</p>
              <p className="text-sm text-gray-600">Available 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;