import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {get_ligue_user_games, get_ligues} from "../../../_service/api";
import {Button, ButtonGroup, ClickAwayListener, Grid, Grow, MenuItem, MenuList, Popper} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Paper from "@material-ui/core/Paper";
import GameContainer from "../../../containers/Game/GameContainer";

const useStyles = makeStyles({
    z: {
        zIndex: 10000
    },
});

function createData(games: any[]): IGame[] {
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

export default function UserGamesHistorical() {
    const classes = useStyles();
    const [games, setGames] = useState();
    const [ligues, setLigues] = useState();
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);
    const [selectedLigue, setSelectedLigue] = React.useState();

    function get_games(ligue: any) {
        get_ligue_user_games(ligue.name)
            .then(
                value => {
                    // if (value.data) {
                    let d = createData(value.data)
                    setGames(d);
                    // }
                }
            ).catch(reason => {
            setGames(null)
        })
    }


    // @ts-ignore
    useEffect(() => {
        get_ligues()
            .then(
                value => {
                    if (value.data) {
                        setLigues(value.data);
                        const selLigue = value.data.filter((ligue: any) => ligue.active)[0]
                        setSelectedLigue(selLigue)
                        get_games(selLigue)
                    }
                }
            ).catch(reason => console.log(reason))
    }, selectedLigue);

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        ligue: any,
    ) => {
        setSelectedLigue(ligue)
        setOpen(false);
        console.log('getgames')
        get_games(ligue)
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };
    // @ts-ignore
    return (
        <>
            {
                (ligues && selectedLigue) &&
                <Grid container direction="column" alignItems="center">
                    <Grid item xs={12}>
                        <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                            <Button>Liga: {selectedLigue.name}</Button>
                            <Button
                                color="primary"
                                size="small"
                                aria-controls={open ? 'split-button-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-label="select merge strategy"
                                aria-haspopup="menu"
                                onClick={handleToggle}
                            >
                                <ArrowDropDownIcon/>
                            </Button>
                        </ButtonGroup>
                        <Popper className={classes.z} open={open} anchorEl={anchorRef.current} transition disablePortal>
                            {({TransitionProps, placement}) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                    }}
                                >
                                    <Paper className={classes.z}>
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList id="split-button-menu" className={classes.z}>
                                                {
                                                    ligues.map((ligue: any) => (
                                                        <MenuItem
                                                            key={ligue.name + '654asd'}
                                                            onClick={(event) => handleMenuItemClick(event, ligue)}
                                                        >
                                                            {ligue.name}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </Grid>
                </Grid>
            }
            {
                games &&
                <>
                    {
                        games.map((game: any, index: number) => (
                                <GameContainer game={game}/>
                            )
                        )
                    }
                </>
            }
        </>
    );
}
