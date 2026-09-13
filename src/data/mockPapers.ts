import type { Paper } from "@/types";
import {
  attentionIsAllYouNeedSections,
  adamSections,
  bertSections,
  resnetSections,
  diffusionSections,
} from "./mockContent";

export const mockAuthors = {
  vaswani: { id: "a-vaswani", name: "Ashish Vaswani", affiliation: "Google Brain" },
  shazeer: { id: "a-shazeer", name: "Noam Shazeer", affiliation: "Google Brain" },
  parmar: { id: "a-parmar", name: "Niki Parmar", affiliation: "Google Research" },
  kingma: { id: "a-kingma", name: "Diederik P. Kingma", affiliation: "OpenAI" },
  ba: { id: "a-ba", name: "Jimmy Ba", affiliation: "University of Toronto" },
  devlin: { id: "a-devlin", name: "Jacob Devlin", affiliation: "Google AI Language" },
  he: { id: "a-he", name: "Kaiming He", affiliation: "Microsoft Research" },
  ho: { id: "a-ho", name: "Jonathan Ho", affiliation: "Google Brain" },
};

export const mockPapers: Paper[] = [
  {
    id: "p-attention",
    slug: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    subtitle: "How a simple idea replaced recurrence and convolution in sequence modeling",
    description:
      "A new network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
    summary:
      "The Transformer introduced self-attention as the sole mechanism for sequence modeling, removing the need for recurrence or convolution. It achieved state-of-the-art translation results while being more parallelizable and easier to train.",
    authors: [
      { ...mockAuthors.vaswani },
      { ...mockAuthors.shazeer },
      { ...mockAuthors.parmar },
      { id: "a-uszkoreit", name: "Jakob Uszkoreit", affiliation: "Google Research" },
      { id: "a-jones", name: "Llion Jones", affiliation: "Google Research" },
      { id: "a-gomez", name: "Aidan N. Gomez", affiliation: "Google Brain" },
      { id: "a-kaiser", name: "Łukasz Kaiser", affiliation: "Google Brain" },
      { id: "a-polosukhin", name: "Illia Polosukhin", affiliation: "Google Research" },
    ],
    category: {
      id: "cat-ml",
      slug: "machine-learning",
      name: "Machine Learning",
 },
    tags: [
      { id: "t-transformer", slug: "transformer", name: "Transformer" },
      { id: "t-attention", slug: "attention", name: "Attention" },
      { id: "t-nlp", slug: "nlp", name: "NLP" },
      { id: "t-deep-learning", slug: "deep-learning", name: "Deep Learning" },
    ],
    publishedAt: "2017-06-12",
    updatedAt: "2017-12-06",
    readingTime: 18,
    difficulty: "intermediate",
    sections: attentionIsAllYouNeedSections,
    originalPaperUrl: "https://arxiv.org/abs/1706.03762",
    originalPaperTitle: "Attention Is All You Need (arXiv:1706.03762)",
    isFeatured: true,
    viewCount: 124500,
  },
  {
    id: "p-adam",
    slug: "adam-a-method-for-stochastic-optimization",
    title: "Adam: A Method for Stochastic Optimization",
    subtitle: "Adaptive moments for efficient gradient-based optimization",
    description:
      "A method for efficient stochastic optimization that only requires first-order gradients with little memory requirement.",
    summary:
      "Adam combines the benefits of AdaGrad and RMSProp by computing adaptive learning rates per parameter from estimates of first and second moments of the gradients.",
    authors: [
      { ...mockAuthors.kingma },
      { ...mockAuthors.ba },
    ],
    category: {
      id: "cat-ml",
      slug: "machine-learning",
      name: "Machine Learning",
    },
    tags: [
      { id: "t-optimization", slug: "optimization", name: "Optimization" },
      { id: "t-deep-learning", slug: "deep-learning", name: "Deep Learning" },
    ],
    publishedAt: "2014-12-22",
    readingTime: 12,
    difficulty: "intermediate",
    sections: adamSections,
    originalPaperUrl: "https://arxiv.org/abs/1412.6980",
    originalPaperTitle: "Adam: A Method for Stochastic Optimization (arXiv:1412.6980)",
    viewCount: 89200,
  },
  {
    id: "p-bert",
    slug: "bert-pretraining-of-deep-bidirectional-transformers",
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    subtitle: "Bidirectional context transforms language understanding",
    description:
      "BERT is designed to pretrain deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.",
    summary:
      "BERT introduces masked language modeling and next sentence prediction objectives, achieving state-of-the-art results on a wide range of NLP benchmarks.",
    authors: [
      { ...mockAuthors.devlin },
      { id: "a-chang", name: "Ming-Wei Chang", affiliation: "Google AI" },
      { id: "a-lee", name: "Kenton Lee", affiliation: "Google AI" },
      { id: "a-toutanova", name: "Kristina Toutanova", affiliation: "Google AI" },
    ],
    category: {
      id: "cat-ai",
      slug: "artificial-intelligence",
      name: "Artificial Intelligence",
    },
    tags: [
      { id: "t-bert", slug: "bert", name: "BERT" },
      { id: "t-transformer", slug: "transformer", name: "Transformer" },
      { id: "t-nlp", slug: "nlp", name: "NLP" },
      { id: "t-pretraining", slug: "pretraining", name: "Pretraining" },
    ],
    publishedAt: "2018-10-11",
    readingTime: 16,
    difficulty: "intermediate",
    sections: bertSections,
    originalPaperUrl: "https://arxiv.org/abs/1810.04805",
    originalPaperTitle: "BERT (arXiv:1810.04805)",
    isFeatured: true,
    viewCount: 78400,
  },
  {
    id: "p-resnet",
    slug: "deep-residual-learning-for-image-recognition",
    title: "Deep Residual Learning for Image Recognition",
    subtitle: "Residual connections unlock very deep networks",
    description:
      "A residual learning framework to ease the training of networks substantially deeper than those used previously.",
    summary:
      "ResNet introduces skip connections that allow gradients to flow through very deep networks, winning the ILSVRC 2015 classification task.",
    authors: [
      { ...mockAuthors.he },
      { id: "a-ren", name: "Shaoqing Ren", affiliation: "Microsoft Research" },
      { id: "a-sun", name: "Jian Sun", affiliation: "Microsoft Research" },
      { id: "a-zhang", name: "Xiangyu Zhang", affiliation: "Microsoft Research" },
    ],
    category: {
      id: "cat-cs",
      slug: "computer-science",
      name: "Computer Science",
    },
    tags: [
      { id: "t-cnn", slug: "cnn", name: "CNN" },
      { id: "t-vision", slug: "computer-vision", name: "Computer Vision" },
      { id: "t-deep-learning", slug: "deep-learning", name: "Deep Learning" },
    ],
    publishedAt: "2015-12-10",
    readingTime: 15,
    difficulty: "intermediate",
    sections: resnetSections,
    originalPaperUrl: "https://arxiv.org/abs/1512.03385",
    originalPaperTitle: "ResNet (arXiv:1512.03385)",
    isFeatured: true,
    viewCount: 156000,
  },
  {
    id: "p-diffusion",
    slug: "denoising-diffusion-probabilistic-models",
    title: "Denoising Diffusion Probabilistic Models",
    subtitle: "Learning to reverse noise produces high-fidelity samples",
    description:
      "We present high quality image synthesis results using diffusion probabilistic models, a class of latent variable models inspired by considerations from nonequilibrium thermodynamics.",
    summary:
      "Diffusion models generate data by learning to reverse a gradual noising process, achieving state-of-the-art image quality.",
    authors: [
      { ...mockAuthors.ho },
      { id: "a-jain", name: "Ajay Jain", affiliation: "UC Berkeley" },
      { id: "a-abbeel", name: "Pieter Abbeel", affiliation: "UC Berkeley" },
    ],
    category: {
      id: "cat-ml",
      slug: "machine-learning",
      name: "Machine Learning",
    },
    tags: [
      { id: "t-diffusion", slug: "diffusion", name: "Diffusion" },
      { id: "t-generative", slug: "generative-models", name: "Generative Models" },
      { id: "t-deep-learning", slug: "deep-learning", name: "Deep Learning" },
    ],
    publishedAt: "2020-06-16",
    readingTime: 20,
    difficulty: "advanced",
    sections: diffusionSections,
    originalPaperUrl: "https://arxiv.org/abs/2006.11239",
    originalPaperTitle: "DDPM (arXiv:2006.11239)",
    viewCount: 24100,
  },
  {
    id: "p-gpt3",
    slug: "language-models-are-few-shot-learners",
    title: "Language Models are Few-Shot Learners",
    subtitle: "Scaling unlocks emergent capabilities in language models",
    description:
      "We train GPT-3, a 175 billion parameter autoregressive language model, and test its performance in the few-shot setting.",
    summary:
      "GPT-3 demonstrates that scaling up language models dramatically improves task-agnostic, few-shot performance, often competing with or surpassing fine-tuned models.",
    authors: [
      { id: "a-brown", name: "Tom B. Brown", affiliation: "OpenAI" },
      { ...mockAuthors.kingma },
      { id: "a-brockman", name: "Greg Brockman", affiliation: "OpenAI" },
    ],
    category: {
      id: "cat-ai",
      slug: "artificial-intelligence",
      name: "Artificial Intelligence",
    },
    tags: [
      { id: "t-gpt", slug: "gpt", name: "GPT" },
      { id: "t-llm", slug: "llm", name: "LLM" },
      { id: "t-nlp", slug: "nlp", name: "NLP" },
      { id: "t-scaling", slug: "scaling", name: "Scaling" },
    ],
    publishedAt: "2020-05-28",
    readingTime: 25,
    difficulty: "advanced",
    sections: attentionIsAllYouNeedSections.slice(0, 6),
    originalPaperUrl: "https://arxiv.org/abs/2005.14165",
    originalPaperTitle: "GPT-3 (arXiv:2005.14165)",
    viewCount: 42000,
  },
  {
    id: "p-vit",
    slug: "an-image-is-worth-16x16-words",
    title: "An Image is Worth 16×16 Words: Transformers for Image Recognition at Scale",
    subtitle: "Pure Transformers rival CNNs in computer vision",
    description:
      "We show that a pure transformer applied directly to sequences of image patches can perform very well on image classification tasks.",
    summary:
      "Vision Transformer (ViT) applies the standard Transformer encoder directly to image patches, achieving excellent results on image classification when pretrained on large datasets.",
    authors: [
      { id: "a-dosovitskiy", name: "Alexey Dosovitskiy", affiliation: "Google Research" },
      { id: "a-beyer", name: "Lucas Beyer", affiliation: "Google Research" },
 { id: "a-kolesnikov", name: "Alexander Kolesnikov", affiliation: "Google Research" },
    ],
    category: {
      id: "cat-cs",
      slug: "computer-science",
      name: "Computer Science",
    },
    tags: [
      { id: "t-vit", slug: "vit", name: "ViT" },
      { id: "t-transformer", slug: "transformer", name: "Transformer" },
      { id: "t-vision", slug: "computer-vision", name: "Computer Vision" },
    ],
    publishedAt: "2020-10-22",
    readingTime: 14,
    difficulty: "intermediate",
    sections: resnetSections.slice(0, 4),
    originalPaperUrl: "https://arxiv.org/abs/2010.11929",
    originalPaperTitle: "ViT (arXiv:2010.11929)",
    viewCount: 38700,
  },
  {
    id: "p-gan",
    slug: "generative-adversarial-nets",
    title: "Generative Adversarial Networks",
    subtitle: "Two networks compete to generate realistic data",
    description:
      "We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models.",
    summary:
      "GANs frame generative modeling as a game between a generator and discriminator network, leading to high-quality sample generation.",
    authors: [
      { id: "a-goodfellow", name: "Ian Goodfellow", affiliation: "Université de Montréal" },
    ],
    category: {
      id: "cat-ml",
      slug: "machine-learning",
      name: "Machine Learning",
    },
    tags: [
      { id: "t-gan", slug: "gan", name: "GAN" },
      { id: "t-generative", slug: "generative-models", name: "Generative Models" },
      { id: "t-deep-learning", slug: "deep-learning", name: "Deep Learning" },
    ],
    publishedAt: "2014-06-10",
    readingTime: 13,
    difficulty: "intermediate",
    sections: diffusionSections.slice(0, 5),
    originalPaperUrl: "https://arxiv.org/abs/1406.2661",
    originalPaperTitle: "GAN (arXiv:1406.2661)",
    viewCount: 96800,
  },
];
