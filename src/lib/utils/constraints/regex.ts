export interface Constraints {
  [key: string]: string[];
}

export const constraints: Constraints = {
  date: [
    // "(^.{4})(-)(.{2})(-)(.{2}$)",
    "(^\\d{4})(-)(0[1-9]|1[0-2])(-)([0-2]\\d$|3[0,1]$)",
    "Please enter a valid date with the following format: YYYY-MM-DD",
  ],
  twoDecimal: [
    "(^\\d*)(\\.)(\\d{2}$)",
    "Please enter a number rounded to two decimal places",
  ],
  apy: [
    "(^-|\\d*)(\\.)(\\d{5}$)",
    "Please enter an APY rounded to 5 decimal places",
  ],
  dateAdj: [
    "(^-)(\\d{1,9}$)",
    "Please enter a negative number up to 10 digits",
  ],
  dateNoDash: [
    "(^\\d{4})(-)(0[1-9]|1[0-2])(-)([0-2]\\d$|3[0,1]$)",
    "Please enter 8 digits",
  ],
};
