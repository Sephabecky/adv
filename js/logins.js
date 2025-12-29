
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  if (!form) {
    console.error("loginForm NOT found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ✅ GET VALUES FROM INPUTS
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    console.log("Sending:", email, password);

    try {
      const response = await fetch(
        "https://agronomy-backend-ehk1.onrender.com/api/logins",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Login successful");
        console.log(data);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Server not reachable");
    }
  });
});
