document.addEventListener("DOMContentLoaded", async () => {
  const tulisanBaru = document.getElementById("tulisanBaru");

  // === Fungsi buat card dengan ikon PDF + tombol Lihat & Unduh ===
  function buatCard({ _id, penulis, kategori, judul, isi, fileUrl }) {
    const card = document.createElement("article");
    card.classList.add("tulisan-card");

    const pdfLink = fileUrl || "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg";

    card.innerHTML = `
      <div class="pdf-preview">
        <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" 
             alt="PDF" class="pdf-icon">
      </div>

      <div class="card-body">
        <p class="kategori">${kategori}</p>
        <h2>${judul}</h2>
        <p>${isi.substring(0, 100)}...</p>
      </div>

      <div class="card-actions">
        <a href="#" class="btn-detail"
           data-judul="${judul}"
           data-penulis="${penulis}"
           data-kategori="${kategori}"
           data-isi="${isi}">
           👁️ Lihat
        </a>
        <a href="${pdfLink}" download class="btn-unduh">⬇️ Unduh</a>
      </div>
    `;
    return card;
  }

  // === Ambil data tulisan dari backend ===
  async function fetchTulisan() {
    try {
      const res = await fetch("http://localhost:8080/tulisan");
      const data = await res.json();

      if (!Array.isArray(data)) throw new Error("Data tulisan tidak valid");
      tulisanBaru.innerHTML = "";
      data.forEach((t) => tulisanBaru.appendChild(buatCard(t)));
    } catch (err) {
      console.error("❌ Gagal memuat tulisan:", err);
      Swal.fire("Gagal", "Tidak dapat memuat tulisan dari server.", "error");
    }
  }

  await fetchTulisan();

  // === Event untuk lihat detail tulisan ===
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-detail")) {
      e.preventDefault();
      const { judul, penulis, kategori, isi } = e.target.dataset;
      Swal.fire({
        title: judul,
        html: `
          <p><strong>${penulis}</strong> | <em>${kategori}</em></p>
          <hr>
          <p style="text-align:left">${isi}</p>
        `,
        width: 700,
        confirmButtonText: "Tutup",
      });
    }
  });
});
