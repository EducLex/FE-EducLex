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
  list.reverse().forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = `<strong>${item.nama}:</strong> ${item.pertanyaan} 
      <br><em>Jawaban: ${item.jawaban}</em>`;
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

// Saat halaman dibuka, render pertanyaan
document.addEventListener("DOMContentLoaded", renderPertanyaan);
