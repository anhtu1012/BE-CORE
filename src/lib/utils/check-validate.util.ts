export function checkDigitCntrNo(cntr: string): boolean {
  const chknum: number[] = new Array<number>(11).fill(0);
  let chkdgt = 0;
  let wgtdgt = 0;
  try {
    if (cntr.length !== 11) {
      return false;
    }

    const isNumeric = (str: string): boolean => /^\d+$/.test(str);
    if (!isNumeric(cntr.substring(4, 7))) {
      return false;
    }

    chkdgt = parseInt(cntr.charAt(cntr.length - 1), 10);

    for (let i = 1; i <= 10; i++) {
      const biccode = cntr.charAt(i - 1).toUpperCase();
      if (i < 5) {
        const asciiValue = biccode.charCodeAt(0);
        if (asciiValue === 65) {
          // 'A'
          chknum[i] = 10;
        } else if (asciiValue > 65 && asciiValue < 76) {
          // B-K
          chknum[i] = asciiValue - 54;
        } else if (asciiValue > 75 && asciiValue < 86) {
          // L-U
          chknum[i] = asciiValue - 53;
        } else if (asciiValue > 85 && asciiValue < 91) {
          // V-Z
          chknum[i] = asciiValue - 52;
        }
      } else {
        chknum[i] = parseInt(biccode, 10);
      }
    }

    wgtdgt =
      (chknum[1] * 1 +
        chknum[2] * 2 +
        chknum[3] * 4 +
        chknum[4] * 8 +
        chknum[5] * 16 +
        chknum[6] * 32 +
        chknum[7] * 64 +
        chknum[8] * 128 +
        chknum[9] * 256 +
        chknum[10] * 512) %
      11;

    if (wgtdgt === 10) {
      wgtdgt = 0;
    }

    return wgtdgt === chkdgt;
  } catch (error) {
    console.error(error);
    return false;
  }
}
