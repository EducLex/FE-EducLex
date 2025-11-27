document.addEventListener("DOMContentLoaded", async () => {
  const apiBase = "http://localhost:8080";
  const container = document.getElementById("tulisanBaru");

  if (!container) {
    console.error("Elemen #tulisanBaru tidak ditemukan.");
    return;
  }

  // ============================
  // 🔹 Coba beberapa endpoint otomatis
  // ============================
  const endpoints = [
    `${apiBase}/tulisan-public`,
    `${apiBase}/tulisanPublic`,
    `${apiBase}/tulisan`,
  ];

  async function ambilTulisan() {
    for (const url of endpoints) {
      try {
        console.log("Mencoba endpoint:", url);

        const res = await fetch(url, {
          method: "GET",
          mode: "cors",
          // ❗ Jangan kirim Content-Type pada GET (sering bikin error CORS)
        });

        if (!res.ok) {
          console.warn("Endpoint tidak OK:", url, res.status);
          continue;
        }

        const data = await res.json();
        console.log("Response dari backend:", data);

        // backend bisa saja mengirim {data: []}
        const tulisanData = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

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
  // 🔹 Dummy Data
  // ============================
  const dummyData = [
    {
      judul: "Pedoman Penegakan Hukum di Era Digital",
      kategori: "Edukasi dan Literasi Hukum Digital",
      file_url: "assets/pdf/pedoman_penegakan_hukum.pdf",
    },
    {
      judul: "Hak dan Kewajiban Pengguna Media Sosial Menurut UU ITE",
      kategori: "Undang-Undang dan Regulasi",
      file_url: "assets/pdf/hak_kewajiban_pengguna_medsos.pdf",
    },
    {
      judul: "Peran Jaksa dalam Meningkatkan Kesadaran Hukum Masyarakat",
      kategori: "Edukasi Hukum dan Sosialisasi",
      file_url: "assets/pdf/peran_jaksa_kesadaran_hukum.pdf",
    },
  ];

  // ============================
  // 🔹 Render Tulisan
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

      // fallback jika file_url kosong
      const fileUrl = t.file_url || "#";

      card.innerHTML = `
        <img src="assets/img/pdf.png" alt="PDF Icon" class="pdf-icon">
        <p class="kategori">${t.kategori || "-"}</p>
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
  // 🔹 Mulai eksekusi
  // ============================
  await ambilTulisan();
});
