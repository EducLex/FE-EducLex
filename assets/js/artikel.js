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
      `
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
      `
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
      `
  },
  4: {
    title: "Peran Jaksa dalam Penegakan Hukum",
    content: `
      Jaksa berperan sebagai penuntut umum, tetapi juga sebagai pengawas hukum 
      dan pendidik masyarakat agar sadar hukum. 
      
      📜 Pasal relevan:
      - UU No. 16 Tahun 2004 tentang Kejaksaan RI, Pasal 30 ayat (1): 
        "Kejaksaan mempunyai tugas dan wewenang di bidang penuntutan."
      `
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
      `
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
      `
  }
};

// Ambil elemen modal
const modal = document.getElementById("artikelModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const closeBtn = document.querySelector(".close");

// Event klik tombol "Baca Selengkapnya"
document.querySelectorAll(".read-more").forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.preventDefault();
    const id = this.getAttribute("data-id");
    modalTitle.textContent = artikelData[id].title;
    modalContent.innerHTML = artikelData[id].content.replace(/\n/g, "<br>");
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
