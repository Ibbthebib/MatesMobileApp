import React from 'react';
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
} from 'react-native';
import SignUp from './signup/signup';
import ChatList from './chatlist/chatlist';
import DashBoard from './dashboard/dashboard';
import LogIn from './login/login';
import ChaT from './chatlist/chat';
import ProfilE from './profile/profile';
import MatcH from './match/swiper';
import Setting from './settings/settings';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {TextInput} from 'react-native-gesture-handler';
/**
 * This is the root component of the application and handles all routing to be done.
 *  The application utilises stack navigation properties that can be found in https://reactnavigation.org
 * @author Ibrahim Alzilitni
 */

//Initialising the tabs navigation of our application.
const Tab = createMaterialTopTabNavigator();
//Initialising the stack navigation to wrap our application in.
const Stack = createStackNavigator();
//Styling elements to customsie the appearance of our application.
const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    display: 'flex',
    height: 'auto',
    width: 'auto',
    position: 'relative',
  },

  header: {
    backgroundColor: 'darkslateblue',
    padding: 15,
    height: 60,
    fontSize: 40,
    fontWeight: '900',
    textAlign: 'center',
    color: 'red',
    fontFamily: "'Montserrat', sans-serif",
    zIndex: 1000,
  },
  loginButton: {
    zIndex: 1000,
    padding: 1000,
  },
  signupbutton: {
    position: 'absolute',
    top: ' 55%',
    left: '50%',
    zIndex: 1000,
  },
  banner: {
    color: 'black',
    fontSize: 50,
    textAlign: 'center',
    zIndex: 1000,
  },
  img: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: 10,
    height: 10,
    zIndex: -1000,
  },

  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 30,
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1,
  },
  signUpLink: {
    position: 'relative',
  },
});

// Login component for the user to be able
const Login = ({navigation}) => {
  return <LogIn navigation={navigation}></LogIn>;
};
// Chatlist with all our chats
const Chatlist = ({navigation}) => {
  return <ChatList navigation={navigation}></ChatList>;
};
//Signup component allowing the user to sign up for an account.
const Signup = ({navigation}) => {
  return <SignUp navigation={navigation}></SignUp>;
};
//Match component which allows user to browse other users and show interest.
const Match = ({navigation}) => {
  return <MatcH navigation={navigation}></MatcH>;
};
//Chat component which allows user to chat with other connected users.
const Chat = ({navigation}) => {
  return <ChaT navigation={navigation}></ChaT>;
};
//Profile compoennt which allows user to view and update their profiles.
const Profile = ({navigation}) => {
  return <ProfilE navigation={navigation}></ProfilE>;
};
//Settings component allowing user to log out, delete their account and change their password.
const Settings = ({navigation}) => {
  return <Setting navigation={navigation}></Setting>;
};
//Dashboard main screen utilising the tab navigator containing the different components found below such as profile, match, chat, settings.
const Dashboard = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Profile') {
            iconName = focused
              ? 'ios-information-circle'
              : 'ios-information-circle-outline';
          } else if (route.name === 'MatcH') {
            iconName = focused ? 'ios-list-box' : 'ios-list';
          }
          // console.log(route)

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Profile" component={Profile}></Tab.Screen>
      <Tab.Screen name="Match" component={Match}></Tab.Screen>
      <Tab.Screen name="Chat" component={DashBoard}></Tab.Screen>
      <Tab.Screen name="Settings" component={Settings}></Tab.Screen>

      {/* <DashBoard navigation={navigation}></DashBoard> */}
    </Tab.Navigator>
  );
};
//Home screen containing the login component.
const HomeScreen = ({navigation}) => {
  return (
    <>
      <View>
        <Text style={styles.banner}>Match. Chat. Chill.</Text>
      </View>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.banner}>Mates</Text>

        {/* <Button
          onPress={() => navigation.navigate('Login')}
          title="Log in with Email"
        /> */}
        <LogIn navigation={navigation}></LogIn>
        {/* <Button
          onPress={() => navigation.navigate('Signup')}
          title="Sign up with Email"
        /> */}
      </View>
    </>
  );
};

/**
 * Upon access of the application this function is presented to the user.
 * The function contains the homescreen component wrapped by the Navigationcontainer
 * which helps to manage our navigation in a stack like format allowing for screens to be pushed
 * on to the interface upon request.
 */
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Mates"
          component={HomeScreen}
          options={{
            title: '',
            headerLeft: () => (
              <Button
                onPress={() =>
                  alert(
                    'Welcome to mates, if you are having an error please visit our site at www.mates.com/support',
                  )
                }
                title="Help"
                color="#fff"
              />
            ),
            headerStyle: {
              backgroundColor: '#f4511e',
            },
          }}
        />
        <Stack.Screen
          options={{headerLeft: () => <Text></Text>}}
          name="Dashboard"
          component={Dashboard}
        />

        <Stack.Screen
          options={{headerBackTitle: 'Log in', title: 'Sign up'}}
          name="Signup"
          component={Signup}
        />
        <Stack.Screen
          options={{headerLeft: () => <Text></Text>}}
          name="Login"
          component={Login}
        />
        <Stack.Screen name="Chatlist" component={Chatlist} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
