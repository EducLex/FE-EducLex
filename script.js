// === CEK STATUS LOGIN DAN ATUR TOMBOL AUTH ===
document.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.getElementById("loginLink");
  const logoutBtn = document.getElementById("logoutBtn");

  const token = localStorage.getItem("token"); // cek login
  const role = localStorage.getItem("role");   // role user

  // ✅ Awal: sembunyikan dua-duanya untuk diatur lagi
  if (loginLink) loginLink.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "none";

  if (token) {
    // ✅ Sudah login
    toggleButton(loginLink, false); // sembunyikan login
    toggleButton(logoutBtn, true);  // tampilkan logout

    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        if (typeof Swal !== "undefined") {
          Swal.fire({
            icon: "question",
            title: "Yakin ingin keluar?",
            text: "Sesi kamu akan diakhiri.",
            showCancelButton: true,
            confirmButtonText: "Logout",
            cancelButtonText: "Batal",
          }).then((result) => {
            if (result.isConfirmed) {
              fetch("http://localhost:8080/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              })
                .then((res) => {
                  if (!res.ok) throw new Error("Gagal logout");
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  localStorage.removeItem("user");
                  Swal.fire({
                    icon: "success",
                    title: "Berhasil Logout 👋",
                    text: "Sampai jumpa lagi!",
                    timer: 1500,
                    showConfirmButton: false,
                  }).then(() => {
                    window.location.href = "login.html";
                  });
                })
                .catch((err) => {
                  console.error("Logout error:", err);
                  Swal.fire({
                    icon: "error",
                    title: "Gagal Logout",
                    text: "Terjadi kesalahan koneksi ke server.",
                  });
                });
            }
          });
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          alert("Kamu telah logout.");
          window.location.href = "login.html";
        }
      };
    }

  } else {
    // ❌ Belum login
    toggleButton(loginLink, true);
    toggleButton(logoutBtn, false);

    if (loginLink)
      loginLink.onclick = () => (window.location.href = "login.html");

    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        showAlert("⚠️ Kamu belum login.");
      };
    }
  }

  // === Redirect tombol "Mulai Jelajahi" ===
  const ctaBtn = document.querySelector(".cta-btn");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (!token) {
        window.location.href = "login.html"; // belum login → login dulu
      } else {
        window.location.href = "artikel.html"; // sudah login → ke artikel
      }
    });
  }
});

// Animasi tombol smooth (fade-in/out)
function toggleButton(element, show) {
  if (!element) return;
  if (show) {
    element.style.display = "inline-block";
    element.style.opacity = "0";
    setTimeout(() => {
      element.style.transition = "opacity 0.4s ease";
      element.style.opacity = "1";
    }, 50);
  } else {
    element.style.opacity = "0";
    setTimeout(() => {
      element.style.display = "none";
    }, 300);
  }
}

// === kode lama registrasi, login, alert, artikel, chat, simulasi tetap dipertahankan ===

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
      localStorage.setItem("token", "dummyToken");
      localStorage.setItem("role", "user");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      showAlert("❌ Username atau password salah!");
    }
  });
}

// === Custom Alert Modal ===
function showAlert(message) {
  const modal = document.getElementById("custom-alert");
  const msgBox = document.getElementById("alert-message");

  if (msgBox) msgBox.innerText = message;
  if (modal) {
    modal.style.display = "flex";
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.style.transition = "opacity 0.4s ease";
      modal.style.opacity = "1";
    }, 50);
  }
}

function closeAlert() {
  const modal = document.getElementById("custom-alert");
  if (modal) {
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }
}

// Tutup modal kalau klik di luar box
window.onclick = function (event) {
  const modal = document.getElementById("custom-alert");
  if (event.target === modal) {
    closeAlert();
  }
};

// Artikel hukum populer (dummy data)
const artikel = [
  { title: "Perlindungan Remaja dari Cybercrime", content: "Remaja perlu tahu bagaimana hukum melindungi mereka di dunia digital." },
  { title: "Hak dan Kewajiban Remaja di Sekolah", content: "Kenali aturan dasar yang melindungi hak belajar dan disiplin." },
  { title: "UU Perlindungan Anak", content: "Undang-undang ini hadir untuk menjaga hak anak dari segala bentuk kekerasan." }
];

const artikelContainer = document.getElementById("artikel-container");
if (artikelContainer) {
  artikel.forEach(a => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `<h3>${a.title}</h3><p>${a.content}</p>`;
    artikelContainer.appendChild(card);
  });
}

// Chat sederhana (dummy jawaban jaksa)
function sendMessage() {
  const input = document.getElementById("chat-input");
  const msg = input ? input.value.trim() : "";
  if (msg === "") return;

  const chatBox = document.getElementById("chat-messages");
  if (chatBox) {
    chatBox.innerHTML += `<div><b>Kamu:</b> ${msg}</div>`;
    setTimeout(() => {
      chatBox.innerHTML += `<div><b>Jaksa:</b> Terima kasih, pertanyaanmu sangat bagus. Hukum selalu hadir untuk melindungi kita.</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
  }

  if (input) input.value = "";
}

// Simulasi Kirim Pertanyaan
function kirimPertanyaan(event) {
  event.preventDefault();

  const nama = document.getElementById("nama")?.value || "Anonim";
  const pertanyaan = document.getElementById("pertanyaan")?.value;

  const container = document.getElementById("daftar-pertanyaan");

  if (container) {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = `<strong>${nama}:</strong> ${pertanyaan} <br><em>Jawaban: Pertanyaanmu sedang diproses oleh Jaksa EducLex...</em>`;
    container.prepend(div);
  }

  document.getElementById("tanyaForm")?.reset();
  showAlert("Pertanyaanmu berhasil dikirim! Tunggu jawaban dari Jaksa.");
  return false;
}

// Simulasi kasus
function chooseSimulasi(pilihan) {
  const result = document.getElementById("simulasi-result");
  if (result) {
    if (pilihan === "lapor") {
      result.innerHTML = "👍 Bagus! Kamu melakukan hal yang benar sesuai hukum.";
    } else {
      result.innerHTML = "⚠️ Mengambil dompet bukanlah pilihan tepat, itu bisa dianggap pencurian.";
    }
  }
}

function pilihSimulasi(id, pilihan) {
  let pesan = "";
  if (id === 1) {
    if (pilihan === "lapor") {
      pesan = "✅ Bagus! Melaporkan ke pihak berwenang adalah tindakan benar.";
    } else if (pilihan === "ambil") {
      pesan = "⚠️ Mengambil uang adalah tindak pidana pencurian.";
    } else {
      pesan = "ℹ️ Membiarkan bukan pilihan tepat, bisa membahayakan orang lain.";
    }
  } else if (id === 2) {
    if (pilihan === "logout") {
      pesan = "✅ Tepat! Kamu melindungi privasi temanmu.";
    } else if (pilihan === "post") {
      pesan = "⚠️ Bisa dianggap peretasan/pelecehan digital.";
    } else {
      pesan = "ℹ️ Abaikan bukan masalah, tapi sebaiknya logout untuk keamanan.";
    }
  }

  const hasilBox = document.getElementById(`hasil-${id}`);
  if (hasilBox) {
    hasilBox.innerText = pesan;
    hasilBox.style.display = "block";
  }

  showAlert(pesan);
}
