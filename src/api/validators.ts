import type {
  Author,
  Category,
  CitationItem,
  ContentBlock,
  Difficulty,
  DiagramData,
  PaginatedResponse,
  Paper,
  PaperFilters,
  PaperSection,
  SearchResult,
  Tag,
} from "@/types";

const DIFFICULTIES: readonly Difficulty[] = ["beginner", "intermediate", "advanced"];
const SORTS = ["newest", "oldest", "popular", "relevance"] as const;
const DIAGRAM_VARIANTS = ["architecture", "flow", "comparison", "pipeline", "concept-map"] as const;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isDifficulty(value: unknown): value is Difficulty {
  return isString(value) && (DIFFICULTIES as readonly string[]).includes(value);
}

export function isPaperSort(value: unknown): value is NonNullable<PaperFilters["sort"]> {
  return isString(value) && (SORTS as readonly string[]).includes(value);
}

function isStringArray(value: unknown): value is string[] {
  return isArray(value) && value.every(isString);
}

function isDiagramData(value: unknown, variant: (typeof DIAGRAM_VARIANTS)[number]): value is DiagramData {
  if (variant !== "pipeline" && variant !== "comparison") return value === undefined;
  if (!isObject(value)) return false;
  if (variant === "pipeline") return isStringArray(value.steps);
  return isStringArray(value.labels) && isStringArray(value.descriptions);
}

export function isAuthor(value: unknown): value is Author {
  if (!isObject(value)) return false;
  if (!isString(value.id) || !isString(value.name)) return false;
  if (value.affiliation !== undefined && !isString(value.affiliation)) return false;
  if (value.avatarUrl !== undefined && !isString(value.avatarUrl)) return false;
  if (value.profileUrl !== undefined && !isString(value.profileUrl)) return false;
  return true;
}

export function isCategory(value: unknown): value is Category {
  if (!isObject(value)) return false;
  if (!isString(value.id) || !isString(value.slug) || !isString(value.name)) return false;
  if (value.description !== undefined && !isString(value.description)) return false;
  if (value.paperCount !== undefined && !isNumber(value.paperCount)) return false;
  if (value.color !== undefined && !isString(value.color)) return false;
  return true;
}

export function isTag(value: unknown): value is Tag {
  if (!isObject(value)) return false;
  return isString(value.id) && isString(value.slug) && isString(value.name);
}

export function isCitationItem(value: unknown): value is CitationItem {
  if (!isObject(value)) return false;
  if (!isString(value.id) || !isString(value.text)) return false;
  if (value.url !== undefined && !isString(value.url)) return false;
  return true;
}

export function isContentBlock(value: unknown): value is ContentBlock {
  if (!isObject(value)) return false;
  if (!isString(value.type)) return false;
  switch (value.type) {
    case "paragraph":
      return isString(value.text);
    case "heading": {
      const level = value.level;
      return isString(value.text) && isString(value.id) && (level === 2 || level === 3 || level === 4);
    }
    case "list":
      return isBoolean(value.ordered) && isStringArray(value.items);
    case "math":
      return (value.display === "inline" || value.display === "block") && isString(value.tex);
    case "code":
      return isString(value.code) && (value.language === undefined || isString(value.language));
    case "quote":
      return isString(value.text) && (value.attribution === undefined || isString(value.attribution));
    case "figure":
      return (value.src === undefined || isString(value.src)) &&
        (value.alt === undefined || isString(value.alt)) &&
        (value.caption === undefined || isString(value.caption));
    case "diagram":
      return DIAGRAM_VARIANTS.includes(value.variant as (typeof DIAGRAM_VARIANTS)[number]) &&
        (value.caption === undefined || isString(value.caption)) &&
        isDiagramData(value.data, value.variant as (typeof DIAGRAM_VARIANTS)[number]);
    case "table":
      return isStringArray(value.headers) &&
        isArray(value.rows) && value.rows.every((row) => isStringArray(row)) &&
        (value.caption === undefined || isString(value.caption));
    case "callout":
      return (value.tone === "info" || value.tone === "warning" || value.tone === "success") &&
        isString(value.text) && (value.title === undefined || isString(value.title));
    case "citations":
      return isArray(value.items) && value.items.every(isCitationItem);
    default:
      return false;
  }
}

export function isPaperSection(value: unknown): value is PaperSection {
  if (!isObject(value)) return false;
  return isString(value.id) && isString(value.title) && isArray(value.blocks) && value.blocks.every(isContentBlock);
}

export function isPaper(value: unknown): value is Paper {
  if (!isObject(value)) return false;
  if (!isString(value.id) || !isString(value.slug) || !isString(value.title)) return false;
  if (!isString(value.description)) return false;
  if (!isArray(value.authors) || !value.authors.every(isAuthor)) return false;
  if (!isCategory(value.category)) return false;
  if (!isArray(value.tags) || !value.tags.every(isTag)) return false;
  if (!isString(value.publishedAt) || !isNumber(value.readingTime)) return false;
  if (value.difficulty !== undefined && !isDifficulty(value.difficulty)) return false;
  if (!isArray(value.sections) || !value.sections.every(isPaperSection)) return false;
  if (value.subtitle !== undefined && !isString(value.subtitle)) return false;
  if (value.summary !== undefined && !isString(value.summary)) return false;
  if (value.updatedAt !== undefined && !isString(value.updatedAt)) return false;
  if (value.originalPaperUrl !== undefined && !isString(value.originalPaperUrl)) return false;
  if (value.originalPaperTitle !== undefined && !isString(value.originalPaperTitle)) return false;
  if (value.featuredImage !== undefined && !isString(value.featuredImage)) return false;
  if (value.isFeatured !== undefined && !isBoolean(value.isFeatured)) return false;
  if (value.viewCount !== undefined && !isNumber(value.viewCount)) return false;
  return true;
}

export function isPaginatedPapers(value: unknown): value is PaginatedResponse<Paper> {
  if (!isObject(value)) return false;
  if (!isArray(value.items) || !value.items.every(isPaper)) return false;
  if (value.nextCursor !== undefined && !isString(value.nextCursor)) return false;
  if (value.hasMore !== undefined && !isBoolean(value.hasMore)) return false;
  if (value.total !== undefined && !isNumber(value.total)) return false;
  return true;
}

export function isPaperArray(value: unknown): value is Paper[] {
  return isArray(value) && value.every(isPaper);
}

export function isCategoryArray(value: unknown): value is Category[] {
  return isArray(value) && value.every(isCategory);
}

export function isSearchResult(value: unknown): value is SearchResult {
  if (!isObject(value)) return false;
  if (!isPaper(value.paper)) return false;
  if (!isString(value.excerpt)) return false;
  if (!isNumber(value.score)) return false;
  if (!isArray(value.matches)) return false;
  return value.matches.every((m) => isObject(m) && isString(m.field) && ["title", "description", "section", "tag", "author"].includes(m.field) && isString(m.text) && isString(m.highlight));
}

export function isSearchResultArray(value: unknown): value is SearchResult[] {
  return isArray(value) && value.every(isSearchResult);
}
