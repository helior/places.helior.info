var camera, scene, renderer;

var texture_placeholder,
isUserInteracting = false,
onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = 90, onMouseDownLon = 0,
lat = 0, onMouseDownLat = 0,
phi = 0, theta = 0,
target = new THREE.Vector3();

init();
animate();

function init() {
  var container, mesh;
  container = document.getElementById( 'container' );
  camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 250, 650 );
  scene = new THREE.Scene();

  // Geometry & Material
  var bodyElement = document.getElementsByTagName('body')[0];
  var imagepath = "/images/" + bodyElement.dataset.image;
  var geometry = new THREE.SphereGeometry(600, 100, 100);
  var texture = THREE.ImageUtils.loadTexture(imagepath);
  texture.minFilter = THREE.NearestFilter;
  var material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5});

  // Common Mesh
  mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(-1, 1, 1);
  mesh.rotation.order = 'XZY';
  mesh.renderDepth = 1000.0;
  scene.add(mesh);

  renderer = webglAvailable() ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  container.addEventListener( 'mousedown', onDocumentMouseDown, false );
  container.addEventListener( 'mousemove', onDocumentMouseMove, false );
  container.addEventListener( 'mouseup', onDocumentMouseUp, false );
  container.addEventListener( 'touchstart', onDocumentTouchStart, false );
  container.addEventListener( 'touchmove', onDocumentTouchMove, false );
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseDown( event ) {
  event.preventDefault();
  isUserInteracting = true;

  onPointerDownPointerX = event.clientX;
  onPointerDownPointerY = event.clientY;

  onPointerDownLon = lon;
  onPointerDownLat = lat;

}

function onDocumentMouseMove( event ) {
  if ( isUserInteracting === true ) {
    lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
    lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
  }
}

function onDocumentMouseUp( event ) {
  isUserInteracting = false;
}

function onDocumentTouchStart( event ) {
  if ( event.touches.length == 1 ) {
    event.preventDefault();

    onPointerDownPointerX = event.touches[ 0 ].pageX;
    onPointerDownPointerY = event.touches[ 0 ].pageY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;
  }
}

function onDocumentTouchMove( event ) {
  if ( event.touches.length == 1 ) {
    event.preventDefault();

    lon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + onPointerDownLon;
    lat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
  }
}

function animate() {
  requestAnimationFrame( animate );
  update();
}

function update() {
  if ( isUserInteracting === false ) {
    lon += 0.1;
  }

  lat = Math.max( - 85, Math.min( 85, lat ) );
  phi = THREE.Math.degToRad( 90 - lat );
  theta = THREE.Math.degToRad( lon );

  target.x = 500 * Math.sin( phi ) * Math.cos( theta );
  target.y = 500 * Math.cos( phi );
  target.z = 500 * Math.sin( phi ) * Math.sin( theta );

  camera.lookAt( target );
  renderer.render( scene, camera );
}

function webglAvailable() {
	try {
		var canvas = document.createElement( 'canvas' );
		return !!( window.WebGLRenderingContext && canvas.getContext( 'webgl' )
		);
	} catch ( e ) {
		return false;
	}
}
