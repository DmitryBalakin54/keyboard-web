"use client";

import React, {useState, useEffect, Dispatch, SetStateAction, useCallback} from 'react';
import {
    ApplicationParams,
    formatDateTime,
    fromTrainModeString,
    handleError, previewData,
    toastError, toTrainItemStr, toUserStr,
    TrainDataItem, TrainModes, User
} from "@/lib/utils";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";
import { useRouter } from 'next/navigation';
import {Skeleton} from "@/components/ui/skeleton";

function TrainItem({ params, setParams }: { params: ApplicationParams, setParams: Dispatch<SetStateAction<ApplicationParams>> }) {
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TrainDataItem>();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (!params.trainItemId || !params.trainItemType) return;
        setIsLoading(true);
        let  reqUrl = "/api";
        switch (params.trainItemType) {
            case TrainModes.Words: reqUrl+="/words"; break;
            case TrainModes.Text: reqUrl+="/text"; break;
        }

        reqUrl += "/get/item/" + params.trainItemId;
        console.log(reqUrl);
        axios.get(reqUrl).then((response) => {
            setData(response.data);
            axios.get("/api/user/" + response.data.userId).then((userResponse) => {
                const _user = {
                    id: userResponse.data.id,
                    login: userResponse.data.login,
                };
                setUser(_user);
            }).catch((error) => {
                console.log(error);
                handleError(setError, error);
            })
        }).catch((error) => {
            console.log(error);
            handleError(setError, error);
        }).finally(() => {
            setIsLoading(false);
        })    
    }, [params.trainItemId, params.trainItemType]);


    const toUser = (userId: number) => {
        router.push(toUserStr(userId));
    };

    const toTrainItem = (id: number, type: string) => {
        router.push(toTrainItemStr(id, type));
    };

    const startTrain = useCallback((id: number, type: string) => {
        router.push("/train/train" + toTrainItemStr(id, type));
    }, [router])


    useEffect(() => {
        toastError(error, setError)
    }, [error]);


    return (
        <div className="trainItem">
            {isLoading ? (
                <ul className="train-list">
                    <li className="train-list-item">
                        <div className="train-list-item-header">
                            <Skeleton className="w-72 h-6 rounded-xl" />
                        </div>
                        <div className="preview-data">
                            <Skeleton className="w-96 h-6 rounded-xl" />
                        </div>
                        <div className="train-list-item-footer">
                            <div>
                                <Skeleton className="w-48 h-6 rounded-xl" />
                            </div>
                            <div className="preview-footer-time">
                                <Skeleton className="w-24 h-6 rounded-xl" />
                            </div>
                        </div>
                    </li>
                </ul>
            ) : (
                <>
                    {data ? (
                        <>
                            <ul className="train-list">
                                <li className="train-list-item">
                                    <div className="train-list-item-header">
                                        <a
                                            className="train-list-item-userLogin"
                                            onClick={() => toTrainItem(data.id, data.type)}
                                            style={{cursor: 'pointer', textDecoration: 'underline'}}
                                        >
                                            {data.name ? data.name : "Noname"}
                                        </a>
                                        <strong>, created by </strong>
                                        <a
                                            className="train-list-item-userLogin"
                                            onClick={() => toUser(data.userId)}
                                            style={{cursor: 'pointer', textDecoration: 'underline'}}
                                        >
                                            {user ? user.login : "Unknown User"}
                                        </a>
                                    </div>
                                    <div className="preview-data">
                                        {previewData(data.words || data.text)}
                                    </div>
                                    <div className="train-list-item-footer">
                                        <div>
                                            <strong>Type:</strong> {fromTrainModeString(data.type)}
                                        </div>
                                        <div className="preview-footer-time">
                                            <strong>Created at:</strong> {formatDateTime(data.creationTime)}
                                        </div>
                                    </div>
                                </li>
                            </ul>

                            <button
                                className={"start-train-button item-start"}
                                onClick={() => startTrain(data.id, data.type)}
                            >
                                Start train
                            </button>
                        </>
                    ) : (
                        <div className="loading-center">No data available</div>
                    )}
                </>
            )}
        </div>
    );
}

export default TrainItem;