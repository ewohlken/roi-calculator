import React from "react";

import calculatorService from "../services/calculate.js";

export default class Calculator extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      input: _initialData.input,
    }

    this.state.model = {
      series: _initialData.series[_initialData.input.seriesName],
      purchaseCost: undefined,
      costPerYear: undefined,
      horsepower: undefined,
      ROI_Time: undefined
    }

    this.state.model.series.installationCost = 2500;
  }

  updateInput = (name, value) => {
    if(this.state.input.hasOwnProperty(name) && this.state.input[name] !== value) {
      this.state.input[name] = value;
    }
  }

  updateApplication = (e) => {
    console.log(e);
  }

  calculateROI = () => {
    let costToPurchase = this.state.model.series.purchaseCost;
    let costToInstall = this.state.model.series.installationCost;
    let totalCost = costToInstall + costToPurchase;
    let costPerYear = calculatorService.costPerYear(this.state.input.applications, this.state.input.operation, this.state.input.electricityCost, this.state.input.horsepower);

    console.log({
      'costToPurchase': costToPurchase,
      'costToInstall': costToInstall,
      'totalCost': totalCost,
      'costPerYear': costPerYear,
      'ROI_Time': calculatorService.ROI(this.state.input, this.state.model.series, costPerYear, totalCost)
    });

    this.setState({
      'costToPurchase': costToPurchase,
      'costToInstall': costToInstall,
      'totalCost': totalCost,
      'costPerYear': costPerYear,
      'ROI_Time': calculatorService.ROI(this.state.input, this.state.model.series, costPerYear, totalCost)
    });
  }

  displayError = (message) => {

  }

  render() {
    return (
      <div>
        <div>
          <select name="applications" onChange={this.updateApplication}>
            <option value="heatRetention">Heat Retention</option>
            <option value="ACRetention">Air Conditioning Retention</option>
            <option value="heatRetention, ACRetention">Heat and Air Conditioning Retention</option>
            <option value="cooler">Walk-in Cooler/Refrigerated Storage</option>
            <option value="freezer">Walk-in Freezer/Cold Storage</option>
          </select>
          <select name="measurementSystem">
            <option value="IP">(I-P) English</option>
            <option value="SI">(SI) Metric</option>
          </select>


          <div>
            <label>Door Height:</label>
            <input type="text" value={this.state.input.door.height} name="[door, height]" data-validation="number" />
          </div>

          <div>
            <label>Door Width:</label>
            <input type="text" value={this.state.input.door.width} name="[door, width]" data-validation="number" />
          </div>

          <div>
            <label>Average Wind Speed at Door:</label>
            <input type="text" value={this.state.input.windSpeedAverage} name="windSpeedAverage" data-validation="number" />
          </div>
          <div>
            <label>Percentage of Occurence:</label>
            <input type="text" value={this.state.input.percentageOfWindPerDay} name="percentageOfWindPerDay" data-validation="percentage" />
          </div>

          <div>
            <h2>Heat Retention</h2>
            <div>
              <label>Inside Temp</label>
              <input type="text" value={this.state.input.heatRetention.insideTemp} name="[heatRetention][insideTemp]" />
            </div>

            <div>
              <label>Outside Temp</label>
              <input type="text" value={this.state.input.heatRetention.outsideTemp} name="[heatRetention][outsideTemp]" />
            </div>
          </div>

          <div>
            <h2>AC Retention</h2>
            <div>
              <label>Inside Temp</label>
              <input type="text" value={this.state.input.ACRetention.insideTemp} name="[ACRetention][insideTemp]" />
            </div>

            <div>
              <label>Outside Temp</label>
              <input type="text" value={this.state.input.ACRetention.outsideTemp} name="[ACRetention][outsideTemp]" />
            </div>
          </div>

          <div>
            <h2>Walk In Cooler</h2>
            <div>
              <label>Temp inside Cooler</label>
              <input type="text" value={this.state.input.cooler.insideTemp} name="[cooler][insideTemp]" />
            </div>

            <div>
              <label>Temp Outside Cooler</label>
              <input type="text" value={this.state.input.cooler.outsideTemp} name="[cooler][outsideTemp]" />
            </div>

            <div>
              <label>RH Inside</label>
              <input type="text" value={this.state.input.cooler.RH_inside} name="[cooler][RH_inside]" />
            </div>

            <div>
              <label>RH Outside</label>
              <input type="text" value={this.state.input.cooler.RH_outside} name="[cooler][RH_outside]" />
            </div>
          </div>

          <div>
            <h2>Walk In Freezer</h2>
            <div>
              <label>Temp inside Cooler</label>
              <input type="text" value={this.state.input.freezer.insideTemp} name="[freezer][insideTemp]" />
            </div>

            <div>
              <label>Temp Outside Cooler</label>
              <input type="text" value={this.state.input.freezer.outsideTemp} name="[freezer][outsideTemp]" />
            </div>

            <div>
              <label>RH Inside</label>
              <input type="text" value={this.state.input.freezer.RH_inside} name="[freezer][RH_inside]" />
            </div>

            <div>
              <label>RH Outside</label>
              <input type="text" value={this.state.input.freezer.RH_outside} name="[freezer][RH_outside]" />
            </div>
          </div>

          <div>
            <h2>Business Operation Time</h2>
            <div>
              <label>Hours/Day</label>
              <input type="text" value={this.state.input.operation.hoursPerDay} name="[operation][hoursPerDay]" />
            </div>

            <div>
              <label>% Door Open</label>
              <input type="text" value={this.state.input.operation.doorOpenPercentage} name="[operation][doorOpenPercentage]" />
            </div>

            <div>
              <label>Days/Week</label>
              <input type="text" value={this.state.input.operation.daysPerWeek} name="[operation][daysPerWeek]" />
            </div>

            <div>
              <label>For Heating Season</label>
              <input type="text" value={this.state.input.operation.weeksUsedPerYear.heatRetention} name="[heatRetention][weeksUsedPerYear]" />
            </div>
            <div>
              <label>For Cooling Season</label>
              <input type="text" value={this.state.input.operation.weeksUsedPerYear.ACRetention} name="[ACRetention][weeksUsedPerYear]" />
            </div>
            <div>
              <label>For Walk in Cooler</label>
              <input type="text" value={this.state.input.operation.weeksUsedPerYear.cooler} name="[cooler][weeksUsedPerYear]" />
            </div>
            <div>
              <label>For Walk in Freezer</label>
              <input type="text" value={this.state.input.operation.weeksUsedPerYear.freezer} name="[freezer][weeksUsedPerYear]" />
            </div>
          </div>

          <div>
            <label>Cost of Heating</label>
            <input type="text" value={this.state.input.heatingCost} name="heatingCost" />
          </div>
          <div>
            <label>Cost of Electricity</label>
            <input type="text" value={this.state.input.electricityCost} name="electricityCost" />
          </div>

          <div>
            <label>Series</label>
            <select>
              <option value={this.state.input.seriesName}>LPV2</option>
            </select>
          </div>

          <div>
            <label>Model (Enter Total HP)</label>
            <HorsepowerInput value={this.state.input.horsepower} updateModel={this.updateModel} />
            <input type="text" value={this.state.input.horsepower} onChange/>
          </div>
        </div>

        <div>
          <button onClick={this.calculateROI} >Calculate</button>
          <hr />
          <div>
            <label>Air Curtain Purchase Cost</label>
            <div>{this.state.model.series.purchaseCost}</div>
          </div>
          <div>
            <label>Air Curtain Installation Cost</label>
            <div>{this.state.model.series.installationCost}</div>
          </div>
          <div>
            <label>Total Cost</label>
            <div>{this.state.model.series.purchaseCost + this.state.model.series.installationCost}</div>
          </div>
          <div>
            <label>Cost to Run (Yearly)</label>
            <div>{this.state.model.costPerYear}</div>
          </div>
          <div>
            <label>Air Curtain Pays for itself In</label>
            <div>{this.state.model.ROI_Time}</div>
          </div>
        </div>
      </div>
    )
  }
}



class retentionSection extends React.Component {


  render(){
    return(
      <div>

      </div>
    )
  }
}

class HorsepowerInput extends React.Component {
  constructor(props) {
    super(props);

    this.props.updateModel({
      ''
    })
  }

  render(){
    return(
      <input name="horsepower" type="text"/>
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
  }
}
