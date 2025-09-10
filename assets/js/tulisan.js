document.addEventListener("DOMContentLoaded", () => {
  const tulisanBaru = document.getElementById("tulisanBaru");

  // 🔹 Fungsi untuk membuat card tulisan
  function buatCard({ penulis, kategori, judul, isi }) {
    const card = document.createElement("article");
    card.classList.add("tulisan-card");

    card.innerHTML = `
      <div class="penulis">
        <img src="assets/default-jaksa.jpg" alt="${penulis}" 
          style="width:50px;height:50px;border-radius:50%;object-fit:cover;" />
        <div>
          <h3>${penulis}</h3>
          <span class="kategori">${kategori}</span>
        </div>
      </div>
      <h2>${judul}</h2>
      <p>${isi.substring(0, 100)}...</p>
      <div class="card-actions">
        <a href="#" class="btn-detail"
           data-judul="${judul}"
           data-penulis="${penulis}"
           data-kategori="${kategori}"
           data-isi="${isi}">📖 Baca</a>
        <button class="btn-edit">✏️ Edit</button>
        <button class="btn-hapus">🗑️ Hapus</button>
      </div>
    `;

    return card;
  }

  // 🔹 Tambah tulisan baru
  document.getElementById("btnTambahTulisan").addEventListener("click", () => {
    Swal.fire({
      title: "Tambah Tulisan Baru",
      html: `
        <input id="penulis" class="swal2-input" placeholder="Nama Penulis">
        <input id="kategori" class="swal2-input" placeholder="Kategori">
        <input id="judul" class="swal2-input" placeholder="Judul Tulisan">
        <textarea id="isi" class="swal2-textarea" placeholder="Isi Tulisan"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      preConfirm: () => {
        const penulis = document.getElementById("penulis").value.trim();
        const kategori = document.getElementById("kategori").value.trim();
        const judul = document.getElementById("judul").value.trim();
        const isi = document.getElementById("isi").value.trim();

        if (!penulis || !kategori || !judul || !isi) {
          Swal.showValidationMessage("Semua field wajib diisi!");
          return false;
        }

        return { penulis, kategori, judul, isi };
      }
    }).then((res) => {
      if (res.isConfirmed) {
        const card = buatCard(res.value);
        tulisanBaru.prepend(card);
        Swal.fire("Berhasil!", "Tulisan berhasil ditambahkan.", "success");
      }
    });
  });

  // 🔹 Event Delegation: Detail, Edit, Hapus
  document.body.addEventListener("click", (e) => {
    // ➤ Detail
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
        confirmButtonText: "Tutup"
      });
    }

    // ➤ Edit
    if (e.target.classList.contains("btn-edit")) {
      const card = e.target.closest(".tulisan-card");
      const judul = card.querySelector("h2").innerText;
      const penulis = card.querySelector("h3").innerText;
      const kategori = card.querySelector(".kategori").innerText;
      const isi = card.querySelector(".btn-detail").dataset.isi;

      Swal.fire({
        title: "Edit Tulisan",
        html: `
          <input id="penulis" class="swal2-input" value="${penulis}">
          <input id="kategori" class="swal2-input" value="${kategori}">
          <input id="judul" class="swal2-input" value="${judul}">
          <textarea id="isi" class="swal2-textarea">${isi}</textarea>
        `,
        showCancelButton: true,
        confirmButtonText: "Update",
      }).then((res) => {
        if (res.isConfirmed) {
          const newPenulis = document.getElementById("penulis").value.trim();
          const newKategori = document.getElementById("kategori").value.trim();
          const newJudul = document.getElementById("judul").value.trim();
          const newIsi = document.getElementById("isi").value.trim();

          if (!newPenulis || !newKategori || !newJudul || !newIsi) {
            Swal.fire("Gagal", "Semua field wajib diisi!", "error");
            return;
          }

          const updatedCard = buatCard({
            penulis: newPenulis,
            kategori: newKategori,
            judul: newJudul,
            isi: newIsi,
          });

          card.replaceWith(updatedCard);

          Swal.fire("Berhasil!", "Tulisan berhasil diperbarui.", "success");
        }
      });
    }

    // ➤ Hapus
    if (e.target.classList.contains("btn-hapus")) {
      const card = e.target.closest(".tulisan-card");

      Swal.fire({
        title: "Yakin hapus?",
        text: "Tulisan ini akan dihapus permanen.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal"
      }).then((res) => {
        if (res.isConfirmed) {
          card.remove();
          Swal.fire("Terhapus!", "Tulisan sudah dihapus.", "success");
        }
      });
    }
  });
});
