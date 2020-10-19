import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

import styles from '../styles';
/**
 * The card class based component structures the cards to be portrayed for our users.
 * @author Ibrahim Alziltini
 */
class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[styles.card, {backgroundColor: this.props.backgroundColor}]}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          {this.props.text}
        </Text>

        <Image
          style={styles.thumbnail}
          source={{
            uri: this.props.image,
          }}></Image>
        <Text style={{fontSize: 20}}>{this.props.age}</Text>
        <Text style={{fontSize: 20}}>{this.props.location}</Text>
        <Text style={{fontSize: 20}}>{this.props.bio}</Text>
      </View>
    );
  }
}
export default Card;
