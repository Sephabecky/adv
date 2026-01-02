document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Build payload to match backend field names
    const payload = {
      fullname: document.getElementById("contactName").value.trim(),
      phonenumber: document.getElementById("contactPhone").value.trim(),
      emailaddress: document.getElementById("contactEmail").value.trim() || "Not provided",
      subject: document.getElementById("contactSubject").value,
      message: document.getElementById("contactMessage").value.trim(),
    };

    // Check if Terms checkbox is checked
    const termsChecked = document.getElementById("contactTerms").checked;

    // Front-end validation
    if (!payload.fullname) {
      alert("Please enter your full name.");
      return;
    }
    if (!payload.phonenumber) {
      alert("Please enter your phone number.");
      return;
    }
    if (!payload.subject) {
      alert("Please select a subject.");
      return;
    }
    if (!payload.message) {
      alert("Please enter a message.");
      return;
    }
    if (!termsChecked) {
      alert("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    console.log("Payload to send:", payload);
console.log({
  fullname: payload.fullname,
  phonenumber: payload.phonenumber,
  emailaddress: payload.emailaddress,
  subject: payload.subject,
  message: payload.message,
  termsChecked: termsChecked
});

    try {
      
      const response = await fetch("https://agronomy-backend-ehk1.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        alert(errorData.message || "Failed to send message");
        return;
      }

      const data = await response.json();
      console.log("Backend response:", data);

      alert("Message sent successfully!");
      form.reset();
    } catch (err) {
      console.error("Network error:", err);
      alert("Server not reachable. Please try again later.");
    }
  });
});
