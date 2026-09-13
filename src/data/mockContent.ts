import type { ContentBlock, PaperSection } from "@/types";

// Helper to build sections
function section(
  id: string,
  title: string,
  blocks: ContentBlock[]
): PaperSection {
  return { id, title, blocks };
}

// Heading block
const h = (level: 2 | 3 | 4, text: string): ContentBlock => ({
  type: "heading",
  level,
  text,
  id: slug(text),
});

function slug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const list = (items: string[], ordered = false): ContentBlock => ({
  type: "list",
  ordered,
  items,
});
const math = (tex: string, display: "inline" | "block" = "inline"): ContentBlock => ({
  type: "math",
  tex,
  display,
});
const codeBlock = (code: string, language?: string): ContentBlock => ({
  type: "code",
  code,
  language,
});
void codeBlock;
const quote = (text: string, attribution?: string): ContentBlock => ({
  type: "quote",
  text,
  attribution,
});
void quote;
const callout = (
  text: string,
  tone: "info" | "warning" | "success" = "info",
  title?: string
): ContentBlock => ({ type: "callout", text, tone, title });

// Sample paper1: Attention Is All You Need
export const attentionIsAllYouNeedSections: PaperSection[] = [
  section("overview", "Overview", [
    p(
      "The Transformer is a neural network architecture introduced by Vaswani et al. in 2017 that relies entirely on an attention mechanism to model sequences. It抛弃了循环和卷积结构,成为后续大多数先进模型的基础。"
    ),
    p(
      "At its core, the Transformer uses self-attention to compute representations of sequences by relating every position to every other position in a constant number of operations."
    ),
    callout(
      "This paper has been cited over 100,000 times and remains one of the most influential works in modern AI.",
      "info",
      "Impact"
    ),
  ]),
  section("why-this-matters", "Why This Matters", [
    p(
      "Before Transformers, sequence modeling was dominated by recurrent neural networks (RNNs) and convolutional models. Both approaches had limitations: RNNs process sequences sequentially, making training slow, while convolutional models require many layers to capture long-range dependencies."
    ),
    p(
      "The Transformer showed that attention alone could replace recurrence and convolution, dramatically improving training efficiency and enabling the scaling that defines modern large language models."
    ),
  ]),
  section("problem", "Problem", [
    p(
      "Given a sequence of tokens, we want to produce contextual representations of each token. A good representation should encode information about the token itself and its relationship to other tokens in the sequence."
    ),
    p(
      "Prior approaches struggled with two key issues:"
    ),
    list([
      "Sequential computation makes parallelization difficult.",
      "Long-range dependencies require information to travel through many hidden states.",
    ]),
  ]),
  section("background", "Background", [
    h(3, "Recurrent Neural Networks"),
    p(
      "RNNs maintain a hidden state that is updated at each time step. Although theoretically powerful, in practice they struggle to retain information across long sequences and are slow to train due to their sequential nature."
    ),
    h(3, "Convolutional Models"),
    p(
      "Convolutional sequence models apply filters across positions. Hierarchical convolutions can model long-range dependencies, but the number of operations required to relate distant positions grows with distance."
    ),
    h(3, "Attention Mechanism"),
    p(
      "Attention allows a model to focus on relevant parts of the input. The general form is:"
    ),
    math(
      "\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V",
      "block"
    ),
    p(
      "where $Q$, $K$, and $V$ are the query, key, and value matrices respectively, and $d_k$ is the dimensionality of the keys."
    ),
  ]),
  section("architecture", "Architecture", [
    p(
      "The Transformer follows an encoder-decoder structure. Both encoder and decoder are composed of stacked layers containing two main sub-layers: multi-head self-attention and position-wise feed-forward networks."
    ),
    h(3, "Multi-Head Attention"),
    p(
      "Instead of performing a single attention function, the Transformer projects queries, keys, and values $h$ times with different learned projections. Each head operates on a lower-dimensional subspace:"
    ),
    math(
      "\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, ..., \\text{head}_h)W^O",
      "block"
    ),
    p(
      "where each head is computed as:"
    ),
    math(
      "\\text{head}_i = \\text{Attention}(QW_i^Q, KW_i^K, VW_i^V)",
      "block"
    ),
    h(3, "Positional Encoding"),
    p(
      "Because the model contains no recurrence or convolution, it needs a way to encode position. The authors add sinusoidal positional encodings:"
    ),
    math(
      "PE_{(pos, 2i)} = \\sin(pos / 10000^{2i / d_{model}})",
      "block"
    ),
    math(
      "PE_{(pos, 2i+1)} = \\cos(pos / 10000^{2i / d_{model}})",
      "block"
    ),
  ]),
  section("experiments", "Experiments", [
    p(
      "The authors evaluate on two machine translation tasks: WMT 2014 English-to-German and English-to-French. The big Transformer model achieves 28.4 BLEU on En-De and 41.8 BLEU on En-Fr, surpassing prior state-of-the-art results."
    ),
    quote(
      "We are excited about the future of attention-based models and their applications beyond text.",
      "Vaswani et al., 2017"
    ),
  ]),
  section("results", "Results", [
    p(
      "The Transformer also trained significantly faster than prior models. The big model reached competitive performance in 3.5 days on 8 GPUs, compared to weeks for recurrent baselines."
    ),
    list([
      "BLEU 28.4 on WMT 2014 En-De, surpassing prior best by over 2 BLEU.",
      "BLEU 41.8 on WMT 2014 En-Fr, setting a new single-model state-of-the-art.",
      "Training time reduced from days to hours compared to recurrent baselines.",
    ]),
 ]),
  section("limitations", "Limitations", [
    p(
      "Self-attention has complexity $O(n^2)$ with respect to sequence length, which becomes expensive for very long sequences. The original paper does not evaluate on document-level tasks where this matters."
    ),
    p(
      "The paper also does not explore pretraining or scaling laws, focusing solely on supervised translation."
    ),
  ]),
  section("conclusion", "Conclusion", [
    p(
      "The Transformer demonstrated that attention alone is sufficient for sequence modeling, removing the need for recurrence or convolution. This insight has shaped virtually every subsequent advance in language modeling and beyond."
    ),
    p(
      "Its successors — BERT, GPT, T5, and modern LLMs — all trace their lineage back to this architecture."
    ),
  ]),
];

// Sample paper 2: Adam optimizer
export const adamSections: PaperSection[] = [
  section("overview", "Overview", [
    p(
      "Adam (Adaptive Moment Estimation) is a first-order gradient-based optimization algorithm for stochastic objective functions, introduced by Kingma and Ba in 2014. It combines the advantages of two popular methods: AdaGrad and RMSProp."
    ),
  ]),
  section("why-this-matters", "Why This Matters", [
    p(
      "Adam adapts learning rates for each parameter based on estimates of first and second moments of the gradients. It is computationally efficient, requires little memory, and is invariant to diagonal rescaling of gradients — making it well-suited for large-scale machine learning."
    ),
  ]),
  section("algorithm", "Algorithm", [
    p(
      "The algorithm maintains exponential moving averages of the gradient $m_t$ and its square $v_t$:"
    ),
    math(
      "m_t = \\beta_1 m_{t-1} + (1 - \\beta_1) g_t",
      "block"
    ),
    math(
      "v_t = \\beta_2 v_{t-1} + (1 - \\beta_2) g_t^2",
      "block"
    ),
    p(
      "Bias-corrected estimates are then used to update parameters:"
    ),
    math(
      "\\theta_t = \\theta_{t-1} - \\alpha \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon}",
      "block"
    ),
    callout(
      "Default values are α = 0.001, β₁ = 0.9, β₂ = 0.999, ε = 10⁻⁸. These work well across many problems.",
      "info"
    ),
  ]),
  section("results", "Results", [
    p(
      "Empirically, Adam compares favorably to other adaptive learning methods and to stochastic gradient descent. It often achieves faster convergence on deep learning models including logistic regression, multilayer MNIST digit recognition, and convolutional neural networks."
    ),
  ]),
];

// Sample paper 3: BERT
export const bertSections: PaperSection[] = [
  section("overview", "Overview", [
    p(
      "BERT (Bidirectional Encoder Representations from Transformers) is a language representation model introduced by Devlin et al. at Google in 2018. Unlike prior models, BERT is designed to pretrain deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers."
    ),
  ]),
  section("key-concepts", "Key Concepts", [
    h(3, "Masked Language Modeling"),
    p(
      "BERT is pretrained using masked language modeling (MLM): some percentage of input tokens are masked at random, and the model must predict them based on context. This differs from traditional left-to-right language modeling."
    ),
    h(3, "Next Sentence Prediction"),
    p(
      "To handle relationships between sentences, BERT is also pretrained on a next sentence prediction task: given two sentences A and B, the model predicts whether B is the actual continuation of A."
    ),
  ]),
  section("results", "Results", [
    p(
      "BERT obtained state-of-the-art results on eleven natural language processing tasks, including GLUE, MultiNLI, and SQuAD. For example, it achieved an F1 score of 93.2 on SQuAD 1.1 and an Exact Match score of 83.1 on SQuAD 2.0."
    ),
  ]),
];

// Sample paper 4: ResNet
export const resnetSections: PaperSection[] = [
  section("overview", "Overview", [
    p(
      "Deep residual learning, introduced by He et al. in 2015, enables the training of very deep neural networks (up to 152 layers on ImageNet) through the use of residual connections."
    ),
  ]),
  section("problem", "Problem", [
    p(
      "When deeper networks started to saturate, training error increased — a problem known as the degradation problem. Adding more layers to a sufficiently deep plain network led to higher training error."
    ),
  ]),
  section("key-concepts", "Key Concepts", [
    p(
      "Instead of hoping each layer directly learns a desired underlying mapping $H(x)$, residual learning reformulates the problem: let the layer learn a residual function $F(x) = H(x) - x$, so the original mapping becomes $F(x) + x$."
    ),
    math(
      "y = F(x, \\{W_i\\}) + x",
      "block"
    ),
    p(
      "The shortcut connection performs identity mapping, adding the input directly to the output of the residual block. This makes optimization easier: if the optimal function is close to identity, pushing the residual toward zero is easier than fitting an identity through nonlinear layers."
    ),
  ]),
];

// Sample paper 5: Diffusion Models
export const diffusionSections: PaperSection[] = [
  section("overview", "Overview", [
    p(
      "Denoising diffusion probabilistic models learn to generate data by reversing a gradual noising process. They have become one of the dominant approaches for high-fidelity image synthesis."
    ),
  ]),
  section("methodology", "Methodology", [
    p(
      "The forward process gradually adds Gaussian noise to data over $T$ steps, producing $x_1, x_2, ..., x_T$ where $x_T$ is approximately pure noise:"
    ),
    math(
      "q(x_t | x_{t-1}) = \\mathcal{N}(x_t; \\sqrt{1 - \\beta_t} x_{t-1}, \\beta_t I)",
      "block"
    ),
    p(
      "A neural network is trained to reverse this process, predicting the noise added at each step. The loss simplifies to:"
    ),
    math(
      "L = \\mathbb{E}_{t, x_0, \\epsilon}\\left[\\|\\epsilon - \\epsilon_\\theta(x_t, t)\\|^2\\right]",
      "block"
    ),
  ]),
 section("results", "Results", [
    p(
      "Diffusion models achieve state-of-the-art image quality on benchmarks like FID and have powered systems like DALL·E 2, Imagen, and Stable Diffusion."
    ),
  ]),
];
