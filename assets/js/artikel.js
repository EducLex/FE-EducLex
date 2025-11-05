// artikel.js (untuk halaman user)

// 🔹 Data fallback jika fetch gagal
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

    if (Array.isArray(data)) {
      renderArtikel(data);
    } else if (Array.isArray(data.articles)) {
      renderArtikel(data.articles);
    } else if (Array.isArray(data.data)) {
      renderArtikel(data.data);
    } else {
      console.warn("⚠️ Format data tidak dikenali, menggunakan fallback.");
      renderArtikel(Object.values(artikelData));
    }
  } catch (error) {
    console.error("❌ Gagal memuat artikel:", error);
    renderArtikel(Object.values(artikelData)); // fallback
  }
}

// ======================================================
// 🔹 Fungsi GET detail artikel by ID
// ======================================================
async function getArtikelById(id) {
  try {
    const response = await fetch(`${apiBase}/articles/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`❌ Gagal mengambil artikel ID ${id}:`, error);
    return artikelData[id]; // fallback
  }
}

// ======================================================
// 🔹 Fungsi POST artikel baru
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

  list.forEach((item, index) => {
    const card = document.createElement("article");
    card.classList.add("card");

    card.innerHTML = `
      ${item.image ? `<img src="${item.image}" alt="${item.title}" class="card-img" onerror="this.src='https://via.placeholder.com/400x250?text=No+Image';">` : ""}
      <div class="card-body">
        <h2>${item.title || "Tanpa Judul"}</h2>
        <p>${item.content?.substring(0, 150) || "Tidak ada konten"}...</p>
        <div class="card-buttons">
          <a href="#" class="read-more" data-id="${item.id || index}">Baca Selengkapnya</a>
          <button class="btn-delete" data-id="${item.id || index}">🗑️</button>
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

      modalTitle.textContent = data.title;
      modalContent.innerHTML = data.content?.replace(/\n/g, "<br>") || "Konten tidak tersedia";

      if (data.image) {
        modalImage.innerHTML = `<img src="${data.image}" alt="${data.title}" style="max-width:100%; margin:15px 0; border-radius:8px;">`;
      } else {
        modalImage.innerHTML = "";
      }

      if (data.file) {
        const fileName = data.file.split("/").pop();
        modalFile.innerHTML = `<a href="${data.file}" download class="btn-download">⬇️ Unduh ${fileName}</a>`;
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
