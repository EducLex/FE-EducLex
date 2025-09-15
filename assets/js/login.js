// login.js
document.addEventListener("DOMContentLoaded", () => {
  const loginFormEl = document.getElementById("loginForm");
  const alertContainer = document.getElementById("alert-container");

  function showAlert(message, type = "error") {
    if (!alertContainer) return;

    alertContainer.innerHTML = `
      <div class="alert ${type}">
        ${message}
      </div>
    `;

    setTimeout(() => {
      alertContainer.innerHTML = "";
    }, 4000);
  }

  if (loginFormEl) {
    loginFormEl.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      try {
        const response = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          showAlert(data.error || "❌ Username atau password salah!", "error");
          return;
        }

        // Simpan token dan user
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        localStorage.setItem("user", JSON.stringify({ username }));

        showAlert(`✅ ${data.message} | Selamat datang, ${username}!`, "success");

        // Redirect ke beranda
        setTimeout(() => {
          window.location.href = "index.html"; 
        }, 1200);

      } catch (error) {
        console.error("Error:", error);
        showAlert("❌ Gagal terhubung ke server!", "error");
      }
    });
  }

  // Tombol Google (dummy)
  document.querySelectorAll(".google-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("🚀 Fitur Login/Daftar Google belum aktif. (Hanya tampilan)");
    });
  });
});
