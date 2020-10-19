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
// import * as firebase from '@react-native-firebase/app';
import * as ImagePicker from 'react-native-image-picker';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

import RNFetchBlob from 'rn-fetch-blob';
/**
 * Profile is a class based react component that allows a user to edit their details which are located
 * here. Details such as name, location, bio, avatar. This allows for a user friendly application.
 * It also allows other users to know more about the user.
 *
 * @author Ibrahim Alzilitni
 */
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;
class Profile extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      location: '',
      age: '',
      mainphoto: null,
      mainphotourl: '',
      photo2: '',
      photo3: '',
      photo4: '',
      bio: '',
      image: null,
      url: '',
      newName: '',
      newEmail: '',
      newBio: '',
      newLocation: '',
      tags: '',
      progress: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  render() {
    return (
      <>
        <View style={{backgroundColor: '#F8FAD7'}}>
          <View style={styles.containerCardItem}>
            <Text style={styles.name}>
              {this.state.name + "'s "} profile
              {console.log(ImagePicker)}
            </Text>
            <Image
              source={{
                uri:
                  this.state.mainphotourl ||
                  'http://via.placeholder.com/400x300',
              }}
              style={styles.avatar}></Image>

            <Button
              style={styles.miniButton}
              title="Choose Photo"
              onPress={this.handleChoosePhoto}
            />
            <View />
            <View style={styles.infoContent}>
              <TextInput
                placeholder="Your name"
                onChangeText={(e) => this.updateDetails('name', e)}
                value={this.state.name || ''}>
              </TextInput>
            </View>
            <View style={styles.infoContent}>
              <TextInput
                placeholder="Your location"
                value={this.state.location}
                onChangeText={(e) =>
                  this.updateDetails('location', e)
                }></TextInput>
            </View>
            <View style={styles.infoContent}>
              <TextInput
                value={this.state.bio}
                placeholder="A little bit about yourself"
                onChangeText={(e) => this.updateDetails('bio', e)}></TextInput>
            </View>
          </View>
        </View>
      </>
    );
  }

  uploadImage = (uri, mime = 'image/png') => {
    console.log('Were in upload');
    return new Promise((resolve, reject) => {
      const uploadUri =
        Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      let uploadBlob = null;

      const imageRef = firebase.storage().ref(`${this.state.email}/mainphoto`);
      console.log(imageRef);
      fs.readFile(uploadUri, 'base64')
        .then((data) => {
          // console.log("in data " + data)

          return Blob.build(data, {type: `${mime};BASE64`});
        })
        .then((blob) => {
          uploadBlob = blob;
          return imageRef.putFile(uri, {contentType: mime});
        })
        .then(() => {
          uploadBlob.close();
          return imageRef.getDownloadURL();
        })
        .then((url) => {
            resolve(url);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.default.launchImageLibrary(options, (response) => {
      if (response.uri) {
        this.uploadImage(response.uri);
        this.setState({mainphotourl: response.uri});
      }
    });
  };
  getLocation() {
    return fetch(
      'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDRX1tdBmx8UUuRoJNxS3caWot5Y5xv7dQ',
    ).then((res) => console.log(res.json()));
  }
  /**
   * The updateDetails method is used to update the state properties of the class myProfile.
   * Once these state properties are updated they can be used elsewhere.
   * The properties that can be updated are : the users name, the users location and the users bio.
   * @param {*} type the type of input.
   * @param {*} e the users input.
   */
  updateDetails(type, e) {
    switch (type) {
      case 'name':
        this.setState({
          name: e,
          newName: e,
        });
        break;
      case 'location':
        this.setState({
          location: e,
          newLocation: e,
        });
        break;
      case 'bio':
        this.setState({
          bio: e,
          newBio: e,
        });
        break;
      default:
        break;
    }
  }
 /**
   * The handleChange method is used to extract an image and store in the state properties.
   * Thereafter, the users image will be used elsewhere.
   * @param {*} type type of photo.
   * @param {*} e event to get the target image.
   */
  handleChange = (type, e) => {
    console.log('Im  here');
    if (e.target.files[0]) {
      switch (type) {
        case 'mainphoto':
          this.setState({
            mainphoto: e.target.files[0],
          });
          break;
        case 'image':
          this.setState({
            image: e.target.files[0],
          });
          break;
        default:
          break;
      }
      }
  };
 /**
   * The handleUpload method is used to upload the images found in the state properties above
   * into the database.
   */
  handleUpload = () => {
    const {mainphoto, image} = this.state;
    if (mainphoto !== null) {
      const uploadTask = firebase
        .storage()
        .ref(`${this.state.email}/mainphoto`)
        .put(mainphoto);
      uploadTask.on(
        'state_changed',
        () => {
        },
        (error) => {
          console.log(error);
        },
        () => {
          firebase
            .storage()
            .ref(this.state.email)
            .child('mainphoto')
            .getDownloadURL()
            .then((url) => {
              this.setState({mainphotourl: url});
            });
        },
      );
    }
    if (image !== null) {
      const uploadTask = firebase
        .storage()
        .ref(`${this.state.email}/picture1`)
        .put(image);
      uploadTask.on(
        'state_changed',
        () => {
        },
        (error) => {
          console.log(error);
        },
        () => {
          firebase
            .storage()
            .ref(this.state.email)
            .child('picture1')
            .getDownloadURL()
            .then((url) => {
              console.log(url);
              this.setState({url: url});
            });
        },
      );
    }
  };
 /**
   * The componentDidMount react lifecycle method is used to load the users current profile details
   * upon the component mounting.The method loads the users current photo as well as
   * location, bio and name into the state properties which are then presented to the user.
   */
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        this.props.navigation.popToTop();
      } else {
        const downloading =
          firebase
            .storage()
            .ref(`${user.email}/mainphoto`)
            .getDownloadURL()
            .then((url) => {
              this.setState({mainphotourl: url});
            });
        const loading = firebase
          .firestore()
          .collection('userProfile')
          .where('email', '==', user.email)
          .onSnapshot(async (result) => {
            const firebase = result.docs.map((doc) => doc.data());
            this.setState({
              name: firebase[0].name,
              location: firebase[0].location,
              age: firebase[0].age,
              bio: firebase[0].bio,
              email: user.email,
            });
          });
      }
    });
  };
  /**
   * The componentDidUpdate method is used to detect updates made by the user to their
   * details. Once an update is detetced the users details are updated in the database
   * allowing for up to date results.
   * @param {*} prevProps the previous properties of the class.
   * @param {*} prevState the previous state properties of the class.
   */
  componentDidUpdate(prevProps, prevState) {
    if (prevState.newName !== this.state.newName) {
      firebase.auth().onAuthStateChanged(async (user) => {
        await firebase
          .firestore()
          .collection('userProfile')
          .doc(user.email)
          .set({
            name: this.state.newName,
            location: this.state.location,
            bio: this.state.bio,
            email: user.email,
            age: this.state.age,
          });
      });
    } else if (prevState.newLocation !== this.state.newLocation) {
      firebase.auth().onAuthStateChanged(async (user) => {
        await firebase
          .firestore()
          .collection('userProfile')
          .doc(user.email)
          .set({
            name: this.state.name,
            location: this.state.newLocation,
            bio: this.state.bio,
            email: user.email,
            age: this.state.age,
          });
      });
    } else if (prevState.newBio !== this.state.newBio) {
      firebase.auth().onAuthStateChanged(async (user) => {
        await firebase
          .firestore()
          .collection('userProfile')
          .doc(user.email)

          .set({
            name: this.state.name,
            location: this.state.location,
            bio: this.state.newBio,
            email: user.email,
            age: this.state.age,
          });
      });
    }
  }
}

export default Profile;
