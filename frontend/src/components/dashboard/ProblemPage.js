import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { FaCheckCircle, FaFileAlt, FaSadTear, FaRobot, FaChartBar, FaCode, FaLightbulb } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';

const ProblemPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    // State management
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [output, setOutput] = useState('');
    const [status, setStatus] = useState('');
    const [verdict, setVerdict] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showCustomCheck, setShowCustomCheck] = useState(false);
    const [customCode, setCustomCode] = useState('');
    const [customLang, setCustomLang] = useState('cpp');
    const [customInput, setCustomInput] = useState('');
    const [customOutput, setCustomOutput] = useState('');
    const [isCustomRunning, setIsCustomRunning] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [codeAnalysis, setCodeAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await axios.get(`${process.env.BACKEND_URI}/api/problems/${id}`);
                setProblem(response.data);
                
                // Set initial code stub based on selected language
                if (response.data.codeStubs && response.data.codeStubs.length > 0) {
                    const stub = response.data.codeStubs[0];
                    setCode(stub[language] || '');
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching problem:', error);
                setError(error.response?.data?.message || error.message || 'Failed to fetch problem details');
                setLoading(false);
            }
        };
        fetchProblem();
    }, [id, language]);

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        // Update code stub when language changes
        if (problem && problem.codeStubs && problem.codeStubs.length > 0) {
            const stub = problem.codeStubs[0];
            setCode(stub[e.target.value] || '');
        }
    };

    const handleEditorChange = (value) => {
        setCode(value);
    };

    const showToast = (message, type = 'success') => {
        toast[type](message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput('');
        setStatus('Running...');
        setVerdict('');
        
        try {
            const response = await axios.post(`${process.env.BACKEND_URI}/api/code/run`, {
                problemId: problem._id,
                code,
                language
            });
            
            setOutput(response.data.output);
            setStatus('Completed');
            setIsRunning(false);
            showToast('Code executed successfully!');
        } catch (error) {
            console.error('Error running code:', error);
            setOutput(error.response?.data?.error || 'Error running code');
            setStatus('Error');
            setIsRunning(false);
            showToast('Error running code', 'error');
        }
    };

    const submitCode = async () => {
        setIsSubmitting(true);
        setOutput('');
        setStatus('Submitting...');
        setVerdict('');
        
        try {
            const response = await axios.post(`${process.env.BACKEND_URI}/api/code/submit`, {
                problemId: problem._id,
                userId: user.id,
                code,
                language
            });
            
            const { submission } = response.data;
            setOutput(submission.output);
            setStatus(submission.status);
            setVerdict(submission.verdict);
            setIsSubmitting(false);

            if(submission.status === 'solved') {
                showToast('🎉 Problem solved successfully!');
                // Request AI analysis after successful submission
                analyzeCode();
            } else if(submission.verdict === 'Wrong Answer') {
                showToast('Keep trying! Your solution needs some work.', 'warning');
                // Still offer analysis for wrong answers
                analyzeCode();
            } else if(submission.verdict === 'Compilation Error') {
                showToast('Check your code for compilation errors', 'error');
            }
        } catch (error) {
            console.error('Error submitting code:', error);
            setOutput(error.response?.data?.error || 'Error submitting solution');
            setStatus('Error');
            setVerdict('Error');
            setIsSubmitting(false);
            showToast('Error submitting code', 'error');
        }
    };

    const analyzeCode = async () => {
        // Don't analyze if code is empty
        if (!code.trim()) {
            showToast('Cannot analyze empty code', 'warning');
            return;
        }

        setIsAnalyzing(true);
        showToast('🤖 AI is analyzing your code...', 'info');
        
        try {
            const response = await axios.post(`${process.env.BACKEND_URI}/api/code/analyze`, {
                problemId: problem._id,
                code,
                language
            });
            console.log("=============================================");
            console.log(response.data);
            setCodeAnalysis(response.data.analysis);
            console.log("")
            setIsAnalyzing(false);
            setShowAnalysis(true);
        } catch (error) {
            console.error('Error analyzing code:', error);
            setIsAnalyzing(false);
            showToast('Failed to analyze code', 'error');
        }
    };

    // Function to render the code quality score with color
    const renderQualityScore = (score) => {
        let colorClass = 'text-yellow-400';
        
        if (score >= 8) {
            colorClass = 'text-green-400';
        } else if (score <= 4) {
            colorClass = 'text-red-400';
        }
        
        return (
            <div className="flex items-center">
                <span className={`text-4xl font-bold ${colorClass}`}>{score}</span>
                <span className="text-sm text-slate-400 ml-2">/10</span>
            </div>
        );
    };

    // Add back the missing handleCustomCheck function
    const handleCustomCheck = async () => {
        setIsCustomRunning(true);
        setCustomOutput('');
        try {
            const response = await axios.post(`${process.env.BACKEND_URI}/api/code/custom-check`, {
                problemId: problem._id,
                code: customCode,
                language: customLang,
                input: customInput,
            });
            setCustomOutput(response.data.output || response.data.error || '');
            setIsCustomRunning(false);
        } catch (error) {
            setCustomOutput(error.response?.data?.error || 'Error running custom code');
            setIsCustomRunning(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 flex justify-center items-center min-h-[500px]">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-lg text-gray-700">Loading problem...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Problem Not Found</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex justify-center gap-4">
                        <button 
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all">
                            Go Back
                        </button>
                        <button 
                            onClick={() => navigate('/problems')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                            All Problems
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-white px-1 md:px-4 py-4">
            <div className="w-full">
                {/* Top Nav Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/problems')}
                        className="flex items-center bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-600 transition-all font-semibold"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Problems
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Problem Description */}
                    <div className="lg:col-span-6">
                        <div className="bg-gradient-to-br from-slate-700/60 to-slate-900/80 rounded-2xl p-3 md:p-4 shadow-xl border border-slate-700/60 backdrop-blur-xl max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-3xl text-left font-extrabold text-white flex items-center gap-2">
                                    {problem.title}
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</span>
                                    {problem.solvedBy?.includes(String(user.id)) && (
                                        <FaCheckCircle className="text-green-400 ml-1" />
                                    )}
                                </h1>
                            </div>

                            <div className="mb-4 flex flex-wrap gap-2">
                                {problem.tags?.map((tag, index) => (
                                    <span key={index} className="bg-purple-600/20 border border-purple-400/30 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mb-6">
                                <h3 className="text-left text-lg font-bold mb-2 text-purple-300">Description</h3>
                                <div className="text-left text-slate-200 whitespace-pre-line leading-relaxed">
                                    {showFullDescription ? problem.description : (problem.description.slice(0, 300) + (problem.description.length > 300 ? '...' : ''))}
                                    {problem.description.length > 300 && (
                                        <button
                                            onClick={() => setShowFullDescription(!showFullDescription)}
                                            className="ml-2 text-purple-400 hover:underline font-semibold"
                                        >
                                            {showFullDescription ? 'Show Less' : 'Read More'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {problem.constraints && (
                                <div className="mb-6">
                                    <h3 className="text-left text-lg font-bold mb-2 text-blue-300">Constraints</h3>
                                    <div className="text-left bg-slate-800/70 p-4 rounded-lg text-blue-200 whitespace-pre-line font-mono text-sm border border-blue-500/20">
                                        {problem.constraints}
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-left text-lg font-bold mb-2 text-green-300">Examples</h3>
                                {problem.testCases?.filter(tc => tc.sample).map((testCase, index) => (
                                    <div key={index} className="mb-4 border border-green-500/20 rounded-xl overflow-hidden bg-gradient-to-br from-green-800/40 to-slate-900/40">
                                        <div className="px-4 py-2 border-b border-green-500/10 text-green-200 font-semibold">Example {index + 1}</div>
                                        <div className="p-4">
                                            <div className="mb-3">
                                                <span className="text-left font-medium text-green-300 block mb-1">Input:</span>
                                                <pre className="text-left bg-black/30 p-3 rounded-lg overflow-x-auto text-sm font-mono text-green-100">{testCase.input}</pre>
                                            </div>
                                            <div className="mb-3">
                                                <span className="text-left font-medium text-green-300 block mb-1">Output:</span>
                                                <pre className="text-left bg-black/30 p-3 rounded-lg overflow-x-auto text-sm font-mono text-green-100">{testCase.output}</pre>
                                            </div>
                                            {testCase.explanation && (
                                                <div>
                                                    <span className="text-left font-medium text-green-300 block mb-1">Explanation:</span>
                                                    <div className="text-left text-green-100 text-sm">{testCase.explanation}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Code Editor & Output */}
                    <div className="lg:col-span-6 flex flex-col gap-8">
                        {/* Editor Card */}
                        <div className="bg-gradient-to-br from-slate-700/60 to-slate-900/80 rounded-2xl p-3 md:p-4 shadow-xl border border-slate-700/60 backdrop-blur-xl max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex gap-2 items-center">
                                    <label htmlFor="language" className="font-semibold text-purple-300">Language:</label>
                                    <select
                                        id="language"
                                        value={language}
                                        onChange={handleLanguageChange}
                                        className="bg-slate-800 border border-purple-600/30 rounded-lg px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="cpp">C++</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                        <option value="javascript">JavaScript</option>
                                    </select>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={runCode}
                                        disabled={isRunning || isSubmitting}
                                        className="px-5 py-2 mb-2 bg-gradient-to-r from-green-500 to-green-400 text-white rounded-xl font-bold shadow-lg hover:from-green-600 hover:to-green-500 transition-all flex items-center gap-2 disabled:opacity-60"
                                    >
                                        {isRunning ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-green-300 border-t-transparent rounded-full mr-2"></div>
                                                Running
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Run Code
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={submitCode}
                                        disabled={isRunning || isSubmitting}
                                        className="px-5 py-2 mb-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-bold shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all flex items-center gap-2 disabled:opacity-60"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-purple-300 border-t-transparent rounded-full mr-2"></div>
                                                Submitting
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Submit
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowCustomCheck(true);
                                            setCustomLang(language);
                                            setCustomCode(code);
                                            setCustomInput('');
                                            setCustomOutput('');
                                        }}
                                        className="px-5 py-2 mb-2 bg-purple-600 text-white rounded-xl font-bold shadow-lg hover:bg-purple-700 transition-all flex items-center gap-2"
                                    >
                                        Custom Check
                                    </button>
                                    <button
                                        onClick={analyzeCode}
                                        disabled={isAnalyzing || !code.trim()}
                                        className="px-5 py-2 mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2 disabled:opacity-60"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-blue-300 border-t-transparent rounded-full mr-2"></div>
                                                Analyzing
                                            </>
                                        ) : (
                                            <>
                                                <FaRobot className="mr-1" />
                                                Analyze Code
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="rounded-xl overflow-hidden border border-slate-700">
                                <Editor
                                    height="420px"
                                    theme="vs-dark"
                                    language={language}
                                    value={code}
                                    onChange={handleEditorChange}
                                    options={{ fontSize: 16, minimap: { enabled: false }, fontFamily: 'Fira Mono, monospace' }}
                                />
                            </div>
                        </div>

                        {/* Output Card */}
                        <div className={`relative bg-gradient-to-br from-green-700/30 to-slate-800/40 rounded-2xl p-3 md:p-4 shadow-xl border border-green-700/20 backdrop-blur-xl ${verdict === 'Accepted' || status === 'solved' ? 'ring-4 ring-green-400/30 animate-pulse' : verdict === 'Wrong Answer' || verdict === 'Compilation Error' ? 'ring-4 ring-red-400/30 animate-shake' : ''}`}> 
                            {/* Confetti for Accepted */}
                            {(verdict === 'Accepted' || status === 'solved') && (
                                <Confetti numberOfPieces={150} recycle={false} className="pointer-events-none fixed top-0 left-0 w-full h-full z-50" />
                            )}
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                <FaCheckCircle className={`text-2xl ${verdict === 'Accepted' || status === 'solved' ? 'text-green-400' : verdict === 'Wrong Answer' ? 'text-red-400' : verdict === 'Compilation Error' ? 'text-yellow-300' : 'text-slate-400'}`} />
                                Output
                            </h3>
                            <div className="flex gap-2 mb-3 items-center">
                                {verdict && (
                                    <div className={`text-sm font-bold px-3 py-1 rounded-full border flex items-center gap-2 ${
                                        verdict === 'Accepted' || status === 'solved'
                                            ? 'bg-green-500/20 text-green-300 border-green-400/30'
                                            : verdict === 'Wrong Answer'
                                            ? 'bg-red-500/20 text-red-300 border-red-400/30 animate-shake'
                                            : verdict === 'Compilation Error'
                                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30 animate-shake'
                                            : 'bg-slate-600/20 text-slate-200 border-slate-400/30'
                                    }`}>
                                        {verdict === 'Accepted' || status === 'solved' ? <FaCheckCircle className="text-green-400 animate-bounce" /> : null}
                                        {verdict === 'Wrong Answer' || verdict === 'Compilation Error' ? <FaSadTear className="text-red-400 animate-bounce" /> : null}
                                        {verdict}
                                    </div>
                                )}
                            </div>
                            <div className={`bg-black/60 p-4 rounded-lg min-h-[160px] overflow-y-auto font-mono whitespace-pre text-base border ${verdict === 'Accepted' || status === 'solved' ? 'text-green-200 border-green-800/20' : verdict === 'Wrong Answer' || verdict === 'Compilation Error' ? 'text-red-200 border-red-800/20 animate-shake' : 'text-slate-200 border-slate-700/20'}`}>
                                {verdict === 'Accepted' || status === 'solved' ? (
                                    <span className="font-extrabold text-green-300 text-xl flex items-center gap-2">
                                        <FaCheckCircle className="text-green-400 animate-bounce" /> Congratulations! All test cases passed!
                                    </span>
                                ) : (verdict === 'Wrong Answer' || verdict === 'Compilation Error') ? (
                                    <span className="font-extrabold text-red-300 text-xl flex items-center gap-2">
                                        <FaSadTear className="text-red-400 animate-bounce" /> Oops! Some test cases failed.
                                    </span>
                                ) : null}
                                <div>{output || <span className="text-slate-400">Run your code to see output here</span>}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {showCustomCheck && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg w-full max-w-2xl relative">
                            <button onClick={() => setShowCustomCheck(false)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl">&times;</button>
                            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Custom Code Check</h2>
                            <div className="flex gap-4 mb-4">
                                <label className="font-semibold text-slate-700 dark:text-slate-200">Language:</label>
                                <select value={customLang} onChange={e => setCustomLang(e.target.value)} className="rounded-lg px-3 py-1 border dark:bg-slate-800">
                                    <option value="cpp">C++</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <Editor
                                    height="250px"
                                    theme="vs-dark"
                                    language={customLang === 'cpp' ? 'cpp' : customLang}
                                    value={customCode}
                                    onChange={val => setCustomCode(val)}
                                    options={{ fontSize: 15, minimap: { enabled: false } }}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="font-semibold text-slate-700 dark:text-slate-200">Custom Input:</label>
                                <textarea
                                    className="w-full rounded-lg px-3 py-2 border dark:bg-slate-800 mt-2"
                                    rows={3}
                                    value={customInput}
                                    onChange={e => setCustomInput(e.target.value)}
                                    placeholder="Enter input for your code here..."
                                />
                            </div>
                            <button
                                onClick={handleCustomCheck}
                                className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold"
                                disabled={isCustomRunning}
                            >
                                {isCustomRunning ? 'Running...' : 'Run Custom Code'}
                            </button>
                            <div className="mt-4">
                                <label className="font-semibold text-slate-700 dark:text-slate-200">Output:</label>
                                <pre className="bg-slate-900 text-white rounded-lg p-3 mt-2 max-h-40 overflow-auto whitespace-pre-wrap">{customOutput}</pre>
                            </div>
                        </div>
                    </div>
                )}

                {/* AI Code Analysis Modal */}
                {showAnalysis && codeAnalysis && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl border border-blue-500/30 p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-fadeIn">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent flex items-center">
                                    <FaRobot className="text-blue-400 mr-2" /> AI Code Analysis
                                </h2>
                                <button 
                                    onClick={() => setShowAnalysis(false)} 
                                    className="text-slate-400 hover:text-white transition-colors duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                {/* Code Quality Score */}
                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col justify-between hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaChartBar className="text-blue-400" />
                                        <h3 className="font-semibold text-blue-300">Code Quality</h3>
                                    </div>
                                    <div className="flex justify-center items-center flex-1">
                                        {codeAnalysis.codeQualityAssessment && renderQualityScore(parseInt(codeAnalysis.codeQualityAssessment.score || 0))}
                                    </div>
                                    <p className="text-sm text-slate-300 mt-2">{codeAnalysis.codeQualityAssessment?.justification || "Assessment not available"}</p>
                                </div>

                                {/* Time Complexity */}
                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="font-semibold text-green-300">Time Complexity</h3>
                                    </div>
                                    <div className="mt-2 font-mono bg-black/30 p-2 rounded text-green-200">
                                        {codeAnalysis.complexity?.timeComplexity || "Not determined"}
                                    </div>
                                    <p className="text-sm text-slate-300 mt-2">{codeAnalysis.complexity?.timeComplexity?.explanation || ""}</p>
                                </div>

                                {/* Space Complexity */}
                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <h3 className="font-semibold text-purple-300">Space Complexity</h3>
                                    </div>
                                    <div className="mt-2 font-mono bg-black/30 p-2 rounded text-purple-200">
                                        {codeAnalysis.complexity?.spaceComplexity || "Not determined"}
                                    </div>
                                    <p className="text-sm text-slate-300 mt-2">{codeAnalysis.complexity?.spaceExplanation || ""}</p>
                                </div>
                            </div>

                            {/* Coding Style Feedback */}
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaFileAlt className="text-blue-400" />
                                    <h3 className="font-semibold text-blue-300">Analysis</h3>
                                </div>
                                <p className="text-slate-300 text-left">{codeAnalysis.suggestions?.analysis || "Analysis not available"}</p>
                            </div>  

                            {/* Logic Optimization */}
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                                <div className="flex items-center gap-2 mb-4">
                                    <FaLightbulb className="text-amber-400" />
                                    <h3 className="font-semibold text-amber-300">Optimization Suggestions</h3>
                                </div>
                                <ul className="list-disc pl-5 space-y-2 text-left">
                                    {codeAnalysis.suggestions?.suggestions && 
                                    Array.isArray(codeAnalysis.suggestions.suggestions) ? (
                                    codeAnalysis.suggestions.suggestions.map((suggestion, idx) => (
                                        <li key={idx} className="text-slate-300">{suggestion}</li>
                                    ))
                                    ) : (
                                    <li className="text-slate-400">No optimization suggestions available</li>
                                    )}
                                </ul>
                            </div>

                            {/* Optimized Code with Editor */}
                            <div className="bg-gradient-to-r from-slate-800/70 to-slate-900/70 border border-teal-700/30 rounded-xl p-5 mb-6 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaCode className="text-teal-400" />
                                        <h3 className="font-semibold text-teal-300">Optimized Code</h3>
                                    </div>
                                    <div className="px-3 py-1 text-xs bg-teal-900/50 text-teal-300 rounded-full border border-teal-700/50">
                                        Recommended Implementation
                                    </div>
                                </div>
                                
                                {codeAnalysis.suggestions?.optimizedCode ? (
                                    Array.isArray(codeAnalysis.suggestions.optimizedCode) ? (
                                        <div className="bg-gray-900/70 rounded-lg border border-slate-700 overflow-hidden">
                                            <Editor
                                                height="250px"
                                                theme="vs-dark"
                                                language={language}
                                                value={codeAnalysis.suggestions.optimizedCode.join('\n')}
                                                options={{ 
                                                    fontSize: 14, 
                                                    readOnly: true, 
                                                    minimap: { enabled: false },
                                                    fontFamily: 'Fira Mono, monospace',
                                                    scrollBeyondLastLine: false
                                                }}
                                            />
                                        </div>
                                    ) : typeof codeAnalysis.suggestions.optimizedCode === 'string' ? (
                                        <div className="bg-gray-900/70 rounded-lg border border-slate-700 overflow-hidden">
                                            <Editor
                                                height="250px"
                                                theme="vs-dark"
                                                language={language}
                                                value={codeAnalysis.suggestions.optimizedCode}
                                                options={{ 
                                                    fontSize: 14, 
                                                    readOnly: true, 
                                                    minimap: { enabled: false },
                                                    fontFamily: 'Fira Mono, monospace',
                                                    scrollBeyondLastLine: false
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-slate-400 text-center p-4 bg-black/20 rounded-lg">Optimized code format not recognized</p>
                                    )
                                ) : (
                                    <p className="text-slate-400 text-center p-4 bg-black/20 rounded-lg">No optimized code available</p>
                                )}
                            </div>

                            {/* Overall Assessment */}
                            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30 rounded-xl p-5 hover:border-blue-600/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                                <div className="flex items-center gap-2 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="font-semibold text-blue-300">Overall Assessment</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium text-amber-300 mb-2">Areas for Improvement:</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {codeAnalysis.suggestions?.improvements ? (
                                                Array.isArray(codeAnalysis.suggestions.improvements) ? 
                                                    codeAnalysis.suggestions.improvements.map((area, idx) => (
                                                        <li key={idx} className="text-slate-300">{area}</li>
                                                    ))
                                                : <li className="text-slate-300">{codeAnalysis.suggestions.improvements}</li>
                                            ) : (
                                                <li className="text-slate-400">No improvement areas highlighted</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <ToastContainer theme="dark" />
            </div>
        </div>
    );
};

const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
        case 'easy':
            return 'px-4 py-1.5 text-sm bg-[#32CD32] bg-opacity-20 text-[#32CD32] rounded-full font-medium border border-[#32CD32] border-opacity-30';
        case 'medium':
            return 'px-4 py-1.5 text-sm bg-[#FFD93D] bg-opacity-20 text-[#FFD93D] rounded-full font-medium border border-[#FFD93D] border-opacity-30';
        case 'hard':
            return 'px-4 py-1.5 text-sm bg-[#FF6B6B] bg-opacity-20 text-[#FF6B6B] rounded-full font-medium border border-[#FF6B6B] border-opacity-30';
        default:
            return 'px-4 py-1.5 text-sm bg-gray-100 bg-opacity-20 text-gray-800 rounded-full font-medium border border-gray-300';
    }
};

export default ProblemPage;