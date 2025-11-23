document.addEventListener("DOMContentLoaded", async () => {
  const apiBase = "http://localhost:8080";
  const dashboardEndpoint = `${apiBase}/dashboard`;
  const usersEndpoint = `${apiBase}/users`;
  const token = localStorage.getItem("token");

  // ===== CEK LOGIN =====
  const adminNameEl = document.getElementById("adminName");
  if (adminNameEl) {
    if (!token) {
      console.warn("⚠ Tidak ada token. Menjalankan dashboard dalam mode tamu.");
      adminNameEl.textContent = "Guest (Mode Tamu)";
    } else {
      adminNameEl.textContent = "Admin";
    }
  }

  // ===== SIDEBAR NAVIGATION =====
  const navLinks = {
    dashboardLink: "dbadmin.html",
    artikelLink: "artikeladmin.html",
    tanyaLink: "tanyajaksa.html",
    tulisanLink: "tulisanadmin.html",
    peraturanLink: "peraturanadmin.html",
    tambahjaksaLink: "tambahjaksa.html",
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

  // ===== HELPER: Buat header dengan token =====
  function getAuthHeaders() {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // ===== MUAT DATA DASHBOARD =====
  async function loadDashboardData() {
    try {
      console.log("🔄 Fetch data dari endpoint utama:", dashboardEndpoint);
      const response = await fetch(dashboardEndpoint, { headers: getAuthHeaders() });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Data dashboard dari /dashboard:", data);

        if (data) {
          document.getElementById("totalArtikel")?.textContent = data.articles || 0;
          document.getElementById("totalTanya")?.textContent = data.questions || 0;
          document.getElementById("totalTulisan")?.textContent = data.tulisan || 0;
          document.getElementById("totalPeraturan")?.textContent = data.peraturan || 0;
        }
      } else {
        console.warn("⚠ Gagal memuat /dashboard.");
      }
    } catch (error) {
      console.error("❌ Error memuat /dashboard:", error);
      if (typeof Swal !== "undefined") {
        Swal.fire("Error", "Tidak dapat memuat data dashboard dari server.", "error");
      } else {
        alert("Gagal memuat data dashboard. Periksa konsol.");
      }
    }
  }

  // ===== MUAT DATA PENGGUNA =====
  async function loadUsers() {
    const tbody = document.getElementById("userTableBody");
    if (!tbody) return;

    try {
      const res = await fetch(usersEndpoint, { headers: getAuthHeaders() });

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
              <button class="btn-edit" data-id="${user._id}" data-role="${user.role || "user"}">Edit</button>
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
        if (typeof Swal !== "undefined") {
          Swal.fire("Akses Ditolak", "Silakan login untuk menghapus pengguna.", "warning");
        } else {
          alert("Akses ditolak. Silakan login.");
        }
        return;
      }

      if (typeof Swal === "undefined") {
        const confirmDelete = confirm("Hapus pengguna ini?");
        if (!confirmDelete) return;
      }

      const result = typeof Swal !== "undefined"
        ? await Swal.fire({
            title: "Hapus Pengguna?",
            text: "Data pengguna ini akan dihapus secara permanen.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
          })
        : { isConfirmed: true };

      if (result.isConfirmed) {
        try {
          const del = await fetch(`${apiBase}/users/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
          });

          if (del.ok) {
            if (typeof Swal !== "undefined") {
              Swal.fire("Berhasil!", "Pengguna telah dihapus.", "success");
            } else {
              alert("Pengguna berhasil dihapus.");
            }
            loadUsers();
          } else {
            const errText = await del.text();
            if (typeof Swal !== "undefined") {
              Swal.fire("Gagal", errText || "Tidak dapat menghapus pengguna.", "error");
            } else {
              alert("Gagal menghapus pengguna.");
            }
          }
        } catch (err) {
          console.error("❌ Error hapus pengguna:", err);
          if (typeof Swal !== "undefined") {
            Swal.fire("Error", "Terjadi kesalahan koneksi.", "error");
          } else {
            alert("Kesalahan koneksi saat menghapus.");
          }
        }
      }
    }

    // === Edit role pengguna ===
    if (target.classList.contains("btn-edit")) {
      const id = target.dataset.id;
      const currentRole = target.dataset.role;

      if (!token) {
        if (typeof Swal !== "undefined") {
          Swal.fire("Akses Ditolak", "Silakan login untuk mengedit pengguna.", "warning");
        } else {
          alert("Akses ditolak. Silakan login.");
        }
        return;
      }

      if (typeof Swal !== "undefined") {
        const { value: newRole } = await Swal.fire({
          title: "Edit Role Pengguna",
          input: "select",
          inputOptions: {
            user: "User",
            admin: "Admin",
          },
          inputPlaceholder: "Pilih role",
          inputValue: currentRole,
          showCancelButton: true,
          confirmButtonText: "Update",
          cancelButtonText: "Batal",
        });

        if (newRole) {
          try {
            const update = await fetch(`${apiBase}/users/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
              },
              body: JSON.stringify({ role: newRole }),
            });

            if (update.ok) {
              Swal.fire("Berhasil!", "Role pengguna telah diperbarui.", "success");
              loadUsers();
            } else {
              const errText = await update.text();
              Swal.fire("Gagal", errText || "Tidak dapat memperbarui data pengguna.", "error");
            }
          } catch (err) {
            console.error("❌ Error update role:", err);
            Swal.fire("Error", "Koneksi ke server gagal.", "error");
          }
        }
      } else {
        // Fallback tanpa SweetAlert
        const newRole = prompt("Masukkan role baru (user/admin):", currentRole);
        if (newRole && ["user", "admin"].includes(newRole)) {
          try {
            const update = await fetch(`${apiBase}/users/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
              },
              body: JSON.stringify({ role: newRole }),
            });

            if (update.ok) {
              alert("Role berhasil diperbarui!");
              loadUsers();
            } else {
              alert("Gagal memperbarui role.");
            }
          } catch (err) {
            alert("Kesalahan koneksi.");
          }
        }
      }
    }
  });

  // ==== Jalankan saat halaman dimuat ====
  await loadDashboardData();
  await loadUsers();
});