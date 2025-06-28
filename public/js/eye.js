document.addEventListener("DOMContentLoaded", function () {
  const togglePassword = document.getElementById('togglePassword');
  const passwordField = document.getElementById('password');

  if (togglePassword && passwordField) {
    togglePassword.addEventListener('click', function () {
      const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordField.setAttribute('type', type);
      togglePassword.classList.toggle('fa-eye');
      togglePassword.classList.toggle('fa-eye-slash');
    });
  }

  const toggleConfirm = document.getElementById('toggleConfirmPassword');
  const confirmField = document.getElementById('confirmPassword');

  if (toggleConfirm && confirmField) {
    toggleConfirm.addEventListener('click', function () {
      const type = confirmField.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmField.setAttribute('type', type);
      toggleConfirm.classList.toggle('fa-eye');
      toggleConfirm.classList.toggle('fa-eye-slash');
    });
  }
});
