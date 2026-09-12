import React, { useEffect, useRef, useState } from "react";
import "../styles/Contact.css";

const SUPPORT_TOPICS = [
  {
    icon: "bi-bank",
    title: "Government Schemes",
    text: "Help finding schemes, subsidies, incentives and eligibility information.",
  },
  {
    icon: "bi-file-earmark-text",
    title: "DPR & Project Support",
    text: "Questions about DPR preparation, project information and documentation.",
  },
  {
    icon: "bi-credit-card",
    title: "Loans & Finance",
    text: "General assistance regarding loan-related information and financial tools.",
  },
  {
    icon: "bi-shield-check",
    title: "Insurance",
    text: "Questions about insurance-related information and service connections.",
  },
];

const FAQS = [
  {
    question: "How can GoSubsidy help me find a government scheme?",
    answer:
      "You can explore government schemes through the GoSubsidy platform and provide information about your business, project or requirements. GoSubsidy may help identify potentially relevant schemes based on the information available.",
  },
  {
    question: "Does GoSubsidy guarantee subsidy approval?",
    answer:
      "No. GoSubsidy does not guarantee subsidy, incentive or government benefit approval. Final eligibility and approval are determined by the relevant government department, authority or implementing agency.",
  },
  {
    question: "Can GoSubsidy guarantee a loan?",
    answer:
      "No. Loan approval is subject to the policies, assessment and decision of the relevant lender or financial institution.",
  },
  {
    question: "Can I contact GoSubsidy for DPR assistance?",
    answer:
      "Yes. You can use the support form on this page to submit your enquiry regarding DPR and project-related assistance.",
  },
  {
    question: "How can I report incorrect information?",
    answer:
      "Please contact us with the scheme name, page URL and details of the information that you believe may be incorrect. We can review the information and make appropriate corrections where required.",
  },
];

function Contact() {
  const supportFormRef = useRef(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);


  const scrollToSupport = () => {
    if (supportFormRef.current) {
      const navbarOffset = 95;
      const top =
        supportFormRef.current.getBoundingClientRect().top +
        window.scrollY -
        navbarOffset;

      window.scrollTo({
        top: Math.max(0, top),
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    /*
      Frontend-only version.

      Later this form can be connected to:
      - Supabase
      - Email service
      - Backend API
      - Support ticket system
    */

    console.log("GoSubsidy Support Request:", formData);

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      phone: "",
      topic: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="contact-hero">

        <div className="container">

          <div className="contact-hero-inner">

            <div className="contact-badge">
              <i className="bi bi-headset"></i>
              GoSubsidy Support Center
              <span className="contact-live-dot"></span>
            </div>

            <h1>
              How can we
              <span>help you?</span>
            </h1>

            <p>
              Have a question about government schemes, subsidies,
              DPR preparation, loans or GoSubsidy services?
              Our support team is here to help.
            </p>

            <div className="contact-hero-actions">

              <button
                type="button"
                onClick={scrollToSupport}
                className="contact-primary-btn"
              >
                <i className="bi bi-chat-dots"></i>
                Contact Support
              </button>

              <a
                href="mailto:info@gosubsidy.com"
                className="contact-secondary-btn"
              >
                <i className="bi bi-envelope"></i>
                Email Us
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SUPPORT TOPICS
      ====================================================== */}

      <section className="contact-topics-section">

        <div className="container">

          <div className="contact-section-heading">

            <span>SUPPORT OPTIONS</span>

            <h2>
              What can we
              <strong>help with?</strong>
            </h2>

            <p>
              Choose a support area or send us your enquiry directly.
            </p>

          </div>


          <div className="contact-topic-grid">

            {SUPPORT_TOPICS.map((topic) => (
              <div
                className="contact-topic-card"
                key={topic.title}
              >

                <div className="contact-topic-icon">
                  <i className={`bi ${topic.icon}`}></i>
                </div>

                <div>

                  <h3>{topic.title}</h3>

                  <p>{topic.text}</p>

                  <button
                    type="button"
                    className="contact-topic-support-btn"
                    onClick={scrollToSupport}
                  >
                    Get Support
                    <i className="bi bi-arrow-right"></i>
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT AREA
      ====================================================== */}

      <section

        className="contact-main-section"
        id="support-form"
        ref={supportFormRef}
      >

        <div className="container">

          <div className="contact-main-grid">

            {/* LEFT INFORMATION */}

            <div className="contact-info">

              <span className="contact-overline">
                SUPPORT
              </span>

              <h2>
                Let's solve it
                <strong>together.</strong>
              </h2>

              <p className="contact-info-intro">
                Tell us what you need help with. Provide as much
                information as possible and our team can better
                understand your enquiry.
              </p>


              {/* EMAIL */}

              <a
                href="mailto:info@gosubsidy.com"
                className="contact-info-card"
              >

                <div className="contact-info-icon">
                  <i className="bi bi-envelope"></i>
                </div>

                <div>
                  <span>Email Support</span>
                  <strong>info@gosubsidy.com</strong>
                  <small>
                    Send us your enquiry anytime.
                  </small>
                </div>

                <i className="bi bi-arrow-up-right contact-info-arrow"></i>

              </a>


              {/* PHONE */}

              <a
                href="tel:+919700273666"
                className="contact-info-card"
              >

                <div className="contact-info-icon">
                  <i className="bi bi-telephone"></i>
                </div>

                <div>
                  <span>Support</span>
                  <strong>+91 9700273666</strong>
                  <small>
                    For support and general enquiries.
                  </small>
                </div>

                <i className="bi bi-arrow-up-right contact-info-arrow"></i>

              </a>


              {/* LOCATION */}

              <div className="contact-info-card">

                <div className="contact-info-icon">
                  <i className="bi bi-geo-alt"></i>
                </div>

                <div>
                  <span>Location</span>
                  <strong>Hyderabad, Telangana</strong>
                  <small>
                    India
                  </small>
                </div>

              </div>


              {/* RESPONSE */}

              <div className="contact-response-card">

                <div className="contact-response-icon">
                  <i className="bi bi-lightning-charge-fill"></i>
                </div>

                <div>
                  <strong>Need quick help?</strong>

                  <p>
                    For faster support, include your name,
                    registered email, service category and
                    a short description of your issue.
                  </p>
                </div>

              </div>

            </div>


            {/* FORM */}

            <div className="contact-form-card">

              <div className="contact-form-header">

                <div>
                  <span>SUPPORT REQUEST</span>

                  <h3>
                    Send us a message
                  </h3>
                </div>

                <div className="contact-form-lock">
                  <i className="bi bi-shield-check"></i>
                </div>

              </div>


              {submitted ? (

                <div className="contact-success">

                  <div className="contact-success-icon">
                    <i className="bi bi-check-lg"></i>
                  </div>

                  <h3>
                    Request received!
                  </h3>

                  <p>
                    Thank you for contacting GoSubsidy.
                    Your support request has been recorded.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Request
                  </button>

                </div>

              ) : (

                <form onSubmit={handleSubmit}>

                  <div className="contact-form-row">

                    <div className="contact-field">

                      <label htmlFor="name">
                        Full Name
                      </label>

                      <div className="contact-input">

                        <i className="bi bi-person"></i>

                        <input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />

                      </div>

                    </div>


                    <div className="contact-field">

                      <label htmlFor="email">
                        Email Address
                      </label>

                      <div className="contact-input">

                        <i className="bi bi-envelope"></i>

                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />

                      </div>

                    </div>

                  </div>


                  <div className="contact-form-row">

                    <div className="contact-field">

                      <label htmlFor="phone">
                        Mobile Number
                      </label>

                      <div className="contact-input">

                        <i className="bi bi-phone"></i>

                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+91"
                          value={formData.phone}
                          onChange={handleChange}
                        />

                      </div>

                    </div>


                    <div className="contact-field">

                      <label htmlFor="topic">
                        Support Category
                      </label>

                      <div className="contact-input">

                        <i className="bi bi-grid"></i>

                        <select
                          id="topic"
                          name="topic"
                          value={formData.topic}
                          onChange={handleChange}
                          required
                        >

                          <option value="">
                            Select category
                          </option>

                          <option value="Government Schemes">
                            Government Schemes
                          </option>

                          <option value="DPR & Project Support">
                            DPR & Project Support
                          </option>

                          <option value="Loans & Finance">
                            Loans & Finance
                          </option>

                          <option value="Insurance">
                            Insurance
                          </option>

                          <option value="Website / Account">
                            Website / Account
                          </option>

                          <option value="Other">
                            Other
                          </option>

                        </select>

                        <i className="bi bi-chevron-down contact-select-arrow"></i>

                      </div>

                    </div>

                  </div>


                  <div className="contact-field">

                    <label htmlFor="message">
                      How can we help?
                    </label>

                    <div className="contact-textarea">

                      <i className="bi bi-chat-left-text"></i>

                      <textarea
                        id="message"
                        name="message"
                        rows="6"
                        placeholder="Describe your question or issue..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>

                    </div>

                  </div>


                  <div className="contact-form-footer">

                    <div className="contact-privacy-note">

                      <i className="bi bi-shield-check"></i>

                      <span>
                        Please do not submit passwords,
                        OTPs or highly sensitive financial
                        information through this form.
                      </span>

                    </div>

                    <button
                      type="submit"
                      className="contact-submit-btn"
                    >
                      Send Request
                      <i className="bi bi-arrow-right"></i>
                    </button>

                  </div>

                </form>

              )}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FAQ
      ====================================================== */}

      <section className="contact-faq-section">

        <div className="container">

          <div className="contact-section-heading">

            <span>COMMON QUESTIONS</span>

            <h2>
              Frequently asked
              <strong>questions.</strong>
            </h2>

            <p>
              Quick answers to common questions about GoSubsidy.
            </p>

          </div>


          <div className="contact-faq-list">

            {FAQS.map((faq, index) => {

              const isOpen = openFaq === index;

              return (
                <div
                  className={`contact-faq-item ${
                    isOpen ? "open" : ""
                  }`}
                  key={faq.question}
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
                  >

                    <span>
                      <b>
                        {String(index + 1).padStart(2, "0")}
                      </b>

                      {faq.question}
                    </span>

                    <i
                      className={`bi ${
                        isOpen
                          ? "bi-dash"
                          : "bi-plus"
                      }`}
                    ></i>

                  </button>


                  {isOpen && (
                    <div className="contact-faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}

                </div>
              );

            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          DISCLAIMER
      ====================================================== */}

      <section className="contact-disclaimer">

        <div className="container">

          <div className="contact-disclaimer-inner">

            <div className="contact-disclaimer-icon">
              <i className="bi bi-info-circle"></i>
            </div>

            <div>

              <strong>
                Important information
              </strong>

              <p>
                GoSubsidy is an independent technology platform.
                Information provided through the platform is for
                general guidance and scheme discovery. Government
                scheme eligibility, subsidy approval, loan approval,
                insurance decisions and other financial outcomes are
                subject to the respective authority, lender, insurer
                or institution.
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Contact;