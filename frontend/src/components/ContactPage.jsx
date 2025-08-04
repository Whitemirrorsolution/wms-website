import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [form, setForm] = useState({
    fullName: "", email: "", number: "", subject: "", message: ""
  });
  const [customSubject, setCustomSubject] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [services, setServices] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  // Fetch services from backend
  useEffect(() => {
    axios.get("https://wms-website.onrender.com/api/services")
      .then(res => setServices(res.data))
      .catch(err => console.error("Failed to load services", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "subject") {
      setShowOtherInput(value === "Other");
      setForm({ ...form, subject: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(""); setError(""); setShowSuccess(false);

    try {
      const finalSubject = showOtherInput ? customSubject : form.subject;

      // Send message
      await axios.post("https://wms-website.onrender.com/api/contact", {
        ...form,
        subject: finalSubject,
      });

      // Save custom subject if new
      if (showOtherInput && customSubject) {
        await axios.post("https://wms-website.onrender.com/api/services", { title: customSubject });
      }

      setSuccess("Message sent successfully!");
      setShowSuccess(true);
      setForm({ fullName: "", email: "", number: "", subject: "", message: "" });
      setCustomSubject("");
      setShowOtherInput(false);
      setTimeout(() => setShowSuccess(false), 3500);
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong!";
      setError(msg);
    }
  };

  return (
    <section id="contact" className="w-full min-h-screen bg-gradient-to-br from-white via-sky-100 to-cyan-50 py-20">
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="fixed top-6 left-1/2 z-50 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl shadow-lg font-semibold text-base flex items-center gap-2"
        >
          ✅ {success}
        </motion.div>
      )}

      <motion.div
        className="text-center mb-10 px-2 sm:mb-12 sm:px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2 className="text-2xl xs:text-3xl sm:text-5xl font-extrabold mb-3 sm:mb-4 bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">Contact</h2>
        <p className="text-xs xs:text-sm sm:text-lg text-gray-700 max-w-xs xs:max-w-sm sm:max-w-2xl mx-auto">
          Ready to transform your business? Let's talk about your next project.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 px-1 xs:px-2 sm:px-6 lg:px-8">
        {/* Form Section */}
        <motion.div
          className="bg-white/80 border border-blue-100 rounded-xl shadow-lg p-3 xs:p-4 sm:p-8 backdrop-blur-md"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
        >
          <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-blue-900 mb-1 xs:mb-2">Let's Start a Conversation</h3>
          <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-2 xs:mb-4">Fill out the form below and we’ll respond within 24 hours.</p>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-md mb-4 text-sm font-medium">
              ❌ {error}
            </div>
          )}

          <form className="space-y-3 xs:space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            <input type="text" name="fullName" required placeholder="Full Name *"
              className="w-full p-2 xs:p-2.5 sm:p-3 bg-white border border-blue-200 rounded-lg text-xs xs:text-sm sm:text-base"
              value={form.fullName} onChange={handleChange} />

            <input type="email" name="email" required placeholder="Email Address *"
              className="w-full p-2 xs:p-2.5 sm:p-3 bg-white border border-blue-200 rounded-lg text-xs xs:text-sm sm:text-base"
              value={form.email} onChange={handleChange} />

            <input type="tel" name="number" placeholder="Phone Number"
              className="w-full p-2 xs:p-2.5 sm:p-3 bg-white border border-blue-200 rounded-lg text-xs xs:text-sm sm:text-base"
              value={form.number} onChange={handleChange} />

            <select name="subject" required
              className="w-full p-2 xs:p-2.5 sm:p-3 bg-white border border-blue-200 rounded-lg text-xs xs:text-sm sm:text-base"
              value={form.subject} onChange={handleChange}>
              <option value="">Select a service *</option>
              {services.map(service => (
                <option key={service._id} value={service.title}>{service.title}</option>
              ))}
              <option value="Other">Other</option>
            </select>

            {showOtherInput && (
              <input
                type="text"
                name="customSubject"
                placeholder="Enter custom service *"
                className="w-full p-2 xs:p-2.5 sm:p-3 bg-white border border-blue-200 rounded-lg text-xs xs:text-sm sm:text-base"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                required
              />
            )}

            <textarea rows="4" name="message" required placeholder="Message *"
              className="w-full p-2 xs:p-2.5 sm:p-3 bg-white border border-blue-200 rounded-lg resize-none text-xs xs:text-sm sm:text-base"
              value={form.message} onChange={handleChange}></textarea>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-800 text-white font-bold py-2 xs:py-2.5 sm:py-3 rounded-lg hover:scale-105 transition duration-200 text-xs xs:text-sm sm:text-base"
            >
              Send Message
            </button>
          </form>
        </motion.div>

        {/* Info Cards (No change) */}
        <motion.div className="space-y-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
          <div className="relative h-40 rounded-xl overflow-hidden bg-cover bg-center shadow"
            style={{ backgroundImage: "url('https://media.istockphoto.com/id/2156471449/photo/business-smart-logistics-concept-global-business-connection-technology-interface-global.webp')" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-cyan-700/40 to-blue-700/60"></div>
            <div className="absolute bottom-4 left-4 text-white z-10">
              <h4 className="text-lg font-bold">Our Office</h4>
              <p className="text-sm">Modern workspace in Indore</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: "📍", title: "Address", content: "669, A-2, SCH No.136\nIndore-452010\nMadhya Pradesh, India" },
              { icon: "📞", title: "Phone", content: "+91 79874-35108\nMon - Fri, 9 AM - 6 PM" },
              { icon: "📧", title: "Email", content: "info@whitemirror.com\nWe'll respond within 24 hours" },
              { icon: "💬", title: "Support", content: "24/7 Technical Support\nAlways here to help" },
            ].map((card, i) => (
              <motion.div key={i} className="bg-white/80 backdrop-blur border border-blue-100 rounded-xl p-4 shadow hover:shadow-md">
                <p className="font-semibold text-blue-700 flex items-center gap-2">
                  <span className="text-xl">{card.icon}</span>{card.title}
                </p>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{card.content}</p>
              </motion.div>
            ))}
          </div>

          <div className="relative h-40 rounded-xl overflow-hidden bg-cover bg-center shadow"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551135049-8a33b5883817?w=600')" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-cyan-700/40 to-blue-700/60"></div>
            <div className="absolute bottom-4 left-4 text-white z-10">
              <h4 className="text-lg font-bold">Expert Team</h4>
              <p className="text-sm">ready to bring your vision to life</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactPage;




