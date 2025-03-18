"use client";

import {ApplicationParams, handleError, toastError, toastMessage} from "@/lib/utils";
import {Select, SelectContent, SelectTrigger, SelectValue, SelectItem} from "@/components/ui/select";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import axios from "axios";

function MainPage({params, setParams}: {params: ApplicationParams, setParams: Dispatch<SetStateAction<ApplicationParams>>}) { // eslint-disable-line @typescript-eslint/no-unused-vars
    const [selectedMode, setSelectedMode] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [buttonIsDisabled, setButtonIsDisabled] = useState(true);

    function submit() {
        if (selectedMode == "words") {
            submitWords();
        } else if (selectedMode == "text") {
            submitText();
        }
    }

    function submitText() {
        axios.post("/api/create/text", {
            name: name,
            text: text,
            userLogin: params.userLogin,
        }).then((response) => {
            console.log(text);
            console.log(response);
            setText('');
            setName('');
            toastMessage("Successfully uploaded");
        }).catch(error => {
            console.log(error);
            handleError(setError, error);
        })
    }

    function submitWords() {
        axios.post("/api/create/words", {
            name: name,
            words: text,
            userLogin: params.userLogin,
        }).then((response) => {
            console.log(text);
            console.log(response);
            setText('');
            setName('');
            toastMessage("Successfully uploaded");
        }).catch(error => {
            console.log(error);
            handleError(setError, error);
        })
    }

    useEffect(() => {
        toastError(error, setError);
    }, [error]);

    useEffect(() => {
        if (selectedMode == "words" || selectedMode == "text") {
            setButtonIsDisabled(false);
        } else {
            setButtonIsDisabled(true);
        }
    }, [selectedMode]);


    return (
        <div>
            {!params.userLogin ? (
                <div className={"main-info"}>
                    Сreating tests is only available to logged-in users
                </div>
            ) : (
            <div className="createTestPageMiddle">
                <div className="createAsideBar">
                    <div className="create-select-mode">
                        <Select onValueChange={(value) => setSelectedMode(value)}>
                            <SelectTrigger className="select-create-option">
                                <SelectValue placeholder="Creation mode"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="words">Words</SelectItem>
                                <SelectItem value="words and punctuation">Words and punctuation</SelectItem>
                                <SelectItem value="text">Text</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <button
                        className={"submit-train-template-button"}
                        onClick={submit}
                        disabled={buttonIsDisabled}
                    >
                        Submit
                    </button>
                </div>

                <div className="createMainSpace">
                    {selectedMode == 'words' ? (
                        <div className={"create-word-box"}>
                            <Textarea
                                className="create-word-name-area"
                                placeholder="Enter name of this words maximum input string length is 20 characters"
                                value={name}

                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Textarea
                                className="create-word-area"
                                placeholder="Enter words in lowercase separated by a space, the maximum input string length is 5000 characters"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>
                    ) : selectedMode == 'words and punctuation' ? (
                        <p>Not implemented yet</p>
                    ) : selectedMode == 'text' ? (
                        <div className={"create-word-box"}>
                            <Textarea
                                className="create-word-name-area"
                                placeholder="Enter name of this text maximum input string length is 20 characters"
                                value={name}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Textarea
                                className="create-word-area"
                                placeholder="Enter words in lowercase and punctuation separated by a space, the maximum input string length is 5000 characters"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>
                    ) : (
                        <p></p>
                    )}
                </div>
            </div>
            )
            }
        </div>
    );
}

export default MainPage;