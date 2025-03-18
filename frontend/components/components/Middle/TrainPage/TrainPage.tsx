"use client";

import React, {useState, useEffect, useRef, Dispatch, SetStateAction, useCallback} from 'react';
import {ApplicationParams, formatTime, takeAmount, toastError} from "@/lib/utils";
import axios from "axios";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"




// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TrainPage({params, setParams}: {params: ApplicationParams, setParams: Dispatch<SetStateAction<ApplicationParams>>}) {
    const [currentWord, setCurrentWord] = useState('');
    const [typedWords, setTypedWords] = useState<{ index: number; correct: boolean }[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [indexBalance, setIndexBalance] = useState(0);
    const [visibleLines, setVisibleLines] = useState<number[][]>([[], []]);
    const [isInputDisabled, setIsInputDisabled] = useState(true);
    const [seconds, setSeconds] = useState(0);
    const [timerIsStarted, setBoolTimer] = useState(false);
    const [inputStarted, setInputStarted] = useState(false);
    const [startsCounter, setStartsCounter] = useState(0);
    const [words, setWords] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [correctWords, setCorrectWords] = useState(0);
    const [failedWords, setFailedWords] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [resultIsOpen, setResultIsOpen] = useState(false);

    async function downloadWords() {
        try {
            const response = await axios.get("/api/train/default/en");
            setWords(response.data);
            setError(null);
        } catch (error) {
            console.error(error);
            setError("Couldn't upload text. Please try again later.");
            end();
        }
    }

    const updateVisibleLines = useCallback((start: number) => {
        if (!inputRef.current || !wordsContainerRef.current) return;

        const inputWidth = inputRef.current.offsetWidth;

        const fstStart = start;
        const fstEnd = currentIndex + takeAmount(
            words.map((_, index) => index),
            fstStart,
            inputWidth,
            words
        );

        const sndStart = fstEnd;
        const sndEnd = sndStart + takeAmount(
            words.map((_, index) => index),
            sndStart,
            inputWidth,
            words
        );

        const firstLine = words.map((_, index) => index).slice(fstStart, fstEnd);
        const secondLine = words.map((_, index) => index).slice(sndStart, sndEnd);

        setVisibleLines([firstLine, secondLine]);
    }, [currentIndex, words]);


    useEffect(() => {
        if (currentWord === '' && typedWords.length === 0 && currentIndex === 0 && indexBalance === 0 && visibleLines.length === 0) {
            updateVisibleLines(0);
        }
    }, [currentWord, typedWords, currentIndex, indexBalance, visibleLines, words, updateVisibleLines]);

    function start() {
        downloadWords().then(() => { init() });
    }

    function init() {
        setCurrentWord('');
        setTypedWords([]);
        setCurrentIndex(0);
        setIndexBalance(0);
        setInputStarted(false);
        setVisibleLines([]);

        setBoolTimer(true);
        setSeconds(60);
        setIsInputDisabled(false);
        setStartsCounter(i => i + 1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function end() {
        let correct = 0;
        let failed = 0;

        for (let i = 0; i < typedWords.length; i++) {
            if (typedWords[i].correct) {
                correct++;
            } else {
                failed++;
            }
        }

        setCorrectWords(correct);
        setFailedWords(failed);
        if (correct + failed > 0) {
            setAccuracy(Math.floor(100 * correct / (correct + failed)));
        } else {
            setAccuracy(0);
        }

        setCurrentWord('');
        setCurrentIndex(0);
        setIndexBalance(0);
        setIsInputDisabled(true);
        setInputStarted(false);

        setBoolTimer(false);
        setSeconds(0);
    }

    const inputRef = useRef<HTMLInputElement>(null);
    const wordsContainerRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setCurrentWord(input);
        setInputStarted(true);

        if (input.trim().length == 0) {
            setCurrentWord('');
            return;
        }

        if (input.endsWith(' ')) {
            const userWord = input.trim();
            const isCorrect = userWord == words[currentIndex];

            setTypedWords(prevTypedWords => [...prevTypedWords, { index: currentIndex, correct: isCorrect }]);
            setCurrentIndex(prevIndex => prevIndex + 1);
            setIndexBalance(p => p + 1);
            setCurrentWord('');
            if (indexBalance == visibleLines[0].length - 1) {
                updateVisibleLines(currentIndex + 1);
                setIndexBalance(0);
            }
        }
    };


    const _updateVisibleLines = useCallback(() => {
        if (words.length > 0 && currentIndex >= 0) {
            updateVisibleLines(currentIndex);
        }
    }, [currentIndex, updateVisibleLines, words.length]);

    useEffect(() => {
        window.addEventListener('resize', _updateVisibleLines);
        return () => window.removeEventListener('resize', _updateVisibleLines);
    }, [words, currentIndex, _updateVisibleLines]);

    useEffect(() => {
        if (timerIsStarted && inputStarted) {
            if (seconds > 0) {
                const interval = setInterval(() => {
                    setSeconds((prevSeconds) => prevSeconds - 1);
                }, 1000);

                return () => clearInterval(interval);
            } else {
                end().then(() => {setResultIsOpen(true)});
            }
        }
    }, [seconds, timerIsStarted, inputStarted, end]);

    useEffect(() => {
        if (!isInputDisabled && timerIsStarted) {
            inputRef.current?.focus();
        }
    }, [isInputDisabled, startsCounter, timerIsStarted]);



    // useEffect(() => {
    //     const handleKeyDown = (e: KeyboardEvent) => {
    //         if (e.key === 'Enter') {
    //             e.preventDefault();
    //             start();
    //         }
    //     };
    //
    //     document.addEventListener('keydown', handleKeyDown);
    //     return () => {
    //         document.removeEventListener('keydown', handleKeyDown);
    //     };
    // }, []);

    useEffect(() => {
        toastError(error, setError);
    }, [error]);

    return (
        <div className="trainMiddle">

            <div ref={wordsContainerRef} className="words-container">

                {visibleLines.map((line, lineIndex) => (
                    <div key={lineIndex} className="word-line">
                        {line.map((wordIndex, index) => {
                            const typedWord = typedWords[wordIndex];

                            return (
                                <span
                                    key={index}
                                    className={`word ${typedWord?.correct ? 'correct' : ''} ${typedWord?.correct == false ? 'incorrect' : ''}`}
                                >
                                    {words[wordIndex]}
                                </span>
                            );
                        })}
                    </div>
                ))}
            </div>

            <input
                ref={inputRef}
                type="text"
                value={currentWord}
                onChange={handleInputChange}
                placeholder=""
                className="input-field"
                disabled={isInputDisabled || !!error}
            />

            <div className={'train-buttons'}>
                <button
                    className={"start-train-button"}
                    onClick={start}
                    disabled={!!error}
                >
                    Start
                </button>

                <div className={'train-timer'}>
                    <p>{formatTime(seconds)}</p>
                </div>

                <AlertDialog open={resultIsOpen} >
                    <AlertDialogContent className={"result-window"}>
                        <AlertDialogHeader>
                            <AlertDialogTitle className={"result-title"}>Result</AlertDialogTitle>
                            <div className={"result-stat"}>
                                <p>Accuracy: {accuracy}%</p>
                                <p>Correct: {correctWords}</p>
                                <p>Incorrect: {failedWords}</p>
                            </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className={"result-footer"}>
                            <AlertDialogAction
                                className={"result-cancel-button"}
                                onClick={() => setResultIsOpen(false)}
                            >
                                Cancel
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}

export default TrainPage;