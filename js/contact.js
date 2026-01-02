document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form values
    const payload = {
      fullname: document.getElementById("contactName").value.trim(),
      phonenumber: document.getElementById("contactPhone").value.trim(),
      emailaddress: document.getElementById("contactEmail").value.trim() || "Not provided",
      subject: document.getElementById("contactSubject").value,
      message: document.getElementById("contactMessage").value.trim(),
    };

    console.log("Payload to send:", payload); // Debug payload in console

    // Front-end validation
    if (!payload.fullname || !payload.phonenumber || !payload.subject || !payload.message) {
      alert("Please fill in all required fields.");
      return;
    }

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
