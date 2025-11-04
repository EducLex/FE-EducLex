const apiBase = "http://localhost:8080/questions";

// =======================
// 🔹 FETCH & RENDER DATA
// =======================
async function getSemuaPertanyaan() {
  try {
    const res = await fetch(apiBase, { credentials: "include" });
    if (!res.ok) throw new Error("Gagal mengambil data dari server");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ Error fetch pertanyaan:", err);
    return [];
  }
}

async function renderPertanyaanAdmin() {
  const tbody = document.getElementById("tabelPertanyaanBody");
  if (!tbody) return;
  tbody.innerHTML = "<tr><td colspan='5'>⏳ Memuat data...</td></tr>";

  const data = await getSemuaPertanyaan();
  const pertanyaanList = data.filter((q) => q.kategori !== "Pengaduan");

  if (!pertanyaanList.length) {
    tbody.innerHTML = "<tr><td colspan='5'>Belum ada pertanyaan masuk.</td></tr>";
    return;
  }

  tbody.innerHTML = "";
  pertanyaanList.forEach((q) => {
    const statusLabel = q.jawaban
      ? `<span style='color:#2e7d32;font-weight:600;'>Sudah Dijawab</span>`
      : `<span style='color:#b71c1c;font-weight:600;'>Belum Dijawab</span>`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${q.nama || "Anonim"}</td>
      <td>${q.pertanyaan}</td>
      <td>${statusLabel}</td>
      <td>${new Date(q.tanggal || Date.now()).toLocaleDateString("id-ID")}</td>
      <td>
        <button class="btn-edit" onclick="bukaModal('${q.nama}','${q.pertanyaan}','pertanyaan','${q.id}')">
          <i class="fas fa-reply"></i> Jawab
        </button>
        <button class="btn-delete" onclick="hapusPertanyaanServer('${q.id}')">
          <i class="fas fa-trash-alt"></i> Hapus
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function renderPengaduanAdmin() {
  const tbody = document.querySelector("#tab-pengaduan tbody");
  if (!tbody) return;
  tbody.innerHTML = "<tr><td colspan='6'>⏳ Memuat data...</td></tr>";

  const data = await getSemuaPertanyaan();
  const pengaduanList = data.filter((q) => q.kategori === "Pengaduan");

  if (!pengaduanList.length) {
    tbody.innerHTML = "<tr><td colspan='6'>Belum ada pengaduan masuk.</td></tr>";
    return;
  }

  tbody.innerHTML = "";
  pengaduanList.forEach((q) => {
    const statusLabel = q.jawaban
      ? `<span style='color:#2e7d32;font-weight:600;'>Sudah Ditangani</span>`
      : `<span style='color:#b71c1c;font-weight:600;'>Belum Ditangani</span>`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${q.nama || "Anonim"}</td>
      <td>${q.subkategori || "Umum"}</td>
      <td>${q.pertanyaan}</td>
      <td>${statusLabel}</td>
      <td>${new Date(q.tanggal || Date.now()).toLocaleDateString("id-ID")}</td>
      <td>
        <button class="btn-edit" onclick="bukaModal('${q.nama}','${q.pertanyaan}','pengaduan','${q.id}')">
          <i class="fas fa-reply"></i> Tanggapi
        </button>
        <button class="btn-info" onclick="bukaDiskusi('${q.id}','${q.nama}')">
          <i class="fas fa-comments"></i> Diskusi
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// =======================
// 🔹 MODAL JAWABAN
// =======================
let currentQuestionId = null;

function bukaModal(nama, pertanyaan, jenis, id = null) {
  currentQuestionId = id;
  document.getElementById("namaUser").textContent = nama;
  document.getElementById("pertanyaanUser").textContent = pertanyaan;
  document.getElementById("jenisForm").textContent =
    jenis === "pengaduan" ? "Pengaduan Masyarakat" : "Pertanyaan Umum";
  document.getElementById("modalJawaban").style.display = "flex";
}

function tutupModal() {
  document.getElementById("modalJawaban").style.display = "none";
}

// 🔹 Kirim jawaban ke server (tidak hapus logika lama)
async function kirimJawaban() {
  const jawaban = document.getElementById("jawabanJaksa").value.trim();
  if (!jawaban) {
    Swal.fire({ icon: "warning", title: "Jawaban Kosong!", text: "Silakan isi jawaban terlebih dahulu." });
    return;
  }

  // ✅ versi lama tetap ada untuk notifikasi
  Swal.fire({ icon: "success", title: "Terkirim!", text: "Respon telah dikirim ke masyarakat." });
  document.getElementById("jawabanJaksa").value = "";
  tutupModal();

  // ✅ versi baru untuk simpan ke backend
  if (currentQuestionId) {
    try {
      const res = await fetch(`${apiBase}/${currentQuestionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jawaban }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal menyimpan jawaban");
      renderPertanyaanAdmin();
      renderPengaduanAdmin();
    } catch (err) {
      console.error("❌ Error kirim jawaban:", err);
      Swal.fire("Error", "Tidak bisa mengirim jawaban ke server!", "error");
    }
  }
}

// =======================
// 🔹 DISKUSI LANJUTAN
// =======================
function bukaDiskusi(id, nama) {
  document.getElementById("modalDiskusi").style.display = "flex";
  document.getElementById("chatBox").innerHTML = `<p><b>${nama}:</b> Mohon tindak lanjut kasus saya.</p>`;
  document.getElementById("chatInput").dataset.id = id;
}

function tutupDiskusi() {
  document.getElementById("modalDiskusi").style.display = "none";
}

function kirimPesan() {
  const input = document.getElementById("chatInput");
  const chat = document.getElementById("chatBox");
  if (input.value.trim()) {
    chat.innerHTML += `<p><b>Jaksa:</b> ${input.value}</p>`;
    input.value = "";
    chat.scrollTop = chat.scrollHeight;
  }
}

// =======================
// 🔹 HAPUS DATA
// =======================
function hapusPertanyaan(btn) {
  Swal.fire({
    title: "Yakin ingin menghapus?",
    text: "Pertanyaan ini akan dihapus secara permanen.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#8D6E63",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, hapus",
  }).then((result) => {
    if (result.isConfirmed) {
      const row = btn.closest("tr");
      row.remove();
      Swal.fire({ icon: "success", title: "Terhapus!", text: "Data berhasil dihapus." });
    }
  });
}

// 🔹 Versi baru: hapus dari server juga
async function hapusPertanyaanServer(id) {
  Swal.fire({
    title: "Yakin ingin menghapus?",
    text: "Data ini akan dihapus dari server.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#8D6E63",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, hapus",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${apiBase}/${id}`, { method: "DELETE", credentials: "include" });
        if (!res.ok) throw new Error("Gagal menghapus pertanyaan dari server");
        Swal.fire({ icon: "success", title: "Terhapus!", text: "Data berhasil dihapus dari server." });
        renderPertanyaanAdmin();
        renderPengaduanAdmin();
      } catch (err) {
        console.error("❌ Error hapus:", err);
        Swal.fire("Error", "Gagal menghapus data dari server!", "error");
      }
    }
  });
}

// =======================
// 🔹 INIT PAGE
// =======================
document.addEventListener("DOMContentLoaded", () => {
  renderPertanyaanAdmin();
  renderPengaduanAdmin();
});
