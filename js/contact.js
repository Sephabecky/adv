document.addEventListener("DOMContentLoaded", () => {
  console.log("contact.js loaded");

  const form = document.getElementById("contactForm");
  if (!form) {
    console.error("contactForm not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      fullname: document.getElementById("contactName").value.trim(),
      phonenumber: document.getElementById("contactPhone").value.trim(),
      emailaddress: document.getElementById("contactEmail")?.value.trim() || "Not provided",
      subject: document.getElementById("contactSubject").value.trim(),
      message: document.getElementById("contactMessage").value.trim()
    };

    console.log("Sending payload:", payload);

    const API_URL = "https://agronomy-backend-ehk1.onrender.com/api/contact";
    
const response = await fetch("https://agronomy-backend-ehk…r.com/api/contact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    fullName: nameInput.value,
    phoneNumber: phoneInput.value,
    email: emailInput.value,
    subject: subjectInput.value,
    message: messageInput.value
  })
});

   
      if (!response.ok) {
        const errorText = await response.text();
        console,error("Backend error:",data);
        alert(data.message||"Failed to send message");
        return;
      }

      
      alert("Message sent successfully!");
      form.reset();

    } catch (error) {
      console.error("Network error:", error);
      alert("Server not reachable");
    }
  });
});
