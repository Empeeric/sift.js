var sift = require('../'),
_ = require('underscore'),
vows = require('vows'),
assert = require('assert');


vows.describe('Sifter').addBatch({
	
	'An array': {
		
		'with simple strings': {

			topic: ['craig','john','jake','joe', null],


			'has a sifted $in count of 3': function(topic) {
				assert.isTrue(sift({$in:['craig','john','joe']}, topic).length == 3);

			},

			'has a sifted $nin count of 2': function(topic) {
				assert.isTrue(sift({$nin:['craig','john','joe']}, topic).length == 2);
			},

			'has a sifted $exists count of 4': function(topic) {
				assert.isTrue(sift({$exists:true}, topic).length == 4);
			},

			'has a sifted $and count of 1': function(topic) {
				assert.isTrue(sift({$and:['craig']}, topic).length == 1);
			},

			'has a sifted $ne count of 4': function(topic) {
				assert.isTrue(sift({$ne:null}, topic).length == 4);
			},

			'has a sifted $or count of 5': function(topic) {
				assert.isTrue(sift({$or:topic}, topic).length == 5);
			},

			'has a sifted $size of 2': function(topic) {
				assert.isTrue(sift({$size:4}, topic).length == 2);
			}
		},

		'with simple numbers': {
			topic: [0, 100, 200, 300, 400, 500, 600, 700, 800],

			'has sifted < 200 count of 2': function(topic) {
				assert.isTrue(sift({$lt:200}, topic).length == 2);
			},

			'has sifted <= 200 count of 3': function(topic) {
				assert.isTrue(sift({$lte:200}, topic).length == 3);
			},
			

			'has sifted > 200 count of 6': function(topic) {
				assert.isTrue(sift({$gt:200}, topic).length == 6);
			},


			'has sifted >= 200 count of 7': function(topic) {
				assert.isTrue(sift({$gte:200}, topic).length == 7);
			},

			'has a sifted modulus 3 count of 3': function(topic) {
				assert.isTrue(sift({$mod:[3,0]}, topic).length == 3);
			},


		},

		'with simple dates': {
			topic: [new Date(), new Date(1325314860361), new Date(Date.now()+1000), , new Date(Date.now()+2000)],

			'has $eq date count of 1': function(topic) {

				assert.isTrue(sift(new Date(1325314860361), topic).length == 1);
			},

			'has $gt date count of 2': function(topic) {
				assert.isTrue(sift({ $gt: Date.now() }, topic).length == 2);
			}
		},

		'with complex objects': {
			
			topic: [{
				name: 'craig',
				age: 90001,
				address: {
					city: 'Minneapolis',
					state: 'MN',
					phone: '9999999999'
				},
				hobbies: [{
					name: 'programming',
					description: 'some desc'	
				},
				{
					name: 'cooking'
				},
				{
					name: 'photography',
					places: ['haiti','brazil','costa rica']
				},
				{
					name: 'backpacking'
				}]
			},
			{
				name: 'tim',
				age: 90001,
				address: {
					city: 'St. Paul',
					state: 'MN',
					phone: '765765756765'
				},
				hobbies: [{
					name: 'biking',
					description: 'some desc'	
				},
				{
					name: 'DJ'
				},
				{
					name: 'photography',
					places: ['costa rica']
				}]
			}],


			'has sifted through photography in brazil count of 1': function(topic) {
				var sifted = sift({
					
					hobbies: {
						name: 'photography',
						places: {$in: ['brazil'] }
					}
				}, topic);

				assert.isTrue(sifted.length == 1);

			},

			'has sifted through photography in brazil, haiti, and costa rica count of 1': function(topic) {
				var sifted = sift({
					
					hobbies: {
						name: 'photography',
						places: {$all: ['brazil','haiti','costa rica'] }
					}
				}, topic);

				assert.isTrue(sifted.length == 1);

			},

			'has sifted to complex count of 2': function(topic) {
			
				var sifted = sift({
					
					hobbies: {
						name: 'photography',
						places: {$in: ['costa rica']}
					},

					address: {
						state: 'MN',
						phone: {$exists: true}
					}
				}, topic);


				assert.isTrue(sifted.length == 2);
			},

			'has sifted to complex count of 0': function(topic) {
			
				var sifted = sift({
					
					hobbies: {
						name: 'photos',
						places: {$in: ['costa rica']}
					}
				}, topic);


				assert.isTrue(sifted.length == 0);
			}
		}
	}
}).run();