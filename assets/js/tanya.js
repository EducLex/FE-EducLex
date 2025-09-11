// Simpan pertanyaan ke localStorage
function getPertanyaan() {
  return JSON.parse(localStorage.getItem("pertanyaanList")) || [];
}

function simpanPertanyaan(list) {
  localStorage.setItem("pertanyaanList", JSON.stringify(list));
}

// Render daftar pertanyaan
function renderPertanyaan() {
  const container = document.getElementById("daftar-pertanyaan");
  container.innerHTML = "";

  const list = getPertanyaan();
  list.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = `
      <p><strong>${item.nama}:</strong> ${item.pertanyaan}</p>
      <p><em>Jawaban: ${item.jawaban}</em></p>
      <div class="actions">
        <button onclick="editPertanyaan(${index})">✏️ Edit</button>
        <button onclick="hapusPertanyaan(${index})">🗑️ Hapus</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Kirim pertanyaan
function kirimPertanyaan(event) {
  event.preventDefault();

  const nama = document.getElementById("nama").value.trim() || "Anonim";
  const pertanyaan = document.getElementById("pertanyaan").value.trim();

  if (!pertanyaan) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Pertanyaan tidak boleh kosong!",
      confirmButtonColor: "#3085d6",
    });
    return false;
  }

  // Data pertanyaan
  const newData = {
    nama: nama,
    pertanyaan: pertanyaan,
    jawaban: "Pertanyaanmu sedang diproses oleh Jaksa EducLex..."
  };

  // Simpan ke localStorage
  const list = getPertanyaan();
  list.push(newData);
  simpanPertanyaan(list);

  // Render ulang daftar
  renderPertanyaan();

  // Reset form
  document.getElementById("tanyaForm").reset();

  // SweetAlert sukses
  Swal.fire({
    icon: "success",
    title: "Pertanyaan Terkirim!",
    text: "Pertanyaanmu berhasil dikirim. Tunggu jawaban dari Jaksa EducLex 😊",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });

  return false;
}

// Edit pertanyaan
function editPertanyaan(index) {
  const list = getPertanyaan();
  const data = list[index];

  Swal.fire({
    title: "Edit Pertanyaan",
    input: "text",
    inputValue: data.pertanyaan,
    showCancelButton: true,
    confirmButtonText: "Simpan",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed && result.value.trim() !== "") {
      list[index].pertanyaan = result.value.trim();
      simpanPertanyaan(list);
      renderPertanyaan();
      Swal.fire("Berhasil!", "Pertanyaan berhasil diperbarui.", "success");
    }
  });
}

// Hapus pertanyaan
function hapusPertanyaan(index) {
  const list = getPertanyaan();

  Swal.fire({
    title: "Apakah kamu yakin?",
    text: "Pertanyaan ini akan dihapus permanen.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal"
  }).then((result) => {
    if (result.isConfirmed) {
      list.splice(index, 1);
      simpanPertanyaan(list);
      renderPertanyaan();
      Swal.fire("Dihapus!", "Pertanyaanmu sudah dihapus.", "success");
    }
  });
}

// Saat halaman dibuka, render pertanyaan
document.addEventListener("DOMContentLoaded", renderPertanyaan);
