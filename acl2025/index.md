# ACL 2025 Reflections

I wanted to share some reflections and ideas from [ACL 2025](https://2025.aclweb.org/) Conference (Association for Computation Linguistics), a machine-learning conference focused on text understanding.

# Overall Reflections

Academically-inclined ML conferences can feel like a music festival (whoops, did I go to the [wrong ACL](https://www.aclfestival.com/)?!) — you can get burned out after three days, especially if you give into your FOMO and try to see everything and just end up running from stage to stage and miss it all. But here’s what I did see!

## LLM everything

Pardon me, but have you heard about this thing called AI? Or how about this thing called an “LLM”? LLM’s totally dominated the conference. From the keynote,

`67% of papers have "LLM" in their title/abstract`

## Benchmarks (+ skepticism of them)

A lot of focus was put on benchmarking existing SOTA models through various tasks and datasets. It seems that broadly there is an inherent skepticism of existing benchmarks and evaluations for LLMs as there has been a lot of data leakage, hyper-parameter gaming, few shot prompting over-optimization, etc, that has led to people not being able to trust reported results.

I was surprised by how much work was focused on simply evaluating these foundational models on various tasks and biases and measuring this bias, rather than understanding the root sources of the bias or proposing solutions.

## Academia vs Industry // Foundational Models vs Small Players

The majority of folks at the conference seemed to be coming from academia and university associations, maybe two-thirds attendees from academia I would estimate.

Shifts in the political climate in the US were discussed and how that’s leading to less grant money.

Regardless of whether someone is in academia or industry, we all seem to be beholden to the Big Companies who are training foundational models, most importantly because the smaller groups simply do not have enough computational resources available to compete.

There was also an under-current of tension throughout the conference between the more classical computational linguistics approach to NLP, and the new guard of “just throw an LLM at it”. Some dismay was expressed at the over-focus on solely LLM performance and benchmarking without the fundamental understandings of what these LLM’s are doing.

# Interesting Papers (by theme)

Here are the broad themes I noticed and some posters/papers I saw that looked cool.

(Also, here’s a link to all the [official conference’s voted best papers](https://2025.aclweb.org/program/awards/).)

---

*★ for especially interesting papers/posters*

## Architectures & Efficiency

How can we keep scaling and make it affordable to do so? Faster fine-tunes, longer context windows, and tokenization alternatives. (TBH this conference seemed pretty light on new architectures. Maybe people are just happy to stick with transformers [for now]?)

- ★ **ModernBERT — Smarter, Better, Faster, Longer**: A modernized encoder-only model with strong gains over classic BERT (longer context, better downstream, faster). [Answer.ai / Jeremy Howard] [ACL Anthology](https://aclanthology.org/2025.acl-long.127/)
- ★ **Native Sparse Attention: Hardware-Aligned and Natively Trainable Sparse Attention** (**ACL Best Paper Award**) [Deepseek, although is this work already old news?] [ACL Anthology](https://aclanthology.org/2025.acl-long.1126/)
- **Byte Latent Transformer (BLT) Patches Scale Better Than Tokens**: Tokenizer-free — BLT encodes bytes into dynamically sized patches, which serve as the primary units of computation. Patches are segmented based on the entropy of the next byte, allocating more compute and model capacity where increased data complexity demands it. … BLT shows significantly better scaling than tokenization-based models [Meta. Keynote from [Luke Zettlemoyer](https://scholar.google.com/citations?user=UjpbO6IAAAAJ&hl=en) implied this might be a future direction for LLaMA?]
[ACL Anthology](https://aclanthology.org/2025.acl-long.453/). Here’s an image that kinda explains it:

    ![image.png](ACL%202025%20Reflections%2025c106a9324280728e43e5d01c17d9f6/image.png)

- **Run LoRA Run**: Practical LoRA implementation tricks that speed up fine-tuning by 10-28% without hurting accuracy. [ACL Anthology](https://aclanthology.org/2025.acl-industry.15/)

---

## Alignment & Bias

- ★ **Aligned but Blind**: **Alignment Increases Implicit Bias by Reducing Awareness of Race**: `Alignment suprisingly amplifies implicit bias in model outputs... [Models] overlook racial concepts in early internal representations,,. We propose incentizing the representation of racial concepts in early model layers...Similar to race blindness in humans, ignoring racial nuances can indadvertantly perpetuate subtle biases in LMs.`[ACL Anthology](https://aclanthology.org/2025.acl-long.1078/)
- **Fairness through Difference Awareness**: Introduces a metric for *desired* group discrimination when some differential treatment is actually the goal (e.g., equity-aware systems). [**ACL Best Paper Award**] [ACL Anthology](https://aclanthology.org/2025.acl-long.341/)
- **Language Models Resist Alignment: Evidence from Data Compression**: Evidence that alignment doesn’t fully overwrite pretraining. [**ACL Best Paper Winner**] https://aclanthology.org/2025.acl-long.1141/

---

## Agents (+ [REALM](https://realm-workshop.github.io/) workshop)

Agents are still pretty hot. Agent calling and using tool calls were themes during the Thursday workshop on Agents — [REALM (Research on Agent Language Models) Workshop](https://realm-workshop.github.io/)

- [**Chris Manning presentation - LinkedIn**](https://www.linkedin.com/posts/gaurikholkar_full-house-at-chris-mannings-talk-on-linguistic-activity-7356666193107107840-JxkY/)
- **NNetNav**: Unsupervised browser agents that learn via in-the-wild interaction; this feels like the tech behind the recently released [Claude for Chrome](https://www.anthropic.com/news/claude-for-chrome). [presented by Christoper Manning] https://arxiv.org/abs/2410.02907
- [**Synthetic Data Generation & Multi-Step RL for Reasoning + Tool Use**, Anna Goldie](https://arxiv.org/abs/2504.04736) - not from ACL actually but interesting nonetheless!
- ★ **[*Automating AI Research: How Far Are We?](http://iclr.cc/virtual/2025/37268)** [*Roberta Raileanu, Google**]** *(Seemingly the same talk + video but from ICLR)*

---

## Prompting, and the automation of it

Can we automate prompt engineering? How do we get observability into LLM’s?

- ★ **PromptWizard**: **Optimizing Prompts via Task-Aware, Feedback-Driven Self Evolution:** fully automated framework for discrete prompt optimization, utilizing a self evolving, self-adapting mechanism. [Microsoft] https://aclanthology.org/2025.findings-acl.1025/
- **SCULPT: Systematic Tuning of Long Prompts:** Structured tuning for *very long* prompts—systematic ways to adjust and compress long prompt scaffolds. https://aclanthology.org/2025.acl-long.730/
- **MExGen Multi-Level Explanations for Generative Language Models:** Multi-level explanations that attribute generated outputs to parts of the context; extends SHAP ideas to LLM generation. https://aclanthology.org/2025.acl-long.1553.pdf

---

## SLM ↔︎ LLM in Practice (where smaller models win)

Pattern: Use a foundational model to generate synthetic data → fine tune a LLaMA ~8B model → achieve same performance as few-shotting on the foundational model

- **TOOLFLOW: Boosting LLM Tool-Calling Through Natural and Coherent Dialogue Synthesis:** `We apply SFT on LLaMA3.1-8B using 8,000 synthetic dialogues generated with TOOLFLOW. Results show that the model achieves tool-calling performance comparable to or even surpassing GPT-4, while maintaining strong general capabilities.` https://aclanthology.org/2025.naacl-long.214/
- **Rethinking Low-Resource MT: The Surprising Effectiveness of
Fine-Tuned Multilingual Models in the LLM Age:** https://aclanthology.org/2025.nodalida-1.62/?utm_source=chatgpt.com
- **PiFi: Plug-in & Fine-tuning**: Graft a single LLaMA layer after BERT. https://aclanthology.org/2025.acl-long.271/
- Also tagging this very related blog post shared by Jonathan Jin about a similar topic. https://www.tensorzero.com/blog/fine-tuned-small-llms-can-beat-large-ones-at-5-30x-lower-cost-with-programmatic-data-curation/

⚠️ But note this pattern has limitations — it doesn’t work on really small models like LLaMA 1B / BERT (models are just too small)!

- **Small Language Models in the Real World: Insights from Industrial Text Classification:** `While the volume of training data has a significant impact on classification performance, the model’s intrinsic understanding of domain-specific textual content also plays a critical role and can become a major bottleneck in achieving high accuracy.` [ACL Anthology](https://aclanthology.org/2025.acl-industry.68/)

---

## Tools for Researchers

Tools for researchers + engineers to find papers.

- **Scholar Inbox: Personalized Paper Recommendations for Scientists:**   https://aclanthology.org/2025.acl-demo.30/
- **PaSa: LLM Agent for Paper Search**: https://aclanthology.org/2025.acl-long.572/

---

## Evaluation

- **Can External Validation Tools Improve LLM-as-a-Judge?** (Apple): Tool-assisted judging improves annotation quality versus pure LLM-judges. Maybe useful for LLM-as-a-Judge pipelines. https://aclanthology.org/2025.acl-long.779/
- **Is That Your Final Answer? Test-Time Scaling for Selective QA**: https://aclanthology.org/2025.acl-short.50/

---

## 😎 Random interesting stuff 🆒

- 🐶 **Toward Automatic Discovery of a Canine Phonetic Alphabet** 🐶https://aclanthology.org/2025.acl-long.451.pdf
- **Multi-Hop Reasoning for Question Answering with Hyperbolic Representations**: non-Euclidian geometry in ML! `Our findings suggest that hyperbolic representations can be significantly more advantageous when the datasets exhibit a more hierarchical
structure.` https://aclanthology.org/2025.findings-acl.908/
- ★ **HotelMatch-LLM: Joint Multi-Task Training of Small and Large Language Models for Efficient Multimodal Hotel Retrieval**: Asymmetric dense retrieval—SLM for live queries, LLM for document embeddings—delivers efficient natural-language hotel search. Effectively an application of semantic search. [ACL Anthology](https://aclanthology.org/2025.acl-long.30/)
    - I spoke with the authors, they were nice and offered to chat if we reached out!
- **Tunable LLM-based Proactive Recommendation Agent**: Actor-Critic agent that proactively explores user interests and optimizes long-term rewards. https://aclanthology.org/2025.acl-long.944/
