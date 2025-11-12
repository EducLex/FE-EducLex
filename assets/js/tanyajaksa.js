const apiBase = "http://localhost:8080/questions";

// =======================
// 🔹 DATA DUMMY (Fallback jika server mati)
// =======================
const dummyData = [
  {
    id: "1",
    nama: "Andi Prasetyo",
    pertanyaan: "Apa sanksi jika menyebarkan berita hoaks di media sosial?",
    jawaban: "Penyebaran hoaks dapat dijerat dengan UU ITE Pasal 28 ayat (1).",
    kategori: "Pertanyaan",
    tanggal: "2025-10-15T08:00:00Z",
  },
  {
    id: "2",
    nama: "Sinta Rahma",
    pertanyaan: "Laporan penggelapan dana oleh rekan kerja, bagaimana prosedurnya?",
    jawaban: "",
    kategori: "Pengaduan",
    tanggal: "2025-10-16T09:00:00Z",
  },
  {
    id: "3",
    nama: "Anonim",
    pertanyaan: "Apakah pelanggaran lalu lintas bisa dikategorikan pidana?",
    jawaban: "Beberapa pelanggaran lalu lintas bisa termasuk pidana, tergantung jenis pelanggaran.",
    kategori: "Pertanyaan",
    tanggal: "2025-10-17T07:00:00Z",
  }
];

// =======================
// 🔹 FETCH & RENDER DATA
// =======================
async function getSemuaPertanyaan() {
  try {
    const res = await fetch(apiBase, { credentials: "include" });
    if (!res.ok) throw new Error("Server offline");
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("⚠️ Gagal fetch dari server, menggunakan dummy data...");
    return dummyData;
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
      ? `<span class='status status-selesai'>Sudah Dijawab</span>`
      : `<span class='status status-belum'>Belum Dijawab</span>`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${q.nama || "Anonim"}</td>
      <td>${q.pertanyaan}</td>
      <td>${statusLabel}</td>
      <td>${new Date(q.tanggal || Date.now()).toLocaleDateString("id-ID")}</td>
      <td class="aksi">
        <button class="btn-edit" onclick="bukaModal('${q.nama}','${q.pertanyaan}','pertanyaan','${q.id}')">
          <i class="fas fa-reply"></i>
        </button>
        <button class="btn-info" onclick="bukaDiskusi('${q.id}','${q.nama}')">
          <i class="fas fa-comments"></i>
        </button>
        <button class="btn-delete" onclick="hapusPertanyaanServer('${q.id}')">
          <i class="fas fa-trash-alt"></i>
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
      ? `<span class='status status-selesai'>Sudah Ditangani</span>`
      : `<span class='status status-belum'>Belum Ditangani</span>`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${q.nama || "Anonim"}</td>
      <td>${q.subkategori || "Umum"}</td>
      <td>${q.pertanyaan}</td>
      <td>${statusLabel}</td>
      <td>${new Date(q.tanggal || Date.now()).toLocaleDateString("id-ID")}</td>
      <td class="aksi">
        <button class="btn-edit" onclick="bukaModal('${q.nama}','${q.pertanyaan}','pengaduan','${q.id}')">
          <i class="fas fa-reply"></i>
        </button>
        <button class="btn-info" onclick="bukaDiskusi('${q.id}','${q.nama}')">
          <i class="fas fa-comments"></i>
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

async function kirimJawaban() {
  const jawaban = document.getElementById("jawabanJaksa").value.trim();
  if (!jawaban) {
    Swal.fire({ icon: "warning", title: "Jawaban Kosong!", text: "Silakan isi jawaban terlebih dahulu." });
    return;
  }

  Swal.fire({ icon: "success", title: "Terkirim!", text: "Respon telah dikirim ke masyarakat." });
  document.getElementById("jawabanJaksa").value = "";
  tutupModal();

  if (currentQuestionId) {
    try {
      await fetch(`${apiBase}/${currentQuestionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jawaban }),
        credentials: "include",
      });
      renderPertanyaanAdmin();
      renderPengaduanAdmin();
    } catch (err) {
      console.error("❌ Error kirim jawaban:", err);
    }
  }
}

// =======================
// 🔹 DISKUSI LANJUTAN
// =======================
async function bukaDiskusi(id, nama) {
  document.getElementById("modalDiskusi").style.display = "flex";
  document.getElementById("chatBox").innerHTML = `<p>⏳ Memuat diskusi...</p>`;
  document.getElementById("chatInput").dataset.id = id;

  try {
    const res = await fetch(`${apiBase}/${id}/diskusi`, { credentials: "include" });
    if (!res.ok) throw new Error("Gagal mengambil diskusi");
    const messages = await res.json();

    if (!messages.length) {
      document.getElementById("chatBox").innerHTML = `<p><b>${nama}:</b> Mohon tindak lanjut kasus saya.</p>`;
      return;
    }

    document.getElementById("chatBox").innerHTML = messages
      .map(
        (msg) =>
          `<p><b>${msg.pengirim === "jaksa" ? "Jaksa" : msg.nama || "Pengguna"}:</b> ${msg.pesan}</p>`
      )
      .join("");
  } catch (err) {
    console.error("❌ Error ambil diskusi:", err);
    document.getElementById("chatBox").innerHTML = `<p>❌ Gagal memuat diskusi.</p>`;
  }
}

function tutupDiskusi() {
  document.getElementById("modalDiskusi").style.display = "none";
}

async function kirimPesan() {
  const input = document.getElementById("chatInput");
  const id = input.dataset.id;
  const pesan = input.value.trim();

  if (!pesan) return;

  try {
    await fetch(`${apiBase}/${id}/diskusi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pengirim: "jaksa", pesan }),
      credentials: "include",
    });

    const chat = document.getElementById("chatBox");
    chat.innerHTML += `<p><b>Jaksa:</b> ${pesan}</p>`;
    input.value = "";
    chat.scrollTop = chat.scrollHeight;
  } catch (err) {
    console.error("❌ Error kirim pesan:", err);
    Swal.fire("Error", "Pesan gagal dikirim ke server.", "error");
  }
}

// =======================
// 🔹 HAPUS DATA
// =======================
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
        await fetch(`${apiBase}/${id}`, { method: "DELETE", credentials: "include" });
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
