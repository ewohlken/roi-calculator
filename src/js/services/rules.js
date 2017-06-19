const messages = {
	required: ({name, val}) => `${name.toUpperCase()} is a required field.`
}
const getMessage = (ruleName, inputName, ruleValue = null) => messages[ruleName](inputName, ruleValue);

const rules = {};

rules.required = (name, val) => val === '' ? `${name.toUpperCase()} is a required field.` : true;

rules.removeDecimals = (str) => str.replace(/\./g, '');
rules.formatDecimalForDisplay = (str) => str.toFixed(2).replace('.00', '');
rules.roundToSecondDecimal = (str) => Math.round(parseFloat(str)*100)/100;



// export {rules, getMessage}
export default {
	required : (name, val) => val === '' ? `${name.toUpperCase()} is a required field.` : true
}
