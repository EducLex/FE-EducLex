document.addEventListener("DOMContentLoaded", () => {
  const loginFormEl = document.getElementById("loginForm");
  const alertContainer = document.getElementById("alert-container");
  const apiBase = "http://localhost:8080"; // ✅ backend base URL
  const loginLink = document.getElementById("loginLink");
  const logoutBtn = document.getElementById("logoutBtn");

  // 🔹 Fungsi alert dengan switch type
  function showAlert(message, type = "info") {
    if (!alertContainer) {
      console.warn("⚠️ Elemen #alert-container tidak ditemukan di DOM!");
      return;
    }

    let icon = "";
    switch (type) {
      case "success":
        icon = "✅";
        break;
      case "error":
        icon = "❌";
        break;
      case "warning":
        icon = "⚠️";
        break;
      default:
        icon = "ℹ️";
    }

    alertContainer.innerHTML = `
      <div class="alert ${type}">
        ${icon} ${message}
      </div>
    `;

    setTimeout(() => {
      if (alertContainer) {
        alertContainer.innerHTML = "";
      }
    }, 4000);
  }

  // 🔹 Event handler untuk form login
  if (loginFormEl) {
    loginFormEl.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (!username || !password) {
        showAlert("Username dan password wajib diisi!", "warning");
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
          showAlert(data.error || data.message || "Username atau password salah!", "error");
          return;
        }

        // ✅ Simpan token & user di localStorage
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        localStorage.setItem("user", JSON.stringify({ username }));

        // 🔹 Update UI login/logout di navbar
        if (loginLink && logoutBtn) {
          loginLink.style.display = "none";
          logoutBtn.style.display = "block";
        }

        // 🔹 Alert sukses (pakai Swal kalau ada)
        if (typeof Swal !== "undefined") {
          Swal.fire({
            icon: "success",
            title: "Login Berhasil 🎉",
            text: `Selamat datang, ${username}!`,
            showConfirmButton: false,
            timer: 1800,
            timerProgressBar: true
          }).then(() => {
            window.location.href = "index.html";
          });
        } else {
          showAlert(`Login berhasil! Selamat datang, ${username}!`, "success");
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1200);
        }

      } catch (error) {
        console.error("❌ Error fetch:", error);
        showAlert(
          "Tidak bisa terhubung ke server! Pastikan backend berjalan di http://localhost:8080",
          "error"
        );
      }
    });
  }

  // 🔹 Dummy tombol Google (tidak dihapus)
  document.querySelectorAll(".google-btn").forEach((btn) => {
    if (!btn) {
      console.warn("⚠️ Elemen .google-btn tidak ditemukan di DOM!");
      return;
    }
    btn.addEventListener("click", () => {
      switch (true) {
        case typeof Swal !== "undefined":
          Swal.fire({
            icon: "info",
            title: "Fitur Belum Tersedia 🚀",
            text: "Login/Daftar dengan Google masih dalam tahap pengembangan.",
            confirmButtonText: "OK"
          });
          break;
        default:
          alert("🚀 Fitur Login/Daftar Google belum aktif. (Hanya tampilan)");
      }
    });
  });

  // 🔹 Cek status login saat halaman dibuka
  const token = localStorage.getItem("token");
  if (token) {
    if (loginLink) loginLink.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "block";
  } else {
    if (loginLink) loginLink.style.display = "block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
});
