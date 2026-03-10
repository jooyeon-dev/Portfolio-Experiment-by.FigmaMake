import { Mail, Linkedin, Dribbble, Github, MapPin } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission would be handled here
    alert("Thanks for reaching out! This is a demo form.");
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">Let's Connect</h1>
        <p className="text-xl text-gray-600">
          Have a project in mind? I'd love to hear about it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-2xl mb-6">Get in Touch</h2>
          <div className="space-y-6 mb-12">
            <div className="flex items-start gap-4">
              <Mail className="text-gray-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="mb-1">Email</h3>
                <a
                  href="mailto:alex.morgan@example.com"
                  className="text-gray-600 hover:text-gray-900"
                >
                  alex.morgan@example.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="text-gray-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="mb-1">Location</h3>
                <p className="text-gray-600">San Francisco, CA</p>
              </div>
            </div>
          </div>

          <h3 className="text-xl mb-4">Connect on Social</h3>
          <div className="space-y-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Linkedin size={20} />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://dribbble.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Dribbble size={20} />
              <span>Dribbble</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl mb-3">Availability</h3>
            <p className="text-gray-600 mb-4">
              I'm currently available for freelance projects and consulting work.
              Looking forward to collaborating on meaningful projects!
            </p>
            <div className="inline-flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              Available for work
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
