const apiBase = "http://localhost:8080/questions";

// =======================
// 🔹 AMBIL SEMUA PERTANYAAN PUBLIK
// =======================
async function getPertanyaanPublik() {
  try {
    const res = await fetch(apiBase, { credentials: "include" });
    if (!res.ok) throw new Error("Gagal mengambil data pertanyaan");
    const data = await res.json();

    // Filter agar hanya menampilkan pertanyaan publik (bukan internal)
    return Array.isArray(data) ? data.filter((q) => q.tipe !== "internal") : [];
  } catch (err) {
    console.error("❌ Error fetch pertanyaan:", err);
    return [];
  }
}

// =======================
// 🔹 RENDER SEMUA PERTANYAAN DI HALAMAN PUBLIK
// =======================
async function renderPertanyaanPublik() {
  const container = document.getElementById("daftar-pertanyaan");
  if (!container) return;
  container.innerHTML = "<p>⏳ Memuat pertanyaan...</p>";

  const list = await getPertanyaanPublik();
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = "<p>Belum ada pertanyaan atau pengaduan yang ditampilkan.</p>";
    return;
  }

  for (const item of list) {
    const card = document.createElement("div");
    card.classList.add("pertanyaan-card");

    // Tentukan warna status
    let statusColor = "#795548";
    if (item.status === "Belum Dijawab") statusColor = "#b71c1c";
    else if (item.status === "Sedang Diproses") statusColor = "#f57c00";
    else if (item.status === "Sudah Dijawab") statusColor = "#2e7d32";

    // 🔹 Ambil thread diskusi per pertanyaan
    let threadHTML = "";
    try {
      const resDiskusi = await fetch(`${apiBase}/${item.id}/diskusi`, { credentials: "include" });
      if (resDiskusi.ok) {
        const diskusi = await resDiskusi.json();
        if (Array.isArray(diskusi) && diskusi.length > 0) {
          threadHTML = `
            <div class="diskusi-thread">
              <h4>Diskusi Lanjutan:</h4>
              ${diskusi
                .map(
                  (d) => `
                <div class="balasan">
                  <strong>${d.pengirim || "Pengguna"}:</strong>
                  <p>${d.pesan}</p>
                </div>`
                )
                .join("")}
            </div>
          `;
        }
      }
    } catch (err) {
      console.warn("⚠️ Tidak bisa mengambil diskusi untuk ID:", item.id, err);
    }

    // 🔹 Susun HTML kartu pertanyaan
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

      <div class="aksi">
        <button class="btn-diskusi" onclick="bukaFormDiskusi('${item.id}')">
          💭 Tambah Diskusi
        </button>
        <button class="btn-hapus" onclick="hapusPertanyaanUser('${item.id}')">
          🗑️ Hapus
        </button>
      </div>

      <div class="form-diskusi" id="formDiskusi-${item.id}" style="display:none;">
        <textarea id="pesanDiskusi-${item.id}" placeholder="Ketik tanggapan atau pertanyaan lanjutan..."></textarea>
        <button class="btn-kirim" onclick="kirimDiskusi('${item.id}')">Kirim</button>
      </div>
    `;

    container.appendChild(card);
  }
}

// =======================
// 🔹 KIRIM PERTANYAAN BARU
// =======================
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

// =======================
// 🔹 DISKUSI LANJUTAN
// =======================
function bukaFormDiskusi(id) {
  const form = document.getElementById(`formDiskusi-${id}`);
  if (form) {
    form.style.display = form.style.display === "none" ? "block" : "none";
  }
}

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

// =======================
// 🔹 HAPUS PERTANYAAN (oleh user jika diizinkan)
// =======================
async function hapusPertanyaanUser(id) {
  Swal.fire({
    title: "Yakin ingin menghapus?",
    text: "Pertanyaan ini akan dihapus dari sistem.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#8D6E63",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, hapus",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${apiBase}/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Gagal menghapus pertanyaan");

        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Pertanyaan berhasil dihapus.",
          confirmButtonColor: "#6D4C41",
        });

        renderPertanyaanPublik();
      } catch (err) {
        console.error("❌ Error hapus:", err);
        Swal.fire("Error", "Tidak dapat menghapus pertanyaan!", "error");
      }
    }
  });
}

// =======================
// 🔹 INIT PAGE
// =======================
document.addEventListener("DOMContentLoaded", renderPertanyaanPublik);
