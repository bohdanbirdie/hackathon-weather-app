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
import BackgroundGeolocation from "react-native-background-geolocation";


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
    BackgroundGeolocation.on('heartbeat', () => { console.log('jdkfj')});
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

  componentWillMount() {
    // 1.  Wire up event-listeners

    // This handler fires whenever bgGeo receives a location update.
    // BackgroundGeolocation.on('location', this.onLocation);

    // // This handler fires whenever bgGeo receives an error
    // BackgroundGeolocation.on('error', this.onError);

    // // This handler fires when movement states changes (stationary->moving; moving->stationary)
    // BackgroundGeolocation.on('motionchange', this.onMotionChange);

    // // This event fires when a change in motion activity is detected
    // BackgroundGeolocation.on('activitychange', this.onActivityChange);

    // // This event fires when the user toggles location-services
    // BackgroundGeolocation.on('providerchange', this.onProviderChange);

    // 2.  #configure the plugin (just once for life-time of app)
    BackgroundGeolocation.configure({
      // Geolocation Config
      desiredAccuracy: 0,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      // debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      url: 'http://yourserver.com/locations',
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      headers: {              // <-- Optional HTTP headers
        "X-FOO": "bar"
      },
      params: {               // <-- Optional HTTP params
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      },
      preventSuspend: true,
      heartbeatInterval: 5,
    }, (state) => {
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

      if (!state.enabled) {
        // 3. Start tracking!
        BackgroundGeolocation.start(function() {
          console.log("- Start success");
        });
      }
    });
  }

  // You must remove listeners when your component unmounts
  componentWillUnmount() {
    // Remove BackgroundGeolocation listeners
    // BackgroundGeolocation.un('location', this.onLocation);
    // BackgroundGeolocation.un('error', this.onError);
    // BackgroundGeolocation.un('motionchange', this.onMotionChange);
    // BackgroundGeolocation.un('activitychange', this.onActivityChange);
    // BackgroundGeolocation.un('providerchange', this.onProviderChange);
  }
  onLocation(location) {
    console.log('- [js]location: ', JSON.stringify(location));
  }
  onError(error) {
    var type = error.type;
    var code = error.code;
    // alert(type + " Error: " + code);
  }
  onActivityChange(activityName) {
    console.log('- Current motion activity: ', activityName);  // eg: 'on_foot', 'still', 'in_vehicle'
  }
  onProviderChange(provider) {
    console.log('- Location provider changed: ', provider.enabled);    
  }
  onMotionChange(location) {
    console.log('- [js]motionchanged: ', JSON.stringify(location));
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
