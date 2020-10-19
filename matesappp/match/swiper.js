import React, {Component} from 'react';
import Card from './card';
import {StyleSheet, Text, View, Image, Alert} from 'react-native';
import styles from '../styles';
import SwipeCards from 'react-native-swipe-cards';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native-gesture-handler';
/**
 * The Swiper class based component is used to present a user with possible users to browse through.
 * This is done by searching retreiving possible users that the user hasnt already browsed through
 * and presenting these users in a friendly manner. Thereafer has the ability to match with these users
 * if they have interest else the other others will have the ability to match with the current user if has interest.
 * @author Ibrahim Alzilitni
 */
class Swiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        {
          image: '../paris.jpeg',
          text: 'Tomato',
          age: 23,
          location: 'Manchester',
          bio: ' So im into hiking',
          backgroundColor: 'white',
        },
      ],
      name: '',
      location: '',
      age: '',
      bio: '',
      email: '',
      mainphotourl: '',
      index: 0,
      user: '',
      matched: '',
      mountcheck: '',
      sameprofile: false,
      size: 0,
    };
    this.handleYup = this.handleYup.bind(this);
    this.handleNope = this.handleNope.bind(this);
  }
  render() {
    if (this.state.sameprofile === false) {
      return (
        <>
          <SwipeCards
            cards={this.state.cards}
            renderCard={(cardData) => <Card {...cardData} />}
            renderNoMoreCards={() => (
              <View>
                <Text style={styles.noMoreCardsText}>No more cards</Text>
              </View>
            )}
            handleYup={this.handleYup}
            handleNope={this.handleNope}
            handleMaybe={this.handleMaybe}
            hasMaybeAction
            stack={true}
          />
        </>
      );
    } else {
      return (
        <SwipeCards
          renderNoMoreCards={() => (
            <View>
              <Text style={styles.noMoreCardsText}>No more cards</Text>
            </View>
          )}
          handleYup={this.handleYup}
          handleNope={this.handleNope}
          handleMaybe={this.handleMaybe}
          hasMaybeAction
          stack={true}
        />
      );
    }
  }
  /**
   * handleYup function is used for when a user has interest with another user. The method
   * updates the users match details within the database and adds the user of interest details into the
   * current users match details. The method also checks if a the current user is contained in the user of interests match details,
   * if so, then the system creates a connection in the database and allows the users to chat.
   * The method also updates the tracking variable in the match details of the user so that another can be presented after.
   */
  handleYup(card) {
    const docKey = [this.state.user, this.state.email].sort().join(':');
    const addingToLikedList = firebase
      .firestore()
      .collection('Matching')
      .where('email', '==', this.state.user)
      .get()
      .then((doc) => {
        doc.size > 0
          ? firebase
              .firestore()
              .collection('Matching')
              .doc(this.state.user)
              .update({
                email: this.state.user,
                liked: firebase.firestore.FieldValue.arrayUnion(
                  this.state.email,
                ),
                index: this.state.index,
                timestamp: Date.now(),
              })
          : firebase
              .firestore()
              .collection('Matching')
              .doc(this.state.user)
              .set({
                email: this.state.user,
                liked: firebase.firestore.FieldValue.arrayUnion(
                  this.state.email,
                ),
                index: 0,
                timestamp: Date.now(),
              });
      });
    const checkingIfExists = firebase
      .firestore()
      .collection('Matching')
      .where('email', '==', this.state.email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().liked === undefined) {
            console.log('LIked is undefined');
          } else if (doc.data().liked.includes(this.state.user)) {
            Alert.alert('New match');
            const creatingchat = firebase
              .firestore()
              .collection('chatsDB')
              .doc(docKey)
              .set({
                messages: firebase.firestore.FieldValue.arrayUnion({
                  sender: 'Server',
                  message: 'New chat',
                }),
                users: firebase.firestore.FieldValue.arrayUnion(
                  this.state.email,
                  this.state.user,
                ),
                timestamp: Date.now(),
              });
          }
          if (this.state.index < this.state.size) {
            this.setState({index: this.state.index + 1});
          }
        });
      });
  }
  /**
   * The handleNope method is used when a user does not have interest in a presented user. The method simply updates the
   * users tracking index in the database passing by the presented user so that another user can be presented.
   */
  handleNope(card) {
    const addingToLikedList = firebase
      .firestore()
      .collection('Matching')
      .where('email', '==', this.state.user)
      .get()
      .then((doc) => {
        doc.size > 0
          ? firebase
              .firestore()
              .collection('Matching')
              .doc(this.state.user)
              .update({
                index: this.state.index,
                timestamp: Date.now(),
              })
          : firebase
              .firestore()
              .collection('Matching')
              .doc(this.state.user)
              .set({
                email: this.state.user,

                index: 0,
                timestamp: Date.now(),
              });
      });

    const checkingIfExists = firebase
      .firestore()
      .collection('Matching')
      .where('email', '==', this.state.email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (this.state.index < this.state.size) {
            this.setState({index: this.state.index + 1});
          }
        });
      });
  }

  handleMaybe(card) {
    console.log(`Future features perhaps`);
  }

  /**
   * The componentDidMount method is used to first of all check whether a user has a previous tracking variable in order
   * to load up different user profiles. If not then the method creates a tracking variable for the user and adds into the state
   * properties. If the user does then it sets this into components state properties. Thereafter the tracking varibale is used to
   * load up a users profile from the database.
   */
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        this.props.history.push('/login');
      } else {
        const {index} = this.state;
        const checkingIfExists = firebase
          .firestore()
          .collection('Matching')
          .where('email', '==', user.email)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              if (doc.data().index !== undefined) {
                this.setState({
                  index: doc.data().index,
                });
              } else {
                this.setState({
                  index: 0,
                });
              }
            });
          });

        const testing = firebase
          .firestore()
          .collection('userProfile')

          .onSnapshot((result) => {
            this.setState({size: result.docs.length});
            const firebase = result.docs.map((doc) => doc.data());
            if (index >= result.docs.length) {
              this.setState({sameprofile: true});
            } else if (firebase[index].email === undefined) {
              this.setState({sameprofile: true});
            } else if (firebase[index].email === user.email) {
              this.setState({index: this.state.index + 1});
            } else {
              this.setState({
                name: firebase[index].name,
                location: firebase[index].location,
                age: firebase[index].age,
                bio: firebase[index].bio,
                email: firebase[index].email,
                user: user.email,
              });
            }
          });
      }
    });
  };
  /**
   * The componentDidUpdate method here performs two actions. the first is that the method checks for an updated tracking variable
   * (index). If this is found then the method will load new details into the state properties of the component above from the
   * database. Thereafter, the component checks that the email has also been updated and extracts the presented users avatar into the states
   * component also so that all the information is presented to the user at one point.
   * @param {*} prevProps the previous properties of the component.
   * @param {*} prevState the previous state properties of the component.
   */
  componentDidUpdate = (prevProps, prevState) => {
    const {index} = this.state;
    if (this.state.email !== prevState.email) {
      firebase
        .storage()
        .ref(this.state.email)
        .child('mainphoto')
        .getDownloadURL()
        .then((url) => {
          this.setState({
            cards: [
              {
                image: url,
                text: this.state.name,
                location: this.state.location,
                age: this.state.age,
                bio: this.state.bio,
                backgroundColor: '#FFF4F4',
              },
            ],
          });
        });
    }

    if (prevState.index !== this.state.index) {
      const testing = firebase
        .firestore()
        .collection('userProfile')
        .onSnapshot((result) => {
          const firebase = result.docs.map((doc) => doc.data());
          if (index >= result.docs.length) {
            this.setState({sameprofile: true});
            this.forceUpdate();
          } else {
            if (firebase[index].email === this.state.user) {
              this.setState({index: this.state.index + 1});
            }
            this.setState({
              name: firebase[index].name,
              location: firebase[index].location,
              age: firebase[index].age,
              bio: firebase[index].bio,
              email: firebase[index].email,
            });
          }
        });
    }
  };
}
export default Swiper;
