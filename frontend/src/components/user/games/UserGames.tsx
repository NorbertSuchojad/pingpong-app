import React, {useContext, useEffect, useState} from 'react';
import clsx from 'clsx';
import {createStyles, lighten, makeStyles, Theme} from '@material-ui/core/styles';
import {confirm_games, get_ligue, get_user_games} from "../../../_service/api";

import {CheckCircleOutline} from '@material-ui/icons';
import {
    Avatar,
    Button,
    Checkbox,
    Fab,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Tooltip,
    Typography
} from "@material-ui/core";
import {ctxt} from "../../../utils/UserContext";

const useStyles = makeStyles(theme => ({
    roundCls: {
        display: "flex",
        justifyContent: "center"
    },
    tableCell: {
        borderBottom: "none"
    },
    fab: {
        margin: theme.spacing(2),
    },
    fabNotConfirmed: {
        backgroundColor: "red"
    },
    fabConfirmed: {
        backgroundColor: "green"
    },
    icon: {
        color: 'white',
    },
    root: {
        width: '100%',
    },
    asd: {
        display: "flex",
        maxWidth: '500px',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));


export default function UserGames() {
    const classes = useStyles();
    const [games, setGames] = useState([]);
    const [ligue, setLigue] = useState()

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('id');
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    let appContext = useContext(ctxt);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };


    const confirmGames = (event: any) => {
        console.log("----------------------------------------")
        confirm_games(selected).then(value => console.log(value))
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = games.map((n: Data) => (n.id as unknown as string));
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    function createData(games: any[]): Data[] {
        if (!appContext || (appContext && !appContext.user)) {
            return [];
        }
        let user = appContext.user
        return games.map(game => {
            const results = game.players.filter((player: any) => player.user.nickname !== user.nickname)
            return {
                opponent_nickname: results[0].user.nickname,
                opponent_image_uri: results[0].user.image_uri,
                winner: results[0].winner,
                rounds_win: results[0].rounds_win,
                rounds_lost: results[0].rounds_lost,
                date_time: game.date_time,
                rounds: game.rounds,
                id: game.id,
                confirmed: game.players.filter((player: any) => player.user.nickname == user.nickname)[0].confirmed
            }
        });
    }

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, games.length - page * rowsPerPage);

    // @ts-ignore
    useEffect(() => {
        get_user_games()
            .then(
                value => {
                    if (value.data.length > 0) {
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


    return (
        <>
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <EnhancedTableToolbar numSelected={selected.length} ligue={ligue} onConfirmClick={confirmGames}/>
                    <TableContainer>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={'medium'}
                            aria-label="enhanced table"
                        >
                            <EnhancedTableHead
                                classes={classes}
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={games.length}
                            />
                            <TableBody>
                                {stableSort(games, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.id as string);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(event, row.id as string)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={isItemSelected}
                                                        inputProps={{'aria-labelledby': labelId}}
                                                    />
                                                </TableCell>
                                                <TableCell component="th" id={labelId} scope="row" padding="none">
                                                    <Grid
                                                        container
                                                        direction="row"
                                                        alignItems="center"
                                                        spacing={1}
                                                    >
                                                        <Grid item>
                                                            <Avatar src={row.opponent_image_uri.toString()}
                                                                    alt={row.opponent_nickname.toString()}/>
                                                        </Grid>
                                                        <Grid item>
                                                            {row.opponent_nickname.toString()}
                                                        </Grid>
                                                    </Grid>
                                                </TableCell>
                                                <TableCell align="right">{row.date_time}</TableCell>
                                                <TableCell align="right">{!row.winner ? 'Tak' : ':('}</TableCell>
                                                <TableCell align="right">{row.rounds_win}</TableCell>
                                                <TableCell align="right">{row.rounds_lost}</TableCell>
                                                <TableCell align="right">{row.confirmed ? 'Tak' : 'Nie'}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{height: (53) * emptyRows}}>
                                        <TableCell colSpan={6}/>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={games.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        </>
    );
}
const useToolbarStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.type === 'light'
                ? {
                    color: theme.palette.primary.main,
                    backgroundColor: lighten(theme.palette.primary.light, 0.85),
                }
                : {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.primary.dark,
                },
        title: {
            flex: '1 1 100%',
        },
    }),
);


interface EnhancedTableToolbarProps {
    numSelected: number,
    ligue: any,
    onConfirmClick: (event: any) => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const classes = useToolbarStyles();
    const {numSelected, onConfirmClick} = props;

    return (
        <Toolbar
            className={clsx(
                classes.root, {
                    [classes.highlight]: numSelected > 0,
                }
            )}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    {
                        props.ligue &&
                        <Button style={{margin: '10px'}} variant="contained" color="primary">
                            Liga: {props.ligue.name}
                        </Button>
                    }
                </Typography>
            )}
            {numSelected > 0 &&
            <Tooltip title={'Potwierdź'}>
                <Fab style={{backgroundColor: 'green', color: 'white', fontSize: '10px'}} variant={"extended"}
                     size={"small"}
                     onClick={onConfirmClick}
                >
                    <CheckCircleOutline style={{color: 'white'}}/>
                    Potwierdź
                </Fab>
            </Tooltip>
            }
        </Toolbar>
    );
};

const headCells: HeadCell[] = [
    {id: 'opponent_nickname', numeric: false, disablePadding: true, label: 'Przeciwnik'},
    {id: 'date_time', numeric: true, disablePadding: false, label: 'Data zgłoszenia'},
    {id: 'winner', numeric: true, disablePadding: false, label: 'Wygrana'},
    {id: 'rounds_win', numeric: true, disablePadding: false, label: 'Sety zdobyte'},
    {id: 'rounds_lost', numeric: true, disablePadding: false, label: 'Sety stracone'},
    {id: 'confirmed', numeric: true, disablePadding: false, label: 'Gra potwierdzona?'},
];

interface Data {
    opponent_nickname: string,
    opponent_image_uri: string,
    winner: boolean,
    confirmed: boolean,
    rounds_win: number,
    rounds_lost: number,
    date_time: string,
    rounds: any[],
    id: number,
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

interface EnhancedTableProps {
    classes: ReturnType<typeof useStyles>;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
    const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{'aria-label': 'select all desserts'}}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

