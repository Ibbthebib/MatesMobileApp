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
import ListComponent from '../chatlist/chatlist';
import Chat from '../chatlist/chat';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import styles from '../styles';
/**
 * The dashboard component is a class-based component and can be seen as the main page of the application.
 * This is because the user is able to access each component created within the application
 * from this component as it utilses the tab navigator.
 * @author Ibrahim Alzilitni
 */
class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      chats: [],
      text: '',
      currentChat: '',
      avatar: '',
      number: 0,
    };
  }
  render() {
    if (this.state.currentChat === '') {
      return (
        <>
          <ListComponent
            history={this.props.history}
            currUser={this.state.email}
            selectChat={this.selectChat}
            chats={this.state.chats}
            avatar={this.state.avatar}
            recievingInfo={this.recievingInfo}></ListComponent>
        </>
      );
    } else {
      return (
        <>
          <Button
            style={{backgroundColor: '#F8FAD7'}}
            title="Chats"
            onPress={() => this.setState({currentChat: ''})}></Button>
          <Chat
            user={this.state.email}
            chat={this.state.chats[this.state.currentChat]}></Chat>
          <TextInput
            style={styles.inputBox}
            placeholder="Type your message.."
            onChangeText={(e) => {
              this.userTyping(e);
            }}
            keyboardType="default"
            ref={(input) => {
              this.textInput = input;
            }}
            onSubmitEditing={() => {
              this.sendingMessage();
            }}
            id="textbox"></TextInput>
        </>
      );
    }
  }
  /**
   * The userTyping function is employed to figure out when a user
   * would like to send a message. This is done by listening for the keycode 13
   * to be pressed or in other words the "enter" on the keyboard. If this key code is recieived
   * then the sendingMessage function is called.
   * If not then the state properties are altered with the text written by a user.
   */
  userTyping = (e) => {
    console.log(e);
    console.log(e.key);
    e.keyCode === 13
      ? e.preventDefault() + '' + this.sendingMessage()
      : this.setState({
          text: e,
        });
  };
  /**
   * The sending message function has two jobs. The first being the job of clearing
   * the user input field when a message is sent. The second is to send a message
   * to a specific chat. This is done by accessing the database and updating the required chat
   * with the new input sent by the user. The docKey in the method is designed to update the
   * database with a unique identifier by joining two emails: the current user and the connection.
   * Thereafter a chat can be accessed via the docKey and updating a chat becomes possible.
   */
  sendingMessage() {
    this.textInput.clear();
    const docKey = [
      this.state.email,
      this.state.chats[this.state.currentChat].users.filter(
        (users) => users !== this.state.email,
      )[0],
    ]
      .sort()
      .join(':');

    firebase
      .firestore()
      .collection('chatsDB')
      .doc(docKey)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: this.state.email,
          message: this.state.text,
        }),
      });
    this.setState({text: ''});
  }

  /**
   * The selectChat method is used by the ChatListComponent to fetch a chat in the database by using a key
   * to find the chat. This key is passed into the dashboard component and
   * this method then changes the components currentChat properties to match the
   * key for the chat that is to be presented.
   * The method also loads an avatar for the connection of the user from the database.
   * @param {*} index the key for the chat to be presented.
   */
  selectChat = (index) => {
    this.setState({currentChat: index});
    firebase
      .storage()
      .ref(
        this.state.chats[index].users.filter(
          (users) => users !== this.state.email,
        )[0],
      )
      .child('mainphoto')
      .getDownloadURL()
      .then((url) => {
        this.setState({avatar: url});
      });
  };
  /**
   * The componentDidUpdate method is a lifecycle method and is inherited from the React.Component class.
   * This method is used to figure out if any updates have occured and what
   * actions to take once an update has occured.
   * @param {*} prevProps the previous properties of this class.
   * @param {*} prevState the previous state properties of this class.
   */
  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.number !== this.state.number) {
      this.forceUpdate();
    }
  };
  /**
   * The componentDidMount function is also a lifecycle method.
   * The component is activated as soon as this class is presented to the user.
   * At first a security check is made and if passed the users details are loaded
   * such as current chats.
   */
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        this.props.history.push('/login');
      } else {
        await firebase;
        firestore()
          .collection('chatsDB')
          .where('users', 'array-contains', user.email)
          .onSnapshot(async (result) => {
            const firebaseChats = result.docs.map((doc) => doc.data());
            await this.setState({
              email: user.email,
              chats: firebaseChats,
            });
          });
      }
    });
  };
}

export default Dashboard;
