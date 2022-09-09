Object.prototype.objCustom = function () {};
Array.prototype.arrCustom = function () {};

const iterable = [3, 5, 7];
iterable.foo = "hello";

for (const i in iterable) {
  // logs "0", "1", "2", "foo", "arrCust  om", "objCustom"
  console.log(i);
}

for (const i in iterable) {
  if (Object.hasOwn(iterable, i)) {
    // logs "0", "1", "2", "foo"
    console.log(i);
  }
}

for (const i of iterable) {
  // logs 3, 5, 7
  console.log(i);
}
