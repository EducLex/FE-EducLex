document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("peraturanContainer");

  // 🔍 Pastikan elemen container ditemukan
  if (!container) {
    console.error("❌ Elemen #peraturanContainer tidak ditemukan di HTML.");
    return;
  }

  // ✅ Fungsi lama untuk menampilkan daftar peraturan (dipertahankan)
  function tampilkanPeraturan(data) {
    container.innerHTML = ""; // bersihkan isi sebelumnya

    if (data.length === 0) {
      container.innerHTML = "<p>Tidak ada data peraturan yang tersedia.</p>";
      return;
    }

    data.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("peraturan-card");

      card.innerHTML = `
        <div class="card-content">
          <h3>${item.judul || "Tanpa Judul"}</h3>
          <p>${item.deskripsi || "Tidak ada deskripsi yang tersedia."}</p>
          <small><strong>Sumber:</strong> ${item.sumber || "Tidak diketahui"}</small>
        </div>
      `;

      container.appendChild(card);
    });
  }

  // ✅ Fungsi baru untuk menampilkan daftar peraturan dengan tampilan collapsible (versi modern)
  function tampilkanPeraturanModern(data) {
    container.innerHTML = ""; // bersihkan isi sebelumnya

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = "<p style='text-align:center; color:#777;'>Belum ada peraturan yang tersedia.</p>";
      return;
    }

    data.forEach(item => {
      const peraturanItem = document.createElement("div");
      peraturanItem.classList.add("peraturan-item");

      // Header (judul peraturan)
      const header = document.createElement("div");
      header.classList.add("peraturan-header");
      header.textContent = item.judul || "Tanpa Judul";

      // Body (isi peraturan dan sumber)
      const body = document.createElement("div");
      body.classList.add("peraturan-body");

      // Jika isi berupa array (misalnya daftar pasal/peraturan), tampilkan sebagai list
      let isiPeraturan = "";
      if (Array.isArray(item.peraturan) && item.peraturan.length > 0) {
        isiPeraturan = `
          <ol>
            ${item.peraturan.map(p => `<li>${p}</li>`).join("")}
          </ol>
        `;
      } else {
        isiPeraturan = `<p>${item.deskripsi || "Tidak ada isi peraturan yang tersedia."}</p>`;
      }

      body.innerHTML = `
        ${isiPeraturan}
        <div class="peraturan-sumber"><strong>Sumber:</strong> ${item.sumber || "Tidak diketahui"}</div>
      `;

      // Tambahkan interaksi klik untuk membuka/tutup body
      header.addEventListener("click", () => {
        body.classList.toggle("active");
      });

      peraturanItem.appendChild(header);
      peraturanItem.appendChild(body);
      container.appendChild(peraturanItem);
    });
  }

  // ✅ Fungsi untuk mengambil data dari backend
  async function ambilPeraturan() {
    try {
      const response = await fetch("http://localhost:8080/peraturan");

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const hasil = await response.json();
      console.log("✅ Data peraturan berhasil diambil:", hasil);

      // Gunakan tampilan baru agar sesuai dengan desain modern user
      tampilkanPeraturanModern(hasil);
    } catch (error) {
      console.error("❌ Gagal mengambil data peraturan:", error);
      container.innerHTML = `
        <p style="color: red;">Gagal memuat data peraturan.<br>
        Pastikan server backend sedang berjalan.</p>
      `;
    }
  }

  // 🔄 Jalankan fetch ketika halaman dimuat
  ambilPeraturan();
});
