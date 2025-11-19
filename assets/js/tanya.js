const apiBase = "http://localhost:8080/questions";

// =======================
// 🔹 Ambil Semua Pertanyaan Publik
// =======================
async function getPertanyaanPublik() {
  try {
    const res = await fetch(apiBase, { credentials: "include" });
    if (!res.ok) throw new Error("Gagal mengambil data pertanyaan");
    const data = await res.json();

    // Filter hanya pertanyaan publik
    return Array.isArray(data)
      ? data.filter((q) => q.tipe === "publik" || !q.tipe)
      : [];
  } catch (err) {
    console.error("❌ Error fetch pertanyaan:", err);
    return [];
  }
}

// =======================
// 🔹 Render Pertanyaan Publik
// =======================
async function renderPertanyaanPublik() {
  const container = document.getElementById("daftar-pertanyaan");
  if (!container) return;
  container.innerHTML = "<p>⏳ Memuat pertanyaan...</p>";

  const list = await getPertanyaanPublik();
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = "<p>Belum ada pertanyaan atau pengaduan.</p>";
    return;
  }

  for (const item of list) {
    const card = document.createElement("div");
    card.classList.add("pertanyaan-card");

    let statusColor = "#795548";
    if (item.status === "Belum Dijawab") statusColor = "#b71c1c";
    else if (item.status === "Sudah Dijawab") statusColor = "#2e7d32";

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
          ? `<div class="jawaban-box"><strong>💬 Jawaban Jaksa:</strong><p>${item.jawaban}</p></div>`
          : `<p class="belum-jawab">Menunggu jawaban dari Jaksa...</p>`
      }
    `;

    container.appendChild(card);
  }
}

// =======================
// 🔹 Kirim Pertanyaan Baru
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
      text: "Pertanyaan tidak boleh kosong!",
      confirmButtonColor: "#6D4C41",
    });
    return;
  }

  const bodyData = {
    nama,
    email,
    kategori,
    pertanyaan,
    status: "Belum Dijawab",
    tipe: "publik",
    tanggal: new Date().toISOString(), // ✅ Tambahkan tanggal agar sinkron dengan admin
  };

  try {
    const res = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
      credentials: "include",
    });

    if (!res.ok) throw new Error("Gagal mengirim pertanyaan");

    Swal.fire({
      icon: "success",
      title: "Terkirim!",
      text: "Pertanyaanmu telah dikirim ke Jaksa EducLex.",
      showConfirmButton: false,
      timer: 2500,
    });

    document.getElementById("tanyaForm").reset();
    renderPertanyaanPublik(); // refresh otomatis
  } catch (err) {
    console.error("❌ Error kirim:", err);
    Swal.fire("Error", "Tidak bisa mengirim ke server!", "error");
  }
}

document.addEventListener("DOMContentLoaded", renderPertanyaanPublik);
