import store from '../browser/store';


import { scene } from '../browser/game/main';
const THREE = require('three');
const CANNON = require('./cannon.min.js');

THREE.PlayerControls = function ( camera, player, cannonMesh, raycastReference , id) {
	this.domElement = document;

	this.camera = camera;
	this.player = player;
	this.cannonMesh = cannonMesh;
	this.id = id;
	this.cooldown = Date.now();
	this.scale;
	this.raycastReference = raycastReference;
	var keyState = {};
	
	var scope = this;

	var vector = new THREE.Vector3( 0, 0, - 1 );
	vector.applyQuaternion( camera.quaternion );

	var curCamZoom = 50;
	var curCamHeight = 40;

	var geometry = new THREE.BoxGeometry( 30,3,2 );
    var material = new THREE.MeshPhongMaterial({ 
                                             shading: THREE.FlatShading });
    this.ssmesh = new THREE.Mesh( geometry, material );
    scene.add(this.ssmesh)
this.playerRotation = new THREE.Quaternion();
	this.camera.oldPosition = new THREE.Vector3(0,10000,0);


var cameraReferenceOrientation = new THREE.Quaternion();
var poleDir = new THREE.Vector3(1,0,0);


	this.update = function() { 




		
		scope.scale = store.getState().players[scope.id].scale;


		this.checkKeyStates();



this.camera.oldPosition = this.camera.position.clone();

     var playerPosition = new THREE.Vector3(this.player.position.x, this.player.position.y, this.player.position.z);

     //this.camera.position.copy(playerPosition);
	// this.camera.position.x = this.player.position.x
	// this.camera.position.y = this.player.position.y
	// this.camera.position.z = this.player.position.z + 50;


// transform = transform of position? * transform of local orientation;






	var cameraReferenceOrientation = new THREE.Quaternion();
	var cameraPosition = this.player.position.clone();
	var poleDirection = new THREE.Vector3(1,0,0)

    var localUp = cameraPosition.clone().normalize();


 // no orientation for now, change cameraReforient if necessary
//var referenceForward = new THREE.Vector3(0, 0, 1);
var referenceForward = new THREE.Vector3(0, 0, 1);
referenceForward.applyQuaternion(cameraReferenceOrientation);
console.log(referenceForward)
// var newAxisAngle = new.THREE Quaternion();
var correctionAngle = Math.atan2(referenceForward.x, referenceForward.z)
var cameraPoru = new THREE.Vector3(0,-1,0);
cameraReferenceOrientation.setFromAxisAngle(cameraPoru,correctionAngle);
//console.log("correction angle", correctionAngle)

poleDir.applyAxisAngle(localUp,correctionAngle).normalize(); 
//probably need to incorporate cross product bewteen pole and local up into calc
		 // var localUp = new THREE.Vector3();
		 // localUp = playerPosition.clone().normalize();

		//var poleDir = new THREE.Vector3(1,0,0);// moved up

		var cross = new THREE.Vector3();
		cross.crossVectors(poleDir,localUp);	
		// cross.multiplyScalar(100);
		
		// this.camera.position.add(cross);
var dot = localUp.dot(poleDir);
//console.log(dot)
poleDir.subVectors(poleDir , localUp.clone().multiplyScalar(dot));




// console.log(poleDir);




    var noClue = new THREE.Matrix4();
    noClue.set(	poleDir.x,localUp.x,cross.x,cameraPosition.x,
    			poleDir.y,localUp.y,cross.y,cameraPosition.y,
    			poleDir.z,localUp.z,cross.z,cameraPosition.z,
    			0,0,0,1);

    var bitBetter = new THREE.Matrix4();
    bitBetter.makeRotationFromQuaternion(cameraReferenceOrientation);
    //console.log(bitBetter)

    var oneTwo = new THREE.Matrix4();
    oneTwo.multiplyMatrices(noClue,bitBetter);


    //this.camera.applyMatrix(oneTwo);
   // console.log(this.camera.position)

	 this.camera.matrixAutoUpdate = false;
	this.camera.matrix = noClue;







//this.camera.quaternion.setFromRotationMatrix( m1 );




    //this.camera.position.set(0,0,0)
    //this.camera.updateMatrix();


//this.camera.updateMatrix();
	// this.camera.matrix.setPosition(0,-100,0);

   // this.camera.updateMatrixWorld( true );





	};

	this.checkKeyStates = function () {

		// get quaternion and position to apply impulse
	var playerPosition = new CANNON.Vec3(scope.cannonMesh.position.x, scope.cannonMesh.position.y, scope.cannonMesh.position.z);



	// get unit (directional) vector for position
    var norm = playerPosition.normalize();

    // scale the vector's length to size of ball
   	// var playerNormalToPlanet = playerPosition.scale(scope.scale * 10);

   	// find top point on ball by inverse multiplying position vector with quaternion
   	// var reverseRot = scope.cannonMesh.quaternion.inverse();
   	var localTopPoint = new CANNON.Vec3(0,0,430);


   	// scale by size of ball
   	// var topPoint = reverseRot.vmult(localTopPoint).scale(scope.scale * 10);

   	// topPoint = topPoint.vadd(playerPosition);
   	//topPoint = playerPosition;
   	var topVec = new CANNON.Vec3(0,0,1);

   	var quaternionOnPlanet = new CANNON.Quaternion();
    quaternionOnPlanet.setFromVectors(topVec, playerPosition);

    var newPosition = quaternionOnPlanet.vmult(new CANNON.Vec3(0,0,norm).vadd(new CANNON.Vec3(0,0, scope.scale * 10)));

		this.ssmesh.position.set(newPosition.x, newPosition.z, newPosition.y)


	      var vec = new THREE.Vector3();
            camera.getWorldDirection( vec );
            //console.log(vec, camera.position)
            var quat = new THREE.Quaternion();
            raycastReference.getWorldQuaternion(quat);
        
            var quatInv = new THREE.Quaternion();
            quat.copy(quatInv);
            quatInv.inverse();

            quat.copy(this.ssmesh.quaternion)
            //rotate vector to horizontal plane 

            var horizontalPlaneVec = vec.applyQuaternion(quatInv);
            //console.log("quat", quat.x, quatInv.x, quat.x)
            //console.log("three", vec.x, vec.y, vec.z, horizontalPlaneVec.x, horizontalPlaneVec.y, horizontalPlaneVec.z)
            //remove 3rd dimension
            horizontalPlaneVec.set(horizontalPlaneVec.x,0, horizontalPlaneVec.z);

            // save lateral vectors
            var latVec = new THREE.Vector3(horizontalPlaneVec.z,0,-horizontalPlaneVec.x );

            // rerotate back to original location
            var tangentVec = horizontalPlaneVec.applyQuaternion(quat);
            var tangentLatVec = latVec.applyQuaternion(quat);

            //tangentVec.normalize();

            tangentVec.multiplyScalar(200);
            tangentLatVec.multiplyScalar(200);

            //convert to Cannon
            var tangentVecCannon = new CANNON.Vec3(tangentVec.x, tangentVec.z, tangentVec.y);
            var tangentLatVecCannon = new CANNON.Vec3(tangentLatVec.x, tangentLatVec.z, tangentLatVec.y);

		if (keyState[32]) {
	           // console.log(Date.now() - scope.cooldown)
			if(Date.now() - scope.cooldown > 5000){

		        // spacebar - dash/push

	            this.cannonMesh.applyImpulse(new CANNON.Vec3(vec.x,vec.z,vec.y),newPosition);
	            scope.cooldown = Date.now();
	            //this.cannonMesh.position.y -= 2;
			}
	    }

	    if (keyState[38] || keyState[87]) {

	        // up arrow or 'w' - move forward
	     //   console.log(tangentVecCannon.x, tangentVecCannon.y, tangentVecCannon.z)
	     var vec = new THREE.Vector3();
            camera.getWorldDirection( vec );
          this.cannonMesh.applyImpulse(new CANNON.Vec3(vec.x * 70,vec.z * 70,vec.y* 70),newPosition);
	    }

	    if (keyState[40] || keyState[83]) {

	        // down arrow or 's' - move backward
	       tangentVecCannon.negate();
	       	      //  console.log(tangentVecCannon.x, tangentVecCannon.y, tangentVecCannon.z)
	 		 var vec = new THREE.Vector3();
            camera.getWorldDirection( vec );
          this.cannonMesh.applyImpulse(new CANNON.Vec3(vec.x * 70,vec.z * 70,vec.y* 70).negate(),newPosition);
	    
	    }

	    if (keyState[37] || keyState[65]) {

	        // left arrow or 'a' - rotate left
				      //  console.log(tangentLatVecCannon.x, tangentLatVecCannon.y, tangentLatVecCannon.z)

            this.cannonMesh.applyImpulse(tangentLatVecCannon,newPosition);

            raycastReference.rotation.y += .2;
	    }

	    if (keyState[39] || keyState[68]) {

	        // right arrow or 'd' - rotate right
	 		tangentLatVecCannon.negate();
	        //console.log(tangentLatVecCannon.x, tangentLatVecCannon.y, tangentLatVecCannon.z)
            this.cannonMesh.applyImpulse(tangentLatVecCannon,newPosition);
			raycastReference.rotation.y -= .2;
	    }
	};

	function onKeyDown( event ) {

    	event = event || window.event;

        keyState[event.keyCode || event.which] = true;

    }

    function onKeyUp( event ) {

        event = event || window.event;

        keyState[event.keyCode || event.which] = false;

    }

	this.domElement.addEventListener('contextmenu', function( event ) { event.preventDefault(); }, false );
	this.domElement.addEventListener('keydown', onKeyDown, false );
	this.domElement.addEventListener('keyup', onKeyUp, false );

};

THREE.PlayerControls.prototype = Object.create( THREE.EventDispatcher.prototype );