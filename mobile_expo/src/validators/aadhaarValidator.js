export function validateAadhaar(aadhaar) {
  return aadhaar.length === 12 && /^\d+$/.test(aadhaar);
}
