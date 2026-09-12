import React from "react";

export default function Disclaimer() {
  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: "1000px" }}>
        <div className="mb-4">
          <span className="badge bg-primary-subtle text-primary px-3 py-2">
            GoSubsidy.com
          </span>
          <h1 className="mt-3 mb-2 fw-bold">Disclaimer</h1>
          <p className="text-muted mb-0">
            Important information regarding GoSubsidy services and third-party
            relationships.
          </p>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body p-4 p-md-5">
            <p>
              GoSubsidy.com is a private platform providing information,
              consultancy, documentation assistance, DPR preparation,
              subsidy/scheme assistance, application support, and related
              professional services, as applicable.
            </p>

            <p>
              GoSubsidy.com is <strong>not a government department, government
              authority, statutory body, bank, or financial institution</strong>,
              unless expressly stated otherwise for a particular service.
            </p>

            <p>
              The availability of information about any government scheme,
              subsidy, grant, incentive, loan, or other financial assistance
              does not constitute a guarantee that the customer will qualify
              for or receive such benefit.
            </p>

            <p>
              Final approval, sanction, release, reimbursement, or disbursement
              of any subsidy, grant, incentive, loan, or government benefit is
              solely at the discretion of the concerned government department,
              implementing agency, financial institution, bank, or other
              competent authority.
            </p>

            <p>
              GoSubsidy.com shall not be liable for any decision, delay,
              rejection, modification, suspension, discontinuation, change in
              eligibility criteria, change in government policy, non-availability
              of funds, portal downtime, administrative delay, inspection
              outcome, or other action taken by any government authority, bank,
              financial institution, or implementing agency.
            </p>

            <p>
              GoSubsidy.com also does not assume responsibility for transactions
              or contractual relationships independently entered into by
              customers with third-party service providers, suppliers,
              consultants, contractors, manufacturers, vendors, banks,
              financial institutions, logistics companies, packaging providers,
              machinery suppliers, technology providers, or other entities
              introduced, referenced, or encountered during the course of a
              service.
            </p>

            <p>
              Any such third-party relationship is entered into independently
              between the customer and the relevant third party. Customers are
              advised to independently verify the credentials, commercial
              terms, quality, pricing, warranties, representations, and other
              conditions of any third-party service provider before entering
              into a transaction.
            </p>

            <p>
              In the event of any dispute between a customer and a third party,
              GoSubsidy.com shall not be responsible for the third party&apos;s
              acts, omissions, representations, products, services, payment
              obligations, contractual performance, or liabilities, except to
              the extent required under applicable law.
            </p>

            <div className="border-top pt-4 mt-4">
              <h4 className="fw-bold">Acceptance of Terms</h4>
              <p className="mb-0">
                By using GoSubsidy.com, submitting an application, requesting a
                service, or making a payment through the platform, the customer
                acknowledges that they have read, understood, and agreed to
                these Payment Terms &amp; Conditions and Disclaimer.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-muted small">
          GoSubsidy.com &mdash; Business &amp; Financial Services
        </div>
      </div>
    </div>
  );
}
