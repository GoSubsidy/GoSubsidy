import React, { useEffect, useRef, useState } from "react";

export default function OtpVerification({
  mobile,
  onVerified,
}) {

  const [otp, setOtp] = useState(["","","","","",""]);

  const [timer, setTimer] = useState(30);

  const [loading, setLoading] = useState(false);

  const inputs = useRef([]);

  useEffect(() => {

    if (timer === 0) return;

    const interval = setInterval(() => {

      setTimer((prev) => prev - 1);

    },1000);

    return () => clearInterval(interval);

  }, [timer]);

  const handleChange = (value,index) => {

    if(!/^[0-9]?$/.test(value)) return;

    const newOtp=[...otp];

    newOtp[index]=value;

    setOtp(newOtp);

    if(value && index<5){

      inputs.current[index+1].focus();

    }

  };

  const handleKeyDown=(e,index)=>{

    if(e.key==="Backspace" && !otp[index] && index>0){

      inputs.current[index-1].focus();

    }

  };

  const verifyOtp=()=>{

    if(otp.join("").length!==6){

      alert("Please enter 6 digit OTP");

      return;

    }

    setLoading(true);

    setTimeout(()=>{

      setLoading(false);

      onVerified();

    },2500);

  };

  const resendOtp=()=>{

    setTimer(30);

    setOtp(["","","","","",""]);

    inputs.current[0].focus();

  };

  return(

<div className="otp-screen">

<div className="container">

<div className="row justify-content-center">

<div className="col-lg-6">

<div className="otp-card">

<div className="otp-icon">

<i className="bi bi-phone-fill"></i>

</div>

<h2 className="fw-bold">

OTP Verification

</h2>

<p className="text-muted">

We've sent a 6 digit verification code to

</p>

<h5 className="fw-bold text-primary">

+91 {mobile}

</h5>

<div className="otp-inputs">

{

otp.map((digit,index)=>(

<input

key={index}

ref={(el)=>inputs.current[index]=el}

className="otp-input"

type="text"

maxLength="1"

value={digit}

onChange={(e)=>handleChange(e.target.value,index)}

onKeyDown={(e)=>handleKeyDown(e,index)}

/>

))

}

</div>

<button

className="btn btn-primary btn-lg verify-btn"

onClick={verifyOtp}

disabled={loading}

>

{

loading ?

<>

<span className="spinner-border spinner-border-sm me-2"></span>

Verifying...

</>

:

<>

Verify OTP

<i className="bi bi-arrow-right ms-2"></i>

</>

}

</button>

<div className="mt-4">

{

timer>0 ?

<p className="text-muted">

Resend OTP in

<strong>

{" "}00:{timer.toString().padStart(2,"0")}

</strong>

</p>

:

<button

className="btn btn-link"

onClick={resendOtp}

>

Resend OTP

</button>

}

</div>

<div className="secure-box mt-4">

<i className="bi bi-shield-lock-fill text-success me-2"></i>

OTP is securely encrypted.

</div>

</div>

</div>

</div>

</div>

</div>

);

}