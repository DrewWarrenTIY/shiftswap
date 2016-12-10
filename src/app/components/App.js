"use strict";

import React from 'react';
import { BrowserRouter as Router, Link, Match, Miss } from 'react-router';

import Bar from './Bar';
import Header from './Header';
import Home from './Home';
import Manager from './Manager';

import container from './App.css';

var firebase = require("firebase");

// Set the configuration for your app
var config = {
  apiKey: "AIzaSyDayn7zcog-05rzJNH6KeQyHTyttuzUT_8",
  authDomain: "shiftswapforsues.firebaseapp.com",
  databaseURL: "https://shiftswapforsues.firebaseio.com",
  storageBucket: "shiftswapforsues.appspot.com"
};
firebase.initializeApp(config);

// Get a reference to the database service
var fbdbRef = firebase.database().ref();
var fbdbBarShifts = fbdbRef.child('barshifts');
var fbdbEmpl = fbdbRef.child('employees');
var fbdbUsers = fbdbRef.child('empTest');

let barShifts = [];
let barShiftsKeys = [];
let emplData = [];
let barList = [];

function addToBarList(val, key) {
  if (val.isBar == true) {
    barList.push(val.name)
    barList.sort()
  }
}

function displayEmplData(val, key) {
  emplData.push(val)
}

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      admin: false,
      auth: false,
      barList: barList,
      barShifts: barShifts,
      barShiftsKeys: barShiftsKeys,
      fbdbRef: fbdbRef,
      name: "",
      uid: "",
    }
  }

  componentWillMount () {
    fbdbUsers.on("child_added", (snapshot) => {
      addToBarList(snapshot.val(), snapshot.key);
      this.setState({
        barList: barList
      });
    }).bind(this)
    const fbdbBarShiftsRef = this.state.fbdbRef.child('barshifts');
    //POPULATES OBJECT KEYS ARRAY
    fbdbBarShiftsRef.on('value', snapshot => {
      let barShiftsObj = snapshot.val();
      let barShiftsKeys = Object.keys(barShiftsObj);
      for (let i = 0; i < barShiftsKeys.length; i++) {
        barShiftsKeys[i] = barShiftsKeys[i];
      }
      this.setState({
        barShiftsKeys: barShiftsKeys
      });
    });
    //POPULATES OBJECT VALS ARRAY
    fbdbBarShiftsRef.on('value', snapshot => {
      let barShiftsObj = snapshot.val();
      let barShifts = Object.values(barShiftsObj);
      for (let i = 0; i < barShifts.length; i++) {
        barShifts[i] = barShifts[i];
      }
      this.setState({
        barShifts: barShifts
      });
    });
    // listen for firebase auth events at the top level
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        console.log('logged in');
        console.log(firebaseUser);
        this.handleAuthChange(true)
        let empTest = this.state.fbdbRef.child('empTest').child(firebaseUser.uid).on('value', (snapshot) => {
          const user = snapshot.val();
          this.handleAdmin(user.isAdmin)
          this.handleUID(user.uid)
          this.handleName(user.name)
          this.handleBar(user.isBar)
          this.handleDoor(user.isDoor)
          this.handleKitchen(user.isKitchen)
          this.handleServer(user.isServer)
        });
      } else {
        console.log('not logged in');
        this.handleAuthChange(false)
      }
    });
  }

  handleAdmin (admin) {
    this.setState({ admin })
  }

  handleName (name) {
    this.setState({ name })
  }

  handleAuthChange (auth) {
    this.setState({ auth })
  }

  handleUID (uid) {
    this.setState({ uid })
  }

  handleBar (isBar) {
    this.setState({ isBar })
  }

  handleKitchen (isKitchen) {
    this.setState({ isKitchen })
  }

  handleDoor (isDoor) {
    this.setState({ isDoor })
  }

  handleServer (isServer) {
    this.setState({ isServer })
  }

  render () {

    return (
      <Router>
        <div className='container'>
          <Header
            auth={this.state.auth}
            admin={this.state.admin}
            isBar={this.state.isBar}
          />
          <Match
            exactly
            pattern="/"
            render={defaultProps => (
              <Home
                auth={this.state.auth}
                handleAuthChange={this.handleAuthChange}
                {...defaultProps}
              />
            )}
          />
          <Match
            pattern="/manager"
            render={defaultProps => (
              <Manager
                auth={this.state.auth}
                barShifts={this.state.barShifts}
                barShiftsKeys={this.state.barShiftsKeys}
                barList={this.state.barList}
                fbdbRef={this.state.fbdbRef} {...defaultProps}
              />
            )}
          />
          <Match
            pattern="/bar"
            render={defaultProps => (
              <Bar
                auth={this.state.auth}
                barShifts={this.state.barShifts}
                barShiftsKeys={this.state.barShiftsKeys}
                fbdbRef={this.state.fbdbRef} {...defaultProps}
              />
            )}
          />
        </div>
      </Router>
    )
  }
}
