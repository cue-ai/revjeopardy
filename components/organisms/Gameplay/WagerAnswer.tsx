import {Alex} from "@/components/organisms/Sprites/Alex";
import {FC, useState} from "react";


export type WagerAnswerProps={
    setWagerAmount:(arg:number)=>void;
}

export const WagerAnswer:FC<WagerAnswerProps>=({setWagerAmount})=>{
    const [value,setValue]=useState<number>(0);
    return( <>
        <Alex headerText={`Choose a wager amount`} contentText={`Here's a daily double. You have to wager some amount (greater than 5) 
        and less than the amount of money you have. You have 10 seconds.`} isStatic={true}/>
        <form className={"w-full"} onSubmit={(e)=>{
            e.preventDefault();
             //     check for wager value
            setWagerAmount(value)
        }}>
            <div className={"flex items-center justify-center w-full  space-x-4 pt-8"}>
                <input
                    className=" shadow appearance-none border rounded w-6/12 max-w-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="number"
                    placeholder="Type your Answer."

                    onChange={(e)=>setValue(Number(e.target.value))}
                />
            </div>
        </form>
    </>)
}