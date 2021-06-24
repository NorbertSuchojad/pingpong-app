import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Container, Grid} from "@material-ui/core";
import {get_user_stats} from "../../../_service/api";
import {Legend, Pie, PieChart, Tooltip} from 'recharts';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        form: {
            '& > *': {
                margin: theme.spacing(1),
            },
            maxWidth: '600px'
        },
        small: {
            width: theme.spacing(3),
            height: theme.spacing(3),
        },
        large: {
            width: theme.spacing(15),
            height: theme.spacing(15),
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
        fabGray: {
            backgroundColor: 'lightgray'
        },
    }),
);

export default function UserStats() {
    const classes = useStyles();
    const width = 200;
    const height = 250;
    const [data, setData] = useState();
    const [games, setGames] = useState();
    const [grw, setGRW] = useState();
    const [grl, setGRL] = useState();

    useEffect(() => {
        get_user_stats()
            .then(
                value => {
                    // @ts-ignore
                    setData(generate(value.data));
                }
            ).catch(reason => console.log(reason))
    }, []);

    function generate(data: any) {
        setGames([
            {
                "name": "Przegrane",
                "value": data.games.lost
            },
            {
                "name": "Wygrane",
                "value": data.games.wins
            }
        ])
        setGRW([
            {
                "name": "Wygrane w stosunku 2:0",
                "value": data.game_win['2:0']
            },
            {
                "name": "Wygrane w stosunku 2:1",
                "value": data.game_win['2:1']
            }
        ])
        setGRL([
            {
                "name": "Przegrane w stosunku 0:2",
                "value": data.game_lost['0:2']
            },
            {
                "name": "Przegrane w stosunku 1:2",
                "value": data.game_lost['1:2']
            }
        ])
    }

    return (
        <Container className={classes.root}>

            {
                games &&
                <Grid container direction="row"
                      justify="space-evenly"
                      alignItems="center" spacing={2}>
                    <Grid item>
                        <label>Gry ogółem</label>
                        <PieChart width={width} height={height}>
                            <Pie data={games} dataKey="value" nameKey="name" cx="50%" cy="50%" fill={'lightblue'}
                                 innerRadius={60}
                                 outerRadius={80} label/>
                            <Tooltip/>
                            <Legend/>
                        </PieChart>
                    </Grid>
                    <Grid item>
                        <label>Statystyka rund wygranych</label>
                        <PieChart width={width} height={height}>
                            <Pie data={grw} dataKey="value" nameKey="name" cx="50%" cy="50%" fill={'lightblue'}
                                 innerRadius={60}
                                 outerRadius={80} label/>
                            <Tooltip/>
                        </PieChart>
                    </Grid>
                    <Grid item>
                        <label>Statystyka rund przegranych</label>
                        <PieChart width={width} height={height}>
                            <Pie data={grl} dataKey="value" nameKey="name" cx="50%" cy="50%" fill={'lightblue'}
                                 innerRadius={60}
                                 outerRadius={80} label/>
                            <Tooltip/>
                        </PieChart>
                    </Grid>
                </Grid>
            }
        </Container>
    );
}
