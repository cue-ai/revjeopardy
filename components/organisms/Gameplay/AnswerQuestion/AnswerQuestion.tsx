import {Question, QuestionCategory, TutorialEnum} from "@/shared/types/Game.types";
import {FC, FormEvent, useEffect, useState} from "react";
import {Alex} from "@/components/organisms/Sprites/Alex";
import {ButtonType} from "@/shared/types/Html.types";
import {WagerAnswer} from "../WagerAnswer";
import {CheckBoxForm} from "@/components/atoms/CheckBoxForm";
import {Loading} from "@/components/atoms/Loading";
import {set} from "zod";
import {AlexHeader} from "@/components/organisms/Sprites/AlexHeader";
import Confetti from 'react-confetti'
import {useTimer} from "@/components/hooks/useTimer";
import {DisplayQuestion} from "@/components/organisms/Gameplay/AnswerQuestion/DisplayQuestion";

// can be regular question or wager

export type AnswerQuestionProps={
    question:Question,
    onNextClick:()=>void
    score:number
    setScore:(arg:any)=>void
    questionCategory?:QuestionCategory
    tutorialState?:TutorialEnum
    setLivesRemaining?:(arg:any)=>void;
}

export const AnswerQuestion:FC<AnswerQuestionProps>=({question,onNextClick,
                                                         questionCategory,score,
                                                         setScore,tutorialState,setLivesRemaining})=>{

    // for tutorial
    const [answeredCorrectly,setAnsweredCorrectly]=useState<boolean >(false)
    const [tutorialError,setTutorialError]=useState(false)

    // for wager
    const [wagerAmount,setWagerAmount]=useState<number>(0)

    const [selectedOption, setSelectedOption]=useState<string | undefined>(undefined)
    const [answeredIncorrectly,setAnsweredIncorrectly]=useState(false);
    const [loading,setLoading]=useState(false);
    const [problemAccuracy,setProblemAccuracy]=useState<undefined | number>(undefined);
    const [numCorrect,setNumCorrect]=useState(0);
    // for timer
    const onTimeOver=()=>{
        if (tutorialState)return
        if (loading || answeredIncorrectly || answeredCorrectly)return;
        if (questionCategory==="wager" &&  (wagerAmount<5 || wagerAmount>=score)){
            setWagerAmount(5);
            setTimer(10);
            return;
        }
        handleAnswerSubmit(undefined);
    }
    const {timer,setTimer}=useTimer(10,onTimeOver);
    const nextButton:ButtonType={
        text: tutorialState!==TutorialEnum.Double?"Next":"Get started with a new game",
        onClick:onNextClick,

    }
    useEffect(()=>{
        setWagerAmount(0)
        setAnsweredCorrectly(false)
        setAnsweredIncorrectly(false)
        setTutorialError(false)
    },[tutorialState])

    const handleAnswerSubmit=async(e:FormEvent<HTMLFormElement>|undefined)=>{
        if (e) e.preventDefault()
        setLoading(true)
        // some logic to decide if is true or false -> make api call here
        const res = await fetch("/api/handleAnswerSubmit", {
            method: "POST",
            body: JSON.stringify({
                question,
                answer:selectedOption
            }),
        });

        const {isCorrect, numAttempts,numCorrect}=await res.json();
        const accuracy=(numCorrect/numAttempts )*100;
        const stringacc=accuracy.toFixed(2)
        setProblemAccuracy(parseFloat(stringacc));
        setLoading(false)
        setNumCorrect(numCorrect)
        if (isCorrect){
            setAnsweredCorrectly(true)
            if (questionCategory=="wager")setScore((prev:number)=>prev+wagerAmount)
            else setScore((prev:number)=>prev+question.value)
            return;
        }
        // incorrect
        if (typeof tutorialState!=="undefined"){
            setTutorialError(true)
        }
        else {
            setAnsweredIncorrectly(true);
            setLivesRemaining?.((prev:any)=>prev-1);
            if (questionCategory=="wager")setScore((prev:number)=>Math.max(prev-wagerAmount,0))
        }
    }

    return <div className={"w-full h-full  py-10 text-center"}>
            {/*PERCENT ANSWERED CORRECT*/}
            {/*{*/}
            {/*    (typeof problemAccuracy!=="undefined" && !tutorialState) && <AlexHeader text={`${problemAccuracy}% of people have answered this correct`}/>*/}
            {/*}*/}


            <div className={`bg-slate-500 border rounded-md p-2 text-white 
             ${(!answeredCorrectly && !answeredIncorrectly)?"h-full":""} ${(questionCategory==="wager" &&
                (wagerAmount<5 || wagerAmount>=score)) ? "pb-8":""}`}>
                {/*WAGER*/}
                {
                    questionCategory==="wager" && score !=0 && (wagerAmount<5 || wagerAmount>=score) ?
                        <div className={"w-full h-full text center"}>
                            <h1 className={"text-white text-3xl mt-2"}>${score}</h1>
                        <WagerAnswer setWagerAmount={setWagerAmount} />
                            {!tutorialState && <h1 className={"text-white text-lg mt-2"}>{timer}</h1>}
                        </div>
                        :
                        <>

                {loading ?
                    <div className={"w-full h-full grid place-items-center"}>
                        <Loading/>
                    </div>
                    : answeredCorrectly
                    ?<>
                            <Confetti/>
                        <Alex headerText={"Congratulations"} contentText={`You just made ${questionCategory==="wager" ?wagerAmount:question.value} dollars! ${problemAccuracy}% of 
                        people have answered this correctly.`} button1={nextButton} isStatic={true}/>
                        </>:
                    answeredIncorrectly?
                        < >
                            <Alex headerText={"Oops, so close."} contentText={`The correct answer was ${question.answer}. ${problemAccuracy}% of 
                        people have answered this correctly.`} button1={nextButton} isStatic={true}/>
                        </>
                    :<div className={"w-full h-full"}>
                       <DisplayQuestion numDollars={questionCategory==="wager" ? wagerAmount:question.value}
                                        question={question} selectedOption={selectedOption} setSelectedOption={setSelectedOption}
                                        tutorialError={tutorialError}
                                        handleAnswerSubmit={handleAnswerSubmit} timer={!tutorialState? timer:0}/>
                    {/*<Alex headerText={`${questionCategory==="wager" ? wagerAmount:question.value} dollars`} contentText={question.text}/>*/}
                    {/*        {tutorialError &&<h1 className={"mt-1 text-red-500 font-semibold"}>You made an error, try again.</h1>}*/}



                </div>}

                        </>}
            </div>
    </div>
}