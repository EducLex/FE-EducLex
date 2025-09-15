// peraturan.js

// Tambah peraturan baru
function tambahPeraturan() {
  const judul = document.getElementById("judul").value;
  const pasal = document.getElementById("pasal").value;

  if (!judul || !pasal) {
    alert("⚠️ Harap isi semua field!");
    return;
  }

  const peraturanList = document.getElementById("peraturan-list");

  // Buat section baru
  const newPeraturan = document.createElement("section");
  newPeraturan.className = "simulasi-box";

  const id = Date.now(); // id unik berdasarkan timestamp

  newPeraturan.setAttribute("data-id", id);
  newPeraturan.innerHTML = `
    <h2>${judul}</h2>
    <ul>
      <li>${pasal}</li>
    </ul>
    <div class="actions">
      <button onclick="editPeraturan(${id})">✏️ Edit</button>
      <button onclick="hapusPeraturan(${id})">🗑️ Hapus</button>
    </div>
  `;

  peraturanList.appendChild(newPeraturan);

  // Reset input
  document.getElementById("judul").value = "";
  document.getElementById("pasal").value = "";
}

// Edit peraturan
function editPeraturan(id) {
  const box = document.querySelector(`.simulasi-box[data-id='${id}']`);
  const judulEl = box.querySelector("h2");
  const pasalEl = box.querySelector("ul li");

  const judulBaru = prompt("Edit judul kasus:", judulEl.innerText);
  const pasalBaru = prompt("Edit pasal/peraturan:", pasalEl.innerText);

  if (judulBaru && pasalBaru) {
    judulEl.innerText = judulBaru;
    pasalEl.innerText = pasalBaru;
  }
}

// Hapus peraturan
function hapusPeraturan(id) {
  const box = document.querySelector(`.simulasi-box[data-id='${id}']`);
  if (confirm("Apakah kamu yakin ingin menghapus peraturan ini?")) {
    box.remove();
  }
}
