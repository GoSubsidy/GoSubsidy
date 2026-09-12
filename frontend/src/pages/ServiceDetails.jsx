import React from "react";
import { Link, useParams } from "react-router-dom";
import { findServiceBySlug } from "../data/services";
import "../styles/ServiceDetails.css";

export default function ServiceDetails(){
  const {slug}=useParams();
  const service=findServiceBySlug(slug);
  if(!service) return <main className="gs-service-page"><div className="container py-5"><div className="gs-service-card text-center"><h1>Service Not Found</h1><Link to="/" className="btn btn-primary">Back to Home</Link></div></div></main>;
  return <main className="gs-service-page">
    <section className="gs-service-hero"><div className="container">
      <div className="gs-breadcrumb"><Link to="/">Home</Link><span>/</span><span>{service.category}</span><span>/</span><strong>{service.name}</strong></div>
      <span className="gs-service-category">{service.category}</span>
      <h1>{service.name}</h1>
      <p>Professional assistance for <strong>{service.name}</strong> through GoSubsidy.</p>
      <button className="btn gs-primary-btn">Apply Now</button>
      <Link to="/contact" className="btn gs-secondary-btn ms-2">Talk to GoSubsidy</Link>
    </div></section>
    <section className="container py-5"><div className="gs-service-card">
      <h2>About {service.name}</h2>
      <p>This is the dedicated GoSubsidy detail page for this service. Service-specific eligibility, documents, process, pricing, timelines and FAQs can be added here without changing the navbar.</p>
      <div className="gs-info-grid"><div><span>Category</span><strong>{service.category}</strong></div><div><span>Service</span><strong>{service.name}</strong></div><div><span>Online Assistance</span><strong>Available</strong></div><div><span>Application</span><strong>Start Online</strong></div></div>
    </div></section>
  </main>;
}
