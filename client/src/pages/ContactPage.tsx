import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    // Hide success message after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };
  
  return (
    <MainLayout
      title="Contact Us - Vape Cave"
      description="Get in touch with Vape Cave for product inquiries, store information, or any questions about our services."
    >
      {/* Contact Header */}
      <section className="bg-secondary py-10 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold font-['Poppins'] mb-2">Contact Us</h1>
          <p className="text-white/80 max-w-2xl">
            Have questions or need assistance? Reach out to our team and we'll get back to you shortly.
          </p>
        </div>
      </section>
      
      {/* Contact Form and Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              {formSubmitted && (
                <div className="bg-green-100 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    <p>Thank you for your message! We'll get back to you soon.</p>
                  </div>
                </div>
              )}
              
              <form className="bg-light p-6 rounded-lg" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-dark font-medium mb-2">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-dark font-medium mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-dark font-medium mb-2">Subject</label>
                  <select 
                    id="subject" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="" disabled>Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="order">Order Status</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="message" className="block text-dark font-medium mb-2">Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3 px-6 rounded-md transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="bg-secondary text-white p-6 rounded-lg h-full">
                <h3 className="font-['Poppins'] font-semibold text-xl mb-6">Get In Touch</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary/20 p-3 rounded-full mr-4">
                      <i className="fas fa-envelope text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Email Us</h4>
                      <p className="text-white/80">vapecavetex@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/20 p-3 rounded-full mr-4">
                      <i className="fas fa-phone-alt text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Call Us</h4>
                      <p className="text-white/80">Frisco: (469) 294-0061</p>
                      <p className="text-white/80">Arlington: (682) 270-0334</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/20 p-3 rounded-full mr-4">
                      <i className="fas fa-clock text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Business Hours</h4>
                      <p className="text-white/80">Frisco: 10:00 AM - 12:00 AM (1:00 AM Fri-Sat)</p>
                      <p className="text-white/80">Arlington: 10:00 AM - 11:00 PM</p>
                      <p className="text-white/80 font-medium">Both locations open 7 days a week</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/20 p-3 rounded-full mr-4">
                      <i className="fas fa-map-marker-alt text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Locations</h4>
                      <p className="text-white/80">Frisco: 6958 Main St, Frisco, TX 75033</p>
                      <p className="text-white/80">Arlington: 4100 S Cooper St, Unit 4108, Arlington, TX 76015</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-medium mb-3">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-primary/20 hover:bg-primary/30 p-2 rounded-full transition-colors">
                      <i className="fab fa-facebook-f text-primary"></i>
                    </a>
                    <a href="#" className="bg-primary/20 hover:bg-primary/30 p-2 rounded-full transition-colors">
                      <i className="fab fa-instagram text-primary"></i>
                    </a>
                    <a href="#" className="bg-primary/20 hover:bg-primary/30 p-2 rounded-full transition-colors">
                      <i className="fab fa-twitter text-primary"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-12 bg-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-['Poppins'] mb-3">Frequently Asked Questions</h2>
            <p className="text-dark/70 max-w-2xl mx-auto">Find answers to our most commonly asked questions.</p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-['Poppins'] font-medium text-lg mb-2">What is your age policy?</h3>
              <p className="text-dark/70">All customers must be 21 years of age or older to purchase vaping products. Valid ID is required for all purchases, both in-store and online.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-['Poppins'] font-medium text-lg mb-2">Do you offer shipping?</h3>
              <p className="text-dark/70">Yes, we offer nationwide shipping for all products. Orders typically ship within 1-2 business days and arrive within 3-5 business days.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-['Poppins'] font-medium text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-dark/70">We accept all major credit cards, debit cards, and cash for in-store purchases. Online payments are processed securely through our payment gateway.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-['Poppins'] font-medium text-lg mb-2">What is your return policy?</h3>
              <p className="text-dark/70">We accept returns within 14 days of purchase for unused and unopened products. Please contact us for more information on our return process.</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ContactPage;
