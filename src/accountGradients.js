export const ACCOUNT_GRADIENTS = {
  midnight: "linear-gradient(135deg, #0a2342 0%, #0f1a30 40%, #1a1035 100%)",
  sunset: "linear-gradient(135deg, #ff8a5c 0%, #c73866 50%, #4a1860 100%)",
  ocean: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 50%, #0c1a3d 100%)",
  forest: "linear-gradient(135deg, #22c55e 0%, #15803d 50%, #0a1f12 100%)",
  gold: "linear-gradient(135deg, #fbbf24 0%, #a16207 50%, #3d2e05 100%)",
  violet: "linear-gradient(135deg, #a855f7 0%, #6d28d9 50%, #1e0a3d 100%)",
  rose: "linear-gradient(135deg, #fb7185 0%, #be123c 50%, #4d0a24 100%)",
  mint: "linear-gradient(135deg, #34d399 0%, #047857 50%, #052e22 100%)",
  slate: "linear-gradient(135deg, #64748b 0%, #1e293b 50%, #020617 100%)",
  magenta: "linear-gradient(135deg, #f472b6 0%, #be185d 50%, #4a0a2d 100%)",
};

export const GRADIENT_KEYS = Object.keys(ACCOUNT_GRADIENTS);

export const resolveGradient = (key) =>
  ACCOUNT_GRADIENTS[key] || ACCOUNT_GRADIENTS.midnight;
