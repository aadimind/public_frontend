export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Author {
  id: string;
  name: string;
  affiliation?: string;
  avatarUrl?: string;
  profileUrl?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  paperCount?: number;
  color?: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

export type DiagramVariant =
  | "architecture"
  | "flow"
  | "comparison"
  | "pipeline"
  | "concept-map";

export interface PipelineDiagramData {
  steps: string[];
}

export interface ComparisonDiagramData {
  labels: string[];
  descriptions: string[];
}

export type DiagramData = PipelineDiagramData | ComparisonDiagramData;

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3 | 4; text: string; id: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "math"; display: "inline" | "block"; tex: string }
  | { type: "code"; language?: string; code: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "figure"; src?: string; alt?: string; caption?: string }
  | { type: "diagram"; variant: DiagramVariant; caption?: string; data?: DiagramData }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "callout"; tone: "info" | "warning" | "success"; title?: string; text: string }
  | { type: "citations"; items: CitationItem[] };

export interface CitationItem {
  id: string;
  text: string;
  url?: string;
}

export interface PaperSection {
  id: string;
  title: string;
  blocks: ContentBlock[];
}

export interface Paper {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  summary?: string;
  authors: Author[];
  category: Category;
  tags: Tag[];
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  // V1: no canonical difficulty source exists (docs/public-contract.md §5),
  // so the backend omits it and the contract treats it as optional.
  difficulty?: Difficulty;
  sections: PaperSection[];
  originalPaperUrl?: string;
  originalPaperTitle?: string;
  featuredImage?: string;
  isFeatured?: boolean;
  viewCount?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  hasMore?: boolean;
  total?: number;
}

export interface SearchResult {
  paper: Paper;
  excerpt: string;
  matches: SearchMatch[];
  score: number;
}

export interface SearchMatch {
  field: "title" | "description" | "section" | "tag" | "author";
  text: string;
  highlight: string;
}

export interface PaperFilters {
  category?: string;
  tag?: string;
  difficulty?: Difficulty;
  author?: string;
  from?: string;
  to?: string;
  sort?: "newest" | "oldest" | "popular" | "relevance";
  q?: string;
}

export interface FilterMetadata {
  categories: Category[];
  tags: Tag[];
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}
