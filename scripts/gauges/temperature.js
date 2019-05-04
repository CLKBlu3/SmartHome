
function generateTemperatureChart(sensorData, dataHome) {
    $('#sensors-container').append("<div id='sensor-gauge-"+sensorData.pin+"'></div>");
    FusionCharts.ready(function () {
        let chartObj = new FusionCharts({
                type: 'thermometer',
                renderAt: 'sensor-gauge-'+sensorData.pin,
                width: '240',
                height: '310',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Temperatura sensor "+sensorData.pin,
                        "lowerLimit": "-10",
                        "upperLimit": "40",

                        "decimals": "1",
                        "numberSuffix": "°C",
                        "showhovereffect": "1",
                        "thmFillColor": "#008ee4",
                        "showGaugeBorder": "1",
                        "gaugeBorderColor": "#008ee4",
                        "gaugeBorderThickness": "2",
                        "gaugeBorderAlpha": "30",
                        "thmOriginX": "100",
                        "chartBottomMargin": "20",
                        "valueFontColor": "#000000",
                        "theme": "fusion"
                    },
                    "value": "-6",
                    //All annotations are grouped under this element
                    "annotations": {
                        "showbelow": "0",
                        "groups": [{
                            //Each group needs a unique ID
                            "id": "indicator",
                            "items": [
                                //Showing Annotation
                                {
                                    "id": "background",
                                    //Rectangle item
                                    "type": "rectangle",
                                    "alpha": "50",
                                    "fillColor": "#AABBCC",
                                    "x": "$gaugeEndX-40",
                                    "tox": "$gaugeEndX",
                                    "y": "$gaugeEndY+54",
                                    "toy": "$gaugeEndY+72"
                                }
                            ]
                        }]

                    },
                },
                "events": {
                    "rendered": function (evt, arg) {
                        const funct = function () {
                            getSensorValue(sensorData, dataHome).then(function (value) {
                                evt.sender.feedData("&value=" + value);
                            }).catch(function () {
                                evt.sender.feedData("&value=-1");
                            });
                        };
                        funct();
                        evt.sender.dataUpdate = setInterval(funct, 10000);
                        evt.sender.updateAnnotation = function (evtObj, argObj) {
                            var code,
                                chartObj = evtObj.sender,
                                val = chartObj.getData(),
                                annotations = chartObj.annotations;

                            if (val >= 20) {
                                code = "#00FF00";
                            } else if (val < 5 && val > 22) {
                                code = "#ff9900";
                            } else {
                                code = "#ff0000";
                            }
                            annotations.update("background", {
                                "fillColor": code
                            });
                        };
                    },
                    'renderComplete': function (evt, arg) {
                        evt.sender.updateAnnotation(evt, arg);
                    },
                    'realtimeUpdateComplete': function (evt, arg) {
                        evt.sender.updateAnnotation(evt, arg);
                    },
                    'disposed': function (evt, arg) {
                        clearInterval(evt.sender.dataUpdate);
                    }
                }
            }
        );
        chartObj.render();
    });
};
