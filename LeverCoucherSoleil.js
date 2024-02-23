exports.action = function(data, callback){
	let client = setClient(data);
	info("LeverCoucherSoleil from:", data.client, "To:", client);
	LeverCoucherSoleil (data, client);
	callback();
}


function LeverCoucherSoleil (data, client) {

const rule = data.action.rawSentence;
const soleilRegex = /(le lever du soleil|le lever de soleil|lever du soleil|lever de soleil|le coucher du soleil|le coucher de soleil|couché du soleil|coucher du soleil|coucher de soleil)/i;
const match = rule.match(soleilRegex);
const soleil = match ? match[0] : null;

	async function appel () {
		let ville = await fetch('http://ip-api.com/json/')
		.then(response => response.json())
		.then(result => result.city);

		fetch('https://time.is/'+ville.toLowerCase())
		.then(response => {
			if (response.status !== 200) {
				throw new Error(`HTTP erreur! Code erreur: ${response.status}`);
			  }
			return response.text();
		})
		.then((html) => {
			let cheerio = require("cheerio");
			let $ = cheerio.load(html);
			if ( soleil === "le lever du soleil"|| soleil === "le lever de soleil" || soleil === "lever du soleil"|| soleil === "lever de soleil") {
			let leverVille = $('#sunrise_sunset > ul > li:nth-child(1)').text();
				Avatar.speak(`à ${ville.toLowerCase()} le ${leverVille}`, data.client, () => {
					Avatar.Speech.end(data.client);
				});
			}
			if (soleil === "le coucher du soleil" || soleil === "le coucher de soleil" || soleil === "couché du soleil" || soleil === "coucher du soleil" ||soleil === "coucher de soleil") {
			let coucherVille = $('#sunrise_sunset > ul > li:nth-child(2)').text();
				Avatar.speak(`à ${ville.toLowerCase()} le ${coucherVille}`, data.client, () => {
					Avatar.Speech.end(data.client);
				});
			}
			})
		.catch (error => {
			 Avatar.speak(`Je n'arrive pas a accédé au site, ${error.message}`, data.client, () => {
			Avatar.Speech.end(data.client);
			})
		});

}
	appel();
	
}


function setClient (data) {
	let client = data.client;
	if (data.action.room)
	client = (data.action.room != 'current') ? data.action.room : (Avatar.currentRoom) ? Avatar.currentRoom : Config.default.client;
	if (data.action.setRoom)
	client = data.action.setRoom;
	return client;
}