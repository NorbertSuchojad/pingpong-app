import React from "react";
import GameContainer from "./GameContainer";


interface IGameList {
    games: any[]
}

export default function GameListContainer(props: IGameList) {
    const {games} = props
    return (
        <>
            {
                games &&
                games.map((game: any, index: number) => (
                        <GameContainer game={game}/>
                    )
                )
            }
        </>
    )
}