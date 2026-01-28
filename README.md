<p align="center">[IN DEVELOPMENT]<br />Image optimizer website using jSquash WebAssembly similar to squoosh</b></p><p align="center"><img src="https://wsrv.nl/?url=raw.githubusercontent.com/Sethispr/image-compressor/main/assets/IMG_7503.jpeg" alt="img-compress web preview" height="500">
</p>

# [image-compressor](https://img-compress.pages.dev/) (LIVE DEMO)

<https://img-compress.pages.dev/>

Image-compressor is a fast, privacy-first image compressor that uses WebAssembly (wasm) to give near native compression speeds all in your browser. By using local client side processing, it bypasses traditional upload limits and data privacy concerns while giving you a highly customizable toolkit (img resizing, color reduction, lossless options, batch file renaming, etc).

Website design inspired by [Gleam](https://gleam.run)

## Image Queue

Unlimited image compression queue and can support processing 10+ images all at the same time concurrently

<p align="center"><img src="https://wsrv.nl/?url=raw.githubusercontent.com/Sethispr/image-compressor/main/assets/IMG_7505.jpeg" alt="img-compress web preview" height="500"></p>

## Image Comparison

Mobile friendly image comparison side by side with original and compressed image to check quality changes

<p align="center"><img src="https://wsrv.nl/?url=raw.githubusercontent.com/Sethispr/image-compressor/main/assets/IMG_7517.jpeg" alt="img-compress web preview" height="635"></p>

---

### Prerequisites

This project requires **Node.js** to manage dependencies and run the development server.

1. **Download:** Visit [nodejs.org](https://nodejs.org/) and download the "LTS" version (Recommended for most users).
2. **Install:** Run the installer and follow the setup steps for your OS.
3. **Verify:** Open your terminal or command prompt and type: `node -v`

*If a version number (v20.x.x etc) appears, you’re good to go!*

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

More info on contributing is available [here](https://github.com/Sethispr/image-compressor?tab=contributing-ov-file)

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
