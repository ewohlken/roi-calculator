import React from "react";
// import Calculator from "../services/calculator";

export default class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || ''
    }
  }


  onChangeHandler = (event) => {
    this.setState({
      value: event.currentTarget.value
    });
  }

  render() {
    return (
      <input type="text" name={this.props.name} onChange={this.onChangeHandler} value={this.state.value}/>
    )
  }
}
