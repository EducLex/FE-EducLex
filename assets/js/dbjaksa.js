document.addEventListener("DOMContentLoaded", async () => {
  const apiBase = "http://localhost:8080"; // Ganti sesuai backend kamu
  const token = localStorage.getItem("token");

  // ===== CEK LOGIN =====
  const jaksaNameEl = document.getElementById("jaksaName");
  if (!token) {
    jaksaNameEl.textContent = "Guest (Mode Tamu)";
  } else {
    // Jika token valid, tampilkan nama jaksa (bisa ambil dari backend jika tersedia)
    try {
      const res = await fetch(`${apiBase}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        jaksaNameEl.textContent = data.nama || "Jaksa";
      } else {
        jaksaNameEl.textContent = "Jaksa";
      }
    } catch (err) {
      console.warn("⚠️ Tidak bisa memuat profil, menggunakan nama default.");
      jaksaNameEl.textContent = "Jaksa";
    }
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

    if (e.target.classList.contains("btn-edit")) {
      const id = e.target.dataset.id;
      Swal.fire("Edit Tulisan", `Fitur edit untuk tulisan ID ${id} masih dalam pengembangan.`, "info");
    }

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

// ===== LOGIKA LOGOUT =====
    document.addEventListener("DOMContentLoaded", () => {
      const logoutBtn = document.getElementById("logoutBtn");
      if (!logoutBtn) return;

      logoutBtn.addEventListener("click", async () => {
        const result = await Swal.fire({
          title: "Logout?",
          text: "Apakah Anda yakin ingin keluar dari akun jaksa?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, Logout",
          cancelButtonText: "Batal",
          reverseButtons: true
        });

        if (result.isConfirmed) {
          try {
            // Kirim request ke backend untuk logout
            const res = await fetch("http://localhost:8080/auth/logout", {
              method: "POST",
              credentials: "include"
            });

            // Hapus data lokal
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");

            // Notifikasi sukses
            await Swal.fire({
              icon: "success",
              title: "Berhasil Logout!",
              text: "Sesi jaksa telah diakhiri.",
              timer: 1500,
              showConfirmButton: false
            });

            // Redirect ke halaman login
            window.location.href = "login.html";

          } catch (error) {
            console.error("Error saat logout:", error);
            // Tetap logout lokal & redirect meski error
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");
            await Swal.fire({
              icon: "warning",
              title: "Logout Sebagian",
              text: "Koneksi gagal, tapi sesi lokal dihapus.",
              confirmButtonText: "Oke"
            });
            window.location.href = "login.html";
          }
        }
      });
    });