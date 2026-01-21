import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { 
    FaCheckCircle, 
    FaFileAlt, 
    FaTimes, 
    FaRobot, 
    FaChartBar, 
    FaCode, 
    FaLightbulb,
    FaPlay,
    FaPaperPlane,
    FaTerminal,
    FaArrowLeft,
    FaClock,
    FaMemory,
    FaExclamationTriangle
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';
import { BACKEND_URI } from '../../config';

// Difficulty badge component
const DifficultyBadge = ({ difficulty }) => {
    const config = {
        easy: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
        medium: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
        hard: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' }
    };
    const style = config[difficulty?.toLowerCase()] || config.easy;
    
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${style.bg} ${style.text} border ${style.border}`}>
            {difficulty}
        </span>
    );
};

// Tag component
const Tag = ({ children }) => (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
        {children}
    </span>
);

// Section header component
const SectionHeader = ({ icon: Icon, title, color = "purple" }) => {
    const colors = {
        purple: "text-purple-400",
        blue: "text-blue-400",
        green: "text-emerald-400",
        amber: "text-amber-400"
    };
    return (
        <h3 className={`flex items-center gap-2 text-sm font-semibold ${colors[color]} uppercase tracking-wider mb-3`}>
            <Icon className="text-xs" />
            {title}
        </h3>
    );
};

// Button component for consistent styling
const Button = ({ 
    children, 
    onClick, 
    disabled, 
    variant = "primary", 
    size = "md",
    loading = false,
    icon: Icon
}) => {
    const variants = {
        primary: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/20",
        success: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20",
        secondary: "bg-slate-700/80 hover:bg-slate-600/80 text-slate-200 border border-slate-600/50",
        ghost: "bg-transparent hover:bg-slate-700/50 text-slate-300 border border-slate-600/50"
    };
    
    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-2.5 text-sm"
    };
    
    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                inline-flex items-center justify-center gap-2 
                font-semibold rounded-lg transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]} ${sizes[size]}
            `}
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : Icon ? (
                <Icon className="text-sm" />
            ) : null}
            {children}
        </button>
    );
};

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
    const [activeTab, setActiveTab] = useState('output');

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await axios.get(`${BACKEND_URI}/api/problems/${id}`);
                setProblem(response.data);
                
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
        setActiveTab('output');
        
        try {
            const response = await axios.post(`${BACKEND_URI}/api/code/run`, {
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
        setActiveTab('output');
        
        try {
            const response = await axios.post(`${BACKEND_URI}/api/code/submit`, {
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
                analyzeCode();
            } else if(submission.verdict === 'Wrong Answer') {
                showToast('Keep trying! Your solution needs some work.', 'warning');
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
        if (!code.trim()) {
            showToast('Cannot analyze empty code', 'warning');
            return;
        }

        setIsAnalyzing(true);
        showToast('Analyzing your code...', 'info');
        
        try {
            const response = await axios.post(`${BACKEND_URI}/api/code/analyze`, {
                problemId: problem._id,
                code,
                language
            });
            setCodeAnalysis(response.data.analysis);
            setIsAnalyzing(false);
            setShowAnalysis(true);
        } catch (error) {
            console.error('Error analyzing code:', error);
            setIsAnalyzing(false);
            showToast('Failed to analyze code', 'error');
        }
    };

    const renderQualityScore = (score) => {
        let colorClass = 'text-amber-400';
        let bgClass = 'from-amber-500/20 to-amber-600/10';
        
        if (score >= 8) {
            colorClass = 'text-emerald-400';
            bgClass = 'from-emerald-500/20 to-emerald-600/10';
        } else if (score <= 4) {
            colorClass = 'text-rose-400';
            bgClass = 'from-rose-500/20 to-rose-600/10';
        }
        
        return (
            <div className={`flex items-baseline gap-1 bg-gradient-to-br ${bgClass} rounded-xl px-4 py-3`}>
                <span className={`text-4xl font-bold ${colorClass}`}>{score}</span>
                <span className="text-slate-500 text-sm font-medium">/10</span>
            </div>
        );
    };

    const handleCustomCheck = async () => {
        setIsCustomRunning(true);
        setCustomOutput('');
        try {
            const response = await axios.post(`${BACKEND_URI}/api/code/custom-check`, {
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

    // Get verdict styling
    const getVerdictStyle = () => {
        if (verdict === 'Accepted' || status === 'solved') {
            return {
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/30',
                text: 'text-emerald-400',
                icon: FaCheckCircle
            };
        } else if (verdict === 'Wrong Answer') {
            return {
                bg: 'bg-rose-500/10',
                border: 'border-rose-500/30',
                text: 'text-rose-400',
                icon: FaTimes
            };
        } else if (verdict === 'Compilation Error') {
            return {
                bg: 'bg-amber-500/10',
                border: 'border-amber-500/30',
                text: 'text-amber-400',
                icon: FaExclamationTriangle
            };
        }
        return {
            bg: 'bg-slate-800/50',
            border: 'border-slate-700/50',
            text: 'text-slate-400',
            icon: FaTerminal
        };
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-slate-400 font-medium">Loading problem...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center">
                        <FaExclamationTriangle className="text-2xl text-rose-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Problem Not Found</h2>
                    <p className="text-slate-400 mb-6 text-sm">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="ghost" onClick={() => navigate(-1)}>
                            Go Back
                        </Button>
                        <Button variant="primary" onClick={() => navigate('/problems')}>
                            All Problems
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const verdictStyle = getVerdictStyle();

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Confetti for success */}
            {(verdict === 'Accepted' || status === 'solved') && (
                <Confetti 
                    numberOfPieces={200} 
                    recycle={false} 
                    className="fixed inset-0 pointer-events-none z-50" 
                />
            )}

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80">
                <div className="flex items-center justify-between px-4 lg:px-6 h-14">
                    <button
                        onClick={() => navigate('/problems')}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        <FaArrowLeft className="text-xs" />
                        <span>Problems</span>
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <DifficultyBadge difficulty={problem.difficulty} />
                        {problem.solvedBy?.includes(String(user.id)) && (
                            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                                <FaCheckCircle />
                                <span>Solved</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content - Split Layout */}
            <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)]">
                
                {/* Left Panel - Problem Description */}
                <div className="lg:w-1/2 xl:w-5/12 border-r border-slate-800/80 overflow-y-auto">
                    <div className="p-6 lg:p-8">
                        {/* Problem Title */}
                        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
                            {problem.title}
                        </h1>

                        {/* Tags */}
                        {problem.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {problem.tags.map((tag, index) => (
                                    <Tag key={index}>{tag}</Tag>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        <section className="mb-8">
                            <SectionHeader icon={FaFileAlt} title="Description" color="purple" />
                            <div className="text-slate-300 leading-relaxed text-[15px] whitespace-pre-line">
                                {showFullDescription 
                                    ? problem.description 
                                    : (problem.description.slice(0, 400) + (problem.description.length > 400 ? '...' : ''))}
                                {problem.description.length > 400 && (
                                    <button
                                        onClick={() => setShowFullDescription(!showFullDescription)}
                                        className="ml-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
                                    >
                                        {showFullDescription ? 'Show less' : 'Read more'}
                                    </button>
                                )}
                            </div>
                        </section>

                        {/* Examples */}
                        <section className="mb-8">
                            <SectionHeader icon={FaCode} title="Examples" color="green" />
                            <div className="space-y-4">
                                {problem.testCases?.filter(tc => tc.sample).map((testCase, index) => (
                                    <div 
                                        key={index} 
                                        className="rounded-xl overflow-hidden bg-slate-800/30 border border-slate-700/50"
                                    >
                                        <div className="px-4 py-2.5 bg-slate-800/50 border-b border-slate-700/50">
                                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                Example {index + 1}
                                            </span>
                                        </div>
                                        <div className="p-4 space-y-4">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                                                    Input
                                                </label>
                                                <pre className="bg-slate-900/50 rounded-lg p-3 text-sm font-mono text-emerald-300 overflow-x-auto border border-slate-700/30">
                                                    {testCase.input}
                                                </pre>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                                                    Output
                                                </label>
                                                <pre className="bg-slate-900/50 rounded-lg p-3 text-sm font-mono text-blue-300 overflow-x-auto border border-slate-700/30">
                                                    {testCase.output}
                                                </pre>
                                            </div>
                                            {testCase.explanation && (
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                                                        Explanation
                                                    </label>
                                                    <p className="text-slate-400 text-sm leading-relaxed">
                                                        {testCase.explanation}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Constraints */}
                        {problem.constraints && (
                            <section className="mb-8">
                                <SectionHeader icon={FaExclamationTriangle} title="Constraints" color="amber" />
                                <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                                    <pre className="text-sm font-mono text-amber-200/90 whitespace-pre-line leading-relaxed">
                                        {problem.constraints}
                                    </pre>
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* Right Panel - Code Editor & Output */}
                <div className="lg:w-1/2 xl:w-7/12 flex flex-col overflow-hidden bg-slate-950/50">
                    
                    {/* Editor Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/50">
                        <div className="flex items-center gap-4">
                            {/* Language Selector */}
                            <div className="flex items-center gap-2">
                                <label htmlFor="language" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Language
                                </label>
                                <select
                                    id="language"
                                    value={language}
                                    onChange={handleLanguageChange}
                                    className="bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                >
                                    <option value="cpp">C++</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="javascript">JavaScript</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setShowCustomCheck(true);
                                    setCustomLang(language);
                                    setCustomCode(code);
                                    setCustomInput('');
                                    setCustomOutput('');
                                }}
                            >
                                Custom Input
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                icon={FaRobot}
                                onClick={analyzeCode}
                                disabled={isAnalyzing || !code.trim()}
                                loading={isAnalyzing}
                            >
                                Analyze
                            </Button>
                            <Button
                                variant="success"
                                size="sm"
                                icon={FaPlay}
                                onClick={runCode}
                                disabled={isRunning || isSubmitting}
                                loading={isRunning}
                            >
                                Run
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                icon={FaPaperPlane}
                                onClick={submitCode}
                                disabled={isRunning || isSubmitting}
                                loading={isSubmitting}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>

                    {/* Code Editor */}
                    <div className="flex-1 min-h-0">
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            language={language === 'cpp' ? 'cpp' : language}
                            value={code}
                            onChange={handleEditorChange}
                            options={{
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                                minimap: { enabled: false },
                                padding: { top: 16, bottom: 16 },
                                lineNumbers: 'on',
                                renderLineHighlight: 'line',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 4,
                                wordWrap: 'off',
                                cursorBlinking: 'smooth',
                                smoothScrolling: true,
                            }}
                        />
                    </div>

                    {/* Output Panel */}
                    <div className={`border-t ${verdictStyle.border} ${verdictStyle.bg} transition-colors duration-300`}>
                        {/* Output Header with Tabs */}
                        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/50">
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setActiveTab('output')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                        activeTab === 'output' 
                                            ? 'bg-slate-700/80 text-white' 
                                            : 'text-slate-400 hover:text-slate-300'
                                    }`}
                                >
                                    Output
                                </button>
                            </div>
                            
                            {/* Verdict Badge */}
                            {verdict && (
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold ${verdictStyle.bg} ${verdictStyle.text} border ${verdictStyle.border}`}>
                                    <verdictStyle.icon className="text-xs" />
                                    {verdict}
                                </div>
                            )}
                        </div>
                        
                        {/* Output Content */}
                        <div className="p-4 max-h-48 overflow-y-auto">
                            {(verdict === 'Accepted' || status === 'solved') ? (
                                <div className="flex items-center gap-3 text-emerald-400">
                                    <FaCheckCircle className="text-xl" />
                                    <span className="font-semibold">All test cases passed!</span>
                                </div>
                            ) : (verdict === 'Wrong Answer' || verdict === 'Compilation Error') ? (
                                <div className="space-y-2">
                                    <div className={`flex items-center gap-2 ${verdictStyle.text}`}>
                                        <verdictStyle.icon />
                                        <span className="font-medium">
                                            {verdict === 'Wrong Answer' ? 'Some test cases failed' : 'Compilation error occurred'}
                                        </span>
                                    </div>
                                    {output && (
                                        <pre className="text-slate-300 text-sm font-mono whitespace-pre-wrap mt-2">
                                            {output}
                                        </pre>
                                    )}
                                </div>
                            ) : output ? (
                                <pre className="text-slate-300 text-sm font-mono whitespace-pre-wrap">
                                    {output}
                                </pre>
                            ) : (
                                <p className="text-slate-500 text-sm">
                                    Run your code to see output here
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Check Modal */}
            {showCustomCheck && (
                <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
                            <h2 className="text-lg font-semibold text-white">Custom Input</h2>
                            <button 
                                onClick={() => setShowCustomCheck(false)} 
                                className="text-slate-400 hover:text-white transition-colors p-1"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-6 space-y-4 max-h-[calc(90vh-140px)] overflow-y-auto">
                            {/* Language Selector */}
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-slate-400">Language:</label>
                                <select 
                                    value={customLang} 
                                    onChange={e => setCustomLang(e.target.value)} 
                                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white"
                                >
                                    <option value="cpp">C++</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                </select>
                            </div>
                            
                            {/* Code Editor */}
                            <div className="rounded-xl overflow-hidden border border-slate-700/50">
                                <Editor
                                    height="200px"
                                    theme="vs-dark"
                                    language={customLang === 'cpp' ? 'cpp' : customLang}
                                    value={customCode}
                                    onChange={val => setCustomCode(val)}
                                    options={{ 
                                        fontSize: 14, 
                                        minimap: { enabled: false },
                                        padding: { top: 12, bottom: 12 }
                                    }}
                                />
                            </div>
                            
                            {/* Custom Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Input:</label>
                                <textarea
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                                    rows={3}
                                    value={customInput}
                                    onChange={e => setCustomInput(e.target.value)}
                                    placeholder="Enter your test input..."
                                />
                            </div>
                            
                            {/* Output */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Output:</label>
                                <pre className="bg-slate-900 rounded-lg p-4 min-h-[80px] max-h-40 overflow-auto text-sm font-mono text-slate-300 border border-slate-700/50">
                                    {customOutput || <span className="text-slate-500">Output will appear here...</span>}
                                </pre>
                            </div>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-700/50 bg-slate-800/50">
                            <Button variant="ghost" onClick={() => setShowCustomCheck(false)}>
                                Cancel
                            </Button>
                            <Button 
                                variant="primary" 
                                icon={FaPlay}
                                onClick={handleCustomCheck}
                                loading={isCustomRunning}
                                disabled={isCustomRunning}
                            >
                                Run Code
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Code Analysis Modal */}
            {showAnalysis && codeAnalysis && (
                <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                    <FaRobot className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">AI Code Analysis</h2>
                                    <p className="text-xs text-slate-400">Powered by advanced code analysis</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowAnalysis(false)} 
                                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto space-y-6">
                            
                            {/* Metrics Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Code Quality Score */}
                                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FaChartBar className="text-blue-400 text-sm" />
                                        <h3 className="text-sm font-semibold text-slate-300">Quality Score</h3>
                                    </div>
                                    <div className="mb-3">
                                        {codeAnalysis.codeQualityAssessment && renderQualityScore(parseInt(codeAnalysis.codeQualityAssessment.score || 0))}
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        {codeAnalysis.codeQualityAssessment?.justification || "Assessment not available"}
                                    </p>
                                </div>

                                {/* Time Complexity */}
                                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FaClock className="text-emerald-400 text-sm" />
                                        <h3 className="text-sm font-semibold text-slate-300">Time Complexity</h3>
                                    </div>
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 mb-3">
                                        <code className="text-emerald-400 font-mono text-lg">
                                            {codeAnalysis.complexity?.timeComplexity || "O(?)"}
                                        </code>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        {codeAnalysis.complexity?.timeComplexity?.explanation || ""}
                                    </p>
                                </div>

                                {/* Space Complexity */}
                                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FaMemory className="text-purple-400 text-sm" />
                                        <h3 className="text-sm font-semibold text-slate-300">Space Complexity</h3>
                                    </div>
                                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-2 mb-3">
                                        <code className="text-purple-400 font-mono text-lg">
                                            {codeAnalysis.complexity?.spaceComplexity || "O(?)"}
                                        </code>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        {codeAnalysis.complexity?.spaceExplanation || ""}
                                    </p>
                                </div>
                            </div>

                            {/* Analysis */}
                            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaFileAlt className="text-blue-400 text-sm" />
                                    <h3 className="text-sm font-semibold text-slate-300">Analysis</h3>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {codeAnalysis.suggestions?.analysis || "Analysis not available"}
                                </p>
                            </div>

                            {/* Optimization Suggestions */}
                            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <FaLightbulb className="text-amber-400 text-sm" />
                                    <h3 className="text-sm font-semibold text-slate-300">Optimization Suggestions</h3>
                                </div>
                                <ul className="space-y-2">
                                    {codeAnalysis.suggestions?.suggestions && 
                                    Array.isArray(codeAnalysis.suggestions.suggestions) ? (
                                        codeAnalysis.suggestions.suggestions.map((suggestion, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-400">
                                                <span className="w-5 h-5 rounded-full bg-amber-500/20 flex-shrink-0 flex items-center justify-center text-xs text-amber-400 mt-0.5">
                                                    {idx + 1}
                                                </span>
                                                {suggestion}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-slate-500 text-sm">No optimization suggestions available</li>
                                    )}
                                </ul>
                            </div>

                            {/* Optimized Code */}
                            {codeAnalysis.suggestions?.optimizedCode && (
                                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden">
                                    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700/50">
                                        <div className="flex items-center gap-2">
                                            <FaCode className="text-teal-400 text-sm" />
                                            <h3 className="text-sm font-semibold text-slate-300">Optimized Code</h3>
                                        </div>
                                        <span className="px-2 py-1 text-xs bg-teal-500/20 text-teal-400 rounded-md">
                                            Recommended
                                        </span>
                                    </div>
                                    <Editor
                                        height="250px"
                                        theme="vs-dark"
                                        language={language}
                                        value={
                                            Array.isArray(codeAnalysis.suggestions.optimizedCode) 
                                                ? codeAnalysis.suggestions.optimizedCode.join('\n')
                                                : codeAnalysis.suggestions.optimizedCode
                                        }
                                        options={{ 
                                            fontSize: 13, 
                                            readOnly: true, 
                                            minimap: { enabled: false },
                                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                            scrollBeyondLastLine: false,
                                            padding: { top: 12, bottom: 12 }
                                        }}
                                    />
                                </div>
                            )}

                            {/* Areas for Improvement */}
                            {codeAnalysis.suggestions?.improvements && (
                                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaChartBar className="text-blue-400 text-sm" />
                                        <h3 className="text-sm font-semibold text-slate-300">Areas for Improvement</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {Array.isArray(codeAnalysis.suggestions.improvements) ? 
                                            codeAnalysis.suggestions.improvements.map((area, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm text-slate-400">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                                                    {area}
                                                </li>
                                            ))
                                        : <li className="text-slate-400">{codeAnalysis.suggestions.improvements}</li>
                                        }
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer 
                theme="dark" 
                toastClassName="!bg-slate-800 !text-white !border !border-slate-700/50"
            />
        </div>
    );
};

export default ProblemPage;