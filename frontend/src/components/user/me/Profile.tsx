import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {
    Avatar,
    Badge,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    FormControl,
    Grid,
    InputLabel,
    OutlinedInput
} from "@material-ui/core";
import {change_user_image, get_user_data, set_user_password} from "../../../_service/api";
import {Cancel, Edit, Save} from "@material-ui/icons";
import UserStats from "../stats/UserStats";

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

export default function Profile() {
    const classes = useStyles();
    const [data, setData] = useState();
    const [open, setOpen] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [tempImageUri, setTempImageUri] = useState();
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [editMode, setEditMode] = useState(false);


    let chip = () => <Chip variant="outlined" color="secondary" onDelete={handleDelete} title={passwordError}
                           label={passwordError}/>

    function handleDelete() {
        setPasswordError("")
    }

    useEffect(() => {
        get_user_data()
            .then(
                value => {
                    // @ts-ignore
                    setData(value.data);
                }
            ).catch(reason => console.log(reason))
    }, []);


    function onEditMode() {
        setEditMode(!editMode)
    }

    function save() {
        if (password !== passwordConfirm) {
            setPasswordError('Hasła nie są identyczne')
            return
        }
        if (password.length < 6) {
            setPasswordError('Hasło musi być dłużesz niż 6 znaków')
            return
        }
        const d = {
            'image_uri': data.image_uri,
            'nickname': data.nickname,
            'password': password
        }
        set_user_password(d)
            .then(value => console.log(value))
        setEditMode(!editMode)
    }


    function openModal() {
        setOpen(true)
    }

    function handleClose() {
        setOpen(false)
    }

    function handleCancel() {
        setTempImageUri(null)
        setOpen(false)
    }

    function handleChangeImageUri() {
        const d = {
            'image_uri': tempImageUri,
        }
        change_user_image(d)
            .then(value => console.log(value))
        setOpen(false)
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item>
                    {data &&
                    <>
                        <div className={classes.root}>
                            <Badge
                                overlap="circle"
                                // anchorOrigin={{
                                //     vertical: 'bottom',
                                //     horizontal: 'right',
                                // }}
                                badgeContent={<Edit onClick={openModal}/>}
                            >
                                <Avatar alt={data.nickname} src={tempImageUri ? tempImageUri : data.image_uri}
                                        className={classes.large}/>
                            </Badge>

                        </div>

                        <form className={classes.form}>
                            <FormControl variant="outlined" size={"medium"} disabled={!editMode} fullWidth>
                                <InputLabel htmlFor="component-outlined">Nick</InputLabel>
                                <OutlinedInput id="component-outlined" value={data.nickname} label="Nick"/>
                            </FormControl>
                            <FormControl variant="outlined" disabled fullWidth>
                                <InputLabel htmlFor="component-outlined">email</InputLabel>
                                <OutlinedInput id="component-outlined" value={data.email} label="Nick"/>
                            </FormControl>


                            {!editMode && <Fab variant="extended" color={"primary"} onClick={onEditMode}>
                                <Edit className={classes.extendedIcon}/>
                                Edytuj
                            </Fab>}
                            {editMode &&
                            <>
                                <FormControl variant="outlined" size={"medium"} fullWidth>
                                    <InputLabel htmlFor="component-outlined">Hasło</InputLabel>
                                    <OutlinedInput error={passwordError !== ""} id="component-outlined" label="Hasło"
                                                   type={"password"} value={password}
                                                   onChange={event => setPassword(event.target.value)}/>
                                </FormControl>
                                <FormControl variant="outlined" size={"medium"} fullWidth>
                                    <InputLabel htmlFor="component-outlined">Potwierdź hasło</InputLabel>
                                    <OutlinedInput error={passwordError !== ""} id="component-outlined"
                                                   label={"Potwierdź hasło"} type={"password"}
                                                   value={passwordConfirm}
                                                   onChange={event => setPasswordConfirm(event.target.value)}/>
                                </FormControl>
                                <FormControl size={"medium"} fullWidth>
                                    {passwordError &&
                                    chip()
                                    }
                                </FormControl>
                                <Fab variant="extended" color={"primary"} onClick={save}>
                                    <Save className={classes.extendedIcon}/>
                                    Zapisz
                                </Fab>
                                <Fab variant="extended" className={classes.fabGray} onClick={onEditMode}>
                                    <Cancel className={classes.extendedIcon}/>
                                    Anuluj
                                </Fab>
                            </>

                            }
                        </form>

                        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                            <DialogTitle id="simple-dialog-title">Wklej adres URL nowego avatara</DialogTitle>
                            <DialogContent>
                                <FormControl variant="outlined" size={"medium"} fullWidth>
                                    <InputLabel htmlFor="component-outlined">Image url</InputLabel>
                                    <OutlinedInput id="component-outlined"
                                                   defaultValue={tempImageUri ? tempImageUri : data.image_uri}
                                                   onChange={event => setTempImageUri(event.target.value)}
                                                   label="Image url"/>
                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleChangeImageUri} color="primary">
                                    Zapisz
                                </Button>
                                <Button onClick={handleCancel} color="primary" autoFocus>
                                    Anuluj
                                </Button>
                            </DialogActions>
                        </Dialog>

                    </>
                    }
                </Grid>
                <Grid item>
                    <UserStats/>
                </Grid>
            </Grid>
        </div>
    );
}