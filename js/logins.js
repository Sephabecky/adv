
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  console.log("Form found:", form);

  if (!form) {
    console.error("loginForm NOT found in HTML");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Login form submitted");
  });
});
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const response = await fetch(
    "https://agronomy-backend-ehk1.onrender.com/api/logins",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    }
  );

  const result = await response.json();

  if (response.ok) {
    localStorage.setItem("user", JSON.stringify(result.user));
    window.location.href = "dashboard.html";
  } else {
    alert(result.message);
  }
});
