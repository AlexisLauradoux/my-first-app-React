import React, { useContext } from 'react'
import { UsersContext } from './UsersContext.js'
import {
    useLocation
} from "react-router-dom";
function useQuery() {
    return new URLSearchParams(useLocation().search);
} 
export function UserDetails() {
    let query = useQuery();
    const id = query.get("id")
    const { users } = useContext(UsersContext);
    const user = users.find(user => user.id == id);
    return (
        <div>            
            <img className="img-thumbnail" style={{ width: 100 }} src={user.picture} alt="" />
            <dl class="row">
                <dt class="col-sm-3">FirstName</dt>
                <dd class="col-sm-9">{user.firstName}</dd>
                <dt class="col-sm-3">LastName</dt>
                <dd class="col-sm-9">{user.lastName}</dd>
                <dt class="col-sm-3">Email</dt>
                <dd class="col-sm-9">{user.email}</dd>
                <dt class="col-sm-3">Phone</dt>
                <dd class="col-sm-9">{user.phone}</dd>
                <dt class="col-sm-3">Age</dt>
                <dd class="col-sm-9">{user.age}</dd>
            </dl>
        </div>
    )
}