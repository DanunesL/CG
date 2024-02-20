const m4 = twgl.m4;
const gl = document.querySelector("canvas").getContext("webgl");
let programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
const programInfo_aneis = twgl.createProgramInfo(gl, ["vsAneis", "fsAneis"]);
//--------------------------------------------------------------------------------------------
const dist_mercurio = 2.5
const dist_venus = 5
const dist_terra = 7.5
const dist_lua = 1.07
const dist_marte = 10
const dist_jupiter = 18
const dist_saturno = 27
const dist_urano = 36
const dist_neptuno = 47
//------------------------------------------------------------------------------------------------------
const bufferInfo_sol = twgl.primitives.createSphereBufferInfo(gl, 0.9, 64, 64);
const bufferInfo_mercurio = twgl.primitives.createSphereBufferInfo(gl, 0.2, 64, 64);
const bufferInfo_venus = twgl.primitives.createSphereBufferInfo(gl, 0.3, 64, 64);
const bufferInfo_Terra = twgl.primitives.createSphereBufferInfo(gl, 0.4, 64, 64);
const bufferInfo_lua = twgl.primitives.createSphereBufferInfo(gl, 0.1, 64, 64);
const bufferInfo_marte = twgl.primitives.createSphereBufferInfo(gl, 0.5, 64, 64);
const bufferInfo_jupiter = twgl.primitives.createSphereBufferInfo(gl, 0.7, 64, 64);
const bufferInfo_saturno = twgl.primitives.createSphereBufferInfo(gl, 0.6, 64, 64);
const bufferInfo_urano = twgl.primitives.createSphereBufferInfo(gl, 0.5, 64, 64);
const bufferInfo_neptuno = twgl.primitives.createSphereBufferInfo(gl, 0.55, 64, 64);
//--------------------------------------------------------------------------------------------------------
const bufferInfo_orbita_terra = twgl.primitives.createTorusBufferInfo(gl, dist_terra, 0.01, 64, 64);
const bufferInfo_orbita_venus = twgl.primitives.createTorusBufferInfo(gl, dist_venus, 0.01, 64, 64);
const bufferInfo_orbita_lua = twgl.primitives.createTorusBufferInfo(gl, dist_lua, 0.01, 64, 64);
const bufferInfo_orbita_mercurio = twgl.primitives.createTorusBufferInfo(gl, dist_mercurio, 0.01, 64, 64);
const bufferInfo_orbita_marte = twgl.primitives.createTorusBufferInfo(gl, dist_marte, 0.01, 64, 64);
const bufferInfo_orbita_jupiter = twgl.primitives.createTorusBufferInfo(gl, dist_jupiter, 0.01, 64, 64);
const bufferInfo_orbita_saturno = twgl.primitives.createTorusBufferInfo(gl, dist_saturno, 0.01, 64, 64);
const bufferInfo_orbita_urano = twgl.primitives.createTorusBufferInfo(gl, dist_urano, 0.01, 64, 64);
const bufferInfo_orbita_neptuno = twgl.primitives.createTorusBufferInfo(gl, dist_neptuno, 0.01, 64, 64);
const bufferInfo_anel_saturno = twgl.primitives.createTorusBufferInfo(gl, 1, 0.12, 64, 64);

let gone_inator = true
var seguir_terra = 0;

var isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let totalRotationY = 0;

let shading = true;
let eye = [15, 15, 15];

let target = [0, 0, 0];
let up = [0, 5, 0];

function texturas(nome) {
	return twgl.createTexture(gl, {
		min: gl.NEAREST,
		mag: gl.NEAREST,
		src: nome,
		crossOrigin: '',
	});
}

function handleKeyDown(event) {
	if (event.key === 'ArrowLeft') {
		rotateCamera(-15, 0);
	} else if (event.key === 'ArrowRight') {
		rotateCamera(15, 0);
	} else if (event.key === 'ArrowUp') {
		rotateCamera(0, -15);
	} else if (event.key === 'ArrowDown') {
		rotateCamera(0, 15);
	} else if (event.key === '2') {
		target = [0, 0, 0]
		seguir_terra = 0;
	} else if (event.key === '1') {
		if (seguir_terra === 1) {
			seguir_terra = 0;
			target = [0, 0, 0]
		} else {
			seguir_terra = 1;
		}
	} else if (event.key === 'o') {
		if (gone_inator) {
			gone_inator = false;
		} else {
			gone_inator = true;
		}
	} else if (event.key === 's') {
		if (shading) {
			programInfo = twgl.createProgramInfo(gl, ["vsGour", "fsGour"]);;
			shading = false;
		} else {
			programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
			shading = true;
		}
	}
}

function handleMouseDown(event) {
	isDragging = true;
	previousMousePosition = { x: event.clientX, y: event.clientY };
}

function handleMouseUp(event) {
	isDragging = false;
}

function handleMouseMove(event) {
	if (!isDragging) return;

	const deltaX = event.clientX - previousMousePosition.x;
	const deltaY = event.clientY - previousMousePosition.y;

	rotateCamera(deltaX, -deltaY);

	previousMousePosition = { x: event.clientX, y: event.clientY };
}

function rotateCamera(rotationX, rotationY) {
	const sensitivity = 0.002;
	const margin = 0.75;

	rotationX *= sensitivity;
	rotationY *= sensitivity;

	const maxUpRotation = Math.PI / 2;
	const maxDownRotation = -Math.PI / 2 + margin;

	if (
		(rotationY < 0 && totalRotationY >= maxDownRotation) ||
		(rotationY > 0 && totalRotationY <= maxUpRotation)
	) {
		eye = m4.transformPoint(m4.rotationX(rotationY), eye);
		totalRotationY += rotationY;
	}
	eye = m4.transformPoint(m4.rotationY(rotationX), eye);

}

function handleMouseWheel(event) {
	let delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	const zoomSpeed = -1.5;

	const minDistance = 1;
	eye[0] = Math.max(eye[0], minDistance);
	eye[1] = Math.max(eye[1], minDistance);
	eye[2] = Math.max(eye[2], minDistance);

	eye[0] += delta * zoomSpeed;
	eye[1] += delta * zoomSpeed;
	eye[2] += delta * zoomSpeed;
}

const tex = twgl.createTexture(gl, {
	min: gl.NEAREST,
	mag: gl.NEAREST,
	src: [
		255, 255, 255, 255,
		192, 192, 192, 255,
		192, 192, 192, 255,
		255, 255, 255, 255,
	],
});

const amb = 0.3;
const ambiente = [amb, amb, amb, 1];

const uniforms_sol = {
	u_texture: texturas('texturas/2k_sun.jpg'),
	u_lightWorldPos: [0, 0, 0],
	u_lightColor: [1, 0.8, 0.8, 1],
	u_ambient: [1, 1, 1, 1],
	u_specular: [1, 1, 1, 1],
	u_shininess: 50,
	u_specularFactor: 1,
};
const uniforms_mercurio = {
	u_texture: texturas('texturas/2k_mercury.jpg'),
	u_lightWorldPos: [0, 0, 0],
	u_lightColor: [1, 0.8, 0.8, 1],
	u_ambient: ambiente,
	u_specular: [1, 1, 1, 1],
	u_shininess: 50,
	u_specularFactor: 1,
};
const uniforms_venus = {
	u_texture: texturas('texturas/2k_venus_atmosphere.jpg'),
	u_lightWorldPos: [0, 0, 0],
	u_lightColor: [1, 0.8, 0.8, 1],
	u_ambient: ambiente,
	u_specular: [1, 1, 1, 1],
	u_shininess: 50,
	u_specularFactor: 1,
};
const uniforms_Terra = {
	u_texture: texturas('texturas/2k_earth_daymap.jpg'),
	u_lightWorldPos: [0, 0, 0],
	u_lightColor: [1, 0.8, 0.8, 1],
	u_ambient: ambiente,
	u_specular: [1, 1, 1, 1],
	u_shininess: 50,
	u_specularFactor: 1,
};
const uniforms_lua = {
	u_texture: texturas('texturas/2k_moon.jpg'),
	u_lightWorldPos: [0, 0, 0],
	u_lightColor: [1, 0.8, 0.8, 1],
	u_ambient: ambiente,
	u_specular: [1, 1, 1, 1],
	u_shininess: 50,
	u_specularFactor: 1,
};
const uniforms_marte = {
	u_texture: texturas('texturas/2k_mars.jpg'),
	u_lightWorldPos: [0, 0, 0],
	u_lightColor: [1, 0.8, 0.8, 1],
	u_ambient: ambiente,
	u_specular: [1, 1, 1, 1],
	u_shininess: 50,
	u_specularFactor: 1,
};
const uniforms_jupiter = {
	u_texture: texturas('texturas/2k_jupiter.jpg'),
	u_lightWorldPos: [0, 0, 0],
	u_lightColor: [1, 0.8, 0.8, 1],
	u_ambient: ambiente,
	u_specular: [1, 1, 1, 1],
	u_shininess: 50,
	u_specularFactor: 1,
};
const uniforms_saturno = {
	u_texture: texturas('texturas/2k_saturn.jpg'),
	u_lightWorldPos: [0, 0, 0],
	u_lightColor: [1, 0.8, 0.8, 1],
	u_ambient: ambiente,
	u_specular: [1, 1, 1, 1],
	u_shininess: 50,
	u_specularFactor: 1,
};
const uniforms_urano = {
	u_texture: texturas('texturas/2k_uranus.jpg'),
	u_lightWorldPos: [0, 0, 0],
	u_lightColor: [1, 0.8, 0.8, 1],
	u_ambient: ambiente,
	u_specular: [1, 1, 1, 1],
	u_shininess: 50,
	u_specularFactor: 1,
};
const uniforms_neptuno = {
	u_texture: texturas('texturas/2k_neptune.jpg'),
	u_lightWorldPos: [0, 0, 0],
	u_lightColor: [1, 0.8, 0.8, 1],
	u_ambient: ambiente,
	u_specular: [1, 1, 1, 1],
	u_shininess: 50,
	u_specularFactor: 1,
};
const uniforms_orbita_terra = { u_color: twgl.v3.create(0, 0.6, 1), };
const uniforms_orbita_venus = { u_color: twgl.v3.create(0, 0.6, 1), };
const uniforms_orbita_lua = { u_color: twgl.v3.create(0, 0.6, 1), };
const uniforms_orbita_mercurio = { u_color: twgl.v3.create(0, 0.6, 1), };
const uniforms_orbita_marte = { u_color: twgl.v3.create(0, 0.6, 1), };
const uniforms_orbita_jupiter = { u_color: twgl.v3.create(0, 0.6, 1), };
const uniforms_orbita_saturno = { u_color: twgl.v3.create(0, 0.6, 1), };
const uniforms_orbita_urano = { u_color: twgl.v3.create(0, 0.6, 1), };
const uniforms_orbita_neptuno = { u_color: twgl.v3.create(0, 0.6, 1), };
const uniforms_aneis_saturno = { u_color: twgl.v3.create(0.8, 0.6, 0.4), };

function newObject(bufferInfo, uniforms, programInfo) {
	twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
	twgl.setUniforms(programInfo, uniforms);
	twgl.drawBufferInfo(gl, bufferInfo);
}

function render(time) {

	twgl.resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const fov = 30 * Math.PI / 180;
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.5;
	const zFar = 1000;
	const projection = m4.perspective(fov, aspect, zNear, zFar);

	const camera = m4.lookAt(eye, target, up);
	const view = m4.inverse(camera);
	const viewProjection = m4.multiply(projection, view);

	const world_sol = m4.rotationY(0.0001 * time);
	const world_mercurio = m4.multiply(m4.translation([1.5 * dist_mercurio * Math.cos(time * 0.0001), 0, dist_mercurio * Math.sin(time * 0.0001)]), m4.rotationY(0.001 * time));
	const world_venus = m4.multiply(m4.translation([dist_venus * Math.cos(time * 0.00005), 0, dist_venus * Math.sin(time * 0.00005)]), m4.rotationY(0.003 * time));
	const world_terra = m4.multiply(m4.translation([dist_terra * Math.cos(time * 0.00008), 0, dist_terra * Math.sin(time * 0.00008)]), m4.rotationY(0.002 * time));
	const world_lua = m4.multiply(m4.multiply(m4.translation([(dist_terra * Math.cos(time * 0.00008)), 0, dist_terra * Math.sin(time * 0.00008)]), m4.translation([(dist_lua * Math.cos(time * 0.001)), ((dist_lua * 0.5 * Math.sin(time * 0.001))), (dist_lua * Math.sin(time * 0.001))])), m4.rotationY(0.002 * time));
	const world_marte = m4.multiply(m4.translation([dist_marte * Math.cos(time * 0.00015), 0, dist_marte * Math.sin(time * 0.00015)]), m4.rotationY(0.0015 * time));
	const world_jupiter = m4.multiply(m4.translation([dist_jupiter * Math.cos(time * 0.00001), 0, dist_jupiter * Math.sin(time * 0.00001)]), m4.rotationY(0.0005 * time));
	const world_saturno = m4.multiply(m4.translation([dist_saturno * Math.cos(time * 0.00003), 0, dist_saturno * Math.sin(time * 0.00003)]), m4.rotationY(0.0008 * time));
	const world_urano = m4.multiply(m4.translation([dist_urano * Math.cos(time * 0.00004), 0, dist_urano * Math.sin(time * 0.00004)]), m4.rotationY(0.0035 * time));
	const world_neptuno = m4.multiply(m4.translation([dist_neptuno * Math.cos(time * 0.00006), 0, dist_neptuno * Math.sin(time * 0.00006)]), m4.rotationY(0.0004 * time));
	const world_orbita_terra = m4.identity();
	const world_orbita_venus = m4.identity();
	const world_orbita_lua = m4.multiply(m4.multiply(m4.translation([dist_terra * Math.cos(time * 0.00008), 0, dist_terra * Math.sin(time * 0.00008)]), m4.rotationX(-0.5)), m4.scaling([1, 1, 1.12]));
	const world_orbita_mercurio = m4.scaling([1.5, 1, 1]);
	const world_orbita_marte = m4.identity();
	const world_orbita_jupiter = m4.identity();
	const world_orbita_saturno = m4.identity();
	const world_orbita_urano = m4.identity();
	const world_orbita_neptuno = m4.identity();
	const world_aneis_saturno = m4.multiply(m4.multiply(m4.translation([dist_saturno * Math.cos(time * 0.00003), 0, dist_saturno * Math.sin(time * 0.00003)]), m4.rotationX(0.6)), m4.multiply(m4.rotationY(time * 0.0001), m4.scaling([1, 0.01, 1])));

	if (seguir_terra === 1) {
		target = m4.transformPoint(world_terra, [0, 0, 0]);
	}

	function uniLuz(uniform, world) {
		uniform.u_viewInverse = camera;
		uniform.u_world = world;
		uniform.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
	}
	uniLuz(uniforms_Terra, world_terra);
	uniLuz(uniforms_mercurio, world_mercurio);
	uniLuz(uniforms_sol, world_sol);
	uniLuz(uniforms_venus, world_venus);
	uniLuz(uniforms_marte, world_marte);
	uniLuz(uniforms_jupiter, world_jupiter);
	uniLuz(uniforms_neptuno, world_neptuno);
	uniLuz(uniforms_urano, world_urano);
	uniLuz(uniforms_saturno, world_saturno);
	uniLuz(uniforms_lua, world_lua);

	uniforms_sol.u_worldViewProjection = m4.multiply(viewProjection, world_sol);
	uniforms_mercurio.u_worldViewProjection = m4.multiply(viewProjection, world_mercurio);
	uniforms_venus.u_worldViewProjection = m4.multiply(viewProjection, world_venus);
	uniforms_Terra.u_worldViewProjection = m4.multiply(viewProjection, world_terra);
	uniforms_lua.u_worldViewProjection = m4.multiply(viewProjection, world_lua);
	uniforms_marte.u_worldViewProjection = m4.multiply(viewProjection, world_marte);
	uniforms_jupiter.u_worldViewProjection = m4.multiply(viewProjection, world_jupiter);
	uniforms_saturno.u_worldViewProjection = m4.multiply(viewProjection, world_saturno);
	uniforms_urano.u_worldViewProjection = m4.multiply(viewProjection, world_urano);
	uniforms_neptuno.u_worldViewProjection = m4.multiply(viewProjection, world_neptuno);
	uniforms_aneis_saturno.u_worldViewProjection = m4.multiply(viewProjection, world_aneis_saturno);
	if (gone_inator) {
		uniforms_orbita_terra.u_worldViewProjection = m4.multiply(viewProjection, world_orbita_terra);
		uniforms_orbita_lua.u_worldViewProjection = m4.multiply(viewProjection, world_orbita_lua);
		uniforms_orbita_venus.u_worldViewProjection = m4.multiply(viewProjection, world_orbita_venus);
		uniforms_orbita_mercurio.u_worldViewProjection = m4.multiply(viewProjection, world_orbita_mercurio);
		uniforms_orbita_marte.u_worldViewProjection = m4.multiply(viewProjection, world_orbita_marte);
		uniforms_orbita_jupiter.u_worldViewProjection = m4.multiply(viewProjection, world_orbita_jupiter);
		uniforms_orbita_saturno.u_worldViewProjection = m4.multiply(viewProjection, world_orbita_saturno);
		uniforms_orbita_urano.u_worldViewProjection = m4.multiply(viewProjection, world_orbita_urano);
		uniforms_orbita_neptuno.u_worldViewProjection = m4.multiply(viewProjection, world_orbita_neptuno);
	}

	gl.useProgram(programInfo.program);
	newObject(bufferInfo_sol, uniforms_sol, programInfo);
	newObject(bufferInfo_mercurio, uniforms_mercurio, programInfo);
	newObject(bufferInfo_venus, uniforms_venus, programInfo);
	newObject(bufferInfo_Terra, uniforms_Terra, programInfo);
	newObject(bufferInfo_lua, uniforms_lua, programInfo);
	newObject(bufferInfo_marte, uniforms_marte, programInfo);
	newObject(bufferInfo_jupiter, uniforms_jupiter, programInfo);
	newObject(bufferInfo_saturno, uniforms_saturno, programInfo);
	newObject(bufferInfo_urano, uniforms_urano, programInfo);
	newObject(bufferInfo_neptuno, uniforms_neptuno, programInfo);
	gl.useProgram(programInfo_aneis.program);
	newObject(bufferInfo_anel_saturno, uniforms_aneis_saturno, programInfo_aneis);
	if (gone_inator) {
		newObject(bufferInfo_orbita_terra, uniforms_orbita_terra, programInfo_aneis);
		newObject(bufferInfo_orbita_lua, uniforms_orbita_lua, programInfo_aneis);
		newObject(bufferInfo_orbita_venus, uniforms_orbita_venus, programInfo_aneis);
		newObject(bufferInfo_orbita_mercurio, uniforms_orbita_mercurio, programInfo_aneis);
		newObject(bufferInfo_orbita_marte, uniforms_orbita_marte, programInfo_aneis);
		newObject(bufferInfo_orbita_jupiter, uniforms_orbita_jupiter, programInfo_aneis);
		newObject(bufferInfo_orbita_saturno, uniforms_orbita_saturno, programInfo_aneis);
		newObject(bufferInfo_orbita_urano, uniforms_orbita_urano, programInfo_aneis);
		newObject(bufferInfo_orbita_neptuno, uniforms_orbita_neptuno, programInfo_aneis);
	}

	requestAnimationFrame(render);
}
requestAnimationFrame(render);

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);
window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('wheel', handleMouseWheel);
