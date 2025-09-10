// Register
const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("regConfirmPassword").value;

    // ✅ Validasi tambahan: konfirmasi password
    if (password !== confirmPassword) {
      showAlert("❌ Password dan Konfirmasi Password tidak sama!");
      return;
    }

    // Simpan ke localStorage
    localStorage.setItem("user", JSON.stringify({ username, password }));

    showAlert("✅ Registrasi berhasil! Silakan login.");
    window.location.href = "login.html";
  });
}

const toRegister = document.getElementById("toRegister");
if (toRegister) {
  toRegister.addEventListener("click", function(e) {
    e.preventDefault(); 
    window.location.href = "regis.html";
  });
}
