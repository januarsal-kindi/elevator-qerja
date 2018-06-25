/*
 * Available information:
 * 1. Request queue
 * Simulator.get_instance().get_requests()
 * Array of integers representing floors where there are people calling the elevator
 * eg: [7,3,2] // There are 3 people waiting for the elevator at floor 7,3, and 2, in that order
 * 
 * 2. Elevator object
 * To get all elevators, Simulator.get_instance().get_building().get_elevator_system().get_elevators()
 * Array of Elevator objects.
 * - Current floor
 * elevator.at_floor()
 * Returns undefined if it is moving and returns the floor if it is waiting.
 * - Destination floor
 * elevator.get_destination_floor()
 * The floor the elevator is moving toward.
 * - Position
 * elevator.get_position()
 * Position of the elevator in y-axis. Not necessarily an integer.
 * - Elevator people
 * elevator.get_people()
 * Array of people inside the elevator
 * 
 * 3. Person object
 * - Floor
 * person.get_floor()
 * - Destination
 * person.get_destination_floor()
 * - Get time waiting for an elevator
 * person.get_wait_time_out_elevator()
 * - Get time waiting in an elevator
 * person.get_wait_time_in_elevator()
 * 
 * 4. Time counter
 * Simulator.get_instance().get_time_counter()
 * An integer increasing by 1 on every simulation iteration
 * 
 * 5. Building
 * Simulator.get_instance().get_building()
 * - Number of floors
 * building.get_num_floors()
 */

Elevator.prototype.decide = function() {
    var simulator = Simulator.get_instance();
    var building = simulator.get_building();
    var num_floors = building.get_num_floors();
    var elevators = Simulator.get_instance().get_building().get_elevator_system().get_elevators();
    var time_counter = simulator.get_time_counter();
    var requests = simulator.get_requests();
    
    var elevator = this;
    var people = this.get_people();
    var person = people.length > 0 ? people[0] : undefined;
   
    if(elevator) {
        elevator.at_floor();
        elevator.get_destination_floor();
        elevator.get_position();
    }
    
    if(person) {
        person.get_floor();
    }
    
    var floorTarget = [];
    
    
    for (var i = 0;i<people.length;i++){

        floorTarget.push(people[i].get_destination_floor());

    }
   
    var elevator_position = this.at_floor();

    for(var i = 0;i < requests.length;i++) {
        var isHandler = false;
        for(var j = 0;j < elevators.length;j++) {
			if (elevators.indexOf(this) != j){
                if(elevators[j].get_destination_floor() == requests[i] ) {
                    isHandler = true;
                    break;
                }
            }
        }
        
        if(!isHandler) {
            floorTarget.push(requests[i]);
        }
    }
    
    if (floorTarget.length == 0){
		return this.commit_decision(num_floors/2);
		        
    }
    
    floorTarget.sort(sortNumber);
    
    function sortNumber(a,b) {
        
		return a - b;
    }
	
    var direction = this.direction;
    
    if (this.direction == null) {
        
		elevators[0].direction = Elevator.DIRECTION_UP;
        for (var i = 0; i < floorTarget.length;i++){
            if (floorTarget[i] >= elevator_position){
                this.direction = Elevator.DIRECTION_UP;
                break;
            }
        }
    }
     
    if (this.direction == Elevator.DIRECTION_UP){
        
		this.current_final_destination = floorTarget[floorTarget.length - 1];
        for (var i = 0; i < floorTarget.length;i++){
            if (floorTarget[i] >= elevator_position){
                return this.commit_decision(floorTarget[i]);
            }
        }
        
        this.direction = Elevator.DIRECTION_DOWN;
        
        this.current_final_destination = floorTarget[0];
        for (var i = floorTarget.length - 1; i > 0;i--){
            if (floorTarget[i] <= elevator_position){
                
				return this.commit_decision(floorTarget[i]);
            }
        }
        
    }
    

    else if (this.direction == Elevator.DIRECTION_DOWN) {
       
		this.current_final_destination = floorTarget[0];
        for (var i = floorTarget.length - 1; i > 0;i--){
            if (floorTarget[i] <= elevator_position){
                
				return this.commit_decision(floorTarget[i]);
				
            }
        }
        
        this.direction = Elevator.DIRECTION_UP;
        this.current_final_destination = floorTarget[floorTarget.length - 1];
        for (var i = 0; i < floorTarget.length;i++){
            if (floorTarget[i] >= elevator_position){
                
				return this.commit_decision(floorTarget[i]);
				
            }
        }
    }

    return this.commit_decision(Math.floor(num_floors/2));
	
};