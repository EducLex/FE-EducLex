document.addEventListener("DOMContentLoaded", async () => {
  const apiBase = "http://localhost:8080"; // Ganti sesuai backend kamu
  const container = document.getElementById("tulisanBaru");

  // Fungsi utama untuk ambil data tulisan dari backend
  async function ambilTulisan() {
    try {
      const res = await fetch(`${apiBase}/tulisan`);
      if (!res.ok) throw new Error("Gagal mengambil data dari server.");
      const data = await res.json();

      // Jika belum ada data dari backend, gunakan dummy data
      if (!Array.isArray(data) || data.length === 0) {
        console.warn("Belum ada data dari backend, menampilkan dummy data...");
        tampilkanTulisan(dummyData);
      } else {
        tampilkanTulisan(data);
      }
    } catch (err) {
      console.error("❌ Gagal mengambil data tulisan:", err);
      // Jika fetch gagal (misal server mati), tampilkan dummy
      tampilkanTulisan(dummyData);
    }
  }

  // ==== Data Dummy untuk Tampilan Awal ====
  const dummyData = [
    {
      judul: "Laporan kerja bulanan BPKAD",
      kategori: "Transparansi Pengelolaan Keuangan Daerah",
      file_url: "assets/pdf/contoh1.pdf",
    },
    {
      judul: "Pengeluaran Tahunan BPKAD",
      kategori: "Transparansi Pengelolaan Keuangan Daerah",
      file_url: "assets/pdf/contoh2.pdf",
    },
    {
      judul: "Panduan Etika Media Sosial bagi Remaja",
      kategori: "Edukasi Hukum Digital",
      file_url: "assets/pdf/panduan_etika.pdf",
    },
  ];

  // ==== Fungsi Render ke Halaman ====
  function tampilkanTulisan(data) {
    if (!container) return;
    container.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = `<p style="text-align:center;">Belum ada tulisan dari Jaksa.</p>`;
      return;
    }

    data.forEach((t) => {
      const card = document.createElement("div");
      card.className = "tulisan-card";
      card.innerHTML = `
        <img src="assets/img/pdf.png" alt="PDF Icon" class="pdf-icon">
        <p class="kategori">${t.kategori || "-"}</p>
        <h2>${t.judul}</h2>
        <div class="card-actions">
          <a href="${t.file_url}" target="_blank" class="btn-detail">👁️ Lihat</a>
          <a href="${t.file_url}" download class="btn-unduh">⬇️ Unduh</a>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // ==== Jalankan saat halaman dibuka ====
  await ambilTulisan();
});
