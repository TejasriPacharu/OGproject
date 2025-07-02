import {useParams} from 'react-router-dom';
import {useEffect, useState, useContext} from 'react';
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import Editor from '@monaco-editor/react';

const ProblemPage = () => {
    const {id} = useParams();
    const {user} = useContext(AuthContext);
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState('');
    const [status, setStatus] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await axios.get(`/api/problems/${id}`);
                setProblem(response.data);
                
                // Set initial code stub based on selected language
                if (response.data.codeStubs && response.data.codeStubs.length > 0) {
                    const stub = response.data.codeStubs[0];
                    setCode(stub[language] || '');
                }
                
                setLoading(false);
            } catch (error) {
                setError(error);
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
            const response = await axios.post('/api/submissions/run', {
                problemId: id,
                code,
                language
            });
            
            setOutput(response.data.output);
            setStatus(response.data.status);
            setIsRunning(false);
        } catch (error) {
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
            const response = await axios.post('/api/submissions/submit', {
                problemId: id,
                userId: user?._id,
                code,
                language
            });
            
            setOutput(response.data.output);
            setStatus(response.data.status);
            setIsSubmitting(false);
        } catch (error) {
            setOutput(error.response?.data?.error || 'Error submitting solution');
            setStatus('Error');
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-4 py-8">Error: {error.message}</div>;
    }

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy':
                return 'text-green-500';
            case 'Medium':
                return 'text-yellow-600';
            case 'Hard':
                return 'text-red-500';
            default:
                return 'text-gray-700';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-12 gap-6">
                {/* Problem Description */}
                <div className="md:col-span-5 bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">{problem.title}</h1>
                        <span className={`${getDifficultyColor(problem.difficulty)} font-medium`}>
                            {problem.difficulty}
                        </span>
                    </div>
                    
                    <div className="mb-4 flex flex-wrap gap-2">
                        {problem.tags.map((tag, index) => (
                            <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                    
                    <div className="prose max-w-none mb-6">
                        <h3 className="text-lg font-medium mb-2">Description</h3>
                        <div className="whitespace-pre-line">{problem.description}</div>
                    </div>
                    
                    {problem.constraints && (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-2">Constraints</h3>
                            <div className="whitespace-pre-line">{problem.constraints}</div>
                        </div>
                    )}
                    
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Examples</h3>
                        {problem.testCases?.filter(tc => tc.sample).map((testCase, index) => (
                            <div key={index} className="mb-4 p-4 bg-gray-50 rounded">
                                <div className="mb-2">
                                    <span className="font-medium">Input:</span>
                                    <pre className="mt-1 bg-gray-100 p-2 rounded overflow-x-auto">{testCase.input}</pre>
                                </div>
                                <div className="mb-2">
                                    <span className="font-medium">Output:</span>
                                    <pre className="mt-1 bg-gray-100 p-2 rounded overflow-x-auto">{testCase.output}</pre>
                                </div>
                                {testCase.explanation && (
                                    <div>
                                        <span className="font-medium">Explanation:</span>
                                        <div className="mt-1">{testCase.explanation}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Code Editor */}
                <div className="md:col-span-7">
                    <div className="bg-white p-4 rounded-lg shadow mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <label htmlFor="language" className="mr-2 font-medium">Language:</label>
                                <select 
                                    id="language"
                                    value={language}
                                    onChange={handleLanguageChange}
                                    className="border rounded px-2 py-1"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="cpp">C++</option>
                                    <option value="java">Java</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={runCode}
                                    disabled={isRunning || isSubmitting}
                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                                >
                                    {isRunning ? 'Running...' : 'Run Code'}
                                </button>
                                <button 
                                    onClick={submitCode}
                                    disabled={isRunning || isSubmitting}
                                    className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </div>
                        
                        <div className="border rounded h-[400px]">
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
                                }}
                            />
                        </div>
                    </div>
                    
                    {/* Output Console */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Output</h3>
                            <div className={`text-sm ${status === 'Accepted' ? 'text-green-500' : status === 'Error' || status === 'Wrong Answer' ? 'text-red-500' : 'text-gray-500'}`}>
                                {status}
                            </div>
                        </div>
                        <div className="bg-gray-100 p-4 rounded h-[150px] overflow-y-auto font-mono whitespace-pre">
                            {output || 'Run your code to see output here'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemPage;
