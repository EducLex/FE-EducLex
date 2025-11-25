document.addEventListener("DOMContentLoaded", async () => {
  const loginFormEl = document.getElementById("loginForm");
  const forgotPasswordFormEl = document.getElementById("forgotPasswordForm");
  const resetPasswordFormEl = document.getElementById("resetPasswordForm");
  const alertContainer = document.getElementById("alert-container");
  const apiBase = "http://localhost:8080";

  const loginContainer = document.getElementById("login-form-container");
  const forgotContainer = document.getElementById("forgot-password-container");
  const resetContainer = document.getElementById("reset-password-container");
  const forgotPasswordLink = document.getElementById("forgot-password-link");
  const backToLoginBtn = document.getElementById("back-to-login");
  const backToForgotBtn = document.getElementById("back-to-forgot");
  const loginLinkNavbar = document.querySelector('.btn-login');
  const userIcon = document.querySelector('.user-icon');

  function showAlert(message, type = "info") {
    if (!alertContainer) return;
    const icon = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" }[type] || "ℹ️";
    alertContainer.innerHTML = `<div class="alert ${type}">${icon} ${message}</div>`;
    setTimeout(() => (alertContainer.innerHTML = ""), 4000);
  }

  function hideLoginButton() {
    if (loginLinkNavbar) loginLinkNavbar.style.display = "none";
    if (userIcon) userIcon.style.display = "inline-block";
  }

  // ======= NAVIGATION =======
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

  // ======================================================
  // ⛔ FIX ANTI-CORS: CHECK LOGIN STATUS TANPA COOKIES
  // ======================================================
  async function checkLoginStatus() {
    try {
      const token = localStorage.getItem("token");

      if (!token) return false;

      const userData = localStorage.getItem("user");
      if (userData) hideLoginButton();

      return true;

    } catch (err) {
      console.warn("⚠️ Cek status login gagal:", err.message);
    }
    return false;
  }

  // ======================================================
  // LOGIN NORMAL (TANPA CREDENTIALS)
  // ======================================================
  if (loginFormEl) {
    loginFormEl.addEventListener("submit", async (e) => {
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
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
          showAlert(data.message || "Username atau password salah!", "error");
          return;
        }

        // Simpan token palsu supaya tidak butuh credentials
        localStorage.setItem("token", "dummy-token");
        const role = data.role || (username.includes("admin") ? "admin" : "user");

        localStorage.setItem("user", JSON.stringify({ username, role }));
        hideLoginButton();

        const redirectTo = () => {
          window.location.href = role === "admin" ? "dbadmin.html" : "index.html";
        };

        if (typeof Swal !== "undefined") {
          Swal.fire({
            icon: "success",
            title: "Login Berhasil!",
            text: `Selamat datang, ${username}!`,
            timer: 1800,
            showConfirmButton: false
          }).then(redirectTo);
        } else {
          showAlert("Login berhasil!", "success");
          setTimeout(redirectTo, 1200);
        }
      } catch (error) {
        console.error("❌ Error login:", error);
        showAlert("Gagal terhubung ke server backend.", "error");
      }
    });
  }

  // ======================================================
  // FORGOT PASSWORD (TETAP SAMA)
  // ======================================================
  if (forgotPasswordFormEl) {
    forgotPasswordFormEl.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("forgotEmail")?.value.trim();

      if (!email) return showAlert("Email wajib diisi!", "warning");

      try {
        const res = await fetch(`${apiBase}/jaksa/auth/forgot-password`, {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (res.ok) {
          showAlert("Tautan reset telah dikirim ke email Anda.", "success");
          loginContainer.style.display = "none";
          forgotContainer.style.display = "none";
          resetContainer.style.display = "block";
        } else {
          showAlert(data.message || "Gagal mengirim email.", "error");
        }
      } catch (err) {
        showAlert("Tidak bisa terhubung ke server.", "error");
      }
    });
  }

  // ======================================================
  // RESET PASSWORD (TETAP SAMA)
  // ======================================================
  if (resetPasswordFormEl) {
    resetPasswordFormEl.addEventListener("submit", async (e) => {
      e.preventDefault();

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const newPassword = document.getElementById("newPassword")?.value.trim();
      const confirm = document.getElementById("confirmNewPassword")?.value.trim();

      if (!token || !newPassword || !confirm) {
        return showAlert("Semua field wajib diisi!", "warning");
      }
      if (newPassword !== confirm) {
        return showAlert("Password tidak cocok!", "error");
      }

      try {
        const res = await fetch(`${apiBase}/jaksa/auth/reset-password-jaksa`, {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword })
        });

        const data = await res.json();

        if (res.ok) {
          showAlert("Password berhasil diubah!", "success");
          setTimeout(() => {
            window.location.href = "login.html";
          }, 1500);
        } else {
          showAlert(data.message || "Gagal mengubah password.", "error");
        }
      } catch (err) {
        showAlert("Tidak bisa terhubung ke server.", "error");
      }
    });
  }

  // ======================================================
  // LOGIN GOOGLE (AMAN, TIDAK KENA CORS)
  // ======================================================
  document.querySelectorAll(".google-btn").forEach(btn => {
    btn?.addEventListener("click", () => {
      window.location.href = `${apiBase}/auth/google/login`;
    });
  });

  await checkLoginStatus();
});
