import type { Category } from "@/types";

export const mockCategories: Category[] = [
  {
    id: "cat-ai",
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    description:
      "Foundational research in artificial intelligence, including reasoning, planning, and intelligent agents.",
    paperCount: 42,
    color: "#5b6cff",
  },
  {
    id: "cat-ml",
    slug: "machine-learning",
    name: "Machine Learning",
    description:
      "Theories, methods, and applications of learning from data.",
    paperCount: 86,
    color: "#10b981",
  },
  {
    id: "cat-cs",
    slug: "computer-science",
    name: "Computer Science",
    description:
      "Algorithms, systems, programming languages, and computing theory.",
    paperCount: 64,
    color: "#f59e0b",
  },
  {
    id: "cat-math",
    slug: "mathematics",
    name: "Mathematics",
    description:
      "Pure and applied mathematics, from algebra to analysis and beyond.",
    paperCount: 51,
    color: "#8b5cf6",
  },
  {
    id: "cat-physics",
    slug: "physics",
    name: "Physics",
    description:
      "Classical mechanics, quantum theory, relativity, and modern physics.",
    paperCount: 33,
    color: "#ef4444",
  },
  {
    id: "cat-bio",
    slug: "biology",
    name: "Biology",
    description:
      "Molecular biology, genetics, neuroscience, and computational biology.",
    paperCount: 28,
    color: "#14b8a6",
  },
  {
    id: "cat-econ",
    slug: "economics",
    name: "Economics",
    description:
      "Microeconomics, macroeconomics, behavioral economics, and econometrics.",
    paperCount: 19,
    color: "#0ea5e9",
  },
  {
    id: "cat-stats",
    slug: "statistics",
    name: "Statistics",
    description:
      "Statistical theory, Bayesian methods, and applied inference.",
    paperCount: 24,
    color: "#a855f7",
  },
];
