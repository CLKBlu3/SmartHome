function generateLightChart(sensorData, dataHome,val) {
    $('#sensors-container').append("<div id='sensor-gauge-"+sensorData.pin+"'></div>");
    FusionCharts.ready(function(){
        var chartObj = new FusionCharts({
                type: 'hlineargauge',
                renderAt: 'sensor-gauge-'+sensorData.pin,
                id: 'fusion-sensor-gauge-'+sensorData.pin,
                width: '400',
                height: '190',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "theme": "fusion",
                        "caption": "Light",
                        "subcaption": sensorData.pin,
                        "lowerLimit": "0",
                        "upperLimit": "100",
                        "numberSuffix": "%",
                        "chartBottomMargin": "40",
                        "valueFontSize": "11",
                        "valueFontBold": "0"
                    },
                    "colorRange": {
                        "color": [{
                            "minValue": "0",
                            "maxValue": "50",
                            "label": "Night",
                            "code": "#2196f3"
                        }, {
                            "minValue": "50",
                            "maxValue": "100",
                            "label": "Day",
                            "code": "#ffeb3b"
                        }]
                    },
                    "pointers": {
                        "pointer": [{
                            "value": val
                        }]
                    }
                }
            }
        );
        chartObj.render();
    });
}