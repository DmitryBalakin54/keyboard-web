import { ApplicationParams } from "@/lib/utils";
import {Dispatch, SetStateAction} from "react";

function Footer({params, setParams}: {params: ApplicationParams, setParams: Dispatch<SetStateAction<ApplicationParams>>}) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return (
        <div className="mainFooter">
            Footer
        </div>
    );
}

export default Footer;