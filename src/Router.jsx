import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainMenu from "./pages/MainMenu";
import ShortPage from "./pages/ShortPage";
import LongPage from "./pages/LongPage";
import CodePage from "./pages/CodePage";
import RegisterPage from "./pages/RegisterPage";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainMenu />}/>
                <Route path="/short" element={<ShortPage />}/>
                <Route path="/long" element={<LongPage />}/>
                <Route path="/code" element={<CodePage />}/>
                <Route path="/registration" element={<RegisterPage />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router