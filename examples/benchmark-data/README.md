# CanL3 Benchmark Verileri

Bu klasÃ¶r, CanL3 formatÄ±nÄ±n performansÄ±nÄ± test etmek iÃ§in kullanÄ±lan Ã¶rnek veri dosyalarÄ±nÄ± iÃ§ermektedir.

## Dosya YapÄ±sÄ±

### JSON DosyalarÄ± (FarklÄ± Boyutlarda)

#### ðŸ“„ KÃ¼Ã§Ã¼k Boyut - KullanÄ±cÄ± Verisi
- **Dosya**: `small-user-data.json` (417 bytes)
- **Ä°Ã§erik**: Tek bir kullanÄ±cÄ±nÄ±n profil bilgileri, tercihler ve istatistikler
- **KullanÄ±m AlanÄ±**: KullanÄ±cÄ± profilleri, konfigÃ¼rasyon dosyalarÄ±

#### ðŸ“„ Orta Boyut - E-Ticaret KataloÄŸu
- **Dosya**: `medium-ecommerce.json` (6.9 KB)
- **Ä°Ã§erik**: ÃœrÃ¼n kataloÄŸu, mÃ¼ÅŸteri bilgileri, sipariÅŸler ve analitik veriler
- **KullanÄ±m AlanÄ±**: E-ticaret platformlarÄ±, Ã¼rÃ¼n yÃ¶netimi

#### ðŸ“„ BÃ¼yÃ¼k Boyut - SaÄŸlÄ±k Verisi
- **Dosya**: `large-healthcare.json` (12.6 KB)
- **Ä°Ã§erik**: Hastane yÃ¶netim sistemi verileri (hasta kayÄ±tlarÄ±, personel, randevular)
- **KullanÄ±m AlanÄ±**: Hastane bilgi sistemleri, tÄ±bbi kayÄ±tlar

### YAML DosyalarÄ±

#### âš™ï¸ KÃ¼Ã§Ã¼k - Uygulama KonfigÃ¼rasyonu
- **Dosya**: `small-config.yaml`
- **Ä°Ã§erik**: Web uygulamasÄ± yapÄ±landÄ±rma ayarlarÄ±
- **KullanÄ±m AlanÄ±**: Config dosyalarÄ±, deployment ayarlarÄ±

#### ðŸ“Š Orta - Proje YÃ¶netimi
- **Dosya**: `medium-projects.yaml`
- **Ä°Ã§erik**: Proje yÃ¶netim sistemi verileri (gÃ¶revler, ekip, bÃ¼tÃ§e)
- **KullanÄ±m AlanÄ±**: Project management tools, ekip iÅŸ birliÄŸi

### CSV DosyalarÄ±

#### ðŸ‘¥ KÃ¼Ã§Ã¼k - Ã‡alÄ±ÅŸan Listesi
- **Dosya**: `small-employees.csv`
- **Ä°Ã§erik**: Ã‡alÄ±ÅŸan bilgileri ve departman atamalarÄ±
- **KullanÄ±m AlanÄ±**: HR sistemleri, personel yÃ¶netimi

#### ðŸ’° Orta - SatÄ±ÅŸ Verileri
- **Dosya**: `medium-sales.csv`
- **Ä°Ã§erik**: SatÄ±ÅŸ sipariÅŸleri, mÃ¼ÅŸteri bilgileri, Ã¼rÃ¼n detaylarÄ±
- **KullanÄ±m AlanÄ±**: SatÄ±ÅŸ raporlarÄ±, CRM sistemleri

### CanL3 FormatlarÄ±

Her JSON dosyasÄ± iÃ§in otomatik olarak oluÅŸturulmuÅŸ CanL3 versiyonlarÄ±:
- `small-user-data.CanL3`
- `medium-ecommerce.CanL3`
- `large-healthcare.CanL3`
- `*-smart.CanL3` (Smart encoding ile optimize edilmiÅŸ versiyonlar)

## Benchmark SonuÃ§larÄ±

### Format KarÅŸÄ±laÅŸtÄ±rmasÄ±

| Dosya | JSON (Bytes) | CanL3 (Bytes) | Smart (Bytes) | KazanÃ§ (%) |
|-------|--------------|--------------|---------------|------------|
| small-user-data.json | 417 | 438 | 451 | -5.0% |
| medium-ecommerce.json | 6,863 | 5,493 | 5,506 | 20.0% |
| large-healthcare.json | 12,912 | 8,942 | 8,949 | 30.7% |

**Ã–zet**:
- ðŸ“ **Toplam JSON Boyutu**: 20,192 bytes
- ðŸ“¦ **Toplam CanL3 Boyutu**: 14,873 bytes
- ðŸ’¾ **Byte Tasarrufu**: **26.3%**
- ðŸ§  **Token Tasarrufu**: **30.4%**

### Token Analizi (Tahmini)

| Model | JSON Maliyet | CanL3 Maliyet | Tasarruf |
|-------|--------------|--------------|----------|
| GPT-4 | $0.1505 | $0.1106 | **15.1%** |
| GPT-3.5-Turbo | $0.0050 | $0.0037 | **15.1%** |
| Claude-3.5-Sonnet | $0.0132 | $0.0097 | **15.2%** |
| Gemini-1.5-Pro | $0.0169 | $0.0124 | **15.3%** |
| Llama-3-8B | $0.0023 | $0.0017 | **15.3%** |

### Performans Metrikleri

- ðŸ“Š **Ortalama Encode sÃ¼resi**: 1.28ms
- âš¡ **Ortalama Decode sÃ¼resi**: 1.11ms
- ðŸ§  **Ortalama Query sÃ¼resi**: 0.16ms
- ðŸ“ˆ **Encode throughput**: 4.8 MB/s
- ðŸš€ **Smart encode**: Regular'den **50.9%** daha hÄ±zlÄ±

## NasÄ±l KullanÄ±lÄ±r?

### CLI ile Benchmark Ã‡alÄ±ÅŸtÄ±rma

```bash
# Format karÅŸÄ±laÅŸtÄ±rmasÄ±
node bench/run-benchmarks.js

# Token analizi
node bench/token-analysis.js

# Performans analizi
node bench/performance-analysis.js
```

### Manuel DÃ¶nÃ¼ÅŸÃ¼m

```bash
# JSON'dan CanL3'e
CanL3 encode examples/benchmark-data/medium-ecommerce.json --out ecommerce.CanL3 --stats

# Smart encoding ile
CanL3 encode examples/benchmark-data/medium-ecommerce.json --out ecommerce-smart.CanL3 --smart --stats

# CanL3'dan JSON'a
CanL3 decode examples/benchmark-data/medium-ecommerce.CanL3 --out ecommerce-decoded.json
```

### Programatik KullanÄ±m

```javascript
import { encodeCanL3, decodeCanL3, encodeSmart } from 'CanL3';

// Veri yÃ¼kleme
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// CanL3 encoding
const CanL3 = encodeCanL3(data);
const CanL3Smart = encodeSmart(data);

// CanL3 decoding
const decoded = decodeCanL3(CanL3);
```

## Ã–neriler

### âœ… CanL3 FormatÄ±nÄ± KullanÄ±n EÄŸer:
- **Boyut tasarrufu** Ã¶nemli (>20% kazanÃ§)
- **Token maliyetleri** yÃ¼ksek (%15+ tasarruf)
- **Okunabilirlik** ve **LLM uyumluluÄŸu** gerekli
- **BÃ¼yÃ¼k veri setleri** ile Ã§alÄ±ÅŸÄ±yorsunuz

### âš ï¸ Dikkat Edilmesi Gerekenler:
- **KÃ¼Ã§Ã¼k dosyalarda** (<1KB) performans dÃ¼ÅŸÃ¼klÃ¼ÄŸÃ¼
- **Memory kullanÄ±mÄ±** bÃ¼yÃ¼k dosyalarda artabilir
- **Query performansÄ±** optimize edilebilir

### ðŸ† En Ä°yi SonuÃ§lar:
- **large-healthcare.json**: %30.7 byte tasarrufu
- **Llama-3-8B modeli**: %15.3 maliyet tasarrufu
- **Smart encoding**: %50.9 daha hÄ±zlÄ±

## Teknik Detaylar

### Token Estimation
- **GPT modelleri**: ~4 karakter = 1 token
- **Claude modelleri**: ~4.5 karakter = 1 token
- **TÃ¼rkÃ§e metinler**: Karakter/token oranÄ± biraz daha dÃ¼ÅŸÃ¼k

### Performans Testleri
- **Ä°terasyon sayÄ±sÄ±**: Dosya boyutuna gÃ¶re dinamik (20-100)
- **Memory Ã¶lÃ§Ã¼mÃ¼**: Heap kullanÄ±m bazÄ±nda
- **Throughput**: MB/s cinsinden hesaplanÄ±r

### Kalibrasyon
Bu benchmark sonuÃ§larÄ± bu spesifik veri setleri iÃ§indir. FarklÄ± veri tipleri ve yapÄ±larÄ± farklÄ± sonuÃ§lar verebilir. Kendi verilerinizle test yapmanÄ±z Ã¶nerilir.

