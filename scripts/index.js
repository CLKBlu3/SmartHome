const homeList = document.querySelector('.data');

const setupData = (data) =>{
	let html = '';
	data.forEach(doc =>{
		const home = doc.data().Cases;
		console.log(home.length);
		var li = ``;

		for(var i = 0; i < home.length; ++i){
			database.collection('cases').where('cid', '==', home[i])
			.get()
			.then(function(casaQuery) {
				casaQuery.forEach(casa =>{
					var data = casa.data().admin;
					console.log(data);
					li =`
						<li>
							<div class="collapsible-header grey lighten-4">${home}</div>
							<div class="collapsible-body white">${data}</div>
						</li>
					`;
					html += li;
				})
			});
		}	
		
	});

	homeList.innerHTML = html;
};
// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});