import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaUsers, FaChartLine, FaTrophy, FaArrowRight, FaTerminal, FaGithub, FaBolt } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Refined animation variants for consistency
const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const FeatureCard = ({ icon: Icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    className="group relative rounded-2xl bg-slate-800/40 p-8 border border-slate-700/50 hover:border-slate-600/80 transition-all duration-500 hover:bg-slate-800/60"
  >
    {/* Subtle gradient overlay on hover */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10">
      {/* Icon container */}
      <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/20">
        <Icon className="text-xl text-purple-400" />
      </div>
      
      <h3 className="mb-3 text-lg font-semibold text-white tracking-tight">
        {title}
      </h3>
      <p className="text-slate-400 text-[15px] leading-relaxed">
        {description}
      </p>
    </div>
  </motion.div>
);

const StatCard = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
      {value}
    </div>
    <div className="text-slate-400 text-sm font-medium">{label}</div>
  </div>
);

const Landing = () => {
  const features = [
    {
      icon: FaCode,
      title: "Curated Problem Sets",
      description: "Thousands of algorithmic challenges across all difficulty levels, from fundamentals to advanced system design."
    },
    {
      icon: FaUsers,
      title: "Active Community",
      description: "Connect with developers worldwide. Share solutions, discuss approaches, and learn from top performers."
    },
    {
      icon: FaChartLine,
      title: "Progress Analytics",
      description: "Track your improvement with detailed statistics, skill assessments, and personalized learning paths."
    },
    {
      icon: FaTrophy,
      title: "Weekly Contests",
      description: "Compete in timed challenges. Climb the global leaderboard and earn recognition for your skills."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white antialiased">
      {/* Background gradient elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-500/8 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              {/* Badge */}
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700/60 mb-8"
              >
                <FaBolt className="text-purple-400 text-sm" />
                <span className="text-sm text-slate-300 font-medium">Trusted by 50,000+ developers</span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.1]"
              >
                <span className="text-white">Master algorithms.</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  Ace your interviews.
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                Practice coding problems, prepare for technical interviews, and join a community of developers committed to continuous improvement.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-shadow duration-300 flex items-center justify-center gap-2"
                  >
                    Get Started Free
                    <FaArrowRight className="text-sm" />
                  </motion.button>
                </Link>
                <Link to="/problems">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl font-semibold text-white hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaTerminal className="text-sm text-slate-400" />
                    Browse Problems
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 pt-12 border-t border-slate-800/60"
            >
              <div className="grid grid-cols-3 gap-8">
                <StatCard value="2,500+" label="Problems" />
                <StatCard value="150K+" label="Submissions" />
                <StatCard value="50K+" label="Users" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              A comprehensive platform built by developers, for developers.
            </p>
          </motion.div>

          {/* Features grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section className="relative py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                Write code.
                <br />
                <span className="text-slate-400">Get instant feedback.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Our integrated code editor supports multiple languages with real-time syntax highlighting, auto-completion, and instant test execution. Focus on solving problems, not fighting tools.
              </p>
              <ul className="space-y-4">
                {['15+ programming languages', 'Real-time code execution', 'Detailed test case analysis', 'Performance benchmarks'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right: Code preview mockup */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 overflow-hidden shadow-2xl shadow-slate-900/50">
                {/* Editor header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="ml-3 text-sm text-slate-400 font-mono">solution.py</span>
                </div>
                {/* Code content */}
                <div className="p-6 font-mono text-sm">
                  <div className="space-y-1">
                    <div>
                      <span className="text-purple-400">def</span>
                      <span className="text-pink-400"> two_sum</span>
                      <span className="text-slate-300">(nums, target):</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-slate-500">"""Find indices of two numbers that add up to target."""</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-slate-300">seen = {'{}'}</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-purple-400">for</span>
                      <span className="text-slate-300"> i, num </span>
                      <span className="text-purple-400">in</span>
                      <span className="text-slate-300"> enumerate(nums):</span>
                    </div>
                    <div className="pl-8">
                      <span className="text-slate-300">complement = target - num</span>
                    </div>
                    <div className="pl-8">
                      <span className="text-purple-400">if</span>
                      <span className="text-slate-300"> complement </span>
                      <span className="text-purple-400">in</span>
                      <span className="text-slate-300"> seen:</span>
                    </div>
                    <div className="pl-12">
                      <span className="text-purple-400">return</span>
                      <span className="text-slate-300"> [seen[complement], i]</span>
                    </div>
                    <div className="pl-8">
                      <span className="text-slate-300">seen[num] = i</span>
                    </div>
                  </div>
                </div>
                {/* Result bar */}
                <div className="px-4 py-3 bg-green-500/10 border-t border-green-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-green-400 text-sm font-medium">All test cases passed</span>
                    <span className="ml-auto text-slate-500 text-sm">Runtime: 4ms</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 p-12 md:p-16 text-center overflow-hidden"
          >
            {/* Background accent */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Ready to level up your skills?
              </h2>
              <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                Join thousands of developers who are improving their coding abilities every day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-shadow duration-300"
                  >
                    Create Free Account
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-3.5 bg-slate-700/50 border border-slate-600/50 rounded-xl font-semibold text-white hover:bg-slate-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaGithub />
                  Continue with GitHub
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-slate-800/60">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <FaCode className="text-purple-400 text-xl" />
              <span className="font-bold text-lg">CodePlatform</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-slate-400">
              <Link to="/problems" className="hover:text-white transition-colors">Problems</Link>
              <Link to="/contests" className="hover:text-white transition-colors">Contests</Link>
              <Link to="/discuss" className="hover:text-white transition-colors">Discuss</Link>
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
            </div>
            <div className="text-sm text-slate-500">
              © 2025 CodePlatform. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;