// Mesmo utilitário de venore-plugin-academy/shared/slug.ts — geração de slug pra create-board
// (quando não vier explícito) e validação em update-board.
const COMBINING_DIACRITICS = /[̀-ͯ]/g;

export function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}
