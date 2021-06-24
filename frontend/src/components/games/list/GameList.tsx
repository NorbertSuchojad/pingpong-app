import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {get_all_ligue_games, get_ligue} from "../../../_service/api";
import {Button} from "@material-ui/core";
import GameListContainer from "../../../containers/Game/GameListContainer";

const useStyles = makeStyles(theme => ({
    table: {
        minWidth: 650,
    },
    button: {
        margin: '10px',
    },
    roundCls: {
        // padding: theme.spacing(3, 2),
        // height: 200,
        display: "flex",
        // flexDirection: "column",
        justifyContent: "center"
    },
    tableCell: {
        borderBottom: "none"
    },
    fab: {
        margin: theme.spacing(2),
    },
}));

function createData(games: any[]): any[] {
    return games.map(game => ({
        player_one: game.player_one,
        player_two: game.player_two,
        winner: game.winner,
        date: game.date_time,
        rounds: game.rounds,
        players: game.players,
        player_one_approve: game.player_one_approve,
        player_two_approve: game.player_two_approve,
    }));
}

interface IGame {
    player_one: string,
    player_one_approve: boolean,
    player_two: string,
    player_two_approve: boolean,
    winner: string,
    date: string
    rounds: any[]
}

export default function GameList() {
    const classes = useStyles();
    const [games, setGames] = useState();
    const [ligue, setLigue] = useState();

    // @ts-ignore
    useEffect(() => {
        get_all_ligue_games()
            .then(
                value => {
                    if (value.data) {
                        // @ts-ignore
                        let d = createData(value.data)
                        // @ts-ignore
                        setGames(d);
                    }
                }
            ).catch(reason => console.log(reason))
    }, []);

    // @ts-ignore
    useEffect(() => {
        get_ligue()
            .then(
                value => {
                    // @ts-ignore
                    setLigue(value.data);
                }
            ).catch(reason => console.log(reason))
    }, []);

    // @ts-ignore
    return (
        <>
            {
                ligue &&
                <Button className={classes.button} variant="contained" color="primary">
                    Liga: {ligue.name}
                </Button>
            }
            {
                games &&
                <GameListContainer games={games}/>
            }
        </>
    );
}