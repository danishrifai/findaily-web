// Toggle visibilitas saldo
const saldoAmount = document.querySelector('.saldo-amount');
const toggleEye = document.querySelector('.toggle-eye');
let saldoVisible = true;

toggleEye.addEventListener('click', () => {
  if (saldoVisible) {
    saldoAmount.textContent = '••••••••••';
    toggleEye.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
  } else {
    saldoAmount.textContent = 'Rp. 10.000.000';
    toggleEye.innerHTML = '<i class="fa-regular fa-eye"></i>';
  }
  saldoVisible = !saldoVisible;
});