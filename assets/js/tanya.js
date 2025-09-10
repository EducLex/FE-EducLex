// Simulasi Kirim Pertanyaan
function kirimPertanyaan(event) {
  event.preventDefault();

  const nama = document.getElementById("nama").value || "Anonim";
  const pertanyaan = document.getElementById("pertanyaan").value;

  const container = document.getElementById("daftar-pertanyaan");

  const div = document.createElement("div");
  div.classList.add("item");
  div.innerHTML = `<strong>${nama}:</strong> ${pertanyaan} <br><em>Jawaban: Pertanyaanmu sedang diproses oleh Jaksa EducLex...</em>`;

  container.prepend(div);

  // reset form
  document.getElementById("tanyaForm").reset();

  // tampilkan alert custom
  showAlert("Pertanyaanmu berhasil dikirim! Tunggu jawaban dari Jaksa.");
  return false;
}

// Chat sederhana (dummy jawaban jaksa)
function sendMessage() {
  const input = document.getElementById("chat-input");
  const msg = input.value.trim();
  if (msg === "") return;

  const chatBox = document.getElementById("chat-messages");
  chatBox.innerHTML += `<div><b>Kamu:</b> ${msg}</div>`;

  setTimeout(() => {
    chatBox.innerHTML += `<div><b>Jaksa:</b> Terima kasih, pertanyaanmu sangat bagus. Hukum selalu hadir untuk melindungi kita.</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 1000);

  input.value = "";
}
