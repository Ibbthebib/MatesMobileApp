import React, {Component} from 'react';
import {StyleSheet, View, Text, Button, TextInput} from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import styles from '../styles';
/**
 * The Login class presents the user with input fields that allow the user to
 * input their details they originally registered with in order to grant them access to their
 * accounts. The class uses firebase to authenticate the consumers details and upon success redirects the consumer
 * to their dashboard.
 *
 * @author Ibrahim Alzilitni
 */
class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errorMEssage: '',
    };
  }

  render() {
    return (
      <>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={(text) => this.logInDetails('email', text)}
          />
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            placeholder="Password"
            autoCapitalize="none"
            onChangeText={(text) => this.logInDetails('password', text)}
          />
          <Button title="Log in" onPress={() => this.logIn()} />
          <Button
            style={styles.signUpButton}
            onPress={() => this.props.navigation.navigate('Signup')}
            title="Sign up with Email"
          />
          <Text style={styles.errorText}>
            {this.state.errorMEssage !== '' ? 'Wrong email or password' : ''}
          </Text>
        </View>
      </>
    );
  }
  /**
   * The login details method is used when a user logs into their
   * account the traditional way by email and password.
   * The method is called while the user types in their email or password.
   * if the type passed in to the method is of email then the method will update
   * the email in state properties.
   * Password type then the method will update the password in state properties.
   * @param {*} type the type can be email or password.
   * @param {*} e the users input.
   */
  logInDetails = (type, e) => {
    switch (type) {
      case 'email':
        this.setState({
          email: e,
        });
        break;
      case 'password':
        this.setState({
          password: e,
        });
        break;

      default:
        break;
    }
  };
  /**
   * The log in method is called when a user submits the form and in our case when a user
   * logs into their account. This message will check with the server if the account
   * exists. If so, then the user will be redirected to the dashboard.
   * If not, then the user will be presented with an error message.
   */
  logIn = async () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        () => {
          console.log('Has an account !');
          this.props.navigation.navigate('Dashboard');
        },
        (error) => {
          this.setState({
            errorMEssage: 'Please sign up',
          });
        },
      );
  };
}
export default Login;
