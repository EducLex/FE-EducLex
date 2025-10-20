document.addEventListener("DOMContentLoaded", async () => {
  const apiBase = "http://localhost:8080";
  const dashboardEndpoint = `${apiBase}/dashboard`;
  const token = localStorage.getItem("token");

  // ===== CEK LOGIN (DIPERBARUI) =====
  if (!token) {
    console.warn("⚠️ Tidak ada token. Menjalankan dashboard dalam mode tamu.");
    const adminNameEl = document.getElementById("adminName");
    if (adminNameEl) adminNameEl.textContent = "Guest (Mode Tamu)";
  } else {
    const adminNameEl = document.getElementById("adminName");
    if (adminNameEl) adminNameEl.textContent = "Admin";
  }

  // ===== LOGOUT =====
  document.getElementById("logoutBtn").addEventListener("click", () => {
    if (!token) {
      Swal.fire("Info", "Anda belum login, tidak ada sesi yang perlu diakhiri.", "info");
      return;
    }

    Swal.fire({
      title: "Apakah Anda yakin ingin logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire("Logout Berhasil!", "Anda telah keluar dari sistem.", "success").then(() => {
          window.location.href = "login.html";
        });
      }
    });
  });

  // ===== SIDEBAR NAVIGATION =====
  const navLinks = {
    dashboardLink: "dbadmin.html",
    artikelLink: "artikel.html",
    tanyaLink: "tanya.html",
    tulisanLink: "tulisan.html",
    peraturanLink: "peraturan.html",
    penggunaLink: "pengguna.html",
  };

  Object.entries(navLinks).forEach(([id, url]) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = url;
      });
    }
  });

  // ===== MUAT DATA DASHBOARD UTAMA (/dashboard) =====
  async function loadDashboardData() {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      console.log("🔄 Fetch data dari endpoint utama:", dashboardEndpoint);
      const response = await fetch(dashboardEndpoint, { headers });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Data dashboard dari /dashboard:", data);

        if (data) {
          document.getElementById("totalArtikel").textContent = data.totalArtikel || 0;
          document.getElementById("totalTanya").textContent = data.totalTanya || 0;
          document.getElementById("totalTulisan").textContent = data.totalTulisan || 0;
          document.getElementById("totalPeraturan").textContent = data.totalPeraturan || 0;
          return;
        }
      }

      console.warn("⚠️ Gagal memuat /dashboard, mencoba fallback manual...");
      await loadDashboardDataFallback();
    } catch (error) {
      console.error("❌ Error memuat /dashboard:", error);
      Swal.fire("Error", "Tidak dapat memuat data dashboard dari server.", "error");
      await loadDashboardDataFallback();
    }
  }

  // ===== FALLBACK JIKA /dashboard ERROR =====
  async function loadDashboardDataFallback() {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const [artikelRes, tanyaRes, tulisanRes, peraturanRes] = await Promise.all([
        fetch(`${apiBase}/articles`, { headers }),
        fetch(`${apiBase}/questions`, { headers }),
        fetch(`${apiBase}/tulisan`, { headers }),
        fetch(`${apiBase}/peraturan`, { headers }),
      ]);

      const artikelData = await artikelRes.json();
      const tanyaData = await tanyaRes.json();
      const tulisanData = await tulisanRes.json();
      const peraturanData = await peraturanRes.json();

      document.getElementById("totalArtikel").textContent = artikelData.length || 0;
      document.getElementById("totalTanya").textContent = tanyaData.length || 0;
      document.getElementById("totalTulisan").textContent = tulisanData.length || 0;
      document.getElementById("totalPeraturan").textContent = peraturanData.length || 0;

      console.log("✅ Fallback berhasil, data dimuat manual.");
    } catch (error) {
      console.error("❌ Fallback gagal:", error);
    }
  }

  // ===== MUAT DATA PENGGUNA =====
  async function loadUsers() {
    const tbody = document.getElementById("userTableBody");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(`${apiBase}/users`, { headers });
      if (!res.ok) {
        tbody.innerHTML = `<tr><td colspan="4">Tidak dapat memuat data pengguna (login mungkin diperlukan).</td></tr>`;
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">Tidak ada data pengguna.</td></tr>`;
        return;
      }

      tbody.innerHTML = data
        .map(
          (user) => `
          <tr>
            <td>${user.username || "-"}</td>
            <td>${user.email || "-"}</td>
            <td>${user.role || "User"}</td>
            <td>
              <button class="btn-edit" data-id="${user._id}" data-role="${user.role}">Edit</button>
              <button class="btn-delete" data-id="${user._id}">Hapus</button>
            </td>
          </tr>`
        )
        .join("");
    } catch (error) {
      console.error("❌ Gagal memuat data pengguna:", error);
      tbody.innerHTML = `<tr><td colspan="4">Gagal memuat data pengguna.</td></tr>`;
    }
  }

  // ===== EVENT EDIT & HAPUS PENGGUNA =====
  document.addEventListener("click", async (e) => {
    const target = e.target;

    // === Hapus pengguna ===
    if (target.classList.contains("btn-delete")) {
      const id = target.dataset.id;

      if (!token) {
        Swal.fire("Akses Ditolak", "Silakan login untuk menghapus pengguna.", "warning");
        return;
      }

      Swal.fire({
        title: "Hapus Pengguna?",
        text: "Data pengguna ini akan dihapus secara permanen.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      }).then(async (res) => {
        if (res.isConfirmed) {
          try {
            const del = await fetch(`${apiBase}/users/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (del.ok) {
              Swal.fire("Berhasil!", "Pengguna telah dihapus.", "success");
              loadUsers();
            } else {
              Swal.fire("Gagal", "Tidak dapat menghapus pengguna.", "error");
            }
          } catch (err) {
            Swal.fire("Error", "Terjadi kesalahan koneksi.", "error");
          }
        }
      });
    }

    // === Edit role pengguna ===
    if (target.classList.contains("btn-edit")) {
      const id = target.dataset.id;
      const currentRole = target.dataset.role;

      if (!token) {
        Swal.fire("Akses Ditolak", "Silakan login untuk mengedit pengguna.", "warning");
        return;
      }

      Swal.fire({
        title: "Edit Role Pengguna",
        html: `
          <label for="newRole">Pilih Role Baru:</label>
          <select id="newRole" class="swal2-select">
            <option value="user" ${currentRole === "user" ? "selected" : ""}>User</option>
            <option value="admin" ${currentRole === "admin" ? "selected" : ""}>Admin</option>
          </select>
        `,
        showCancelButton: true,
        confirmButtonText: "Update",
        cancelButtonText: "Batal",
      }).then(async (res) => {
        if (res.isConfirmed) {
          const newRole = document.getElementById("newRole").value;
          try {
            const update = await fetch(`${apiBase}/users/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ role: newRole }),
            });

            if (update.ok) {
              Swal.fire("Berhasil!", "Role pengguna telah diperbarui.", "success");
              loadUsers();
            } else {
              Swal.fire("Gagal", "Tidak dapat memperbarui data pengguna.", "error");
            }
          } catch (err) {
            Swal.fire("Error", "Koneksi ke server gagal.", "error");
          }
        }
      });
    }
  });

  // ==== Jalankan saat halaman dimuat ====
  await loadDashboardData();
  await loadUsers();
});
