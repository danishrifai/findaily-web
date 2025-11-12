// ============================
// FinDaily 3 — Update Saldo Aktif
// ============================

// Elemen-elemen utama
const saldoAmount = document.getElementById('saldoAmount');
const toggleEye = document.getElementById('toggleEye');
const totalPemasukanEl = document.getElementById('totalPemasukan');
const totalPengeluaranEl = document.getElementById('totalPengeluaran');
const listTransaksiEl = document.getElementById('listTransaksi');

// Data awal
let saldoVisible = true;
let dataTransaksi = JSON.parse(localStorage.getItem('transaksi')) || [];
let saldoAwal = parseInt(localStorage.getItem('saldoAwal')) || 10000000; // bisa diubah user nanti

// ============================
// Hitung dan tampilkan saldo
// ============================
function updateSaldo() {
  let totalPemasukan = 0;
  let totalPengeluaran = 0;

  dataTransaksi.forEach(trx => {
    if (trx.jenis === 'pemasukan') totalPemasukan += trx.nominal;
    else if (trx.jenis === 'pengeluaran') totalPengeluaran += trx.nominal;
  });

  const saldoAkhir = saldoAwal + totalPemasukan - totalPengeluaran;

  totalPemasukanEl.textContent = 'Rp. ' + totalPemasukan.toLocaleString('id-ID');
  totalPengeluaranEl.textContent = 'Rp. ' + totalPengeluaran.toLocaleString('id-ID');
  saldoAmount.textContent = saldoVisible ? 'Rp. ' + saldoAkhir.toLocaleString('id-ID') : '••••••••••';
}

// ============================
// Render daftar transaksi
// ============================
function renderListTransaksi() {
  listTransaksiEl.innerHTML = '';
  if (dataTransaksi.length === 0) {
    listTransaksiEl.innerHTML = '<li>Tidak ada transaksi.</li>';
    return;
  }

  dataTransaksi.forEach((trx, index) => {
    const li = document.createElement('li');
    li.className = trx.jenis;
    li.innerHTML = `
      <span>${trx.keterangan || '-'}</span>
      <span class="nominal">${trx.jenis === 'pemasukan' ? '+' : '-'} Rp. ${trx.nominal.toLocaleString('id-ID')}</span>
    `;
    li.style.cursor = 'pointer';
    li.title = 'Klik untuk hapus transaksi';
    li.addEventListener('click', () => {
      if (confirm('Hapus transaksi ini?')) {
        dataTransaksi.splice(index, 1);
        localStorage.setItem('transaksi', JSON.stringify(dataTransaksi));
        renderListTransaksi();
        updateSaldo();
      }
    });
    listTransaksiEl.appendChild(li);
  });
}

// ============================
// Toggle visibilitas saldo
// ============================
toggleEye.addEventListener('click', () => {
  saldoVisible = !saldoVisible;
  localStorage.setItem('saldoVisible', saldoVisible); // simpan status toggle
  toggleEye.innerHTML = saldoVisible
    ? '<i class="fa-regular fa-eye"></i>'
    : '<i class="fa-regular fa-eye-slash"></i>';
  updateSaldo();
});

// ============================
// Ganti saldo awal
// ============================
function ubahSaldoAwal() {
  const input = prompt('Masukkan saldo awal baru (angka saja):', saldoAwal);
  if (input !== null && !isNaN(parseInt(input))) {
    saldoAwal = parseInt(input);
    localStorage.setItem('saldoAwal', saldoAwal);
    updateSaldo();
    alert('Saldo awal berhasil diubah menjadi Rp. ' + saldoAwal.toLocaleString('id-ID'));
  }
}

// Klik dua kali pada tulisan saldo untuk ubah saldo awal
saldoAmount.addEventListener('dblclick', ubahSaldoAwal);

// ============================
// Submit form transaksi
// ============================
document.getElementById('formTransaksi').addEventListener('submit', e => {
  e.preventDefault();
  const jenis = document.getElementById('jenisTransaksi').value;
  const nominal = parseInt(document.getElementById('nominal').value);
  const keterangan = document.getElementById('keterangan').value.trim();

  if (!jenis || !nominal || nominal <= 0) {
    alert('Mohon pilih jenis transaksi dan masukkan nominal yang valid.');
    return;
  }

  dataTransaksi.push({
    jenis,
    nominal,
    keterangan,
    tanggal: new Date().toISOString()
  });
  localStorage.setItem('transaksi', JSON.stringify(dataTransaksi));
  e.target.reset();
  renderListTransaksi();
  updateSaldo();
  alert('Transaksi berhasil ditambahkan!');
});

// ============================
// Inisialisasi awal
// ============================
(function init() {
  saldoVisible = JSON.parse(localStorage.getItem('saldoVisible'));
  if (saldoVisible === null) saldoVisible = true;
  toggleEye.innerHTML = saldoVisible
    ? '<i class="fa-regular fa-eye"></i>'
    : '<i class="fa-regular fa-eye-slash"></i>';
  renderListTransaksi();
  updateSaldo();
})();
