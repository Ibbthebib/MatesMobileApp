import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ImageBackground,
  Image,
  Button,
  Alert,
  TextInput,
} from 'react-native';
import styles from "../styles"
// import * as firebase from 'firebase';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
/**
 * The Signup class component is developed to help a user create an account
 * that can be used with the application. The method offers the traditional way of creating an
 * account via email. 
 *
 * @author Ibrahim Alzilitni
 */

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      passwordConfirmation: '',
      signingUpError: '',
      validForm: true,
    };
  }
  render() {
    return (
      <>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={styles.banner}>Sign up screen</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={(text) => this.userInput('email', text)}
          />
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Password"
            autoCapitalize="none"
            onChangeText={(text) => this.userInput('password', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            autoCapitalize="none"
            onChangeText={(text) =>
              this.userInput('passwordConfirmation', text)
            }
          />
          <Button onPress={() => this.submitForm()} title="Submit" />
          <Text style={styles.errorText}>{this.state.signingUpError}</Text>
        </View>
      </>
    );
  }
   /**
   * The valid pass method is used to check whether both the password
   * and the passwordConfirmation field match. This is to make sure the user has not
   * made an error when confirming their password.
   */
  validPass() {
    return this.state.password === this.state.passwordConfirmation
      ? true
      : false;
  }
  /**
   * The userInput method is used when a user signs up for an
   * account the traditional way by email and password.
   * The method is called while the user types in their email, password or password confirmation.
   * if the type passed in to the method is of email then the method will update
   * the email in state properties.
   * Password type then the method will update the password in state properties.
   * Password confirmation type then the method will update the password confirmation in state properties.
   * @param {*} type the type can be email, password or password confirmation.
   * @param {*} e the users input.
   */
  userInput(type, e) {
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
      case 'passwordConfirmation':
        this.setState({
          passwordConfirmation: e,
        });
        break;
      default:
        break;
    }
  }
   /**
   * The submitForm method is called when a user submits the form and in our case when a user
   * signs up for an account. The user will be redirected to the dashboard upon successful sign up.
   * If not, then the user will be presented with an error message.
   */
  submitForm = () => {

    this.validPass() === false
      ? this.setState({
          signingUpError: 'Passwords do not match',
        })
      : 


    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        (authRes) => {
          const user = {
            email: authRes.user.email,
          };
          firebase
            .firestore()
            .collection('userDB')
            .doc(this.state.email)
            .set(user)
            .then(() => {
              this.props.navigation.navigate('Dashboard')
            });
        },
        (dbError) => {
          console.log(dbError);
          this.setState({
            signingUpError: 'Unable to register user',
          });
        },
        (authError) => {
          console.log(authError);
          this.setState({
            signingUpError: 'Unable to register user',
          });
        },
      );
  };
}
export default SignUp;
