import React from 'react'

interface IUser {
    nickname: string
    image_uri: string
}

interface IMessage {
    text: string
    status: "error" | "success"
}

export interface AppContextInterface {
    user: IUser,
    message: IMessage
}

const initContext: AppContextInterface = {
    user: {
        nickname: '',
        image_uri: ''
    },
    message: {
        text: '',
        status: "success"
    }
}

export const ctxt = React.createContext<AppContextInterface>(initContext);

export const AppContextProvider = ctxt.Provider;

export const AppContextConsumer = ctxt.Consumer;
