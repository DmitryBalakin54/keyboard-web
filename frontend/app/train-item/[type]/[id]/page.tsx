"use client";

import Application from "@/components/components/Application";
import {ApplicationParams} from "@/lib/utils";
import {useState} from "react";
import MainTrainPage from "@/components/components/Middle/MainTrainPage/MainTrainPage";
import TrainItem from "@/components/components/Middle/TrainItem/TrainItem";

export default function Home({ params }: { params: { type: string, id: number } }) {
    const _params: ApplicationParams = {
        page: TrainItem,
        href: "/train",
        trainItemId: params.id,
        trainItemType: params.type
    };

    const [iniParams, setIniParams] = useState(_params);

    return (
        <div>
            <Application params={iniParams} setParams={setIniParams} />
        </div>
    );
}

