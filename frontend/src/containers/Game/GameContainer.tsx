import {Accordion, AccordionDetails, AccordionSummary, Avatar, Grid} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import React from "react";


interface IGame {
    game: any
}

export default function GameContainer(props: IGame) {
    const {game} = props

    const [expanded, setExpanded] = React.useState<string | false>('panel');
    const [winner, setWinner] = React.useState<any>();
    const [playerOne, setPlayerOne] = React.useState<any>();
    const [playerTwo, setPlayerTwo] = React.useState<any>();

    const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };


    return (
        <>
            <Accordion key={'accordion-' + game.id} expanded={expanded === 'panel' + game.id}
                       onChange={handleChange('panel' + game.id)}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Grid justify={'center'} container spacing={2}>
                        <Grid justify={'center'} container spacing={2}>
                            <Grid item key={game.id + '-game-grid-item-date'}>
                                {game.date}
                            </Grid>
                        </Grid>
                        {(game.players).map((player: any, k: number) => {
                                if (!winner && player.winner) {
                                    setWinner(player.user)
                                }
                                if (k % 2 === 0) {
                                    if (!playerOne) {
                                        setPlayerOne({user: player.user, winner: player.winner})
                                    }
                                    return (<>
                                        <Grid item key={game.id + '-player-grid-avatar-' + k}>
                                            <Avatar src={player.user.image_uri} alt={player.user.nickname}/>
                                        </Grid>
                                        <Grid item key={game.id + '-player-grid-paper-' + k}>
                                            <Paper elevation={0}>{player.rounds_win}</Paper>
                                        </Grid>
                                        <Grid item key={game.id + '-player-grid-item-' + k}>
                                            :
                                        </Grid>
                                    </>)
                                } else {
                                    if (!playerTwo) {
                                        setPlayerTwo({user: player.user, winner: player.winner})
                                    }
                                    return (
                                        <>
                                            <Grid item key={game.id + '-player-grid-paper-' + k}>
                                                <Paper elevation={0}>{player.rounds_win}</Paper>
                                            </Grid>
                                            <Grid item key={game.id + '-player-grid-avatar-' + k}>
                                                <Avatar src={player.user.image_uri} alt={player.user.nickname}/>
                                            </Grid>
                                        </>
                                    )
                                }
                            }
                        )}
                    </Grid>
                </AccordionSummary>
                <AccordionDetails>

                    <Grid justify={'center'} container spacing={2}>
                        {(game.rounds).map((round: any, l: number) => (
                                <Grid container justify={'center'} spacing={2}>
                                    {winner &&
                                    round.user_rounds.filter((v: any) => {
                                        return v.user.nickname === winner.nickname
                                    }).map((value: any, i: number) => {
                                            if (playerOne.user.nickname === winner.nickname) {
                                                return (<>
                                                    <Grid item key={l + '-player-grid-paper-round-left-' + i}>
                                                        <Paper elevation={0} style={{width: '300px'}}>
                                                            <Grid container
                                                                  direction="row"
                                                                  justify="space-between"
                                                                  alignItems="stretch" spacing={0}>
                                                                <Grid item>{value.points_earned}</Grid>
                                                                <Grid item>{value.points_lost}</Grid>
                                                            </Grid>
                                                        </Paper>
                                                    </Grid>
                                                </>)

                                            } else {
                                                return (<>
                                                    <Grid item
                                                          key={l + '-player-grid-paper-round-left-' + i}>
                                                        <Paper elevation={0}>{value.points_lost}</Paper>
                                                    </Grid>
                                                    <Grid item
                                                          key={l + '-player-grid-paper-round-left-' + i}>
                                                        <Paper elevation={0}>{value.points_earned}</Paper>
                                                    </Grid>
                                                </>)
                                            }
                                        }
                                    )
                                    }
                                </Grid>
                            )
                        )}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </>
    )
}
