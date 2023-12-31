/* eslint-disable */
import { ImageResponse } from 'next/server';


export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const score=searchParams.get('score')

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    fontSize: 60,
                    color: 'black',
                    background: 'rgb(8 47 73)',
                    width: '100%',
                    height: '100%',
                    paddingTop: 50,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >

                {(name )? (
                    <div
                        tw={"w-full flex flex-col items-center"}
                    >

                        <div tw={"w-full flex justify-center overflow-auto"}>
                               <h1 tw={"font-medium text-white font-mono text-4xl"}>{`${name} won ${score} dollars.`}</h1>
                        </div>
                    </div>
                ) : (
                    <h1 tw={"text-slate-400 font-bold text-4xl mt-8"}>
                        No user found
                    </h1>
                )}
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}
