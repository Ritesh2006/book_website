const mongoose = require('mongoose');
const Paper = require('./src/models/Paper');
require('dotenv').config();

const papers = [
  { title: "Attention Is All You Need", author: "Ashish Vaswani et al.", field: "Computer Science", year: "2017", pdfUrl: "https://arxiv.org/pdf/1706.03762.pdf", description: "The groundbreaking paper introducing the Transformer architecture, which forms the basis for modern LLMs like GPT-4." },
  { title: "A Mathematical Theory of Communication", author: "Claude Shannon", field: "Information Theory", year: "1948", pdfUrl: "https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf", description: "The foundational paper of information theory, establishing limits on signal processing and communication." },
  { title: "Generative Adversarial Nets", author: "Ian Goodfellow et al.", field: "Machine Learning", year: "2014", pdfUrl: "https://arxiv.org/pdf/1406.2661.pdf", description: "Introduced the GAN framework, enabling computers to generate remarkably realistic images and data." },
  { title: "Adam: A Method for Stochastic Optimization", author: "Diederik P. Kingma, Jimmy Ba", field: "Deep Learning", year: "2014", pdfUrl: "https://arxiv.org/pdf/1412.6980.pdf", description: "Describes Adam, an algorithm for first-order gradient-based optimization of stochastic objective functions." },
  { title: "Deep Residual Learning for Image Recognition", author: "Kaiming He et al.", field: "Computer Vision", year: "2015", pdfUrl: "https://arxiv.org/pdf/1512.03385.pdf", description: "Introduced ResNet, which revolutionized training of very deep neural networks." },
  { title: "Mastering the game of Go with deep neural networks and tree search", author: "David Silver et al.", field: "Artificial Intelligence", year: "2016", pdfUrl: "https://www.nature.com/articles/nature16961", description: "AlphaGo's historic victory over human champion Lee Sedol." },
  { title: "BERT: Pre-training of Deep Bidirectional Transformers", author: "Jacob Devlin et al.", field: "NLP", year: "2018", pdfUrl: "https://arxiv.org/pdf/1810.04805.pdf", description: "Introduced BERT, a conceptually simple and empirically powerful language representation model." },
  { title: "YOLO9000: Better, Faster, Stronger", author: "Joseph Redmon, Ali Farhadi", field: "Computer Vision", year: "2017", pdfUrl: "https://arxiv.org/pdf/1612.08242.pdf", description: "State-of-the-art, real-time object detection system that can detect over 9000 object categories." },
  { title: "ImageNet Classification with Deep Convolutional Neural Networks", author: "Alex Krizhevsky et al.", field: "Computer Vision", year: "2012", pdfUrl: "https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf", description: "The AlexNet paper that kicked off the modern deep learning revolution in computer vision." },
  { title: "Language Models are Few-Shot Learners", author: "Tom B. Brown et al.", field: "Artificial Intelligence", year: "2020", pdfUrl: "https://arxiv.org/pdf/2005.14165.pdf", description: "The GPT-3 paper showcasing the immense capability of large-scale unsupervised language models." },
  { title: "The Anatomy of a Large-Scale Hypertextual Web Search Engine", author: "Sergey Brin, Lawrence Page", field: "Computer Science", year: "1998", pdfUrl: "http://infolab.stanford.edu/~backrub/google.html", description: "The original paper describing the architecture of Google." },
  { title: "Bitcoin: A Peer-to-Peer Electronic Cash System", author: "Satoshi Nakamoto", field: "Cryptography", year: "2008", pdfUrl: "https://bitcoin.org/bitcoin.pdf", description: "The whitepaper that introduced decentralized cryptocurrency to the world." },
  { title: "Molecular Structure of Nucleic Acids", author: "J.D. Watson, F.H.C. Crick", field: "Biology", year: "1953", pdfUrl: "https://www.nature.com/articles/171737a0.pdf", description: "The discovery of the double helix structure of DNA." },
  { title: "On the Electrodynamics of Moving Bodies", author: "Albert Einstein", field: "Physics", year: "1905", pdfUrl: "https://www.fourmilab.ch/etexts/einstein/specrel/www/", description: "Einstein's original paper on Special Relativity." },
  { title: "Does the Inertia of a Body Depend Upon Its Energy Content?", author: "Albert Einstein", field: "Physics", year: "1905", pdfUrl: "https://www.fourmilab.ch/etexts/einstein/E_mc2/www/", description: "The paper introducing the famous equation E=mc^2." },
  { title: "A Relational Model of Data for Large Shared Data Banks", author: "E. F. Codd", field: "Computer Science", year: "1970", pdfUrl: "https://www.seas.upenn.edu/~zives/03f/cis550/codd.pdf", description: "The foundational paper for all modern relational database systems." },
  { title: "The Google File System", author: "Sanjay Ghemawat et al.", field: "Distributed Systems", year: "2003", pdfUrl: "https://static.googleusercontent.com/media/research.google.com/en//archive/gfs-sosp2003.pdf", description: "A scalable distributed file system for large data-intensive applications." },
  { title: "MapReduce: Simplified Data Processing on Large Clusters", author: "Jeffrey Dean, Sanjay Ghemawat", field: "Distributed Systems", year: "2004", pdfUrl: "https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf", description: "The processing engine that fundamentally enabled big data analytics." },
  { title: "Dynamo: Amazon's Highly Available Key-value Store", author: "Giuseppe DeCandia et al.", field: "Distributed Systems", year: "2007", pdfUrl: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf", description: "Pioneered the architecture for highly available NoSQL key-value stores." },
  { title: "Playing Atari with Deep Reinforcement Learning", author: "Volodymyr Mnih et al.", field: "Reinforcement Learning", year: "2013", pdfUrl: "https://arxiv.org/pdf/1312.5602.pdf", description: "The initial paper demonstrating that deep learning could be combined with reinforcement learning." },
  { title: "A Method for Obtaining Digital Signatures", author: "R.L. Rivest, A. Shamir, L. Adleman", field: "Cryptography", year: "1978", pdfUrl: "https://people.csail.mit.edu/rivest/Rsapaper.pdf", description: "The RSA encryption algorithm, underpinning much of modern internet security." },
  { title: "Algorithms for Quantum Computation: Discrete Logarithms and Factoring", author: "Peter W. Shor", field: "Quantum Computing", year: "1994", pdfUrl: "https://arxiv.org/pdf/quant-ph/9508027.pdf", description: "Shor's algorithm, demonstrating that a quantum computer can break RSA encryption." },
  { title: "The Discovery of the Expanding Universe", author: "Edwin Hubble", field: "Astronomy", year: "1929", pdfUrl: "https://www.pnas.org/content/15/3/168.full", description: "Hubble's observations showing that the universe is expanding." },
  { title: "Observation of Gravitational Waves from a Binary Black Hole Merger", author: "B. P. Abbott et al. (LIGO)", field: "Physics", year: "2016", pdfUrl: "https://journals.aps.org/prl/pdf/10.1103/PhysRevLett.116.061102", description: "The first direct observation of gravitational waves, confirming Einstein's century-old prediction." },
  { title: "A Programmable Dual-RNA-Guided DNA Endonuclease in Adaptive Bacterial Immunity", author: "Martin Jinek et al.", field: "Genetics", year: "2012", pdfUrl: "https://www.science.org/doi/10.1126/science.1225829", description: "The foundational CRISPR paper detailing targeted genome editing capability." },
  { title: "Theory of Superconductivity", author: "J. Bardeen, L. N. Cooper, J. R. Schrieffer", field: "Physics", year: "1957", pdfUrl: "https://journals.aps.org/pr/pdf/10.1103/PhysRev.108.1175", description: "The BCS theory describing how superconductivity works at a microscopic level." },
  { title: "On the Action of the Penicillium notatum", author: "Alexander Fleming", field: "Medicine", year: "1929", pdfUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2048009/pdf/brjexpthopath00255-0037.pdf", description: "The discovery of penicillin, the first true antibiotic." },
  { title: "The perceptron: A probabilistic model for information storage", author: "F. Rosenblatt", field: "Artificial Intelligence", year: "1958", pdfUrl: "https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.335.3398&rep=rep1&type=pdf", description: "The first mathematical formulation of an artificial neural network." },
  { title: "Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm", author: "David Silver et al.", field: "Artificial Intelligence", year: "2017", pdfUrl: "https://arxiv.org/pdf/1712.01815.pdf", description: "AlphaZero paper detailing an AI that mastered multiple games starting from scratch." },
  { title: "Human-level control through deep reinforcement learning", author: "Volodymyr Mnih et al.", field: "Artificial Intelligence", year: "2015", pdfUrl: "https://www.nature.com/articles/nature14236", description: "DQN architecture paper demonstrating superhuman performance in Atari games." }
];

const seedPapers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for seeding papers...");
        
        // Clear existing papers to avoid duplicates
        await Paper.deleteMany({});
        console.log("Cleared existing papers.");

        await Paper.insertMany(papers);
        console.log(`Successfully seeded ${papers.length} research papers!`);
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedPapers();
