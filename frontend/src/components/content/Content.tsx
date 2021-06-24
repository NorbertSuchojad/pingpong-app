import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Login from "../auth/Login";
import NewGame from "../games/add/NewGame";
import PrivateRoute from "../auth/routes/PrivateRoute";
import LigueTab from "../user/list/LigueTab";
import Profile from "../user/me/Profile";
import GameList from "../games/list/GameList";
import UserGames from "../user/games/UserGames";
import UserList from "../user/list/UserList";
import LigueTabHistorical from "../user/list/LigueTabHistorical";
import UserGamesHistorical from "../user/games/UserGamesHistorical";
import GameListHistorical from "../games/list/GameListHistorical";

function Content() {
    return (
        <div className="App">
            <Switch>
                <Route component={Login} path="/" exact/>
                <Route component={Login} path="/login" exact/>
                <PrivateRoute component={NewGame} path="/game/new" exact/>
                <PrivateRoute component={GameList} path="/games" exact/>
                <PrivateRoute component={UserGames} path="/user/games" exact/>
                <PrivateRoute component={UserList} path="/user/list" exact/>
                <PrivateRoute component={LigueTab} path="/ligue/tab" exact/>
                <PrivateRoute component={LigueTabHistorical} path="/ligue/tab/historical" exact/>
                <PrivateRoute component={GameListHistorical} path="/games/historical" exact/>
                <PrivateRoute component={UserGamesHistorical} path="/user/games/historical" exact/>
                <PrivateRoute component={Profile} path="/user/me" exact/>
                <PrivateRoute component={UserList} path="/dashboard" exact/>
            </Switch>
        </div>
    );
}

export default Content;
