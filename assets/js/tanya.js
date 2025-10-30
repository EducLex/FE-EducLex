const apiBase = "http://localhost:8080/questions";

// 🔹 Ambil semua pertanyaan yang sudah dijawab oleh jaksa
async function getPertanyaanPublik() {
  try {
    const res = await fetch(apiBase, { credentials: "include" });
    if (!res.ok) throw new Error("Gagal mengambil data pertanyaan");
    const data = await res.json();
    // hanya tampilkan pertanyaan yang sudah dijawab
    return data.filter((q) => q.jawaban && q.jawaban.trim() !== "");
  } catch (err) {
    console.error("❌ Error fetch pertanyaan:", err);
    return [];
  }
}

// 🔹 Render pertanyaan yang sudah dijawab di halaman publik
async function renderPertanyaanPublik() {
  const container = document.getElementById("list-tanya");
  container.innerHTML = "<p>⏳ Memuat pertanyaan...</p>";

  const list = await getPertanyaanPublik();
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = "<p>Belum ada pertanyaan yang dijawab.</p>";
    return;
  }

  list.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card", "mb-3", "p-3", "shadow-sm", "rounded-lg");
    card.innerHTML = `
      <p><strong>${item.nama || "Anonim"}:</strong> ${item.pertanyaan}</p>
      <p class="text-brown-600"><em>Jawaban Jaksa:</em> ${item.jawaban}</p>
    `;
    container.appendChild(card);
  });
}

// 🔹 Kirim pertanyaan baru (user)
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
      credentials: "include",
    });

    if (!res.ok) throw new Error("Gagal mengirim pertanyaan");

    Swal.fire({
      icon: "success",
      title: "Pertanyaan Terkirim!",
      text: "Pertanyaanmu sudah dikirim. Tunggu jawaban dari Jaksa EducLex 😊",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });

    document.getElementById("tanyaForm").reset();
    renderPertanyaanPublik();
  } catch (err) {
    console.error("❌ Error kirim:", err);
    Swal.fire("Error", "Tidak bisa mengirim pertanyaan ke server!", "error");
  }

  return false;
}

document.addEventListener("DOMContentLoaded", renderPertanyaanPublik);
