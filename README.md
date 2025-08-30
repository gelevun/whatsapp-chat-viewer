# WhatsApp Sohbet Görüntüleyici

Bu uygulama, WhatsApp'tan dışa aktarılan sohbet dosyalarını modern bir arayüzle görüntülemenizi sağlar.

## Özellikler

- 📱 WhatsApp benzeri modern arayüz
- 🖼️ Resim mesajlarını görüntüleme
- 📍 Konum paylaşımlarını destekleme
- 🔗 Link mesajlarını tıklanabilir yapma
- 📞 Cevapsız arama mesajlarını gösterme
- 🆔 **TC Kimlik Numarası algılama ve özel görüntüleme**
- 🏦 **IBAN algılama ve özel görüntüleme**
- 🏛️ **Banka bilgilerini algılama ve özel görüntüleme**
- 📱 **Telefon numarası algılama ve özel görüntüleme**
- 📧 **E-posta algılama ve özel görüntüleme**
- 🌐 **Website algılama ve özel görüntüleme**
- 🌙 Karanlık/Aydınlık tema desteği
- 📤 Sohbeti dışa aktarma
- 📱 Mobil uyumlu tasarım
- 📁 Çoklu dosya yükleme desteği

## Kullanım

1. `index.html` dosyasını bir web tarayıcısında açın
2. Uygulama otomatik olarak `_chat.txt` dosyasını yüklemeye çalışacak
3. Eğer dosya yüklenmezse, "Sohbet Dosyalarını Yükle" butonuna tıklayın
4. WhatsApp'tan dışa aktardığınız `_chat.txt` ve resim dosyalarını seçin

### Desteklenen Dosya Formatları
- **Tek dosya**: `_chat.txt` dosyası (resimler aynı klasörde olmalı)
- **Çoklu dosya**: `_chat.txt` ve resim dosyalarını aynı anda seçebilirsiniz

## Desteklenen Dosya Formatı

Uygulama, WhatsApp'ın standart dışa aktarma formatını destekler:

```
[1/2/20 20:24:16] Salih Güngör: Merhaba
[1/2/20 20:25:00] Orhan İlhan: Selam
```

## Özellikler

### Mesaj Türleri
- **Metin mesajları**: Normal sohbet mesajları
- **Resim mesajları**: `<dosya.jpg eklendi>` formatındaki resimler
- **Konum mesajları**: Google Maps linkleri
- **Link mesajları**: Tıklanabilir URL'ler
- **Cevapsız aramalar**: Görüntülü arama mesajları
- **TC Kimlik Numarası**: 11 haneli TC kimlik numaraları
- **IBAN**: Türk bankalarının IBAN numaraları
- **Banka bilgileri**: Banka isimleri ve bilgileri
- **Telefon numaraları**: Türk telefon numarası formatları
- **E-posta adresleri**: Geçerli e-posta formatları
- **Website adresleri**: Web sitesi URL'leri

### Özel Görüntüleme
- **TC Kimlik No**: Turuncu arka plan ile özel görüntüleme
- **IBAN**: Mavi arka plan ile özel görüntüleme
- **Banka Bilgisi**: Yeşil arka plan ile özel görüntüleme
- **Telefon Numarası**: Pembe arka plan ile özel görüntüleme
- **E-posta**: Mor arka plan ile özel görüntüleme
- **Website**: Turkuaz arka plan ile özel görüntüleme

### Tema Desteği
- Aydınlık tema (varsayılan)
- Karanlık tema (ay butonuna tıklayarak değiştirilebilir)

### Dışa Aktarma
- Sohbeti yeniden düzenlenmiş formatta dışa aktarabilirsiniz
- Tarih ve saat bilgileri korunur

## Teknik Detaylar

- **HTML5**: Modern web standartları
- **CSS3**: Responsive tasarım ve animasyonlar
- **JavaScript (ES6+)**: Dinamik içerik ve etkileşim
- **Font Awesome**: İkonlar için
- **Regex Patterns**: Özel veri türlerini algılama

## Kurulum

1. Tüm dosyaları aynı klasöre koyun
2. `index.html` dosyasını web tarayıcısında açın
3. WhatsApp sohbet dosyanızı yükleyin

## Dosya Yapısı

```
├── index.html          # Ana HTML dosyası
├── styles.css          # CSS stilleri
├── script.js           # JavaScript kodu
├── _chat.txt           # WhatsApp sohbet dosyası (örnek)
├── *.jpg               # Sohbet resimleri
└── README.md           # Bu dosya
```

## Tarayıcı Desteği

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Lisans

Bu proje açık kaynak kodludur ve kişisel kullanım için serbestçe kullanılabilir.

## Katkıda Bulunma

1. Projeyi fork edin
2. Yeni bir branch oluşturun
3. Değişikliklerinizi commit edin
4. Pull request gönderin

## İletişim

Sorularınız için GitHub üzerinden issue açabilirsiniz.
