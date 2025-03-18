"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import {
    ApplicationParams,
    formatDateTime,
    fromTrainModeString,
    handleError, previewData,
    toastError, toTrainItemStr, toUserStr,
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
} from "@/components/ui/pagination";
import axios from "axios";
import { useRouter } from 'next/navigation';
import {Skeleton} from "@/components/ui/skeleton";

function MainTrainPage({ params, setParams }: { params: ApplicationParams, setParams: Dispatch<SetStateAction<ApplicationParams>> }) {
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TrainDataItem[]>([]);
    const [users, setUsers] = useState<Record<number, User>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const router = useRouter();

    const pagesAmount = 10;

    const fetchData = async () => {
        setIsLoading(true);

        axios.get('/api/train/all', {
            params: {
                page: params.pageNumber ? params.pageNumber : 0,
                size: pagesAmount,
            },
        }).then((trainResponse) => {
            setData(trainResponse.data.content);
            setTotalPages(trainResponse.data.totalPages);

            const userPromises = trainResponse.data.content
                .filter((item: TrainDataItem) => item.userId)
                .map((item: TrainDataItem) =>
                    axios.get("/api/user/" + item.userId).then((userResponse) => {
                        const user = {
                            id: userResponse.data.id,
                            login: userResponse.data.login,
                        };
                        setUsers((prevUsers) => ({ ...prevUsers, [item.userId]: user }));
                    }).catch((error) => {
                        console.log(error);
                        handleError(setError, error);
                    })
                );
            return Promise.all(userPromises);
        }).catch((error) => {
            handleError(setError, error);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const toUser = (userId: number) => {
        router.push(toUserStr(userId));
    };

    const toTrainItem = (id: number, type: string) => {
        router.push(toTrainItemStr(id, type));
    };

    useEffect(() => {
        fetchData().then(() => {});
    }, [params.pageNumber]);

    useEffect(() => {
        toastError(error, setError);
    }, [error]);

    const renderPagination = () => {
        const currentPage = params.pageNumber ? parseInt(params.pageNumber.toString()) : 0;
        const maxPagesToShow = 5;
        const halfMaxPages = Math.floor(maxPagesToShow / 2);

        let startPage = Math.max(currentPage - halfMaxPages, 0);
        const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(endPage - maxPagesToShow + 1, 0);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <Pagination className="paginationTrainPage">
                <PaginationContent className={"paginationTrainPage-content"}>
                    <PaginationItem className={"paginationTrainPage-item"} >
                        <PaginationPrevious
                            className={currentPage <= 0 ? "disabled" : ""}
                            href={`/train/${Math.max(currentPage - 1, 0)}`}
                            isActive={currentPage > 0}
                        />
                    </PaginationItem>

                    {startPage > 0 && (
                        <>
                            <PaginationItem className={"paginationTrainPage-item"}>
                                <PaginationLink
                                    href="/train/0"
                                    isActive={currentPage === 0}
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            {startPage > 1 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                        </>
                    )}

                    {pages.map((page) => (
                        <PaginationItem key={page} className={"paginationTrainPage-item"}>
                            <PaginationLink
                                href={`/train/${page}`}
                                isActive={page === currentPage}
                            >
                                {page + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    {endPage < totalPages - 1 && (
                        <>
                            {endPage < totalPages - 2 && (
                                <PaginationItem >
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            <PaginationItem className={"paginationTrainPage-item"} >
                                <PaginationLink
                                    className={"paginationTrainPage-item"}
                                    href={`/train/${totalPages - 1}`}
                                    isActive={currentPage === totalPages - 1}
                                >
                                    {totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        </>
                    )}

                    <PaginationItem className={"paginationTrainPage-item"}>
                        <PaginationNext
                            className={currentPage >= totalPages - 1 ? "disabled" : ""}
                            href={`/train/${Math.min(currentPage + 1, totalPages - 1)}`}
                            isActive={currentPage < totalPages - 1}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        );
    };

    return (
        <div className="trainMainMiddle">
            {isLoading ? (
                <ul className="train-list">
                    {Array.from({length: pagesAmount}).map((_, index) => (
                        <li key={index} className="train-list-item">
                            <div className="train-list-item-header">
                                <Skeleton className="w-72 h-6 rounded-xl"/>
                            </div>
                            <div className="preview-data">
                                <Skeleton className="w-96 h-6 rounded-xl"/>
                            </div>
                            <div className="train-list-item-footer">
                                <div>
                                    <Skeleton className="w-48 h-6 rounded-xl"/>
                                </div>
                                <div className="preview-footer-time">
                                    <Skeleton className="w-24 h-6 rounded-xl"/>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                    {data.length !== 0 ? (
                        <ul className={"train-list"}>
                            {data.map((item) => (
                                <li key={`${item.id}-${item.type}`} className={"train-list-item"}>
                                    <div className={"train-list-item-header"}>
                                        <a
                                            className={"train-list-item-userLogin"}
                                            onClick={() => toTrainItem(item.id, item.type)}
                                            style={{cursor: 'pointer', textDecoration: 'underline'}}
                                        >
                                            {item.name ? item.name : "Noname"}
                                        </a>
                                        <strong>, created by </strong>
                                        <a
                                            className={"train-list-item-userLogin"}
                                            onClick={() => toUser(item.userId)}
                                            style={{cursor: 'pointer', textDecoration: 'underline'}}
                                        >
                                            {users[item.userId] ? users[item.userId].login : "Unknown User"}
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
                    {renderPagination()}
                </>
            )}
        </div>
    );
}

export default MainTrainPage;