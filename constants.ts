import {OptimizerConfiguration} from './types';

export const APP_NAME = 'BLAIRPNG_MODERN';

/**
 * THE WORKER CODE
 *
 * We store the Web Worker code as a string here.
 * Why? To make this app "portable" and offline-friendly without needing a complex
 * build step that compiles a separate worker.js file.
 *
 * This code runs on a separate CPU thread, ensuring the UI never freezes
 * while compressing heavy images.
 */
export const WORKER_CODE = `
// We import libraries directly from a CDN (esm.sh).
// Inside a worker, we use standard ES modules.
import Pica from 'https://esm.sh/pica@9.0.1'; // High-quality image resizing
import * as iq from 'https://esm.sh/image-q@4.0.0'; // Color palette generation

let picaInstance = null;

// --- Safety Limits ---
// We set hard limits to prevent the browser from crashing.
// Updated to 2gb limit per file.
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 30MB
const MAX_DIMENSION = 16384; // 16k resolution

/**
 * Main Worker Entry Point
 * This listens for messages sent from the main React app.
 */
self.onmessage = async (event) => {
    // 1. Zero Trust: Immediately freeze the input data.
    // This prevents accidental modification of the configuration object
    // as it passes through our logic.
    const inputData = Object.freeze(event.data);
    const { buffer, fileType, config } = inputData;
    
    // Freeze nested objects for extra safety.
    if (config && typeof config === 'object') {
        Object.freeze(config);
        if (config.resize) Object.freeze(config.resize);
        if (config.palette) Object.freeze(config.palette);
        // ... freeze other config sections ...
    }

    const startTime = performance.now();

    try {
        // 2. Safety Check: Reject files that are too big before we even try to parse them.
        if (buffer.byteLength > MAX_FILE_SIZE) {
            throw new Error(\`File too large (\${(buffer.byteLength / 1024 / 1024).toFixed(1)}MB). Max limit is 30MB to protect browser stability.\`);
        }

        // Detect what we are doing
        const isPngInput = fileType === 'image/png';
        
        // Output format checks
        const isWebPOutput = config.outputFormat === 'webp';
        const isJpegOutput = config.outputFormat === 'jpeg';
        const isAvifOutput = config.outputFormat === 'avif';
        const isQoiOutput = config.outputFormat === 'qoi';
        const isJxlOutput = config.outputFormat === 'jxl';
        
        // --- PATH A: THE FAST PATH (Pass-through) ---
        // If the user wants to optimize a PNG, and isn't resizing or changing colors,
        // we can skip the heavy "Decode -> Draw -> Encode" cycle.
        // We just pass the raw bytes directly to OxiPNG. This is super fast.
        
        const noResize = config.resize.mode === 'off';
        const noPalette = !config.palette.enabled;
        const isSimplePngJob = isPngInput && !isWebPOutput && !isJpegOutput && !isAvifOutput && !isQoiOutput && !isJxlOutput;

        if (isSimplePngJob && noResize && noPalette) {
            try {
                // Load the OxiPNG WASM module
                const { optimise } = await import('https://esm.sh/@jsquash/oxipng@2.3.0');
                
                const oxiOptions = {
                    level: config.level,
                    interlace: config.interlace,
                    optimiseAlpha: true, // Always clean up transparent pixels
                    strip: config.stripMetadata ? 'all' : 'safe'
                };

                const result = await optimise(buffer, oxiOptions);
                const endTime = performance.now();

                // Send result back to React
                self.postMessage({ 
                    type: 'SUCCESS', 
                    buffer: result, 
                    time: (endTime - startTime)
                }, [result]); // Transferable object (saves memory copy)
                return;
            } catch (fastPathError) {
                // If the fast path fails (rare), we just fall through to the full pipeline below.
            }
        }

        // --- PATH B: THE FULL PIPELINE ---
        // 1. Decode the image (JPEG/PNG/etc) into raw pixels (Bitmap).
        // 2. Draw it onto an OffscreenCanvas (like a hidden scratchpad).
        // 3. Resize or manipulate pixels.
        // 4. Re-encode into the desired format.
        
        const blob = new Blob([buffer], { type: fileType });
        
        // createImageBitmap is the fastest browser-native way to decode an image
        const bitmap = await createImageBitmap(blob, {
            premultiplyAlpha: config.premultiplyAlpha ? 'premultiply' : 'none',
            colorSpaceConversion: 'default'
        });

        // Safety: Check dimensions after decoding
        if (bitmap.width > MAX_DIMENSION || bitmap.height > MAX_DIMENSION) {
            bitmap.close(); // Important: Free memory immediately
            throw new Error(\`Image dimensions too large (\${bitmap.width}x\${bitmap.height}). Max allowed is \${MAX_DIMENSION}px.\`);
        }

        // Calculate new size
        let targetWidth = bitmap.width;
        let targetHeight = bitmap.height;

        if (config.resize.mode === 'scale') {
            const scaleFactor = config.resize.scale / 100;
            targetWidth = Math.round(bitmap.width * scaleFactor);
            targetHeight = Math.round(bitmap.height * scaleFactor);
        } else if (config.resize.mode === 'dimensions') {
            if (config.resize.width && config.resize.height && !config.resize.maintainAspect) {
                targetWidth = config.resize.width;
                targetHeight = config.resize.height;
            } else if (config.resize.width) {
                targetWidth = config.resize.width;
                if (config.resize.maintainAspect) {
                    targetHeight = Math.round(bitmap.height * (config.resize.width / bitmap.width));
                }
            } else if (config.resize.height) {
                targetHeight = config.resize.height;
                if (config.resize.maintainAspect) {
                    targetWidth = Math.round(bitmap.width * (config.resize.height / bitmap.height));
                }
            }
        }

        // Ensure we don't end up with a 0px image
        targetWidth = Math.max(1, targetWidth);
        targetHeight = Math.max(1, targetHeight);

        // Prepare the Canvas
        const offscreenCanvas = new OffscreenCanvas(targetWidth, targetHeight);
        let hasResized = false;

        // High Quality Resize (Pica)
        // If we need to resize and use a fancy filter (like Lanczos3), we use Pica.
        if (config.resize.mode !== 'off' && config.resize.method !== 'box') {
             if (!picaInstance) picaInstance = new Pica();
             try {
                await picaInstance.resize(bitmap, offscreenCanvas, {
                    quality: 3, 
                    filter: config.resize.method,
                    alpha: true
                });
                hasResized = true;
             } catch (e) {}
        }

        // Standard Draw (Fallback or No Resize)
        if (!hasResized) {
            const ctx = offscreenCanvas.getContext('2d');
            ctx.imageSmoothingEnabled = config.resize.mode !== 'off' && config.resize.method !== 'box';
            if (ctx.imageSmoothingEnabled) ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
        }

        // We are done with the original source bitmap, release it.
        bitmap.close(); 

        // Color Palette Reduction (Quantization)
        // This manipulates the raw pixels on the canvas before we save the file.
        if (config.palette.enabled) {
            try {
                const ctx = offscreenCanvas.getContext('2d');
                const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
                const pointContainer = iq.utils.PointContainer.fromUint8Array(imageData.data, targetWidth, targetHeight);
                
                // Analyze colors
                const palette = new iq.palette.NeuQuant(new iq.distance.Euclidean(), config.palette.colors).quantizeSync(pointContainer);
                
                // Map pixels to closest palette color (with optional dithering noise)
                const imageQuantizer = config.palette.dither > 0
                    ? new iq.image.ErrorDiffusionArray(new iq.distance.Euclidean(), iq.image.ErrorDiffusionArrayKernel.FloydSteinberg, true, 0)
                    : new iq.image.NearestColor(new iq.distance.Euclidean());
                
                const outContainer = imageQuantizer.quantizeSync(pointContainer, palette);
                const uint8Array = outContainer.toUint8Array();
                
                // Put the modified pixels back
                ctx.putImageData(new ImageData(new Uint8ClampedArray(uint8Array.buffer), targetWidth, targetHeight), 0, 0);
            } catch (e) {}
        } 
        
        // --- ENCODING ---
        // Convert the Canvas pixels into the final file format.
        
        let resultBuffer;

        if (isWebPOutput) {
            const { encode: encodeWebP } = await import('https://esm.sh/@jsquash/webp@1.2.0');
            const ctx = offscreenCanvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
            
            // WebP Configuration
            // 'method' must be 0-6 for libwebp. Higher values crash it.
            // 'near_lossless' is the correct key for C-struct options (not nearLossless).
            const webpOptions = {
                quality: config.webp.quality,
                method: Math.min(config.webp.effort, 6), // Validate range (0-6)
                lossless: config.webp.lossless ? 1 : 0,
                near_lossless: config.webp.lossless ? config.webp.nearLossless : 100,
                exact: 0 // Allow discarding invisible alpha data for better compression
            };

            resultBuffer = await encodeWebP(imageData, webpOptions);
        } else if (isJpegOutput) {
            const { encode: encodeJpeg } = await import('https://esm.sh/@jsquash/jpeg@1.2.0');
            const ctx = offscreenCanvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);

            resultBuffer = await encodeJpeg(imageData, {
                quality: config.jpeg.quality,
            });
        } else if (isAvifOutput) {
            const { encode: encodeAvif } = await import('https://esm.sh/@jsquash/avif@1.2.0');
            const ctx = offscreenCanvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
            
            // Map 0-100 quality to AVIF's QP (0-63)
            let cqLevel = Math.round(63 - (config.avif.quality * 0.63));
            const speedMap = [10, 8, 6, 5, 4, 2, 0];
            const speed = speedMap[Math.min(6, Math.max(0, config.avif.effort))];

            if (config.avif.lossless) {
                resultBuffer = await encodeAvif(imageData, { 
                    lossless: true,
                    speed: speed 
                });
            } else {
                resultBuffer = await encodeAvif(imageData, {
                    cqLevel: cqLevel,
                    speed: speed,
                    subsample: 1 
                });
            }
        } else if (isQoiOutput) {
            // QOI is a very simple, fast, lossless format.
            const { encode: encodeQoi } = await import('https://esm.sh/@jsquash/qoi@latest');
            const ctx = offscreenCanvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
            
            resultBuffer = await encodeQoi(imageData);
        } else if (isJxlOutput) {
            // JPEG XL is next-gen. 
            const { encode: encodeJxl } = await import('https://esm.sh/@jsquash/jxl@1.2.0');
            const ctx = offscreenCanvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);

            const options = {
                lossless: config.jxl.lossless,
                quality: config.jxl.quality,
                effort: config.jxl.effort
            };

            resultBuffer = await encodeJxl(imageData, options);
        } else {
            // Final Fallback: PNG (via OxiPNG)
            // We convert the canvas to a basic PNG blob, then run OxiPNG on it to squeeze it tight.
            const { optimise } = await import('https://esm.sh/@jsquash/oxipng@2.3.0');
            const resizedBlob = await offscreenCanvas.convertToBlob({ type: 'image/png' });
            const intermediateBuffer = await resizedBlob.arrayBuffer();

            try {
                resultBuffer = await optimise(intermediateBuffer, {
                    level: config.level,
                    interlace: config.interlace,
                    optimiseAlpha: true,
                    strip: config.stripMetadata ? 'all' : 'safe'
                });
            } catch (e) {
                // If optimization fails, just return the basic PNG
                resultBuffer = intermediateBuffer;
            }
        }

        const endTime = performance.now();
        self.postMessage({ 
            type: 'SUCCESS', 
            buffer: resultBuffer, 
            time: (endTime - startTime)
        }, [resultBuffer]);

    } catch (criticalError) {
        self.postMessage({ 
            type: 'ERROR', 
            message: criticalError.message 
        });
    }
};
`;

/**
 * Default State
 * This serves as the "Reset to Factory Settings" configuration.
 */
export const DEFAULT_SETTINGS: OptimizerConfiguration = {
  outputFormat: 'png',
  maintainOriginalFormat: true, // Default to Auto Compress Mode
  level: 2,
  interlace: false,
  webp: {
    quality: 75,
    lossless: false,
    effort: 4,
    nearLossless: 100,
  },
  jpeg: {
    quality: 75,
  },
  avif: {
    quality: 60,
    lossless: false,
    effort: 2,
  },
  jxl: {
    quality: 75,
    lossless: false,
    effort: 7,
  },
  autoDownload: false,
  concurrency: 5,
  theme: 'light',
  resize: {
    mode: 'off',
    method: 'lanczos3',
    scale: 100,
    width: null,
    height: null,
    maintainAspect: true,
    fitMethod: 'cover',
  },
  palette: {
    enabled: false,
    colors: 256,
    dither: 1.0,
  },
  renaming: {
    pattern: '{o}',
    startSequence: 1,
  },
  linearRGB: true,
  premultiplyAlpha: true,
  stripMetadata: true,
  disableStorage: false,
};
