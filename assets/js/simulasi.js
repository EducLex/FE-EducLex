// Simulasi kasus
function chooseSimulasi(pilihan) {
  const result = document.getElementById("simulasi-result");
  if (pilihan === "lapor") {
    result.innerHTML = "👍 Bagus! Kamu melakukan hal yang benar sesuai hukum.";
  } else {
    result.innerHTML = "⚠️ Mengambil dompet bukanlah pilihan tepat, itu bisa dianggap pencurian.";
  }
}

function pilihSimulasi(id, pilihan) {
  let pesan = "";
  if (id === 1) { // Kasus dompet
    if (pilihan === "lapor") {
      pesan = "✅ Bagus! Melaporkan ke pihak berwenang adalah tindakan benar.";
    } else if (pilihan === "ambil") {
      pesan = "⚠️ Mengambil uang adalah tindak pidana pencurian.";
    } else {
      pesan = "ℹ️ Membiarkan bukan pilihan tepat, bisa membahayakan orang lain.";
    }
  } else if (id === 2) { // Kasus akun sosmed
    if (pilihan === "logout") {
      pesan = "✅ Tepat! Kamu melindungi privasi temanmu.";
    } else if (pilihan === "post") {
      pesan = "⚠️ Bisa dianggap peretasan/pelecehan digital.";
    } else {
      pesan = "ℹ️ Abaikan bukan masalah, tapi sebaiknya logout untuk keamanan.";
    }
  }

  const hasilBox = document.getElementById(`hasil-${id}`);
  hasilBox.innerText = pesan;
  hasilBox.style.display = "block";

  // alert custom
  showAlert(pesan);
}

