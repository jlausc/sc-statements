export const unwantedHeaders = [
  "BankABA",
  // "BankAccount",
  "wdmax",
  "ACHType",
  "maxamount",
  "minamount",
  "savings_formula",
  "wdcount",
  "csvscript",
  "wireaccount",
  "wireaba",
  "wireinstructions2",
  "wireinstructions3",
  "wireinstructions4",
  "wireinstructions",
  "program",
  "IsMoneyCenter",
  "Entity",
  "ThirdPartyFee",
  "IntuitTier",
  "IntuitWorking",
  "insuranceType",
  "item",
  "max_savings_rate",
  // "macro",
  // "RecFile",
  // "vard1",
  // "vard2",
  // "var1",
  "recerror",
  "lastdownload",
  // "ofxmacro",
  // "vars", // sec pws

  "Approved",
  "Active",
  "lastdateactive",
  "InitialDepositDate",
  "lastdaterec",
];

export function parseCustomHeader(header: string, orig: any) {
  // Orig is the first row so we can grab keys
  if (header == "vars") {
    return "Additional Vars";
  }
  if (header.includes("vard")) {
    return orig[header];
  } else if (header.includes("var")) {
    return "";
  } else {
    return header;
  }
}
