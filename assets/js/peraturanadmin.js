document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("peraturanContainer");
  const tabelBody = document.getElementById("tabelPeraturanBody");
  const formPeraturan = document.getElementById("formPeraturan");
  const tambahBtn = document.getElementById("tambahPeraturanBtn");

  // Pastikan elemen utama ada
  if (!container || !tabelBody || !formPeraturan) {
    console.error("❌ Beberapa elemen penting tidak ditemukan di HTML.");
    return;
  }

  // ✅ Fungsi asli untuk menampilkan peraturan (dipertahankan)
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

  // ✅ Fungsi untuk fetch data peraturan dari backend
  async function ambilPeraturan() {
    try {
      const response = await fetch("http://localhost:8080/peraturan");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const hasil = await response.json();
      console.log("✅ Data peraturan berhasil diambil:", hasil);
      tampilkanPeraturan(hasil);
      perbaruiTabel(hasil);
    } catch (error) {
      console.error("❌ Gagal mengambil data peraturan:", error);
      container.innerHTML = "<p style='color:red;'>Gagal memuat data peraturan. Periksa server backend!</p>";
    }
  }

  // ✅ Tambahkan peraturan baru secara dinamis
  let peraturanCount = 1;
  tambahBtn.addEventListener("click", () => {
    peraturanCount++;
    const div = document.createElement("div");
    div.classList.add("form-group", "peraturan-item");
    div.innerHTML = `
      <label for="peraturan${peraturanCount}">Peraturan ${peraturanCount}</label>
      <textarea id="peraturan${peraturanCount}" name="peraturan[]" rows="4" placeholder="Masukkan isi peraturan ${peraturanCount}..." required></textarea>
    `;
    container.appendChild(div);
  });

  // ✅ Fungsi untuk memperbarui tabel daftar peraturan
  function perbaruiTabel(data) {
    tabelBody.innerHTML = "";
    if (!Array.isArray(data) || data.length === 0) {
      tabelBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Belum ada data peraturan</td></tr>`;
      return;
    }

    data.forEach(item => {
      const baris = document.createElement("tr");
      const totalPeraturan = Array.isArray(item.isi) ? item.isi.length : 1;
      const tanggal = item.tanggal || new Date().toLocaleDateString("id-ID");

      baris.innerHTML = `
        <td>${item.judulKasus || item.judul || "Tanpa Judul"}</td>
        <td>${totalPeraturan} Peraturan</td>
        <td>${tanggal}</td>
        <td>
          <button class="btn-edit" data-id="${item._id || ''}"><i class="fas fa-edit"></i> Edit</button>
          <button class="btn-delete" data-id="${item._id || ''}"><i class="fas fa-trash"></i> Hapus</button>
        </td>
      `;
      tabelBody.appendChild(baris);
    });
  }

  // ✅ Submit form peraturan
  formPeraturan.addEventListener("submit", async (e) => {
    e.preventDefault();
    const judulKasus = document.getElementById("judulKasus").value.trim();
    const peraturanElems = document.querySelectorAll('textarea[name="peraturan[]"]');
    const isiPeraturan = Array.from(peraturanElems).map(p => p.value.trim()).filter(p => p !== "");

    if (!judulKasus || isiPeraturan.length === 0) {
      Swal.fire("Gagal", "Semua field wajib diisi!", "error");
      return;
    }

    const dataKirim = { judulKasus, isi: isiPeraturan, tanggal: new Date().toISOString() };

    try {
      const kirim = await fetch("http://localhost:8080/peraturan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataKirim),
      });

      if (!kirim.ok) throw new Error("Gagal menyimpan peraturan baru.");
      Swal.fire("Berhasil!", "Data peraturan berhasil disimpan.", "success");
      formPeraturan.reset();
      container.innerHTML = `
        <div class="form-group peraturan-item">
          <label for="peraturan1">Peraturan 1</label>
          <textarea id="peraturan1" name="peraturan[]" rows="4" placeholder="Masukkan isi peraturan 1..." required></textarea>
        </div>
      `;
      peraturanCount = 1;
      ambilPeraturan(); // refresh data
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Tidak dapat menambahkan peraturan baru.", "error");
    }
  });

  // ✅ Event delegation untuk Edit & Hapus
  document.body.addEventListener("click", async (e) => {
    // Hapus data
    if (e.target.closest(".btn-delete")) {
      const id = e.target.closest(".btn-delete").dataset.id;
      Swal.fire({
        title: "Yakin hapus?",
        text: "Data peraturan ini akan dihapus permanen.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
      }).then(async (res) => {
        if (res.isConfirmed) {
          try {
            const hapusRes = await fetch(`http://localhost:8080/peraturan/${id}`, { method: "DELETE" });
            if (!hapusRes.ok) throw new Error("Gagal menghapus data");
            Swal.fire("Terhapus!", "Data peraturan berhasil dihapus.", "success");
            ambilPeraturan();
          } catch (error) {
            Swal.fire("Error", "Tidak dapat menghapus data peraturan.", "error");
          }
        }
      });
    }

    // Edit data
    if (e.target.closest(".btn-edit")) {
      const id = e.target.closest(".btn-edit").dataset.id;
      Swal.fire({
        title: "Edit Judul Peraturan",
        input: "text",
        inputLabel: "Masukkan judul baru:",
        showCancelButton: true,
        confirmButtonText: "Simpan Perubahan",
      }).then(async (res) => {
        if (res.isConfirmed && res.value.trim()) {
          try {
            const updateRes = await fetch(`http://localhost:8080/peraturan/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ judulKasus: res.value }),
            });
            if (!updateRes.ok) throw new Error("Gagal memperbarui peraturan");
            Swal.fire("Berhasil!", "Judul peraturan berhasil diperbarui.", "success");
            ambilPeraturan();
          } catch (err) {
            Swal.fire("Error", "Tidak dapat memperbarui data.", "error");
          }
        }
      });
    }
  });

  // Jalankan fetch saat halaman dimuat
  ambilPeraturan();
});
