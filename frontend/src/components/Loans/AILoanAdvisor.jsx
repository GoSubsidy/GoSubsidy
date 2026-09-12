import React, { useMemo, useState } from "react";

export default function AILoanAdvisor({
  loanType,
  applicantData = {},
  financialData = {},
  eligibilityResult = {},
}) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const suggestions = useMemo(() => {
    const items = [];

    if (!loanType) {
      items.push("Select the type of loan you require.");
    }

    if (!financialData.monthlyIncome && !financialData.annualTurnover) {
      items.push(
        "Complete your financial profile for a better assessment."
      );
    }

    if (
      eligibilityResult.score &&
      eligibilityResult.score < 65
    ) {
      items.push(
        "Review existing obligations and credit-profile issues before proceeding."
      );
    }

    if (
      eligibilityResult.score &&
      eligibilityResult.score >= 75
    ) {
      items.push(
        "Your preliminary profile appears suitable for lender matching."
      );
    }

    if (!items.length) {
      items.push(
        "Your application profile is ready for the next assessment stage."
      );
    }

    return items;
  }, [
    loanType,
    financialData,
    eligibilityResult,
  ]);

  const quickActions = [
    "Check my eligibility",
    "Which loan suits me?",
    "What documents do I need?",
    "How can I improve eligibility?",
  ];

  const askAdvisor = (text = question) => {
    const clean = text.trim();

    if (!clean) return;

    let response =
      "I can guide you using the information entered in your loan application.";

    const lower = clean.toLowerCase();

    if (lower.includes("eligib")) {
      response = eligibilityResult.status
        ? `Your current preliminary assessment is "${eligibilityResult.status}" with a profile score of ${eligibilityResult.score}/100. This is not a lender sanction.`
        : "Complete the financial and credit sections so I can provide a preliminary eligibility assessment.";
    }

    if (
      lower.includes("document") ||
      lower.includes("kyc")
    ) {
      response =
        "Typical documentation includes identity/address proof, PAN, bank statements and income evidence. Business and project loans can additionally require registration, tax, financial and project documents.";
    }

    if (
      lower.includes("improve") ||
      lower.includes("chance")
    ) {
      response =
        "Common areas to review include repayment history, existing EMI burden, documentation completeness, stable income or turnover, and accuracy of declared information.";
    }

    if (
      lower.includes("which loan") ||
      lower.includes("suits")
    ) {
      response = loanType
        ? `You selected ${loanType}. I will compare that requirement with your financial profile before recommending alternatives.`
        : "Select your financing purpose first so I can narrow the appropriate loan category.";
    }

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: clean,
      },
      {
        role: "assistant",
        text: response,
      },
    ]);

    setQuestion("");
  };

  return (
    <div className="application-form-card">

      <div className="application-section-title">
        <div className="section-number">
          <i className="bi bi-robot"></i>
        </div>

        <div>
          <span>GOSUBSIDY INTELLIGENCE</span>
          <h2>AI Loan Advisor</h2>
          <p>
            Smart application guidance throughout your loan
            journey.
          </p>
        </div>
      </div>

      <div className="special-loan-box">

        <h5>
          <i className="bi bi-stars me-2"></i>
          Application Intelligence
        </h5>

        {suggestions.map((item, index) => (
          <p key={index}>
            <i className="bi bi-check-circle me-2"></i>
            {item}
          </p>
        ))}

      </div>

      <div className="mt-4">
        <small className="fw-bold">
          QUICK AI ACTIONS
        </small>

        <div className="d-flex flex-wrap gap-2 mt-2">
          {quickActions.map((action) => (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              key={action}
              onClick={() => askAdvisor(action)}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      <div
        className="mt-4 p-3 rounded"
        style={{
          background: "#f6f8fc",
          minHeight: "220px",
          maxHeight: "350px",
          overflowY: "auto",
        }}
      >

        {!messages.length && (
          <div>
            <strong>
              <i className="bi bi-robot me-2"></i>
              GoSubsidy Advisor
            </strong>

            <p className="mt-2 mb-0">
              Welcome. Complete your application and I will help
              identify missing information, assess the declared
              profile and guide you toward suitable financing
              options.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-3 ${
              message.role === "user"
                ? "text-end"
                : "text-start"
            }`}
          >
            <div
              className="d-inline-block p-3 rounded"
              style={{
                maxWidth: "85%",
                background:
                  message.role === "user"
                    ? "#e7f0ff"
                    : "#ffffff",
              }}
            >
              {message.text}
            </div>
          </div>
        ))}

      </div>

      <div className="input-group mt-3">

        <input
          className="form-control"
          placeholder="Ask GoSubsidy about your loan..."
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              askAdvisor();
            }
          }}
        />

        <button
          type="button"
          className="btn btn-primary px-4"
          onClick={() => askAdvisor()}
        >
          <i className="bi bi-send-fill me-2"></i>
          Ask
        </button>

      </div>

      <small className="text-muted d-block mt-3">
        Guidance is preliminary and does not constitute a loan
        sanction, credit decision or guarantee of approval.
      </small>

    </div>
  );
}