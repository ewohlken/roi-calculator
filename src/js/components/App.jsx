import React from "react";

import Form from "./Form";
import TextInput from "./TextInput";
import Calculator from "./ROICalculator";

export default class App extends React.Component {

  render(){
    return <Calculator initialInput={_initialData.input} product={_initialData.product} />
  }
}
