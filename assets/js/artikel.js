// artikel.js

// Data artikel bawaan (fallback jika fetch gagal)
const artikelData = {
  1: {
    title: "Kenapa Hukum Itu Penting?",
    content: "Hukum berfungsi menjaga keteraturan sosial, melindungi hak setiap orang, serta memberikan rasa aman.",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Law_book.jpg",
    file: "assets/files/hukum-penting.pdf"
  },
  2: {
    title: "Hak Remaja dalam Hukum",
    content: "Remaja memiliki hak hukum yang wajib dilindungi, antara lain hak atas pendidikan dan perlindungan dari kekerasan.",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Child_rights.jpg",
    file: "assets/files/hak-remaja.pdf"
  }
};

// Elemen DOM untuk modal
const modal = document.getElementById("artikelModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const modalImage = document.getElementById("modalImage");
const modalFile = document.getElementById("modalFile");
const closeBtn = document.querySelector(".close");

// 🔹 Ambil elemen artikel grid
const artikelGrid = document.querySelector(".artikel-grid");
const apiBase = "http://localhost:8080";

// 🔹 Load artikel dari backend
async function loadArtikel() {
  try {
    const response = await fetch(`${apiBase}/articles`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    let data = await response.json();
    console.log("📥 Data artikel dari backend:", data);

    if (Array.isArray(data)) {
      renderArtikel(data);
    } else if (Array.isArray(data.articles)) {
      renderArtikel(data.articles);
    } else if (Array.isArray(data.data)) {
      renderArtikel(data.data);
    } else {
      console.error("❌ Format response tidak sesuai:", data);
      renderArtikel(Object.values(artikelData));
    }
  } catch (error) {
    console.error("❌ Error fetch artikel:", error);
    renderArtikel(Object.values(artikelData));
  }
}

// 🔹 Render artikel ke grid (foto + judul + isi singkat)
function renderArtikel(list) {
  artikelGrid.innerHTML = "";
  list.forEach((item, index) => {
    const card = document.createElement("article");
    card.classList.add("card");
    card.innerHTML = `
      ${item.image ? `<img src="${item.image}" alt="${item.title}" class="card-img" onerror="this.src='https://via.placeholder.com/400x250?text=No+Image';">` : ""}
      <div class="card-body">
        <h2>${item.title || "Tanpa Judul"}</h2>
        <p>${item.content?.substring(0, 150) || "Tidak ada konten"}...</p>
        <a href="#" class="read-more" data-id="${item.id || index}">Baca Selengkapnya</a>
      </div>
    `;
    artikelGrid.appendChild(card);
  });

  // Event listener modal
  document.querySelectorAll(".read-more").forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      const id = this.getAttribute("data-id");
      const data = list.find(a => a.id == id) || artikelData[id];
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
}

// 🔹 Tutup modal
closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

// 🔹 Tambah artikel baru
const formArtikel = document.getElementById("formArtikel");
formArtikel.addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData(this);

  try {
    const response = await fetch(`${apiBase}/articles`, { method: "POST", body: formData });
    if (!response.ok) throw new Error(`Gagal tambah artikel: ${response.status}`);

    await response.json();
    alert("✅ Artikel berhasil ditambahkan!");
    loadArtikel();
    formArtikel.reset();
  } catch (err) {
    console.error("❌ Error tambah artikel:", err);
    alert("Gagal menambahkan artikel.");
  }
});

// 🔹 Jalankan saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadArtikel);
