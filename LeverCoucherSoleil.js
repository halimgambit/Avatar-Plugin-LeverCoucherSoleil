exports.action = function(data, callback){


	let tblCommand = {
	
		leverSoleil : function() {leverCoucher("lever", data, client);
					},					
		coucherSoleil : function() {leverCoucher("coucher", data, client);
					}					
	};
	
	function leverCoucher (villeLC, data, client) {

		async function appel () {
			const ville = await fetch('http://ip-api.com/json/')
			.then(response => response.json())
			.then(result => result.city);

			const cheerio = require("cheerio");
			fetch('https://time.is/'+ville.toLowerCase())
			.then(response => {
				if (response.status !== 200) {
					throw new Error(`La connexion à échoué`);
				  }
				return response.text();
			})
			.then((body) => {
				let $ = cheerio.load(body);
				if (villeLC=== "lever") {
				let leverVille = $('#sunrise_sunset > ul > li:nth-child(1)').text();
					Avatar.speak(`à ${ville.toLowerCase()} ${" "} ${leverVille}`, data.client, () => {
						Avatar.Speech.end(data.client);
					});
				}
				if (villeLC === "coucher") {
				let coucherVille = $('#sunrise_sunset > ul > li:nth-child(2)').text();
					Avatar.speak(`à ${ville.toLowerCase()} ${" "} ${coucherVille}`, data.client, () => {
						Avatar.Speech.end(data.client);
					});
				}
				})
			.catch (error => {
				 Avatar.speak(`Je n'arrive pas a accédé au site ${error}`, data.client, () => {
				Avatar.Speech.end(data.client);
				})
			});

	}
		appel();

	}

	let client = setClient(data);
	info("LeverCoucherSoleil:", data.action.command, "From:", data.client, "To:", client);
	tblCommand[data.action.command]();
	callback();
}
	
function setClient (data) {
	let client = data.client;
	if (data.action.room)
	client = (data.action.room != 'current') ? data.action.room : (Avatar.currentRoom) ? Avatar.currentRoom : Config.default.client;
	if (data.action.setRoom)
	client = data.action.setRoom;
	return client;
}