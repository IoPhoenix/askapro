import React, {Component} from 'react';
import { withAuthorization } from './Session';
import { withFirebase } from './Firebase';




class AdminPage extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        loading: false,
        users: []
      };
    }
  
    componentDidMount() {
        this.setState({ loading: true });

        //  use the users reference from Firebase class to attach a listener
        // on() method registers a continuous listener that triggers every time something has changed:
        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();

            const usersList = Object.keys(usersObject).map(key => (
                {
                    ...usersObject[key],
                    uid: key,
                }
            ));

            this.setState({
                users: usersList,
                loading: false,
            });
        });
    }
    // remove the listener to avoid memory leaks:
    componentWillUnmount() {
        this.props.firebase.users().off();
    }

  
    render() {
        const { users, loading } = this.state;

      return (
        <div>
            <h1>Admin</h1>

            {loading && <div>Loading ...</div>}

            <UserList users={users} />
        </div>
      );
    }
  }
  
const UserList = ({ users }) => (
    <ul>
    {users.map(user => (
      <li key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
        <span>
          <strong>Username:</strong> {user.username}
        </span>
      </li>
    ))}
  </ul>
);

// const condition = authUser => authUser && authUser.role === 'ADMIN';
const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(AdminPage));

// export default withFirebase(AdminPage);
