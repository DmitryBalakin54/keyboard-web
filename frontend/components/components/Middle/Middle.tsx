import {ApplicationParams} from "@/lib/utils";
import {Dispatch, SetStateAction} from "react";

function Middle({params, setParams}: {params: ApplicationParams, setParams: Dispatch<SetStateAction<ApplicationParams>>}) {  // eslint-disable-line @typescript-eslint/no-unused-vars
    return (
        <div className="mainMiddle">
            {params.page ? <params.page params={params} setParams={setParams}/> : 404}
        </div>
    )
}

export default Middle;