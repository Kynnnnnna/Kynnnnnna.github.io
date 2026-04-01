import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function initWaterScene(mountEl, sceneRoot, cardEl) {
	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
		powerPreference: "high-performance",
	});

	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
	renderer.setSize(mountEl.clientWidth, mountEl.clientHeight);
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	mountEl.appendChild(renderer.domElement);

	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(
		35,
		mountEl.clientWidth / mountEl.clientHeight,
		0.1,
		100,
	);
	camera.position.set(0, 0.55, 5.4);

	const group = new THREE.Group();
	scene.add(group);

	const uniforms = {
		uTime: { value: 0 },
		uResolution: {
			value: new THREE.Vector2(mountEl.clientWidth, mountEl.clientHeight),
		},
		uMouse: { value: new THREE.Vector2(0.5, 0.5) },
		uClickPos: { value: new THREE.Vector2(0.5, 0.5) },
		uClickTime: { value: -10 },
		uCardInfluence: { value: new THREE.Vector2(0.5, 0.52) },
		uCardSize: { value: new THREE.Vector2(0.34, 0.22) },
		uBaseColor: { value: new THREE.Color("#8adfff") },
		uDeepColor: { value: new THREE.Color("#70c7ea") },
		uHighlightColor: { value: new THREE.Color("#f7fdff") },
		uGlowColor: { value: new THREE.Color("#d7f3ff") },
	};

	const geometry = new THREE.PlaneGeometry(8.8, 5.8, 260, 190);

	const material = new THREE.ShaderMaterial({
		uniforms,
		transparent: true,
		vertexShader: `
			uniform float uTime;
			uniform vec2 uMouse;
			uniform vec2 uClickPos;
			uniform float uClickTime;
			uniform vec2 uCardInfluence;
			uniform vec2 uCardSize;

			varying vec2 vUv;
			varying float vWave;
			varying float vCardMask;
			varying vec3 vWorldPos;

			float waveA(vec2 p, float t) {
				return sin(p.x * 2.2 + t * 1.05) * 0.08;
			}

			float waveB(vec2 p, float t) {
				return cos(p.y * 3.3 - t * 0.85) * 0.05;
			}

			float waveC(vec2 p, float t) {
				return sin((p.x + p.y) * 4.2 - t * 1.2) * 0.03;
			}

			float ripple(vec2 p, vec2 center, float radius, float strength, float t) {
				float d = distance(p, center);
				float ring = sin(24.0 * d - t * 4.5);
				float falloff = exp(-radius * d * 5.0);
				return ring * falloff * strength;
			}

			float clickRipple(vec2 uv, vec2 center, float dt) {
				if (dt < 0.0) return 0.0;
				float d = distance(uv, center);
				float front = 1.0 - smoothstep(dt * 0.75, dt * 0.75 + 0.12, d);
				float ring = sin(42.0 * d - dt * 10.0);
				float fade = exp(-dt * 1.35);
				return ring * front * fade * 0.09;
			}

			void main() {
				vUv = uv;

				vec3 pos = position;
				float t = uTime;
				float wave = 0.0;

				wave += waveA(pos.xz + vec2(pos.y, pos.x) * 0.1, t);
				wave += waveB(pos.xy, t);
				wave += waveC(pos.xy * 0.8, t);

				vec2 mouse = vec2(
					mix(-1.0, 1.0, uMouse.x),
					mix(-1.0, 1.0, 1.0 - uMouse.y)
				);

				wave += ripple(pos.xy * 0.28, mouse * 0.65, 1.5, 0.055, t);

				vec2 cardCenter = vec2(
					mix(-1.0, 1.0, uCardInfluence.x),
					mix(-1.0, 1.0, 1.0 - uCardInfluence.y)
				);

				float cardRipple = ripple(pos.xy * 0.24, cardCenter * 0.55, 1.0, 0.03, t * 0.8);
				wave += cardRipple;

				float dt = uTime - uClickTime;
				wave += clickRipple(uv, uClickPos, dt);

				pos.z += wave;
				pos.y += sin(pos.x * 1.2 + t * 0.45) * 0.015;

				vWave = wave;

				vec2 uvCenterDist = abs(uv - uCardInfluence);
				float softRect =
					1.0 -
					smoothstep(uCardSize.x, uCardSize.x + 0.08, uvCenterDist.x) *
					smoothstep(uCardSize.y, uCardSize.y + 0.08, uvCenterDist.y);

				vCardMask = clamp(softRect, 0.0, 1.0);

				vec4 world = modelMatrix * vec4(pos, 1.0);
				vWorldPos = world.xyz;

				gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
			}
		`,
		fragmentShader: `
			uniform float uTime;
			uniform vec2 uResolution;
			uniform vec2 uMouse;
			uniform vec3 uBaseColor;
			uniform vec3 uDeepColor;
			uniform vec3 uHighlightColor;
			uniform vec3 uGlowColor;

			varying vec2 vUv;
			varying float vWave;
			varying float vCardMask;
			varying vec3 vWorldPos;

			float hash(vec2 p) {
				return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
			}

			float noise(vec2 p) {
				vec2 i = floor(p);
				vec2 f = fract(p);

				float a = hash(i);
				float b = hash(i + vec2(1.0, 0.0));
				float c = hash(i + vec2(0.0, 1.0));
				float d = hash(i + vec2(1.0, 1.0));

				vec2 u = f * f * (3.0 - 2.0 * f);

				return mix(a, b, u.x) +
					(c - a) * u.y * (1.0 - u.x) +
					(d - b) * u.x * u.y;
			}

			float fbm(vec2 p) {
				float value = 0.0;
				float amp = 0.5;
				for (int i = 0; i < 5; i++) {
					value += amp * noise(p);
					p *= 2.0;
					amp *= 0.5;
				}
				return value;
			}

			void main() {
				vec2 uv = vUv;
				float t = uTime;

				vec2 flowUv = uv;
				flowUv.x += sin(uv.y * 8.0 + t * 0.45) * 0.015;
				flowUv.y += cos(uv.x * 7.5 - t * 0.38) * 0.012;

				float largeNoise = fbm(flowUv * 2.4 + vec2(t * 0.04, -t * 0.03));
				float medNoise = fbm(flowUv * 5.5 + vec2(-t * 0.07, t * 0.06));
				float fineNoise = fbm(flowUv * 12.0 + vec2(t * 0.12, t * 0.10));

				float shimmerBands = sin((uv.x + uv.y) * 24.0 - t * 1.7) * 0.5 + 0.5;

				float caustic =
					smoothstep(0.62, 0.95, medNoise + fineNoise * 0.32) *
					(0.45 + 0.55 * shimmerBands);

				float glow =
					smoothstep(0.4, 1.0, largeNoise) * 0.18 +
					smoothstep(0.68, 1.0, medNoise) * 0.14;

				vec3 color = mix(uDeepColor, uBaseColor, uv.y * 0.8 + 0.2);
				color = mix(color, uGlowColor, glow);
				color += uHighlightColor * caustic * 0.36;

				float centerGlow = 1.0 - distance(uv, vec2(0.5, 0.5));
				color += vec3(0.08, 0.10, 0.12) * pow(centerGlow, 2.2);

				float waveHighlight = smoothstep(0.02, 0.1, vWave + 0.04);
				color += uHighlightColor * waveHighlight * 0.25;

				float reflection = smoothstep(0.0, 0.3, vCardMask);
				color += vec3(0.8, 0.9, 1.0) * reflection * 0.05;
				color += uHighlightColor * vCardMask * 0.08;

				float vignette = smoothstep(0.95, 0.2, distance(uv, vec2(0.5)));
				color *= vignette;

				gl_FragColor = vec4(color, 0.96);
			}
		`,
	});

	const waterMesh = new THREE.Mesh(geometry, material);
	waterMesh.rotation.x = -1.08;
	waterMesh.position.y = -1.05;
	waterMesh.position.z = -0.25;
	group.add(waterMesh);

	// Ensure water plane always fills screen by scaling for the camera frustum.
	const baseWaterSize = { width: 8.8, height: 5.8 };
	function updateWaterExtent() {
		const distanceToPlane = Math.abs(camera.position.z - waterMesh.position.z);
		const vFovRad = (camera.fov * Math.PI) / 180;
		const frustumHeight = 2 * Math.tan(vFovRad / 2) * distanceToPlane;
		const frustumWidth = frustumHeight * camera.aspect;

		const widthScale = (frustumWidth * 1.2) / baseWaterSize.width;
		const heightScale = (frustumHeight * 1.2) / baseWaterSize.height;
		const maxScale = Math.max(widthScale, heightScale, 1);

		waterMesh.scale.set(maxScale, maxScale, 1);
	}

	const glowGeometry = new THREE.PlaneGeometry(7.8, 4.6, 1, 1);
	const glowMaterial = new THREE.ShaderMaterial({
		transparent: true,
		depthWrite: false,
		uniforms: {
			uTime: uniforms.uTime,
		},
		vertexShader: `
			varying vec2 vUv;
			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`,
		fragmentShader: `
			uniform float uTime;
			varying vec2 vUv;

			void main() {
				vec2 uv = vUv - 0.5;
				float d = length(uv * vec2(1.0, 1.4));
				float pulse = 0.5 + 0.5 * sin(uTime * 0.7);
				float a = smoothstep(0.48, 0.0, d) * (0.12 + pulse * 0.03);
				gl_FragColor = vec4(0.78, 0.93, 1.0, a);
			}
		`,
	});

	const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
	glowMesh.position.set(0, -0.25, -0.75);
	group.add(glowMesh);

	const mistGeometry = new THREE.PlaneGeometry(8.6, 5.4, 1, 1);
	const mistMaterial = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0.055,
		depthWrite: false,
	});

	const mistMesh = new THREE.Mesh(mistGeometry, mistMaterial);
	mistMesh.position.set(0, 0.15, 0.55);
	scene.add(mistMesh);

	const ambient = new THREE.AmbientLight(0xffffff, 1.35);
	scene.add(ambient);

	const keyLight = new THREE.DirectionalLight(0xf6fdff, 1.1);
	keyLight.position.set(2.5, 4, 3.5);
	scene.add(keyLight);

	const fillLight = new THREE.DirectionalLight(0xdff6ff, 0.55);
	fillLight.position.set(-3, 1.2, 2.5);
	scene.add(fillLight);

	const clock = new THREE.Clock();

	let mouseTargetX = 0.5;
	let mouseTargetY = 0.5;
	let mouseCurrentX = 0.5;
	let mouseCurrentY = 0.5;

	let duck = null;
	let duckMixer = null;
	let duckShadow = null;

    let duckPressTime = -10;
	let duckPressStrength = 0;

	const loader = new GLTFLoader();
	loader.load(
		"/models/duck.glb",
		(gltf) => {
			duck = gltf.scene;

			duck.scale.setScalar(1.35);
			duck.position.set(-1.55, -0.95, 1.15);
			duck.rotation.set(0.08, 0.55, -0.16);

			scene.add(duck);

			if (gltf.animations && gltf.animations.length > 0) {
				duckMixer = new THREE.AnimationMixer(duck);
				gltf.animations.forEach((clip) => duckMixer.clipAction(clip).play());
			}

			const shadowGeometry = new THREE.CircleGeometry(0.72, 40);
			const shadowMaterial = new THREE.MeshBasicMaterial({
				color: 0x000000,
				transparent: true,
				opacity: 0.18,
				depthWrite: false,
			});

			duckShadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
			duckShadow.rotation.x = -Math.PI / 2;
			duckShadow.position.set(-1.42, -1.28, 0.92);

			scene.add(duckShadow);
		},
		undefined,
		(error) => {
			console.warn("duck.glb failed to load", error);
		},
	);

	function updateCardInfluence() {
		const rootRect = sceneRoot.getBoundingClientRect();
		const cardRect = cardEl.getBoundingClientRect();

		const centerX =
			(cardRect.left + cardRect.width * 0.5 - rootRect.left) / rootRect.width;
		const centerY =
			(cardRect.top + cardRect.height * 0.5 - rootRect.top) / rootRect.height;

		const sizeX = (cardRect.width / rootRect.width) * 0.5;
		const sizeY = (cardRect.height / rootRect.height) * 0.5;

		uniforms.uCardInfluence.value.set(centerX, centerY);
		uniforms.uCardSize.value.set(sizeX, sizeY);
	}

	function onPointerMove(e) {
		const rect = sceneRoot.getBoundingClientRect();
		mouseTargetX = (e.clientX - rect.left) / rect.width;
		mouseTargetY = (e.clientY - rect.top) / rect.height;
	}

	function onPointerLeave() {
		mouseTargetX = 0.5;
		mouseTargetY = 0.5;
	}

	function onClick(e) {
		const rect = sceneRoot.getBoundingClientRect();
		uniforms.uClickPos.value.set(
			(e.clientX - rect.left) / rect.width,
			(e.clientY - rect.top) / rect.height,
		);
		uniforms.uClickTime.value = clock.getElapsedTime();

        duckPressTime = clock.getElapsedTime();
		duckPressStrength = 1.0;
	}

	sceneRoot.addEventListener("mousemove", onPointerMove);
	sceneRoot.addEventListener("mouseleave", onPointerLeave);
	sceneRoot.addEventListener("click", onClick);

	const resizeObserver = new ResizeObserver(() => {
		const width = mountEl.clientWidth;
		const height = mountEl.clientHeight;

		renderer.setSize(width, height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		uniforms.uResolution.value.set(width, height);
		updateCardInfluence();
		updateWaterExtent();
	});

	resizeObserver.observe(mountEl);
	resizeObserver.observe(sceneRoot);
	resizeObserver.observe(cardEl);

	let rafId = 0;

	function render() {
		const elapsed = clock.getElapsedTime();
		const delta = clock.getDelta();

		mouseCurrentX += (mouseTargetX - mouseCurrentX) * 0.045;
		mouseCurrentY += (mouseTargetY - mouseCurrentY) * 0.045;

		uniforms.uTime.value = elapsed;
		uniforms.uMouse.value.set(mouseCurrentX, mouseCurrentY);

		// Non-mouse-dependent floating movement for the water group.
		group.rotation.z = Math.sin(elapsed * 0.18) * 0.025;
		group.rotation.y = Math.sin(elapsed * 0.22) * 0.08;
		group.rotation.x = 0.0; // fixed pitch
		group.position.x = Math.sin(elapsed * 0.15) * 0.05;
		group.position.y = Math.cos(elapsed * 0.13) * 0.03;

		mistMesh.position.y = 0.15 + Math.sin(elapsed * 0.28) * 0.03;
		mistMesh.material.opacity =
			0.045 + (Math.sin(elapsed * 0.55) * 0.5 + 0.5) * 0.015;

		if (duckMixer) {
			duckMixer.update(delta);
		}

		if (duck) {
			const t = elapsed;

			const baseX = -1.55;
			const baseY = -0.95;
			const baseZ = 1.15;

			// Normal idle floating
			const idleX = Math.sin(t * 0.55) * 0.1;
			const idleY = Math.sin(t * 1.05) * 0.07;
			const idleZ = Math.cos(t * 0.6) * 0.03;

			const idleRotX = Math.sin(t * 0.85) * 0.02;
			const idleRotY = Math.sin(t * 0.35) * 0.1;
			const idleRotZ = Math.sin(t * 1.1) * 0.05;

			// Click "pressed into water" response:
			// quick downward dip, then damped up/down oscillation, then settle
			const dtPress = t - duckPressTime;
			let pressY = 0;
			let pressRotX = 0;
			let pressRotZ = 0;
			let pressScaleY = 1;
			let pressScaleXZ = 1;

			if (dtPress >= 0.0 && dtPress < 3.0) {
				const fade = Math.exp(-dtPress * 2.4);              // settles over time
				const osc = Math.sin(dtPress * 12.0);               // fast bobbing
				const initialDip = -Math.exp(-dtPress * 10.0) * 0.16; // immediate push down

				pressY = initialDip + osc * fade * 0.12 * duckPressStrength;
				pressRotX = (-0.22 * Math.exp(-dtPress * 8.0) + osc * fade * 0.05) * duckPressStrength;
				pressRotZ = (Math.sin(dtPress * 10.0) * fade * 0.06) * duckPressStrength;

				// tiny squash/stretch for a soft pressed feel
				pressScaleY = 1.0 - Math.exp(-dtPress * 10.0) * 0.08;
				pressScaleXZ = 1.0 + Math.exp(-dtPress * 10.0) * 0.04;
			}

			duck.position.x = baseX + idleX;
			duck.position.y = baseY + idleY + pressY;
			duck.position.z = baseZ + idleZ;

			duck.rotation.x = 0.08 + idleRotX + pressRotX;
			duck.rotation.y = 0.55 + idleRotY;
			duck.rotation.z = -0.16 + idleRotZ + pressRotZ;

			duck.scale.set(
				1.35 * pressScaleXZ,
				1.35 * pressScaleY,
				1.35 * pressScaleXZ,
			);
		}

		if (duckShadow) {
			const pulse = 1 + Math.sin(elapsed * 1.05) * 0.08;

			const dtPress = elapsed - duckPressTime;
			let shadowSquish = 1.0;
			let shadowOpacityBoost = 0.0;

			if (dtPress >= 0.0 && dtPress < 3.0) {
				const fade = Math.exp(-dtPress * 2.4);
				shadowSquish = 1.0 + Math.exp(-dtPress * 10.0) * 0.18 + fade * 0.08;
				shadowOpacityBoost = Math.exp(-dtPress * 8.0) * 0.08;
			}

			duckShadow.scale.set(
				pulse * shadowSquish,
				pulse * 0.82 * shadowSquish,
				1,
			);

			duckShadow.position.x = -1.42 + Math.sin(elapsed * 0.55) * 0.05;
			duckShadow.position.y = -1.28;
			duckShadow.material.opacity =
				0.15 +
				(Math.sin(elapsed * 1.05) * 0.5 + 0.5) * 0.05 +
				shadowOpacityBoost;
		}

		renderer.render(scene, camera);
		rafId = requestAnimationFrame(render);
	}

	updateCardInfluence();
	render();

	return function cleanup() {
		cancelAnimationFrame(rafId);
		resizeObserver.disconnect();

		sceneRoot.removeEventListener("mousemove", onPointerMove);
		sceneRoot.removeEventListener("mouseleave", onPointerLeave);
		sceneRoot.removeEventListener("click", onClick);

		geometry.dispose();
		material.dispose();
		glowGeometry.dispose();
		glowMaterial.dispose();
		mistGeometry.dispose();
		mistMaterial.dispose();

		if (duckMixer) {
			duckMixer.stopAllAction();
			duckMixer = null;
		}

		if (duckShadow) {
			duckShadow.geometry.dispose();
			duckShadow.material.dispose();
			duckShadow = null;
		}

		duck = null;

		renderer.dispose();

		if (renderer.domElement.parentNode === mountEl) {
			mountEl.removeChild(renderer.domElement);
		}
	};
}