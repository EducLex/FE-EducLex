// assets/js/peraturan.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("peraturanContainer");
  const API_BASE = "http://localhost:8080";

  if (!container) {
    console.error("❌ Elemen #peraturanContainer tidak ditemukan di HTML.");
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
      const div = document.createElement("div");
      div.style.marginBottom = "1.5rem";
      div.style.paddingLeft = "1rem";
      div.style.borderLeft = "3px solid #8d6e63";

      const judul = document.createElement("h3");
      judul.textContent = item.judulKasus || "Tanpa Judul";
      judul.style.fontFamily = "'Poppins', sans-serif";
      judul.style.fontWeight = "700";
      judul.style.color = "#4e342e";
      judul.style.marginBottom = "0.5rem";

      const isi = document.createElement("div");
      if (Array.isArray(item.isi)) {
        const ol = document.createElement("ol");
        item.isi.forEach(p => {
          const li = document.createElement("li");
          li.textContent = p;
          ol.appendChild(li);
        });
        isi.appendChild(ol);
      } else {
        isi.textContent = item.isi || "Tidak ada isi.";
      }
      isi.style.marginBottom = "0.5rem";

      const tanggal = document.createElement("small");
      tanggal.textContent = new Date(item.tanggal).toLocaleDateString("id-ID");
      tanggal.style.color = "#6d4c41";

      div.appendChild(judul);
      div.appendChild(isi);
      div.appendChild(tanggal);
      container.appendChild(div);
    });
  }

  // === Fetch data dari backend ===
  async function fetchPeraturan() {
    try {
      console.log("🔍 Mengirim request ke:", `${API_BASE}/peraturan`);

      const response = await fetch(`${API_BASE}/peraturan`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
        // credentials: "include" — hanya jika pakai session/cookie
      });

      console.log("📡 Status respons:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Data berhasil diterima:", data);

      // Validasi struktur data
      if (!Array.isArray(data)) {
        throw new Error("Respons bukan array. Pastikan backend mengembalikan array objek.");
      }

      renderPeraturan(data);

    } catch (error) {
      console.error("❌ Gagal mengambil data peraturan:", error);

      container.innerHTML = `
        <div style="text-align:center; padding:2rem; background:#fff3e6; border-radius:12px; margin:1rem; font-family:'Poppins', sans-serif;">
          <h3 style="color:#c62828; margin-bottom:1rem;">⚠️ Gagal Memuat Data</h3>
          <p style="color:#5d4037; line-height:1.6; font-size:0.95rem;">
            Error: <code>${error.message}</code>
          </p>
          <p style="margin-top:1rem; font-size:0.9rem;">
            Pastikan endpoint <strong>http://localhost:8080/peraturan</strong> mengembalikan JSON array.
          </p>
          <button onclick="location.reload()" style="
            background:#8d6e63; color:white; border:none; padding:0.5rem 1rem;
            border-radius:8px; cursor:pointer; margin-top:1rem; font-weight:600;
          ">Coba Lagi</button>
        </div>
      `;
    }
  }

  // Jalankan fetch
  fetchPeraturan();
});