import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeaderSimple from "./components/Header";
import { PATHS } from "./constants/Navigation";

function App() {

    const routes = PATHS.map((p) => {
        return(
            <>
                <Route key={p.label} path={p.link} element={
                    <>
                        {p.label != "Home" ? <HeaderSimple /> : <></>}
                        {p.element}
                    </>
                    }/>
            </>
        );
    });

    return (
        <>
            <BrowserRouter>
                <div className="root">
                    <Routes>
                        {routes}
                    </Routes>
                </div>
            </BrowserRouter>
        
        </>
    );
}

export default App;
