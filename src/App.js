import React, { useEffect, useState } from 'react'
import Keycloak from 'keycloak-js'

import './App.css'
import Logout from './components/Logout/Logout'

const keycloak = Keycloak({
	url: 'http://localhost:8080/auth/',
	realm: 'diplomski-project',
	clientId: 'diplomska-aplikacija'
})

const App = () => {
	const [ auth, setAuth ] = useState( false )
	const [ userInfo, setUser ] = useState( {} )
	const [ roles, setRoles ] = useState( [] )


	useEffect( () => {
		keycloak.init({ onLoad: 'check-sso' }).success( ( isAuth ) => {
			if( isAuth ) {
				keycloak.loadUserProfile().success( user => {
					setAuth( isAuth )
					setUser( user )
					setRoles( keycloak.tokenParsed.realm_access.roles )
				})
			}
		}).error( ( error ) => {
			console.log( 'Error', error )
		})
	} )

	return (
		<div id='main-container'>
			<span className='title'>Diplomski projekt</span>
			<div className='auth-container'>
				{
					auth 
						? <Logout userInfo={ userInfo } roles={ roles } keycloak={ keycloak } /> 
						: <div>
							<button 
							type='button' 
							className='login'
							onClick={ 
								() => { window.location.href = keycloak.createRegisterUrl() } }
						>Register</button>
						<button 
							type='button' 
							className='login'
							onClick={ 
								() => { window.location.href = keycloak.createLoginUrl() } }
						>Login</button>
						</div>
				}
			</div>
		</div>
	)
}

export default App
