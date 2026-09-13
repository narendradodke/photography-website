import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { CONTACT_INFO } from '../../utils/constants';
import { submitContact } from '../../services/contactService';
import { fadeUp } from '../../utils/animations';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContact(formData);
      setSent(true);
      setFormData({ name: '', email: '', message: '' });
    } catch {
      //
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-[#0A0A0A] dark:bg-[#0A0A0A] light:bg-[#F8F8F8] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading
          tag="Get In Touch"
          title="Start A Conversation"
          highlightWord="Conversation"
          subtitle="Have a question or want to discuss a customized project? I'd love to hear from you."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contacts & Map */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-[#141414] dark:bg-[#141414] light:bg-white p-8 border border-neutral-800 dark:border-neutral-800 light:border-neutral-300 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-semibold mb-1">Direct Calling</h4>
                  <p className="font-serif text-lg text-white dark:text-white light:text-neutral-900">{CONTACT_INFO.phone}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{CONTACT_INFO.hours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-semibold mb-1">Email Enquiry</h4>
                  <p className="font-serif text-lg text-white dark:text-white light:text-neutral-900">{CONTACT_INFO.email}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{CONTACT_INFO.responseNote}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-semibold mb-1">Studio Location</h4>
                  <p className="font-serif text-lg text-white dark:text-white light:text-neutral-900">{CONTACT_INFO.location}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{CONTACT_INFO.availability}</p>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="w-full h-56 overflow-hidden border border-neutral-800 dark:border-neutral-800 light:border-neutral-300">
              <iframe
                title="Studio Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117763.55171732626!2d75.79380967399808!3d22.724109968456636!2m3!1f0!2f0!3f0!3m2!1i1024!2f768!4f13.1!3m3!1m2!1s0x3962fcad1b410ddb%3A0x96ec4da356240f4!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 filter grayscale invert contrast-125"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>

          {/* Right Column: Contact Message Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-7 bg-[#141414] dark:bg-[#141414] light:bg-white p-8 sm:p-10 border border-neutral-800 dark:border-neutral-800 light:border-neutral-300 shadow-xl"
          >
            {sent ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#D4AF37] mx-auto" />
                <h3 className="font-serif text-2xl text-white dark:text-white light:text-neutral-900">Message Received</h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 max-w-sm mx-auto">
                  Thank you for reaching out. Arjun will review your note and respond within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#D4AF37] text-black text-xs font-semibold uppercase tracking-wider"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-semibold mb-2">
                    Your Name *
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-[#1C1C1C] dark:bg-[#1C1C1C] light:bg-[#F4F4F4] border border-neutral-700 dark:border-neutral-700 light:border-neutral-300 text-white dark:text-white light:text-neutral-900 px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full bg-[#1C1C1C] dark:bg-[#1C1C1C] light:bg-[#F4F4F4] border border-neutral-700 dark:border-neutral-700 light:border-neutral-300 text-white dark:text-white light:text-neutral-900 px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Share your requirements or questions..."
                    className="w-full bg-[#1C1C1C] dark:bg-[#1C1C1C] light:bg-[#F4F4F4] border border-neutral-700 dark:border-neutral-700 light:border-neutral-300 text-white dark:text-white light:text-neutral-900 px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] rounded-none resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-full bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? 'Sending...' : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
