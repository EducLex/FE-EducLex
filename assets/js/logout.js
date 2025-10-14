// logout.js

// fallback showAlert kalau belum ada
if (typeof showAlert !== "function") {
  function showAlert(message, type = "info") {
    const container = document.getElementById("alert-container");
    if (container) {
      container.innerHTML = `<div class="alert ${type}">${message}</div>`;
      setTimeout(() => { container.innerHTML = ""; }, 3000);
    } else {
      alert(message);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btnLogout = document.getElementById("btn-logout");
  const btnCancel = document.getElementById("btn-cancel");

  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      // 🔸 Konfirmasi sebelum logout
      const yakin = confirm("Apakah Anda yakin ingin logout dari akun ini?");
      if (!yakin) {
        showAlert("🚪 Logout dibatalkan oleh pengguna.", "info");
        return;
      }

      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      // Gunakan switch untuk kondisi localStorage
      switch (true) {
        case !!token && !!storedUser:
          try {
            // 🔹 Fetch ke endpoint logout
            const response = await fetch("http://localhost:8080/auth/logout", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include", // kirim cookie/session
            });

            if (!response.ok) {
              throw new Error(`Gagal logout (status: ${response.status})`);
            }

            const result = await response.json();

            // ✅ Jika berhasil
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");

            showAlert(result.message || "✅ Anda berhasil logout!", "success");
            setTimeout(() => {
              window.location.href = "login.html";
            }, 1500);
          } catch (error) {
            console.error("Logout error:", error);
            showAlert("❌ Gagal logout. Periksa koneksi atau server backend.", "error");
          }
          break;

        case !!token && !storedUser:
          localStorage.removeItem("token");
          showAlert("ℹ️ Sesi logout otomatis, data user tidak ditemukan.", "info");
          setTimeout(() => {
            window.location.href = "login.html";
          }, 1500);
          break;

        default:
          showAlert("❌ Tidak ada sesi login yang aktif.", "error");
          setTimeout(() => {
            window.location.href = "login.html";
          }, 1500);
          break;
      }
    });
  }

  if (btnCancel) {
    btnCancel.addEventListener("click", () => {
      showAlert("🚪 Logout dibatalkan.", "info");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);
    });
  }
});
