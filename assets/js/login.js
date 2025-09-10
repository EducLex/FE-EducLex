



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

// Tombol Google di login & register
const googleBtns = document.querySelectorAll(".google-btn");
if (googleBtns) {
  googleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      showAlert("🚀 Fitur Login/Daftar Google belum aktif. (Hanya tampilan)");
    });
  });
}