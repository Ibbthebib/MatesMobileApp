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
} from 'react-native';
import firebase from '@react-native-firebase/app';
import styles from '../styles';
/**
 The ChatListComponent is used to display the users existing connections while allowing the display of the 
 chat history with a specific connection. The component also allows for a user to scroll between different components such as 
 matching, chat, profile and settings.
 @author Ibrahim Alzilitni
 */

class Chatlist extends Component {
  constructor() {
    super();
    this.state = {
      userpic: '',
      otherUser: '',
      name: '',
    };
  }
  /**
   * The render method here is used in two ways: if a user has connections then the method will
   * present the user with their existing connections alongside the ability to access the aforementioned
   * compoennts. If the user does not have any connections then this is indicated to the user,
   * alongside the above mentioned components.
   */
  render() {
    if (this.props.chats.length > 0) {
      return (
        <>
          <View style={{backgroundColor: '#F8FAD7'}}>
            <FlatList
              alwaysBounceVertical={false}
              data={this.props.chats}
              keyExtractor={(_, index) => index.toString()}
              ListHeaderComponent={
                <View>
                  <Text style={styles.name}>Your friends</Text>
                </View>
              }
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={styles.filters}
                  onPress={() => this.passingChatIndex(index)}>
                  <View>
                    {console.log(index)}
                    <Text>
                      {
                        item.users.filter(
                          (user) => user !== this.props.currUser,
                        )[0]
                      }
                    </Text>
                    <Text>
                      {' '}
                      {item.messages[
                        item.messages.length - 1
                      ].message.substring(0, 15) + '...'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <FlatList></FlatList>
          </View>
        </>
      );
    } else {
      return (
        <>
          <Text
            style={styles.name}
            title="No Mates yet!
"></Text>
        </>
      );
    }
  }
  /**
   * The passingChatIndex method takes in an index key from the render method by filtering through
   * the chat list. The key is then passed to the parent component upon user tapping a specific
   * chat. Thereafter, this key used in the aprent component to present the chat with a connection
   * to the user.
   * @param {*} index the key for a chat.
   */
  passingChatIndex = (index) => {
    this.props.selectChat(index);
  };
}

export default Chatlist;
