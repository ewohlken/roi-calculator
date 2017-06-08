import convert from './convert';



export default ((initData) => {

	/// add better error logic
	if(typeof initData === 'undefined') {
		console.log(initData);
		console.error('error, need Air Curtain series data to be defined before loading calculator module');
		return;
	}

	// gets constants
	const _get = (key, _key = null) => _key === null ? initData.constants[key] : initData.constants[key][_key];

	// calculations
	const _calc = {};
	_calc.airCurtainEffectivenessWithWind = (slope_LP, windSpeedAverage, zeroWindEfficiency) => (slope_LP*windSpeedAverage+zeroWindEfficiency)/100;

	_calc.Q_stack = (doorHeight, doorArea, tempValue, deltaTemp) => _get('Cd')*doorArea*0.15*(Math.sqrt(2*_get('g')*(doorHeight/2)*(Math.abs(deltaTemp)/tempValue)));

	_calc.Q_wind = (doorArea, windSpeedAverage) => doorArea*windSpeedAverage*_get('Cv')*0.5*_get('shielding');

	_calc.Q_tot_x = (windOccurancePercentage, Q_stack, Q_wind) => windOccurancePercentage*(Math.sqrt(Math.pow(Q_stack, 2)+Math.pow(Q_wind, 2)));

	_calc.Q_tot_1_minus_x = (windOccurancePercentage, Q_stack) => (1-windOccurancePercentage)*Q_stack;

	_calc.q_net = (deltaTemp, tempEffConstant, Q_var) => _get('Cp')*_get('p')*Math.abs(deltaTemp)*Q_var/tempEffConstant;

	_calc.q_net_1_minus_x = (deltaTemp, tempEffConstant, Q_tot_1_minus_x) => _get('Cp')*_get('p')*Math.abs(deltaTemp)*Q_tot_1_minus_x/tempEffConstant;

	_calc.retentionSavingsPerYear = ( series, doorArea, tempEffConstant, deltaTemp, Q_stack, windSpeedAverage, percentageOfWindPerDay, utilityCostPerYear) => {
		let q_net_1_minus_x = _calc.q_net_1_minus_x(deltaTemp, tempEffConstant, _calc.Q_tot_1_minus_x(percentageOfWindPerDay, Q_stack));

		let q_net = _calc.q_net(deltaTemp, tempEffConstant, _calc.Q_tot_x(
				percentageOfWindPerDay,
				Q_stack,
				_calc.Q_wind(doorArea, windSpeedAverage)
		));

		return q_net * _calc.airCurtainEffectivenessWithWind(series['slope_LP'], windSpeedAverage, series['zeroWindEfficiency']) + q_net_1_minus_x * (series['zeroWindEfficiency']) * utilityCostPerYear;
	};

	_calc.waterVaporPressure = (temp) => 10^(8.07131-(1730.63/temp))*0.0193367747;

	_calc.coolerFreezerSavingsPerYear = ( zeroWindEfficiency, Q_stack, insideTemp, outsideTemp, tempEffConstant, RHInside, RHOutside, deltaTemp, utilityCostPerYear) => {

		let waterVaporPressureIn = _calc.waterVaporPressure(insideTemp);
		let waterVaporPressureOut = _calc.waterVaporPressure(outsideTemp);

		let absoluteHumidityIn = ((7000*18.02/28.85)*waterVaporPressureIn/(_get('AmbientPressure')-waterVaporPressureIn)*RHInside*100/700000);
		let absoluteHumidityOut = ((7000*18.02/28.85)*waterVaporPressureOut/(_get('AmbientPressure')-waterVaporPressureOut)*RHOutside*100/700000);

		let q_net = _calc.q_net(deltaTemp, tempEffConstant, Q_stack );
		let indoorDensity = 101325/(287 * insideTemp);

		let q_latent = Q_stack * (absoluteHumidityOut - absoluteHumidityIn)*indoorDensity*_get('qLatentConstant');
		let totalHeat = q_latent + q_net;
		let q_net_saved = (zeroWindEfficiency/100) * _get('coolerFreezerCorrectionFactor') * totalHeat;


		return q_net_saved * utilityCostPerYear;
	};

	_calc.revenuePerYear = (data, series) => {

		const doorArea = data['door']['width'] * data['door']['height'];

		let airCurtainRevenuePerYear = 0;

		data['applications'].forEach((_application) => {

			//clean up this nonsense
			let _tempValue = _application === 'heatRetention' ? data[_application]['insideTemp'] : data[_application]['outsideTemp'];
			let _tempEffConstant = _get(_application, 'tempEff');
			let _weeksUsedPerYear = data["operation"]['weeksUsedPerYear'][_application];
			let _utilityCostPerYear = data['operation']['hoursPerDay'] * data['operation']['daysPerWeek'] * _weeksUsedPerYear * (_application === 'heatRetention' ? data['heatingCost'] : data['electricityCost']);

			let _deltaTemp = data[_application]['insideTemp'] - data[_application]['outsideTemp'];
			let _Q_stack = _calc.Q_stack(data['door']['height'], doorArea, _tempValue, _deltaTemp);

			//change to a switch statement
			if(data['applications'].indexOf('heatRetention') > -1) {
				airCurtainRevenuePerYear += _calc.retentionSavingsPerYear(series, doorArea, _tempEffConstant, _deltaTemp, _Q_stack, data.windSpeedAverage, data.percentageOfWindPerDay, _utilityCostPerYear );
			}

			if(data['applications'].indexOf('ACRetention') > -1) {
				airCurtainRevenuePerYear += _calc.retentionSavingsPerYear(series, doorArea, _tempEffConstant, _deltaTemp, _Q_stack, data.windSpeedAverage, data.percentageOfWindPerDay, _utilityCostPerYear );
			}

			if(data['applications'].indexOf('cooler') > -1) {
				airCurtainRevenuePerYear += _calc.coolerFreezerSavingsPerYear(series['zeroWindEfficiency'], _Q_stack, data.insideTemp, data.outsideTemp, _tempEffConstant, _deltaTemp, _utilityCostPerYear);
			}

			if(data['applications'].indexOf('freezer') > -1) {
				airCurtainRevenuePerYear += _calc.coolerFreezerSavingsPerYear(series['zeroWindEfficiency'], _Q_stack, data.insideTemp, data.outsideTemp, _tempEffConstant, _deltaTemp, _utilityCostPerYear);
			}

		});

		return airCurtainRevenuePerYear;
	}

	return {

		ROI: (data, series, airCurtainCostPerYear, airCurtainTotalCost) => {

			let airCurtainRevenuePerYear = _calc.revenuePerYear(data, series);

			let airCurtainProfitPerYear = airCurtainRevenuePerYear - airCurtainCostPerYear;

			return airCurtainProfitPerYear <= 0 ? "N/A" : airCurtainTotalCost / airCurtainProfitPerYear;
		},

		costPerYear: (applications, operationData, electricityCostPerYear, horsepower) => {
			let _hoursUsedPerYear = 0;

			applications.forEach((_application) => {
				_hoursUsedPerYear += operationData['hoursPerDay'] * operationData['daysPerWeek'] * operationData['weeksUsedPerYear'][_application];
				console.log(_hoursUsedPerYear);
			});

			console.log( _hoursUsedPerYear);
			console.log( electricityCostPerYear);
			console.log( horsepower);

			return _hoursUsedPerYear * electricityCostPerYear * horsepower;
		},

		costToPurchaseAirCurtain: (series) => series.purchaseCost + series.installationCost
	}
})(_initialData);
