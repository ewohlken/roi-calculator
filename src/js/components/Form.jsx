import React from "react";

export default class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputs: {},
      model: {}
    };

    if(props.children) {

      this.findInputs(props.children)
      console.log(this.state);
    }
  }

  /**
   * This finds inputs in a given array of elements and adds them to the form state
   * @param  {Array}  [elements=[]]
   */
  findInputs = (elements = []) => {
    elements.forEach((element) =>{
      if(element.props && element.props.children && element.props.children.constructor === Array) {
        this.findInputs(element.props.children);
      }else{
        //checks to see if its an inputs, then registers it
        if(element.props.hasOwnProperty('name')) {
          this.registerInput(element);
        }
      }

    });
  }

  registerInput = (input) => {
    this.state.inputs[input.props.name] = input;
    this.state.model[input.props.name] = input.value ? input.value : null;
  }

  // We need a method to update the model when submitting the form.
  // We go through the inputs and update the model
  updateModel = () => {
    Object.keys(this.inputs).forEach((name) => {
      this.model[name] = this.inputs[name].state.value;
    });

    //after updating model we want to rerun calculations, so this is where we do that
    //we want to check to make sure we only rerun necessary calculations

  }

  // We prevent the form from doing its native
  // behaviour, update the model and log out the value
  submit(event) {
    event.preventDefault();
    this.updateModel();
    console.log(this.model);
  }

  render() {
    return (
      <form>
        {this.props.children}
        <button type="submit">Calculate</button>
      </form>
    )
  }
}
