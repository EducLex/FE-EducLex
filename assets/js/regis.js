// Register

// ✅ Fallback showAlert
if (typeof showAlert !== "function") {
  function showAlert(message, type = "error") {
    const container = document.getElementById("alert-container");
    if (container) {
      container.innerHTML = `<div class="alert ${type}">${message}</div>`;
      setTimeout(() => { container.innerHTML = ""; }, 4000);
    } else {
      alert(message);
    }
  }
}

/* =========================================================
   🔥 FITUR BARU: CEK EMAIL REAL-TIME SAAT USER MENGETIK
   Endpoint contoh: GET /auth/check-email?email=...
   ========================================================= */

// Element email input
const emailInput = document.getElementById("regEmail");
let emailValid = false;

if (emailInput) {
  emailInput.addEventListener("input", async () => {
    const email = emailInput.value.trim();

    if (!email.includes("@")) {
      emailValid = false;
      return;
    }

    try {
      const check = await fetch(`http://localhost:8080/auth/check-email?email=${encodeURIComponent(email)}`);
      const result = await check.json();

      // Jika email sudah terdaftar
      if (result.exists) {
        emailValid = false;
        showAlert("❌ Email ini sudah terdaftar, gunakan email lain!", "error");
      } else {
        emailValid = true;
        showAlert("✅ Email tersedia, silakan lanjutkan.", "success");
      }
    } catch (err) {
      console.error("❌ Gagal mengecek email:", err);
    }
  });
}

/* =========================================================
   === FORM REGISTRASI MANUAL (DIPERBARUI) ===
   ========================================================= */
const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("regConfirmPassword").value;

    // =========================================================
    // 🔥 CEK ULANG DUPLIKASI EMAIL SEBELUM SUBMIT
    // =========================================================
    try {
      const check = await fetch(`http://localhost:8080/auth/check-email?email=${encodeURIComponent(email)}`);
      const result = await check.json();

      if (result.exists) {
        showAlert("❌ Email sudah digunakan! Tidak bisa daftar dua kali.", "error");
        return;
      }
    } catch (err) {
      console.error("Error cek email:", err);
    }

    // Validasi password
    if (password !== confirmPassword) {
      showAlert("❌ Password dan Konfirmasi Password tidak sama!");
      return;
    }

    // Validasi email format
    if (!email.includes("@")) {
      showAlert("❌ Email tidak valid!");
      return;
    }

    try {
      console.log("🔄 Mengirim register manual ke:", "http://localhost:8080/auth/register");

      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: username,
          Email: email,
          Password: password,
          ConfirmPassword: confirmPassword
        }),
        credentials: "include"
      });

      let data = {};
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          data = { message: await response.text() };
        }
      } catch (err) {
        console.warn("Respon register bukan JSON valid:", err);
      }

      if (!response.ok) {
        showAlert(data.error || data.message || "❌ Gagal registrasi!");
        return;
      }

      showAlert("✅ Registrasi berhasil! Melakukan login otomatis...", "success");

      // AUTO LOGIN
      const loginResp = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Username: username, Password: password }),
        credentials: "include"
      });

      let loginData = {};
      try {
        const loginContent = loginResp.headers.get("content-type");
        if (loginContent && loginContent.includes("application/json")) {
          loginData = await loginResp.json();
        } else {
          loginData = { message: await loginResp.text() };
        }
      } catch (err) {
        console.warn("Respon login bukan JSON valid:", err);
      }

      if (!loginResp.ok) {
        showAlert(loginData.error || loginData.message || "❌ Auto-login gagal! Silakan login manual.", "error");
        return;
      }

      // Simpan token & user
      if (loginData.token) {
        localStorage.setItem("token", loginData.token);
      }
      localStorage.setItem("user", JSON.stringify({ username, email }));

      showAlert(`🎉 Selamat datang, ${username}! Login berhasil.`, "success");
      setTimeout(() => window.location.href = "index.html", 1500);

    } catch (error) {
      console.error("❌ Error fetch:", error);
      showAlert("❌ Tidak bisa terhubung ke server! Pastikan backend jalan di http://localhost:8080");
    }
  });
}

/* =========================================================
   === TOMBOL GOOGLE REGISTER ===
   ========================================================= */
const googleBtn = document.getElementById("googleRegisterBtn");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      showAlert("🔄 Menghubungkan ke Google...", "info");

      const response = await fetch("http://localhost:8080/auth/google/regis", {
        method: "GET",
        credentials: "include",
      });

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else if (data.message) {
        showAlert(data.message, "info");
      } else {
        showAlert("❌ Tidak dapat terhubung ke Google Register.");
      }

    } catch (error) {
      console.error("❌ Error fetch Google register:", error);
      showAlert("❌ Gagal menghubungkan ke Google! Pastikan backend OAuth aktif.");
    }
  });
}

// === LINK KE REGISTER ===
const toRegister = document.getElementById("toRegister");
if (toRegister) {
  toRegister.addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "regis.html";
  });
}
