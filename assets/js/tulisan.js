document.addEventListener("DOMContentLoaded", async () => {
  const apiBase = "http://localhost:8080";
  const container = document.getElementById("tulisanBaru");

  if (!container) {
    console.error("Elemen #tulisanBaru tidak ditemukan.");
    return;
  }

  // ============================
  // 🔹 DAFTAR ENDPOINT
  // ============================
  const endpoints = [
    `${apiBase}/tulisan-public`,
    `${apiBase}/tulisan`,
  ];

  // ============================
  // 🔹 Ambil Data Tulisan
  // ============================
  async function ambilTulisan() {
    for (const url of endpoints) {
      try {
        console.log("Mencoba endpoint:", url);

        const res = await fetch(url, {
          method: "GET",
          mode: "cors",
        });

        if (!res.ok) {
          console.warn("Endpoint tidak OK:", url, res.status);
          continue;
        }

        const data = await res.json();
        console.log("Response dari backend:", data);

        // ================================
        // 🔥 NORMALISASI DATA BACKEND
        // BE bisa kirim: array, object, atau object.data
        // ================================
        let tulisanData = [];

        if (Array.isArray(data)) {
          tulisanData = data;
        } else if (Array.isArray(data.data)) {
          tulisanData = data.data;
        } else if (typeof data === "object" && data !== null) {
          tulisanData = [data];
        }

        if (tulisanData.length > 0) {
          tampilkanTulisan(tulisanData);
          return;
        }

      } catch (err) {
        console.error("Error fetch endpoint:", url, err);
      }
    }

    console.warn("Semua endpoint gagal. Menampilkan dummyData.");
    tampilkanTulisan(dummyData);
  }

  // ============================
  // 🔹 Dummy Data jika backend error
  // ============================
  const dummyData = [
    {
      judul: "Pedoman Penegakan Hukum di Era Digital",
      kategori: "Edukasi dan Literasi Hukum Digital",
      isi: "Isi dummy tidak tersedia.",
      file_url: "#"
    },
    {
      judul: "Hak dan Kewajiban Pengguna Media Sosial",
      kategori: "Regulasi UU ITE",
      isi: "Isi dummy tidak tersedia.",
      file_url: "#"
    },
  ];

  // ============================
  // 🔹 Render Tulisan ke HTML
  // ============================
  function tampilkanTulisan(data) {
    container.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML =
        `<p style="text-align:center;">Belum ada tulisan dari Jaksa.</p>`;
      return;
    }

    data.forEach((t) => {
      const card = document.createElement("div");
      card.className = "tulisan-card";

      // File URL tidak ada dari backend → generate file dummy
      const fileUrl =
        t.file_url ??
        `data:text/plain;charset=utf-8,${encodeURIComponent(
          t.isi || "Tidak ada isi tulisan."
        )}`;

      card.innerHTML = `
        <img src="assets/img/pdf.png" alt="PDF Icon" class="pdf-icon">

        <p class="kategori">${t.kategori && t.kategori.trim() !== "" ? t.kategori : "Artikel Hukum"}</p>

        <h2>${t.judul}</h2>

        <div class="card-actions">
          <a href="${fileUrl}" target="_blank" class="btn-detail">👁️ Lihat</a>
          <a href="${fileUrl}" download class="btn-unduh">⬇️ Unduh</a>
        </div>
      `;

      container.appendChild(card);
    });
  }

  // ============================
  // 🔹 Jalankan Fetch
  // ============================
  await ambilTulisan();
});
