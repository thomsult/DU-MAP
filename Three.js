//import * as THREE from 'three';
import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.5-HJEdoVYPhjkiJWkt6XIa/mode=imports,min/optimized/three.js';
import { OrbitControls } from 'https://cdn.skypack.dev/pin/three@v0.137.5-HJEdoVYPhjkiJWkt6XIa/mode=raw,min/examples/jsm/controls/OrbitControls.js';
			
			import {GetPlanete,GetMoon} from "./Component/Data"
			//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
export default function threeJSexemple(){
			let camera, scene,controls, renderer,raycaster,mouse,target,vec2;

			init();
			render();
			
			function init() {
				
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.localClippingEnabled = true;
				document.body.appendChild( renderer.domElement );
				
				target = new THREE.Vector3(0,0,0)
				vec2 = new THREE.Vector3(0,0,0)
				
				raycaster = new THREE.Raycaster();
				mouse = new THREE.Vector2();

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 2000000000000000 );
				camera.position.set( 0, 0, 47000.0 );
				controls = new OrbitControls( camera, renderer.domElement );
				
				controls.addEventListener( 'change', render ); // use only if there is no animation loop
				controls.enablePan = true;
				controls.minDistance = 10000
				
				const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 )
				light.position.set( - 1.25, 1, 1.25 );
				scene.add( light );


				const group = new THREE.Group();
				group.name = "Helios"
				const Scale = 0.01
				//
				function DrawOrbit(Moon,Planete){
					const center = new THREE.Vector3().copy(Planete);
					const moon1 = new THREE.Vector3(Moon.center[0]* Scale,Moon.center[1]* Scale,Moon.center[2]* Scale)
					const radius = center.distanceTo( moon1 ); 
					/* //Helper
					const material2 = new THREE.LineBasicMaterial({
						color: "red"
					});
					
					const points2 = [];
					points2.push(moon1)
					points2.push( center )
					points2.push( new THREE.Vector3(0,0,100000).add(center) );
					points2.push( center )
					points2.push( new THREE.Vector3(100000,0,0).add(center) );
					const geometry2 = new THREE.BufferGeometry().setFromPoints( points2 );
					const line2 = new THREE.Line( geometry2, material2 ); 
					group.add(line2) */


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
				function Helios(){
				
				const centerMap = new THREE.Vector3(0*Scale, 24000000*Scale, 0*Scale)//position approximative
				function SafeZone(){
					const safezonegeometry = new THREE.SphereGeometry( 35000000*Scale, 17, 17 );//position approximative
					//geometry.position =new THREE.Vector3(centerMap.x,centerMap.y,centerMap.z)
					safezonegeometry.name = "SafeZone"
					const material = new THREE.MeshLambertMaterial( {
						opacity: 0.5, 
						transparent: true,
						color: "blue"
					} );
					const safezone = new THREE.Mesh( safezonegeometry, material )
					safezone.name = "SafeZone"
					safezone.position.copy(centerMap).add(new THREE.Vector3(100000,0,0))
					group.add(safezone);
				}


				const Planets = new THREE.Group();
				Planets.name = "Planète"
				GetPlanete().forEach((el)=>{
						const Planet = new THREE.Group();
						Planet.name = el.name[1]
						Planet.userData = el
						Planet._id = el.id
						Planet.info = "Planet"
						Planet.satellites = GetMoon(el.satellites)

						Planet.position.set(el.center[0]* Scale,el.center[1]* Scale,el.center[2]* Scale)
	
						function PlanetGeoMat(radius,name,Trigger,Scale){
							const geometry = new THREE.SphereGeometry( !Trigger?radius*Scale:radius*0.5, 17, 17 );
							geometry.name = !Trigger?name+" mesh":name+" Trigger"
							const material = !Trigger?new THREE.MeshLambertMaterial( {
							color: "green"
						} ):new THREE.MeshLambertMaterial( {
							opacity: 0.5, 
							transparent: true,
							color: "white"
						} );
						
							return new THREE.Mesh( geometry,material )
						}
						DrawOrbit(el,centerMap)


						Planet.add(PlanetGeoMat(el.radius,el.name[1],false,Scale));//planète Géométrie
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
							color: "red"
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
						const material = new THREE.LineBasicMaterial({
							color: "white"
						});
						const points = [];
						points.push(centerMap);
						points.push( planete.position );
						const geometry = new THREE.BufferGeometry().setFromPoints( points );
						const line = new THREE.Line( geometry, material );
						line.name ="PlanèteToCenter"
						Helper.add( line )

						planete.satellites&&planete.satellites.forEach((moon)=>{
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
						})
						
						//planete.attach(Helper)	
					})
					
					Planets&&Planets.children.forEach((planete)=>{
						
					
						if(planete.satellites){
							planete.satellites.forEach((Moon)=>{

								DrawOrbit(Moon,planete.position)
							})
							
						}
							
					})
				
				
				}
				Helios()
				

				
					
				
				// helpers
				function onMouseClick( event ) {
					event.preventDefault()
					
					raycaster.setFromCamera( mouse, camera );
					const intersects = raycaster.intersectObjects( scene.children );
					console.log(event,intersects)

					if (intersects.length !== 0) {
						intersects.forEach((items)=>{
							if(items.object.name !== "SafeZone"){
								if(items.object.parent.name.includes('Lune')){
									vec2.set( items.point.x,items.point.y,items.point.z );
								}else{
									vec2.set( items.object.parent.position.x,items.object.parent.position.y,items.object.parent.position.z );
								}
								document.getElementById('info').innerText = items.object.parent.name
							}
						})
						//console.log(intersects[0])
						

					}else if(event.buttons === 2){
						controls.enabled = false;
						vec2.set( 0,0,0 );
						camera.lookAt( controls.target );
						document.getElementById('info').innerText = "Helios"
						controls.enabled = true;
					}
				}
				function onMouseMove( event ) {
					mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
					mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
				}

				window.addEventListener( 'mousedown', onMouseClick,false );
				window.addEventListener( 'mousemove', onMouseMove,false );
				
				
				window.addEventListener( 'resize', onWindowResize );
			}
			
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}
			function animate() {
				requestAnimationFrame(animate)
			
				// controls.update()
				target.lerp(vec2, 0.1);
				render()
			
				controls.update()
			}

			function render() {

				renderer.render( scene, camera );

			}
			animate()
			return <></>
}
