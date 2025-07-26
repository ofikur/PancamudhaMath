# PancamudhaMath

PancamudhaMath adalah game matematika interaktif yang bertujuan untuk melatih kemampuan matematika dengan cara yang menyenangkan. Game ini menggunakan Python/Flask untuk backend dan HTML/CSS/JavaScript untuk frontend yang interaktif dan menarik.

## Fitur Utama

- **3 Level Kesulitan**:
  - Mudah: Operasi matematika dasar dengan angka kecil (penjumlahan, pengurangan, perkalian)
  - Sedang: Operasi dengan angka lebih besar dan operasi pembagian
  - Sulit: Termasuk akar kuadrat, perpangkatan, dan persamaan sederhana

- **Sistem Skor Komprehensif**:
  - Skor bertambah berdasarkan tingkat kesulitan soal
  - Bonus waktu untuk penyelesaian cepat
  - Penghitungan akurasi jawaban

- **Antarmuka Pengguna Interaktif**:
  - Efek visual menarik (konfeti untuk jawaban benar, partikel animasi background)
  - Umpan balik langsung untuk setiap jawaban
  - Timer dan skor real-time
  - Tampilan hasil akhir dengan rating bintang

- **Desain Responsif**:
  - Tampilan yang bekerja dengan baik di desktop maupun perangkat mobile
  - Animasi dan transisi halus untuk pengalaman bermain yang imersif

## Persyaratan Sistem

- Python 3.6+
- Flask
- Browser web modern dengan dukungan JavaScript

## Cara Instalasi

1. Clone atau download repository ini

2. Install dependensi Python:
   ```
   pip install flask
   ```

3. Pastikan struktur direktori seperti ini:
   ```
   pancamudha_math/
   ├── app.py
   ├── templates/
   │   ├── index.html
   │   └── game.html
   └── static/
       ├── css/
       │   ├── style.css
       │   └── game.css
       ├── js/
       │   ├── script.js
       │   └── game.js
       └── images/
           └── logo.png (opsional)
   ```

## Cara Menjalankan

1. Buka terminal atau command prompt

2. Navigasi ke direktori project:
   ```
   cd path/to/pancamudhaMath
   ```

3. Jalankan server Flask:
   ```
   python app.py
   ```

4. Buka browser dan akses:
   ```
   http://localhost:5000
   ```

## Cara Bermain

1. Pada halaman pembuka, pilih level kesulitan (Mudah, Sedang, atau Sulit)

2. Klik tombol "Mulai Bermain!"

3. Jawab pertanyaan matematika dengan mengetikkan jawaban pada kotak input

4. Klik "Jawab" atau tekan Enter untuk menyerahkan jawaban

5. Setelah mendapat feedback, klik "Soal Berikutnya" untuk lanjut ke soal baru

6. Selesaikan sebanyak mungkin soal dalam waktu yang diberikan (60 detik)

7. Lihat hasil akhir dan prestasi yang kamu capai

8. Pilih "Main Lagi" untuk mencoba lagi atau "Kembali ke Beranda" untuk memilih level baru

## Struktur Kode

- **app.py**: Server Flask dengan logika game dan API endpoints
- **templates/**: Berisi file HTML
  - **index.html**: Halaman pembuka dan pemilihan level
  - **game.html**: Halaman utama gameplay
- **static/**: Berisi aset statis
  - **css/**: File CSS untuk styling
  - **js/**: File JavaScript untuk interaktivitas frontend
  - **images/**: Gambar dan aset visual

## Pengembangan Lanjutan

Ide untuk pengembangan lebih lanjut:
- Menambahkan lebih banyak jenis soal matematika
- Implementasi sistem login dan leaderboard
- Mode turnamen untuk multiplayer
- Mode pembelajaran dengan pembahasan jawaban
- Integrasi dengan platform pendidikan

## Masalah Umum dan Solusi

- **Server tidak berjalan**: Pastikan Flask terinstal dan port 5000 tidak digunakan oleh aplikasi lain
- **Soal tidak muncul**: Periksa koneksi jaringan dan reload halaman
- **Jawaban tidak diproses**: Pastikan JavaScript diaktifkan di browser

## Kontributor

- Developed by: Ofikur R.
- Versi: 1.0

---

Terima kasih telah menggunakan PancamudhaMath! Semoga game ini membantu meningkatkan kemampuan matematika dengan cara yang menyenangkan.
