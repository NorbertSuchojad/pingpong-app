import React, {useState} from 'react';
import {Button, Container, FormControl, InputAdornment, Paper, TextField} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {AccountCircle, Lock, Send} from "@material-ui/icons";
import {user_auth, user_login} from "../../_service/api";
import InfoSnackbar from "../helpers/InfoSnackbar";
import moment from "moment";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            margin: theme.spacing(1),
            width: '90%'
        },
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
        button: {
            margin: theme.spacing(1),
        },
        asd: {
            display: "flex",
            maxWidth: '500px'
        }
    }),
);


function Login() {
    const classes = useStyles();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessagge] = useState("")

    const successResponseGoogle = (response: any) => {
        autorize(response['profileObj'], response['tokenObj']['access_token']);
    }
    const failResponseGoogle = (response: any) => {
        console.log(response);
    }


    function autorize(dataObj: any, access_token: string) {
        const mail = dataObj['email']
        const imageUri = dataObj['imageUrl']
        const data = {
            "email": mail,
            "image_uri": imageUri,
            "access_token": access_token,
        }

        user_auth(data)
            .then(value => {
                setMessagge(value.statusText)
                return value.data
            })
            .then(value => {
                var now = moment();
                var tomorrow = moment(now).add(value.expiration_date, 'seconds');
                localStorage.setItem('access_token', value.access_token)
                localStorage.setItem('refresh_token', value.refresh_token)
                localStorage.setItem('expiration_date', tomorrow.format())
                window.location.replace('/dashboard')
            })
            .catch(reason => {
                setMessagge(reason.toString())
            })
    }

    function login() {
        const credential = {
            "email": email,
            "password": password
        }
        user_login(credential)
            .then((response: Response) => {
                if (response.status !== 200) {
                    setMessagge(response.statusText)
                } else {
                    return response.json()
                }
            })
            .then(data => {
                if (data) {
                    localStorage.setItem('access_token', data.access_token)
                    localStorage.setItem('refresh_token', data.refresh_token)
                    window.location.replace('/dashboard')
                }
            })
            .catch(reason => {
                console.log(reason)
            })
    }

    //FIXME move clientID to env
    return (
        <div>
            <Container className={classes.asd}>
                <Paper>
                    <FormControl className={classes.margin}>
                        <TextField
                            fullWidth
                            id="outlined-email-input"
                            onChange={event => setEmail(event.target.value)}
                            label="Email"
                            type="email"
                            autoComplete="current-email"
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle/>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>
                    <FormControl className={classes.margin}>
                        <TextField
                            fullWidth
                            onChange={event => setPassword(event.target.value)}
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="password"
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock/>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        size={"large"}
                        className={classes.button}
                        onClick={login}
                        endIcon={<Send/>}
                    >
                        Login
                    </Button>

                    {/*<GoogleLogin*/}
                    {/*    clientId="821953180817-harl52auo2r5207hm32voc2bt82772jd.apps.googleusercontent.com"*/}
                    {/*    buttonText="Login"*/}
                    {/*    onSuccess={successResponseGoogle}*/}
                    {/*    onFailure={failResponseGoogle}*/}
                    {/*    cookiePolicy={'single_host_origin'}*/}
                    {/*    // isSignedIn={true}*/}
                    {/*/>*/}

                </Paper>
            </Container>

            <InfoSnackbar message={message} onClose={event => setMessagge('')}/>
        </div>
    );
}

export default Login
