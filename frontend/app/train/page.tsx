"use client";

import Application from "@/components/components/Application";
import TrainPage from "@/components/components/Middle/TrainPage/TrainPage";
import {ApplicationParams} from "@/lib/utils";
import {useState} from "react";
import MainTrainPage from "@/components/components/Middle/MainTrainPage/MainTrainPage";

export default function Home() {
    const params: ApplicationParams = {
        page: MainTrainPage,
        href: '/train',
    };

    const [iniParams, setIniParams] = useState(params);

    return (
        <div>
            <Application params={iniParams} setParams={setIniParams} />
        </div>
    );
}

