// == CEK LOGIN & ATUR UI ==
document.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.getElementById("loginLink");
  const logoutBtn = document.getElementById("logoutBtn");

  const token = localStorage.getItem("token");

  // Sembunyikan sementara
  if (loginLink) loginLink.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "none";

  if (token) {
    // Sudah login
    toggleButton(loginLink, false);
    toggleButton(logoutBtn, true);

    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
          title: "Logout?",
          text: "Apakah Anda yakin ingin keluar dari akun ini?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, Logout",
          cancelButtonText: "Batal",
          reverseButtons: true,
          customClass: {
            popup: "swal2-popup-custom",
            title: "swal2-title-custom",
            confirmButton: "swal2-confirm-custom",
            cancelButton: "swal2-cancel-custom"
          }
        });

        if (result.isConfirmed) {
          try {
            const res = await fetch("http://localhost:8080/auth/logout", {
              method: "POST",
              credentials: "include"
            });

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");

            await Swal.fire({
              icon: "success",
              title: "Berhasil Logout!",
              text: "Sesi Anda telah diakhiri.",
              timer: 1500,
              showConfirmButton: false,
              customClass: {
                popup: "swal2-popup-custom",
                title: "swal2-title-custom"
              }
            });

            window.location.href = "login.html";
          } catch (err) {
            console.error("Logout error:", err);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");

            await Swal.fire({
              icon: "warning",
              title: "Logout Sebagian",
              text: "Koneksi gagal, tapi sesi lokal dihapus.",
              confirmButtonText: "Oke"
            });
            window.location.href = "login.html";
          }
        }
      });
    }
  } else {
    // Belum login
    toggleButton(loginLink, true);
    toggleButton(logoutBtn, false);

    if (loginLink) {
      loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "login.html";
      });
    }
  }

  // == PROTEKSI HALAMAN YANG BUTUH LOGIN ==
  document.querySelectorAll(".require-login").forEach(link => {
    link.addEventListener("click", function (e) {
      if (!localStorage.getItem("token")) {
        e.preventDefault();
        Swal.fire({
          icon: "warning",
          title: "Login Diperlukan",
          text: "Silakan login terlebih dahulu untuk mengakses fitur ini.",
          confirmButtonText: "Login Sekarang"
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "login.html";
          }
        });
      }
    });
  });

  // == CTA BUTTON ==
  const ctaBtn = document.querySelector(".cta-btn");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (token) {
        window.location.href = "artikel.html";
      } else {
        window.location.href = "login.html";
      }
    });
  }
});

// == TOGGLE BUTTON DENGAN ANIMASI ==
function toggleButton(element, show) {
  if (!element) return;
  if (show) {
    element.style.display = "block";
    element.style.opacity = "0";
    setTimeout(() => {
      element.style.transition = "opacity 0.4s ease";
      element.style.opacity = "1";
    }, 50);
  } else {
    element.style.opacity = "0";
    setTimeout(() => {
      element.style.display = "none";
    }, 400);
  }
}

// == STYLING SWEETALERT SESUAI TEMA EDUCLEX ==
const style = document.createElement("style");
style.textContent = `
  .swal2-popup-custom {
    font-family: 'Poppins', sans-serif !important;
    border-radius: 12px !important;
    box-shadow: 0 6px 20px rgba(93, 64, 55, 0.3) !important;
  }
  .swal2-title-custom {
    color: #4e342e !important;
    font-weight: 700 !important;
    font-size: 1.4rem !important;
  }
  .swal2-confirm-custom {
    background-color: #8d6e63 !important;
    color: white !important;
    font-weight: 600 !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 8px 20px !important;
  }
  .swal2-confirm-custom:hover {
    background-color: #5d4037 !important;
  }
  .swal2-cancel-custom {
    background-color: #d7ccc8 !important;
    color: #3e2723 !important;
    font-weight: 600 !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 8px 20px !important;
    margin-left: 8px !important;
  }
  .swal2-cancel-custom:hover {
    background-color: #bcaaa4 !important;
  }
`;
document.head.appendChild(style);

// === SISA FUNGSI LAMA TIDAK DIHAPUS ===
// (Artikel, chat, simulasi, login/register dummy tetap ada di sini jika dibutuhkan)
// Tapi tidak ditampilkan lagi di sini agar fokus pada logout & proteksi.
// Anda bisa salin bagian bawah dari script.js lama jika masih butuh fitur itu.