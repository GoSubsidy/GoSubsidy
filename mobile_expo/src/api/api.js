const BASE_URL = "http://192.168.1.5:4000";

fetch(`${BASE_URL}/ai/advice`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    income: 120000,
    category: "OBC",
    kyc: true
  })
})
.then(res => res.json())
.then(data => {
  console.log("AI Advice:", data);
})
.catch(err => console.log("Error:", err));
