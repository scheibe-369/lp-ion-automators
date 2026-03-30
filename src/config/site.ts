// src/config/site.ts
export const SITE_CONFIG = {
  // Datas OBRIGATÓRIAS (ISO 8601 com timezone Brasil)
  enrollmentDeadline: new Date(import.meta.env.PUBLIC_ENROLLMENT_DEADLINE || "2026-05-07T23:59:59-03:00"),
  classStartDate: import.meta.env.PUBLIC_CLASS_START_DATE || "7 de abril de 2026",
  classEndDate: import.meta.env.PUBLIC_CLASS_END_DATE || "7 de maio de 2026",
  
  // Preços — valores padronizados em centavos para evitar float de Javascript
  bundlePrice: parseInt(import.meta.env.PUBLIC_BUNDLE_PRICE || "0"), // A DEFINIR
  installmentCount: parseInt(import.meta.env.PUBLIC_INSTALLMENT_COUNT || "12"),
  installmentPrice: parseInt(import.meta.env.PUBLIC_INSTALLMENT_PRICE || "0"),
  anchorPriceION: parseInt(import.meta.env.PUBLIC_ANCHOR_ION || "0"),
  anchorPriceAutomators: parseInt(import.meta.env.PUBLIC_ANCHOR_AUTOMATORS || "0"),
  anchorTotal: parseInt(import.meta.env.PUBLIC_ANCHOR_TOTAL || "0"),
  
  // URLs de redirect
  checkoutURL: import.meta.env.PUBLIC_CHECKOUT_URL || "https://hub.la/g/PLACEHOLDER",
  whatsappNumber: import.meta.env.PUBLIC_WHATSAPP_NUMBER || "5500000000000",
  
  // Prova social & Textos Extras
  studentCount: import.meta.env.PUBLIC_STUDENT_COUNT || "X",
  
  // Meta e SEO
  siteTitle: "ION + Automators Club — Turma Inaugural",
  siteDescription: "IA aplicada a processos comerciais e automação com n8n na prática. 8 semanas de calls ao vivo com a equipe Growth Hub.",
  ogImage: "/og-image.jpg",
} as const;

// Helper global para formatar preço em R$ (BRL)
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}
