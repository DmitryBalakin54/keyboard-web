import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {ApplicationParams, handleError, toastError} from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Profile({ params, setParams }: { params: ApplicationParams, setParams: Dispatch<SetStateAction<ApplicationParams>> }) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userLogin, setUserLogin] = useState<string | undefined>(undefined);
    const [userCreationTime, setUserCreationTime] = useState<string | undefined>(undefined);
    const [loadingText, setLoadingText] = useState("Loading...");

    const avatarText = useMemo(() => {
        return (params.userLogin || "").charAt(0).toUpperCase();
    }, [params.userLogin]);

    const otherAvatarText = useMemo(() => {
        return (userLogin || "").charAt(0).toUpperCase();
    }, [userLogin]);

    useEffect(() => {
        if (params.userIsAuth == undefined) return;
        let id = -1;
        if (params.otherUserId) {
            id = params.otherUserId;
        } else if (params.userId) {
            id = params.userId;
        }

        if (id == -1) {
            if (!params.userIsAuth) {
                setIsLoading(false);
            }
            return;
        }

        setIsLoading(true);
        axios.get(`/api/user/${id}`).then((response) => {
            setUserLogin(response.data.login);
            setUserCreationTime(response.data.creationTime);
        }).catch(error => {
            console.error(error);
            handleError(setError, error);
        })
        setIsLoading(false);
    }, [params.otherUserId, params.userId, params.userIsAuth]);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (!params.userLogin && !params.otherUserId) {
            setError("We can't show your profile because you're not logged in");
        }
    }, [params.userLogin, params.otherUserId, isLoading]);

    useEffect(() => {
        if (error) {
            toastError(error, setError);
            setLoadingText("Something went wrong...");
        }
    }, [error]);

    
    return (
        <div>
            {!params.otherUserId ? (
                <div className="my-profile-page">
                    {params.userIsAuth || params.userLogin ? (
                        <div>
                            <Avatar className={"avatar-in-profile-page"}>
                                <AvatarImage />
                                <AvatarFallback className={"avatarText-in-profile-page"}>
                                    {avatarText}
                                </AvatarFallback>
                            </Avatar>
                            <div className="profile-info">
                                <h2>{userLogin}</h2>
                                <p>Welcome to your profile!</p>
                            </div>
                        </div>
                    ) : (
                        <div className={"main-info profile-page-info"}>
                            {loadingText}
                        </div>
                    )}
                </div>
            ) : (
                <div className="profile-page">
                    {userLogin ? (
                        <div>
                            <Avatar className={"avatar-in-profile-page"}>
                                <AvatarImage />
                                <AvatarFallback className={"avatarText-in-profile-page"}>
                                    {otherAvatarText}
                                </AvatarFallback>
                            </Avatar>
                            <div className="profile-info">
                                <h2>{userLogin}</h2>
                                <p>User since: {new Date(userCreationTime || "").toLocaleDateString()}</p>
                            </div>
                        </div>
                    ) : (
                        <div className={"loading-center"}>
                            {loadingText}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Profile;