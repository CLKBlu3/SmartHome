function mqttStartGetInfoSensors(houseid,ip){
    let client = mqtt.connect('wss://'+ip+':8443',{
        rejectUnauthorized: false,
        username: 'client',
        password: houseid
    });
    client.on('connect', function(){
       client.subscribe('data/sensors', function(error){
           if(error) alert(error.message);
       });

       client.on('message', function(topic,message){
           console.log('topic -> ' + topic + ' message -> ' + message);
           //LOAD SENSOR
           loadSensorsMqtt(JSON.parse(message));

       })
    });
}


function loadSensorsMqtt(sensorsData,dataHome){
    sensorsData.forEach(function(item){
        let aux = FusionCharts("fusion-sensor-gauge-"+item.pin);
        if(aux !== undefined){
            aux.feedData("&value="+item.value);
            return;
        }
        switch (item.type) {
            case "Thermometer":
                generateTemperatureChart(item,dataHome,item.value);
                break;
            case "Light":
                generateLightChart(item,dataHome,item.value);
                break;

            case "Sensor":
                generateSensorChart(item,dataHome,item.value);
                break;
        }
    });
}