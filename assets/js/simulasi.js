let kasusId = 2; // sudah ada 2 kasus default

// Fungsi memilih opsi simulasi
function pilihSimulasi(id, pilihan) {
  let pesan = "";

  if (id === 1) {
    if (pilihan === "lapor") pesan = "✅ Bagus! Melaporkan ke pihak berwenang adalah tindakan benar.";
    else if (pilihan === "ambil") pesan = "⚠️ Mengambil uang adalah tindak pidana pencurian.";
    else pesan = "ℹ️ Membiarkan bukan pilihan tepat, bisa membahayakan orang lain.";
  } else if (id === 2) {
    if (pilihan === "logout") pesan = "✅ Tepat! Kamu melindungi privasi temanmu.";
    else if (pilihan === "post") pesan = "⚠️ Bisa dianggap peretasan/pelecehan digital.";
    else pesan = "ℹ️ Abaikan bukan masalah, tapi sebaiknya logout untuk keamanan.";
  } else {
    pesan = `✅ Kamu memilih opsi "${pilihan}" untuk kasus ${id}.`;
  }

  document.getElementById(`hasil-${id}`).innerText = pesan;
  document.getElementById(`hasil-${id}`).style.display = "block";
}

// Tambah kasus baru
function tambahKasus() {
  const judul = document.getElementById("judul").value;
  const deskripsi = document.getElementById("deskripsi").value;
  const opsi1 = document.getElementById("opsi1").value;
  const opsi2 = document.getElementById("opsi2").value;
  const opsi3 = document.getElementById("opsi3").value;

  if (!judul || !deskripsi || !opsi1 || !opsi2 || !opsi3) {
    alert("⚠️ Harap isi semua field!");
    return;
  }

  kasusId++;
  const newKasus = document.createElement("section");
  newKasus.className = "simulasi-box";
  newKasus.setAttribute("data-id", kasusId);

  newKasus.innerHTML = `
    <h2>${judul}</h2>
    <p>${deskripsi}</p>
    <div class="opsi">
      <button onclick="pilihSimulasi(${kasusId}, '${opsi1}')">${opsi1}</button>
      <button onclick="pilihSimulasi(${kasusId}, '${opsi2}')">${opsi2}</button>
      <button onclick="pilihSimulasi(${kasusId}, '${opsi3}')">${opsi3}</button>
    </div>
    <div id="hasil-${kasusId}" class="hasil"></div>
    <div class="actions">
      <button onclick="editKasus(${kasusId})">✏️ Edit</button>
      <button onclick="hapusKasus(${kasusId})">🗑️ Hapus</button>
    </div>
  `;

  document.getElementById("simulasi-list").appendChild(newKasus);

  // Reset input
  document.getElementById("judul").value = "";
  document.getElementById("deskripsi").value = "";
  document.getElementById("opsi1").value = "";
  document.getElementById("opsi2").value = "";
  document.getElementById("opsi3").value = "";
}

// Edit kasus
function editKasus(id) {
  const box = document.querySelector(`.simulasi-box[data-id='${id}']`);
  const judul = prompt("Edit judul:", box.querySelector("h2").innerText);
  const deskripsi = prompt("Edit deskripsi:", box.querySelector("p").innerText);

  if (judul && deskripsi) {
    box.querySelector("h2").innerText = judul;
    box.querySelector("p").innerText = deskripsi;
  }
}

// Hapus kasus
function hapusKasus(id) {
  const box = document.querySelector(`.simulasi-box[data-id='${id}']`);
  if (confirm("Apakah kamu yakin ingin menghapus kasus ini?")) {
    box.remove();
  }
}
