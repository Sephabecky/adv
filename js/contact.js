document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      fullName: document.getElementById("contactName").value.trim(),
      phone: document.getElementById("contactPhone").value.trim(),
      email: document.getElementById("contactEmail").value.trim(),
      subject: document.getElementById("contactSubject").value,
      message: document.getElementById("contactMessage").value.trim()
    };

    // 🔴 REQUIRED FIX
    if (!payload.fullName || !payload.phone || !payload.subject || !payload.message) {
      alert("Please fill in all required fields");
      return;
    }

    const response = await fetch(
      "https://agronomy-backend-ehk1.onrender.com/api/contact",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to send message");
      return;
    }

    alert("Message sent successfully!");
    form.reset();
  });
});
