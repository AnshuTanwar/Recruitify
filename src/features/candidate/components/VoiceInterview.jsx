import React, { useEffect, useRef, useState } from 'react';
import {
    Mic,
    MicOff,
    Volume2,
    Loader2,
    Brain,
    ArrowRight,
    SkipForward,
    CheckCircle2,
    AlertTriangle,
    BarChart3
} from 'lucide-react';
import ApiService from '../../../services/apiService.js';


const VoiceInterview = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [questionCount, setQuestionCount] = useState(6);

    const [sessionId, setSessionId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [status, setStatus] = useState('idle'); // idle | starting | in_progress | ready_to_end | ending | completed | error
    const [error, setError] = useState(null);

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recognitionSupported, setRecognitionSupported] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);

    const [transcript, setTranscript] = useState('');
    const [partialTranscript, setPartialTranscript] = useState('');
    const [loadingAnswer, setLoadingAnswer] = useState(false);

    const [analysisByIndex, setAnalysisByIndex] = useState({});
    const [finalEvaluation, setFinalEvaluation] = useState(null);

    const recognitionRef = useRef(null);

    useEffect(() => {
    if (typeof window !== 'undefined') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setRecognitionSupported(true);
        }
        if ('speechSynthesis' in window) {
            setSpeechSupported(true);
        }
    }
    }, []);

    const currentQuestion = questions[currentIndex] || '';

    const handleStartInterview = async () => {
        if (!jobTitle.trim()) {
            setError('Please enter a job title to start the interview.');
            return;
        }

        setError(null);
        setStatus('starting');
        setSessionId(null);
        setQuestions([]);
        setCurrentIndex(0);
        setTranscript('');
        setPartialTranscript('');
        setAnalysisByIndex({});
        setFinalEvaluation(null);

        try {
            const response = await ApiService.startInterview(jobTitle.trim(), questionCount);
            setSessionId(response.sessionId);
            setQuestions(response.questions || []);
            setStatus('in_progress');
        } catch (err) {
            setStatus('idle');
            setError(err.message || 'Failed to start interview. Please try again.');
        }
    };

    const speakCurrentQuestion = () => {
        if (!speechSupported || !currentQuestion) return;
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(currentQuestion);
            setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } catch {
            setIsSpeaking(false);
        }
    };

    const startRecording = () => {
        if (!recognitionSupported || isRecording) return;

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        setError(null);
        setTranscript('');
        setPartialTranscript('');
        setIsRecording(true);

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let finalText = '';
            let interimText = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const res = event.results[i];
                if (res.isFinal) {
                    finalText += res[0].transcript + ' ';
                } else {
                    interimText += res[0].transcript + ' ';
                }
            }

            if (finalText.trim()) {
                setTranscript((prev) => (prev + ' ' + finalText).trim());
            }
            setPartialTranscript(interimText.trim());
        };

        recognition.onerror = () => {
            setIsRecording(false);
            recognition.stop();
        };

        recognition.onend = () => {
            setIsRecording(false);
            setPartialTranscript('');
        };

        recognition.start();
    };

    const stopRecording = () => {
        const recognition = recognitionRef.current;
        if (recognition) {
            recognition.stop();
        }
    };

    const handleSubmitAnswer = async () => {
        if (!sessionId || !currentQuestion) return;
        const answerText = (transcript || '').trim();
        if (!answerText) {
            setError('Please record or type an answer before submitting, or use Skip.');
            return;
        }

        setError(null);
        setLoadingAnswer(true);

        try {
            const payload = {
                sessionId,
                questionIndex: currentIndex,
                question: currentQuestion,
                answer: answerText,
            };
            const response = await ApiService.sendInterviewAnswer(payload);

            setAnalysisByIndex((prev) => ({
                ...prev,
                [currentIndex]: response.analysis,
            }));

            setTranscript('');
            setPartialTranscript('');

            if (response.nextQuestion) {
                setQuestions((prev) => {
                    const copy = [...prev];
                    if (!copy[currentIndex + 1]) {
                        copy[currentIndex + 1] = response.nextQuestion;
                    }
                    return copy;
                });
                setCurrentIndex((prev) => prev + 1);
            } else {
                setStatus('ready_to_end');
            }
        } catch (err) {
            setError(err.message || 'Failed to send answer. Please try again.');
        } finally {
            setLoadingAnswer(false);
        }
    };

    const handleSkipQuestion = async () => {
        if (!sessionId || !currentQuestion) return;

        setError(null);
        setLoadingAnswer(true);

        try {
            const payload = {
                sessionId,
                questionIndex: currentIndex,
                question: currentQuestion,
                answer: '',
            };
            const response = await ApiService.sendInterviewAnswer(payload);

            setAnalysisByIndex((prev) => ({
                ...prev,
                [currentIndex]: response.analysis,
            }));

            setTranscript('');
            setPartialTranscript('');

            if (response.nextQuestion) {
                setQuestions((prev) => {
                    const copy = [...prev];
                    if (!copy[currentIndex + 1]) {
                        copy[currentIndex + 1] = response.nextQuestion;
                    }
                    return copy;
                });
                setCurrentIndex((prev) => prev + 1);
            } else {
                setStatus('ready_to_end');
            }
        } catch (err) {
            setError(err.message || 'Failed to skip question. Please try again.');
        } finally {
            setLoadingAnswer(false);
        }
    };

    const handleEndInterview = async () => {
        if (!sessionId) return;
        setError(null);
        setStatus('ending');

        try {
            const response = await ApiService.endInterview(sessionId);
            setFinalEvaluation(response.finalEvaluation || null);
            setStatus('completed');
        } catch (err) {
            setError(err.message || 'Failed to complete interview. You can retry ending.');
            setStatus('ready_to_end');
        }
    };

    const analysisForCurrent = analysisByIndex[currentIndex];

    const totalQuestions = questions.length || questionCount || 0;
    const progressLabel = sessionId
        ? `Question ${Math.min(currentIndex + 1, totalQuestions)} of ${totalQuestions || '?'}`
        : null;

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center mb-4">
                    <div className="bg-gradient-to-r from-teal-500 to-purple-600 p-3 rounded-xl shadow-lg">
                        <Mic className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    AI Voice Interview
                </h1>
                <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto">
                    Practice live interview questions with AI. Speak your answers, get instant feedback, and receive a final evaluation.
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/40 text-red-100 px-4 py-3 rounded-lg text-sm flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {status === 'idle' || status === 'starting' ? (
                <div className="bg-white rounded-lg shadow-lg p-6 text-gray-900">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-teal-600" />
                        Start an AI Interview
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Job Title *
                            </label>
                            <input
                                type="text"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                placeholder="e.g., Frontend Developer, Data Scientist"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Number of Questions
                            </label>
                            <select
                                value={questionCount}
                                onChange={(e) => setQuestionCount(Number(e.target.value) || 6)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            >
                                <option value={4}>4 questions</option>
                                <option value={6}>6 questions</option>
                                <option value={8}>8 questions</option>
                            </select>
                        </div>

                        {!recognitionSupported && (
                            <p className="text-xs text-gray-600 bg-gray-50 border border-dashed border-gray-200 p-3 rounded-lg">
                                Your browser does not support voice recognition. You can still type answers manually.
                            </p>
                        )}

                        <button
                            onClick={handleStartInterview}
                            disabled={status === 'starting'}
                            className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {status === 'starting' ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Starting interview...
                                </>
                            ) : (
                                <>
                                    <ArrowRight className="h-5 w-5 mr-2" />
                                    Start Interview
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : null}

            {(status === 'in_progress' || status === 'ready_to_end' || status === 'ending' || status === 'completed') && (
                <div className="bg-white rounded-lg shadow-lg p-6 text-gray-900 space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <p className="text-xs uppercase font-semibold text-gray-500">
                                Voice Interview
                            </p>
                            <p className="text-sm text-gray-700">
                                Role:&nbsp;
                                <span className="font-medium">{jobTitle || '—'}</span>
                            </p>
                        </div>
                        {progressLabel && (
                            <div className="text-sm font-medium text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                                {progressLabel}
                            </div>
                        )}
                    </div>

                    {currentQuestion && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 mb-1">
                                        Question
                                    </p>
                                    <p className="text-gray-900 text-sm sm:text-base">
                                        {currentQuestion}
                                    </p>
                                </div>
                                {speechSupported && (
                                    <button
                                        type="button"
                                        onClick={speakCurrentQuestion}
                                        className="flex items-center px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs sm:text-sm"
                                    >
                                        <Volume2 className="w-4 h-4 mr-1" />
                                        {isSpeaking ? 'Playing...' : 'Play Question'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                {recognitionSupported ? (
                                    <>
                                        <Mic className={`w-4 h-4 ${isRecording ? 'text-red-500' : 'text-gray-500'}`} />
                                        <span>
                                            {isRecording
                                                ? 'Listening... speak clearly into your microphone.'
                                                : 'You can record your answer or type it below.'}
                                        </span>
                                    </>
                                ) : (
                                    <span>
                                        Voice recognition not available. Please type your answer below.
                                    </span>
                                )}
                            </div>

                            {recognitionSupported && (
                                <div className="flex items-center gap-2">
                                    {!isRecording ? (
                                        <button
                                            type="button"
                                            onClick={startRecording}
                                            className="inline-flex items-center px-3 py-2 rounded-lg bg-red-500 text-white text-xs sm:text-sm hover:bg-red-600"
                                        >
                                            <Mic className="w-4 h-4 mr-1" />
                                            Start Recording
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={stopRecording}
                                            className="inline-flex items-center px-3 py-2 rounded-lg bg-gray-800 text-white text-xs sm:text-sm hover:bg-gray-900"
                                        >
                                            <MicOff className="w-4 h-4 mr-1" />
                                            Stop
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {partialTranscript && (
                            <div className="text-xs text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-md px-3 py-2">
                                <span className="font-semibold mr-1">Listening:</span>
                                {partialTranscript}
                            </div>
                        )}

                        <div>
                            <textarea
                                value={transcript}
                                onChange={(e) => setTranscript(e.target.value)}
                                rows={5}
                                placeholder="Your answer will appear here. You can edit the transcript or type your answer manually."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 justify-between items-center">
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    type="button"
                                    onClick={handleSubmitAnswer}
                                    disabled={loadingAnswer || !currentQuestion}
                                    className="inline-flex items-center px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loadingAnswer ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Analyzing answer...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Submit Answer
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSkipQuestion}
                                    disabled={loadingAnswer || !currentQuestion}
                                    className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-60"
                                >
                                    <SkipForward className="w-4 h-4 mr-1" />
                                    Skip Question
                                </button>
                            </div>

                            {(status === 'ready_to_end' || status === 'ending' || status === 'completed') && (
                                <button
                                    type="button"
                                    onClick={handleEndInterview}
                                    disabled={status === 'ending'}
                                    className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-60"
                                >
                                    {status === 'ending' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Finalizing interview...
                                        </>
                                    ) : (
                                        <>
                                            <BarChart3 className="w-4 h-4 mr-2" />
                                            End & View Results
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {analysisForCurrent && (
                        <div className="mt-6 border-t border-gray-200 pt-4">
                            <h3 className="text-sm font-semibold mb-3 flex items-center text-gray-900">
                                <Brain className="w-4 h-4 mr-2 text-teal-600" />
                                AI Feedback for this answer
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div className="bg-teal-50 rounded-lg p-3">
                                    <p className="font-semibold text-teal-700 mb-1">
                                        Score
                                    </p>
                                    <p className="text-2xl font-bold text-teal-700">
                                        {analysisForCurrent.score != null ? `${analysisForCurrent.score}/10` : '—'}
                                    </p>
                                    <p className="text-xs text-teal-800 mt-1">
                                        Higher is better.
                                    </p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-3">
                                    <p className="font-semibold text-green-700 mb-1">
                                        Strengths
                                    </p>
                                    <ul className="space-y-1">
                                        {analysisForCurrent.strengths && analysisForCurrent.strengths.length > 0 ? (
                                            analysisForCurrent.strengths.map((s, i) => (
                                                <li key={i} className="flex items-start gap-1">
                                                    <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5" />
                                                    <span>{s}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-xs text-gray-600">No specific strengths highlighted.</li>
                                        )}
                                    </ul>
                                </div>
                                <div className="bg-yellow-50 rounded-lg p-3">
                                    <p className="font-semibold text-yellow-800 mb-1">
                                        Suggested Improvement
                                    </p>
                                    <p className="text-sm text-gray-800">
                                        {analysisForCurrent.suggestedImprovement || 'No suggestions provided.'}
                                    </p>
                                </div>
                            </div>
                            {analysisForCurrent.overallComment && (
                                <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm text-gray-800">
                                    <p className="font-semibold mb-1">Overall Comment</p>
                                    <p>{analysisForCurrent.overallComment}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {status === 'completed' && finalEvaluation && (
                <div className="bg-white rounded-lg shadow-lg p-6 text-gray-900 space-y-4">
                    <h2 className="text-xl font-semibold mb-2 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                        Final Evaluation
                    </h2>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-purple-50 rounded-lg p-3">
                            <p className="text-xs font-semibold text-purple-700 mb-1">
                                Overall Score
                            </p>
                            <p className="text-2xl font-bold text-purple-700">
                                {finalEvaluation.overallScore != null ? `${finalEvaluation.overallScore}/100` : '—'}
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-xs font-semibold text-blue-700 mb-1">
                                </p>
                                <p className="text-sm text-gray-800">{finalEvaluation.technicalFit || '—'}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-700 mb-1">
                    Communication
                </p>
                <p className="text-sm text-gray-800">{finalEvaluation.communication || '—'}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-yellow-700 mb-1">
                    Confidence
                </p>
                <p className="text-sm text-gray-800">{finalEvaluation.confidence || '—'}</p>
            </div>
        </div>
                    {finalEvaluation.recommendation && (
                        <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm text-gray-800">
                            <p className="font-semibold mb-1">Recommendation</p>
                            <p>{finalEvaluation.recommendation}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VoiceInterview;