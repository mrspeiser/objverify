
const getDefaultType = value => typeof(value);
const hasDollar = s => s[0] === "$";
const sameLength = a => b => a.length === b.length;
const isFloat = (schema,v) => Number(v) === v && v % 1 !== 0;
const valuesIn = (verification) => (charList) => (value) => {
  return charList.reduce((total,chr) => verification(value)(chr) ? total+=1 : total ,0);
};
const indexFrom = (string) => (value) => (string.split("").indexOf(value) >= 0);
const charsIn = valuesIn(indexFrom)

const verifyIsNotNull = (schema,value) => {
  if(value !== null){
    return true;
  }
  throw new Error(`value in schema ${schema} cannot be null`); 
}

const verifyIsNull = (schema,value) => {
  if(value === null){
    return true
  }
  throw new Error(`value in schema ${schema} is not null`); 
}

const verifyIsFloat = (schema,v) => { 
  if(Number(v) === v && v % 1 !== 0){ 
    return true
  }
  throw new Error(`value ${v} is not a float`);
}

const isType = (types,value) => { 
  if(types.indexOf(value) === -1){ 
    throw new Error(`${value} is not in types ${types}`);
  }
  return true;
}

const hasAll = (rkeys, obj) => {
  for(var i=0; i<rkeys.length; i++){
    if(!obj.hasOwnProperty(rkeys[i])){
      throw new Error(`did not provide required key: ${rkeys[i]} for structure: ${Object.keys(obj)}`);
    }
  }
}

const AnyNotListed = (pkeys, obj) => {
  for(var k in obj){
    if(pkeys.indexOf(k) === -1){
      throw new Error(`key ${k} is not a possible key on object ${Object.keys(obj)}`);
    }
  }
}

const getType = (value) => {
  let type = getDefaultType(value)
  if(type === "object"){
    if(Array.isArray(value)){
      return "array"
    }
    if(value === null){
      return "null"
    }
    return "object"
  }

  if(type === "number"){
    if(isFloat(value)){
      return "float"
    }
    return "number"
  }
  return type
}

const verifyAcceptableType = (schema, type) => {
  if(schema.hasOwnProperty('_type')){
    isType(schema['_type'],type);
  }
}

const verifyRequiredKeys = (schema, struct) => {
  if(schema['_requiredKeys']){
    hasAll(schema['_requiredKeys'], struct)
  }
}

const verifyPossibleKeys = (schema, struct) => {
  if(schema['possibleKeys']){
    AnyNotListed(schema['possibleKeys'], struct)
  }
}

const verifyMaxKeys = (schema, struct) => {
  if(schema['maxKeys']){
    if(Object.keys(struct).length > Number(schema['maxKeys'])){
      throw new Error(`object: ${Object.keys(struct)} is greater than ${schema['maxKeys']}`);
    }
  }
}

const verifyAboveMinLength = (schema, struct) => {
  if(schema['minLength']){
    if(Number(schema['minLength']) > struct.length){
      throw new Error(`${struct} is below min length ${schema['minLength']}`);
    }
  }
}

const verifyBelowMaxLength = (schema, struct) => {
  if(schema['maxLength']){
    if(Number(schema['maxLength']) < struct.length){
      throw new Error(`${struct} is above max length ${schema['maxLength']}`);
    }
  }
}

const verifyLength = (schema, struct) => {
  if(schema['length']){
    if(Number(schema['length']) !== struct.length){
      throw new Error(`${struct} does not equal length ${schema['length']}`);
    }
  }
}

const verifyIsPossible = (schema, struct) => {
  if(schema['possible']){
    if(schema['possible'].indexOf(struct) === -1){
      throw new Error(`value ${struct} is not a possible key on object ${schema['possible']}`);
    }
  }
}

const verifyAboveMin = (schema, struct) => {
  if(schema['min']){
    if(Number(schema['min']) > struct){
      throw new Error(`${struct} is above below min length ${schema['min']}`);
    }
  }
}

const verifyBelowMax = (schema, struct) => {
  if(schema['max']){
    if(Number(schema['max']) < struct){
      throw new Error(`${struct} is above max length ${schema['max']}`);
    }
  }
}

const verifyEquals = (schema, struct) => {
  if(schema['equals']){
    if(Number(schema['equals']) !== struct){
      throw new Error(`${struct} does not equal ${schema['equal']}`);
    }
  }
}

const verifyHasCharacters = (schema, struct) => {
  if(schema['characters']){

  }
}

const verifyHasMinSpecial = (schema, struct) => {
  if(schema.hasOwnProperty('minSpecialCharacters') && 
     schema.hasOwnProperty('special') &&
     Array.isArray(schema['special']) &&
     schema['special'].length > 0){

    let numSpecialChars = charsIn(schema['special'])(struct);

    if(Number(schema['minSpecialCharacters']) > numSpecialChars){
      throw new VerificationError(`${struct} does not contain minimum special characters ${schema.minSpecialCharacters}`);
    }
  }
}

const verifyHasMinDifferentSpecial = (schema, struct) => {
  if(schema['minDiffSpecialCharacters']){

  }
}

function verifyObject(schema, object){
  verifyAcceptableType(schema, "object");
  verifyIsNotNull(schema, object);
  verifyRequiredKeys(schema, object);
  verifyPossibleKeys(schema, object);
  verifyMaxKeys(schema, object);
  for(var k in object){
    verifyType(schema[k], object[k]);
  }
}

function verifyArray(schema, array){
  verifyAcceptableType(schema, "array");
  verifyBelowMaxLength(schema, array);
  verifyAboveMinLength(schema, array);
  for(let i=0; i<array.length; i++){
    let item = array[i];
    let name = schema['typeName'];
    verifyType(schema[name], item);
  }
}

function verifyString(schema, string){
  verifyAcceptableType(schema, "string");
  verifyBelowMaxLength(schema, string);
  verifyAboveMinLength(schema, string);
  verifyIsPossible(schema, string);
  verifyHasMinSpecial(schema, string);
  verifyHasMinDifferentSpecial(schema, string);
}

function verifyNumber(schema, number){
  verifyAcceptableType(schema, "number");
  verifyBelowMax(schema, number);
  verifyAboveMin(schema, number);
  verifyIsPossible(schema, number);
}

function verifyFloat(schema, float){
  verifyAcceptableType(schema, "float");
  verifyBelowMax(schema, number);
  verifyAboveMin(schema, number);
  verifyIsPossible(schema, number);
}

function verifyBoolean(schema, bool){
  verifyAcceptableType(schema, "boolean");
  verifyIsPossible(schema, number);
}

function verifyNull(schema, Null){
  verifyAcceptableType(schema, "null");
  verifyIsNull(schema, Null);
}

function verifyType(schema, value){
  console.log(value)
  let Type = getType(value);
  switch(Type){
    case "object":
      verifyObject(schema, value);
      break;
    case "array":
      verifyArray(schema, value);
      break;
    case "string":
      verifyString(schema,value);
      break;
    case "number":
      verifyNumber(schema,value);
      break;
    case "float":
      verifyFloat(schema,value);
      break;
    case "boolean":
      verifyBoolean(schema,value);
      break;
    case "null":
      verifyNull(schema,value);
      break;
    default:
      throw new Error(`cannot resolve type: ${Type}`);
  }
  return true;
}

module.exports = verifyType
