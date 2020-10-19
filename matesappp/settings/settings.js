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
  ListView,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  ImagePickerIOS,
} from 'react-native';
import styles from '../styles';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

import {useLinkProps} from '@react-navigation/native';

/**
 * Settings a class based component which is used to allow a user the ability to change their
 * password sign out and delete their account.
 * @author Ibrahim Alzilitni
 */
class Settings extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      newPassword: '',
      updated: '',
    };
  }

  render() {
    return (
      <>
        <View style={{backgroundColor: '#F8FAD7'}}>
          <View style={styles.containerCardItem}>
            <Button
              style={styles.miniButton}
              title="Sign out"
              onPress={() => this.handleSignOut()}
            />
            <Button
              style={styles.miniButton}
              title="Delete account"
              onPress={() => this.deleteUser()}
            />
            <Text style={{textAlign: 'center'}}>Change password below!</Text>
            <View />

            <View style={styles.infoContent}>
              <TextInput
                placeholder="Your email"
                onChangeText={(e) =>
                  this.updateDetails('email', e)
                }></TextInput>
            </View>

            <View style={styles.infoContent}>
              <TextInput
                placeholder="Your password"
                onChangeText={(e) =>
                  this.updateDetails('password', e)
                }></TextInput>
            </View>

            <View style={styles.infoContent}>
              <TextInput
                placeholder="Your new password"
                onChangeText={(e) =>
                  this.updateDetails('newPassword', e)
                }></TextInput>
            </View>
            <Button
              style={styles.miniButton}
              title="Submit"
              onPress={() =>
                this.changePassword(this.state.password, this.state.newPassword)
              }
            />
          </View>
          <Text style={{textAlign: 'center'}}>{this.state.updated}</Text>
        </View>
      </>
    );
  }
  /**
   * The userInput method is used when a user decides to change their accounts password.
   * The method is called while the user types in their email, password or new password.
   * if the type passed in to the method is of email then the method will update
   * the email in state properties.
   * Password type - the method will update the password in state properties.
   * New password type - the method will update the newPassword in state properties.
   * @param {*} type the type can be email, password or new password.
   * @param {*} e the users input.
   */
  updateDetails(type, e) {
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
      case 'newPassword':
        this.setState({
          newPassword: e,
        });
        break;
      default:
        break;
    }
  }
  /**
   * The method reauthentiactes the user so that the server does not ask the user
   * to relog in and cause hassle. With this method the user can change password
   * without running into server errors.
   * @param {*} currentPassword is the users password.
   */
  reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );
    return user.reauthenticateWithCredential(cred);
  };
  /**
   * The changePassword method when called takes in the users password and the new password.
   * The current password is used for reauthentication while the new password is updated in the database.
   * @param {*} currentPassword is the users current password.
   * @param {*} newPassword is the users new password.
   */
  changePassword = (currentPassword, newPassword) => {
    if (currentPassword === newPassword) {
      return this.setState({updated: ' Passwords must be different '});
    }

    this.reauthenticate(currentPassword)
      .then(() => {
        var user = firebase.auth().currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            this.setState({updated: 'Succesful!'});
          })
          .catch((error) => {
            this.setState({updated: error.message});
          });
      })
      .catch((error) => {
        this.setState({updated: error.message});
      });
  };
  //Deletes a users account.
  deleteUser = () => {
    firebase
      .auth()
      .currentUser.delete()
      .catch(
        this.setState({
          updated:
            ' Requires recent authentication please re-log in and try again.',
        }),
      );
    this.props.navigation.popToTop();
  };
  //Signs the user out.
  handleSignOut = async () => {
    try{ await firebase
      .auth()
      .signOut();
          this.props.navigation.popToTop();

    }
  catch(error) {
        console.log(error)
        
    // this.props.navigation.popToTop();
  };
}
}

export default Settings;
