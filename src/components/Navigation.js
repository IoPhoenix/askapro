import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from './Session';
import { logo } from '../../src/images/';
import SignOutButton from './SignOut';
import * as ROUTES from '../constants/routes';
import {  Navbar, Nav, Dropdown, Collapse } from 'bootstrap-4-react';

const Navigation = () => {
  return (
    <Navbar expand="lg" light>

        <AuthUserContext.Consumer>
            {user => user ?
                  <Link to={ROUTES.HOME} className="navbar-brand">
                    <img src={logo} weight="30" height="30" alt="Website Logo"/><span> AskAPro</span>
                  </Link> :
                  <Link to={ROUTES.LANDING} className="navbar-brand">
                    <img src={logo} weight="30" height="30" alt="Website Logo"/><span> AskAPro</span>
                  </Link> }
        </AuthUserContext.Consumer>
           
        <Navbar.Toggler target="#navbarSupportedContent" />
        <Collapse navbar id="navbarSupportedContent">
          <AuthUserContext.Consumer>
               {user => user ? <NavigationAuth user={user}/> : <NavigationNonAuth />}
          </AuthUserContext.Consumer>
        </Collapse>
    </Navbar>
  )
}

const NavigationAuth = ({ user }) => {
  
  console.log('user in Nav: ', user);

  return (
      <Navbar.Nav ml="auto">
        <Nav.Item>
          <Link to={ROUTES.HOME} className="nav-link">Home</Link>
        </Nav.Item>
        <Nav.Item dropdown>
            <Nav.Link dropdownToggle>Dashboard</Nav.Link>
            <Dropdown.Menu>
                <div className="dropdown-item disabled"><span>{user.email}</span></div>
                {user.isAdmin === true && <Link to={ROUTES.ADMIN} className="dropdown-item">Admin</Link>}
                <Link to={ROUTES.PROFILE} className="dropdown-item">Profile</Link>
                <Link 
                    to={{ 
                      pathname:`${ROUTES.PROFILE}/${user.uid}`,
                      state: { user }
                    }} className="dropdown-item">
                    Edit profile
                </Link>
                <Link to={ROUTES.ACCOUNT_SETTINGS} className="dropdown-item">Account settings</Link>
                <Dropdown.Divider />
                <SignOutButton />
            </Dropdown.Menu>
        </Nav.Item>
      </Navbar.Nav>
  );
}


const NavigationNonAuth = () =>
    <Navbar.Nav ml="auto">
      <Nav.Item>
        <Link to={ROUTES.LANDING} className="nav-link">Home</Link>
      </Nav.Item>
      <Nav.Item>
        <Link to={ROUTES.SIGN_IN} className="btn btn-outline-primary ml-md-3">Login</Link>
      </Nav.Item>
    </Navbar.Nav>


export default Navigation;