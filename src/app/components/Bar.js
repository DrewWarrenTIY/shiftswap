'use strict';

import React from 'react';

import BarShiftsEmp from './BarShiftsEmp';

var firebase = require("firebase");

export default class Bar extends React.Component{

  render () {

    let barShifts = this.props.barShifts;
    let barShiftsKeys = this.props.barShiftsKeys;
    let fbdbRef = this.props.fbdbRef;

    return (
      <div className='bodyRoute bar'>
        <h2>Bar Schedule</h2>
        <BarShiftsEmp barShifts={barShifts}
        barShiftsKeys={barShiftsKeys}
        fbdbRef={fbdbRef} />
      </div>
    )
  }
}
