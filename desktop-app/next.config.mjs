/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tauri bundles a folder of static files — no Node server ships inside the app.
  output: "export",
  distDir: "out",
  images: {
    // next/image's optimizer needs a server; static export can't run one.
    unoptimized: true,
  },
};

export default nextConfig;
