import asc from "../dist/asc.js";
import chalk from "chalk";
import loader from "../lib/loader/index.js";

const tests = [
  "external_values",
  "language_rules/iterating_containers.good",
  "language_rules/class_members/parameter_properties.bad",
  "language_rules/class_members/parameter_properties.good",
];

const args = process.argv.slice(2);

let countPassed = 0;
let countFailed = 0;

const outFile = "output.wasm";
for (const testName of tests) {
  /** @type {Uint8Array} */
  let binary;

  const filenameWithExt = `${testName}.ts`;
  const { error, stderr } = await asc.main(
    [
      `assembly/${filenameWithExt}`,
      "--outFile",
      outFile,
      "--exportStart",
      "_start",
      ...args,
    ],
    {
      writeFile(name, contents) {
        //console.log(`${process.cwd()}\\${filenameWithExt}' -> '${name}'`);
        if (name === outFile) {
          binary = contents;
        } else if (name !== `${outFile}.map`) {
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

    process.exit(2);
  }

  const m = loader.instantiateSync(binary);
  try {
    //console.log("About exported module:", m);
    console.log(`\nTesting '${chalk.blue(testName)}'...`);

    m.exports._start();

    ++countPassed;
    console.log(chalk.green("Passed"));
  } catch (err) {
    ++countFailed;
    console.error(chalk.red("Failed\n"), err);
    // will continue
  }
} // for testName

if (countPassed > 0) {
  console.log(
    chalk.green(
      countPassed === tests.length
        ? "\nPassed all tests."
        : `\nPassed ${countPassed} / ${tests.length} test(s).`
    )
  );
}
if (countFailed > 0) {
  console.log(chalk.red(`\nFailed ${countFailed} test(s).`));
}
