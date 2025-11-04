document.addEventListener("DOMContentLoaded", async () => {
  const tulisanBaru = document.getElementById("tulisanBaru");
  const tabelTulisanBody = document.getElementById("tabelTulisanBody");
  const formTulisan = document.getElementById("formTulisan");

  // === Fungsi buat card dengan ikon PDF + tombol Lihat & Unduh ===
  function buatCard({ _id, penulis, kategori, judul, isi, fileUrl }) {
    const card = document.createElement("article");
    card.classList.add("tulisan-card");

    // Link PDF default jika file belum ada
    const pdfLink = fileUrl || "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg";

    card.innerHTML = `
      <div class="pdf-preview">
        <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt="PDF" class="pdf-icon">
      </div>

      <div class="card-body">
        <p class="kategori">${kategori}</p>
        <h2>${judul}</h2>
        <p>${isi.substring(0, 100)}...</p>
      </div>

      <div class="card-actions">
        <a href="#" class="btn-detail"
           data-id="${_id || ''}"
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

  // === Ambil data dari backend ===
  async function fetchTulisan() {
    try {
      const res = await fetch("http://localhost:8080/tulisan");
      const data = await res.json();

      if (!Array.isArray(data)) throw new Error("Data tulisan tidak valid");

      // Untuk tampilan publik (jika elemen tulisanBaru ada)
      if (tulisanBaru) {
        tulisanBaru.innerHTML = "";
        data.forEach((t) => tulisanBaru.appendChild(buatCard(t)));
      }

      // Untuk tampilan admin (tabel daftar tulisan)
      if (tabelTulisanBody) {
        tabelTulisanBody.innerHTML = "";
        if (data.length === 0) {
          tabelTulisanBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Belum ada tulisan</td></tr>`;
        } else {
          data.forEach((t) => {
            const row = document.createElement("tr");
            const tanggal = new Date(t.updatedAt || Date.now()).toLocaleDateString("id-ID");
            row.innerHTML = `
              <td>${t.judul}</td>
              <td>${t.penulis}</td>
              <td>${t.kategori}</td>
              <td>${tanggal}</td>
              <td>
                <button class="btn-edit" data-id="${t._id}"><i class="fas fa-edit"></i></button>
                <button class="btn-hapus" data-id="${t._id}"><i class="fas fa-trash"></i></button>
              </td>
            `;
            tabelTulisanBody.appendChild(row);
          });
        }
      }
    } catch (err) {
      console.error("❌ Gagal memuat tulisan:", err);
      Swal.fire("Gagal", "Tidak dapat memuat tulisan dari server.", "error");
    }
  }

  await fetchTulisan();

  // === Form Tambah Tulisan (khusus admin page) ===
  if (formTulisan) {
    formTulisan.addEventListener("submit", async (e) => {
      e.preventDefault();

      const penulis = document.getElementById("namaPenulis").value.trim();
      const kategori = document.getElementById("kategoriTulisan").value.trim();
      const judul = document.getElementById("judulTulisan").value.trim();
      const isi = document.getElementById("isiTulisan").value.trim();

      if (!penulis || !kategori || !judul || !isi) {
        Swal.fire({
          icon: "warning",
          title: "Data Belum Lengkap!",
          text: "Mohon isi semua bidang yang wajib diisi.",
          confirmButtonColor: "#6D4C41"
        });
        return;
      }

      const dataBaru = { penulis, kategori, judul, isi };

      try {
        const res = await fetch("http://localhost:8080/tulisan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataBaru),
        });

        if (!res.ok) throw new Error("Gagal menambah tulisan");

        Swal.fire({
          icon: "success",
          title: "Tulisan Berhasil Disimpan!",
          text: "Tulisan telah ditambahkan ke daftar.",
          confirmButtonColor: "#6D4C41"
        });

        formTulisan.reset();
        await fetchTulisan();
      } catch (err) {
        console.error("❌ Error menambah tulisan:", err);
        Swal.fire("Gagal", "Tidak dapat menambahkan tulisan ke server.", "error");
      }
    });
  }

  // === Tombol tambah tulisan (pop-up manual) ===
  const btnTambah = document.getElementById("btnTambahTulisan");
  if (btnTambah) {
    btnTambah.addEventListener("click", async () => {
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
        },
      }).then(async (res) => {
        if (res.isConfirmed) {
          try {
            const tambahRes = await fetch("http://localhost:8080/tulisan", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(res.value),
            });

            if (!tambahRes.ok) throw new Error("Gagal menambah tulisan");
            Swal.fire("Berhasil!", "Tulisan berhasil ditambahkan.", "success");
            await fetchTulisan();
          } catch (error) {
            console.error(error);
            Swal.fire("Gagal", "Tidak dapat menambahkan tulisan.", "error");
          }
        }
      });
    });
  }

  // === Event Delegation: Lihat / Edit / Hapus ===
  document.body.addEventListener("click", async (e) => {
    // Lihat detail
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

    // Edit tulisan
    if (e.target.classList.contains("btn-edit")) {
      const id = e.target.dataset.id;
      const row = e.target.closest("tr");
      const judul = row.children[0].innerText;
      const penulis = row.children[1].innerText;
      const kategori = row.children[2].innerText;

      Swal.fire({
        title: "Edit Tulisan",
        html: `
          <input id="penulis" class="swal2-input" value="${penulis}">
          <input id="kategori" class="swal2-input" value="${kategori}">
          <input id="judul" class="swal2-input" value="${judul}">
          <textarea id="isi" class="swal2-textarea" placeholder="Perbarui isi tulisan di sini..."></textarea>
        `,
        showCancelButton: true,
        confirmButtonText: "Update",
      }).then(async (res) => {
        if (res.isConfirmed) {
          const newData = {
            penulis: document.getElementById("penulis").value.trim(),
            kategori: document.getElementById("kategori").value.trim(),
            judul: document.getElementById("judul").value.trim(),
            isi: document.getElementById("isi").value.trim(),
          };
          if (!newData.penulis || !newData.kategori || !newData.judul || !newData.isi) {
            Swal.fire("Gagal", "Semua field wajib diisi!", "error");
            return;
          }

          try {
            const updateRes = await fetch(`http://localhost:8080/tulisan/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newData),
            });

            if (!updateRes.ok) throw new Error("Gagal memperbarui tulisan");
            Swal.fire("Berhasil!", "Tulisan berhasil diperbarui.", "success");
            await fetchTulisan();
          } catch (err) {
            Swal.fire("Gagal", "Tidak dapat memperbarui tulisan.", "error");
          }
        }
      });
    }

    // Hapus tulisan
    if (e.target.classList.contains("btn-hapus")) {
      const id = e.target.dataset.id;
      Swal.fire({
        title: "Yakin hapus?",
        text: "Tulisan ini akan dihapus permanen.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
      }).then(async (res) => {
        if (res.isConfirmed) {
          try {
            const hapusRes = await fetch(`http://localhost:8080/tulisan/${id}`, {
              method: "DELETE",
            });

            if (!hapusRes.ok) throw new Error("Gagal menghapus tulisan");
            Swal.fire("Terhapus!", "Tulisan sudah dihapus.", "success");
            await fetchTulisan();
          } catch (err) {
            Swal.fire("Gagal", "Tidak dapat menghapus tulisan.", "error");
          }
        }
      });
    }
  });
});
