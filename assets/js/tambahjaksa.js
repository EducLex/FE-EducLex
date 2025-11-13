// ==========================================
// 🔸 Konfigurasi & Inisialisasi Elemen
// ==========================================
const tabelJaksaBody = document.getElementById("tabelJaksaBody");
const formJaksa = document.getElementById("formJaksa");

// ==========================================
// 🔸 Data Dummy Awal
// ==========================================
let dataJaksa = [
  {
    nama: "Budi Santoso, S.H.",
    nip: "19781231 200501 1 001",
    jabatan: "Intelijen",
    email: "budi.santoso@kejati.go.id",
  },
  {
    nama: "Rina Wulandari, S.H., M.H.",
    nip: "19850615 201003 2 002",
    jabatan: "Pidana Umum",
    email: "rina.wulandari@kejati.go.id",
  },
];

// ==========================================
// 🔸 Fungsi Render Data ke Tabel
// ==========================================
function renderTabel() {
  tabelJaksaBody.innerHTML = "";

  if (dataJaksa.length === 0) {
    tabelJaksaBody.innerHTML =
      '<tr><td colspan="5" style="text-align:center;">Belum ada data jaksa</td></tr>';
    return;
  }

  dataJaksa.forEach((jaksa, index) => {
    const row = `
      <tr>
        <td>${jaksa.nama}</td>
        <td>${jaksa.nip}</td>
        <td>${jaksa.jabatan}</td>
        <td>${jaksa.email}</td>
        <td>
          <button class="btn-edit" title="Edit Jaksa" onclick="editJaksa(${index})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-delete" title="Hapus Jaksa" onclick="hapusJaksa(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
    tabelJaksaBody.insertAdjacentHTML("beforeend", row);
  });
}

// ==========================================
// 🔸 Tambah Data Jaksa Baru
// ==========================================
formJaksa.addEventListener("submit", function (e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const nip = document.getElementById("nip").value.trim();
  const jabatan = document.getElementById("jabatan").value;
  const email = document.getElementById("email").value.trim();

  if (!nama || !nip || !jabatan || !email) {
    Swal.fire("Peringatan", "Semua field wajib diisi!", "warning");
    return;
  }

  // Tambah ke array
  dataJaksa.push({ nama, nip, jabatan, email });
  renderTabel();

  Swal.fire({
    icon: "success",
    title: "Data Jaksa Ditambahkan!",
    text: "Data jaksa baru berhasil disimpan.",
    confirmButtonColor: "#6D4C41",
  });

  formJaksa.reset();
});

// ==========================================
// 🔸 Hapus Data Jaksa
// ==========================================
function hapusJaksa(index) {
  Swal.fire({
    title: "Yakin ingin menghapus?",
    text: "Data jaksa akan dihapus secara permanen.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6D4C41",
    confirmButtonText: "Ya, hapus!",
  }).then((result) => {
    if (result.isConfirmed) {
      dataJaksa.splice(index, 1);
      renderTabel();
      Swal.fire("Dihapus!", "Data jaksa telah dihapus.", "success");
    }
  });
}

// ==========================================
// 🔸 Edit Data Jaksa (Popup SweetAlert)
// ==========================================
function editJaksa(index) {
  const jaksa = dataJaksa[index];

  Swal.fire({
    title: "Edit Data Jaksa",
    html: `
      <input id="editNama" class="swal2-input" placeholder="Nama" value="${jaksa.nama}">
      <input id="editNip" class="swal2-input" placeholder="NIP" value="${jaksa.nip}">
      <select id="editJabatan" class="swal2-input">
        <option value="Pembinaan" ${jaksa.jabatan === "Pembinaan" ? "selected" : ""}>Pembinaan</option>
        <option value="Intelijen" ${jaksa.jabatan === "Intelijen" ? "selected" : ""}>Intelijen</option>
        <option value="Pidana Umum" ${jaksa.jabatan === "Pidana Umum" ? "selected" : ""}>Pidana Umum</option>
        <option value="Pidana Khusus" ${jaksa.jabatan === "Pidana Khusus" ? "selected" : ""}>Pidana Khusus</option>
        <option value="Perdata dan Tata Usaha Negara" ${jaksa.jabatan === "Perdata dan Tata Usaha Negara" ? "selected" : ""}>Perdata dan Tata Usaha Negara</option>
        <option value="Pidana Militer" ${jaksa.jabatan === "Pidana Militer" ? "selected" : ""}>Pidana Militer</option>
        <option value="Asisten Pengawasan" ${jaksa.jabatan === "Asisten Pengawasan" ? "selected" : ""}>Asisten Pengawasan</option>
      </select>
      <input id="editEmail" class="swal2-input" placeholder="Email" value="${jaksa.email}">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Simpan",
    cancelButtonText: "Batal",
    confirmButtonColor: "#6D4C41",
    preConfirm: () => {
      const namaBaru = document.getElementById("editNama").value.trim();
      const nipBaru = document.getElementById("editNip").value.trim();
      const jabatanBaru = document.getElementById("editJabatan").value;
      const emailBaru = document.getElementById("editEmail").value.trim();

      if (!namaBaru || !nipBaru || !jabatanBaru || !emailBaru) {
        Swal.showValidationMessage("Semua field harus diisi!");
        return false;
      }

      jaksa.nama = namaBaru;
      jaksa.nip = nipBaru;
      jaksa.jabatan = jabatanBaru;
      jaksa.email = emailBaru;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      renderTabel();
      Swal.fire("Tersimpan!", "Data jaksa berhasil diperbarui.", "success");
    }
  });
}

// ==========================================
// 🔸 Jalankan Saat Halaman Dimuat
// ==========================================
document.addEventListener("DOMContentLoaded", renderTabel);
