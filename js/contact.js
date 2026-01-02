const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      fullname: document.getElementById("contactName").value.trim(),
      phonenumber: document.getElementById("contactPhone").value.trim(),
      emailaddress: document.getElementById("contactEmail").value.trim() || "Not provided",
      subject: document.getElementById("contactSubject").value,
      message: document.getElementById("contactMessage").value.trim(),
    };

    const termsChecked = document.getElementById("contactTerms").checked;

    if (!payload.fullname) return alert("Please enter your full name.");
    if (!payload.phonenumber) return alert("Please enter your phone number.");
    if (!payload.subject) return alert("Please select a subject.");
    if (!payload.message) return alert("Please enter a message.");
    if (!termsChecked) return alert("You must agree to the Terms of Service and Privacy Policy.");

    console.log("Payload to send:", payload);

    try {
      const response = await fetch("https://agronomy-backend-ehk1.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Backend error:", data);
        return alert(data.message || "Failed to send message");
      }

      console.log("Backend response:", data);
      alert("Message sent successfully!");
      form.reset();
    } catch (err) {
      console.error("Network error:", err);
      alert("Server not reachable. Please try again later.");
    }
  });
}
