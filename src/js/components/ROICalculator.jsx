import React from "react";
import update from 'immutability-helper';


import calculatorService from "../services/calculate.js";
import convert from "../services/convert.js";
import rules from "../services/rules.js";

export default class ROICalculator extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      input: props.initialInput
      // product: props.product
    }
  }

  displayError = (message) => {

  }

  update = (funcOrObj) => {
    this.setState(funcOrObj);
  }

  updateInput = (name, value) => {
    this.update((prevState, props) => ({
      ...prevState.input,
      [name]: value
    }));
  }


  render() {
    let totalCost = this.props.product.installationCost + this.props.product.purchaseCost;
    let ROI_time = false;

    // first calculation done based on user input
    let costPerYear = calculatorService.costPerYear(this.state.input);

    //need better validation
    if(costPerYear <= 0) {
      costPerYear = 'Not Enough Data';
      ROI_time = 'Not Enough Data';
    }else{
      ROI_time = calculatorService.ROI(this.state.input, this.props.product, costPerYear, totalCost);
      if(ROI_time) {
        ROI_time = util.formatDecimalForDisplay();
      }else{
        ROI_time = 'Does not Pay off';
      }
    }


    return (
      <div>

        <CalculatorInputs  product={this.props.product} update={this.update} data={this.state.input} />



        <div>
          {/* <button onClick={this.calculateROI} >Calculate</button> */}
          <hr />
          <div>
            <label>Air Curtain Purchase Cost</label>
            <div>{this.props.product.purchaseCost}</div>
          </div>
          <div>
            <label>Air Curtain Installation Cost</label>
            <div>{this.props.product.installationCost}</div>
          </div>
          <div>
            <label>Total Cost</label>
            <div>{totalCost}</div>
          </div>
          <div>
            <label>Cost to Run (Yearly)</label>
            <div>{costPerYear}</div>
          </div>
          <div>
            <label>Air Curtain Pays for itself In</label>
            <div>{ROI_time}</div>
          </div>
        </div>
      </div>
    )
  }
}

class CalculatorInputs extends React.Component {

  inputHandler = (e) => {
    this.props.updateInput(e.target.name, e.target.value);
  }

  selectHandler = (e) => {
    let value = e.target.value;


    // if(e.target.name === 'seriesName') {
    //
    //   this.props.update((prevState, props) => ({
    //     input: {
    //       ...prevState.input,
    //       [e.target.name]: value
    //     }
    //   }));
    // }


    //transforms application value into an array to allow multiple selections
    if(e.target.name === 'applications') {
      value = value.indexOf(',') > -1 ? value.split(',') : [value];
    }

    this.updateInput(e.target.name, value);

  }

  shouldComponentUpdate = () => {
    //logic to not render unless series, application, or location changes
  }

  render() {
    const data = this.props.data;

    // let applicationOptions = [
    //   {
    //     'text': 'Select One'.
    //     'value': ''
    //   }
    // ]

    return (
    <div>
      <div className="form-field form-field--select">
        <label htmlFor="applications">Application Type</label>
        <SelectInput initialValue={data.applications.join(',')} name="application">
          <option value="">Select One</option>
          <option value="heatRetention">Heat Retention</option>
          <option value="ACRetention">Air Conditioning Retention</option>
          <option value="heatRetention,ACRetention">Heat and Air Conditioning Retention</option>
          <option value="cooler">Walk-in Cooler/Refrigerated Storage</option>
          <option value="freezer">Walk-in Freezer/Cold Storage</option>
        </SelectInput>
      </div>
      <div className="form-field form-field--select">
        <label htmlFor="applications">Application Type</label>
        <SelectInput onChange={this.selectHandler} name="measurementSystem">
          <option value="IP">(I-P) English</option>
          <option value="SI">(SI) Metric</option>
        </SelectInput>
      </div>
      <div className="form-field">
        <label htmlFor="doorHeight">Door Height</label>
        <Input initialValue={data.doorWidth}></Input>
      </div>

        <LengthField label='Door Height'
          name='doorHeight'
          ms={data.measurementSystem}
          updateInput={this.updateInput}
          value={data.doorHeight} />

        <LengthField label='Door Width'
          name='doorWidth'
          ms={data.measurementSystem}
          updateInput={this.updateInput}
          value={data.doorWidth} />

        <RateOfSpeedField label='Average Wind Speed at Door'
          name='windSpeedAverage'
          ms={data.measurementSystem}
          updateInput={this.updateInput}
          value={data.windSpeedAverage} />

        <PercentageField label='Percentage of Occurence'
          name='percentageOfWindPerDay'
          updateInput={this.updateInput}
          value={data.percentageOfWindPerDay}  />

        <ApplicationSpecificFields header="Heat Retention (Winter Months)" updateInput={this.updateInput} selectedApplications={data.applications} application='heatRetention'>
          <TemperatureField label='Inside Temperature'
            ms={data.measurementSystem}
            name='insideTemp'
            value={data.insideTemp.heatRetention}  />
          <TemperatureField label='Outside Temperature'
            ms={data.measurementSystem}
            name='outsideTemp'
            value={data.outsideTemp.heatRetention}  />
        </ApplicationSpecificFields>

        <ApplicationSpecificFields header="AC Retention (Summer Months)" updateInput={this.updateInput} selectedApplications={data.applications} application='ACRetention'>
          <TemperatureField label='Inside Temperature'
            ms={data.measurementSystem}
            name='insideTemp'
            value={data.insideTemp.ACRetention}  />

          <TemperatureField label='Outside Temperature'
            ms={data.measurementSystem}
            name='outsideTemp'
            value={data.outsideTemp.ACRetention}  />
        </ApplicationSpecificFields>

        <ApplicationSpecificFields updateInput={this.updateInput} selectedApplications={data.applications} application='cooler' header="Walk In Cooler">
          <TemperatureField label='Cooler Temperature'
            ms={data.measurementSystem}
            name='insideTemp'
            value={data.insideTemp.cooler}  />

          <TemperatureField label='Temperature outside Cooler'
            ms={data.measurementSystem}
            name='outsideTemp'
            value={data.outsideTemp.cooler}  />

          <PercentageField label='RH (inside)'
            name='RH_inside'
            value={data.RH_inside.cooler}  />

          <PercentageField label='RH (outside)'
            name='RH_outside'
            value={data.RH_outside.cooler}  />

        </ApplicationSpecificFields>

        <ApplicationSpecificFields updateInput={this.updateInput} selectedApplications={data.applications} header="Walk In Freezer" application="freezer">
          <TemperatureField label='Freezer Temperature'
            ms={data.measurementSystem}
            name='insideTemp'
            value={data.insideTemp.freezer}  />

          <TemperatureField label='Temperature outside Freezer'
            ms={data.measurementSystem}
            name='outsideTemp'
            value={data.outsideTemp.freezer}  />

          <PercentageField label='RH (inside)'
            name='RH_inside'
            value={data.RH_inside.freezer}  />

          <PercentageField label='RH (outside)'
            name='RH_outside'
            value={data.RH_outside.freezer}  />
        </ApplicationSpecificFields>


        <div>
          <h2>Business Operation Time</h2>
          <div>
            <label>Hours/Day</label>
            <input type="text" value={data.hoursPerDay} name="hoursPerDay" onChange={this.inputHandler} />
          </div>

          <PercentageField label='% Door Open'
            name='doorOpenPercentage'
            updateInput={this.updateInput}
            value={data.doorOpenPercentage}  />

          <div>
            <label>Days/Week</label>
            <input type="text" value={data.daysPerWeek} name="daysPerWeek" onChange={this.inputHandler} />
          </div>

          <ApplicationSpecificFields selectedApplications={data.applications} application="heatRetention">
            <WeekField label="Weeks/Year (Heating Season)" name="weeksUsedPerYear" value={data.weeksUsedPerYear.heatRetention} />
          </ApplicationSpecificFields>
          <ApplicationSpecificFields selectedApplications={data.applications} application="ACRetention">
            <WeekField label="Weeks/Year (Cooling Season)" name="weeksUsedPerYear" value={data.weeksUsedPerYear.ACRetention} />
          </ApplicationSpecificFields>
          <ApplicationSpecificFields selectedApplications={data.applications} application="cooler">
            <WeekField label="Weeks/Year (Cooler)" name="weeksUsedPerYear" value={data.weeksUsedPerYear.cooler} />
          </ApplicationSpecificFields>
          <ApplicationSpecificFields selectedApplications={data.applications} application="freezer">
            <WeekField label="Weeks/Year (Freezer)" name="weeksUsedPerYear" value={data.weeksUsedPerYear.freezer} />
          </ApplicationSpecificFields>

          {/* {data.applications.indexOf('heatRetention') > -1 ? HeatRetentionWeeksUsedField : null }
          {data.applications.indexOf('ACRetention') > -1 ? ACRetentionWeeksUsedField : null }
          {data.applications.indexOf('cooler') > -1 ? CoolerWeeksUsedField : null }
          {data.applications.indexOf('freezer') > -1 ? FreezerWeeksUsedField : null } */}
        </div>

        <div>
          <label>Cost of Heating</label>
          <input type="text" value={data.heatingCost} onChange={this.inputHandler} name="heatingCost" />
        </div>
        <div>
          <label>Cost of Electricity</label>
          <input type="text" value={data.electricityCost} onChange={this.inputHandler} name="electricityCost" />
        </div>

        <div>
          <label>Series</label>
          <select onChange={this.selectHandler} name="seriesName">
            <option value="LPV2">LPV2</option>
            <option value="STD">STD</option>
            <option value="HV">HV</option>
            <option value="EP">EP</option>
            <option value="WMI">WMI</option>
            <option value="WMH">WMH</option>
            <option value="BD">BD</option>
          </select>
        </div>

        <div>
          <label>Model (Enter Total HP)</label>
          <input type="text" onChange={this.inputHandler} value={data.horsepower}/>
        </div>
      </div>
    )
  }
}

class FormField extends React.Component {


  render() {
    return (
      <div className="field {this.props.type && 'field--${this.props.type}'}">
        {this.props.children}
      </div>
    )
  }
}

class Input extends React.Component {
  constructor(props){
    super(props);



    //set initial value
    this.state = {
      value: this.props.initialValue,
      message: this.validate(props.initialValue),
      isValid: true,
      disabled: this.props.disabled || false
    }

    // validate initial value
    this.validate(props.initialValue);

  }

  validate = (value) => {
    if(!this.props.rules) {
      return true;
    }


    // let _rules = typeof this.props.rules === 'string' ? [this.props.rules] : this.props.rules;
    // let message;
    // let isValid = true;
    //
    //
    // _rules.some((_ruleName) => {
    //   let _ruleValue = _rule[_ruleName];
    //   isValid = rules[_ruleName](this.props.name, value, _ruleValue);
    //   message = !isValid ? getMessage(_ruleName, this.props.name, _ruleValue) : '';
    //   return !isValid;
    // });

    // return {
    //   isValid, message
    // };
  }

  onChange(e) {
    let error = this.validate(e.target.value);
    //update root state



    if(!error) {
      this.props.validationHandler()
    }


    //update internal state?

    //
  }

  render(){
    return (
      <div className="text-input {isValid ? text-input--error : ''}">
        <input type="text" onChange={this.onChange} name={this.props.name} value={this.state.value}  />
        {this.props.isValid &&
          <span className="error-message">
            {this.state.message}
          </span>
        }
      </div>
    )
  }
}

class SelectInput extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      value: this.props.initialValue || '',
      isValid: this.isValid(this.props.initialValue),
      message: '',
      disabled: false

    };
  }

  isValid = (value = '') => {
    let message = true;

    if(this.props.required) {
      message = validationService.required(this.props.name, value)
    }
  }



  onChange = (e) => {

    //validate input
    let isValid = this.isValid(e.target.value);

    this.setState({
      'value': e.target.value,
      'isValid': isValid === true,
      'message': isValid === true ? '' : isValid
    });

    if(isValid) {
      this.props.onChange(e);
    }


  }

  render() {

    return(
      <select onChange={this.onChange} value={this.state.value} name={this.props.name}>
        {this.props.children}
      </select>
    )
  }
}


class ApplicationSpecificFields extends React.Component {

  render() {
    if(this.props.selectedApplications.indexOf(this.props.application) < 0) {
        return null;
    }

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        updateInput: this.props.updateInput,
        application: this.application
      })
    );

    const header = this.props.header ? <h2>{this.props.header}</h2> : null;

    return (
      <div>
        <h2>{this.props.header}</h2>
        {childrenWithProps}
      </div>
    )
  }

}



class LengthField extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      'SI': 'm',
      'IP': 'ft'
    };
  }

  changeHandler = (e) => {
    let value = this.props.ms === 'IP' ? e.target.value : convert(e.target.value, 'm', 'ft');
    console.log(value);
    this.props.updateInput(this.props.name, value);
  }

  render(){
    let value = this.props.ms === 'IP' ? this.props.value : convert(this.props.value, 'ft', 'm');
    value = value ? util.roundToSecondDecimal(value) : value;

    return(
      <div>
        <label htmlFor={this.props.name}>{this.props.label}</label>
        <Input onChange={this.changeHandler} name={this.props.name} value={value} />
        <span>{this.props.ms === 'IP' ? 'ft' : 'm'}</span>
      </div>
    )
  }
}

class RateOfSpeedField extends React.Component {

  changeHandler = (e) => {
    let newValue = util.removeNonNumericCharacters(e.target.value);
    newValue = this.props.ms === 'IP' ? newValue : convert(newValue, 'kmh', 'mph');
    this.props.updateInput(this.props.name, newValue);

  }

  render(){
    const value = this.props.ms === 'IP' ? this.props.value : convert(this.props.value, 'mph', 'kmh');

    return(
      <div>
        <label htmlFor={this.props.name}>{this.props.label}</label>
        <Input onChange={this.changeHandler} name={this.props.name} value={value} />
        <span>{this.props.ms === 'IP' ? 'mph' : 'km/h'}</span>
      </div>
    )
  }
}

class PercentageField extends React.Component {

  changeHandler = (e) => {

    let newValue = util.removeNonNumericCharacters(util.removeDecimals(e.target.value));

    this.props.updateInput(this.props.name, newValue/100, this.props.application);

  }

  render(){
    const name = this.props.hasOwnProperty('application') ? this.props.name + '_' + this.props.application : this.props.name;
    const value = this.props.value ? Math.round(this.props.value*100) : '';

    return(
      <div>
        <label htmlFor={name}>{this.props.label}</label>
        <Input onChange={this.changeHandler} name={name} value={value} />
        <span>%</span>
      </div>
    )
  }
}

class TemperatureField extends React.Component {

  changeHandler = (e) => {

    let newValue = util.removeNonNumericCharacters(util.removeDecimals(e.target.value));
    newValue = this.props.ms === 'IP' ? newValue : convert(newValue, 'C', 'F');
    this.props.updateInput(this.props.name, newValue, this.props.application);

  }

  render(){
    const value = this.props.ms === 'IP' ? this.props.value : convert(this.props.value, 'F', 'C');

    return(
      <div>
        <label htmlFor={this.props.name + '_' + this.props.application}>{this.props.label}</label>
        <Input onChange={this.changeHandler} name={this.props.name + '_' + this.props.application} value={value} />
        <span>&deg;{this.props.ms === 'IP' ? 'F' : 'C'}</span>
      </div>
    )
  }
}

class WeekField extends React.Component {

  changeHandler = (e) => {

    let newValue = util.removeNonNumericCharacters(util.removeDecimals(e.target.value));
    this.props.updateInput(this.props.name, newValue, this.props.application);

  }

  render(){
    return(
      <div>
        <label htmlFor={this.props.name + '_' + this.props.application}>{this.props.label}</label>
        <Input onChange={this.changeHandler} name={this.props.name + '_' + this.props.application} value={this.props.value} />
      </div>
    )
  }
}

const util = {};
util.removeNonNumericCharacters = (str) => str.replace(/[^0-9.]/g, '');
util.removeDecimals = (str) => str.replace(/\./g, '');
util.formatDecimalForDisplay = (str) => str.toFixed(2).replace('.00', '');
util.roundToSecondDecimal = (str) => Math.round(parseFloat(str)*100)/100;
