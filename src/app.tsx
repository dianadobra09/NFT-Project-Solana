import React, {useEffect, useState} from 'react';
import {BrowserRouter} from 'react-router-dom';
import Routing from './config/routing';
import Header from './components/header';
import {Toaster} from 'react-hot-toast';

const App: React.FC<any> = () => {

    const [windowScrolled, setWindowScrolled] = useState<boolean>(false)

    useEffect(() => {
        function watchScroll() {
            window.addEventListener("scroll", onWindowScroll);
        }

        watchScroll();
        return () => {
            window.removeEventListener("scroll", onWindowScroll);
        };
    });

    const onWindowScroll = (): void => {
        if ((window.pageYOffset || document.documentElement.scrollTop) > 10) {
            setWindowScrolled(true);
        } else if ((windowScrolled && window.pageYOffset) || document.documentElement.scrollTop || document.body.scrollTop < 10) {
            setWindowScrolled(false);
        }
    }

    return (
        <BrowserRouter>
            <div>
                <Header minimized={windowScrolled}/>
                <Toaster position={"bottom-center"}/>
                <Routing/>
            </div>
        </BrowserRouter>
    )
}

export default App;
