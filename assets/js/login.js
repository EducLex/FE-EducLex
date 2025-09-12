// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
      // 🔹 Kirim data ke backend
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error("Login gagal, periksa kembali username/password.");
      }

      const data = await response.json();

      // 🔹 Simpan token / data user ke localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      localStorage.setItem("user", JSON.stringify(data.user || { username }));

      showAlert(`✅ Selamat datang, ${data.user?.username || username}!`);
      window.location.href = "index.html";

    } catch (error) {
      console.error("Error:", error);
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
