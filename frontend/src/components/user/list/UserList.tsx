import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {get_users} from "../../../_service/api";
import {Avatar, Grid} from "@material-ui/core";

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

function createData(users: any[]): IUser[] {
    return users.map(user => ({
        nickname: user.nickname,
        balance: user.balance,
        total_games: user.total_games,
        total_wins: user.total_wins,
        total_lost: user.total_lost,
        points_earned: user.points_earned,
        points_lost: user.points_lost,
        rating: user.rating,
        points: user.points,
        image_uri: user.image_uri
    }));
}

interface IUser {
    rating: number,
    points: number,
    nickname: string,
    points_earned: number,
    points_lost: number,
    total_lost: number,
    total_wins: number,
    total_games: number,
    balance: number,
    image_uri: string
}

export default function LigueTab() {

    const classes = useStyles();
    const [data, setData] = useState();

    // @ts-ignore
    useEffect(() => {
        get_users()
            .then(
                value => {
                    // @ts-ignore
                    let d = createData(value.data)
                    // @ts-ignore
                    setData(d);
                }
            ).catch(reason => console.log(reason))
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Zawodnik</TableCell>
                        <TableCell align="right">Wszystkie mecze</TableCell>
                        <TableCell align="right">Wygrane</TableCell>
                        <TableCell align="right">Przegrane</TableCell>
                        <TableCell align="right">Punkty zdobyte</TableCell>
                        <TableCell align="right">Punkty stracone</TableCell>
                        <TableCell align="right">Bilans punktów</TableCell>
                        <TableCell align="right">Punkty</TableCell>
                        <TableCell align="right">Ranking</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data && data.map((row: IUser, idx: number) => (
                        <TableRow key={row.nickname} className={idx < 4 ? classes.rowLarge : classes.rowSmall}>
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
                                        {row.nickname.toString()}
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell align="right">{row.total_games}</TableCell>
                            <TableCell align="right">{row.total_wins}</TableCell>
                            <TableCell align="right">{row.total_lost}</TableCell>
                            <TableCell align="right">{row.points_earned}</TableCell>
                            <TableCell align="right">{row.points_lost}</TableCell>
                            <TableCell align="right">{row.balance}</TableCell>
                            <TableCell align="right">{row.points}</TableCell>
                            <TableCell align="right">{row.rating}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
