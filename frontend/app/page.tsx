"use client";

import Application from "@/components/components/Application";
import MainPage from "@/components/components/Middle/MainPage/MainPage";
import {ApplicationParams} from "@/lib/utils";
import {useState} from "react";

export default function Home() {
    const params: ApplicationParams = {
        page: MainPage,
        href: '/'
    };

    const [iniParams, setIniParams] = useState(params);

    return (
      <div>
          <Application params={iniParams} setParams={setIniParams} />
      </div>
    );
}

