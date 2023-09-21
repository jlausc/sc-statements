import Rijndael from "./rijndael";

// encrypt handler
export function onEncrypt(plaintext: string, password: string) {
  let result = "";
  try {
    result = encryptData(plaintext, password);
  } catch (e) {
    alert(e);
  }

  return result;
}

// decrypt handler
export function onDecrypt(ciphertext: string, password: string) {
  let result: any[] | string | undefined;
  try {
    try {
      const cipher = decryptData(ciphertext, password);
      result = cipher;
    } catch (x) {
      throw x;
    }
  } catch (e) {
    throw e;
  }

  return result;
}

// trim string
function trimString(s: string) {
  return s.replace(/^\s+/, "").replace(/\s+$/, "");
}

// encrypt data using given password
function encryptData(data: string, password: string) {
  // trim input data and password
  data = trimString(data);
  password = trimString(password);
  return Rijndael.encryptString(data, password);
}

// decript data using password
function decryptData(sdata: string, password: string) {
  // trim input data
  sdata = trimString(sdata);
  password = trimString(password);
  return Rijndael.decryptString(sdata, password);
}
