import React from "react";

export default function PaymentTerms() {
  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: "1000px" }}>
        <div className="mb-4">
          <span className="badge bg-primary-subtle text-primary px-3 py-2">
            GoSubsidy.com
          </span>
          <h1 className="mt-3 mb-2 fw-bold">Payment Terms &amp; Conditions</h1>
          <p className="text-muted mb-0">
            Please read these terms carefully before making a payment through
            GoSubsidy.com.
          </p>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body p-4 p-md-5">
            <section className="mb-4">
              <h4 className="fw-bold">1. Payment Processing</h4>
              <ul>
                <li>
                  All payments made on <strong>GoSubsidy.com</strong> are
                  processed exclusively through our authorized Payment Gateway
                  Providers.
                </li>
                <li>
                  GoSubsidy.com does not store or process customers&apos; card,
                  banking, UPI, or other payment credentials directly.
                </li>
                <li>
                  Once a payment is initiated, the transaction is subject to
                  the policies and processing procedures of the respective
                  Payment Gateway Provider and banking network.
                </li>
                <li>
                  If a payment has been debited but the payment status is not
                  reflected on GoSubsidy.com, please allow{" "}
                  <strong>24–48 hours</strong> for payment realization and
                  reconciliation.
                </li>
                <li>
                  If the issue remains unresolved, contact{" "}
                  <strong>info@gosubsidy.com</strong> with the relevant
                  transaction details.
                </li>
              </ul>
            </section>

            <section className="mb-4">
              <h4 className="fw-bold">2. Taxes</h4>
              <ul>
                <li>
                  Applicable taxes, including GST and other statutory taxes or
                  charges, shall be levied as applicable under prevailing
                  Indian laws.
                </li>
                <li>
                  The applicable tax amount, wherever required, will be
                  displayed during payment or reflected in the applicable
                  invoice.
                </li>
                <li>
                  Tax rates may change from time to time in accordance with
                  applicable government regulations.
                </li>
              </ul>
            </section>

            <section className="mb-4">
              <h4 className="fw-bold">3. Duplicate Payments</h4>
              <ul>
                <li>
                  If a customer unintentionally makes a duplicate payment for
                  the same service, the customer must report it to{" "}
                  <strong>info@gosubsidy.com</strong>.
                </li>
                <li>
                  Please provide the transaction ID, payment date, amount,
                  registered mobile number/email address, and other information
                  reasonably required for verification.
                </li>
                <li>
                  Duplicate payments are subject to verification and
                  reconciliation with the applicable Payment Gateway Provider.
                </li>
                <li>
                  Payment discrepancies may take <strong>24–48 hours</strong>{" "}
                  to identify and reconcile.
                </li>
              </ul>
            </section>

            <section className="mb-4">
              <h4 className="fw-bold">4. Service Fees and Non-Refundable Charges</h4>
              <ul>
                <li>
                  Fees paid for services offered through GoSubsidy.com,
                  including subsidy assistance, DPR preparation, project
                  reports, consultancy, documentation support, application
                  assistance, professional services, and other paid services,
                  are generally <strong>non-refundable once the service has
                  been initiated or work has commenced</strong>.
                </li>
                <li>
                  Where applicable, GoSubsidy.com may consider a refund or
                  adjustment on a case-by-case basis, subject to the nature of
                  the service, work already completed, third-party costs
                  incurred, and applicable law.
                </li>
                <li>
                  Government fees, statutory fees, application fees, portal
                  charges, professional charges of third parties, or other
                  amounts paid on behalf of the customer may be non-refundable
                  where already incurred or remitted.
                </li>
              </ul>
            </section>

            <section className="mb-4">
              <h4 className="fw-bold">5. Cancellation Policy</h4>
              <ul>
                <li>
                  Once payment has been successfully made and work has
                  commenced, cancellation of the relevant service may not be
                  permitted.
                </li>
                <li>
                  Customers wishing to cancel before work commences should
                  contact <strong>info@gosubsidy.com</strong> as soon as
                  possible.
                </li>
                <li>
                  Any cancellation, refund, adjustment, or transfer request
                  will be considered according to the applicable service terms
                  and the stage at which the work has reached.
                </li>
                <li>
                  Cancellation does not guarantee a refund where costs,
                  professional work, documentation, processing, or third-party
                  services have already been incurred.
                </li>
              </ul>
            </section>

            <section className="mb-4">
              <h4 className="fw-bold">6. Service Delivery and Customer Responsibilities</h4>
              <ul>
                <li>
                  Customers are responsible for providing complete, accurate,
                  and genuine information and documents required for the
                  selected service.
                </li>
                <li>
                  GoSubsidy.com shall not be responsible for delays, rejection,
                  modification, or non-processing resulting from incorrect,
                  incomplete, misleading, outdated, or delayed information or
                  documents provided by the customer.
                </li>
                <li>
                  Customers are responsible for reviewing documents,
                  applications, DPRs, financial information, and other
                  materials provided to them and promptly communicating any
                  corrections required.
                </li>
              </ul>
            </section>

            <section className="mb-4">
              <h4 className="fw-bold">7. Government Subsidy / Scheme Approval</h4>
              <ul>
                <li>
                  Payment for a GoSubsidy.com service does{" "}
                  <strong>not constitute a guarantee</strong> of subsidy
                  approval, loan sanction, grant approval, reimbursement,
                  incentive, or any other financial benefit.
                </li>
                <li>
                  Approval is solely subject to the eligibility criteria,
                  policies, guidelines, availability of funds, documentation
                  requirements, scrutiny, inspection, and final decision of
                  the concerned authority.
                </li>
                <li>
                  GoSubsidy.com provides assistance and related professional
                  services as applicable, but does not control the final
                  decision of any government authority or financial institution.
                </li>
              </ul>
            </section>

            <section className="mb-4">
              <h4 className="fw-bold">8. Changes to Service Fees</h4>
              <ul>
                <li>
                  GoSubsidy.com reserves the right to modify its service fees,
                  pricing structure, packages, or service offerings from time
                  to time.
                </li>
                <li>
                  The applicable fee will be communicated/displayed before
                  payment.
                </li>
                <li>
                  Pricing changes will not affect a service for which payment
                  has already been successfully completed, except where
                  additional work, scope changes, government charges, statutory
                  taxes, or customer-requested modifications create additional
                  applicable costs.
                </li>
              </ul>
            </section>

            <section className="mb-4">
              <h4 className="fw-bold">9. Payment Confirmation</h4>
              <ul>
                <li>
                  A payment receipt, invoice, order confirmation, or payment
                  acknowledgement may be provided electronically through the
                  registered email address, mobile number, GoSubsidy.com
                  account, or other applicable communication channel.
                </li>
                <li>
                  Customers should retain their transaction/reference number
                  and payment confirmation for future communication regarding
                  the service.
                </li>
              </ul>
            </section>

            <section>
              <h4 className="fw-bold">10. Important Note</h4>
              <p>
                By submitting a payment through <strong>GoSubsidy.com</strong>,
                you acknowledge that you have read, understood, and agreed to
                these Payment Terms &amp; Conditions.
              </p>
              <p className="mb-0">
                These terms may be updated, modified, or amended by GoSubsidy.com
                from time to time. The updated version published on the website
                shall become applicable from the effective date specified
                therein.
              </p>
            </section>
          </div>
        </div>

        <div className="text-center mt-4 text-muted small">
          Payment-related assistance:{" "}
          <strong>info@gosubsidy.com</strong>
        </div>
      </div>
    </div>
  );
}
