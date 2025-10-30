document.addEventListener("DOMContentLoaded", () => {
  const loginFormEl = document.getElementById("loginForm");
  const alertContainer = document.getElementById("alert-container");
  const apiBase = "http://localhost:8080";
  const loginLink = document.getElementById("loginLink");
  const logoutBtn = document.getElementById("logoutBtn");

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

  // =============================== 🔹 LOGIN BIASA ===============================
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

        // ✅ Simpan token & user
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // 🔹 Simpan data user dan role (fallback ke 'user' jika tidak ada)
        const userRole = data.role || (username.toLowerCase().includes("admin") ? "admin" : "user");
        localStorage.setItem("user", JSON.stringify({ username, role: userRole }));

        // 🔹 Update UI login/logout di navbar
        if (loginLink && logoutBtn) {
          loginLink.style.display = "none";
          logoutBtn.style.display = "block";
        }

        // ✅ Tentukan halaman tujuan berdasarkan role
        const redirectToHome = () => {
          if (userRole === "admin") {
            window.location.href = "dbadmin.html";
          } else {
            window.location.href = "index.html";
          }
        };

        // 🔹 Alert sukses
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
        showAlert(
          "Tidak bisa terhubung ke server! Pastikan backend berjalan di http://localhost:8080",
          "error"
        );
      }
    });
  }

  // =============================== 🔹 LOGIN DENGAN GOOGLE ===============================
  document.querySelectorAll(".google-btn").forEach((btn) => {
    if (!btn) return;

    btn.addEventListener("click", async () => {
      try {
        console.log("🔹 Memulai login Google...");
        
        // Buka popup Google login
        const popup = window.open(
          `${apiBase}/auth/google/login`,
          "_blank",
          "width=600,height=600"
        );

        if (!popup) {
          showAlert("❌ Gagal membuka jendela login Google. Periksa pop-up blocker!", "error");
          return;
        }

        // Pantau popup sampai tertutup
        const timer = setInterval(async () => {
          if (popup.closed) {
            clearInterval(timer);

            // Setelah popup ditutup, cek apakah login Google berhasil
            try {
              const res = await fetch(`${apiBase}/auth/google/status`, {
                credentials: "include",
              });

              const data = await res.json();

              if (res.ok && data.token) {
                localStorage.setItem("token", data.token);

                // Tentukan role (default: user)
                const userRole = data.user?.role || "user";
                localStorage.setItem("user", JSON.stringify({ ...data.user, role: userRole }));

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
                    title: "Login Google Berhasil 🎉",
                    text: `Selamat datang, ${data.user?.name || "Pengguna"}!`,
                    timer: 1800,
                    showConfirmButton: false,
                  }).then(redirectToHome);
                } else {
                  showAlert("Login Google berhasil!", "success");
                  setTimeout(redirectToHome, 1500);
                }
              } else {
                showAlert("Login Google dibatalkan atau gagal.", "warning");
              }
            } catch (err) {
              console.error("❌ Gagal memeriksa status Google:", err);
              showAlert("Gagal memverifikasi login Google.", "error");
            }
          }
        }, 1000);
      } catch (err) {
        console.error("❌ Error Google login:", err);
        showAlert("Gagal memulai login dengan Google!", "error");
      }
    });
  });

  // =============================== 🔹 CEK STATUS LOGIN ===============================
  const token = localStorage.getItem("token");
  if (token) {
    if (loginLink) loginLink.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "block";

    // 🚫 Jika user sudah login dan mencoba buka login.html → arahkan ke sesuai role
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "login.html") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.role === "admin") {
        window.location.href = "dbadmin.html";
      } else {
        window.location.href = "index.html";
      }
    }
  } else {
    if (loginLink) loginLink.style.display = "block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
});
