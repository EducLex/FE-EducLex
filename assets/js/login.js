document.addEventListener("DOMContentLoaded", () => {
  const loginFormEl = document.getElementById("loginForm");
  const alertContainer = document.getElementById("alert-container");

  // 🔹 Gunakan 1 base URL fix sesuai backend
  const apiBase = "http://localhost:8080"; // ✅ ganti dari MongoDB URL ke backend

  function showAlert(message, type = "error") {
    if (!alertContainer) {
      console.warn("⚠️ Elemen #alert-container tidak ditemukan di DOM!");
      return;
    }

    alertContainer.innerHTML = `
      <div class="alert ${type}">
        ${message}
      </div>
    `;

    setTimeout(() => {
      if (alertContainer) {
        alertContainer.innerHTML = "";
      }
    }, 4000);
  }

  if (loginFormEl) {
    loginFormEl.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (!username || !password) {
        showAlert("❌ Username dan password wajib diisi!", "error");
        return;
      }

      try {
        console.log("🔄 Mengirim login ke:", `${apiBase}/auth/login`);

        const response = await fetch(`${apiBase}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
          credentials: "include"
        });

        let data = {};
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          data = { message: await response.text() };
        }

        if (!response.ok) {
          showAlert(data.error || data.message || "❌ Username atau password salah!", "error");
          return;
        }

        // ✅ Simpan token & user
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
        console.error("❌ Error fetch:", error);
        showAlert("❌ Tidak bisa terhubung ke server! Pastikan backend jalan di http://localhost:8080", "error");
      }
    });
  }

  // 🔹 Dummy tombol Google
  document.querySelectorAll(".google-btn").forEach((btn) => {
    if (!btn) {
      console.warn("⚠️ Elemen .google-btn tidak ditemukan di DOM!");
      return;
    }
    btn.addEventListener("click", () => {
      alert("🚀 Fitur Login/Daftar Google belum aktif. (Hanya tampilan)");
    });
  });
});
