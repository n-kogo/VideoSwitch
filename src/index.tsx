import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter, HashRouter, Route, Switch} from 'react-router-dom';
import {Home} from "./app/pages/Home";
import {Film} from "./app/pages/Film";
import {App} from "./app/pages/App";

ReactDOM.render(
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/film" component={Film} />
        <Route path="/app" component={App} />
      </Switch>
    </BrowserRouter>
  ,
  document.getElementById('root')
)
