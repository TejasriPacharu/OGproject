import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaUsers, FaChartLine, FaTrophy } from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-4 py-16 text-center md:text-left">
          <div className="md:flex md:items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Master Coding Challenges</h1>
              <p className="text-xl text-white opacity-90 mb-8">
                Practice with thousands of coding problems, compete in contests, and advance your programming skills.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/register"
                  className="font-press btn-primary px-8 py-3 text-lg font-semibold rounded-md inline-block text-center"
                >
                  Get Started
                </Link>
                <Link 
                  to="/problems"
                  className="btn-outline-primary bg-transparent border-2 px-8 py-3 text-lg font-semibold rounded-md inline-block text-center text-white hover:bg-white hover:text-primary-600"
                >
                  Browse Problems
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
            <div className="flex justify-center items-center h-full"> 
            <img 
                  src="./image3.png"
                  alt="Coding Illustration" 
                  className="color-white h-40 rounded-md"
                />

            </div>
                
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="card hover-card p-6 flex flex-col items-center text-center">
              <div className="bg-primary-100 p-4 rounded-full mb-4">
                <FaCode className="text-4xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Diverse Problems</h3>
              <p className="text-gray-600">
                Access thousands of coding challenges across multiple programming languages and difficulty levels.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card hover-card p-6 flex flex-col items-center text-center">
              <div className="bg-primary-100 p-4 rounded-full mb-4">
                <FaUsers className="text-4xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Active Community</h3>
              <p className="text-gray-600">
                Join a vibrant community of programmers, share solutions, and learn from peer discussions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card hover-card p-6 flex flex-col items-center text-center">
              <div className="bg-primary-100 p-4 rounded-full mb-4">
                <FaChartLine className="text-4xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your skill development with detailed statistics, badges, and achievement tracking.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card hover-card p-6 flex flex-col items-center text-center">
              <div className="bg-primary-100 p-4 rounded-full mb-4">
                <FaTrophy className="text-4xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Regular Contests</h3>
              <p className="text-gray-600">
                Participate in weekly coding contests, compete globally, and win exciting prizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-800 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Boost Your Coding Skills?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of programmers who are advancing their careers through consistent practice and friendly competition.
          </p>
          <Link 
            to="/register"
            className="bg-white text-primary-700 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Sign Up Now — It's Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
