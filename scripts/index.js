const homeList = $('.data'); //DIV with the list of elements of the Homes
let uidToUser = functions.httpsCallable('uidToUser');
let homeData = functions.httpsCallable('getInfoHome');

const setupData = (data) =>{
	var i;
	var li= ``;
	var button = `<button class="btn yellow darken-2 z-depth-0" data-toggle="modal" onClick="$('#modal-addhome').toggle()">Add new Home</button>`;
	homeList.html(li);
	if(data.Cases.length == 0){
		homeList.html(li).append(button);
	}
	else {
		for(i = 0; i < data.Cases.length; ++i){
			homeData(data.Cases[i]).then(async function (dHome) {
				li += `<li>`
				li += `<div id=${dHome.data.cid} class=\"collapsible-header grey lighten-4\">${dHome.data.cid}</div>`;

				let admin = await uidToUser(dHome.data.admin);
				li += `<div class=\"collapsible-body white\"><b>Admin: </b>${admin.data.displayName} </div>`;

				if(dHome.data.admin === data.uid){
					li += `<div class='collapsible-body white'>` +
						`<b>Num Users: </b>${dHome.data.users.length}  <p style=\"text-align:right\" style=\"vertical-align:top\"></p></div>`;

					li += `<div class='collapsible-body white'><b>Users </b><br><ul id="userslist"></ul>`;
					li += `<form id='addUserForm' class='row' style="margin-top: 25px">
							<input type='text' name='uid' class='form-control col s7' placeholder='User email'/><button type='submit' class='btn yellow darken-2' style="float: right; ">Add user</button>
						</form>
						</div>`;
				}
				else li += `<div class=\"collapsible-body white\"><b>Num Users: </b>${dHome.data.users.length} </div>`;

				li += `<div class=\"collapsible-body white\"><b>Public IP: </b>${dHome.data.ip} </div>`;
				li += `</li>`;
				let houseItem = $(li);
				homeList.append(houseItem);

				/* Load users */
				dHome.data.users.forEach(function (userUid) {
					uidToUser(userUid).then(function (user) {
						$(houseItem).find('ul').append(`<li style="margin-top: 10px" id="${userUid}">${user.data.displayName}<button class="btn red darken-1" style="float: right; margin-top: -10px">Delete</button></li>`);
					});
				});

				let button = `<button class="btn yellow darken-2" data-toggle="modal" onClick="$('#modal-addhome').show()">Add new Home</button>`;
				homeList.append(button);
				//homeList.html(li).append(button);
			});
		}
	}
};

//jquery functions
$(document).on('click', '#userslist li button', function(){
    var itemToDelete = $(this);
    var id = itemToDelete.parent().attr('id');
    var houseid;
    if(confirm('Segur que vols eliminar el usuari?')){
        console.log('eliminando..');
        let deleteUserFunction = functions.httpsCallable('deleteUserFromHouse');
        //get info house
        var homecid = itemToDelete.parents('.active').children('.homeinfo').attr('id');
        deleteUserFunction({houseid: homecid,userid: id}).then(function(){
            //delete row
            itemToDelete.parent().remove();
        }).catch(function(error){
            alert("no es pot eliminar l'usuari");
        });
    }
});

const clearData = ()=>{
	var li = `
			<span class="collapsible-header grey lighten-4" style="text-align: center;"><b>PLEASE LOGIN OR SIGN UP TO SEE YOUR DATA </b></span>
	`;
	homeList.html(li);
	//user logged out--> hide log out and show Login/sign up
	hideOrShowElementsByClass('.logged-in', '.logged-out');
}

//PAR 1: classe a amagar, PAR2: classe a mostrar
const hideOrShowElementsByClass = (hideClass, showClass) =>{
	$(hideClass).toggle();
	$(showClass).show();
}

const accInfo = $('.accinfo');
const fillAccountDetails = (userData, user) => {
	var li;
	li = `
		<li>
			<div class="collapsible-header grey lighten-4">${user.displayName}</div>
			<div class="collapsible-body white"><b>Name: </b>${user.displayName} </div>
			<div class="collapsible-body white"><b>Email: </b>${user.email} </div>
			<div class="collapsible-body white"><b>Number of Homes: </b>${userData.Cases.length} </div>
		</li>
	`;
	accInfo.html(li);
};

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = $('.modal');
  M.Modal.init(modals);

  var items = $('.collapsible');
  M.Collapsible.init(items);

});