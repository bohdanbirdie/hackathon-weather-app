import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Picker,
  AppState,
  Platform,
  AsyncStorage
} from 'react-native';
import PushController from './PushController';
import clothes from './clothes'
import PushNotification from 'react-native-push-notification';
import BackgroundGeolocation from "react-native-background-geolocation";

export default class weather extends Component {
  constructor() {
    super();
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.state = {
      hour: 8,
      lat: null,
      lon: null,
      town: 'Loading',
      temp: 'Loading',
      minute: 30,
      pickerHours: null,
      pickerMinutes: null,
      clothes: 'Loading'
    };
    console.log(clothes);
    const minutes = [];
    const hours = []
    for (let i = 0; i < 60; i++) {
      minutes.push(i);
    }

    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }

    this.state.pickerMinutes = minutes.map((s, i) => {
      return <Picker.Item key={i} value={i} label={String(i)}/>
    });

    this.state.pickerHours = minutes.map((s, i) => {
      return <Picker.Item key={i} value={i} label={String(i)}/>
    });
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    const test = {
      hour: 16,
      minute: 35
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(appState) {
    console.log(appState);
    BackgroundGeolocation.getCurrentPosition((location) => {
      console.log('- current location: ', location);
      this.setState({lat: location.coords.latitude, lon: location.coords.longitude})
    })
    if (appState === 'background') {
      // let date = new Date(Date.now() + (this.state.seconds * 1000));
      const timeSheet = {
        hour: this.state.hour,
        minute: this.state.minute
      }
      AsyncStorage.setItem('timeSheet', JSON.stringify(timeSheet)).then((data) => {
        console.log(data);
      })
      BackgroundGeolocation.setConfig({
        schedule: [`1,2,3,4,5,6 ${this.state.hour}:${this.state.minute}-${this.state.hour + 1}:${this.state.minute}`]
      });
    }
  }

  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Your'e in {this.state.town}, temperature is {this.state.temp}
          °C
        </Text>
        <Text style={styles.welcome}>
          For this type of weather you likelly will wear any if this items:
        </Text>
        <Text style={styles.welcome}>
          {this.state.clothes}
        </Text>
        <Text style={styles.welcome}>
          Choose an hour to notify you daily
        </Text>
        <View style={styles.pickerWrapper}>
          <Picker style={styles.picker} selectedValue={this.state.hour} onValueChange={(hour) => {
            this.setState({hour});
          }}>
            {this.state.pickerHours}
          </Picker>

          <Picker style={styles.picker} selectedValue={this.state.minute} onValueChange={(minute) => {
            this.setState({minute});
          }}>
            {this.state.pickerMinutes}
          </Picker>
        </View>
        <PushController/>
      </View>
    );
  }

  componentWillMount() {
    AsyncStorage.getItem('timeSheet').then((data) => {

      const params = JSON.parse(data)
      console.log(JSON.parse(data));
      this.setState({hour: params.hour, minute: params.minute})
      BackgroundGeolocation.setConfig({
        schedule: [`1,2,3,4,5,6 ${this.state.hour}:${this.state.minute}-${this.state.hour + 1}:${this.state.minute}`]
      });
    })

    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.on('location', this.onLocation.bind(this));

    // This handler fires whenever bgGeo receives an error
    BackgroundGeolocation.on('error', this.onError.bind(this));

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.on('motionchange', this.onMotionChange.bind(this));

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.on('activitychange', this.onActivityChange.bind(this));

    // This event fires when the user toggles location-services
    BackgroundGeolocation.on('providerchange', this.onProviderChange.bind(this));

    // 2.  #configure the plugin (just once for life-time of app)
    BackgroundGeolocation.configure({
      desiredAccuracy: 1000,
      distanceFilter: 10,
      stopTimeout: 5,
      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_NONE,
      stopOnTerminate: true,
      startOnBoot: false,
      preventSuspend: true,
      heartbeatInterval: 5,
      schedule: [`1,2,3,4,5,6 ${this.state.hour}:${this.state.minute}-${this.state.hour + 1}:${this.state.minute}`]
    }, function(state) {
      // Start the Scheduler
      BackgroundGeolocation.startSchedule(function() {
        console.info('- Scheduler started');
      });
    });

    // Listen to "schedule" events:
    BackgroundGeolocation.on('schedule', function(state) {
      console.log('- Schedule event, enabled:', state.enabled);

      PushNotification.localNotificationSchedule({
        message: "Your daily clothes recoomendation is ready!",
        date: new Date(Date.now())
      });

      if (!state.schedulerEnabled) {
        BackgroundGeolocation.startSchedule();
      }
    });

    BackgroundGeolocation.start(function(state) {
      console.log('- BackgroundGeolocation started, state: ', state);
    });

    BackgroundGeolocation.on('heartbeat', function(params) {
      console.log('- hearbeat');
    });

    BackgroundGeolocation.getCurrentPosition((location) => {
      console.log('- current location: ', location);
      this.setState({lat: location.coords.latitude, lon: location.coords.longitude})
    })
  }

  // You must remove listeners when your component unmounts
  componentWillUnmount() {
    // Remove BackgroundGeolocation listeners
    BackgroundGeolocation.un('location', this.onLocation.bind(this));
    BackgroundGeolocation.un('error', this.onError.bind(this));
    BackgroundGeolocation.un('motionchange', this.onMotionChange.bind(this));
    BackgroundGeolocation.un('activitychange', this.onActivityChange.bind(this));
    BackgroundGeolocation.un('providerchange', this.onProviderChange.bind(this));
  }
  onLocation(location) {
    this.setState({lat: location.coords.latitude, lon: location.coords.longitude})
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lon}&APPID=8affd1eb7b57ab094e89f5bf2248db83&units=metric`, {method: 'GET'}).then((response) => response.json()).then((responseJson) => {
      console.log(responseJson);
      this.setState({town: responseJson.name, temp: responseJson.main.temp})
      console.log(clothes['5']);
      switch (true) {
        case(responseJson.main.temp <= 5):
          this.setState({clothes: clothes['5'].join(', ')});
          break;
        case(responseJson.main.temp <= 12):
          this.setState({clothes: clothes['12'].join(', ')});
          break;
        case(responseJson.main.temp <= 21):
          this.setState({clothes: clothes['21'].join(', ')});
          break;
        case(responseJson.main.temp <= 32):
          this.setState({clothes: clothes['32'].join(', ')});
          break;
      }

    }).catch((error) => {
      console.log('Error occured, ', error);
    });
    // console.log('- [js]location: ', JSON.stringify(location));
  }
  onError(error) {
    var type = error.type;
    var code = error.code;
    // alert(type + " Error: " + code);
  }
  onActivityChange(activityName) {
    console.log('- Current motion activity: ', activityName); // eg: 'on_foot', 'still', 'in_vehicle'
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
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  pickerWrapper: {
    marginTop: 20,
    flexDirection: 'row'
  },
  picker: {
    width: 50
  }
});

AppRegistry.registerComponent('weather', () => weather);
