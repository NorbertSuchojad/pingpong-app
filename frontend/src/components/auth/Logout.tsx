import React, {useState} from 'react';
import GoogleLogin, {GoogleLogout} from "react-google-login";
import axios from 'axios';
import logout from "../../_service/api";

function Logout() {

    const [isAuthenticate, authenticate] = useState(false)

    const successResponseGoogle = (response: any) => {
        autorize(response['profileObj'], response['tokenObj']['access_token']);
    }
    const failResponseGoogle = (response: any) => {
        console.log(response);
    }

    function autorize(dataObj: any, access_token: string) {
        const obj = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://epppong.herokuapp.com/',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
            }
        }
        const mail = dataObj['email']
        const imageUri = dataObj['imageUrl']
        const data = {
            "email": mail,
            "image_uri": imageUri,
            "access_token": access_token,
        }

        const f = axios.post("/oauth2/callback/google", data)
            // .then((response:any) => response.toJson())
            .then(value => {
                return value.data
            })
            .then(value => {
                localStorage.setItem('access_token', value.access_token)
                localStorage.setItem('refresh_token', value.refresh_token)
                authenticate(true)
                return true
            })
            .catch(reason => {
                authenticate(false)
            })
    }

    //FIXME move clientID to env
    return (
        <div>
            {!isAuthenticate &&
            <GoogleLogin
                clientId="742670116327-4d04obactuvs7h0khd9rg18pekrs7528.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={successResponseGoogle}
                onFailure={failResponseGoogle}
                cookiePolicy={'single_host_origin'}
            />
            }
            {isAuthenticate &&
            <>
                <GoogleLogout
                    clientId="742670116327-4d04obactuvs7h0khd9rg18pekrs7528.apps.googleusercontent.com"
                    buttonText="Logout"
                    onLogoutSuccess={logout}
                />
            </>
            }
        </div>
    );

}


export default Logout
