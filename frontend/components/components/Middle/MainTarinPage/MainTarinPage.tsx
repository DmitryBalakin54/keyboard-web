"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import {
    ApplicationParams,
    formatDateTime,
    fromTrainModeString,
    handleError,
    toastError,
    TrainDataItem, User
} from "@/lib/utils";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import axios from "axios";
import { useRouter } from 'next/navigation';

function MainTrainPage({ params, setParams }: { params: ApplicationParams, setParams: Dispatch<SetStateAction<ApplicationParams>> }) {
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TrainDataItem[]>([]);
    const [users, setUsers] = useState<Record<number, User>>({});
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchData = async () => {
        setIsLoading(true);
        axios.get('/api/train/all', {
            params: {
                page: params.pageNumber ? params.pageNumber : 0,
                size: 10
            }
        }).then((response) => {
            setData(response.data.content);
            response.data.content.forEach((item: TrainDataItem) => {
                if (item.userId) {
                    axios.get("/api/user/" + item.userId).then((response) => {
                        const user = {
                            id: response.data.id,
                            login: response.data.login,
                        };
                        setUsers(prevUsers => ({ ...prevUsers, [item.userId]: user }));
                    }).catch((error) => {
                        console.log(error);
                        handleError(setError, error);
                    });
                }
            });
        }).catch((error) => {
            handleError(setError, error);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    function previewData(data: string[] | string) {
        if (data) {
            let preview = "";
            if (typeof data == "string") {
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
    }

    const toUser = (userId: number) => {
        router.push(`/profile/${userId}`);
    };

    useEffect(() => {
        fetchData().then(() => {});
    }, []);

    useEffect(() => {
        toastError(error, setError);
    }, [error]);


    return (
        <div className="trainMainMiddle">
            {isLoading ? (
                <div className="loading-center">Loading...</div>
            ) : (
                <>
                {data.length != 0 ? (
                <ul className={"train-list"}>
                    {data.map(item => (
                        <li key={`${item.id}-${item.type}`} className={"train-list-item"}>
                            <div className={"train-list-item-header"}>
                                <strong>Name, created by </strong>
                                <a
                                    className={"train-list-item-userLogin"}
                                    onClick={() => toUser(item.userId)}
                                >
                                    {users[item.userId] ? users[item.userId].login : ""}
                                </a>
                            </div>
                            <div className={'preview-data'}>
                                {previewData(item.words || item.text)}
                            </div>
                            <div className={"train-list-item-footer"}>
                                <div>
                                    <strong>Type:</strong> {fromTrainModeString(item.type)}
                                </div>
                                <div className={'preview-footer-time'}>
                                    <strong>Created at:</strong> {formatDateTime(item.creationTime)}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                    ) : (
                    <div className="loading-center">No data available</div>
                )}
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href={"/train/" + (params.pageNumber ? Math.max(parseInt(params.pageNumber) - 1, 0) : 0)} />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">{1 + (params.pageNumber ? Math.max(parseInt(params.pageNumber), 0) : 0)}</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href={"/train/" + (params.pageNumber ? Math.max(1 + parseInt(params.pageNumber), 0) : 0)} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}
        </div>
    );
}

export default MainTrainPage;