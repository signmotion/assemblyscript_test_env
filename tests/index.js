import { createRequire } from "module";
import asc from "../dist/asc.js";
import loader from "../lib/loader/index.js";

const args = process.argv.slice(2);

/** @type {Uint8Array} */
let binary;

const { error, stderr } = await asc.main(
  [
    "assembly/index.ts",
    "--outFile",
    "output.wasm",
    "--exportStart",
    "_start",
    ...args,
  ],
  {
    writeFile(name, contents) {
      console.log(
        `writeFile()\n\t${process.cwd()}\n\t'${name}'\n\t${contents}`
      );
      if (name === "output.wasm") {
        binary = contents;
      } else if (name !== "output.wasm.map") {
        throw Error("Unexpected output file: " + name);
      }
    },
  }
);

if (error) {
  console.error(error);
  console.error(stderr.toString());

  process.exit(1);
}

if (!binary) {
  console.error(`No binary was generated for the test in ${process.cwd()}.`);

  process.exit(1);
}

const module = loader.instantiateSync(binary);

try {
  console.log("About exported module:", module);
  module.exports._start();
} catch (err) {
  console.error("The WASM module _start() function failed in " + process.cwd());
  console.error(err);

  process.exit(1);
}
