import { someArrayString } from "../_/common";

// good
for (let i = 0; i < someArrayString.length; i++) {
  // Explicitly count if the index is needed, otherwise use the for/of form.
  const x = someArrayString[i];
  // ...
}

/* ?
for (const x of someArrayString) {
  // x is a value of `someArrayString`
}
*/

/* ?
for (const [i, s] of someArrayString.entries()) {
  // ...
}
*/

// TODO forEach() example
