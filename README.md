<p align="center">PNG optimizer website using <b>oxipng</b> via <b>jSquash WebAssembly</b></p><p align="center"><img src="https://files.catbox.moe/3rpn2x.png" alt="Blairpng web preview" width="600">
</p>

## [Blairpng](https://blairpng.pages.dev/) (live demo)

This website uses an **[oxipng](https://github.com/oxipng/oxipng)** WebAssembly binary via **[jSquash](https://www.npmjs.com/package/@jsquash/oxipng)** for lossless compression with **batch file upload support** all while maintaining **complete data privacy** without needing to use Rust tools or **[Squoosh.app](https://squoosh.app/)** which does not support batch uploading and has memory limitations making you unable to use the maximum compression level on low end devices.

## Features

* Oxipng level 1-6 lossless compression
* Supports batch file uploading
* Supports optional image resizing using [Pica](https://github.com/nodeca/pica) (Lanczos3, etc)
* Supports optional color palette reduction using [image-quantization](https://github.com/ibezkrovnyi/image-quantization)
* Privacy focused (no server side execution)
* No Rust installation or tools needed

---

## Settings (Level 1 = light but fast, 6 = max compress but slower)

| Option | Technical Function | Default |
| --- | --- | --- |
| `level` | Optimization preset (1-6) | `3` |
| `optimize_alpha` | Optimizes transparent pixels | `true` |
| `interlace` | Toggle Adam7 interlacing | `false` |

---

## Performance

Oxipng gives you significant file size reductions but maintains the original image quality.

* **Efficiency:** ~20-40% size reduction depending on the source (takes ... time stats here)
* **Speed:** Uses browser threading via Web Workers for multi core processing for batch uploads

---

Website design inspired by [Gleam](https://gleam.run)
