// logout.js

// Fallback showAlert kalau belum ada
if (typeof showAlert !== "function") {
  function showAlert(message, type = "info") {
    const container = document.getElementById("alert-container");
    if (container) {
      let icon = "";
      switch (type) {
        case "success": icon = "✅"; break;
        case "error": icon = "❌"; break;
        case "warning": icon = "⚠️"; break;
        default: icon = "ℹ️";
      }
      container.innerHTML = `<div class="alert ${type}">${icon} ${message}</div>`;
      setTimeout(() => { container.innerHTML = ""; }, 3000);
    } else {
      alert(message); // fallback terakhir
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btnLogout = document.getElementById("btn-logout");
  const btnCancel = document.getElementById("btn-cancel");

  async function performLogout() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // Jika tidak ada sesi sama sekali
    if (!token && !user) {
      showAlert("❌ Tidak ada sesi login yang aktif.", "error");
      window.location.href = "login.html";
      return;
    }

    // Konfirmasi dengan SweetAlert jika tersedia, jika tidak pakai confirm()
    let confirmed = false;
    if (typeof Swal !== "undefined") {
      const result = await Swal.fire({
        title: "Logout?",
        text: "Apakah Anda yakin ingin keluar dari akun ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Logout",
        cancelButtonText: "Batal",
        reverseButtons: true,
      });
      confirmed = result.isConfirmed;
    } else {
      confirmed = confirm("Apakah Anda yakin ingin logout dari akun ini?");
    }

    if (!confirmed) {
      showAlert("🚪 Logout dibatalkan oleh pengguna.", "info");
      return;
    }

    try {
      // Kirim request ke backend untuk logout
      const response = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      // Hapus data lokal
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      // Tampilkan pesan sukses
      if (typeof Swal !== "undefined") {
        await Swal.fire({
          icon: "success",
          title: "Berhasil Logout!",
          text: "Anda telah keluar dari akun Anda.",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        // Gunakan showAlert jika tidak ada SweetAlert
        showAlert("✅ Anda berhasil logout!", "success");
      }

      // Redirect ke halaman login
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);

    } catch (error) {
      console.error("❌ Error saat logout:", error);

      // Jika gagal komunikasi dengan server, tetap logout lokal
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      if (typeof Swal !== "undefined") {
        await Swal.fire({
          icon: "warning",
          title: "Logout Sebagian",
          text: "Koneksi ke server gagal, tetapi sesi lokal telah dihapus.",
          confirmButtonText: "Oke",
        });
      } else {
        showAlert("⚠️ Gagal menghubungi server, tapi sesi lokal dihapus.", "warning");
      }

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    }
  }

  // Event: Logout
  if (btnLogout) {
    btnLogout.addEventListener("click", performLogout);
  }

  // Event: Batal
  if (btnCancel) {
    btnCancel.addEventListener("click", () => {
      if (typeof Swal !== "undefined") {
        Swal.fire({
          icon: "info",
          title: "Dibatalkan",
          text: "Anda tetap login.",
          timer: 1200,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "index.html";
        });
      } else {
        showAlert("🚪 Logout dibatalkan.", "info");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1200);
      }
    });
  }
});