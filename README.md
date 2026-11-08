# Cinarithm Learning Hub

Matematiğin temelleri ve Real Analysis odağında ders, alıştırma, kavram ve not çalışma alanı.

## Yerel çalıştırma

Node.js 22 kullanın:

```bash
npm ci
npm run dev
```

Uygulama `http://127.0.0.1:3000` adresinde açılır.

## Kontroller

```bash
npm run lint
npm run build
```

## Ortam değişkenleri

`.env.example` dosyasını `.env.local` olarak kopyalayıp Supabase bağlantısı için `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` değerlerini girin. Bu değerler yoksa Learning Hub yerel veriyle çalışır.
