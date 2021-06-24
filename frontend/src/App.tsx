import React, {useContext, useEffect} from 'react';
import './App.css';
import Header from "./components/header/main/Header";
import {get_user_data} from "./_service/api";
import moment from "moment";
import {ctxt} from "./utils/UserContext";


interface IUser {
    nickname: string
    image_uri: string
}

function App() {
    let appContext = useContext(ctxt);
    let expDate;

    if (localStorage.getItem('expiration_date')) {
        expDate = moment(localStorage.getItem('expiration_date'))
        if (expDate.diff(moment(), 'seconds') < 0) {
            localStorage.clear()
            window.location.replace('/login')
        }
    }

    // @ts-ignore
    useEffect(() => {
        get_user_data()
            .then(
                value => {
                    // @ts-ignore
                    if (value && value.data) {
                        if (appContext) {
                            appContext.user = value.data
                        }
                    }
                }
            ).catch(reason => {
            // console.log(reason)
        });

    }, []);

    return (
        <div className="App">
            <Header/>
        </div>
    );
}

export default App;
