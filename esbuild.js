import { build } from "esbuild"
import { shellJsPlugin } from "esbuild-plugin-shelljs";

console.log("Bundling dist/index.cjs")

build({
    // minify: true,
    entryPoints: ["cli/index.ts"],
    platform: "node",
    target: "node18",
    bundle: true,
    outfile: "dist/index.cjs",
    sourcemap: false,
    alias: {
        "@": ".",
    },
    plugins: [shellJsPlugin],
})
    .then(() => console.log("Bundled dist/index.cjs"))
    .catch((err) => console.error("Error: " + err.message))