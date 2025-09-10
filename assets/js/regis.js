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

const toRegister = document.getElementById("toRegister");
if (toRegister) {
  toRegister.addEventListener("click", function(e) {
    e.preventDefault(); 
    window.location.href = "regis.html";
  });
}