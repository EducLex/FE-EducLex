// Data artikel lengkap + pasal hukum
const artikelData = {
  1: {
    title: "Kenapa Hukum Itu Penting?",
    content: `
      Hukum berfungsi menjaga keteraturan sosial, melindungi hak setiap orang, 
      serta memberikan rasa aman. Tanpa hukum, masyarakat akan sulit hidup 
      damai karena tidak ada aturan yang mengikat. 
      
      📜 Pasal relevan:
      - UUD 1945 Pasal 1 ayat (3): "Indonesia adalah negara hukum."
      `,
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Law_book.jpg",
    file: "assets/files/hukum-penting.pdf"
  },
  2: {
    title: "Hak Remaja dalam Hukum",
    content: `
      Remaja memiliki hak hukum yang wajib dilindungi, antara lain hak atas pendidikan, 
      perlindungan dari kekerasan, serta kebebasan berpendapat yang bertanggung jawab. 
      
      📜 Pasal relevan:
      - UU No. 35 Tahun 2014 tentang Perlindungan Anak, Pasal 59: 
        "Pemerintah, pemerintah daerah, dan lembaga negara lainnya berkewajiban 
        memberikan perlindungan khusus kepada anak."
      `,
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Child_rights.jpg",
    file: "assets/files/hak-remaja.pdf"
  },
  3: {
    title: "Etika Menggunakan Media Sosial",
    content: `
      Media sosial bisa berdampak hukum jika digunakan secara tidak bijak, 
      misalnya menyebarkan hoaks, pencemaran nama baik, atau ujaran kebencian. 
      
      📜 Pasal relevan:
      - UU No. 19 Tahun 2016 (UU ITE) Pasal 27 ayat (3): 
        "Setiap orang dengan sengaja mendistribusikan atau mentransmisikan 
        dokumen elektronik yang memuat penghinaan atau pencemaran nama baik 
        dapat dipidana."
      `,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  },
  4: {
    title: "Peran Jaksa dalam Penegakan Hukum",
    content: `
      Jaksa berperan sebagai penuntut umum, tetapi juga sebagai pengawas hukum 
      dan pendidik masyarakat agar sadar hukum. 
      
      📜 Pasal relevan:
      - UU No. 16 Tahun 2004 tentang Kejaksaan RI, Pasal 30 ayat (1): 
        "Kejaksaan mempunyai tugas dan wewenang di bidang penuntutan."
      `,
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Courtroom.jpg",
    file: "assets/files/peran-jaksa.docx"
  },
  5: {
    title: "Kasus Ringan yang Bisa Jadi Berat",
    content: `
      Perbuatan kecil bisa berdampak besar jika melanggar hukum, 
      contohnya pencurian ringan atau perusakan barang. 
      
      📜 Pasal relevan:
      - KUHP Pasal 362: "Barang siapa mengambil sesuatu barang yang seluruhnya 
        atau sebagian kepunyaan orang lain, dengan maksud untuk dimiliki 
        secara melawan hukum, diancam karena pencurian dengan pidana penjara."
      `,
    image: "https://images.unsplash.com/photo-1528744598421-b7b93e12df15"
  },
  6: {
    title: "Kenali Undang-Undang ITE",
    content: `
      UU ITE mengatur perilaku di dunia digital. Segala bentuk ujaran kebencian, 
      penyebaran hoaks, hingga pelanggaran privasi bisa berimplikasi hukum. 
      
      📜 Pasal relevan:
      - UU No. 19 Tahun 2016 (UU ITE) Pasal 28 ayat (1): 
        "Setiap orang yang dengan sengaja menyebarkan berita bohong dan menyesatkan 
        yang mengakibatkan kerugian konsumen dalam transaksi elektronik dipidana."
      `,
    image: "https://upload.wikimedia.org/wikipedia/commons/7/70/Internet1.jpg",
    file: "assets/files/uu-ite.pdf"
  }
};

// Ambil elemen modal
const modal = document.getElementById("artikelModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const modalImage = document.getElementById("modalImage");
const modalFile = document.getElementById("modalFile");
const closeBtn = document.querySelector(".close");

// Event klik tombol "Baca Selengkapnya"
document.querySelectorAll(".read-more").forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.preventDefault();
    const id = this.getAttribute("data-id");
    const data = artikelData[id];

    modalTitle.textContent = data.title;
    modalContent.innerHTML = data.content.replace(/\n/g, "<br>");

    // Tambahkan gambar jika ada
    if (data.image) {
      modalImage.innerHTML = `
        <img src="${data.image}" 
             alt="${data.title}" 
             style="max-width:100%; margin:15px 0; border-radius:8px;"
             onerror="this.src='https://via.placeholder.com/600x400?text=Gambar+tidak+tersedia';">
      `;
    } else {
      modalImage.innerHTML = "";
    }

    // Tambahkan file unduhan jika ada
    if (data.file) {
      const fileName = data.file.split("/").pop();
      modalFile.innerHTML = `<a href="${data.file}" download class="btn-download">⬇️ Unduh ${fileName}</a>`;
    } else {
      modalFile.innerHTML = "";
    }

    modal.style.display = "block";
  });
});

// Tutup modal saat klik X
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Tutup modal saat klik di luar konten
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
