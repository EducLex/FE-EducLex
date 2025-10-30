const apiBase = "http://localhost:8080/questions";

// 🔹 Ambil semua pertanyaan dari backend
async function getPertanyaan() {
  try {
    const res = await fetch(apiBase, { credentials: "include" });
    if (!res.ok) throw new Error("Gagal mengambil pertanyaan");
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetch pertanyaan:", err);
    return [];
  }
}

// 🔹 Render daftar pertanyaan
async function renderPertanyaan() {
  const container = document.getElementById("daftar-pertanyaan");
  container.innerHTML = "<p>⏳ Memuat pertanyaan...</p>";

  const list = await getPertanyaan();
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = "<p>Belum ada pertanyaan.</p>";
    return;
  }

  list.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = `
      <p><strong>${item.nama || "Anonim"}:</strong> ${item.pertanyaan}</p>
      <p><em>Jawaban: ${item.jawaban || "Sedang diproses oleh Jaksa EducLex..."}</em></p>
      <div class="actions">
        <button onclick="editPertanyaan('${item.id}')">✏️ Edit</button>
        <button onclick="hapusPertanyaan('${item.id}')">🗑️ Hapus</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// 🔹 Kirim pertanyaan baru
async function kirimPertanyaan(event) {
  event.preventDefault();

  const nama = document.getElementById("nama").value.trim() || "Anonim";
  const email = document.getElementById("email").value.trim();
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

  try {
    const res = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, email, pertanyaan }),
      credentials: "include"
    });

    if (!res.ok) throw new Error("Gagal mengirim pertanyaan");

    Swal.fire({
      icon: "success",
      title: "Pertanyaan Terkirim!",
      text: "Pertanyaanmu berhasil dikirim. Tunggu jawaban dari Jaksa EducLex 😊",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });

    document.getElementById("tanyaForm").reset();
    renderPertanyaan();
  } catch (err) {
    console.error("❌ Error kirim:", err);
    Swal.fire("Error", "Tidak bisa mengirim pertanyaan ke server!", "error");
  }

  return false;
}

// 🔹 Edit pertanyaan
async function editPertanyaan(id) {
  const list = await getPertanyaan();
  const data = list.find((q) => q.id === id);
  if (!data) return;

  Swal.fire({
    title: "Edit Pertanyaan",
    input: "text",
    inputValue: data.pertanyaan,
    showCancelButton: true,
    confirmButtonText: "Simpan",
    cancelButtonText: "Batal",
  }).then(async (result) => {
    if (result.isConfirmed && result.value.trim() !== "") {
      try {
        const res = await fetch(`${apiBase}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pertanyaan: result.value.trim() }),
          credentials: "include"
        });

        if (!res.ok) throw new Error("Gagal update pertanyaan");

        Swal.fire("Berhasil!", "Pertanyaan berhasil diperbarui.", "success");
        renderPertanyaan();
      } catch (err) {
        console.error("❌ Error edit:", err);
        Swal.fire("Error", "Tidak bisa update pertanyaan!", "error");
      }
    }
  });
}

// 🔹 Hapus pertanyaan
async function hapusPertanyaan(id) {
  Swal.fire({
    title: "Apakah kamu yakin?",
    text: "Pertanyaan ini akan dihapus permanen.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${apiBase}/${id}`, {
          method: "DELETE",
          credentials: "include"
        });

        if (!res.ok) throw new Error("Gagal hapus pertanyaan");

        Swal.fire("Dihapus!", "Pertanyaanmu sudah dihapus.", "success");
        renderPertanyaan();
      } catch (err) {
        console.error("❌ Error hapus:", err);
        Swal.fire("Error", "Tidak bisa menghapus pertanyaan!", "error");
      }
    }
  });
}

// 🔹 Render saat halaman load
document.addEventListener("DOMContentLoaded", renderPertanyaan);
