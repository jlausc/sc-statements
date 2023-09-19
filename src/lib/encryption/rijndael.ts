/*
 Crypto utilities
 (c) 2009 iOpus Software GmbH - http://www.iopus.com


 Original copyright (c) 2001 Fritz Schneider
 
 This software is provided as-is, without express or implied warranty.  
 Permission to use, copy, modify, distribute or sell this software, with or
 without fee, for any purpose and by any individual or organization, is hereby
 granted, provided that the above copyright notice and this paragraph appear 
 in all copies. Distribution as a part of an application or binary must
 include the above copyright notice in the documentation and/or other materials
 provided with the application or distribution.


   As the above disclaimer notes, you are free to use this code however you
   want. However, I would request that you send me an email 
   (fritz /at/ cs /dot/ ucsd /dot/ edu) to say hi if you find this code useful
   or instructional. Seeing that people are using the code acts as 
   encouragement for me to continue development. If you *really* want to thank
   me you can buy the book I wrote with Thomas Powell, _JavaScript:
   _The_Complete_Reference_ :)

   This code is an UNOPTIMIZED REFERENCE implementation of Rijndael. 
   If there is sufficient interest I can write an optimized (word-based, 
   table-driven) version, although you might want to consider using a 
   compiled language if speed is critical to your application. As it stands,
   one run of the monte carlo test (10,000 encryptions) can take up to 
   several minutes, depending upon your processor. You shouldn't expect more
   than a few kilobytes per second in throughput.

   Also note that there is very little error checking in these functions. 
   Doing proper error checking is always a good idea, but the ideal 
   implementation (using the instanceof operator and exceptions) requires
   IE5+/NS6+, and I've chosen to implement this code so that it is compatible
   with IE4/NS4. 

   And finally, because JavaScript doesn't have an explicit byte/char data 
   type (although JavaScript 2.0 most likely will), when I refer to "byte" 
   in this code I generally mean "32 bit integer with value in the interval 
   [0,255]" which I treat as a byte.

   See http://www-cse.ucsd.edu/~fritz/rijndael.html for more documentation
   of the (very simple) API provided by this code.

                                               Fritz Schneider
                                               fritz at cs.ucsd.edu
 
*/

var Rijndael = (function () {
  // Rijndael parameters --  Valid values are 128, 192, or 256

  var keySizeInBits = 256;
  var blockSizeInBits = 256;

  // Note: in the following code the two dimensional arrays are indexed as
  //       you would probably expect, as array[row][column]. The state arrays
  //       are 2d arrays of the form state[4][Nb].

  // The number of rounds for the cipher, indexed by [Nk][Nb]
  var roundsArray = [
    ,
    ,
    ,
    ,
    [, , , , 10, , 12, , 14],
    ,
    [, , , , 12, , 12, , 14],
    ,
    [, , , , 14, , 14, , 14],
  ];

  // The number of bytes to shift by in shiftRow, indexed by [Nb][row]
  var shiftOffsets = [, , , , [, 1, 2, 3], , [, 1, 2, 3], , [, 1, 3, 4]];

  // The round constants used in subkey expansion
  var Rcon = [
    0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8,
    0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4,
    0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91,
  ];

  // Precomputed lookup table for the SBox
  var SBox = [
    99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118,
    202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114,
    192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49,
    21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9,
    131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209,
    0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170,
    251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143,
    146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236,
    95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34,
    42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6,
    36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213,
    78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166,
    180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3,
    246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217,
    142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230,
    66, 104, 65, 153, 45, 15, 176, 84, 187, 22,
  ];

  // Precomputed lookup table for the inverse SBox
  var SBoxInverse = [
    82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251,
    124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203,
    84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78, 8,
    46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114,
    248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146, 108,
    112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132, 144,
    216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6, 208, 44,
    30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58, 145, 17, 65,
    79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115, 150, 172, 116,
    34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223, 110, 71, 241, 26,
    113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190, 27, 252, 86, 62, 75,
    198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90, 244, 31, 221, 168, 51,
    136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95, 96, 81, 127, 169, 25,
    181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239, 160, 224, 59, 77, 174,
    42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97, 23, 43, 4, 126, 186, 119,
    214, 38, 225, 105, 20, 99, 85, 33, 12, 125,
  ];

  var SBoxInverse1 = [
    254, 58, 12, 203, 236, 12, 6, 145, 248, 120, 116, 200, 233, 105, 92, 102, 5,
    255, 30, 243, 104, 63, 61, 137, 85, 39, 118, 182, 179, 124, 27, 19, 19, 107,
    28, 179, 6, 54, 249, 102, 90, 73, 23, 221, 173, 247, 249, 134, 51, 49, 65,
    116, 79, 147, 184, 207, 136, 164, 21, 213, 68, 217, 228, 234, 195, 234, 24,
    215, 245, 96, 187, 115, 62, 128, 212, 236, 136, 55, 75, 208, 166, 50, 11, 7,
    47, 204, 207, 157, 218, 11, 159, 42, 113, 245, 87, 217,
  ];

  // This method circularly shifts the array left by the number of elements
  // given in its parameter. It returns the resulting array and is used for
  // the ShiftRow step. Note that shift() and push() could be used for a more
  // elegant solution, but they require IE5.5+, so I chose to do it manually.

  function cyclicShiftLeft(theArray, positions) {
    var temp = theArray.slice(0, positions);
    theArray = theArray.slice(positions).concat(temp);
    return theArray;
  }

  // Cipher parameters ... do not change these
  var Nk = keySizeInBits / 32;
  var Nb = blockSizeInBits / 32;
  var Nr = roundsArray[Nk][Nb];

  // Multiplies the element "poly" of GF(2^8) by x. See the Rijndael spec.

  function xtime(poly) {
    poly <<= 1;
    return poly & 0x100 ? poly ^ 0x11b : poly;
  }

  // Multiplies the two elements of GF(2^8) together and returns the result.
  // See the Rijndael spec, but should be straightforward: for each power of
  // the indeterminant that has a 1 coefficient in x, add y times that power
  // to the result. x and y should be bytes representing elements of GF(2^8)

  function mult_GF256(x, y) {
    var bit,
      result = 0;

    for (bit = 1; bit < 256; bit *= 2, y = xtime(y)) {
      if (x & bit) result ^= y;
    }
    return result;
  }

  // Performs the substitution step of the cipher. State is the 2d array of
  // state information (see spec) and direction is string indicating whether
  // we are performing the forward substitution ("encrypt") or inverse
  // substitution (anything else)

  function byteSub(state, direction) {
    var S;
    if (direction == "encrypt")
      // Point S to the SBox we're using
      S = SBox;
    else S = SBoxInverse;
    for (
      var i = 0;
      i < 4;
      i++ // Substitute for every byte in state
    )
      for (var j = 0; j < Nb; j++) state[i][j] = S[state[i][j]];
  }

  // Performs the row shifting step of the cipher.

  function shiftRow(state, direction) {
    for (
      var i = 1;
      i < 4;
      i++ // Row 0 never shifts
    )
      if (direction == "encrypt")
        state[i] = cyclicShiftLeft(state[i], shiftOffsets[Nb][i]);
      else state[i] = cyclicShiftLeft(state[i], Nb - shiftOffsets[Nb][i]);
  }

  // Performs the column mixing step of the cipher. Most of these steps can
  // be combined into table lookups on 32bit values (at least for encryption)
  // to greatly increase the speed.

  function mixColumn(state, direction) {
    var b = []; // Result of matrix multiplications
    for (var j = 0; j < Nb; j++) {
      // Go through each column...
      for (var i = 0; i < 4; i++) {
        // and for each row in the column...
        if (direction == "encrypt")
          b[i] =
            mult_GF256(state[i][j], 2) ^ // perform mixing
            mult_GF256(state[(i + 1) % 4][j], 3) ^
            state[(i + 2) % 4][j] ^
            state[(i + 3) % 4][j];
        else
          b[i] =
            mult_GF256(state[i][j], 0xe) ^
            mult_GF256(state[(i + 1) % 4][j], 0xb) ^
            mult_GF256(state[(i + 2) % 4][j], 0xd) ^
            mult_GF256(state[(i + 3) % 4][j], 9);
      }
      for (
        var i = 0;
        i < 4;
        i++ // Place result back into column
      )
        state[i][j] = b[i];
    }
  }

  // Adds the current round key to the state information. Straightforward.

  function addRoundKey(state, roundKey) {
    for (var j = 0; j < Nb; j++) {
      // Step through columns...
      state[0][j] ^= roundKey[j] & 0xff; // and XOR
      state[1][j] ^= (roundKey[j] >> 8) & 0xff;
      state[2][j] ^= (roundKey[j] >> 16) & 0xff;
      state[3][j] ^= (roundKey[j] >> 24) & 0xff;
    }
  }

  // This function creates the expanded key from the input (128/192/256-bit)
  // key. The parameter key is an array of bytes holding the value of the key.
  // The returned value is an array whose elements are the 32-bit words that
  // make up the expanded key.

  function keyExpansion(key) {
    var expandedKey = new Array();
    var temp;

    // in case the key size or parameters were changed...
    Nk = keySizeInBits / 32;
    Nb = blockSizeInBits / 32;
    Nr = roundsArray[Nk][Nb];

    for (
      var j = 0;
      j < Nk;
      j++ // Fill in input key first
    )
      expandedKey[j] =
        key[4 * j] |
        (key[4 * j + 1] << 8) |
        (key[4 * j + 2] << 16) |
        (key[4 * j + 3] << 24);

    // Now walk down the rest of the array filling in expanded key bytes as
    // per Rijndael's spec
    for (j = Nk; j < Nb * (Nr + 1); j++) {
      // For each word of expanded key
      temp = expandedKey[j - 1];
      if (j % Nk == 0)
        temp =
          (SBox[(temp >> 8) & 0xff] |
            (SBox[(temp >> 16) & 0xff] << 8) |
            (SBox[(temp >> 24) & 0xff] << 16) |
            (SBox[temp & 0xff] << 24)) ^
          Rcon[Math.floor(j / Nk) - 1];
      else if (Nk > 6 && j % Nk == 4)
        temp =
          (SBox[(temp >> 24) & 0xff] << 24) |
          (SBox[(temp >> 16) & 0xff] << 16) |
          (SBox[(temp >> 8) & 0xff] << 8) |
          SBox[temp & 0xff];
      expandedKey[j] = expandedKey[j - Nk] ^ temp;
    }
    return expandedKey;
  }

  // Rijndael's round functions...

  function Round(state, roundKey) {
    byteSub(state, "encrypt");
    shiftRow(state, "encrypt");
    mixColumn(state, "encrypt");
    addRoundKey(state, roundKey);
  }

  function InverseRound(state, roundKey) {
    addRoundKey(state, roundKey);
    mixColumn(state, "decrypt");
    shiftRow(state, "decrypt");
    byteSub(state, "decrypt");
  }

  function FinalRound(state, roundKey) {
    byteSub(state, "encrypt");
    shiftRow(state, "encrypt");
    addRoundKey(state, roundKey);
  }

  function InverseFinalRound(state, roundKey) {
    addRoundKey(state, roundKey);
    shiftRow(state, "decrypt");
    byteSub(state, "decrypt");
  }

  // encrypt is the basic encryption function. It takes parameters
  // block, an array of bytes representing a plaintext block, and expandedKey,
  // an array of words representing the expanded key previously returned by
  // keyExpansion(). The ciphertext block is returned as an array of bytes.

  function encrypt(block, expandedKey) {
    var i;
    if (!block || block.length * 8 != blockSizeInBits) return;
    if (!expandedKey) return;

    block = packBytes(block);
    addRoundKey(block, expandedKey);
    for (i = 1; i < Nr; i++)
      Round(block, expandedKey.slice(Nb * i, Nb * (i + 1)));
    FinalRound(block, expandedKey.slice(Nb * Nr));
    return unpackBytes(block);
  }

  // decrypt is the basic decryption function. It takes parameters
  // block, an array of bytes representing a ciphertext block, and expandedKey,
  // an array of words representing the expanded key previously returned by
  // keyExpansion(). The decrypted block is returned as an array of bytes.

  function decrypt(block, expandedKey) {
    var i;
    if (!block || block.length * 8 != blockSizeInBits) return;
    if (!expandedKey) return;

    block = packBytes(block);
    InverseFinalRound(block, expandedKey.slice(Nb * Nr));
    for (i = Nr - 1; i > 0; i--)
      InverseRound(block, expandedKey.slice(Nb * i, Nb * (i + 1)));
    addRoundKey(block, expandedKey);
    return unpackBytes(block);
  }

  // This function packs an array of bytes into the four row form defined by
  // Rijndael. It assumes the length of the array of bytes is divisible by
  // four. Bytes are filled in according to the Rijndael spec (starting with
  // column 0, row 0 to 3). This function returns a 2d array.

  function packBytes(octets) {
    var state = new Array();
    if (!octets || octets.length % 4) return;

    state[0] = new Array();
    state[1] = new Array();
    state[2] = new Array();
    state[3] = new Array();
    for (var j = 0; j < octets.length; j += 4) {
      state[0][j / 4] = octets[j];
      state[1][j / 4] = octets[j + 1];
      state[2][j / 4] = octets[j + 2];
      state[3][j / 4] = octets[j + 3];
    }
    return state;
  }

  // This function unpacks an array of bytes from the four row format preferred
  // by Rijndael into a single 1d array of bytes. It assumes the input "packed"
  // is a packed array. Bytes are filled in according to the Rijndael spec.
  // This function returns a 1d array of bytes.

  function unpackBytes(packed) {
    var result = new Array();
    for (var j = 0; j < packed[0].length; j++) {
      result[result.length] = packed[0][j];
      result[result.length] = packed[1][j];
      result[result.length] = packed[2][j];
      result[result.length] = packed[3][j];
    }
    return result;
  }

  // This function takes a prospective plaintext (string or array of bytes)
  // and pads it with zero bytes if its length is not a multiple of the block
  // size. If plaintext is a string, it is converted to an array of bytes
  // in the process. The type checking can be made much nicer using the
  // instanceof operator, but this operator is not available until IE5.0 so I
  // chose to use the heuristic below.

  function formatPlaintext(plaintext) {
    var bpb = blockSizeInBits / 8; // bytes per block
    var i;

    // if primitive string or String instance
    if (typeof plaintext == "string" || plaintext.indexOf) {
      plaintext = plaintext.split("");
      // Unicode issues here (ignoring high byte)
      for (i = 0; i < plaintext.length; i++)
        plaintext[i] = plaintext[i].charCodeAt(0) & 0xff;
    }

    for (i = bpb - (plaintext.length % bpb); i > 0 && i < bpb; i--)
      plaintext[plaintext.length] = 0;

    return plaintext;
  }

  // Returns an array containing "howMany" random bytes.

  function getRandomBytes(howMany) {
    var i;
    var bytes = new Array();
    for (i = 0; i < howMany; i++) bytes[i] = Math.round(Math.random() * 255);
    return bytes;
  }

  var retobj = {
    // This function takes an array of bytes (byteArray) and converts them
    // to a hexadecimal string. Array element 0 is found at the beginning of
    // the resulting string, high nibble first. Consecutive elements follow
    // similarly, for example [16, 255] --> "10ff". The function returns a
    // string.

    byteArrayToHex: function (byteArray) {
      var result = "";
      if (!byteArray) return;
      for (var i = 0; i < byteArray.length; i++)
        result += (byteArray[i] < 16 ? "0" : "") + byteArray[i].toString(16);

      return result;
    },

    // This function converts a string containing hexadecimal digits to an
    // array of bytes. The resulting byte array is filled in the order the
    // values occur in the string, for example "10FF" --> [16, 255]. This
    // function returns an array.

    hexToByteArray: function (hexString) {
      var byteArray = [];
      if (hexString.length % 2)
        // must have even length
        return;
      if (hexString.indexOf("0x") == 0 || hexString.indexOf("0X") == 0)
        hexString = hexString.substring(2);
      for (var i = 0; i < hexString.length; i += 2)
        byteArray[Math.floor(i / 2)] = parseInt(hexString.slice(i, i + 2), 16);
      return byteArray;
    },

    byteArrayToString: function (byteArray) {
      var result = "";
      for (var i = 0; i < byteArray.length; i++)
        result += String.fromCharCode(byteArray[i]);
      return result;
    },

    stringToByteArray: function (s) {
      var result = new Array(s.length);
      for (var i = 0; i < s.length; i++) result[i] = s.charCodeAt(i);
      return result;
    },

    // rijndaelEncrypt(plaintext, key, mode)
    // Encrypts the plaintext using the given key and in the given mode.
    // The parameter "plaintext" can either be a string or an array of bytes.
    // The parameter "key" must be an array of key bytes. If you have a hex
    // string representing the key, invoke hexToByteArray() on it to convert it
    // to an array of bytes. The third parameter "mode" is a string indicating
    // the encryption mode to use, either "ECB" or "CBC". If the parameter is
    // omitted, ECB is assumed.
    //
    // An array of bytes representing the cihpertext is returned. To convert
    // this array to hex, invoke byteArrayToHex() on it. If you are using this
    // "for real" it is a good idea to change the function getRandomBytes() to
    // something that returns truly random bits.

    rijndaelEncrypt: function (plaintext, key, mode) {
      var expandedKey, i, aBlock;
      var bpb = blockSizeInBits / 8; // bytes per block
      var ct; // ciphertext

      if (!plaintext || !key) return;
      if (key.length * 8 != keySizeInBits) return;
      if (mode == "CBC") ct = getRandomBytes(bpb); // get IV
      else {
        mode = "ECB";
        ct = new Array();
      }

      // convert plaintext to byte array and pad with zeros if necessary.
      //  plaintext = formatPlaintext(plaintext);

      expandedKey = keyExpansion(key);

      for (var block = 0; block < plaintext.length / bpb; block++) {
        aBlock = plaintext.slice(block * bpb, (block + 1) * bpb);
        if (mode == "CBC")
          for (var i = 0; i < bpb; i++) aBlock[i] ^= ct[block * bpb + i];
        ct = ct.concat(encrypt(aBlock, expandedKey));
      }

      return ct;
    },

    // rijndaelDecrypt(ciphertext, key, mode)
    // Decrypts the using the given key and mode. The parameter "ciphertext"
    // must be an array of bytes. The parameter "key" must be an array of key
    // bytes. If you have a hex string representing the ciphertext or key,
    // invoke hexToByteArray() on it to convert it to an array of bytes. The
    // parameter "mode" is a string, either "CBC" or "ECB".
    //
    // An array of bytes representing the plaintext is returned. To convert
    // this array to a hex string, invoke byteArrayToHex() on it. To convert it
    // to a string of characters, you can use byteArrayToString().

    rijndaelDecrypt: function (ciphertext, key, mode) {
      var expandedKey;
      var bpb = blockSizeInBits / 8; // bytes per block
      var pt = new Array(); // plaintext array
      var aBlock; // a decrypted block
      var block; // current block number

      if (!ciphertext || !key || typeof ciphertext == "string") return;
      if (key.length * 8 != keySizeInBits) return;
      if (!mode) mode = "ECB"; // assume ECB if mode omitted
      expandedKey = keyExpansion(key);

      // work backwards to accomodate CBC mode
      for (block = ciphertext.length / bpb - 1; block > 0; block--) {
        aBlock = decrypt(
          ciphertext.slice(block * bpb, (block + 1) * bpb),
          expandedKey
        );
        if (mode == "CBC")
          for (var i = 0; i < bpb; i++)
            pt[(block - 1) * bpb + i] =
              aBlock[i] ^ ciphertext[(block - 1) * bpb + i];
        else pt = aBlock.concat(pt);
      }

      // do last block if ECB (skips the IV in CBC)
      if (mode == "ECB")
        try {
          pt = decrypt(ciphertext.slice(0, bpb), expandedKey).concat(pt);
        } catch (err) {
          throw err;
        }

      return pt;
    },

    /**
     *
     *  Secure Hash Algorithm (SHA256)
     *  http://www.webtoolkit.info/
     *
     *  Original code by Angel Marin, Paul Johnston.
     *
     **/

    SHA256: function (s) {
      var chrsz = 8;
      var hexcase = 0;

      function safe_add(x, y) {
        var lsw = (x & 0xffff) + (y & 0xffff);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xffff);
      }

      function S(X, n) {
        return (X >>> n) | (X << (32 - n));
      }
      function R(X, n) {
        return X >>> n;
      }
      function Ch(x, y, z) {
        return (x & y) ^ (~x & z);
      }
      function Maj(x, y, z) {
        return (x & y) ^ (x & z) ^ (y & z);
      }
      function Sigma0256(x) {
        return S(x, 2) ^ S(x, 13) ^ S(x, 22);
      }
      function Sigma1256(x) {
        return S(x, 6) ^ S(x, 11) ^ S(x, 25);
      }
      function Gamma0256(x) {
        return S(x, 7) ^ S(x, 18) ^ R(x, 3);
      }
      function Gamma1256(x) {
        return S(x, 17) ^ S(x, 19) ^ R(x, 10);
      }

      function core_sha256(m, l) {
        var K = new Array(
          0x428a2f98,
          0x71374491,
          0xb5c0fbcf,
          0xe9b5dba5,
          0x3956c25b,
          0x59f111f1,
          0x923f82a4,
          0xab1c5ed5,
          0xd807aa98,
          0x12835b01,
          0x243185be,
          0x550c7dc3,
          0x72be5d74,
          0x80deb1fe,
          0x9bdc06a7,
          0xc19bf174,
          0xe49b69c1,
          0xefbe4786,
          0xfc19dc6,
          0x240ca1cc,
          0x2de92c6f,
          0x4a7484aa,
          0x5cb0a9dc,
          0x76f988da,
          0x983e5152,
          0xa831c66d,
          0xb00327c8,
          0xbf597fc7,
          0xc6e00bf3,
          0xd5a79147,
          0x6ca6351,
          0x14292967,
          0x27b70a85,
          0x2e1b2138,
          0x4d2c6dfc,
          0x53380d13,
          0x650a7354,
          0x766a0abb,
          0x81c2c92e,
          0x92722c85,
          0xa2bfe8a1,
          0xa81a664b,
          0xc24b8b70,
          0xc76c51a3,
          0xd192e819,
          0xd6990624,
          0xf40e3585,
          0x106aa070,
          0x19a4c116,
          0x1e376c08,
          0x2748774c,
          0x34b0bcb5,
          0x391c0cb3,
          0x4ed8aa4a,
          0x5b9cca4f,
          0x682e6ff3,
          0x748f82ee,
          0x78a5636f,
          0x84c87814,
          0x8cc70208,
          0x90befffa,
          0xa4506ceb,
          0xbef9a3f7,
          0xc67178f2
        );
        var HASH = new Array(
          0x6a09e667,
          0xbb67ae85,
          0x3c6ef372,
          0xa54ff53a,
          0x510e527f,
          0x9b05688c,
          0x1f83d9ab,
          0x5be0cd19
        );
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;

        m[l >> 5] |= 0x80 << (24 - (l % 32));
        m[(((l + 64) >> 9) << 4) + 15] = l;

        for (var i = 0; i < m.length; i += 16) {
          a = HASH[0];
          b = HASH[1];
          c = HASH[2];
          d = HASH[3];
          e = HASH[4];
          f = HASH[5];
          g = HASH[6];
          h = HASH[7];

          for (var j = 0; j < 64; j++) {
            if (j < 16) W[j] = m[j + i];
            else
              W[j] = safe_add(
                safe_add(
                  safe_add(Gamma1256(W[j - 2]), W[j - 7]),
                  Gamma0256(W[j - 15])
                ),
                W[j - 16]
              );

            T1 = safe_add(
              safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]),
              W[j]
            );
            T2 = safe_add(Sigma0256(a), Maj(a, b, c));

            h = g;
            g = f;
            f = e;
            e = safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add(T1, T2);
          }

          HASH[0] = safe_add(a, HASH[0]);
          HASH[1] = safe_add(b, HASH[1]);
          HASH[2] = safe_add(c, HASH[2]);
          HASH[3] = safe_add(d, HASH[3]);
          HASH[4] = safe_add(e, HASH[4]);
          HASH[5] = safe_add(f, HASH[5]);
          HASH[6] = safe_add(g, HASH[6]);
          HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
      }

      function str2binb(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz) {
          bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - (i % 32));
        }
        return bin;
      }

      function binb2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
          str +=
            hex_tab.charAt(
              (binarray[i >> 2] >> ((3 - (i % 4)) * 8 + 4)) & 0xf
            ) + hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) & 0xf);
        }
        return str;
      }

      s = this.Utf8Encode(s);
      return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
    },

    Utf8Encode: function (string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }

      return utftext;
    },

    Utf8Decode: function (utftext) {
      var string = "";
      var i = 0;
      var c,
        c1,
        c2 = 0;

      while (i < utftext.length) {
        c = utftext.charCodeAt(i);

        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if (c > 191 && c < 224) {
          c2 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode(
            ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
          );
          i += 3;
        }
      }

      return string;
    },

    _keyStr:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    byteArrayToBase64: function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;

      while (i < input.length) {
        chr1 = input[i++];
        chr2 = input[i++];
        chr3 = input[i++];

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output =
          output +
          this._keyStr.charAt(enc1) +
          this._keyStr.charAt(enc2) +
          this._keyStr.charAt(enc3) +
          this._keyStr.charAt(enc4);
      }

      return output;
    },

    byteArrayFromBase64: function (input) {
      var output = new Array();
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {
        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output.push(chr1);

        if (enc3 != 64) {
          output.push(chr2);
        }
        if (enc4 != 64) {
          output.push(chr3);
        }
      }
      return output;
    },

    encryptString: function (message, password, useOldMethod) {
      if (useOldMethod) return this.encryptString_old(message, password);

      // a sequence to test if text were decrypted properly
      var _magic = "length@:";
      message = _magic.replace("length", message.length) + message;
      var key = this.hexToByteArray(this.SHA256(password));
      var plaintext = this.stringToByteArray(this.Utf8Encode(message));
      var cyphertext = this.rijndaelEncrypt(plaintext, key, "CBC");

      return this.byteArrayToBase64(cyphertext);
    },

    decryptString: function (cyphertextBase64, password) {
      if (
        /^[0-9a-f]+$/i.test(cyphertextBase64) &&
        cyphertextBase64.length % 2 == 0
      ) {
        // use old method
        return this.decryptString_old(cyphertextBase64, password);
      }

      // check if cyphertext is base64 encoded
      if (!/^[A-Za-z0-9\+\/\=]+$/.test(cyphertextBase64))
        throw new Error("Decryption failed, wrong data encoding");
      var key = this.hexToByteArray(this.SHA256(password));
      var cyphertext = this.byteArrayFromBase64(cyphertextBase64);
      var plaintext = this.rijndaelDecrypt(cyphertext, key, "CBC");
      plaintext = this.byteArrayToString(plaintext);
      // remove trailing zero symbols
      plaintext = plaintext.replace(/\0+$/, "");
      // check if message is decrypted properly
      if (/\0/.test(plaintext))
        // there should be no zeroes
        throw new Error("Decryption failed, bad password");
      plaintext = this.Utf8Decode(plaintext);
      // check for magic sequence
      if (!/^(\d+)@:/.test(plaintext))
        // no magic sequence
        throw new Error("Decryption failed, bad password");
      var length = parseInt(RegExp.$1);
      plaintext = plaintext.replace(/^(\d+)@:/, "");
      if (length != plaintext.length)
        // original length differs
        throw new Error("Decryption failed, bad password");

      return plaintext;
    },

    // old methods used in Firefox version
    // for backward compatibility
    // TODO: fix issues with >64 chars passwords
    encryptString_old: function (plaintext, password) {
      var len = plaintext.length * 2;
      var plaindata = "",
        sdata;

      var strToHex = function (str) {
        var result = "";
        for (var i = 0; i < str.length; i++) {
          var hex = str.charCodeAt(i).toString(16);
          while (hex.length < 4) hex = "0" + hex;
          result +=
            hex.charAt(2) + hex.charAt(3) + hex.charAt(0) + hex.charAt(1);
        }
        return result;
      };

      plaindata += (len < 16 ? "0" : "") + len.toString(16);
      plaindata += "000000";
      plaindata += strToHex(plaintext);
      while (plaindata.length < 64) plaindata += "00";
      var key = strToHex(password); // convert password to hex string
      if (key.length < 64) {
        //increase key length to 64
        while (key.length < 64) {
          key += "0000";
        }
      } else {
        key = key.substr(0, 64);
      }
      key = this.hexToByteArray(key);

      if (plaindata.length > 64) {
        // separate data to blocks and encode
        var part1 = plaindata.substring(0, 64);
        var part2 = plaindata.substring(64, plaindata.length);
        var part3 = "";
        if (part2.length > 64) {
          part3 = part2.substring(0, 64);
          part2 = part2.substring(64, part2.length);
        }
        while (part2.length < 64) part2 += "00";
        if (part3.length > 0) {
          while (part3.length < 64) part3 += "00";
        }

        var sdata1 = this.byteArrayToHex(
          this.rijndaelEncrypt(this.hexToByteArray(part1), key)
        );
        var sdata2 = this.byteArrayToHex(
          this.rijndaelEncrypt(this.hexToByteArray(part2), key)
        );
        var sdata3 = "";
        if (part3.length)
          sdata3 = this.byteArrayToHex(
            this.rijndaelEncrypt(this.hexToByteArray(part3), key)
          );
        sdata = sdata1 + sdata2 + sdata3; // merge blocks
      } else {
        sdata = this.byteArrayToHex(
          this.rijndaelEncrypt(this.hexToByteArray(plaindata), key)
        );
      }

      sdata = sdata.toUpperCase();
      return sdata;
    },

    decryptString_old: function (cyphertext, password) {
      var byteArrayToString = function (byteArray) {
        var result = "";
        for (var i = 0; i < byteArray.length; i++)
          if (byteArray[i] != 0) result += String.fromCharCode(byteArray[i]);
        return result;
      };

      var strToHex = function (str) {
        var result = "";
        for (var i = 0; i < str.length; i++) {
          var hex = str.charCodeAt(i).toString(16);
          while (hex.length < 4) hex = "0" + hex;
          result +=
            hex.charAt(2) + hex.charAt(3) + hex.charAt(0) + hex.charAt(1);
        }
        return result;
      };
      var key = strToHex(password); // convert password to hex string
      if (key.length < 64) {
        while (key.length < 64) {
          key += "0000";
        }
      } else {
        key = key.substr(0, 64);
      }
      key = this.hexToByteArray(key);

      cyphertext = cyphertext.toLowerCase();
      var data,
        data2 = "",
        data3 = "";
      if (cyphertext.length > 64) {
        var part1 = cyphertext.substring(0, 64);
        var part2 = cyphertext.substring(64, cyphertext.length);
        var part3 = "";
        if (part2.length > 64) {
          part3 = part2.substring(0, 64);
          part2 = part2.substring(64, part2.length);
        }
        // decode each block
        data = this.rijndaelDecrypt(this.hexToByteArray(part1), key);
        data2 = this.rijndaelDecrypt(this.hexToByteArray(part2), key);
        if (part3.length)
          data3 = this.rijndaelDecrypt(this.hexToByteArray(part3), key);
      } else {
        data = this.rijndaelDecrypt(this.hexToByteArray(cyphertext), key);
      }

      var len = data[0] / 2;
      data = byteArrayToString(data.slice(4));
      if (data2.length > 0) data2 = byteArrayToString(data2);
      if (data3.length > 0) data3 = byteArrayToString(data3);
      data = data + data2 + data3;
      if (data.length != len) {
        throw new Error("Decryption failed, bad password");
      }

      return data;
    },
  };

  return retobj;
})();

export default Rijndael;
