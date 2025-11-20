const API = "http://localhost:8080";

// ======================
// LOAD SEMUA ARTIKEL
// ======================
async function loadArtikel() {
  try {
    const res = await fetch(`${API}/articles`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    console.log("📥 Data artikel dari backend (admin):", data); // Logging untuk debug

    const tbody = document.getElementById("tabelArtikelBody");
    tbody.innerHTML = "";

    // Handling format response backend: cek nested atau array langsung
    let articles = [];
    if (Array.isArray(data)) {
      articles = data;
    } else if (data.data && Array.isArray(data.data)) {
      articles = data.data;
    } else if (data.articles && Array.isArray(data.articles)) {
      articles = data.articles;
    } else {
      console.warn("⚠️ Format response tidak dikenali, menggunakan array kosong.");
      articles = [];
    }

    if (articles.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Belum ada artikel</td></tr>`;
      return;
    }

    articles.forEach(a => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${a.judul || "Tanpa Judul"}</td>
        <td>${a.created ? new Date(a.created).toLocaleDateString() : "Tidak diketahui"}</td>
        <td>${a.penulis || "Tidak diketahui"}</td>
        <td>
          <button class="btn-detail" data-id="${a._id || a.id}">Detail</button>
          <button class="btn-edit" data-id="${a._id || a.id}">Edit</button>
          <button class="btn-delete" data-id="${a._id || a.id}">Hapus</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Event listener untuk detail
    document.querySelectorAll(".btn-detail").forEach(btn => {
      btn.addEventListener("click", function () {
        const id = this.dataset.id;
        openDetail(id);
      });
    });

    // Event listener untuk edit (opsional)
    document.querySelectorAll(".btn-edit").forEach(btn => {
      btn.addEventListener("click", function () {
        const id = this.dataset.id;
        console.log("Edit artikel ID:", id); // Placeholder untuk implementasi edit
      });
    });

    // Event listener untuk hapus
    document.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", function () {
        const id = this.dataset.id;
        deleteArtikel(id);
      });
    });

  } catch (err) {
    console.error("❌ Gagal load artikel:", err);
    const tbody = document.getElementById("tabelArtikelBody");
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">Error: ${err.message}</td></tr>`;
  }
}

// ======================
// DETAIL ARTIKEL
// ======================
async function openDetail(id) {
  try {
    const res = await fetch(`${API}/articles/${id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    console.log("📥 Detail artikel:", data);

    Swal.fire({
      title: data.judul || "Tanpa Judul",
      html: `
        <p><b>Kategori:</b> ${data.kategori || "Tidak diketahui"}</p>
        <p><b>Penulis:</b> ${data.penulis || "Tidak diketahui"}</p>
        ${data.gambar ? `<img src="${data.gambar}" alt="Gambar" style="max-width:100%; margin:10px 0;">` : ""}
        <hr>
        <p style="text-align:left">${data.isi || "Tidak ada isi"}</p>
        ${data.dokumen ? `<a href="${data.dokumen}" download>⬇️ Unduh Dokumen</a>` : ""}
      `,
      width: 600,
    });

  } catch (err) {
    console.error("❌ Gagal fetch detail:", err);
    Swal.fire("Error", `Gagal mengambil detail artikel: ${err.message}`, "error");
  }
}

// ======================
// TAMBAH ARTIKEL
// ======================
document.getElementById("formArtikel").addEventListener("submit", async function (e) {
  e.preventDefault();

  const gambarInput = document.getElementById("gambar");
  const dokumenInput = document.getElementById("dokumen");

  // Handle gambar (convert to base64)
  let gambar = null;
  if (gambarInput.files[0]) {
    try {
      gambar = await toBase64(gambarInput.files[0]);
    } catch (err) {
      console.error("❌ Gagal convert gambar:", err);
      Swal.fire("Error", "Gagal memproses gambar", "error");
      return;
    }
  }

  // Handle dokumen (convert to base64)
  let dokumen = null;
  if (dokumenInput.files[0]) {
    try {
      dokumen = await toBase64(dokumenInput.files[0]);
    } catch (err) {
      console.error("❌ Gagal convert dokumen:", err);
      Swal.fire("Error", "Gagal memproses dokumen", "error");
      return;
    }
  }

  const payload = {
    judul: document.getElementById("judul").value.trim(),
    isi: document.getElementById("isi").value.trim(),
    penulis: "Jaksa A",
    kategori: "Edukasi Hukum",
    gambar: gambar,
    dokumen: dokumen
  };

  // Validasi sederhana
  if (!payload.judul || !payload.isi) {
    Swal.fire("Error", "Judul dan isi artikel wajib diisi!", "error");
    return;
  }

  try {
    const res = await fetch(`${API}/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`HTTP ${res.status}: ${errorData.message || "Gagal tambah artikel"}`);
    }

    const newArtikel = await res.json();
    console.log("✅ Artikel berhasil ditambahkan:", newArtikel);

    Swal.fire("Berhasil!", "Artikel berhasil ditambahkan dan tersimpan ke database!", "success");
    this.reset();
    loadArtikel();

  } catch (err) {
    console.error("❌ Gagal menambahkan artikel:", err);
    Swal.fire("Error", `Gagal menambahkan artikel: ${err.message}`, "error");
  }
});

// ======================
// HAPUS ARTIKEL
// ======================
async function deleteArtikel(id) {
  if (!confirm("Yakin ingin menghapus artikel ini?")) return;

  try {
    const res = await fetch(`${API}/articles/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    console.log(`🗑️ Artikel ID ${id} berhasil dihapus`);
    Swal.fire("Berhasil!", "Artikel berhasil dihapus!", "success");
    loadArtikel();

  } catch (err) {
    console.error(`❌ Gagal menghapus artikel ID ${id}:`, err);
    Swal.fire("Error", `Gagal menghapus artikel: ${err.message}`, "error");
  }
}

// Fungsi helper untuk convert file ke base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// ======================
// Jalankan saat halaman load
// ======================
document.addEventListener("DOMContentLoaded", loadArtikel);
