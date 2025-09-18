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
    btnLogout.addEventListener("click", () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      switch (true) {
        case !!token && !!storedUser:
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");

          showAlert("✅ Anda berhasil logout!", "success");
          setTimeout(() => {
            window.location.href = "login.html";
          }, 1500);
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
