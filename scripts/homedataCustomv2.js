$(document).ready(function(){
    $('.tabs').tabs();
    $('select').formSelect();
    auth.onAuthStateChanged(function(user) {
        if (user) {
            checkUserHasAccess(user,getUrlVar('cid')).catch(function(error){
               alert(error);
            });
            loadHomeInfo(getUrlVar('cid')).then(function(dataHome){
                declareListeners(dataHome);
                /*loadSensors(dataHome.data.devices.filter(function(item){
                    return item.type === "sensor";
                }),dataHome);*/
                loadActuators(dataHome.data.devices.filter(function(item){
                    return item.type === "actuator";
                }),dataHome);
                mqttStartGetInfoSensors(getUrlVar('cid'),dataHome.data.ip);
            }).catch(function(err){
                alert(err.message)
            });
        } else {
            // No user is signed in.
            alert('user not logged in');
        }
    });
});

function loadActuators(actuatorsData,dataHome){
    actuatorsData.forEach(function(item){
        //set listener db
        let id = generateActuatorSwitch(item,dataHome);
        db.collection('cases').doc(dataHome.data.cid).collection('devices').doc(item.pin).onSnapshot(function(doc){
            $("#"+id + " input").prop("checked", doc.data().state === 1);
        });
    })
}

function loadSensors(sensorsData,dataHome){
    sensorsData.forEach(function(item){
       switch (item.class) {
           case "Thermometer":
               generateTemperatureChart(item,dataHome);
               break;
           case "Light":
               generateLightChart(item,dataHome);
               break;

           case "Sensor":
               generateSensorChart(item,dataHome);
               break;
       }
    });
}


function declareListeners(dataHome){
    $('#addActuadorForm').on('submit', function(e){
       e.preventDefault();
       registerActuador(dataHome,e.target);
    });

    $('#addSensorForm').on('submit', function(e){
        e.preventDefault();
        registerSensor(dataHome,e.target);
    });

    $('#remElementForm').on('submit', function (e) {
        e.preventDefault();
        removeElement(dataHome, e.target);
    })
}

function registerSensor(dataHome,target){
    //ajax query
    let loader = $('#addSensor').find('div.preloader-wrapper');
    loader.show();
    let formData = new FormData($(target).get(0));
    auth.currentUser.getIdToken().then(function(idToken){
        $.ajax({
            url: urlIPDomainBuilder(dataHome.data.ip,3000)+'/register/sensor'+genAccessTokenUrl(idToken),
            method: 'POST',
            context: target,
            timeout: 5000,
            data: {
               type: formData.get('Type'),
               pin: formData.get('Pin'),
               controller: formData.get('Controller')
            },
            error: function(jqXHR){
                alert('Cannot connect to the house:'+ jqXHR.statusText + ' ' + jqXHR.responseText);
                loader.hide();
            },
            success: function(data,code,jqXHR){
                loader.hide();
                $('ul.tabs a.sensors').get(0).click();
            }
        })
    })
}

function registerActuador(dataHome,target) {
    let loader = $('#addActuador').find('div.preloader-wrapper');
    loader.show();
    let formData = new FormData($(target).get(0));
    auth.currentUser.getIdToken().then(function(idToken){
        $.ajax({
            url: urlIPDomainBuilder(dataHome.data.ip,3000)+'/register/actuator'+genAccessTokenUrl(idToken),
            method: 'POST',
            context: target,
            timeout: 5000,
            data: {
                pin: formData.get('pin')
            },
            error: function(jqXHR){
                alert('Cannot connect to the house:'+ jqXHR.statusText + ' ' + jqXHR.responseText);
                loader.hide();
            },
            success: function(data,code,jqXHR){
                loader.hide();
                $('ul.tabs a.actuadors').get(1).click();
            }
        })
    })
}

function removeElement(dataHome, target){
    let formData = new FormData($(target).get(0));
    let loader = $('#remElement').find('div.preloader-wrapper');
    loader.show();
    auth.currentUser.getIdToken().then(function(idToken){
        let pin = formData.get('pin');
        $.ajax({
            url: urlIPDomainBuilder(dataHome.data.ip,3000)+'/' + pin + '/delete'+genAccessTokenUrl(idToken),
            method: 'GET',
            timeout: 5000,
            error: function(jqXHR){
                alert('Cannot connect to the house:'+ jqXHR.statusText + ' ' + jqXHR.responseText);
                loader.hide();
            },
            success: function(data,code,jqXHR){
                loader.hide();
                $('ul.tabs a.modElements').get(0).click();
            }
        })
    })
}

function genAccessTokenUrl(idToken){
    return '?token='+idToken;
}

function getUrlVar(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i=0;i<vars.length;i++) {
        let pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

const checkUserHasAccess = function(user,cid){
    return new Promise((resolve, reject) => {
        if(user != null){
            let userfunct = functions.httpsCallable('getInfoUser');
            userfunct().then(function(dades){
                if(!dades.data.Cases.includes(cid))reject('user has not access to this house');
                resolve();
            }).catch(function(err){
                reject(err.message);
            })
        }else reject('not logged in');
    });
}

const loadHomeInfo = function(cid){
        return new Promise((resolve, reject) => {
            let homeData = functions.httpsCallable('getInfoHome');
            homeData(cid).then(function(dhome){
                resolve(dhome);//fer mes coses?
            }).catch(function(err){
                reject(err.message)
            });
        });
};

function urlIPDomainBuilder(ip,port){
    return 'https://'+ip+':'+port;
}

function getSensorValue(device,dataHome){ //usado por temperature.js.... para pillar el valor del sensor
    return new Promise((resolve, reject) => {
        auth.currentUser.getIdToken().then(function(idToken){
            $.ajax({
                url: urlIPDomainBuilder(dataHome.data.ip,3000)+'/'+device.class+'/'+device.pin+'/read'+genAccessTokenUrl(idToken),
                method: 'GET',
                timeout: 5000,
                error: function(jqXHR){
                    //alert('Cannot get device info: '+ jqXHR.statusText + ' ' + jqXHR.responseText + ' pin: ' + device.pin);
                    reject();
                },
                success: function(data,code,jqXHR){
                    resolve(data);
                }
            })
        })
    });
}

function changeStateActuator(newState,dataHome,device){
    auth.currentUser.getIdToken().then(function(idToken){
        let url = urlIPDomainBuilder(dataHome.data.ip,3000)+'/'+device.pin;
        if(newState){
            url += '/high'
        }else url += '/low';
        url += genAccessTokenUrl(idToken);
        $.ajax({
            url: url,
            method: 'GET',
            timeout: 5000,
            error: function(jqXHR){
                alert('Error ' + jqXHR.responseText);
            }
        });
    });
}