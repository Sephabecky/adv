document.addEventListener("DOMContentLoaded", () => {
  console.log("contact.js loaded");

  const form = document.getElementById("contactForm");
  if (!form) {
    console.error("❌ contactForm not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const payload = {
        fullName: document.getElementById("contactName").value.trim(),
        phone: document.getElementById("contactPhone").value.trim(),
        email: document.getElementById("contactEmail")?.value.trim() || "",
        subject: document.getElementById("contactSubject").value.trim(),
        message: document.getElementById("contactMessage").value.trim()
      };

      console.log("📤 Sending payload:", payload);

     const response = await fetch(
  "https://agronomy-backend-ehk1.onrender.com/api/contact",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }
);


      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Backend error:", data);
        alert(data.message || "Failed to send message");
        return;
      }

      alert("✅ Message sent successfully!");
      form.reset();

    } catch (error) {
      console.error("❌ Network error:", error);
      alert("Server not reachable. Try again later.");
    }
  });
});
