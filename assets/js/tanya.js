const apiBase = "http://localhost:8080/questions";

// =======================
// 🔹 Ambil Semua Pertanyaan Publik
// =======================
async function getPertanyaanPublik() {
  try {
    const res = await fetch(apiBase, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
      // ❌ credentials: "include" dihapus
    });

    if (!res.ok) throw new Error("Gagal mengambil data pertanyaan");

    const data = await res.json();

    // Filter hanya publik
    return Array.isArray(data)
      ? data.filter((q) => q.tipe === "publik" || !q.tipe)
      : [];
  } catch (err) {
    console.error("❌ Error fetch pertanyaan:", err);
    return [];
  }
}

// =======================
// 🔹 Render Pertanyaan Publik (DIPERBARUI — LEBIH RAPI & CANTIK)
// =======================
async function renderPertanyaanPublik() {
  const container = document.getElementById("daftar-pertanyaan");
  if (!container) return;

  container.innerHTML = `
    <div style="text-align: center; padding: 2rem; background: #fff8f4; border-radius: 12px; margin: 1rem auto; max-width: 600px;">
      <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #8d6e63; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
      <p style="margin-top: 1rem; color: #5d4037; font-family: 'Poppins', sans-serif; font-weight: 600;">Memuat daftar pertanyaan...</p>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;

  const list = await getPertanyaanPublik();
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; background: #fff; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        <p style="color: #7d5a50; font-family: 'Poppins', sans-serif; font-weight: 600;">Belum ada pertanyaan atau pengaduan.</p>
      </div>
    `;
    return;
  }

  // Buat container kartu
  const cardsContainer = document.createElement("div");
  cardsContainer.style.display = "grid";
  cardsContainer.style.gap = "1.2rem";
  cardsContainer.style.marginTop = "1.5rem";

  for (const item of list) {
    const card = document.createElement("div");
    card.style.background = "#fff";
    card.style.borderRadius = "12px";
    card.style.padding = "1.2rem";
    card.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)";
    card.style.borderLeft = "4px solid #8d6e63";
    card.style.transition = "transform 0.2s, box-shadow 0.2s";
    card.style.fontFamily = "'Open Sans', sans-serif";

    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-2px)";
      card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "none";
      card.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)";
    });

    // Status badge
    let statusText = item.status || "Belum Dijawab";
    let statusColor = "#e57373"; // merah
    let statusBg = "#ffebee";
    if (statusText === "Sudah Dijawab") {
      statusColor = "#66bb6a"; // hijau
      statusBg = "#e8f5e9";
    }

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 0.5rem;">
        <span style="font-weight: 700; color: #3e2723; font-family: 'Poppins', sans-serif; font-size: 1.05rem;">
          ${item.nama || "Anonim"}
        </span>
        <span style="background: ${statusBg}; color: ${statusColor}; padding: 0.25rem 0.6rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; font-family: 'Poppins', sans-serif;">
          ${statusText}
        </span>
      </div>

      <p style="margin: 0.8rem 0; line-height: 1.6; color: #5d4037;">
        ${item.pertanyaan || "–"}
      </p>

      ${
        item.jawaban
          ? `<div style="background: #f8f4f2; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
              <strong style="color: #4e342e; font-family: 'Poppins', sans-serif; font-weight: 700;">💬 Jawaban Jaksa:</strong>
              <p style="margin-top: 0.5rem; line-height: 1.6; color: #5d4037;">${item.jawaban}</p>
            </div>`
          : `<p style="color: #b71c1c; font-style: italic; margin-top: 0.5rem;">⏳ Menunggu jawaban dari Jaksa...</p>`
      }

      <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
        <span style="font-size: 0.85rem; color: #757575;">
          Kategori: <strong>${item.kategori || "Umum"}</strong>
        </span>
        <span style="font-size: 0.85rem; color: #757575;">
          ${new Date(item.tanggal).toLocaleDateString("id-ID")}
        </span>
      </div>
    `;

    cardsContainer.appendChild(card);
  }

  container.appendChild(cardsContainer);
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
    tanggal: new Date().toISOString(),
  };

  try {
    const res = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData)
      // ❌ credentials dihapus
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
    renderPertanyaanPublik();
  } catch (err) {
    console.error("❌ Error kirim:", err);
    Swal.fire("Error", "Tidak bisa mengirim ke server!", "error");
  }
}

// =======================
// 🔹 Event Listener Form
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tanyaForm");
  if (form) {
    form.addEventListener("submit", kirimPertanyaan);
  }

  // Render daftar pertanyaan
  renderPertanyaanPublik();
});