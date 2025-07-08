import {useParams, useNavigate} from 'react-router-dom';
import {useEffect, useState, useContext} from 'react';
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import {FaCheckCircle} from 'react-icons/fa';

const ProblemPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [output, setOutput] = useState('');
    const [status, setStatus] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                // Make sure your API endpoint is properly configured in your backend
                const response = await axios.get(`/api/problems/${id}`);
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

    const runCode = async () => {
        setIsRunning(true);
        setOutput('');
        setStatus('Running...');
        
        try {
            const response = await axios.post('/api/code/run', {
                problemId: problem._id,
                code,
                language
            });
            
            setOutput(response.data.output);
            setStatus(response.data.status);
            setIsRunning(false);
        } catch (error) {
            console.error('Error running code:', error);
            setOutput(error.response?.data?.error || 'Error running code');
            setStatus('Error');
            setIsRunning(false);
        }
    };

    const submitCode = async () => {
        setIsSubmitting(true);
        setOutput('');
        setStatus('Submitting...');
        
        try {
            const response = await axios.post('/api/code/submit', {
                problemId: problem._id,
                userId: user.id,
                code,
                language
            });
            
            setOutput(response.data.output);
            setStatus(response.data.status);
            setIsSubmitting(false);
        } catch (error) {
            console.error('Error submitting code:', error);
            setOutput(error.response?.data?.error || 'Error submitting solution');
            setStatus('Error');
            setIsSubmitting(false);
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

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Hard':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
                <button 
                    onClick={() => navigate('/problems')}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Problems
                </button>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                {/* Problem Description */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center text-left mb-4">
                            <h1 className="text-2xl font-bold text-gray-800">{problem.title}</h1>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                                {problem.difficulty}
                            </span>
                            {problem.solvedBy?.includes(String(user.id)) && (
                                <FaCheckCircle className="text-green-600"/>
                            )}
                        </div>
                        
                        <div className="mb-4 flex flex-wrap gap-2">
                            {problem.tags.map((tag, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        
                        <div className="text-left prose max-w-none mb-6">
                            <h3 className="text-lg font-medium mb-3 text-gray-800">Description</h3>
                            <div className={`text-gray-700 ${!showFullDescription && 'max-h-[200px] overflow-hidden relative'}`}>
                                <div className="whitespace-pre-line">{problem.description}</div>
                                {!showFullDescription && problem.description.length > 300 && (
                                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent"></div>
                                )}
                            </div>
                            {problem.description.length > 300 && (
                                <button 
                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                                >
                                    {showFullDescription ? 'Show Less' : 'Show More'}
                                </button>
                            )}
                        </div>
                        
                        {problem.constraints && (
                            <div className="text-left mb-6">
                                <h3 className="text-lg font-medium mb-3 text-gray-800">Constraints</h3>
                                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-line font-mono text-sm">{problem.constraints}</div>
                            </div>
                        )}
                        
                        <div className="text-left mb-6">
                            <h3 className="text-lg font-medium mb-3 text-gray-800">Examples</h3>
                            {problem.testCases?.filter(tc => tc.sample).map((testCase, index) => (
                                <div key={index} className="mb-4 border border-gray-100 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                                        <span className="font-medium text-gray-700">Example {index + 1}</span>
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-3">
                                            <span className="font-medium text-gray-700 block mb-1">Input:</span>
                                            <pre className="bg-gray-50 p-3 rounded-lg overflow-x-auto text-sm font-mono text-gray-800">{testCase.input}</pre>
                                        </div>
                                        <div className="mb-3">
                                            <span className="font-medium text-gray-700 block mb-1">Output:</span>
                                            <pre className="bg-gray-50 p-3 rounded-lg overflow-x-auto text-sm font-mono text-gray-800">{testCase.output}</pre>
                                        </div>
                                        {testCase.explanation && (
                                            <div>
                                                <span className="font-medium text-gray-700 block mb-1">Explanation:</span>
                                                <div className="text-gray-700 text-sm">{testCase.explanation}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Code Editor */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <div>
                                <label htmlFor="language" className="mr-2 font-medium text-gray-700">Language:</label>
                                <select 
                                    id="language"
                                    value={language}
                                    onChange={handleLanguageChange}
                                    className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="cpp">C++</option>
                                    <option value="java">Java</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={runCode}
                                    disabled={isRunning || isSubmitting}
                                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isRunning ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full mr-2"></div>
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
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
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
                            </div>
                        </div>
                        
                        <div className="h-[450px] border-b border-gray-100">
                            <Editor
                                height="100%"
                                language={language === 'cpp' ? 'cpp' : language}
                                value={code}
                                onChange={handleEditorChange}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    fontSize: 14,
                                    tabSize: 2,
                                    automaticLayout: true,
                                    lineNumbers: 'on',
                                    folding: true,
                                    lineDecorationsWidth: 0,
                                    lineNumbersMinChars: 3,
                                    scrollbar: {
                                        verticalScrollbarSize: 10,
                                        horizontalScrollbarSize: 10
                                    }
                                }}
                            />
                        </div>
                    </div>
                    
                    {/* Output Console */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-gray-700">Output</h3>
                            {status && (
                                <div className={`text-sm font-medium px-3 py-1 rounded-full ${status === 'Accepted' ? 'bg-green-100 text-green-800' : status === 'Error' || status === 'Wrong Answer' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {status}
                                </div>
                            )}
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg h-[150px] overflow-y-auto font-mono whitespace-pre text-sm text-gray-800 border border-gray-100">
                            {output || <span className="text-gray-400">Run your code to see output here</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemPage;
