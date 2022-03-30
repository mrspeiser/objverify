# objverify

### Verification vs Checks

Definitions:
- A verification function returns a boolean true or throws an Error
- A check function returns a boolean true or false

the objectcheck.js file will be added eventually

This object verifier takes a schema and the data you are checking against and verifies that your structure satisfies the given schema 

This is primarly used for JSON data because imported JSON data from a file cannot have functions attached. Objects at runtime could potentially have functions attached via property or .prototype that conflicts with a key you have as an "object" which could cause problems, however good design can mitigate that from happening. 

Making sure you differentiate between objects that are truly data structure (usually the builtin Object type, with no methods/functions), and objects that are instanited functions, or builtin Objects with functions as values to keys (have methods).

e.g. 
```
function foo(){
  this.foo = "foo"
}

var bar = {
  foo:'bar'
  bar:'baz'
}

var baz = {
  foo:'bar'
  bar:new x()
}

var x = new foo()

typeof(foo) // 'function'
typeof(bar) // 'object'
typeof(baz.bar) // 'object'

```
It's important to seperate your buitin Function types being used like classes (with methods) and builtin Object types because their type becomes an object when instantiated.

