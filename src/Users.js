import React, { useState, useContext } from 'react'
import { UsersContext } from './UsersContext.js'
import axios from 'axios'
import {
    Link,
} from "react-router-dom";

const ButtonPrimary = ({ children, onClick }) => (
    <button className="btn btn-primary" onClick={onClick}>{children}</button>
)
const Input = ({ label, value, onChange, type = 'text' }) => (
    <div className="form-group">
        <label>
            {label}
            <input value={value} onChange={e => onChange(e.target.value)} className="form-control" type={type} />
        </label>
    </div>
)
const Select = ({ label, value, onChange, options }) => (
    <div className="form-group">
        <label>
            {label}
            <select value={value} onChange={e => onChange(e.target.value)} className="form-control custom-select">
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>),
                )}
            </select>
        </label>
    </div>
)
const Header = ({ onFetchClick, searchFilter, onSearchChange, onGenderChange, genderFilter }) => (
    <div className="mb-5">
        <h1>React example</h1>
        <hr />
        <div style={{
            display: 'flex',
            gap: '3rem',
            alignItems: 'center',
        }}>
            <ButtonPrimary onClick={onFetchClick}>Fetch users</ButtonPrimary>
            <Input label="Recherche" type="search" onChange={onSearchChange} value={searchFilter} />
            <Select label="Genre" onChange={onGenderChange} value={genderFilter} options={[
                { value: '', label: 'Tous' },
                { value: 'male', label: 'Hommes' },
                { value: 'female', label: 'Femmes' },
            ]} />
        </div>
    </div>
)
const Row = ({ user }) => (
    <tr >
        <td><img className="img-thumbnail" style={{ width: 100 }} src={user.picture} alt="" /></td>
        <td>{user.firstName} {user.lastName}</td>
        <td>{user.email}</td>
        <td>{user.phone}</td>
        <td>{user.age}</td>
        <td><Link to={`/userdetails?id=${user.id}`}>Details</Link></td>
    </tr>
)
const IconPath = ({ order }) => {
    if (order === 'asc') {
        return (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
        )
    }
    if (order === 'desc') {
        return (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        )
    }
    return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    )
}
const IconSort = ({ order }) => (
    <svg fill="none" style={{ width: '1rem', height: '1rem', marginLeft: 2 }} viewBox="0 0 24 24" stroke="currentColor">
        <IconPath order={order} />
    </svg>
)
const Table = ({ users, sort, onSortChange }) => {
    const getSortOrder = (key) => {
        if (sort.key !== key) {
            return ''
        }
        return sort.asc ? 'asc' : 'desc'
    }
    const handleSortChange = (key) => {
        onSortChange(oldSort => {
            if (oldSort.key !== key) {
                return { key, asc: true }
            }
            if (oldSort.asc) {
                return { key, asc: false }
            }
            return { key: '', asc: true }
        })
    }
    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th />
                    <th onClick={() => handleSortChange('lastName')}>
                        Nom
          <IconSort order={getSortOrder('lastName')} />
                    </th>
                    <th onClick={() => handleSortChange('email')}>
                        Email
          <IconSort order={getSortOrder('email')} />
                    </th>
                    <th>Tel</th>
                    <th onClick={() => handleSortChange('age')}>
                        Age
          <IconSort order={getSortOrder('age')} />
                    </th><th></th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => <Row user={user} key={user.id} />)}
            </tbody>
        </table>
    )
}
const fetchUsers = async (qty) => {
    try {
        const { data: { results } } = await axios.get(`https://randomuser.me/api/?results=${qty}`)
        return results.map(result => ({
            id: result.login.uuid,
            firstName: result.name.first,
            lastName: result.name.last.toUpperCase(),
            picture: result.picture.thumbnail,
            phone: result.phone,
            email: result.email,
            gender: result.gender,
            age: result.dob.age,
        }))
    } catch (e) {
        console.error(e)
        return []
    }
}

export function Users() {
    const { users, setUsers } = useContext(UsersContext);
    const [searchFilter, setSearchFilter] = useState('')
    const [genderFilter, setGenderFilter] = useState('')
    const [sort, setSort] = useState({ key: '', asc: true })
    const handleFetchClick = () => {
        fetchUsers(10).then((newUsers) => setUsers([...users, ...newUsers]))
    }

    const searchFilterLowerCase = searchFilter.toLowerCase()

    const usersFiltered = !users ? [] :
            users
                .filter(user => {
                    if (genderFilter === '') {
                        return true
                    }
                    return user.gender === genderFilter
                })
                .filter(user => {
                    if (searchFilter === '') {
                        return true
                    }
                    return user.firstName.toLowerCase().startsWith(searchFilterLowerCase)
                        || user.lastName.toLowerCase().startsWith(searchFilterLowerCase)
                })
                .sort((user1, user2) => {
                    if (sort.key === '') {
                        return 0
                    }
                    const valueUser1 = user1[sort.key]
                    const valueUser2 = user2[sort.key]
                    if (valueUser1 > valueUser2) {
                        return sort.asc ? 1 : -1
                    }
                    return sort.asc ? -1 : 1
                })
    

    return (
        <div>
          
            <div className="container-fluid">
                <div>
                    <Header
                        searchFilter={searchFilter}
                        onSearchChange={setSearchFilter}
                        genderFilter={genderFilter}
                        onGenderChange={setGenderFilter}
                        onFetchClick={handleFetchClick}
                    />
                    <ul>
                        <li>Recherche : {searchFilter}</li>
                        <li>Genre : {genderFilter}</li>
                        <li>Sort : {sort.key} {sort.key ? (sort.asc ? 'en montant' : 'en descendant') : ''}</li>
                    </ul>
                    {
                        usersFiltered.length
                            ? <Table users={usersFiltered} sort={sort} onSortChange={setSort} />
                            : <p className="alert alert-warning text-center">Pas d'utilisateurs.</p>
                    }
                </div>
            </div>
        </div>
    )
}

