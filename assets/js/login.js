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

  // 🔹 Elemen dropdown akun NAVBAR
  const akunDropdown = document.getElementById("akunDropdown");
  const loginMenu = document.getElementById("menuLogin");
  const logoutMenu = document.getElementById("menuLogout");

  function showAlert(message, type = "info") {
    if (!alertContainer) return;
    const icon = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" }[type] || "ℹ️";
    alertContainer.innerHTML = `<div class="alert ${type}">${icon} ${message}</div>`;
    setTimeout(() => (alertContainer.innerHTML = ""), 4000);
  }

  // ======================================================
  // 🔹 PERBAIKAN: UPDATE DROPDOWN AKUN
  // ======================================================
  function updateAkunDropdown() {
    const token = localStorage.getItem("token");

    if (!akunDropdown || !loginMenu || !logoutMenu) return;

    if (token) {
      loginMenu.style.display = "none";
      logoutMenu.style.display = "block";
    } else {
      loginMenu.style.display = "block";
      logoutMenu.style.display = "none";
    }
  }

  // 🔹 Tombol Logout
  if (logoutMenu) {
    logoutMenu.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      updateAkunDropdown();
      window.location.href = "login.html";
    });
  }

  updateAkunDropdown(); // jalankan saat halaman dibuka

  // ======= FORM EVENTS =======
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
  // LOGIN USER NORMAL
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
          showAlert(data.message || "Username atau password salah!", "error");
          return;
        }

        localStorage.setItem("token", data.token || "dummy-token");
        localStorage.setItem("user", JSON.stringify({ username, role: data.role || "user" }));

        updateAkunDropdown();

        if (data.role === "admin") {
          window.location.href = "dbadmin.html";
        } else {
          window.location.href = "index.html";
        }

      } catch (error) {
        console.error("❌ Error login:", error);
        showAlert("Gagal terhubung ke server backend.", "error");
      }
    });
  }

  // ======================================================
  // FORGOT PASSWORD
  // ======================================================
  if (forgotPasswordFormEl) {
    forgotPasswordFormEl.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("forgotEmail")?.value.trim();

      if (!email) return showAlert("Email wajib diisi!", "warning");

      try {
        const res = await fetch(`${apiBase}/jaksa/auth/forgot-password`, {
          method: "POST",
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
  // RESET PASSWORD
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
  // LOGIN GOOGLE (PERBAIKAN FINAL)
  // ======================================================
  document.querySelectorAll(".google-btn").forEach(btn => {
    btn?.addEventListener("click", () => {
      window.location.href = `${apiBase}/auth/google/login?redirect_uri=http://localhost/google-callback.html`;
    });
  });

  // ======================================================
  // GOOGLE CALLBACK HANDLER (google-callback.html)
  // ======================================================
  try {
    const preTag = document.querySelector("pre");
    if (preTag) {
      const text = preTag.innerText.trim();
      const data = JSON.parse(text);

      console.log("Google Callback JSON:", data);

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      updateAkunDropdown();
      window.location.href = "index.html";
      return;
    }
  } catch {
    console.warn("Tidak ada JSON callback Google.");
  }

  updateAkunDropdown();
});
