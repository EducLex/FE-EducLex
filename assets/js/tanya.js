const apiBase = "http://localhost:8080/questions";

// 🔹 Ambil semua pertanyaan yang sudah dijawab atau sedang diproses oleh jaksa
async function getPertanyaanPublik() {
  try {
    const res = await fetch(apiBase, { credentials: "include" });
    if (!res.ok) throw new Error("Gagal mengambil data pertanyaan");
    const data = await res.json();

    // Filter agar tampil semua pertanyaan publik (dengan status apapun)
    return data.filter((q) => q.tipe !== "internal");
  } catch (err) {
    console.error("❌ Error fetch pertanyaan:", err);
    return [];
  }
}

// 🔹 Render daftar pertanyaan / pengaduan di halaman publik
async function renderPertanyaanPublik() {
  const container = document.getElementById("daftar-pertanyaan");
  container.innerHTML = "<p>⏳ Memuat pertanyaan...</p>";

  const list = await getPertanyaanPublik();
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = "<p>Belum ada pertanyaan atau pengaduan yang ditampilkan.</p>";
    return;
  }

  list.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("pertanyaan-card");

    // Status Warna
    let statusColor = "#795548";
    if (item.status === "Belum Dijawab") statusColor = "#b71c1c";
    else if (item.status === "Sedang Diproses") statusColor = "#f57c00";
    else if (item.status === "Sudah Dijawab") statusColor = "#2e7d32";

    // Render thread diskusi jika ada
    let threadHTML = "";
    if (item.diskusi && item.diskusi.length > 0) {
      threadHTML = `
        <div class="diskusi-thread">
          <h4>Diskusi Lanjutan:</h4>
          ${item.diskusi
            .map(
              (d) => `
              <div class="balasan">
                <strong>${d.pengirim}:</strong>
                <p>${d.pesan}</p>
              </div>`
            )
            .join("")}
        </div>
      `;
    }

    // Render Kartu Pertanyaan
    card.innerHTML = `
      <div class="pertanyaan-header">
        <strong>${item.nama || "Anonim"}</strong> 
        <span class="status" style="color:${statusColor}; font-weight:600;">
          ${item.status || "Belum Dijawab"}
        </span>
      </div>
      <p class="pertanyaan-teks">${item.pertanyaan}</p>

      ${
        item.jawaban
          ? `<div class="jawaban-box"><strong>💬 Jawaban Jaksa:</strong> <p>${item.jawaban}</p></div>`
          : `<p class="belum-jawab">Menunggu jawaban dari Jaksa...</p>`
      }

      ${threadHTML}

      <button class="btn-diskusi" onclick="bukaFormDiskusi('${item.id}')">
        💭 Tambah Diskusi
      </button>
      <div class="form-diskusi" id="formDiskusi-${item.id}" style="display:none;">
        <textarea id="pesanDiskusi-${item.id}" placeholder="Ketik tanggapan atau pertanyaan lanjutan..."></textarea>
        <button class="btn-kirim" onclick="kirimDiskusi('${item.id}')">Kirim</button>
      </div>
    `;

    container.appendChild(card);
  });
}

// 🔹 Kirim pertanyaan baru dari user
async function kirimPertanyaan(event) {
  event.preventDefault();

  const nama = document.getElementById("nama").value.trim() || "Anonim";
  const email = document.getElementById("email").value.trim();
  const kategori = document.getElementById("kategori")?.value || "Pertanyaan Umum";
  const pertanyaan = document.getElementById("pertanyaan").value.trim();

  if (!pertanyaan) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Pertanyaan atau pengaduan tidak boleh kosong!",
      confirmButtonColor: "#6D4C41",
    });
    return false;
  }

  try {
    const res = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, email, kategori, pertanyaan }),
      credentials: "include",
    });

    if (!res.ok) throw new Error("Gagal mengirim pertanyaan");

    Swal.fire({
      icon: "success",
      title: "Terkirim!",
      text: "Pertanyaan atau pengaduanmu telah dikirim ke Jaksa EducLex.",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });

    document.getElementById("tanyaForm").reset();
    renderPertanyaanPublik();
  } catch (err) {
    console.error("❌ Error kirim:", err);
    Swal.fire("Error", "Tidak bisa mengirim ke server!", "error");
  }

  return false;
}

// 🔹 Tampilkan form diskusi di bawah pertanyaan
function bukaFormDiskusi(id) {
  const form = document.getElementById(`formDiskusi-${id}`);
  form.style.display = form.style.display === "none" ? "block" : "none";
}

// 🔹 Kirim pesan diskusi lanjutan
async function kirimDiskusi(id) {
  const pesan = document.getElementById(`pesanDiskusi-${id}`).value.trim();
  if (!pesan) {
    Swal.fire({
      icon: "warning",
      title: "Pesan kosong!",
      text: "Silakan tulis pesan untuk dikirim ke jaksa.",
      confirmButtonColor: "#6D4C41",
    });
    return;
  }

  try {
    const res = await fetch(`${apiBase}/${id}/diskusi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pengirim: "Masyarakat", pesan }),
      credentials: "include",
    });

    if (!res.ok) throw new Error("Gagal mengirim diskusi");

    Swal.fire({
      icon: "success",
      title: "Diskusi terkirim!",
      text: "Pesanmu telah dikirim untuk ditinjau oleh Jaksa.",
      confirmButtonColor: "#6D4C41",
    });

    renderPertanyaanPublik();
  } catch (err) {
    console.error("❌ Error diskusi:", err);
    Swal.fire("Error", "Tidak dapat mengirim diskusi!", "error");
  }
}

document.addEventListener("DOMContentLoaded", renderPertanyaanPublik);
