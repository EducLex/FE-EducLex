const apiBase = "http://localhost:8080/questions";

// =======================
// 🔹 Ambil Semua Pertanyaan
// =======================
async function ambilSemuaPertanyaan() {
  try {
    const res = await fetch(apiBase, { credentials: "include" });
    if (!res.ok) throw new Error("Gagal mengambil data pertanyaan");
    return await res.json();
  } catch (err) {
    console.error("❌ Error:", err);
    return [];
  }
}

// =======================
// 🔹 Render di Dashboard Jaksa
// =======================
async function renderPertanyaanJaksa() {
  const tableBody = document.getElementById("tabel-pertanyaan");
  if (!tableBody) return;
  tableBody.innerHTML = "<tr><td colspan='6'>⏳ Memuat data...</td></tr>";

  const data = await ambilSemuaPertanyaan();
  tableBody.innerHTML = "";

  if (!data.length) {
    tableBody.innerHTML = "<tr><td colspan='6'>Belum ada pertanyaan.</td></tr>";
    return;
  }

  data
    .filter((item) => item.tipe === "publik" || !item.tipe)
    .forEach((item) => {
      const row = document.createElement("tr");

      const tanggal = item.tanggal
        ? new Date(item.tanggal).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "-";

      row.innerHTML = `
        <td>${item.nama || "Anonim"}</td>
        <td>${item.pertanyaan}</td>
        <td><strong style="color:${item.status === "Belum Dijawab" ? "red" : "green"};">${item.status}</strong></td>
        <td>${tanggal}</td>
        <td>
          <button class="btn-edit" onclick="jawabPertanyaan('${item.id}')">Jawab</button>
          <button class="btn-delete" onclick="hapusPertanyaan('${item.id}')">Hapus</button>
        </td>
      `;

      tableBody.appendChild(row);
    });
}

// =======================
// 🔹 Jawab Pertanyaan
// =======================
async function jawabPertanyaan(id) {
  const { value: text } = await Swal.fire({
    title: "Tulis Jawaban",
    input: "textarea",
    inputLabel: "Jawaban Jaksa",
    inputPlaceholder: "Ketik jawaban di sini...",
    inputAttributes: { "aria-label": "Tulis jawaban di sini" },
    showCancelButton: true,
    confirmButtonText: "Kirim Jawaban",
    confirmButtonColor: "#6D4C41",
  });

  if (!text) return;

  try {
    const res = await fetch(`${apiBase}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jawaban: text,
        status: "Sudah Dijawab",
      }),
      credentials: "include",
    });

    if (!res.ok) throw new Error("Gagal mengirim jawaban");

    Swal.fire({
      icon: "success",
      title: "Terkirim!",
      text: "Jawaban berhasil dikirim.",
      confirmButtonColor: "#6D4C41",
    });

    renderPertanyaanJaksa();
  } catch (err) {
    console.error("❌ Error:", err);
    Swal.fire("Error", "Tidak bisa mengirim jawaban!", "error");
  }
}

// =======================
// 🔹 Hapus Pertanyaan
// =======================
async function hapusPertanyaan(id) {
  Swal.fire({
    title: "Yakin ingin menghapus?",
    text: "Pertanyaan ini akan dihapus permanen.",
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

        renderPertanyaanJaksa();
      } catch (err) {
        console.error("❌ Error hapus:", err);
        Swal.fire("Error", "Tidak dapat menghapus pertanyaan!", "error");
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", renderPertanyaanJaksa);
