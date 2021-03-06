import React from 'react';
import { Redirect } from 'react-router';

class SignOut extends React.Component {
    constructor(props) {
        super(props);
        this.state = {signedOut: false}
    }
    componentDidMount() {
        this.signOut();
        this.setState({signedOut: true});
        this.props.updateAppState({username: null});
    }
    signOut = () => {
        fetch('/api/auth/sign-out', {method: 'POST', credentials: 'include'})
       .catch(err => console.log(err));
    }
    render() {
        if (this.state.signedOut) {
            return <Redirect to="/"/>
        }
        return <div> ERROR: for some reason, you were unable to be logged out </div>
    }
}

export default SignOut;