// === Custom Alert Modal ===
function showAlert(message) {
  document.getElementById("alert-message").innerText = message;
  document.getElementById("custom-alert").style.display = "flex";
}

function closeAlert() {
  document.getElementById("custom-alert").style.display = "none";
}

// Tutup modal kalau klik di luar box
window.onclick = function(event) {
  const modal = document.getElementById("custom-alert");
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

// Artikel hukum populer (dummy data)
const artikel = [
  { title: "Perlindungan Remaja dari Cybercrime", content: "Remaja perlu tahu bagaimana hukum melindungi mereka di dunia digital." },
  { title: "Hak dan Kewajiban Remaja di Sekolah", content: "Kenali aturan dasar yang melindungi hak belajar dan disiplin." },
  { title: "UU Perlindungan Anak", content: "Undang-undang ini hadir untuk menjaga hak anak dari segala bentuk kekerasan." }
];

const artikelContainer = document.getElementById("artikel-container");
artikel.forEach(a => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `<h3>${a.title}</h3><p>${a.content}</p>`;
  artikelContainer.appendChild(card);
});

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

// Simulasi kasus
function chooseSimulasi(pilihan) {
  const result = document.getElementById("simulasi-result");
  if (pilihan === "lapor") {
    result.innerHTML = "👍 Bagus! Kamu melakukan hal yang benar sesuai hukum.";
  } else {
    result.innerHTML = "⚠️ Mengambil dompet bukanlah pilihan tepat, itu bisa dianggap pencurian.";
  }
}
