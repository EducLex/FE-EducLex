// assets/js/peraturan.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("peraturanContainer");
  const API_BASE = "http://localhost:8080";

  if (!container) {
    console.error("❌ Elemen #peraturanContainer tidak ditemukan.");
    return;
  }

  // === Fungsi untuk render data peraturan ===
  function renderPeraturan(data) {
    container.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:#777;">Belum ada peraturan yang tersedia.</p>`;
      return;
    }

    data.forEach(item => {
      const itemEl = document.createElement("div");
      itemEl.classList.add("peraturan-item");
      itemEl.style.marginBottom = "1.5rem";
      itemEl.style.paddingLeft = "1rem";
      itemEl.style.borderLeft = "3px solid #8d6e63";

      const judul = document.createElement("h3");
      judul.textContent = item.judul || "Tanpa Judul";
      judul.style.fontFamily = "'Poppins', sans-serif";
      judul.style.fontWeight = "700";
      judul.style.color = "#4e342e";
      judul.style.marginBottom = "0.5rem";

      const isi = document.createElement("div");
      isi.style.marginBottom = "0.5rem";
      isi.style.lineHeight = "1.6";

      // ✅ Handle isi sebagai string atau array
      if (Array.isArray(item.isi)) {
        const ol = document.createElement("ol");
        item.isi.forEach(p => {
          const li = document.createElement("li");
          li.textContent = p;
          ol.appendChild(li);
        });
        isi.appendChild(ol);
      } else if (typeof item.isi === 'string') {
        // Tampilkan sebagai paragraf
        isi.innerHTML = `<p>${item.isi.replace(/\n/g, '<br>')}</p>`;
      } else {
        isi.textContent = "Tidak ada isi.";
      }

      const kategori = document.createElement("p");
      kategori.innerHTML = `<strong>Kategori:</strong> ${item.kategori || "Umum"}`;
      kategori.style.fontSize = "0.9rem";
      kategori.style.color = "#6d4c41";
      kategori.style.marginBottom = "0.5rem";

      const tanggal = document.createElement("small");
      tanggal.textContent = item.tanggal 
        ? new Date(item.tanggal).toLocaleDateString("id-ID") 
        : "Tanggal tidak tersedia";
      tanggal.style.color = "#6d4c41";

      itemEl.appendChild(judul);
      itemEl.appendChild(isi);
      itemEl.appendChild(kategori);
      itemEl.appendChild(tanggal);
      container.appendChild(itemEl);
    });
  }

  // === Fetch data dari backend ===
  async function fetchPeraturan() {
    try {
      console.log("🔍 Mengambil data dari:", `${API_BASE}/peraturan`);

      const response = await fetch(`${API_BASE}/peraturan`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Data diterima:", data);

      if (Array.isArray(data)) {
        renderPeraturan(data);
      } else {
        throw new Error("Respons bukan array.");
      }

    } catch (error) {
      console.error("❌ Gagal mengambil data:", error);
      container.innerHTML = `
        <div style="text-align:center; padding:2rem; background:#fff3e6; border-radius:12px; margin:1rem;">
          <h3 style="color:#c62828; margin-bottom:1rem;">⚠️ Gagal Memuat Data</h3>
          <p style="color:#5d4037; line-height:1.6;">
            Error: <code>${error.message}</code>
          </p>
          <p style="margin-top:1rem; font-size:0.9rem;">
            Pastikan backend berjalan di <strong>http://localhost:8080</strong>
          </p>
          <button onclick="location.reload()" style="
            background:#8d6e63; color:white; border:none; padding:0.5rem 1rem;
            border-radius:8px; margin-top:1rem;
          ">Coba Lagi</button>
        </div>
      `;
    }
  }

  // === Tambah peraturan (opsional) ===
  const form = document.getElementById("addPeraturanForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const judul = document.getElementById("judulInput")?.value.trim();
      const isi = document.getElementById("isiInput")?.value.trim();
      const kategori = document.getElementById("kategoriInput")?.value.trim();

      if (!judul || !isi || !kategori) {
        alert("Semua field wajib diisi!");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/peraturan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ judul, isi, kategori })
        });

        if (!res.ok) throw new Error("Gagal menyimpan data.");

        alert("✅ Peraturan berhasil ditambahkan!");
        form.reset();
        fetchPeraturan(); // Refresh data

      } catch (err) {
        console.error("❌ Error simpan:", err);
        alert("Gagal menyimpan peraturan. Cek koneksi ke server.");
      }
    });
  }

  // Jalankan fetch
  fetchPeraturan();
});