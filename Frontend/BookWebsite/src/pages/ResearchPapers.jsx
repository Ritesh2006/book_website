import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ExternalLink, Download, Search } from 'lucide-react';

const researchPapers = [
  { id: 1, title: "Attention Is All You Need", author: "Ashish Vaswani et al.", field: "Computer Science", year: "2017", pdfUrl: "https://arxiv.org/pdf/1706.03762.pdf", description: "The groundbreaking paper introducing the Transformer architecture, which forms the basis for modern LLMs like GPT-4." },
  { id: 2, title: "A Mathematical Theory of Communication", author: "Claude Shannon", field: "Information Theory", year: "1948", pdfUrl: "https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf", description: "The foundational paper of information theory, establishing limits on signal processing and communication." },
  { id: 3, title: "Generative Adversarial Nets", author: "Ian Goodfellow et al.", field: "Machine Learning", year: "2014", pdfUrl: "https://arxiv.org/pdf/1406.2661.pdf", description: "Introduced the GAN framework, enabling computers to generate remarkably realistic images and data." },
  { id: 4, title: "Adam: A Method for Stochastic Optimization", author: "Diederik P. Kingma, Jimmy Ba", field: "Deep Learning", year: "2014", pdfUrl: "https://arxiv.org/pdf/1412.6980.pdf", description: "Describes Adam, an algorithm for first-order gradient-based optimization of stochastic objective functions." },
  { id: 5, title: "Deep Residual Learning for Image Recognition", author: "Kaiming He et al.", field: "Computer Vision", year: "2015", pdfUrl: "https://arxiv.org/pdf/1512.03385.pdf", description: "Introduced ResNet, which revolutionized training of very deep neural networks." },
  { id: 6, title: "Mastering the game of Go with deep neural networks and tree search", author: "David Silver et al.", field: "Artificial Intelligence", year: "2016", pdfUrl: "https://www.nature.com/articles/nature16961", description: "AlphaGo's historic victory over human champion Lee Sedol." },
  { id: 7, title: "BERT: Pre-training of Deep Bidirectional Transformers", author: "Jacob Devlin et al.", field: "NLP", year: "2018", pdfUrl: "https://arxiv.org/pdf/1810.04805.pdf", description: "Introduced BERT, a conceptually simple and empirically powerful language representation model." },
  { id: 8, title: "YOLO9000: Better, Faster, Stronger", author: "Joseph Redmon, Ali Farhadi", field: "Computer Vision", year: "2017", pdfUrl: "https://arxiv.org/pdf/1612.08242.pdf", description: "State-of-the-art, real-time object detection system that can detect over 9000 object categories." },
  { id: 9, title: "ImageNet Classification with Deep Convolutional Neural Networks", author: "Alex Krizhevsky et al.", field: "Computer Vision", year: "2012", pdfUrl: "https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf", description: "The AlexNet paper that kicked off the modern deep learning revolution in computer vision." },
  { id: 10, title: "Language Models are Few-Shot Learners", author: "Tom B. Brown et al.", field: "Artificial Intelligence", year: "2020", pdfUrl: "https://arxiv.org/pdf/2005.14165.pdf", description: "The GPT-3 paper showcasing the immense capability of large-scale unsupervised language models." },
  { id: 11, title: "The Anatomy of a Large-Scale Hypertextual Web Search Engine", author: "Sergey Brin, Lawrence Page", field: "Computer Science", year: "1998", pdfUrl: "http://infolab.stanford.edu/~backrub/google.html", description: "The original paper describing the architecture of Google." },
  { id: 12, title: "Bitcoin: A Peer-to-Peer Electronic Cash System", author: "Satoshi Nakamoto", field: "Cryptography", year: "2008", pdfUrl: "https://bitcoin.org/bitcoin.pdf", description: "The whitepaper that introduced decentralized cryptocurrency to the world." },
  { id: 13, title: "Molecular Structure of Nucleic Acids", author: "J.D. Watson, F.H.C. Crick", field: "Biology", year: "1953", pdfUrl: "https://www.nature.com/articles/171737a0.pdf", description: "The discovery of the double helix structure of DNA." },
  { id: 14, title: "On the Electrodynamics of Moving Bodies", author: "Albert Einstein", field: "Physics", year: "1905", pdfUrl: "https://www.fourmilab.ch/etexts/einstein/specrel/www/", description: "Einstein's original paper on Special Relativity." },
  { id: 15, title: "Does the Inertia of a Body Depend Upon Its Energy Content?", author: "Albert Einstein", field: "Physics", year: "1905", pdfUrl: "https://www.fourmilab.ch/etexts/einstein/E_mc2/www/", description: "The paper introducing the famous equation E=mc^2." },
  { id: 16, title: "A Relational Model of Data for Large Shared Data Banks", author: "E. F. Codd", field: "Computer Science", year: "1970", pdfUrl: "https://www.seas.upenn.edu/~zives/03f/cis550/codd.pdf", description: "The foundational paper for all modern relational database systems." },
  { id: 17, title: "The Google File System", author: "Sanjay Ghemawat et al.", field: "Distributed Systems", year: "2003", pdfUrl: "https://static.googleusercontent.com/media/research.google.com/en//archive/gfs-sosp2003.pdf", description: "A scalable distributed file system for large data-intensive applications." },
  { id: 18, title: "MapReduce: Simplified Data Processing on Large Clusters", author: "Jeffrey Dean, Sanjay Ghemawat", field: "Distributed Systems", year: "2004", pdfUrl: "https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf", description: "The processing engine that fundamentally enabled big data analytics." },
  { id: 19, title: "Dynamo: Amazon's Highly Available Key-value Store", author: "Giuseppe DeCandia et al.", field: "Distributed Systems", year: "2007", pdfUrl: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf", description: "Pioneered the architecture for highly available NoSQL key-value stores." },
  { id: 20, title: "Playing Atari with Deep Reinforcement Learning", author: "Volodymyr Mnih et al.", field: "Reinforcement Learning", year: "2013", pdfUrl: "https://arxiv.org/pdf/1312.5602.pdf", description: "The initial paper demonstrating that deep learning could be combined with reinforcement learning." },
  { id: 21, title: "A Method for Obtaining Digital Signatures", author: "R.L. Rivest, A. Shamir, L. Adleman", field: "Cryptography", year: "1978", pdfUrl: "https://people.csail.mit.edu/rivest/Rsapaper.pdf", description: "The RSA encryption algorithm, underpinning much of modern internet security." },
  { id: 22, title: "Algorithms for Quantum Computation: Discrete Logarithms and Factoring", author: "Peter W. Shor", field: "Quantum Computing", year: "1994", pdfUrl: "https://arxiv.org/pdf/quant-ph/9508027.pdf", description: "Shor's algorithm, demonstrating that a quantum computer can break RSA encryption." },
  { id: 23, title: "The Discovery of the Expanding Universe", author: "Edwin Hubble", field: "Astronomy", year: "1929", pdfUrl: "https://www.pnas.org/content/15/3/168.full", description: "Hubble's observations showing that the universe is expanding." },
  { id: 24, title: "Observation of Gravitational Waves from a Binary Black Hole Merger", author: "B. P. Abbott et al. (LIGO)", field: "Physics", year: "2016", pdfUrl: "https://journals.aps.org/prl/pdf/10.1103/PhysRevLett.116.061102", description: "The first direct observation of gravitational waves, confirming Einstein's century-old prediction." },
  { id: 25, title: "A Programmable Dual-RNA-Guided DNA Endonuclease in Adaptive Bacterial Immunity", author: "Martin Jinek et al.", field: "Genetics", year: "2012", pdfUrl: "https://www.science.org/doi/10.1126/science.1225829", description: "The foundational CRISPR paper detailing targeted genome editing capability." },
  { id: 26, title: "Theory of Superconductivity", author: "J. Bardeen, L. N. Cooper, J. R. Schrieffer", field: "Physics", year: "1957", pdfUrl: "https://journals.aps.org/pr/pdf/10.1103/PhysRev.108.1175", description: "The BCS theory describing how superconductivity works at a microscopic level." },
  { id: 27, title: "On the Action of the Penicillium notatum", author: "Alexander Fleming", field: "Medicine", year: "1929", pdfUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2048009/pdf/brjexpthopath00255-0037.pdf", description: "The discovery of penicillin, the first true antibiotic." },
  { id: 28, title: "The perceptron: A probabilistic model for information storage", author: "F. Rosenblatt", field: "Artificial Intelligence", year: "1958", pdfUrl: "https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.335.3398&rep=rep1&type=pdf", description: "The first mathematical formulation of an artificial neural network." },
  { id: 29, title: "Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm", author: "David Silver et al.", field: "Artificial Intelligence", year: "2017", pdfUrl: "https://arxiv.org/pdf/1712.01815.pdf", description: "AlphaZero paper detailing an AI that mastered multiple games starting from scratch." },
  { id: 30, title: "Human-level control through deep reinforcement learning", author: "Volodymyr Mnih et al.", field: "Artificial Intelligence", year: "2015", pdfUrl: "https://www.nature.com/articles/nature14236", description: "DQN architecture paper demonstrating superhuman performance in Atari games." }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.4 } }
};

const ResearchPapers = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPapers = researchPapers.filter(paper => 
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    paper.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
          Research Papers Database
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: 0 }}>
          Explore 30 highly valuable, groundbreaking scientific and technical papers meticulously collected from Google Scholar, Wikipedia, and global academic hubs.
        </p>

        <div style={{ position: 'relative', maxWidth: '500px', marginTop: '1rem' }}>
          <Search size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search papers by title, author, or field..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3.5rem',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontSize: '1rem',
              fontWeight: 500,
              outline: 'none',
              boxShadow: 'var(--shadow)',
              transition: 'border-color 0.2s'
            }}
          />
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem'
        }}
      >
        {filteredPapers.length > 0 ? filteredPapers.map((paper) => (
          <motion.div 
            key={paper.id} 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="premium-card" 
            style={{ 
              padding: '1.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              background: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '0.8rem', 
                borderRadius: '12px' 
              }}>
                <FileText size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {paper.field} • {paper.year}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.25rem', lineHeight: 1.3 }}>
                  {paper.title}
                </h3>
              </div>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, lineHeight: 1.6 }}>
              {paper.description}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{paper.author}</span>
              <button 
                onClick={() => window.open(paper.pdfUrl, '_blank')}
                style={{
                  background: 'transparent',
                  color: 'var(--primary)',
                  border: '1px solid var(--primary)',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'var(--primary)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--primary)';
                }}
              >
                Read PDF <ExternalLink size={16} />
              </button>
            </div>
          </motion.div>
        )) : (
          <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
             <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-muted)' }}>No research papers found.</h3>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResearchPapers;
