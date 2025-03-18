"use client";

import Application from "@/components/components/Application";
import {ApplicationParams} from "@/lib/utils";
import {useState} from "react";
import Profile from "@/components/components/Middle/MyProfile/Profile";

export default function Home() {
    const params: ApplicationParams = {
        page: Profile,
        href: '/my-profile'
    };

    const [iniParams, setIniParams] = useState(params);

    return (
      <div>
          <Application params={iniParams} setParams={setIniParams} />
      </div>
    );
}

