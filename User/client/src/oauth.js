import React from "react";
import Signin from "./Signin";
import './auth.css';
import { AuthProvider } from "./context";

export default function auth(){
    return(
        <AuthProvider>
        <Signin/>
        </AuthProvider>
        )
}