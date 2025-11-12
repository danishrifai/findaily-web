// Toggle visibilitas saldo
const saldoAmount = document.getElementById('saldoAmount');
const toggleEye = document.getElementById('toggleEye');
const totalPemasukanEl = document.getElementById('totalPemasukan');
const totalPengeluaranEl = document.getElementById('totalPengeluaran');
const listTransaksiEl = document.getElementById('listTransaksi');

let saldoVisible = true;

// Data transaksi dari LocalStorage
let dataTransaksi = JSON.parse(localStorage.getItem('transaksi')) || [];

// Hitung dan tampilkan saldo subtotal
function updateSaldo() {
  let totalPemasukan = 0;
  let totalPengeluaran = 0;

  dataTransaksi.forEach(trx => {
    if (trx.jenis === 'pemasukan') {
      totalPemasukan += trx.nominal;
    } else if (trx.jenis === 'pengeluaran') {
      totalPengeluaran += trx.nominal;
    }
  });

  totalPemasukanEl.textContent = 'Rp. ' + totalPemasukan.toLocaleString('id-ID');
  totalPengeluaranEl.textContent = 'Rp. ' + totalPengeluaran.toLocaleString('id-ID');

  let saldoAkhir = 10000000 + totalPemasukan - totalPengeluaran; // Mulai dari 10jt saldo awal
  saldoAmount.textContent = saldoVisible ? ('Rp. ' + saldoAkhir.toLocaleString('id-ID')) : '••••••••••';
}

// Tampilkan daftar transaksi ke HTML
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

    // Klik untuk hapus transaksi
    li.style.cursor = 'pointer';
    li.title = 'Klik untuk hapus transaksi';
    li.addEventListener('click', () => {
      if(confirm('Hapus transaksi ini?')) {
        dataTransaksi.splice(index,1);
        localStorage.setItem('transaksi', JSON.stringify(dataTransaksi));
        renderListTransaksi();
        updateSaldo();
      }
    });

    listTransaksiEl.appendChild(li);
  });
}

// Toggle icon mata dan visibilitas saldo
toggleEye.addEventListener('click', () => {
  saldoVisible = !saldoVisible;
  if (saldoVisible) {
    saldoAmount.textContent = 'Rp. ' + getSaldoAkhir().toLocaleString('id-ID');
    toggleEye.innerHTML = '<i class="fa-regular fa-eye"></i>';
  } else {
    saldoAmount.textContent = '••••••••••';
    toggleEye.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
  }
});

// Ambil saldo akhir
function getSaldoAkhir() {
  let totalPemasukan = 0;
  let totalPengeluaran = 0;

  dataTransaksi.forEach(trx => {
    if (trx.jenis === 'pemasukan') {
      totalPemasukan += trx.nominal;
    } else if (trx.jenis === 'pengeluaran') {
      totalPengeluaran += trx.nominal;
    }
  });

  return 10000000 + totalPemasukan - totalPengeluaran;
}

// Tangani submit form transaksi
document.getElementById('formTransaksi').addEventListener('submit', function(e) {
  e.preventDefault();
  const jenis = document.getElementById('jenisTransaksi').value;
  const nominal = parseInt(document.getElementById('nominal').value);
  const keterangan = document.getElementById('keterangan').value.trim();

  if (!jenis || !nominal || nominal <= 0) {
    alert('Mohon pilih jenis transaksi dan masukkan nominal yang valid.');
    return;
  }

  dataTransaksi.push({ jenis, nominal, keterangan, tanggal: new Date().toISOString() });
  localStorage.setItem('transaksi', JSON.stringify(dataTransaksi));

  this.reset();
  renderListTransaksi();
  updateSaldo();

  alert('Transaksi berhasil ditambahkan!');
});

// Inisialisasi tampilan saat halaman dibuka
renderListTransaksi();
updateSaldo();
