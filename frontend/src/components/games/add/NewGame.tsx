import React, {useContext, useEffect, useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import {Close} from '@material-ui/icons';
import {
    Avatar,
    Dialog,
    DialogTitle,
    Divider,
    Grid,
    GridSpacing,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    TextField,
    Typography
} from "@material-ui/core";
import {get_opponents, set_new_game} from "../../../_service/api";
import {blue} from "@material-ui/core/colors";
import InfoSnackbar from "../../helpers/InfoSnackbar";
import {ctxt} from '../../../utils/UserContext';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 240,
        },
        root: {
            flexGrow: 1,
        },
        paper: {
            height: 100,
            width: 250,
        },
        control: {
            padding: theme.spacing(2),
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 200,
        },
        button: {
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        actionsContainer: {
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(2),
        },
        resetContainer: {
            padding: theme.spacing(3),
        },
        rootForm: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
        avatar: {
            backgroundColor: blue[100],
            color: blue[600],
        },
        avatarLarge: {
            backgroundColor: blue[100],
            color: blue[600],
            width: '80px',
            height: '80px',
        },
        finalComparition: {
            display: "flex",
            justifyContent: "center",
        },
    }),
);


function getSteps() {
    return ['Wybierz zawodników', 'Wprowadź wyniki', 'Potwierdź'];
}

interface IUser {
    nickname: string
    image_uri: string
}

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: IUser;
    onClose: (value: IUser) => void;
    users: IUser[]
}

export default function NewGame() {
    const initialUser: IUser = {nickname: '', image_uri: ''}
    const classes = useStyles();
    const spacing: GridSpacing = 2;
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    const [openPlayerOne, setOpenPlayerOne] = React.useState(false);
    const [openPlayerTwo, setOpenPlayerTwo] = React.useState(false);
    const [errors, setErrors] = React.useState('');
    const [playerOne, setPlayerOne] = React.useState<IUser>(initialUser);
    const [playerTwo, setPlayerTwo] = React.useState<IUser>(initialUser);
    const [data, setData] = useState([]);
    const [result, setResult] = useState([[0, 0], [0, 0], [0, 0]]);
    let appContext = useContext(ctxt);


    // @ts-ignore
    useEffect(() => {
        get_opponents()
            .then(
                value => {
                    if (value && value.data) {
                        setData(value.data)
                    }
                }
            ).catch(reason => console.log(reason))
    }, []);

    const getRoundsWinForPlayer = (playerNo: 1 | 2) => {
        const res = [0, 0]
        for (const roundNo in result) {
            // console.log(round)
            if (result[roundNo][0] > result[roundNo][1]) {
                res[0] += 1
            } else if (result[roundNo][0] < result[roundNo][1]) {
                res[1] += 1
            }
        }
        return res[playerNo - 1]
    }

    const handleNext = () => {

        const p1_rounds = getRoundsWinForPlayer(1)
        const p2_rounds = getRoundsWinForPlayer(2)


        if (activeStep === steps.length - 1) {
            if (validate_new_game()) {
                return
            }

            const data = {
                'players': [{
                    'winner': p2_rounds < p1_rounds,
                    'user': {
                        'nickname': playerOne.nickname,
                        'image_uri': playerOne.image_uri
                    },
                    'rounds_lost': p2_rounds,
                    "rounds_win": p1_rounds
                }, {
                    'winner': p2_rounds > p1_rounds,
                    'user': {
                        'nickname': playerTwo.nickname,
                        'image_uri': playerTwo.image_uri
                    },
                    'rounds_lost': p1_rounds,
                    'rounds_win': p2_rounds
                }],
                'rounds':
                    result.filter((value, index) => (value.reduce((a, b) => a + b, 0)) > 0).map((value, index) => {
                        return (
                            {
                                "user_rounds": [
                                    {
                                        "points_lost": value[1],
                                        "winner": value[0] > value[1],
                                        "points_earned": value[0],
                                        'user': {
                                            'nickname': playerOne.nickname,
                                            'image_uri': playerOne.image_uri
                                        },
                                    },
                                    {
                                        "points_lost": value[0],
                                        "winner": value[0] < value[1],
                                        "points_earned": value[1],
                                        'user': {
                                            'nickname': playerTwo.nickname,
                                            'image_uri': playerTwo.image_uri
                                        },
                                    }
                                ],
                                "round_no": index + 1
                            }
                        )
                    })
            }
            set_new_game(data)
                .then(value => {
                    return value
                }).catch(reason => console.log(reason))
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    function validate_new_game() {
        if (playerOne.nickname.length === 0) {
            setErrors('Player 1 nie został wybrany')
            return true
        }
        if (playerTwo.nickname.length === 0) {
            setErrors('Player 2 nie został wybrany')
            return true
        }
        return false
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        setPlayerOne(initialUser);
        setPlayerTwo(initialUser);
        setResult([[0, 0], [0, 0], [0, 0]])
    };


    function getStepContent(step: number) {
        if (!appContext) {
            return;
        }
        let user = appContext.user
        if (playerOne.nickname.length === 0 && user.nickname.length !== 0) {
            setPlayerOne(user)
        }
        switch (step) {
            case 0:
                return step1(user);
            case 1:
                return step2(user);
            case 2:
                return step3(user);
            default:
                return 'Unknown step';
        }
    }

    // @ts-ignore
    const handleChangeResult = (index, round) => e => {
        let newArr = [...result]; // copying the old datas array
        newArr[index][round] = Number(e.target.value); // replace e.target.value with whatever you want to change it to
        setResult(newArr); // ??
    }

    function getWinner() {
        const res = checkScore()
        if (res[0] > res[1]) {
            return playerOne.nickname
        }
        return playerTwo.nickname
    }

    function checkScore() {
        let p2score = 0;
        let p1score = 0;

        for (let resultElement of result) {

            if (resultElement[0] > resultElement[1]) {
                p1score++;
            } else if (resultElement[0] < resultElement[1]) {
                p2score++;
            }
        }
        return [p1score, p2score];
    }

    function SimpleDialog(props: SimpleDialogProps) {
        const {onClose, selectedValue, open} = props;

        const handleClose = () => {
            onClose(selectedValue);
        };

        const handleListItemClick = (value: IUser) => {
            onClose(value);
        };

        return (
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <DialogTitle id="simple-dialog-title">Wybierz zawodnika</DialogTitle>
                <List>
                    {props.users && props.users.map((user: IUser) => (
                        <ListItem button onClick={() => handleListItemClick(user)} key={user.nickname}>
                            <ListItemAvatar>
                                <Avatar className={classes.avatar} src={user.image_uri}/>
                            </ListItemAvatar>
                            <ListItemText primary={user.nickname}/>
                        </ListItem>
                    ))}
                    <ListItem autoFocus button onClick={() => handleListItemClick(initialUser)}>
                        <ListItemAvatar>
                            <Avatar>
                                <Close/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Anuluj"/>
                    </ListItem>
                </List>
            </Dialog>
        );
    }


    function step1(user: any) {

        const handleCloseSelectPlayerOne = (value: IUser) => {
            setOpenPlayerOne(false);
            setPlayerOne(value);
            if (value === user || value === initialUser) {
                setPlayerTwo(initialUser)
            } else {
                setPlayerTwo(user)
            }
        };

        const handleCloseSelectPlayerTwo = (value: IUser) => {
            setOpenPlayerTwo(false);
            setPlayerTwo(value);
            if (value === user || value === initialUser) {
                setPlayerOne(initialUser)
            } else {
                setPlayerOne(user)
            }
        };

        const handleOpenPlayerOne = () => {
            setOpenPlayerOne(true);
        };

        const handleOpenPlayerTwo = () => {
            setOpenPlayerTwo(true);
        };

        return (
            <>
                <div style={{marginTop: '40px'}}>
                    <div>
                        <Grid container className={classes.root} spacing={2}>
                            <Grid item xs={12}>
                                <Grid container justify="center" alignItems="center" spacing={spacing}>

                                    <Grid item>
                                        <Paper className={classes.paper}>
                                            <FormControl className={classes.formControl} style={{paddingTop: "20px"}}>
                                                <SimpleDialog selectedValue={playerOne} open={openPlayerOne}
                                                              users={data.filter((user: IUser) => user.nickname !== playerTwo.nickname)}
                                                              onClose={handleCloseSelectPlayerOne}/>

                                                <Button aria-controls="simple-menu" aria-haspopup="true"
                                                        onClick={handleOpenPlayerOne}>
                                                    <Avatar alt={playerOne.nickname}
                                                            src={playerOne.image_uri}/>
                                                    <Divider orientation="vertical" flexItem
                                                             style={{width: '20px', backgroundColor: 'transparent'}}/>
                                                    {playerOne.nickname || "Player 1"}
                                                </Button>
                                            </FormControl>
                                        </Paper>
                                    </Grid>

                                    <Grid item>
                                        <Paper className={classes.paper}>
                                            <FormControl className={classes.formControl} style={{paddingTop: "20px"}}>
                                                <SimpleDialog selectedValue={playerOne} open={openPlayerTwo}
                                                              users={data.filter((u: IUser) => u.nickname !== playerOne.nickname)}
                                                              onClose={handleCloseSelectPlayerTwo}/>

                                                <Button aria-controls="simple-menu" aria-haspopup="true"
                                                        onClick={handleOpenPlayerTwo}>
                                                    <Avatar alt={playerTwo.nickname}
                                                            src={playerTwo.image_uri}/>
                                                    <Divider orientation="vertical" flexItem
                                                             style={{width: '20px', backgroundColor: 'transparent'}}/>
                                                    {playerTwo.nickname || "Player 2"}
                                                </Button>
                                            </FormControl>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container className={classes.root} spacing={2}>

                        </Grid>
                    </div>
                </div>
                <div className={classes.actionsContainer}>
                    <div>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            className={classes.button}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            // disabled={playerOne.nickname.length==0 && playerTwo.nickname.length==0}
                            className={classes.button}
                        >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    function step2(user: any) {
        return (<>
                {
                    result.map((round, index) => {
                            return (<>
                                <div>Round {index + 1}</div>
                                <form className={classes.rootForm}>
                                    {round.map((score, idx) => {
                                        return (
                                            <TextField key={"outlined-" + index + "-" + idx} type={"number"} value={score}
                                                       onChange={handleChangeResult(index, idx)}
                                                       InputProps={{inputProps: {min: 0}}}
                                                       variant="outlined"/>)
                                    })}
                                </form>
                            </>)
                        }
                    )}
                <div className={classes.actionsContainer}>
                    <div>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            className={classes.button}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            disabled={result
                                .reduce((acc, val) => acc.concat(val), [])
                                .reduce((a, b) => a + b, 0) === 0}
                            className={classes.button}
                        >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    function step3(user: any) {
        return (<>
                <div style={{marginTop: '40px'}}>
                    <div>
                        <Grid container className={classes.root} spacing={2}>
                            <Grid item xs={12}>
                                <Grid container justify="center" alignItems="center" spacing={spacing}>
                                    <Grid item>
                                        <Paper className={classes.paper}>
                                            <div className={classes.finalComparition}>
                                                <Avatar className={classes.avatarLarge} src={playerOne.image_uri}/>
                                            </div>
                                            <div>
                                                {checkScore()[0]}
                                            </div>
                                        </Paper>
                                    </Grid>

                                    <Grid item>
                                        <Paper elevation={0}>
                                            :
                                        </Paper>
                                    </Grid>

                                    <Grid item>
                                        <Paper className={classes.paper}>
                                            <div className={classes.finalComparition}>
                                                <Avatar className={classes.avatarLarge} src={playerTwo.image_uri}/>
                                            </div>
                                            <div>
                                                {checkScore()[1]}
                                            </div>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container className={classes.root} spacing={2}>

                        </Grid>
                    </div>
                </div>
                <div className={classes.actionsContainer}>
                    <div>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            className={classes.button}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            className={classes.button}
                        >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div>
            <div>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                {getStepContent(index)}
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} className={classes.resetContainer}>
                        <Typography>All steps completed - you&apos;re finished</Typography>
                        <Button onClick={handleReset} className={classes.button}>
                            Reset
                        </Button>
                    </Paper>
                )}
            </div>
            <InfoSnackbar message={errors} onClose={event => setErrors('')}/>
        </div>
    );
}
