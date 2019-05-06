function generateActuatorSwitch(item,dataHome){ //generates el switch del actuador, devuelve el id para poder bindear con la base de datos
    let id = "actuator-switch-"+item.pin;
    let actuatorSwitch = $("<div id='"+ id +"' class='switch'><label>Off<input type='checkbox'><span class='lever'></span>On</label></div>");
    $('#actuadors-container').append(actuatorSwitch);
    actuatorSwitch.on("click", function(event){
        event.preventDefault();
       changeStateActuator(!$(this).find("input[type='checkbox']").is(":checked"),dataHome,item);
    });
    return id;
}