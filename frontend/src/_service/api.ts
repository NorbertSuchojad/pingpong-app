import axios from "axios";
import {getApiUri} from "./utils";

const API_URL = getApiUri()


const config = {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost/',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
    }
}

export function get_all_ligue_games() {
    return axios.get(API_URL + '/games?all=true&ligue_games=true', config)
}

export function get_ligue_games(ligue_name: string | null = null) {
    if (ligue_name) {
        return axios.get(API_URL + '/games?ligue=' + ligue_name, config)
    }
    return axios.get(API_URL + '/games?all=true', config)
}

export function get_ligue_user_games(ligue_name: string | null = null) {
    if (ligue_name) {
        return axios.get(API_URL + '/games?ligue=' + ligue_name + '&user_games=true', config)
    }
    return axios.get(API_URL + '/games?all=true', config)
}

export function get_user_games() {
    return axios.get(API_URL + '/games?user_games=true&ligue_games=true', config)
}

export function confirm_games(game_ids: string[]) {
    const data = {
        game_ids: game_ids
    }
    return axios.post(API_URL + '/games', data, config)
}

export function get_ligue() {

    return axios.get(API_URL + '/ligue', config)
}

export function get_ligues() {

    return axios.get(API_URL + '/ligues', config)
}

export function set_new_game(data: any) {
    return axios.post(API_URL + '/game', data, config)
}

export function get_user_data() {
    return axios(API_URL + '/user', config)
}

export function get_user_stats() {
    return axios(API_URL + '/user/stats', config)
}

export function get_users() {
    return axios(API_URL + '/users', config)
}

export function get_ligue_users_stats(ligue_name: string | null = null) {
    if (ligue_name) {
        return axios(API_URL + '/ligue/stats?ligue=' + ligue_name, config)
    }
    return axios(API_URL + '/ligue/stats', config)
}

export function get_opponents() {
    return axios(API_URL + '/opponents', config)
}

export function set_user_password(data: any) {
    return axios.post(API_URL + '/user/password', data, config)
}

export function change_user_image(data: any) {
    return axios.post(API_URL + '/user/image', data, config)
}

export function user_login(data: any) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost/',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
    }
    return fetch(API_URL + '/login', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
}

export function user_auth(data: any) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost/',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
        }
    }
    return axios.post(API_URL + '/oauth2/callback/google', data, config)
}

export default function logout() {
    localStorage.clear()
    window.location.replace('/login')
}
