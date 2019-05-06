function generateLightChart(sensorData, dataHome) {
    $('#sensors-container').append("<div id='sensor-gauge-"+sensorData.pin+"'></div>");
    FusionCharts.ready(function(){
        var chartObj = new FusionCharts({
                type: 'hlineargauge',
                renderAt: 'sensor-gauge-'+sensorData.pin,
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
                            "value": "0"
                        }]
                    }
                },
                events:{
                    "rendered": function(evtObj, argObj) {
                        const funct = function(){
                            getSensorValue(sensorData, dataHome).then(function (value) {
                                evtObj.sender.feedData("&value=" + value*100);
                            });
                        };
                        funct();
                        setInterval(funct,10000);
                    },
                    "disposed": function(evtObj, argObj) {
                        clearInterval(evtObj.sender.intervalVar);
                    }
                }
            }
        );

        chartObj.render();
    });
}