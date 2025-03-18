"use client";

import UserInfo from "./UserInfo/UserInfo";
import Navigation from "./Navigation/Navigation";
import {ApplicationParams} from "@/lib/utils";

import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import { throttle } from 'lodash';


function Header({params, setParams}: {params: ApplicationParams, setParams: Dispatch<SetStateAction<ApplicationParams>>}) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = throttle(() => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        }, 100);

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);


    return (
        <div className={`mainHeader  ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className={"headerContent"}>
                <Navigation params={params} setParams={setParams} />
                <UserInfo params={params}  setParams={setParams} />
            </div>
        </div>
    );
}


// className="mx-auto flex justify-between items-center p-4"
export default Header;