document.addEventListener("DOMContentLoaded", async () => {
  const apiBase = "http://localhost:8080"; // Ganti sesuai backend kamu
  const token = localStorage.getItem("token");

  // ===== CEK LOGIN =====
  const jaksaNameEl = document.getElementById("jaksaName");
  if (!token) {
    jaksaNameEl.textContent = "Guest (Mode Tamu)";
  } else {
    jaksaNameEl.textContent = "Jaksa";
  }

  // ===== LOGOUT =====
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      Swal.fire({
        title: "Yakin ingin logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Logout",
        cancelButtonText: "Batal",
      }).then((res) => {
        if (res.isConfirmed) {
          localStorage.clear();
          Swal.fire("Logout Berhasil!", "Anda telah keluar dari sistem.", "success").then(() => {
            window.location.href = "login.html";
          });
        }
      });
    });
  }

  // ===== MUAT DATA DASHBOARD =====
  async function loadDashboardJaksa() {
    try {
      const [tanyaRes, tulisanRes] = await Promise.all([
        fetch(`${apiBase}/questions`),
        fetch(`${apiBase}/tulisan`),
      ]);

      const pertanyaan = await tanyaRes.json();
      const tulisan = await tulisanRes.json();

      // Hitung statistik
      const belumDijawab = pertanyaan.filter((p) => !p.jawaban || p.jawaban.trim() === "");
      const terjawab = pertanyaan.filter((p) => p.jawaban && p.jawaban.trim() !== "");

      // Tampilkan ke dashboard jika elemen ada
      const belumDijawabEl = document.getElementById("totalBelumDijawab");
      const terjawabEl = document.getElementById("totalTerjawab");
      const totalTulisanEl = document.getElementById("totalTulisanJaksa");

      if (belumDijawabEl) belumDijawabEl.textContent = belumDijawab.length;
      if (terjawabEl) terjawabEl.textContent = terjawab.length;
      if (totalTulisanEl) totalTulisanEl.textContent = tulisan.length;

      // Tabel pertanyaan dan tulisan
      renderTanyaTable(pertanyaan);
      renderTulisanTable(tulisan);
    } catch (err) {
      console.error("❌ Gagal memuat data dashboard:", err);
      Swal.fire("Error", "Tidak dapat memuat data dari server.", "error");
    }
  }

  // ===== RENDER TABEL TANYA JAKSA =====
  function renderTanyaTable(data) {
    const tbody = document.getElementById("tanyaTableBody");
    if (!tbody) return;

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Belum ada pertanyaan atau pengaduan</td></tr>`;
      return;
    }

    tbody.innerHTML = data
      .map(
        (q) => `
        <tr>
          <td>${q.nama || "Anonim"}</td>
          <td>${q.kategori || "-"}</td>
          <td>${q.pertanyaan || q.pengaduan || "-"}</td>
          <td>
            ${
              q.jawaban && q.jawaban.trim() !== ""
                ? '<span class="badge success">Terjawab</span>'
                : '<span class="badge pending">Menunggu Jawaban</span>'
            }
          </td>
          <td>
            <button class="btn-view" data-isi="${q.pertanyaan}" data-jawaban="${q.jawaban || ''}">👁️ Lihat</button>
            <button class="btn-reply" data-id="${q._id}" data-pertanyaan="${q.pertanyaan}">💬 Jawab</button>
          </td>
        </tr>`
      )
      .join("");
  }

  // ===== RENDER TABEL TULISAN JAKSA =====
  function renderTulisanTable(data) {
    const tbody = document.getElementById("tulisanTableBody");
    if (!tbody) return;

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Belum ada tulisan</td></tr>`;
      return;
    }

    tbody.innerHTML = data
      .map(
        (t) => `
        <tr>
          <td>${t.judul}</td>
          <td>${new Date(t.createdAt).toLocaleDateString("id-ID")}</td>
          <td><span class="badge published">Dipublikasikan</span></td>
          <td>
            <button class="btn-edit" data-id="${t._id}">✏️ Edit</button>
            <button class="btn-delete" data-id="${t._id}">🗑️ Hapus</button>
          </td>
        </tr>`
      )
      .join("");
  }

  // ===== EVENT: JAKSA MENJAWAB =====
  document.addEventListener("click", async (e) => {
    // Klik tombol "Jawab"
    if (e.target.classList.contains("btn-reply")) {
      const id = e.target.dataset.id;
      const pertanyaan = e.target.dataset.pertanyaan;

      const { value: jawaban } = await Swal.fire({
        title: "Jawab Pertanyaan Masyarakat",
        html: `<p><strong>${pertanyaan}</strong></p>`,
        input: "textarea",
        inputPlaceholder: "Tulis jawaban Anda di sini...",
        showCancelButton: true,
        confirmButtonText: "Kirim Jawaban",
      });

      if (jawaban) {
        try {
          const res = await fetch(`${apiBase}/questions/${id}/jawab`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token || ""}`,
            },
            body: JSON.stringify({ jawaban }),
          });

          if (res.ok) {
            Swal.fire("Berhasil!", "Jawaban telah dikirim.", "success");
            loadDashboardJaksa();
          } else {
            Swal.fire("Gagal", "Tidak dapat mengirim jawaban.", "error");
          }
        } catch (err) {
          Swal.fire("Error", "Gagal terhubung ke server.", "error");
        }
      }
    }

    // Klik tombol "Lihat"
    if (e.target.classList.contains("btn-view")) {
      const isi = e.target.dataset.isi;
      const jawaban = e.target.dataset.jawaban;

      Swal.fire({
        title: "Detail Pertanyaan",
        html: `
          <p><strong>Pertanyaan / Pengaduan:</strong><br>${isi}</p>
          <hr>
          <p><strong>Jawaban Jaksa:</strong><br>${jawaban || "<em>Belum dijawab</em>"}</p>
        `,
        confirmButtonText: "Tutup",
        width: 700,
      });
    }

    // Klik tombol edit tulisan
    if (e.target.classList.contains("btn-edit")) {
      const id = e.target.dataset.id;
      Swal.fire("Edit Tulisan", `Fitur edit untuk tulisan ID ${id} masih dalam pengembangan.`, "info");
    }

    // Klik tombol hapus tulisan
    if (e.target.classList.contains("btn-delete")) {
      const id = e.target.dataset.id;
      Swal.fire({
        title: "Yakin ingin menghapus tulisan ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      }).then(async (res) => {
        if (res.isConfirmed) {
          try {
            const delRes = await fetch(`${apiBase}/tulisan/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token || ""}`,
              },
            });
            if (delRes.ok) {
              Swal.fire("Terhapus!", "Tulisan berhasil dihapus.", "success");
              loadDashboardJaksa();
            } else {
              Swal.fire("Gagal", "Tidak dapat menghapus tulisan.", "error");
            }
          } catch (err) {
            Swal.fire("Error", "Gagal terhubung ke server.", "error");
          }
        }
      });
    }
  });

  // ===== PANGGIL DATA SAAT AWAL =====
  await loadDashboardJaksa();
});
