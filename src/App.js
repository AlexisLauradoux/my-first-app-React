import React, { useState , useEffect} from 'react'
import { UsersContext } from './UsersContext.js'
import { Users } from './Users.js'
import { UserDetails} from './Details.js'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";

export const App = () => {
    const [users, setUsers] = useState(() => window.localStorage.getItem('users') ? JSON.parse(window.localStorage.getItem('users')) : [])
    useEffect(
        () => window.localStorage.setItem('users', JSON.stringify(users)),
        [users]
    )
    const values = { users, setUsers };
    return (
        <UsersContext.Provider value={values}>
        <Router>
                <div>
                    <nav class="navbar navbar-expand-lg navbar-light bg-light">
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                                    <Link class="nav-link" to="/home">Home</Link>
                        </li>
                        <li class="nav-item">
                                    <Link class="nav-link"to="/users">Users</Link>
                                </li></ul>
                                </div>
                    </nav>    
                <Switch>
                    <Route path="/home">
                        <Home />
                    </Route>
                    <Route path="/users">
                        <Users />
                    </Route>
                    <Route path="/userdetails">
                        <UserDetails />
                    </Route>
                </Switch>
            </div>
            </Router>
        </UsersContext.Provider>
    )
}

function Home() {
    return (
        <div>
       
            <p>A beautiful react site</p>
        </div>
        )
}



