// placeholder
export function suggestLoan(profile, loans) {
  if (profile.profession === "Doctor") {
    return loans.find(l => l.id === "doctor");
  }
  if (profile.business) {
    return loans.find(l => l.id === "business");
  }
  return loans.find(l => l.id === "personal");
}
