// Register

// Jika showAlert belum ada (mis. di main.js), tambahkan fallback ringan
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

const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("regConfirmPassword").value;

    // ✅ Validasi konfirmasi password
    if (password !== confirmPassword) {
      showAlert("❌ Password dan Konfirmasi Password tidak sama!");
      return;
    }

    // ✅ Validasi sederhana email
    if (!email.includes("@")) {
      showAlert("❌ Email tidak valid!");
      return;
    }

    try {
      console.log("🔄 Mengirim register ke:", "http://localhost:8080/auth/register");

      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: username,       // ✅ huruf besar (sesuai backend)
          Email: email,
          Password: password,
          ConfirmPassword: confirmPassword // ✅ fix disini
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

      // 🔹 Setelah berhasil register → auto-login
      const loginResp = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          Username: username, 
          Password: password 
        }),
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

      // ✅ Simpan token & user
      if (loginData.token) {
        localStorage.setItem("token", loginData.token);
      }
      localStorage.setItem("user", JSON.stringify({ username, email }));

      showAlert(`🎉 Selamat datang, ${username}! Login berhasil.`, "success");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);

    } catch (error) {
      console.error("❌ Error fetch:", error);
      showAlert("❌ Tidak bisa terhubung ke server! Pastikan backend jalan di http://localhost:8080");
    }
  });
}

const toRegister = document.getElementById("toRegister");
if (toRegister) {
  toRegister.addEventListener("click", function(e) {
    e.preventDefault(); 
    window.location.href = "regis.html";
  });
}
