$(document).ready(function(){
    $('.tabs').tabs();
    $('select').formSelect();
    auth.onAuthStateChanged(function(user) {
        if (user) {
            checkUserHasAccess(user,getUrlVar('cid')).catch(function(error){
               alert(error);
            });
            loadHomeInfo(getUrlVar('cid')).then(function(dataHome){
                console.log(dataHome);
            }).catch(function(err){
                alert(err.message)
            });
        } else {
            // No user is signed in.
            alert('user not logged in');
        }
    });


});

function registerSensor(){

}

function registerActuador() {
    
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
                console.log(dades.data);
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