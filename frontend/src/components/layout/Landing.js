import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaUsers, FaChartLine, FaTrophy, FaArrowRight, FaFire, FaRocket } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const EmojiSpan = ({ children }) => (
  <span className="animate-bounce inline-block">{children}</span>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -10, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10">
      <div className="mb-4 inline-block rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3">
        <Icon className="text-3xl text-purple-400" />
      </div>
      <h3 className="mb-3 text-xl font-bold text-white flex items-center gap-2">
        {title} <FaFire className="text-orange-400 animate-pulse" />
      </h3>
      <p className="text-slate-300">{description}</p>
    </div>
  </motion.div>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.15),transparent)]" />
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-6xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Unlock Your Code Powers
                </span>{' '}
                <EmojiSpan>⚡</EmojiSpan>
              </h1>
              <p className="text-2xl text-slate-300 mb-8">
                No cap, level up your dev skills and join the most fire coding community rn
                <span className="ml-2">🔥</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/register">
                    <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-bold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2">
                      Start Grinding <FaRocket className="animate-bounce" />
                    </button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/problems">
                    <button className="w-full sm:w-auto px-8 py-4 bg-white/10 rounded-2xl font-bold text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                      Explore Challenges <FaArrowRight />
                    </button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.15),transparent)]" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Why We're Different <EmojiSpan>💯</EmojiSpan>
            </h2>
            <p className="text-xl text-slate-300">Stack your skills with the coolest coding platform fr fr</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={FaCode}
              title="Epic Problems"
              description="Tackle thousands of next-level coding challenges that hit different."
            />
            <FeatureCard
              icon={FaUsers}
              title="Squad Goals"
              description="Link up with the most based community of devs keeping it 💯."
            />
            <FeatureCard
              icon={FaChartLine}
              title="Level Up"
              description="Watch your skills go brr with detailed stats and achievements."
            />
            <FeatureCard
              icon={FaTrophy}
              title="Weekly Tourneys"
              description="Flex your skills in global competitions and secure the bag."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              Time to Pop Off <EmojiSpan>🚀</EmojiSpan>
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of devs who are already crushing it and building different.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/register">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2 mx-auto">
                  Start Your Journey <FaRocket className="animate-bounce" />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;