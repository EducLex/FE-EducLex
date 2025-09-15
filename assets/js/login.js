document.addEventListener("DOMContentLoaded", () => {
  const loginFormEl = document.getElementById("loginForm");
  const alertContainer = document.getElementById("alert-container");

  // 🔹 otomatis pilih BE sesuai host FE (localhost / 127.0.0.1)
  const feHost = window.location.hostname; 
  const apiBase = `http://${feHost}:8080`; // contoh: http://localhost:8080 atau http://127.0.0.1:8080

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
        const response = await fetch(`${apiBase}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
          credentials: "include"
        });

        let data = {};
        try {
          if (response.headers.get("content-type")?.includes("application/json")) {
            data = await response.json();
          } else {
            data = { message: await response.text() };
          }
        } catch (err) {
          console.warn("Respon bukan JSON valid:", err);
        }

        if (!response.ok) {
          showAlert(data.error || data.message || "❌ Username atau password salah!", "error");
          return;
        }

        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        localStorage.setItem("user", JSON.stringify({ username }));

        showAlert(
          `✅ ${data.message || "Login berhasil"} | Selamat datang, ${username}!`,
          "success"
        );

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1200);

      } catch (error) {
        console.error("Error:", error);
        showAlert("❌ Gagal terhubung ke server! Pastikan backend jalan di port 8080.", "error");
      }
    });
  }

  document.querySelectorAll(".google-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("🚀 Fitur Login/Daftar Google belum aktif. (Hanya tampilan)");
    });
  });
});
