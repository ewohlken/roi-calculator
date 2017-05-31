import convert from "./convert";

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
	}

	HeatRetention(series, doorWidth, doorHeight, insideTemp, outsideTemp, windSpeedAverage, windPercent, hoursOpenDaily, daysOpenWeekly, weeksOfHeatRetentionYearly, costOfHeatKwh) {
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

		let efficiencyWind = this.getWindEffeciencyBySeries(series);
		let efficiencyNoWind = this.getNoWindEffeciencyBySeries(series);

		let qNetSavedByAirCurtainWithWind = q_net_ht_x * efficiencyWind;
		let qNetSavedByAirCurtainWithoutWind = q_net_ht_x * efficiencyNoWind;

		let dollarsSavedByAirCurtain = (qNetSavedByAirCurtainWithWind + qNetSavedByAirCurtainWithoutWind) * hoursOpenDaily * daysOpenWeekly * weeksOfHeatRetentionYearly * costOfHeat;

	},
	ACRetention(series, doorWidth, doorHeight, insideTemp, outsideTemp, windSpeedAverage, windPercent, hoursOpenDaily, daysOpenWeekly, weeksOfHeatRetentionYearly, costOfHeatKwh) {
		//wind calculations
		let doorArea           = doorWidth*doorHeight;
		let H                  = doorHeight/2;
		let deltaT             = insideTemp - outsideTemp;
		let qStack             = this.constants.Cd*doorArea*0.15*(Math.sqrt(2*this.constants.g*H*(Math.abs(deltaT)/outsideTemp)));
		let qWind              = this.constants.Cv*doorArea*windSpeedAverage*0.5*this.constants.shielding;
		let qTot_ac_x          = windPercent*(Math.sqrt(Math.pow(qStack, 2)+Math.pow(qWind, 2)));
		let qTot_ac_1_minus_x  = (1-windPercent)*qStack;
 		let qTotal             = qTot_ac_x + qTot_ac_1_minus_x;
		let q_net_ac_x         = this.constants.Cp*this.constants.p*Math.abs(deltaT)*qTot_ac_x/this.constants.CoolingEff;
		let q_net_ac_1_minus_x = this.constants.Cp*this.constants.p*Math.abs(deltaT)*qTot_ac_1_minus_x/this.constants.CoolingEff;

		let efficiencyWind = this.getWindEffeciencyBySeries(series);
		let efficiencyNoWind = this.getNoWindEffeciencyBySeries(series);

		let qNetSavedByAirCurtainWithWind = q_net_ac_x * efficiencyWind;
		let qNetSavedByAirCurtainWithoutWind = q_net_ac_x * efficiencyNoWind;

		let dollarsSavedByAirCurtain = (qNetSavedByAirCurtainWithWind + qNetSavedByAirCurtainWithoutWind) * hoursOpenDaily * daysOpenWeekly * weeksOfHeatRetentionYearly * costOfHeat;

	},

	WalkInCoolerFreezer() {
		let doorArea 

		let Q_stack = this.constants.Cd*C5*0.15*(2*F5*F3*(ABS(C20)/C19))^0.5;
		let q_net = IF($'Inputs for Calc'.D2="Walk-in Cooler/Refrigerated Storage";(F9*F8*ABS(C20)*M5*1/F12);IF($'Inputs for Calc'.D2="Walk-in Freezer/Cold Storage";(F9*F8*ABS(C20)*M5*1/F13);0));
		let waterVaporPressure_In =(10^(8.07131-(1730.63/(233.426+((B18-32)*(5/9)))))*0.0193367747);
		let waterVaporPressure_Out =(10^(8.07131-(1730.63/(233.426+((B19-32)*(5/9)))))*0.0193367747);
		let HumiditySaturated_in =(7000*18.02/28.85)*M7/(F14-M7);
		let HumiditySaturated_out =(7000*18.02/28.85)*M8/(F14-M8);
		let AbsoluteHumidity_in =(M9*B21*100/700000);
		let AbsoluteHumidity_out =(M10*B22*100/700000);
		let q_latent =M5*(M12-M11)*F15*2270;
		let TotalHeat =M13+M6;

	}

	getWindEffeciencyBySeries(series) {
		let windEfficiency = null;
		switch(series) {
			case "LP":
			windEfficiency = -10;
			break;
			case "STD":
			windEfficiency = 23.75;
			break;
			case "HV":
			windEfficiency = 30;
			break;
			case "EP":
			windEfficiency = 25;
			break;
			case "WMI":
			windEfficiency = 48.75;
			break;
			case "BD":
			windEfficiency = 50;
			break;
		}

		return windEfficiency < 0 ? 0 : windEfficiency;

	},
	getNoWindEffeciencyBySeries(series) {
		return series === "LP" ? 70 : 80;
	},
}

function calculate(data, ms="IP"){

	//if we aren't using the metric system already, convert input to metric units
	if(ms!=="SI"){
		data = convert(data, "IP", "SI");
	}


}
