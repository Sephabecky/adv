document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      fullName: document.getElementById("contactName").value.trim(),
      phone: document.getElementById("contactPhone").value.trim(),
      email: document.getElementById("contactEmail").value.trim() || "Not provided",
      subject: document.getElementById("contactSubject").value,
      message: document.getElementById("contactMessage").value.trim(),
    };

    // Simple front-end validation
    if (!payload.fullName || !payload.phone || !payload.subject || !payload.message) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("https://agronomy-backend-ehk1.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        alert(errorData.message || "Failed to send message");
        return;
      }

      alert("Message sent successfully!");
      form.reset();

    } catch (err) {
      console.error("Network error:", err);
      alert("Server not reachable");
    }
  });
});
