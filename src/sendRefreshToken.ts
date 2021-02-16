import {Response} from "express";

export const sendRefreshToken = (res: Response, token: string) => {
    res.cookie(
        'jid',  // Name of cookie
        token, // Funkcija za kreacijo piškotka, ki se nahaja v ./src/auth.ts
        {
            httpOnly: true
        }
    );
}