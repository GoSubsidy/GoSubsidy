import React from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/ServiceCategory.css";

const DATA={
startups:["Startup Services",10,"bi-rocket-takeoff-fill",["Proprietorship","Partnership","One Person Company","Limited Liability Partnership","Private Limited Company","Section 8 Company","Trust Registration","Public Limited Company","Producer Company","Indian Subsidiary"]],
registrations:["Registration Services",28,"bi-clipboard2-check-fill",["Startup India","Trade License","FSSAI Registration","FSSAI License","Halal License & Certification","ICEGATE Registration","Import Export Code","Legal Entity Identifier Code","ISO Registration","PF Registration","ESI Registration","Professional Tax Registration","RCMC Registration","TN RERA Registration for Agents","12A and 80G Registration","12A Registration","80G Registration","Barcode Registration","BIS Registration","Certificate of Incumbency","Darpan Registration","Digital Signature","Shop Act Registration","Udyam Registration","Fire License","Legal Name Change","Water Testing","Food Testing"]],
trademark:["Trademark & IP Services",17,"bi-shield-fill",["Trademark Registration","Trademark Objection","Trademark Certificate","Trademark Opposition","Trademark Hearing","Trademark Rectification","TM Infringement Notice","Trademark Renewal","Trademark Transfer","Expedited TM Registration","Logo Designing","Design Registration","Design Objection","Copyright Registration","Copyright Objection","Patent Registration","Trademark Protection"]],
gst:["GST Services",10,"bi-receipt-cutoff",["GST Registration","GST Return Filing by Accountant","GST LUT Form","GST Notice","GST Annual Return Filing (GSTR-9)","GST Registration for Foreigners","GST Amendment","GST Revocation","GSTR-10","Virtual Office + GSTIN"]],
"income-tax":["Income Tax Services",10,"bi-calculator-fill",["Income Tax E-Filing","Business ITR Filing","Partnership Firm / LLP ITR","Company ITR Filing","Trust / NGO Tax Filing","15CA - 15CB Filing","TAN Registration","TDS Return Filing","Income Tax Notice","Revised ITR Return (ITR-U)"]],
mca:["MCA Services",22,"bi-buildings-fill",["Company Compliance","LLP Compliance","OPC Compliance","Name Change - Company","Registered Office Change","DIN eKYC Filing","DIN Reactivation","Director Change","Remove Director","ADT-1 Filing","DPT-3 Filing","LLP Form 11 Filing","Dormant Status Filing","MOA Amendment","AOA Amendment","Authorized Capital Increase","Share Transfer","Demat of Shares","Winding Up - LLP","Winding Up - Company","Commencement (INC-20A)","CCFS Scheme"]],
compliance:["Compliance Services",13,"bi-clipboard2-check",["FDI Filing","ODI Filing","FLA Return Filing","FSSAI Renewal","FSSAI Return Filing","Business Plan","HR & Payroll","PF Return Filing","ESI Return Filing","Professional Tax Return Filing","Partnership Compliance","Proprietorship Compliance","Bookkeeping"]],
consultation:["Consultation Services",2,"bi-person-fill",["CA Consultation","Legal Consultation"]],
global:["Global Services",5,"bi-globe2",["UAE Company Registration","USA Company Registration","Singapore Business Setup","UK Company Registration","USA Trademark Registration"]]
};

export default function ServiceCategory(){
 const {category}=useParams(); const d=DATA[category]||DATA.startups;
 return <main className="gs-service-page"><div className="gs-service-shell">
  <div className="gs-service-top"><Link to="/"><i className="bi bi-arrow-left"/> Dashboard</Link><b>{d[1]} Services</b></div>
  <header><span className="gs-service-icon"><i className={`bi ${d[2]}`}/></span><div><small>GOSUBSIDY SERVICES</small><h1>{d[0]}</h1><p>Select a service to open its workflow.</p></div></header>
  <section className="gs-slider"><div className="gs-slider-head"><h2>Explore Services</h2><div><button onClick={()=>document.querySelector(".gs-track")?.scrollBy({left:-450,behavior:"smooth"})}><i className="bi bi-chevron-left"/></button><button onClick={()=>document.querySelector(".gs-track")?.scrollBy({left:450,behavior:"smooth"})}><i className="bi bi-chevron-right"/></button></div></div>
   <div className="gs-track">{d[3].map((name,i)=><Link to={`/service/${category}/${i+1}`} className="gs-service-card" key={name}><small>{String(i+1).padStart(2,"0")}</small><span><i className="bi bi-arrow-up-right"/></span><h3>{name}</h3><b>Explore Service <i className="bi bi-arrow-right"/></b></Link>)}</div>
  </section>
 </div></main>
}
