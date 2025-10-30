document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("peraturanContainer");

  // Pastikan elemen ada
  if (!container) {
    console.error("❌ Elemen #peraturanContainer tidak ditemukan di HTML.");
    return;
  }

  // ✅ Fungsi untuk menampilkan peraturan
  function tampilkanPeraturan(data) {
    container.innerHTML = ""; // bersihkan isi sebelumnya
    data.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("peraturan-card");
      card.innerHTML = `
        <h3>${item.judul || "Tanpa Judul"}</h3>
        <p>${item.deskripsi || "Tidak ada deskripsi."}</p>
        <small>Sumber: ${item.sumber || "Tidak diketahui"}</small>
      `;
      container.appendChild(card);
    });
  }

  // ✅ Fungsi untuk fetch data
  async function ambilPeraturan() {
    try {
      const response = await fetch("http://localhost:8080/peraturan");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const hasil = await response.json();
      console.log("✅ Data peraturan berhasil diambil:", hasil);
      tampilkanPeraturan(hasil);
    } catch (error) {
      console.error("❌ Gagal mengambil data peraturan:", error);
      container.innerHTML = "<p style='color:red;'>Gagal memuat data peraturan. Periksa server backend!</p>";
    }
  }

  // Jalankan fetch saat halaman dimuat
  ambilPeraturan();
});
