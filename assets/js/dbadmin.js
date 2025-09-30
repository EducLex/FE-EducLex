// ====== LOGOUT ======
document.getElementById("logoutBtn").addEventListener("click", function () {
  const confirmLogout = confirm("Apakah Anda yakin ingin logout?");
  if (confirmLogout) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
  }
});

// ====== NAVIGASI SIDEBAR ======
document.getElementById("dashboardLink").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "dbadmin.html";
});

document.getElementById("artikelLink").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "artikel.html";
});

document.getElementById("tanyaLink").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "tanya.html";
});

document.getElementById("tulisanLink").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "tulisan.html";
});

document.getElementById("peraturanLink").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "peraturan.html";
});

document.getElementById("penggunaLink").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "pengguna.html";
});

// ====== CEK LOGIN ======
window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Silakan login terlebih dahulu!");
    window.location.href = "login.html";
  } else {
    loadDashboardData(); // ✅ Muat data setelah login dicek
  }
});

// ====== FETCH DATA DASHBOARD ======
async function loadDashboardData() {
  try {
    const token = localStorage.getItem("token");

    // === Ambil jumlah artikel ===
    const artikelRes = await fetch("http://localhost:8080/articles", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const artikelData = await artikelRes.json();
    document.getElementById("totalArtikel").textContent = Array.isArray(artikelData) ? artikelData.length : 0;

    // === Ambil jumlah pertanyaan ===
    const tanyaRes = await fetch("http://localhost:8080/questions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const tanyaData = await tanyaRes.json();
    document.getElementById("totalTanya").textContent = Array.isArray(tanyaData) ? tanyaData.length : 0;

    // === Ambil jumlah tulisan jaksa ===
    const tulisanRes = await fetch("http://localhost:8080/tulisan", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const tulisanData = await tulisanRes.json();
    document.getElementById("totalTulisan").textContent = Array.isArray(tulisanData) ? tulisanData.length : 0;

    // === Ambil jumlah pengguna (opsional jika ada endpoint) ===
    // *Jika ada endpoint pengguna, tambahkan di sini

  } catch (error) {
    console.error("❌ Gagal memuat data dashboard:", error);
  }
}
