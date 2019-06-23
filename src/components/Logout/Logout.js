import React, { useEffect, useState } from 'react'
import axios from 'axios'

import './Logout.css'

const Logout = ( { userInfo, roles, keycloak } ) => {
    const [ users, setUsers ] = useState( [] )    

    useEffect( () => {
        axios.get( 'http://localhost:3001/users' )
            .then( ( response ) => {
                setUsers( response.data )
            })
            .catch( (error) => {
                setUsers( [ 'Napaka pri pridobitvi uporabnikov' ] )
            })
    }, [ keycloak ] )

    function isAdmin() {
        return roles.includes( 'administrator' )
    }

    function updateUser( userId, firstName, lastName ) {
        const firstNameByValue = document.getElementById( 'inputFirstName' ).value
        const lastNameByValue = document.getElementById( 'inputFirstName' ).value
        
        axios.post(`http://localhost:3001/edit-user/${ userId }/`, {
            firstName: firstNameByValue.length > 0 ? firstNameByValue : firstName,
            lastName: lastNameByValue.length > 0 ? lastNameByValue : lastName
        })
        .then( response => {
            console.log( response );
            if( response.data ) {
                alert( `${ response.data }` )
            }
        })
        .catch( error => {
            console.log( error );
        });
    }

    return(
        <div>
            <button 
                type='button' 
                className='logout' 
                onClick={ () => window.location.href = keycloak.createLogoutUrl() }>
                    Logout
            </button>
            <div>
                <div>{ `Email: ${ userInfo.email }` }</div>
                <div>{ `Username: ${ userInfo.username }` }</div>
                <div>{ `First name: ${ userInfo.firstName }` }</div>
                <div>{ `Last name: ${ userInfo.lastName }` }</div>
                <div>
                    <p>Roles: </p>
                    { roles.map( role => (
                        <p key={ role }>{ `---> ${ role }` }</p>
                    ) ) }
                </div>
                <hr />
                <br />
                <p>Uporabniki iz Keycloak sistema : </p>
                <div>
                    {
                        users.map( user => {
                            return(
                                <p key={ user.id }>
                                    <span>{ `Username: ${ user.username } ` }</span>
                                    <span>Ime: </span>
                                    <input 
                                        id='inputFirstName'
                                        disabled={ !isAdmin() }
                                        name='firstName' 
                                        type='text'
                                        placeholder={ user.firstName } 
                                    />
                                    <span> Priimek: </span>
                                    <input 
                                        id='inputLastName'
                                        disabled={ !isAdmin() }
                                        name='lastName' 
                                        type='text' 
                                        placeholder={ user.lastName } 
                                    />
                                    <button 
                                        type='button' 
                                        className='logout'
                                        onClick={ () => updateUser( user.id, user.firstName, user.lastName ) }
                                    >
                                        SHRANI
                                    </button> 
                                </p>
                            ) 
                        } )
                    }
                </div>
                <hr />
                <br />
            </div>
        </div>
    )
}

export default Logout