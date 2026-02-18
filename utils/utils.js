export const base_url = "http://localhost:3000/api"
export const otpGenerator = () => {
  const n = Math.floor(Math.random() * 100000); // 0 .. 99999
  return String(n).padStart(5, "0"); // ensures 5 digits like "00423"
};