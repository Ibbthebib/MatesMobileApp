import React, {Component} from 'react';
import {View, Text, ScrollView} from 'react-native';
import firebase from '@react-native-firebase/app';
import styles from '../styles';
/**
 * The Chat class based component is used to present the user with a chat history
 * between themselves and a connection. Thereafter the chat history is presented
 * in a UI friendly method.
 * @author Ibrahim Alzilitni
 */
class Chat extends Component {
  constructor() {
    super();
    this.state = {};
  }

  /**
   *  The render method is used to display the properties that have been created to present
   * the chat history in a user friendly way. The method also makes sure that the last message
   * is visibile to the user by automatically scrolling towards it.
   */
  render() {
    const {chat, user} = this.props;

    if (chat === undefined) {
      return (
        <View>
          <Text>Undefined</Text>
        </View>
      );
    } else if (chat !== undefined) {
      return (
        <>
          <View style={{backgroundColor: '#F8FAD7'}}>
            <Text style={styles.title}>
              {chat.users.filter((users) => users !== user)[0]}
            </Text>
          </View>
          <ScrollView
            ref="scrollView"
            onContentSizeChange={(width, height) =>
              this.refs.scrollView.scrollTo({y: height})
            }
            style={styles.bg}>
            {chat.messages.map((message, index) => {
              return (
                <View style={{backgroundColor: '#F8FAD7'}}>
                  <Text
                    key={index}
                    style={
                      message.sender === user
                        ? styles.userSent
                        : styles.friendSent
                    }>
                    {message.sender !== user
                      ? 'Sent by ' + message.sender + ' : ' + message.message
                      : 'Me: ' + message.message}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </>
      );
    }
  }
}
export default Chat;
