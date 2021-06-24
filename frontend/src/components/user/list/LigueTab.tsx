import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {get_ligue, get_ligue_users_stats} from "../../../_service/api";
import {
    Avatar,
    Button,
    ButtonGroup,
    ClickAwayListener,
    Dialog,
    DialogTitle,
    Grid,
    Grow,
    MenuItem,
    MenuList,
    Popper
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import {SimpleDialogProps} from "../../games/add/NewGame";

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

export default function LigueTab() {

    const classes = useStyles();
    const [data, setData] = useState();
    const [ligue, setLigue] = useState();
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleClick = () => {
        console.info(`You clicked`);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
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
    useEffect(() => {
        get_ligue_users_stats()
            .then(
                value => {
                    // @ts-ignore
                    let d = createData(value.data)
                    // @ts-ignore
                    setData(d);
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

    return (
        <>
            {
                ligue &&
                <Grid container direction="column" alignItems="center">
                    <Grid item xs={12}>
                        <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                            <Button onClick={handleClick}>Liga: {ligue.name}</Button>
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
                        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
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
                                                <MenuItem
                                                    key={'asdasd'}
                                                    onClick={(event) => handleMenuItemClick(event, 2)}
                                                >
                                                    Zakończ ligę
                                                </MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </Grid>
                </Grid>
            }
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
                        {data && data.map((row: IStat, idx: number) => (
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
        </>
    );
}

function SimpleDialog(props: SimpleDialogProps) {
    const {onClose, selectedValue, open} = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value: IStat) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Wprowadź nazwę nowej ligi</DialogTitle>
        </Dialog>
    );
}
