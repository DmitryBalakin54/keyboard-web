"use client";

import Application from "@/components/components/Application";
import {ApplicationParams} from "@/lib/utils";
import {useState} from "react";
import Profile from "@/components/components/Middle/MyProfile/Profile";

export default function Home({ params }: { params: { id: number } }) {
    const _params: ApplicationParams = {
        page: Profile,
        href: '/profile/' + params.id,
        otherUserId: params.id
    };


    const [iniParams, setIniParams] = useState(_params);

    return (
      <div>
          <Application params={iniParams} setParams={setIniParams} />
      </div>
    );
}

