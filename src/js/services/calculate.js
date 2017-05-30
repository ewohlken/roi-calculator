import convert from "./convert";

const constants = ;

export default class CalculatorService {

	constructor(ms="IP") {
		this.ms = ms;
		this.constants = {
			H: 1.3716, //f3
			Cd: 0.65, //f4
			g: 9.81,
			Cv: 0.55,
			shielding:	1,
			ρ: 1.2,
			Cp: 1.005, //f9
			ThermalEff: 0.70,
			CoolingEff: 0.33,
			CoolingEffWalkInCooler: 0.43,
			CoolingEffFreezer: 0.67,
			AmbientPressure: 14.696,
			IndoorDensity: 1.4 //f15
		};
		this.variables
	}

	HeatRetention(airCurtainOn, doorWidth, doorHeight, insideTemp, outsideTemp, windSpeedAverage, windPercent) {
		if(!airCurtainOn) {
			//wind calculations
			let doorArea           = doorWidth*doorHeight;
			let H                  = doorHeight/2;
			let deltaT             = insideTemp - outsideTemp;
			let qStack             = this.constants.Cd*doorArea*0.15*(Math.sqrt(2*this.constants.g*H*(Math.abs(deltaT)/insideTemp)));
			let qWind              = this.constants.Cv*doorArea*windSpeedAverage*0.5*this.constants.shielding;
			let qTot_ht_x          = windPercent*(Math.sqrt(Math.pow(qStack, 2)+Math.pow(qWind, 2)));
			let qTot_ht_1_minus_x  = (1-windPercent)*qStack;
			let qTotal             = qTot_ht_x + qTot_ht_1_minus_x;
			let q_net_ht_x         = this.constants.Cp*this.constants.p*Math.abs(deltaT)*qTot_ht_x/this.constants.ThermalEff;
			let q_net_ht_1_minus_x = this.constants.Cp*this.constants.p*Math.abs(deltaT)*qTot_ht_1_minus_x/this.constants.ThermalEff; 

		}


	},
	ACRetention: function(airCurtainOn) {

	},
	WalkInCoolerFreezer: function(airCurtainOn) {

	}
}

function calculate(data, ms="IP"){

	//if we aren't using the metric system already, convert input to metric units
	if(ms!=="SI"){
		data = convert(data, "IP", "SI");
	}


}
