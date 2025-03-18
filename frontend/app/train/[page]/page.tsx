"use client";

import Application from "@/components/components/Application";
import {ApplicationParams} from "@/lib/utils";
import {useState} from "react";
import MainTrainPage from "@/components/components/Middle/MainTarinPage/MainTarinPage";

export default function Home({ params }: { params: { page: number } }) {
    const _params: ApplicationParams = {
        page: MainTrainPage,
        href: '/train',
        pageNumber: params.page
    };

    const [iniParams, setIniParams] = useState(_params);

    return (
        <div>
            <Application params={iniParams} setParams={setIniParams} />
        </div>
    );
}

