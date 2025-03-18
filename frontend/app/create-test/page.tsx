"use client";

import Application from "@/components/components/Application";
import CreateTestPage from "@/components/components/Middle/CreateTestPage/CreateTestPage";
import {ApplicationParams} from "@/lib/utils";
import {useState} from "react";

export default function Home() {
    const params: ApplicationParams = {
        page: CreateTestPage,
        href: '/create-test',
    };

    const [iniParams, setIniParams] = useState(params);

    return (
        <div>
            <Application params={iniParams} setParams={setIniParams} />
        </div>
    );
}

