import React from "react";

export default class Calculator extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      data: {
        Application: null,
        MeasurementSystem: null,
        Location: null,
        DoorHeight: null,
        DoorWidth: null,
        HeatRetention: {
          InsideTemp: null,
          OutsideTemp: null
        },
        ACRetention: {
          InsideTemp: null,
          OutsideTemp: null
        },
        WalkInCoolerFreezer: {
          CoolerFreezerTemp: null,
          TempOutsideCoolerFreezer: null,
          RH_inside: null,
          RH_outside: null
        }

      }

      input: {






Hours/Day
% door open
Days/Week
Weeks/year
Weeks/year
Weeks/year


      },
      output: {
        AirCurtainCost: null,
        InstallationCost: null,
        CostToRunPerYear: null,
        TimeUntilAirCurtainPaysForItself: null
      }
    }
  }

  render() {

    return (
      <div>
        <div>
          <CalculatorInputs></CalculatorInputs>
        </div>
        <div>
          <CalculatorOutput></CalculatorOutput>
          <button>Calculate</button>
        </div>
      </div>
    )
  }
}

class CalculatorInputs extends React.Component {
  render(){
    return(

    )
  }
}

class CalculatorOutput extends React.Component {
  render(){
    return(

    )
  }
}
