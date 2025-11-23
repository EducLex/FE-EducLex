document.addEventListener("DOMContentLoaded", async () => {
  const loginFormEl = document.getElementById("loginForm");
  const forgotPasswordFormEl = document.getElementById("forgotPasswordForm");
  const resetPasswordFormEl = document.getElementById("resetPasswordForm");
  const alertContainer = document.getElementById("alert-container");
  const apiBase = "http://localhost:8080";

  // 🔹 DOM Elements untuk navigasi form
  const loginContainer = document.getElementById("login-form-container");
  const forgotContainer = document.getElementById("forgot-password-container");
  const resetContainer = document.getElementById("reset-password-container");

  // 🔹 Tombol navigasi
  const forgotPasswordLink = document.getElementById("forgot-password-link");
  const backToLoginBtn = document.getElementById("back-to-login");
  const backToForgotBtn = document.getElementById("back-to-forgot");

  // 🔹 Cek apakah ada tombol login di navbar (untuk disembunyikan setelah login)
  const loginLinkNavbar = document.querySelector('.btn-login');
  const userIcon = document.querySelector('.user-icon');

  // 🔹 Fungsi alert
  function showAlert(message, type = "info") {
    if (!alertContainer) return;

    let icon = "";
    switch (type) {
      case "success": icon = "✅"; break;
      case "error": icon = "❌"; break;
      case "warning": icon = "⚠️"; break;
      default: icon = "ℹ️";
    }

    alertContainer.innerHTML = `<div class="alert ${type}">${icon} ${message}</div>`;
    setTimeout(() => (alertContainer.innerHTML = ""), 4000);
  }

  // 🔹 Fungsi untuk menyembunyikan tombol login & tampilkan user icon
  function hideLoginButton() {
    if (loginLinkNavbar) loginLinkNavbar.style.display = "none";
    if (userIcon) userIcon.style.display = "inline-block";
  }

  // =============================== 🔹 NAVIGASI FORM ===============================
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginContainer.style.display = "none";
      forgotContainer.style.display = "block";
    });
  }

  if (backToLoginBtn) {
    backToLoginBtn.addEventListener("click", () => {
      loginContainer.style.display = "block";
      forgotContainer.style.display = "none";
      resetContainer.style.display = "none";
    });
  }

  if (backToForgotBtn) {
    backToForgotBtn.addEventListener("click", () => {
      forgotContainer.style.display = "block";
      resetContainer.style.display = "none";
    });
  }

  // =============================== 🔹 CEK STATUS LOGIN (SETIAP HALAMAN) ===============================
  async function checkLoginStatus() {
    try {
      const res = await fetch(`${apiBase}/auth/status`, {
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        if (data.loggedIn && data.user) {
          // Simpan ke localStorage
          localStorage.setItem("token", data.token || "google-session");
          localStorage.setItem("user", JSON.stringify(data.user));

          // Sembunyikan tombol login
          hideLoginButton();

          // Jika di login.html, redirect ke halaman utama
          const currentPage = window.location.pathname.split("/").pop();
          if (currentPage === "login.html") {
            const userRole = data.user.role || "user";
            if (userRole === "admin") {
              window.location.href = "dbadmin.html";
            } else {
              window.location.href = "index.html";
            }
          }
          return true;
        }
      }
    } catch (err) {
      console.warn("Tidak bisa cek status login:", err);
    }
    return false;
  }

  // =============================== 🔹 LOGIN BIASA ===============================
  if (loginFormEl) {
    loginFormEl.addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = document.getElementById("loginUsername")?.value.trim();
      const password = document.getElementById("loginPassword")?.value.trim();

      if (!username || !password) {
        showAlert("Username dan password wajib diisi!", "warning");
        return;
      }

      try {
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

        // Simpan data
        if (data.token) localStorage.setItem("token", data.token);
        const userRole = data.role || (username.toLowerCase().includes("admin") ? "admin" : "user");
        localStorage.setItem("user", JSON.stringify({ username, role: userRole }));

        // Sembunyikan tombol login
        hideLoginButton();

        const redirectToHome = () => {
          if (userRole === "admin") {
            window.location.href = "dbadmin.html";
          } else {
            window.location.href = "index.html";
          }
        };

        if (typeof Swal !== "undefined") {
          Swal.fire({
            icon: "success",
            title: "Login Berhasil 🎉",
            text: `Selamat datang, ${username}!`,
            showConfirmButton: false,
            timer: 1800,
            timerProgressBar: true
          }).then(redirectToHome);
        } else {
          showAlert(`Login berhasil! Selamat datang, ${username}!`, "success");
          setTimeout(redirectToHome, 1200);
        }

      } catch (error) {
        console.error("❌ Error fetch:", error);
        showAlert("Tidak bisa terhubung ke server! Pastikan backend berjalan di http://localhost:8080", "error");
      }
    });
  }

  // =============================== 🔹 LUPA PASSWORD ===============================
  if (forgotPasswordFormEl) {
    forgotPasswordFormEl.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("forgotEmail")?.value.trim();
      if (!email) {
        showAlert("Email wajib diisi!", "warning");
        return;
      }

      try {
        const response = await fetch(`${apiBase}/jaksa/auth/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        const data = await response.json();
        if (response.ok) {
          showAlert("Tautan reset password telah dikirim ke email Anda.", "success");
          loginContainer.style.display = "none";
          forgotContainer.style.display = "none";
          resetContainer.style.display = "block";
        } else {
          showAlert(data.message || "Gagal mengirim email reset.", "error");
        }
      } catch (error) {
        console.error("❌ Error forgot password:", error);
        showAlert("Tidak bisa terhubung ke server.", "error");
      }
    });
  }

  // =============================== 🔹 RESET PASSWORD ===============================
  if (resetPasswordFormEl) {
    resetPasswordFormEl.addEventListener("submit", async function (e) {
      e.preventDefault();
      const token = document.getElementById("resetToken")?.value.trim();
      const newPassword = document.getElementById("newPassword")?.value.trim();
      const confirmNewPassword = document.getElementById("confirmNewPassword")?.value.trim();

      if (!token || !newPassword || !confirmNewPassword) {
        showAlert("Semua field wajib diisi!", "warning");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        showAlert("Password tidak cocok!", "error");
        return;
      }

      try {
        const response = await fetch(`${apiBase}/jaksa/auth/reset-password-jaksa`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword })
        });

        const data = await response.json();
        if (response.ok) {
          showAlert("Password berhasil diubah!", "success");
          setTimeout(() => {
            loginContainer.style.display = "block";
            resetContainer.style.display = "none";
          }, 1500);
        } else {
          showAlert(data.message || "Gagal mengubah password.", "error");
        }
      } catch (error) {
        console.error("❌ Error reset password:", error);
        showAlert("Tidak bisa terhubung ke server.", "error");
      }
    });
  }

  // =============================== 🔹 LOGIN DENGAN GOOGLE ===============================
  document.querySelectorAll(".google-btn").forEach((btn) => {
    if (!btn) return;

    btn.addEventListener("click", () => {
      // 🔹 Redirect ke endpoint Google — backend akan handle OAuth flow
      window.location.href = `${apiBase}/auth/google/login`;
    });
  });

  // =============================== 🔹 CEK JIKA DARI GOOGLE CALLBACK ===============================
  // Misal: login.html?google=success
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("google")) {
    // Bersihkan URL tanpa reload
    history.replaceState(null, "", window.location.pathname);

    // Cek status login setelah Google sukses
    await checkLoginStatus();
  }

  // =============================== 🔹 CEK LOGIN SAAT HALAMAN DIMUAT ===============================
  const isLoggedIn = await checkLoginStatus();
  if (!isLoggedIn) {
    // Jika belum login, pastikan tombol login muncul
    if (loginLinkNavbar) loginLinkNavbar.style.display = "block";
    if (userIcon) userIcon.style.display = "none";
  }
});