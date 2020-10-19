import {StyleSheet, Dimensions} from 'react-native';

const DIMENSION_WIDTH = Dimensions.get('window').width;
const DIMENSION_HEIGHT = Dimensions.get('window').height;

export default StyleSheet.create({
  title: {
    paddingBottom: 10,
    fontSize: 22,
    color: '#363636',
    textAlign: 'center',
  },
  bg: {
    flex: 1,
    resizeMode: 'cover',
    width: DIMENSION_WIDTH,
    height: DIMENSION_HEIGHT / 2,
  },
  userSent: {
    borderRadius: 50,
    padding: 20,
    marginTop: 10,
    backgroundColor: '#e7feff',
    color: '#000000',
    width: 300,
  },

  friendSent: {
    borderRadius: 50,
    padding: 20,
    marginLeft: 100,
    marginTop: 10,
    backgroundColor: '#BADA55',
    color: '#000000',
    width: 300,
  },
  name: {
    paddingTop: 25,
    paddingBottom: 5,
    color: '#363636',
    fontSize: 30,
    textAlign: 'center',
  },
  filters: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {height: 0, width: 0},
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 100,
    padding: 10,
    marginBottom: 10,
  },
  noMoreCardsText: {
    fontSize: 22,
  },
  containerCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 10,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {height: 0, width: 0},
  },
  avatar: {
    borderRadius: 20,
    width: 200,
    alignItems: 'center',
    height: 200,
    marginLeft: 100,
  },
  miniButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowColor: '#363636',
    shadowOffset: {height: 10, width: 0},
  },
  infoContent: {
    color: '#757E90',
    fontSize: 13,
    backgroundColor: '#F7F7F7',
    padding: 20,
    borderRadius: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 30,
    textAlign: 'center',
  },

  banner: {
    color: 'black',
    fontSize: 50,
    textAlign: 'center',
    zIndex: 1000,
  },
  input: {
    margin: 15,
    width: 300,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1,
  },
  thumbnail: {
    width: 250,
    height: 300,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: DIMENSION_HEIGHT - 200,
    bottom: 0,
  },
});
