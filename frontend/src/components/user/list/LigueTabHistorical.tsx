import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {get_ligue_users_stats, get_ligues} from "../../../_service/api";
import {
    Avatar,
    Button,
    ButtonGroup,
    ClickAwayListener,
    Grid,
    Grow,
    MenuItem,
    MenuList,
    Popper
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    rowLarge: {
        height: '80px',
    },
    rowSmall: {
        height: '65px',
    },
    large: {
        width: '70px',
        height: '70px',
    },
    small: {
        width: '40px',
        height: '40px',
        marginLeft: '15px'
    },
    button: {
        margin: '10px',
    },
});

function createData(stats: any[]): IStat[] {
    return stats.map(stat => ({
        nickname: stat.user.nickname,
        balance: stat.balance,
        total_games: stat.total_games,
        total_wins: stat.total_wins,
        total_lost: stat.total_lost,
        sets_lost: stat.sets_lost,
        sets_win: stat.sets_win,
        points_earned: stat.points_earned,
        points_lost: stat.points_lost,
        points: stat.points,
        image_uri: stat.user.image_uri
    }));
}

interface IStat {
    points: number,
    nickname: string,
    points_earned: number,
    points_lost: number,
    total_lost: number,
    total_wins: number,
    sets_lost: number,
    sets_win: number,
    total_games: number,
    balance: number,
    image_uri: string
}

export default function LigueTabHistorical() {

    const classes = useStyles();
    const [stats, setStats] = useState();
    const [ligues, setLigues] = useState();
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);
    // const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [selectedLigue, setSelectedLigue] = React.useState();

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        ligue: any,
    ) => {
        setSelectedLigue(ligue)
        setOpen(false);
        get_ligue_stats(ligue)
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
    // useEffect(() => {
    //     get_ligue_users_stats()
    //         .then(
    //             value => {
    //                 // @ts-ignore
    //                 let d = createData(value.data)
    //                 // @ts-ignore
    //                 setData(d);
    //             }
    //         ).catch(reason => console.log(reason))
    // }, []);

    function get_ligue_stats(ligue: any) {
        console.log(ligue)
        get_ligue_users_stats(ligue.name)
            .then(
                value => {
                    // @ts-ignore
                    let d = createData(value.data)
                    // @ts-ignore
                    setStats(d);
                }
            ).catch(reason => {
            setStats(null)
        })
    }


    // @ts-ignore
    useEffect(() => {
        get_ligues()
            .then(
                value => {
                    if (value.data) {
                        // @ts-ignore
                        setLigues(value.data);
                        const selLigue = value.data.filter((ligue: any) => ligue.active)[0]
                        setSelectedLigue(selLigue)
                        get_ligue_stats(selLigue)
                    }
                }
            ).catch(
            reason => console.log(reason)
        )
    }, selectedLigue);

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
                        <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
                            {({TransitionProps, placement}) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList id="split-button-menu">
                                                {
                                                    ligues.map((ligue: any) => (
                                                        <MenuItem
                                                            key={ligue.id}
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
                stats &&
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Zawodnik</TableCell>
                                <TableCell align="right">Wszystkie mecze</TableCell>
                                <TableCell align="right">Wygrane</TableCell>
                                <TableCell align="right">Przegrane</TableCell>
                                <TableCell align="right">Sety zdobyte</TableCell>
                                <TableCell align="right">Sety stracone</TableCell>
                                <TableCell align="right">Punkty zdobyte</TableCell>
                                <TableCell align="right">Punkty stracone</TableCell>
                                <TableCell align="right">Bilans punktów</TableCell>
                                <TableCell align="right">Punkty</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                stats && stats.map((row: IStat, idx: number) => (
                                    <TableRow key={row.nickname}
                                              className={idx < 4 ? classes.rowLarge : classes.rowSmall}>
                                        <TableCell component="th" scope="row">
                                            <Grid
                                                container
                                                direction="row"
                                                alignItems="center"
                                                spacing={1}
                                            >
                                                <Grid item>
                                                    <Avatar alt={row.nickname} src={row.image_uri}
                                                            className={idx < 4 ? classes.large : classes.small}/>
                                                </Grid>
                                                <Grid item>
                                                    {row.nickname}
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                        <TableCell align="right">{row.total_wins + row.total_lost}</TableCell>
                                        <TableCell align="right">{row.total_wins}</TableCell>
                                        <TableCell align="right">{row.total_lost}</TableCell>
                                        <TableCell align="right">{row.sets_win}</TableCell>
                                        <TableCell align="right">{row.sets_lost}</TableCell>
                                        <TableCell align="right">{row.points_earned}</TableCell>
                                        <TableCell align="right">{row.points_lost}</TableCell>
                                        <TableCell align="right">{row.balance}</TableCell>
                                        <TableCell align="right">{row.points}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </>
    );
}
