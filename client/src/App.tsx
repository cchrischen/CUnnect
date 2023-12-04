import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeaderSimple from "./components/Header";
import { PATHS } from "./constants/Navigation";
import AuthUserProvider from "./auth/AuthUserProvider";
import { ThemeProvider } from "@mui/material";
import { generalTheme } from "./constants/Themes";

function App() {

    const routes = PATHS.map((p) => {
        return(
            <Route key={p.label} path={p.link} element={
                <>
                    {p.label != "Home" ? <HeaderSimple /> : <></>}
                    {p.element}
                </>
            }/>
        );
    });

    return (
        <>
            <AuthUserProvider>
                <ThemeProvider theme={generalTheme}>
                    <BrowserRouter>
                        <div className="root">
                            <Routes>
                                {routes}
                            </Routes>
                        </div>
                    </BrowserRouter>
                </ThemeProvider>
            </AuthUserProvider>
        </>
    );
}

export default App;
