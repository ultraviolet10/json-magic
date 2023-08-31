import { SimpleJsonTreeNode } from "@/types/common";

const regexWebUrl = new RegExp(
  "^" +
    // protocol identifier (optional)
    // short syntax // still required
    "(?:(?:(?:https?|ftp|ipfs):)?\\/\\/)" +
    // user:pass BasicAuth (optional)
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
    // IP address exclusion
    // private & local networks
    "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
    "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
    "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broadcast addresses
    // (first & last IP address of each class)
    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
    // host & domain names, may end with dot
    // can be replaced by a shortest alternative
    // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
    "(?:" +
    "(?:" +
    "[a-z0-9\\u00a1-\\uffff]" +
    "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
    ")?" +
    "[a-z0-9\\u00a1-\\uffff]\\." +
    ")+" +
    // TLD identifier name, may end with dot
    "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
    ")" +
    // port number (optional)
    "(?::\\d{2,5})?" +
    // resource path (optional)
    "(?:[/?#]\\S*)?" +
    "$",
  "i"
);

const emailRegex = new RegExp(
  "^" + /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
);

export const isUrl = (str: string) => {
  return !!str.match(regexWebUrl);
};

export const isEmail = (str: string) => {
  return emailRegex.test(str);
};

export const isNumber = (value: any) => {
  return typeof value === "number";
};

export const extractFromJSON = (
  json: any,
  extractor: (value: any) => boolean
) => {
  let results: any[] = [];
  const traverse = (obj: any) => {
    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        traverse(obj[key]);
      } else {
        if (extractor(obj[key])) results.push(obj[key]);
      }
    }
  };
  traverse(json);
  return results;
};

const flattenJSON = (json: any): { [key: string]: any } => {
  let result: { [key: string]: any } = {};

  const recurse = (curr: any, prop: string = "") => {
    if (Object(curr) !== curr) {
      result[prop] = curr;
    } else if (Array.isArray(curr)) {
      const length = curr.length;
      for (let i = 0; i < length; i++) {
        recurse(curr[i], prop + "[" + i + "]");
      }
      if (length === 0) result[prop] = [];
    } else {
      let isEmpty = true;
      for (let p in curr) {
        isEmpty = false;
        recurse(curr[p], prop ? prop + "." + p : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  };
  recurse(json);
  return result;
};

export const generateJSONSchema = (data: any): any => {
  if (data === null) {
    return { type: "null" };
  }

  switch (typeof data) {
    case "number":
      return { type: "number" };
    case "string":
      return { type: "string" };
    case "boolean":
      return { type: "boolean" };
    case "object":
      if (Array.isArray(data)) {
        const items = data.length ? generateJSONSchema(data[0]) : {};
        return { type: "array", items };
      } else {
        const properties: { [key: string]: any } = {};
        for (const key in data) {
          properties[key] = generateJSONSchema(data[key]);
        }
        return { type: "object", properties };
      }
    default:
      return {};
  }
};

export function generateSimpleJsonTree(
  data: any,
  key?: string | number
): SimpleJsonTreeNode {
  let node: SimpleJsonTreeNode = {};

  if (Array.isArray(data)) {
    node.children = data.map((item, index) =>
      generateSimpleJsonTree(item, index)
    );
  } else if (data && typeof data === "object") {
    node.children = Object.entries(data).map(([k, v]) =>
      generateSimpleJsonTree(v, k)
    );
  } else {
    node.value = data;
  }

  if (key !== undefined) {
    node.key = key;
  }

  return node;
}
