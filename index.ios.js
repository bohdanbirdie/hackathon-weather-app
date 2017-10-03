/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';


export default class weather extends Component {
  constructor(){
    super();
    this.state = {
      lat: null,
      lon: null
    }
  }

  componentWillMount() {
    console.log('navigator', navigator);
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      this.setState({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      })
    }, (error) => {
      console.log(error)
    },
    {enableHighAccuracy: true, timeout: 2000, maximumAge: 2000})
  }

  render() {
    console.log('tet');
    // fetch('http://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b1b15e88fa797225412429c1c50c122a1').then(function(response) {
    //   console.log(response);
    //  })
    //  .catch((error) => {
    //    console.error(error);
    //  });

     const getMoviesFromApiAsync = () => {
       return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lon}&APPID=8affd1eb7b57ab094e89f5bf2248db83`, {
          method: 'GET'
        })
         .then((response) => response.json())
         .then((responseJson) => {
           console.log(responseJson);
           return responseJson;
         })
         .catch((error) => {
           console.log('error1', error);
         });
     }

     getMoviesFromApiAsync()
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js loooool
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('weather', () => weather);
