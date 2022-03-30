# objverify

### Verification vs Checks

Definitions:
- A verification function returns a boolean true or throws an Error
- A check function returns a boolean true or false

the objectcheck.js file will be added eventually

This object verifier takes a schema and the data you are checking against and verifies that your structure satisfies the given schema 

This is primarly used for JSON data because imported JSON data from a file cannot have functions attached. Objects at runtime could potentially have functions attached via property or .prototype which could cause problems, however good design can mitigate that from happening. Making sure you differentiate between objects that are truly data structure (no methods/functions), and objects that are objects (have methods)
