const API_BASE_URL=
    "https://agronomy-backend-ehk1.onrender.com";
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrorMessages();

    if (!validateForm()) return;

    const submitBtn = contactForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const formData = {
      name: document.getElementById("contactName").value.trim(),
      phone: document.getElementById("contactPhone").value.trim(),
      email: document.getElementById("contactEmail").value.trim(),
      subject: document.getElementById("contactSubject").value,
      message: document.getElementById("contactMessage").value.trim()
    };

    try {
      const response = await fetch(
        "https://agronomy-backend-ehk1.onrender.com/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      successMessage.style.display = "block";
      contactForm.reset();

    } catch (err) {
      showError("formError", err.message || "Failed to send message");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });

  function validateForm() {
    return true; // keep your existing validation here
  }

  function showError(id, msg) {
    document.getElementById(id).textContent = msg;
  }

  function clearErrorMessages() {
    document.querySelectorAll(".error-message").forEach(e => e.textContent = "");
  }
});
