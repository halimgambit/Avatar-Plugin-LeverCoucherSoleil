'use strict';

// Ce module vérifie prépare l'objet data envoyé au plugin

Object.defineProperty(exports, "__esModule", {
  value: true
});

let _helpers = require('../../node_modules/ava-ia/lib/helpers');

// Ignor� une fois dans TERM
var TERM = ['lever', 'coucher', 'soleil', 'le', 'la', 'du', 'de', 'du', 'ville', 'a', 'à', 's\'il', 'te', 'pla�t', 'plait'];
// Toujours ignor� dans NOTERM
var NOTERM = ['�', 'la', 'ce', 'que', 'qu\'est-ce', 'qui', 'recette', 'savoir', 'pour', 'c\'est', 'est', 's\'il', 'te', 'pla�t', 'plait'];
// Non ignor� si un term est d�j� pris, ex: la d�fintion de la revue du cin�ma
var IGNORETERM = ['du', 'de'];

exports.default = function (state) {
	
	return new Promise(function (resolve, reject) {

		var TAKEN = [];
        for (var i in TERM) {
            TAKEN.push(0);
        }

        var sentence = '';
        var indexMarmiton, pos, take;
        var terms = state.rawSentence.split(' ');
        terms.map(function (term, index) {

            if (!indexMarmiton && term.toLowerCase() === 'marmiton') indexMarmiton = true;

            if (indexMarmiton) {
                take = false;
                pos = _.indexOf(TERM, term.toLowerCase());
                if (pos != -1) {
                    if (TAKEN[pos] == 0) {
                        if (sentence && sentence.length > 0 && _.indexOf(IGNORETERM, term.toLowerCase()) != -1) {
                            take = true;
                        } else {
                            TAKEN[pos] = 1;
                        }
                    } else {
                        if (_.indexOf(NOTERM, term.toLowerCase()) == -1)
                            take = true;
                    }
                } else {
                    take = true;
                }
                if (take) {
                    sentence += term;
                    if (terms[index + 1]) sentence += ' ';
                }
            }
        });

        // test si on a r�cup�r� quelque chose
        if (sentence) {
            sentence = sentence.replace('l\'', '');
            sentence = sentence.sansAccent();
            sentence = sentence.replace(sentence[0], sentence[0].toUpperCase());

		}


		
		for (var rule in Config.modules.LeverCoucherSoleil.rules) {
			var match = (0, _helpers.syntax)(state.sentence, Config.modules.LeverCoucherSoleil.rules[rule]); 
			if (match) break;
		}
		
		// Recherche si une pièce est dans la phrase.
		let room = Avatar.ia.clientFromRule (state.rawSentence);
		
		setTimeout(function(){ 
			if (state.debug) info('Action LeverCoucherSoleil');
			
			state.action = {
				module: 'LeverCoucherSoleil',
				command: rule,
				room: room,
				sentence: state.sentence,
				rawSentence: state.rawSentence
			};
			resolve(state);
		}, 500);	
		
	});
};

String.prototype.sansAccent = function () {
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    var noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

    var str = this;
    for (var i = 0; i < accent.length; i++) {
        str = str.replace(accent[i], noaccent[i]);
    }
    return str;
};

