// Register
const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;

    localStorage.setItem("user", JSON.stringify({ username, password }));
    showAlert("✅ Registrasi berhasil! Silakan login.");
    window.location.href = "login.html";
  });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.username === username && user.password === password) {
      showAlert(`✅ Selamat datang, ${username}!`);
      window.location.href = "index.html";
    } else {
      showAlert("❌ Username atau password salah!");
    }
  });
}

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

