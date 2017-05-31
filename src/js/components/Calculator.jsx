import React from "react";

export default class Calculator extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      input: {
        Application: null,
        MeasurementSystem: null,
        Location: null,
        DoorHeight: null,
        DoorWidth: null,
        HeatRetention: {
          InsideTemp: null,
          OutsideTemp: null,
          WeeksUsedPerYear: null
        },
        ACRetention: {
          InsideTemp: null,
          OutsideTemp: null,
          WeeksUsedPerYear: null
        },
        WalkInCoolerFreezer: {
          CoolerFreezerTemp: null,
          TempOutsideCoolerFreezer: null,
          RH_inside: null,
          RH_outside: null,
          WeeksUsedPerYear: null
        },
        HoursBusinessOpenDaily: null,
        PercentageOfHoursDoorOpen: null,
        DaysBusinessOpenWeekly: null,
        CostOfHeating: null,
        LocalCostOfElectricity: null,
        Series: null,
        Models: null
      },
      output: {
        PurchaseCost: null,
        InstallationCost: null,
        CostToRunYearly: null,
        AirCurtainPaysItselfOffIn: null
      }
    }
  }

  updateInput = (name, value) => {
    if(this.state.input.hasOwnProperty(name) && this.state.input[name] !== value) {
      this.state.input[name] = value;
    }
  }

  updateOutput = (inputOrInputs) => {

  }

  displayError = (message) => {

  }

  render() {

    return (
      <div>
        <div>
          <Dropdown name="Application">
            <option value="HeatRetention">Heat Retention</option>
            <option value="ACRetention">Air Conditioning Retention</option>
            <option value="HeatAndACRetention">Heat and Air Conditioning Retention</option>
            <option value="WalkInCooler">Walk-in Cooler/Refrigerated Storage</option>
            <option value="WalkInFreezer">Walk-in Freezer/Cold Storage</option>
          </Dropdown>
          <Dropdown name="MeasurementSystem"></Dropdown>
        </div>
        <div>
          <CalculatorOutput></CalculatorOutput>
          <button>Calculate</button>
        </div>
      </div>
    )
  }
}

class Dropdown extends React.Component {


  render(){
    return(
      <select name={this.props.name} >
        {this.props.children}
      </select>
    )
  }
}

class Input extends React.Component {
  render(){
    return(
      input[type="text"]
    )
  }
}

class CalculatorOutput extends React.Component {
  render(){
    return(

    )
  }
}
