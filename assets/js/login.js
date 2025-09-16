const apiBase = "http://localhost:8080"; // alamat backend kamu

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!username || !password) {
      alert("⚠️ Username dan password wajib diisi!");
      return;
    }

    try {
      const response = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        // ✅ Simpan token dari backend
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        // Simpan info user
        localStorage.setItem("user", JSON.stringify({ username }));

        alert(`✅ Login berhasil, selamat datang ${username}!`);
        window.location.href = "index.html"; // redirect ke halaman utama
      } else {
        alert(data.message || "❌ Username atau password salah!");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Gagal terhubung ke server. Pastikan backend jalan di port 8080.");
    }
  });
});
