
// eventsArray holds the data
let eventsArray = [
	{
		id: 0,
		title: "ICM Mystery Dinner Theatre – Game of Thorns",	
		description: "Join ICMT in this hilarious send up of HBO's popular series Game Of Thrones! Whether you are a fan of the popular HBO series or not, you are sure to enjoy this fun whodunit featuring some wacky new characters and a few familiar ICMT characters! :) ",
		day: new Date('September 22, 2017 19:00:00').toString().substr(4, 7), //Friday, September 22, 2017 7:00:00 PM
		daytime: new Date('September 22, 2017 19:00:00').toString().substr(0, 24),
		link: "https://www.facebook.com/events/1991965204382658/",
	
		levels: [
				{	description: "Senior ticket",
					price: 5
				},
				{	description: "Child ticket",
					price: 10
				},
				{	description: "Adult ticket",
					price: 15
				}
			],
			
	},
	
		{
		id: 1,
		title: "Denny Laine (from Paul McCartney & Wings/Moody Blues)",	
		description:"Denny Laine is a multiple Grammy award winning artist and founding member of The Moody Blues and \"Wings\" with Paul McCartney. For Wing's entire career, Denny was McCartney's main collaborator and he's the only person in the world besides John Lennon to have a decade long partnership with Paul. He has also performed with many of the biggest names in classic rock including members of The Beatles, The Who, Led Zeppelin, Cream, ELO, The Zombies, and many more",
		day: new Date('September 23, 2017 18:30:00').toString().substr(4, 7), //Friday, September 23, 2017 6:30:00 PM
		daytime: new Date('September 23, 2017 18:30:00').toString().substr(0, 24),
		link: "https://www.facebook.com/events/524990264559142/",

		levels: [
				{	description: "Child ticket",
					price: 15
				},
				{	description: "Adult ticket",
					price: 20
				}
			],
	}
	];
	

return module.exports = {

	getEvents: function() {
       return eventsArray; 
    },  
    
    
    getEventById: function(id) {
    	return eventsArray[id];
   	},
    
 
    removeEvent: function(id){
    	eventsArray.splice(id, 1);
    },
    
	addEvent: function(id){
    	eventsArray.push(id);
    }

}
    

    

    
    
    
    
    
    
    
    
    
    
    
    
    

