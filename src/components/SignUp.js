import React, { Component } from 'react';
import { Link, withRouter, } from 'react-router-dom';
import { withFirebase } from './Firebase';
import SignInFacebook from './SignIn/SignInFacebook';
import SignInGoogle from './SignIn/SignInGoogle';
import { Alert } from 'bootstrap-4-react';
import * as ROUTES from '../constants/routes';
import * as ERRORS from '../constants/errors';
import './SignIn/SignIn.css';



const SignUpPage = () => {
  return (
    <div>
      <SignUpForm>
        <SignInGoogle />
        <SignInFacebook />
      </SignUpForm>
    </div>  
  )
}


const INITIAL_STATE = {
  email: '',
  password: '',
  passwordConfirmed: '',
  role: '',
  isAdmin: false,
  error: null,
};

const USER_DETAILS_STATE = {
  role: 'jobseeker',
  avatar: '',
  firstName: '',
  lastName: '',
  city: '',
  state: '',
  zip: '',
  status: '',
  availability: true
};



class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = (event) => {
    const { email, password, role, isAdmin } = this.state;

    // use in the future in case of multiple roles:
    // const roles = [];

    // if (role) {
    //   roles.push(ROLES.ROLE);
    // }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {

        // create a user in the Firebase realtime database:
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            email,
            role,
            isAdmin,
            details: USER_DETAILS_STATE
          });
      })
      .then(authUser => {
        console.log('authUser is: ', authUser);

        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.ONBOARDING);
      })
      .catch(error => {
        // if user already created an account using a social network:
        if (error.code === ERRORS.ERROR_CODE_EMAIL_IN_USE) {
          error.message = ERRORS.ERROR_MSG_EMAIL_IN_USE;
        }

        this.setState({ error });
      });

    event.preventDefault();
  }

  render() {
    const { email, password, passwordConfirmed, role, error } = this.state;
    
    const isInvalid =
      password === '' ||
      passwordConfirmed === '' ||
      password !== passwordConfirmed ||
      email === '' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || role === '';
    

    return (
      <section className="fdb-block">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-7 col-md-5 text-center">

            <div className="row">
                <div className="col">
                  <ul className="nav nav-tabs nav-fill">
                      <li className="nav-item">
                        <Link to={ROUTES.SIGN_UP} className="active nav-link">Sign Up</Link>
                      </li>
                      <li className="nav-item">
                        <Link to={ROUTES.SIGN_IN} className="nav-link">Log In</Link>
                      </li>
                    </ul>
                </div>
              </div>

              <div className="fdb-box fdb-touch">
                <div className="row">
                  <div className="col">
                    <h4 className="fdb-block_heading">Create your account</h4>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <input 
                      name="email"
                      value={email}
                      onChange={this.onChange}
                      type="text"
                      placeholder="Email Address"
                      className="form-control" />
                  </div>
                </div>
                <div className="row align-items-center mt-4">
                  <div className="col">
                    <input 
                      name="password"
                      value={password}
                      onChange={this.onChange}
                      type="password"
                      placeholder="Password"
                      className="form-control mb-1" />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <input 
                      name="passwordConfirmed"
                      value={passwordConfirmed}
                      onChange={this.onChange}
                      type="password"
                      placeholder="Confirm Password"
                      className="form-control mb-1" />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <div className="form-check form-check-inline">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="role" 
                          id="job-seeker" 
                          value="jobseeker"
                          onChange={this.onChange} />
                        <label className="form-check-label" htmlFor="job-seeker">I am a job seeker</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="role"
                          id="pro"
                          value="pro"
                          onChange={this.onChange} />
                        <label className="form-check-label" htmlFor="pro">I am a pro</label>
                      </div>
                    <p><small>* You can change your role later</small></p>
                  </div>

                </div>
                <div className="row mt-2">
                  <div className="col">
                    <button 
                      disabled={isInvalid}
                      className="btn btn-primary mb-2 fdb-block_btn" 
                      type="button" 
                      onClick={this.onSubmit}>
                        Sign Up
                    </button>
                    { error && <Alert danger>{error.message}</Alert>}
                  </div>
                </div>

                <div className="row align-items-center mt-4">
                  <div className="col">
                    <p className="fdb-block_divider">or</p>

                    <div className="row">
                      { this.props.children }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

/* T o redirect a user to another page, we need access to React Router. 
The React Router node package offers a higher-order component to make 
the router properties accessible in the props of a component. Any component
that goes in the withRouter() HOC gains access to all the properties of the router,
so when passing the enhanced SignUpFormBase component to the withRouter() HOC,
it has access to the props of the router. The relevant property from the
router props is the history object, because it allows us to redirect a user to another page by pushing a route to it.*/
const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;

export {
  SignUpForm
};