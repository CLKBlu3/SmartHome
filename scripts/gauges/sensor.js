function generateSensorChart(sensorData, dataHome) {
    $('#sensors-container').append("<div id='sensor-gauge-"+sensorData.pin+"'></div>");
    FusionCharts.ready(function(){
        var chartObj = new FusionCharts({
            type: 'angulargauge',
            renderAt: 'sensor-gauge-'+sensorData.pin,
            width: '450',
            height: '300',
            dataFormat: 'json',
            dataSource: {
                "chart": {
                    "caption": "Sensor",
                    "subcaption": sensorData.pin,
                    "lowerLimit": "0",
                    "upperLimit": "100",
                    "theme": "fusion"
                },
                "colorRange": {
                    "color": [{
                        "minValue": "0",
                        "maxValue": "50",
                        "code": "#e44a00"
                    }, {
                        "minValue": "50",
                        "maxValue": "75",
                        "code": "#f8bd19"
                    }, {
                        "minValue": "75",
                        "maxValue": "100",
                        "code": "#6baa01"
                    }]
                },
                "dials": {
                    "dial": [{
                        "value": "0"
                    }]
                }
            },
            events: {
                "rendered": function(evtObj, argObj) {
                    const funct = function(){
                        getSensorValue(sensorData, dataHome).then(function (value) {
                            evtObj.sender.feedData("&value=" + (value/1023)*100);
                        });
                    };
                    funct();
                    evtObj.sender.intervalVar = setInterval(funct,10000);
                },
                "disposed": function(evtObj, argObj) {
                    clearInterval(evtObj.sender.intervalVar);
                }
            }
        });
        chartObj.render();
    });
}