import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {toast} from "sonner";
import React, {Dispatch, SetStateAction} from "react";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ApplicationParams {
    footerCopyright?: string;
    page?: ({params, setParams}: {params: ApplicationParams;setParams: Dispatch<SetStateAction<ApplicationParams>>;}) => React. JSX. Element;
    href?: string;
    userLogin?: string;
    userIsAuth?: boolean;
    userId?: number;
    otherUserId?: number;
    pageNumber?: number;
    trainItemId?: number;
    trainItemType?: string;
}

export interface TrainDataItem {
    id: number;
    name: string;
    words: string[];
    text: string;
    creationTime: string;
    userId: number;
    type: string;
}

export interface User {
    id: number;
    login: string;
}

export enum TrainModes {
    Words = "WORDS_LIST",
    Text = "TRAIN_TEXT",
}

export function fromTrainMode(obj: TrainModes): string {
    switch (obj) {
        case TrainModes.Words:
            return "Words sequence";
        case TrainModes.Text:
            return "Text";
        default:
            throw new Error(`Unknown TrainModes value: ${obj}`);
    }
}

export function fromTrainModeString(obj: string): string {
    switch (obj) {
        case TrainModes.Words:
            return fromTrainMode(TrainModes.Words);
        case TrainModes.Text:
            return fromTrainMode(TrainModes.Text);
        default:
            throw new Error(`Unknown TrainModes string: ${obj}`);
    }
}

export function getWordWidth(word: string): number {
    const tempElement = document.createElement('span');
    document.body.appendChild(tempElement);
    // tempElement.style.visibility = 'hidden';
    // tempElement.style.whiteSpace = 'nowrap';
    // tempElement.style.fontFamily = 'Arial';
    tempElement.style.fontSize = '1.4rem';
    tempElement.textContent = word + "w";
    const width = tempElement.getBoundingClientRect().width;
    document.body.removeChild(tempElement);
    return width;
}

export function takeAmount(arr: number[], begin: number, maxWidth: number, words: string[]): number {
    let n = 0;
    let currentWidth = 0;

    while (begin + n < arr.length) {
        const wordWidth = getWordWidth(words[arr[begin + n]]);

        if (currentWidth + wordWidth >= maxWidth) {
            return n;
        }

        currentWidth += wordWidth;
        n++;
    }

    return n;
}

export function toastError(error: string | null, setError: (msg: string | null) => void) {
    if (error != null) {
        toast(error, {
            id: "idd",
            action: {
                label: "Close",
                onClick: (e) => {
                    e.stopPropagation();
                    toast.dismiss()
                },
            },
        })
        setError(null);
    }
}

export function toastErrorUnClosable(error: string | null, setError: (msg: string | null) => void) {
    if (error != null) {
        toast(error, {
        })
        setError(null);
    }
}

export function toastMessage(message: string) {
    if (message != null) {
        toast(message, {
            action: {
                label: "Close",
                onClick: (e) => {
                    e.stopPropagation();
                    toast.dismiss()
                },
            },
        })
    }
}



export const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

interface ApiError {
    response?: {
        data?: string | { message?: string };
    };
    message?: string;
}

export function handleError(setError: (msg: string | null) => void, error: ApiError | never) {
    setError(typeof error?.response?.data === "string" ? error.response.data : "Something went wrong");
}

export function formatDateTime(isoString: string): string {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds} ${year}-${month}-${day}`;
}

export const toUserStr = (userId: number) => {
    return `/profile/${userId}`;
};

export const toTrainItemStr = (id: number, type: string) => {
    return `/train-item/${type}/${id}`;
};

export const previewData = (data: string[] | string) => {
    if (data) {
        let preview = "";
        if (typeof data === "string") {
            preview = data;
        } else if (Array.isArray(data)) {
            preview = data.join(" ");
        }

        if (preview.length > 400) {
            preview = preview.substring(0, 400) + " ...";
        }

        return preview;
    } else {
        return "";
    }
};