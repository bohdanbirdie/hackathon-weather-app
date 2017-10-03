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
  View,
  Picker,
  AppState,
  Platform
} from 'react-native';
import PushController from './PushController';
import PushNotification from 'react-native-push-notification';


export default class weather extends Component {
  constructor(){
    super();
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.state = {
      seconds: 5,
      lat: null,
      lon: null
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(appState) {
    console.log(appState);
    if (appState === 'background') {
      let date = new Date(Date.now() + (this.state.seconds * 1000));

      if (Platform.OS === 'ios') {
        // date = date.toISOString();
        console.log(date);
      }

      PushNotification.localNotificationSchedule({
        message: "My Notification Message",
        date,
      });
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
     const getMoviesFromApiAsync = () => {
       console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lon}&APPID=8affd1eb7b57ab094e89f5bf2248db83`);
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
          Choose your notification time in seconds. test
        </Text>
        <Picker
          style={styles.picker}
          selectedValue={this.state.seconds}
          onValueChange={(seconds) => {
            this.setState({ seconds })
            console.log(this.state);
          }}
        >
          <Picker.Item label="5" value={5} />
          <Picker.Item label="10" value={10} />
          <Picker.Item label="15" value={15} />
        </Picker>
        <PushController />
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
  picker: {
    width: 100,
  },
});

AppRegistry.registerComponent('weather', () => weather);
