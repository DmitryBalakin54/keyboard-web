

import { ApplicationParams } from "@/lib/utils";
import Link from "next/link";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {Dispatch, SetStateAction} from "react";

function Navigation({params, setParams}: {params: ApplicationParams, setParams: Dispatch<SetStateAction<ApplicationParams>>}) {  // eslint-disable-line @typescript-eslint/no-unused-vars


    const isActive = (path: string) => {
        if (path == "/") {
            return params.href == path;
        }

        return params?.href?.startsWith(path);
    }

    return (
        <NavigationMenu className={"nav-menu"}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                        <NavigationMenuLink
                            className={`nav-link ${
                                isActive('/') ? 'active' : 'inactive'
                            }`}
                        >
                            Main
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link href="/train" legacyBehavior passHref>
                        <NavigationMenuLink
                            className={`nav-link ${
                                isActive('/train') ? 'active' : 'inactive'
                            }`}
                        >
                            Training
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link href="/create-test" legacyBehavior passHref>
                        <NavigationMenuLink
                            className={`nav-link ${
                                isActive('/create-test') ? 'active' : 'inactive'
                            }`}
                        >
                            Create test
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

export default Navigation;