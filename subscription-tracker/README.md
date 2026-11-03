# Abonelik Takipçisi

Abonelikleri tek ekrandan takip etmek için hazırlanmış basit bir Expo / React Native uygulaması.

## Özellikler

- Abonelik ekleme ve silme
- Fiyat, para birimi, kategori ve sonraki ödeme tarihini kaydetme
- Ödeme durumunu `ÖDENDİ` olarak işaretleme
- Aylık toplam, yaklaşan ödemeler ve ödenen abonelik özeti
- Verileri cihazda AsyncStorage ile kalıcı saklama
- Abonelikleri JSON dosyası olarak paylaşarak yedekleme

## Çalıştırma

```bash
pnpm install
pnpm start
```

Tarih alanı `YYYY-AA-GG` formatında girilmelidir. Yedekleme, ana ekrandaki **Yedekle** düğmesiyle cihazın paylaşım menüsünü açar.
