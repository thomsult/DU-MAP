//import * as THREE from 'three';
import * as THREE from './js/three.module.js';
import { OrbitControls } from './js/OrbitControls.js'; ///files modified
			
			import {GetAllData,GetPlanete,GetMoon} from "./Component/Data.js"
			//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
export default function threeJSexemple(){
	
			console.log("load")
	let camera, scene,controls, renderer,raycaster,mouse,screenPos,target,vec2;
	console.log("loading")

	let Width = window.innerWidth;
	let Height = window.innerHeight;
	
	
	function init() {
		
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( 1 );
		renderer.setSize( Width, Height );
		renderer.localClippingEnabled = true;
		//renderer.domElement.style.transform = "translateX(-200px)"
		
		document.body.appendChild(renderer.domElement)
		scene = new THREE.Scene();		
		scene.background = new THREE.CubeTextureLoader().setPath('./data/')
		.load( [
			'+x.png', '-x.png',
	'+y.png', '-y.png',
	'+z.png', '-z.png'
		] );


		

		target = new THREE.Vector3(13771471*0.01,7364470.4372*0.01,-128971*0.01)
		vec2 = new THREE.Vector3(0,0,0)
		raycaster = new THREE.Raycaster();
		mouse = new THREE.Vector2();
		
		camera = new THREE.PerspectiveCamera( 80, Width / Height, 1, 2000000000000000 );

		//var loader = new FontLoader();
		
		
		camera.position.set(10000,0,0);
		controls = new OrbitControls( camera, renderer.domElement );
		console.log(controls)
		controls.addEventListener( 'change', render ); // use only if there is no animation loop
		controls.enablePan = true;
		controls.minDistance = 2000
		
		const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 )
		light.position.set( 1.5, 1, 1.25 );
		scene.add( light );


		const group = new THREE.Group();
		group.name = "Helios"
		const Scale = 0.01 //Échelle de la carte
		const Su = 200000*Scale // 1Su = 200 km
		//
		function DrawOrbit(Moon,Planete){
			const center = new THREE.Vector3().copy(Planete);
			const moon1 = new THREE.Vector3(Moon.center[0]* Scale,Moon.center[1]* Scale,Moon.center[2]* Scale)
			const radius = center.distanceTo( moon1 ); 
			 //Helper
			/*const material2 = new THREE.LineBasicMaterial({
				color: "red"
			});
			
			const points2 = [];
			points2.push(moon1)
			points2.push( center )
			const geometry2 = new THREE.BufferGeometry().setFromPoints( points2 );
			const line2 = new THREE.Line( geometry2, material2 ); 
			group.add(line2)*/


			function generateRandomNumber() {
				var min = 0.6,
					max = 1,
					highlightedNumber = Math.random() * (max - min) + min;
				return highlightedNumber
			};
			
			
		const curve = new THREE.EllipseCurve(
			0,  0,            // ax, aY
			radius*generateRandomNumber(), radius,           // xRadius, yRadius
			0,  2 * Math.PI,  // aStartAngle, aEndAngle
			false,            // aClockwise
			0                 // aRotation
		);
		
		const points = curve.getPoints( 70 );
		const geometry = new THREE.BufferGeometry().setFromPoints( points );
		
		const material = new THREE.LineBasicMaterial( { color : '#171B1D' } );
		
		// Create the final object to add to the scene
		const ellipse = new THREE.Line( geometry, material );
		ellipse.position.copy(center)
	
		ellipse.lookAt(moon1)
		ellipse.rotateOnAxis(new THREE.Vector3(1,0,0),20.42)
		group.add(ellipse)
	}
	async function Helios(){
		const centerSafeZone = new THREE.Vector3(13771471*Scale,7364470.4372*Scale,-128971*Scale)
		//const centerMap = new THREE.Vector3(0*Scale, 24000000*Scale, 0*Scale)//position approximative
		function SafeZone(){
			const safezonegeometry = new THREE.SphereGeometry( 36000000*Scale, 17, 17 );//position approximative
			//geometry.position =new THREE.Vector3(centerMap.x,centerMap.y,centerMap.z)
			safezonegeometry.name = "SafeZone"
			const material = new THREE.MeshLambertMaterial( {
				opacity: 0.05, 
				transparent: true,
				color: "blue",
				side:THREE.DoubleSide,
				visible:false
			} );
			const safezone = new THREE.Mesh( safezonegeometry, material )
			safezone.name = "SafeZone"
			safezone.position.copy(centerSafeZone)
			group.add(safezone);
		}

		GetAllData().then(Helios=>{
		const Planets = new THREE.Group();
		Planets.name = "Planète"
		GetPlanete(Helios).forEach((el)=>{
				const Planet = new THREE.Group();
				Planet.name = el.name[1]
				Planet.userData = el
				Planet._id = el.id
				Planet.info = "Planet"
				Planet.satellites = GetMoon(el.satellites,Helios)
				Planet.isInSafeZone = el.isInSafeZone
				Planet.position.set(el.center[0]* Scale,el.center[1]* Scale,el.center[2]* Scale)
				/**
				* 
				* @date 2022-02-18
				* @param {number} radius number
				* @param {string} name string
				* @param {boolean} Trigger= false bool
				* @param {number} Scale number
				* @param {boolean} SafeZone= false
				* @returns {THREE.Mesh} new THREE.Mesh
				*/
				function PlanetGeoMat(radius,name,Trigger = false,Scale,SafeZone = false){
					let SafeZonePlanet = 2*500000
					let rad = 0
					let material = null
					if(Trigger && SafeZone){
						rad = (radius + SafeZonePlanet)*Scale
						material = new THREE.MeshLambertMaterial( {
							opacity: 0.05, 
							transparent: true,
							color: "blue"
						} );
					}else if(Trigger){
						rad = radius*0.5
						material = new THREE.MeshLambertMaterial( {
							opacity: 0.05, 
							transparent: true,
							color: "white"
						} );
					}
					else{
						rad = radius*Scale
						material = new THREE.MeshLambertMaterial( {
							color: "green"
						} )
					}
					const geometry = new THREE.SphereGeometry( rad, 17, 17 );
					const mesh = new THREE.Mesh( geometry,material )

					
					
					
					mesh.name = name + (Trigger?" Trigger":"")+ (SafeZone?" SafeZone":"")
				
					return mesh 
				}
				DrawOrbit(el,centerSafeZone)


				Planet.add(PlanetGeoMat(el.radius,el.name[1],false,Scale));//planète Géométrie
				Planet.add(PlanetGeoMat(el.radius,el.name[1],true,Scale,true));//planète safezonde
				Planet.add( PlanetGeoMat(el.radius,el.name[1],true,Scale));//planète Trigger
				Planets.add(Planet)

			})
		const moon =[]
		Planets.children.forEach((Planet)=>{
				
			
			Planet?.satellites!== null&&Planet.satellites.forEach((Moon)=>{
				const MoonGroup = new THREE.Group();
				MoonGroup.info = "Moon"
				MoonGroup._id = Moon.id
				MoonGroup.name = Moon.name[1]
				const geometry = new THREE.SphereGeometry( Moon.radius* Scale, 17, 17 );
				geometry.name = Moon.name[1]+" mesh"
				const material = new THREE.MeshLambertMaterial( {
					color: "red",
					
				} );
				
				//MoonGroup.worldToLocal(Moon.center[0]* Scale,Moon.center[1]* Scale,Moon.center[2]* Scale) 
				MoonGroup.position.set(Moon.center[0]* Scale,Moon.center[1]* Scale,Moon.center[2]* Scale)
				MoonGroup.add( new THREE.Mesh( geometry, material ) );
				group.add(MoonGroup)
				moon.push(MoonGroup)
			})})



			group.add(Planets)
			//console.log(group)
			controls.target = target
				
			SafeZone()
			scene.add( group );
			// helpersGeom
		Planets&&Planets.children.forEach((planete)=>{
				//planete.satellites&&console.log(planete.satellites[0].center)
				planete.satellites&&planete.satellites.forEach((items)=>{
					moon&&moon.find((el)=>el._id === items.id&&planete.attach(el)) 
				})
				const Helper = new THREE.Group();
				Helper.name = "Helper"
				
				//console.log(distanceToAliot) 
				if(!planete.isInSafeZone){
					const Alioth = new THREE.Vector3(0,0,0)
					let distance = centerSafeZone.distanceTo(planete.position)
					var direction = new THREE.Vector3().copy(planete.position)
					
					var closedSpline = new THREE.CatmullRomCurve3( [
						planete.position,
						direction.lerp(centerSafeZone,distance/1400000)] );
						
					const geometry2 = new THREE.TubeBufferGeometry(closedSpline, 13, 5*Su , 20, false);

					const material = new THREE.MeshLambertMaterial( {
						opacity: 0.05, 
				transparent: true,
				
				color: "yellow"
					} );
					material.side = THREE.DoubleSide
					const Pipe = new THREE.Mesh( geometry2, material );
					material.visible = false;
					Pipe.name = "Pipe "+planete.name
					Helper.add( Pipe )
				}
				
				






				/* planete.satellites&&planete.satellites.forEach((moon)=>{
					const material2 = new THREE.LineBasicMaterial({
						color: "blue"
					});
					const points2 = [];
					points2.push(new THREE.Vector3(moon.center[0]* Scale,moon.center[1]* Scale,moon.center[2]* Scale))
					points2.push( planete.position );
					const geometry2 = new THREE.BufferGeometry().setFromPoints( points2 );
					const line2 = new THREE.Line( geometry2, material2 );
					line2.name ="PlanèteToMoon"
					Helper.add( line2 )
				}) */
				
				planete.attach(Helper)	
		})
			
			Planets&&Planets.children.forEach((planete)=>{
				
			
				if(planete.satellites){
					planete.satellites.forEach((Moon)=>{

						DrawOrbit(Moon,planete.position)
					})
					
				}
					
			})
		
		})
		}
		
		Helios()
		// helpers
		/* function onMouseClick( event ) {
			event.preventDefault()
			
			raycaster.setFromCamera( mouse, camera );
			const intersects = raycaster.intersectObjects( scene.children );
			console.log(event,intersects)

			if (intersects.length !== 0) {
				/* intersects.forEach((items)=>{
					if(items.object.name !== "SafeZone"){
						console.log(items.object.name)
						if(items.object.parent.name.includes('Lune')|| items.object.parent.name == "Sanctuary"){
							console.log(items.object.parent.name)
							

							vec2.set( items.point.x,items.point.y,items.point.z );
							document.getElementById('info').innerText = items.object.parent.name
						}else if(items.object.name.includes(' Trigger')){
							vec2.set( items.object.parent.position.x,items.object.parent.position.y,items.object.parent.position.z );
							document.getElementById('info').innerText = items.object.parent.name
						}
						else{
							
						}
						
					}
				})
				//console.log(intersects[0])
				

			} else if(event.buttons === 2){
				controls.enabled = false;
				vec2.set( 0,0,0 );
				camera.lookAt( controls.target );
				document.getElementById('info').innerText = "Helios"
				controls.enabled = true;
			} 
			
		}*/
		function onMouseMove( event ) {
			mouse.x =  (event.offsetX  / Width ) * 2 - 1;
			mouse.y = - ( event.offsetY  / Height ) * 2 + 1;
		}

		//window.addEventListener( 'mousedown', onMouseClick,false );
		window.addEventListener( 'mousemove', onMouseMove,false );
		document.getElementById("safezoneToggle").addEventListener("change",(e)=>{
			e.preventDefault()
			const obj = group.getObjectByProperty('name',"SafeZone")
			obj.material.visible = !obj.material.visible

		})
		document.getElementById("pipeToggle").addEventListener("change",(e)=>{
			e.preventDefault()
			const planete = group.getObjectByName("Planète").children
			planete.forEach((pl)=>{
				!pl.isInSafeZone?pl.getObjectByName("Helper").children[0].material.visible = !pl.getObjectByName("Helper").children[0].material.visible:null
			})

		})
		
		window.addEventListener( 'resize', onWindowResize );
/*
		const material2 = new THREE.LineBasicMaterial({
			color: "blue"
		});
		
	 	const pointsEchelleSU = [];
		pointsEchelleSU.push(new THREE.Vector3(0,0,0))

		pointsEchelleSU.push(new THREE.Vector3(200000*Scale,0,0));
		const geometryEchelleSU = new THREE.BufferGeometry().setFromPoints( pointsEchelleSU );
		const lineEchelleSU = new THREE.Line( geometryEchelleSU, material2 );
		lineEchelleSU.name ="EchelleSU"
		//Helper.add( line2 )
		
		group.add(lineEchelleSU) */

	/* function TextPos(Text = "Position Actuel",v3 =  new THREE.Vector3(0,1700,-1000) ){
		loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json', function(font) {

			var geometry = new TextGeometry(`. ${!(/^\s*$/).test(Text)?Text:"Position Actuel"}`, {
			  font: font,
			  size: 120,
			  height: 1,
			  curveSegments: 12,
			  bevelEnabled: true,
			  bevelThickness: 0.5,
			  bevelSize: 0.25,
			  bevelOffset: 0,
			  bevelSegments: 5
			});
			//geometry.center();
			
			var material = new THREE.MeshBasicMaterial({
			  color: 0x00ff00
			});
			
			var txt = new THREE.Mesh(geometry, material);
			txt.position.copy(v3)
			txt.lookAt(camera.position)
			scene.add(txt);
		  
			function animate() {
			  requestAnimationFrame(animate);
			  renderer.render(scene, camera);
			  txt.lookAt(camera.position)
			}
			animate();
		  
		  });
	}
	TextPos("Le lapin est ici",new THREE.Vector3(0,1700,-1000))
	TextPos(" ",new THREE.Vector3(0,2500,-1000))
	TextPos("obj",new THREE.Vector3(0,3500,-1000))
	TextPos("Le lapin est ici",new THREE.Vector3(0,4500,-1000))	 */
	///console.log(scene)
	








}
	

	function onWindowResize() {
		Width = window.innerWidth;
		Height = window.innerHeight;
		camera.aspect = Width / Height;
		camera.updateProjectionMatrix();
		//renderer.domElement.style.transform = "translateX(-400px)"
		renderer.setSize( Width, Height );
		
		render();

	}
	
	

	function animate() {
		scene.updateMatrixWorld(); 
		requestAnimationFrame(animate)
		//console.log(scene)
		// controls.update()
		target.lerp(vec2, 0.05);
		//target.copy(vec2)
		render()
		
	
		//scene.children[1].rotation.y = scene.children[1].rotation.y + 0.005
		//light.position.set( light.position.x, 1, 1.25 );
		controls.update()
	}






	function nestedObjecttoScreenXYZ(obj,camera,width,height)
{
	
	var vector = new THREE.Vector3();
	vector.setFromMatrixPosition( obj.matrixWorld );
	var widthHalf = (width/2);
	var heightHalf = (height/2);
	vector.project(camera);
	vector.x = ( vector.x * widthHalf ) + widthHalf;
	vector.y = - ( vector.y * heightHalf ) + heightHalf;
	//console.log(vector)
	return vector;
};


const PlaneteListHtml = document.getElementById('Planete')
GetAllData().then((helios)=>{GetPlanete(helios).forEach((planete)=>{

	const PlaneteDiv = document.createElement('a')
	PlaneteDiv.className = "PlaneteName"
	PlaneteDiv.innerText = planete.name[0]
	PlaneteDiv.addEventListener("click",(e)=>{
		const distance = camera.position.distanceTo(new THREE.Vector3(planete.center[0]*0.01,planete.center[1]*0.01,planete.center[2]*0.01))
		controls.maxDistance = 20000
		vec2.copy(new THREE.Vector3(planete.center[0]*0.01,planete.center[1]*0.01,planete.center[2]*0.01))
		
		
		
		console.log(e)
	})
	const screenPos = new THREE.Vector3();
	const obj = scene.getObjectByProperty('name', planete.innerText)
	obj&&screenPos.copy(nestedObjecttoScreenXYZ(obj,camera,Width,Height))
	PlaneteDiv.style.transform = `translate(${screenPos.x + 10}px,${screenPos.y + 10}px)`
	screenPos.z>1?PlaneteDiv.hidden = true:PlaneteDiv.hidden = false 
	PlaneteDiv.setAttribute("pos", JSON.stringify(new THREE.Vector3(planete.center[0]*0.01,planete.center[1]*0.01,planete.center[2]*0.01)))
	PlaneteListHtml.appendChild(PlaneteDiv)
	

})})


function updatePos(){
	if(PlaneteListHtml.children.length > 0){

	for (var i = 0; i < PlaneteListHtml.children.length; i++) {
		const planete = PlaneteListHtml.children[i]

		
		
		const distancetoTarget = Math.round(camera.position.distanceTo(new THREE.Vector3(JSON.parse(planete.getAttribute("pos")).x,JSON.parse(planete.getAttribute("pos")).y,JSON.parse(planete.getAttribute("pos")).z)))
		
		//console.log(planete.getAttribute("pos"))

			
		screenPos = new THREE.Vector3();
		const obj = scene.getObjectByProperty('name', planete.innerText)
		obj&&screenPos.copy(nestedObjecttoScreenXYZ(obj,camera,Width,Height))
		planete.style.transform = `translate(${screenPos.x + 10}px,${screenPos.y + 10}px)`
		screenPos.z>1?planete.hidden = true:planete.hidden = false
		//planete.setAttribute("distance", (distance))
		const distance = Math.round(camera.position.distanceTo(target))
		if(distance === distancetoTarget){
			controls.maxDistance = 1000000
		//console.log(distance,distancetoTarget)
		}
	}
	
	
}
}



init();
render();
	function render() {
		updatePos()
		//updatePos()
		//console.log(camera.position.x)
		renderer.render( scene, camera );

	}
	
	animate()
}
threeJSexemple()

