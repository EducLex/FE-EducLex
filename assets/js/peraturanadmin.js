// assets/js/peraturanadmin.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formPeraturan");
  const tableBody = document.getElementById("tabelPeraturanBody");
  const apiBase = "http://localhost:8080";

  if (!form || !tableBody) return;

  // === Fungsi untuk fetch data dan render tabel ===
  async function loadPeraturan() {
    try {
      const res = await fetch(`${apiBase}/peraturan`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      renderTable(data);
    } catch (err) {
      console.error("❌ Gagal ambil data:", err);
      tableBody.innerHTML = `
        <tr><td colspan="4" style="color:red; text-align:center;">
          Gagal memuat data. Pastikan server berjalan di <code>http://localhost:8080</code>.
        </td></tr>
      `;
    }
  }

  // === Render tabel dengan data ===
  function renderTable(data) {
    tableBody.innerHTML = "";
    if (!Array.isArray(data) || data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Belum ada data peraturan</td></tr>`;
      return;
    }

    data.forEach(item => {
      const tanggal = new Date(item.tanggal).toLocaleDateString("id-ID");
      const total = Array.isArray(item.isi) ? item.isi.length : 1;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.judulKasus || "Tanpa Judul"}</td>
        <td>${total} Peraturan</td>
        <td>${tanggal}</td>
        <td>
          <button class="btn-edit" data-id="${item._id}">Edit</button>
          <button class="btn-delete" data-id="${item._id}">Hapus</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  // === Tambah field peraturan dinamis ===
  let peraturanCount = 1;
  document.getElementById("tambahPeraturanBtn")?.addEventListener("click", () => {
    peraturanCount++;
    const div = document.createElement("div");
    div.classList.add("form-group", "peraturan-item");
    div.innerHTML = `
      <label for="peraturan${peraturanCount}">Peraturan ${peraturanCount}</label>
      <textarea id="peraturan${peraturanCount}" name="peraturan[]" rows="4" placeholder="Masukkan isi peraturan..." required></textarea>
    `;
    document.getElementById("peraturanContainer").appendChild(div);
  });

  // === Submit form ===
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const judul = document.getElementById("judulKasus")?.value.trim();
    const isiList = Array.from(document.querySelectorAll('textarea[name="peraturan[]"]'))
      .map(el => el.value.trim())
      .filter(val => val);

    if (!judul || isiList.length === 0) {
      alert("Judul dan minimal 1 peraturan wajib diisi!");
      return;
    }

    const payload = {
      judulKasus: judul,
      isi: isiList,
      tanggal: new Date().toISOString()
    };

    try {
      const res = await fetch(`${apiBase}/peraturan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      alert("✅ Data peraturan berhasil disimpan!");

      // 🔁 Auto-refresh tabel
      loadPeraturan();

      // 🔄 Trigger event agar halaman user juga refresh
      localStorage.setItem("peraturanUpdated", Date.now());

      // Reset form
      document.getElementById("judulKasus").value = "";
      document.getElementById("peraturanContainer").innerHTML = `
        <div class="form-group peraturan-item">
          <label for="peraturan1">Peraturan 1</label>
          <textarea id="peraturan1" name="peraturan[]" rows="4" placeholder="Masukkan isi peraturan 1..." required></textarea>
        </div>
      `;
      peraturanCount = 1;

    } catch (err) {
      console.error("❌ Error simpan peraturan:", err);
      alert("❌ Gagal menyimpan peraturan. Cek koneksi ke server.");
    }
  });

  // === Event delegation: Edit & Hapus ===
  document.body.addEventListener("click", async (e) => {
    const deleteBtn = e.target.closest(".btn-delete");
    const editBtn = e.target.closest(".btn-edit");

    // Hapus
    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      if (confirm("Yakin hapus peraturan ini?")) {
        try {
          const res = await fetch(`${apiBase}/peraturan/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Gagal menghapus");
          alert("✅ Peraturan dihapus.");
          loadPeraturan();
          localStorage.setItem("peraturanUpdated", Date.now());
        } catch (err) {
          alert("❌ Gagal menghapus peraturan.");
        }
      }
    }

    // Edit (judul saja)
    if (editBtn) {
      const id = editBtn.dataset.id;
      const currentJudul = editBtn.closest("tr").cells[0].textContent;
      const newJudul = prompt("Edit Judul Peraturan:", currentJudul);

      if (newJudul && newJudul.trim()) {
        try {
          const res = await fetch(`${apiBase}/peraturan/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ judulKasus: newJudul })
          });
          if (!res.ok) throw new Error("Gagal memperbarui");
          alert("✅ Judul peraturan diperbarui.");
          loadPeraturan();
          localStorage.setItem("peraturanUpdated", Date.now());
        } catch (err) {
          alert("❌ Gagal memperbarui judul.");
        }
      }
    }
  });

  // === Inisialisasi ===
  loadPeraturan();
});