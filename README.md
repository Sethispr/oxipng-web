# Image Compressor

<p align="center">
<img src="https://wsrv.nl/?url=raw.githubusercontent.com/Sethispr/image-compressor/main/assets/IMG_7503.jpeg" alt="image compressor web preview" height="500">
  
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff&style=for-the-badge)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge)](https://react.dev/)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-654FF0?logo=webassembly&logoColor=fff&style=for-the-badge)](https://webassembly.org/)
[![jSquash](https://img.shields.io/badge/jSquash-ff69b4?logo=googlechrome&logoColor=fff&style=for-the-badge)](https://github.com/GoogleChromeLabs/jsquash)

<https://img-compress.pages.dev>
</p>
Bulk Image Compressor using WebAssembly (WASM). No ads, no trackers, no cookies, no signups.

---

## Image Compressor Info

This image compressor is a fast, privacy first image compressor app that uses WebAssembly (wasm) and [modern codecs](https://github.com/jamsinclair/jSquash) to give near native compression speeds directly in your browser. This beats other sites that uses old JS based compression. By using local client side processing, this image compressor bypasses traditional upload limits and data privacy concerns while providing a highly customizable toolkit (image resizing, color reduction, lossless options, batch file renaming and more).

Website design inspired by [Gleam](https://gleam.run)

## Compression Queue

The compressor gives you unlimited image compression queue and supports processing 10+ images all at once (customizable too) 

<p align="center">
<img src="https://wsrv.nl/?url=raw.githubusercontent.com/Sethispr/image-compressor/main/assets/IMG_7505.jpeg" alt="batch image compression queue preview" height="500">
</p>

## Image Comparison

Mobile friendly image comparison shows a side by side view of the original and compressed image to check quality changes.

<p align="center">
<img src="https://wsrv.nl/?url=raw.githubusercontent.com/Sethispr/image-compressor/main/assets/IMG_7517.jpeg" alt="image compressor quality comparison" height="635">
</p>

---

### Prerequisites

- Node.js 18 or later
- npm 7 or later

---

### Development Setup

This project uses Vite + React and WebAssembly (wasm) provided by [jSquash](https://www.npmjs.com/search?q=jsquash), their codecs are from the [Squoosh](https://github.com/GoogleChromeLabs/squoosh) app.

Follow these steps to get the project running locally:

1. **Clone the Repo**

```bash
git clone https://github.com/Sethispr/image-compressor.git
```

2. **Change Directory**

```bash
cd image-compressor
```

3. **Install Dependencies**

```bash
npm install
```

4. **Run Development Server**

```bash
npm run dev
```

*Once the server starts, click the local link shown in your terminal (usually `http://localhost:5173`) to view the site live.*

More info on contributing is available [over here](https://github.com/Sethispr/image-compressor?tab=contributing-ov-file)

---

## Self Hosting

You can host this application yourself using Docker. This method is so the app runs in a consistent environment using a ready Nginx server. If you want your project to be seen by everyone, you need to have a domain name that points to your local machine, and then proxy it to port of this machine, you can use something like Nginx.

### Prerequisites

* Docker installed on your system.

### Docker CLI

1. **Build the image:**
Navigate to the project root and run:

```bash
docker build -t image-compressor .
```

2. **Run the container:**

```bash
docker run -d -p 8080:80 image-compressor
```

The app will now be at `http://localhost:8080`.

### Configuration Notes

* **Port Mapping:** You can change the port by modifying the first number in the port mapping (ex: `-p 3000:80` will serve app on port 3000).
* **Routing:** The included Nginx configuration handles Single Page Application (SPA) routing, so refreshing the page on sub routes will work correctly.
* **Updates:** To update your self hosted instance, pull the latest code from the repository and rebuild the image using the build command above.

If you find any issues during the setup process, please feel free to open an issue in the repository.

---
<p align="center">
  <b>Support this project</b><br />
  If you find this tool useful, please consider giving it a star!
  <br /><br />
  <a href="https://github.com/Sethispr/image-compressor">
    <img src="https://img.shields.io/github/stars/Sethispr/image-compressor?style=for-the-badge&color=gold&logo=github" alt="yield stars"/>
  </a>
</p>
