"use client";

import Header from "./Header/Header";
import Middle from "./Middle/Middle";
import Footer from "./Footer/Footer";
import {ApplicationParams, handleError, toastError} from "@/lib/utils";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import axios from "axios";


function Application({params, setParams}: {params: ApplicationParams, setParams: Dispatch<SetStateAction<ApplicationParams>>}) {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (params.userIsAuth != undefined) return;
        if (localStorage.getItem("jwt")) {
            axios.get("/api/jwt/find", {
                params: {
                    jwt: localStorage.getItem("jwt")
                }
            }).then((response)=>{
                localStorage.setItem("login", response.data.login);
                setParams((prevParams) => ({
                    ...prevParams,
                    userLogin: response.data.login,
                    userIsAuth: true,
                    userId: response.data.id,
                }));
            }).catch((error)=>{
                console.log(error);
                handleError(setError, error);
            })
        } else {
            setParams({...params, userIsAuth: false});
        }
    }, [params, setParams]);

    useEffect(() => {
        toastError(error, setError);
    }, [error]);

    return (
        <div className="application" key={params.userLogin ? params.userLogin : ""}>
            <Header params={params} setParams={setParams} />
            <Middle params={params} setParams={setParams} />
            <Footer params={params} setParams={setParams} />
        </div>
    )
}

export default Application;