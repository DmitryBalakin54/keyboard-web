import {useCallback, useEffect, useState, useRef, Dispatch, SetStateAction, useMemo} from "react";
import axios, {AxiosResponse} from "axios";
import {ApplicationParams, handleError, toastErrorUnClosable} from "@/lib/utils";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";

function UserInfo({params, setParams}: {params: ApplicationParams, setParams: Dispatch<SetStateAction<ApplicationParams>>}) {

    const loginInputRef = useRef<HTMLInputElement | null>(null);
    const passwordInputRef = useRef<HTMLInputElement | null>(null);

    const loginSignInputRef = useRef<HTMLInputElement | null>(null);
    const passwordSignInputRef = useRef<HTMLInputElement | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [isEnterDialogOpen, setIsEnterDialogOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);

    const avatarText = useMemo(() => {
        return (params.userLogin || "").charAt(0).toUpperCase();
    }, [params.userLogin]);

    // useEffect(() => {
    //     const newAvatarText = (login || params.userLogin || "?").charAt(0).toUpperCase();
    //     setAvatarText(newAvatarText);
    // }, [userIsAuth, login, params.userLogin]);


    const handleLoginClick = () => {
        setIsDropdownOpen(false);
        setIsEnterDialogOpen(true);
    };

    const handleSignClick = () => {
        setIsDropdownOpen(false);
        setIsSignDialogOpen(true);
    };

    const findJwt = useCallback((response: AxiosResponse) => {
        const jwt = response.data;
        localStorage.setItem("jwt", jwt);
        axios.get("/api/jwt/find", {
            params: {
                jwt: jwt,
            },
        }).then((response) => {
            // setLogin(response.data.login);
            // setUserIsAuth(true);
            setIsEnterDialogOpen(false);
            setIsSignDialogOpen(false);
            setParams({...params,
                       userLogin: response.data.login,
                       userIsAuth: true
            });
        }).catch((error) => {
            console.log(error);
            handleError(setError, error);
        });
    }, [params, setParams]);

    const onEnter = useCallback(() => {
        if (!loginInputRef.current || !passwordInputRef.current) return;
        const login = loginInputRef.current.value;
        const password = passwordInputRef.current.value;

        axios.post("/api/jwt/create", {
            login: login,
            password: password,
        }).then(
            findJwt
        ).catch((error) => {
            console.log(error.response.data);
            handleError(setError, error);
        });
    }, [findJwt]);

    const onRegister = useCallback(() => {
        if (!loginSignInputRef.current || !passwordSignInputRef.current) return;
        const login = loginSignInputRef.current.value;
        const password = passwordSignInputRef.current.value;

        axios.post("/api/sign/in", {
            login: login,
            password: password,
        }).then((response) => {
            axios.post("/api/jwt/create", {
                login: response.data.login,
                password: password,
            }).then(
                findJwt
            ).catch((error) => {
                console.log(error.response.data);
                handleError(setError, error);
            });
        }).catch((error) => {
            console.log(error);
            handleError(setError, error);
        });
    }, [findJwt]);

    const logOut = useCallback(() => {
        localStorage.removeItem("jwt");
        setParams({...params,
                   userLogin: undefined,
                   userIsAuth: false
        });

        
    }, [params, setParams]);

    useEffect(() => {
        toastErrorUnClosable(error, setError);
    }, [error]);

    return (
        <div className="userInfoHeader">
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <Avatar className={"avatar"}>
                        <AvatarImage />
                        <AvatarFallback className={"avatarText"}>{avatarText}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="dropdownMenu">
                    {params.userIsAuth ? (
                        <>
                            <DropdownMenuGroup>
                                <Link href="/my-profile">
                                    <DropdownMenuItem>
                                        Profile
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem>GitHub</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={logOut}>
                                Log out
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <DropdownMenuGroup>
                            <DropdownMenuItem onSelect={handleLoginClick}>
                                Log in
                            </DropdownMenuItem>

                            <DropdownMenuItem onSelect={handleSignClick}>
                                Sign in
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
                open={isEnterDialogOpen}
                onOpenChange={setIsEnterDialogOpen}
            >
                <DialogContent className="dialogEnterContent">
                    <DialogHeader className={"dialogEnterHeader"}>
                        <DialogTitle className={"dialogEnterTitle"}>Log In to my website</DialogTitle>
                    </DialogHeader>
                    <div className="dialogEnterLines">
                        <div className="dialogEnterLine">
                            <Input placeholder={"login"} ref={loginInputRef} />
                        </div>
                        <div className="dialogEnterLine">
                            <Input placeholder={"password"} ref={passwordInputRef} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            className={"dialogEnterSubmit"}
                            type="submit"
                            onClick={onEnter}
                        >
                            Log in
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
                <DialogContent className="dialogEnterContent">
                    <DialogHeader className={"dialogEnterHeader"}>
                        <DialogTitle className={"dialogEnterTitle"}>Create an account on my website</DialogTitle>
                    </DialogHeader>
                    <div className="dialogEnterLines">
                        <div className="dialogEnterLine">
                            <Input placeholder={"login"} ref={loginSignInputRef} />
                        </div>
                        <div className="dialogEnterLine">
                            <Input placeholder={"password"} ref={passwordSignInputRef} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            className={"dialogEnterSubmit"}
                            type="submit"
                            onClick={onRegister}
                        >
                            Sign in
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default UserInfo;