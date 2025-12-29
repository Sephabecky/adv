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

    if (!nameInput || !phoneInput || !emailInput || !subjectInput || !messageInput) {
      console.error("One or more inputs missing");
      return;
    }

    // Build the payload correctly
    const payload = {
      fullName: nameInput.value,
      phoneNumber: phoneInput.value,
      emailaddress: emailInput.value,
      subject: subjectInput.value,
      message: messageInput.value
    };

    console.log("SENDING:", payload);

    try {
      const response = await fetch(
        "https://agronomy-backend-ehk…r.com/api/contact", 
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
      );


      if (response.ok) {
        const text=await response.text();
        console.error("SERVER ERROR:",text();
        alert("Backend error.check console.");
        return;
      }

      comst data=await response.json();
      alert("message sent successfully!");
      form.reset();

    }catch(error){
      console.error("Network error:",error);
      alert("server not reachable");
    }
        
