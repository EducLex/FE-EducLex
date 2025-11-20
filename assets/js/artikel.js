// artikel.js (untuk halaman user)

// 🔹 Data fallback jika fetch gagal (dengan field yang sudah disesuaikan untuk konsistensi)
const artikelData = {
  1: {
    id: 1,
    title: "Kenapa Hukum Itu Penting?",
    content: "Hukum berfungsi menjaga keteraturan sosial, melindungi hak setiap orang, serta memberikan rasa aman.",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Law_book.jpg",
    file: "assets/files/hukum-penting.pdf"
  },
  2: {
    id: 2,
    title: "Hak Remaja dalam Hukum",
    content: "Remaja memiliki hak hukum yang wajib dilindungi, antara lain hak atas pendidikan dan perlindungan dari kekerasan.",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Child_rights.jpg",
    file: "assets/files/hak-remaja.pdf"
  }
};

// 🔹 Elemen DOM modal
const modal = document.getElementById("artikelModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const modalImage = document.getElementById("modalImage");
const modalFile = document.getElementById("modalFile");
const closeBtn = document.querySelector(".close");

// 🔹 Elemen grid artikel
const artikelGrid = document.querySelector(".artikel-grid");
const apiBase = "http://localhost:8080";

// ======================================================
// 🔹 Fungsi GET semua artikel
// ======================================================
async function loadArtikel() {
  try {
    const response = await fetch(`${apiBase}/articles`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log("📥 Data artikel dari backend:", data);

    // Asumsikan data adalah array langsung dari backend
    if (Array.isArray(data)) {
      renderArtikel(data);
    } else {
      console.warn("⚠️ Format data tidak dikenali, menggunakan fallback.");
      renderArtikel(Object.values(artikelData));
    }
  } catch (error) {
    console.error("❌ Gagal memuat artikel:", error);
    renderArtikel(Object.values(artikelData)); // fallback
  }
}

// 🔹 Fungsi GET detail artikel by ID
async function getArtikelById(id) {
  try {
    const response = await fetch(`${apiBase}/articles/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    return result; // Asumsikan langsung objek artikel dari backend
  } catch (error) {
    console.error(`❌ Gagal mengambil artikel ID ${id}:`, error);
    return artikelData[id]; // fallback
  }
}

// ======================================================
// 🔹 Fungsi POST artikel baru (untuk keperluan admin, jika diperlukan di halaman user)
// ======================================================
async function createArtikel(newData) {
  try {
    const response = await fetch(`${apiBase}/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    });
    if (!response.ok) throw new Error(`Gagal menambah artikel`);
    console.log("✅ Artikel berhasil ditambahkan");
    await loadArtikel();
  } catch (error) {
    console.error("❌ Gagal menambah artikel:", error);
  }
}

// ======================================================
// 🔹 Fungsi PUT (update artikel)
// ======================================================
async function updateArtikel(id, updatedData) {
  try {
    const response = await fetch(`${apiBase}/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error(`Gagal memperbarui artikel`);
    console.log(`✅ Artikel ID ${id} berhasil diperbarui`);
    await loadArtikel();
  } catch (error) {
    console.error(`❌ Gagal memperbarui artikel ID ${id}:`, error);
  }
}

// ======================================================
// 🔹 Fungsi DELETE artikel
// ======================================================
async function deleteArtikel(id) {
  if (!confirm("Yakin ingin menghapus artikel ini?")) return;
  try {
    const response = await fetch(`${apiBase}/articles/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Gagal menghapus artikel`);
    console.log(`🗑️ Artikel ID ${id} berhasil dihapus`);
    await loadArtikel();
  } catch (error) {
    console.error(`❌ Gagal menghapus artikel ID ${id}:`, error);
  }
}

// ======================================================
// 🔹 Render daftar artikel dalam bentuk card grid
// ======================================================
function renderArtikel(list) {
  artikelGrid.innerHTML = "";

  if (!list || list.length === 0) {
    artikelGrid.innerHTML = `<p style="text-align:center; color:#777;">Belum ada artikel untuk ditampilkan.</p>`;
    return;
  }

  list.forEach((item) => {
    const card = document.createElement("article");
    card.classList.add("card");

    // Map field backend ke field yang diharapkan (judul -> title, isi -> content, dll.)
    const title = item.judul || item.title || "Tanpa Judul";
    const content = item.isi || item.content || "Tidak ada konten";
    const image = item.gambar || item.image || null;
    const file = item.dokumen || item.file || null;
    const id = item._id || item.id; // Gunakan _id dari backend sebagai id

    card.innerHTML = `
      ${image ? `<img src="${image}" alt="${title}" class="card-img" onerror="this.src='https://via.placeholder.com/400x250?text=No+Image';">` : ""}
      <div class="card-body">
        <h2>${title}</h2>
        <p>${content.substring(0, 150)}...</p>
        <div class="card-buttons">
          <a href="#" class="read-more" data-id="${id}">Baca Selengkapnya</a>
          <button class="btn-delete" data-id="${id}">🗑️</button>
        </div>
      </div>
    `;

    artikelGrid.appendChild(card);
  });

  // 🔹 Event klik "Baca Selengkapnya" → buka modal
  document.querySelectorAll(".read-more").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-id");
      const data = await getArtikelById(id);
      if (!data) return;

      // Map field untuk modal (judul -> title, isi -> content, dll.)
      const title = data.judul || data.title;
      const content = data.isi || data.content;
      const image = data.gambar || data.image;
      const file = data.dokumen || data.file;

      modalTitle.textContent = title;
      modalContent.innerHTML = content?.replace(/\n/g, "<br>") || "Konten tidak tersedia";

      if (image) {
        modalImage.innerHTML = `<img src="${image}" alt="${title}" style="max-width:100%; margin:15px 0; border-radius:8px;">`;
      } else {
        modalImage.innerHTML = "";
      }

      if (file) {
        const fileName = file.split("/").pop() || "file";
        modalFile.innerHTML = `<a href="${file}" download class="btn-download">⬇️ Unduh ${fileName}</a>`;
      } else {
        modalFile.innerHTML = "";
      }

      modal.style.display = "block";
    });
  });

  // 🔹 Event hapus artikel
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-id");
      deleteArtikel(id);
    });
  });
}

// ======================================================
// 🔹 Event modal close
// ======================================================
closeBtn.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// ======================================================
// 🔹 Jalankan otomatis saat halaman dimuat
// ======================================================
document.addEventListener("DOMContentLoaded", loadArtikel);
