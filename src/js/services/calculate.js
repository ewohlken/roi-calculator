import convert from './convert';



export default calculatorService = (initData) => {

	/// add better error logic
	if(typeof initData === 'undefined' || !initData.constants.length) {
		console.error('error, need Air Curtain series data to be defined before loading calculator module');
		return;
	}

	// gets constants
	const _get = (key, _key = null) => _key === null ? initData.constants[key] : initData.constants[key][_key];

	// houses calculations
	const _calc = {};
	_calc.airCurtainEffectivenessWithWind = (slope_LP, windSpeedAverage, zeroWindEfficiency) => (slope_LP*windSpeedAverage+zeroWindEfficiency)/100;

	_calc.Q_stack = (doorHeight, doorArea, tempValue, deltaTemp) => _get('Cd')*doorArea*0.15*(Math.sqrt(2*_get('g')*(doorHeight/2)*(Math.abs(deltaTemp)/temp)));

	_calc.Q_wind = (doorArea, windSpeedAverage) => doorArea*windSpeedAverage*_get('Cv')*0.5*_get('shielding');

	_calc.Q_tot_x = (windOccurancePercentage, Q_stack, Q_wind) => windOccurancePercentage*(Math.sqrt(Math.pow(Q_stack, 2)+Math.pow(Q_wind, 2)));

	_calc.Q_tot_1_minus_x = (windOccurancePercentage, Q_stack) => (1-windOccurancePercentage)*Q_stack;

	_calc.q_net = (deltaTemp, tempEffConstant, Q_var) => _get('Cp')*_get('p')*Math.abs(deltaTemp)*Q_var/tempEffConstant;

	_calc.q_net_1_minus_x = (deltaTemp, tempEffConstant, Q_tot_1_minus_x) => _get('Cp')*_get('p')*Math.abs(deltaTemp)*Q_tot_1_minus_x/tempEffConstant;

	_calc.retentionSavingsPerYear = ( series, doorArea, tempEffConstant, deltaTemp, Q_stack, windSpeedAverage, percentageOfWindPerDay, utilityCostPerYear) => {
		let q_net_1_minus_x = _calc.q_net_1_minus_x(deltaTemp, tempEffConstant, _calc.Q_tot_1_minus_x(percentageOfWindPerDay, _Q_stack));
		
		let q_net = _calc.q_net(deltaTemp, tempEffConstant, _calc.Q_tot_x(
				percentageOfWindPerDay,
				Q_stack,
				_calc.Q_wind(doorArea, windSpeedAverage)
		));

		return q_net * _calc.airCurtainEffectivenessWithWind(series['slope_LP'], windSpeedAverage, series['zeroWindEfficiency']) + q_net_1_minus_x * (series['zeroWindEfficiency']) * utilityCostPerYear;
	};

	_calc.coolerFreezerSavingsPerYear = ( zeroWindEfficiency, Q_stack, tempEffConstant, deltaTemp, utilityCostPerYear) => {

		let q_net = calc.q_net(deltaTemp, tempEffConstant, Q_stack );
		let indoorDensity;
		let q_latent = Q_stack * (absoulteHumidity['out']-absoulteHumidity['in'])*indoorDensity*_get('qLatentConstant');
		let totalHeat = q_latent + q_net;
		let airCurtainEffectivenessWithZeroWind = zeroWindEfficiency * _get('coolerFreezerCorrectionFactor');
		let q_net_saved = airCurtainEffectivenessWithZeroWind * totalHeat;


		return q_net_saved * utilityCostPerYear;
	};

	return {

		ROI: (data) => {
			const series = _get('series', data['seriesName']);
			const doorArea = data['door']['width'] * data['door']['height'];

			let savingsPerYear = 0;

			data['applications'].forEach((_application) => {
				let _tempValue = _application === 'heatRetention' ? data[_application]['insideTemp'] : data[_application]['outsideTemp'];
				let _tempEffConstant = _get(_application, 'tempEff');
				let _utilityCostPerHour = _application === 'heatRetention' ? data['heatingCost'] : data['electricityCost'];
				let _utilityCostPerYear = data['operation']['hoursPerDay'] * data['operation']['daysPerWeek'] * data[_application]['weeksUsedPerYear'] * _utilityCostPerHour;



				let _deltaTemp = data[_application]['insideTemp'] - data[_application]['outsideTemp'];
				let _Q_stack = _calc.Q_stack(data['door']['height'], doorArea, _tempValue, _deltaTemp);

				if(data['applications'].indexOf('heatRetention') > -1 || data['applications'].indexOf('ACRetention') > -1) {
					savingsPerYear += _calc.retentionSavingsPerYear(series, doorArea, _tempEffConstant, _deltaTemp, _Q_stack, data.windSpeedAverage, data.percentageOfWindPerDay, _utilityCostPerYear );
				}

				if(data['applications'].indexOf('cooler') > -1 || data['applications'].indexOf('freezer') > -1) {
					savingsPerYear += _calc.coolerFreezerSavingsPerYear(series['zeroWindEfficiency'], _Q_stack, _tempEffConstant, _deltaTemp, _utilityCostPerYear);
				}

			});

			let profitPerYear = savingsPerYear - data.airCurtainPowerCostPerYear;

			return profitPerYear <= 0 ? "N/A" : (_get('installationCost') + series.cost) / profitPerYear;



///////////

			if(data.applications.indexOf('heatRetention') > -1 || data.applications.indexOf('ACRetention') > -1) {

				data.applications.forEach((_application) => {
					let _tempValue = _application === 'heatRetention' ? input[_application]['insideTemp'] : input[_application]['outsideTemp'];
					let _deltaT = input[_application]['insideTemp'] - input[_application]['outsideTemp'];
					_dollarsSavedYearly += _calc.retentionProfitPerYear(_series, data.doorWidth, _doorArea, _tempValue, _get(_application, 'tempEff'),  );
				});

			}else if(data.applications.indexOf('cooler') > -1 || data.applications.indexOf('freezer') > -1){
					let _Q_stack = _calc.Q_stack(_doorArea, input.doorHeight, tempValue, deltaTemp);
			}

			if(data.applications.indexOf('heatRetention') > -1) {
				_dollarsSavedYearly += _calc.retentionProfitPerYear();
			}

			if(data.applications.indexOf('heatRetention') > -1) {
				let _deltaTemp = data['heatRetention'][insideTemp] - data['heatRetention'][outsideTemp];

				dollarsSavedYearly += _calc.dollarsSavedYearly('heatRetention', _series, data['heatRetention'][insideTemp], _deltaTemp);
			}

			if(data.applications.indexOf('ACRetention') > -1) {
				dollarsSavedYearly += _calc.dollarsSavedYearly('ACRetention', data.outsideTemp);
			}

			if(data.applications.indexOf('walkInFreezer') > -1)

			if(application === 'ACRetention'){
				_tempConstant = _get('coolingEff');
				let _Q_stack = _calc.Q_stack(_doorArea, doorHeight, _deltaTemp, data[application]['outsideTemp']);
			}else if(application === 'walkInFreezer' || ){
				let _temp = application === 'heatRetention' ? data.insideTemp : data.outsideTemp;
				let _tempConstant = _get('coolingEff');
			}else if(application === 'walkInCooler') {

			}

			//first calc dollars saved per year
			let _dollarsSavedYearly = _dollarsSavedYearly(initialCost, costYearly, doorWidth, doorHeight);
			let _yearlyProfit = dollarsSavedYearly - costYearly;

			return _dollarsSavedYearly >= 0 ? initialCost / yearlyProfit;
		},

		powerCostPerYear: (data) => {
			let _hoursUsedPerYear = 0;

			data.applications.forEach((_application) => {
				_hoursUsedPerYear += data['hoursdPerDay'] * data[_application]['weeksUsedYearly'] , data.daysOpenWeekly;
			});

			return _hoursUsedPerYear * data.electricityCostPerYear * data.horsePower;
		},

		HeatRetention : (series, doorWidth, doorHeight, insideTemp, outsideTemp, windSpeedAverage, windOccurancePercentage, hoursOpenDaily, daysOpenWeekly, weeksUsedYearly, energyCost) => {
			//wind calculations
			let doorArea           = doorWidth*doorHeight;
			let deltaTemp             = insideTemp - outsideTemp;

			let Q_stack             = _calc.Q_stack(doorArea, doorHeight, deltaTemp, insideTemp);

			let Q_wind              = _get('Cv')*doorArea*windSpeedAverage*0.5*_get('shielding');
			let Q_tot_HR_x          = windOccurancePercentage*(Math.sqrt(Math.pow(Q_stack, 2)+Math.pow(Q_wind, 2)));
			let qTot_ht_1_minus_x  = (1-windOccurancePercentage)*Q_stack;
	 		let qTotal             = Q_tot_HR_x + qTot_ht_1_minus_x;
			let q_net_ht_x         = _get('Cp')*_get('p')*Math.abs(deltaTemp)*Q_tot_HR_x/_get('thermalEff');
			let q_net_ht_1_minus_x = _get('Cp')*_get('p')*Math.abs(deltaTemp)*qTot_ht_1_minus_x/_get('thermalEff');

			let efficiencyZeroWind = _calc.ZeroWindEffeciency(series);
			let efficiencyWind = _calc.windEffeciency(series, windSpeedAverage, efficiencyZeroWind);

			let qNetSavedByAirCurtain = q_net_ht_x * efficiencyWind;
			let qNetSavedByAirCurtainZeroWind = q_net_ht_x * efficiencyZeroWind;

		},

		WalkInCoolerFreezer(series, door, temp, wind, business, heatingCost) {

			let [dWidth, dHeight] = door;
			let [insideTemp, outsideTemp] = temp;

			let doorArea = dWidth * dHeight;
			let H = doorHeight/2;
			let deltaTemp = temp[0] - temp[1];



			let Q_stack = Q_stack(door[0], door[1]);
			// let q_net = IF($'Inputs for Calc'.D2='Walk-in Cooler/Refrigerated Storage';(F9*F8*ABS(C20)*M5*1/F12);IF($'Inputs for Calc'.D2='Walk-in Freezer/Cold Storage';(F9*F8*ABS(C20)*M5*1/F13)never;0));
			// let waterVaporPressure_In =(10^(8.07131-(1730.63/(233.426+((B18-32)*(5/9)))))*0.0193367747);
			// let waterVaporPressure_Out =(10^(8.07131-(1730.63/(233.426+((B19-32)*(5/9)))))*0.0193367747);
			// let HumiditySaturated_in =(7000*18.02/28.85)*M7/(F14-M7);
			// let HumiditySaturated_out =(7000*18.02/28.85)*M8/(F14-M8);
			// let AbsoluteHumidity_in =(M9*B21*100/700000);
			// let AbsoluteHumidity_out =(M10*B22*100/700000);
			// let q_latent =M5*(M12-M11)*F15*2270;
			// let TotalHeat =M13+M6;

		}
	}
})(_initialData);
