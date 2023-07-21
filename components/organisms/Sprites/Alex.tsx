import {FC} from "react";
import {useTypingAnimation,useTypingAnimationTwoElements} from "@/components/hooks/useTypingAnimation";
import {ButtonType} from "@/shared/types/Html.types";
export type AlexProps={
    contentText:string;
    headerText?:string;
    button1?:ButtonType,
    button2?:ButtonType

}

    export const Alex:FC<AlexProps>=({headerText,contentText,
                                         button1,button2})=>{

    const {text1:header,text2:content}=useTypingAnimationTwoElements(headerText??"",contentText,40,10)

    return (
        <div className={"w-full grid justify-items-center "}>
            <div className={"w-full flex justify-center"}>
                    <img src={"/alex.png"} className={"w-3/12"}/>
            </div>
            <div className={"mt-10 px-10 w-full text-center text-3xl font-semibold"}>
                {headerText && <h1 >{header}</h1>}

            </div>

            <div className={"mt-10 px-10 text-center "}>
                <p className={"text-md"}>
                    {content}
                </p>
            </div>
            {(button1 || button2) &&<div className={"my-12 flex w-6/12 justify-around"}>
                {button1 && <button className={"bg-slate-700 py-2 px-4 rounded-md text-lg hover:bg-slate-800 border-white"}
                         onClick={button1.onClick}
                >
                    {button1.text}
                </button>}

                {button2 &&<button className={"bg-slate-700 py-2 px-4 rounded-md text-lg hover:bg-slate-800"}
                                   onClick={button2.onClick}
                >
                    {button2.text}
                </button>}
            </div>}

        </div>
    )
}