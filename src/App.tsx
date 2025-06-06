import React, { useState, useRef, useEffect } from 'react';
import { Mail, X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { Header } from './components/Header';
import { AboutMe } from './components/AboutMe';
import { QuickLinks } from './components/QuickLinks';
import { BlogUpdates } from './components/BlogUpdates';
import { Availability } from './components/Availability';

function App() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
      emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 
        !import.meta.env.VITE_EMAILJS_SERVICE_ID || 
        !import.meta.env.VITE_EMAILJS_TEMPLATE_ID) {
      setError('Email service is not properly configured. Please try again later.');
      return;
    }

    try {
      setSending(true);
      setError(null);

      const form = event.currentTarget;
      const formData = new FormData(form);
      
      const templateParams = {
        from_name: formData.get('username'),
        from_email: formData.get('email'),
        reply_to: formData.get('email'),
        to_name: 'The Eden Apis Website',
        subject: formData.get('subject'),
        message: formData.get('message')
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setSuccess(true);
      form.reset();
    } catch (e) {
      setError('Failed to send message. Please try again or email us directly.');
      console.error('EmailJS error:', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 cyberpunk-bg opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0f]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <Header />
        <AboutMe />

        {/* Main Grid Layout */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <QuickLinks />
          <BlogUpdates />

          {/* Current Projects */}
          <div className="grid-card">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Current Projects</h2>
            <ul className="list-disc list-inside space-y-2 text-purple-200">
              <li>The Eden Apis Official VRChat World</li>
              <li>VRC-TS Library Development</li>
              <li>Re-organizing some Discord Channels</li>
              <li>New VRChat World</li>
              <li>New Staff Handbook</li>
            </ul>
          </div>

          <Availability />
        </div>

        {/* Contact Button */}
        <button
          onClick={() => setShowContactModal(true)}
          className="w-full p-4 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 neon-border"
        >
          <Mail className="w-5 h-5" />
          Contact Me
        </button>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-purple-900/90 rounded-lg p-6 max-w-md w-full border border-purple-500/30 neon-border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Contact Me</h3>
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setSuccess(false);
                    setError(null);
                  }}
                  className="text-purple-400 hover:text-purple-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {success ? (
                <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center">
                  <p className="text-green-300">
                    Thank you for your message! We'll get back to you soon.
                  </p>
                  <button 
                    className="text-green-400 hover:text-green-300 underline mt-2"
                    onClick={() => setSuccess(false)}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="w-full p-2 rounded bg-purple-800/50 border border-purple-500/30 focus:outline-none focus:border-purple-400"
                      disabled={sending}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full p-2 rounded bg-purple-800/50 border border-purple-500/30 focus:outline-none focus:border-purple-400"
                      disabled={sending}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full p-2 rounded bg-purple-800/50 border border-purple-500/30 focus:outline-none focus:border-purple-400"
                      disabled={sending}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      className="w-full p-2 rounded bg-purple-800/50 border border-purple-500/30 focus:outline-none focus:border-purple-400 h-32"
                      disabled={sending}
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-center">
                      <p className="text-red-400">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex-1 p-2 rounded bg-purple-600 hover:bg-purple-700 transition-colors neon-border flex items-center justify-center gap-2"
                    >
                      {sending ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white" />
                          Sending...
                        </>
                      ) : (
                        'Send'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowContactModal(false)}
                      className="flex-1 p-2 rounded bg-purple-800/50 hover:bg-purple-700/50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="text-center text-sm text-purple-400">
                    <a href="mailto:lolmaxz@theedenapis.com" className="hover:text-purple-300">
                      lolmaxz@theedenapis.com
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;