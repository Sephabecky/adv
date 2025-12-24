
document.addEventListener("DOMContentLoaded", () => {
  console.log("contact.js loaded");

  const form = document.getElementById("contactForm");
  if (!form) {
    console.error("contactForm not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("FORM SUBMITTED");

    const nameInput = document.getElementById("contactName");
    const phoneInput = document.getElementById("contactPhone");
    const emailInput = document.getElementById("contactEmail");
    const subjectInput = document.getElementById("contactSubject");
    const messageInput = document.getElementById("contactMessage");

    if (!nameInput || !phoneInput || !subjectInput || !messageInput) {
      console.error("One or more inputs missing");
      return;
    }

    const payload = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput?.value.trim() || "Not provided",
      subject: subjectInput.value.trim(),
      message: messageInput.value.trim()
    };

    console.log("SENDING:", payload);

    try {
      const response = await fetch(
        "https://agronomy-backend-ehk1.onrender.com/api/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Message sent successfully!");
        form.reset();
      } else {
        alert("Failed to send message");
        console.error(data);
      }
    } catch (error) {
      console.error("NETWORK ERROR:", error);
      alert("Server not reachable");
    }
  });
});
