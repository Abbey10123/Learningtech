export function generateOtp() {
    const min = 100000;
    const max = 999999;
    return Math.ceil(Math.random() * (max - min) + min);
  }
  