const KEY = "gosubsidy_premium_entitlements";

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
  catch { return {}; }
};

export const getEntitlement = (code) => {
  const all = read();
  const item = all[code];
  if (!item) return null;

  if (item.expiresAt && new Date(item.expiresAt) <= new Date()) {
    delete all[code];
    localStorage.setItem(KEY, JSON.stringify(all));
    return null;
  }
  return item;
};

export const hasEntitlement = (code) => Boolean(getEntitlement(code));

export const grantDemoEntitlement = (code, days = 30) => {
  const all = read();
  const expires = new Date();
  expires.setDate(expires.getDate() + days);

  all[code] = {
    productCode: code,
    orderId: `DEMO_ORDER_${Date.now()}`,
    paymentId: `DEMO_PAYMENT_${Date.now()}`,
    purchasedAt: new Date().toISOString(),
    expiresAt: expires.toISOString(),
    status: "active",
    demo: true
  };

  localStorage.setItem(KEY, JSON.stringify(all));
  return all[code];
};
