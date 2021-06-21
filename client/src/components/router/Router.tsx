import React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import Home from '../home/Home';
import Watcher from '../watch/Watcher';

const vidId = 10;

function Router() {
    return (
        <BrowserRouter>
            <main>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/watch/:vidId" component={Watcher} />
                </Switch>
            </main>
        </BrowserRouter>
    );
}

export default Router;