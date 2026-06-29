import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import {
    Film, Clapperboard, Bone, Hand, Crosshair, RefreshCw, Package,
    BookOpen, Play, Award, ChevronLeft, ChevronRight, Eye, EyeOff, Check,
    RotateCcw, Sparkles, Move3d,
} from "lucide-react";

/* ============================================================
   BLENDER PARA SHOOTERS — animación de armas en primera persona
   Tema Blender (gris + naranja) · viewports 3D reales (Three.js).
   Progreso en localStorage (blender_progress_v1).
   40% teoría (con ejemplos 3D interactivos) · 60% práctica.
   ============================================================ */

const SAVE_KEY = "blender_progress_v1";
const ORANGE = 0xe87d0d;   // naranja Blender
const BLUE = 0x4a82c4;     // azul de selección Blender

/* ====================================================================
   VIEWPORT 3D — un mini-Blender en vivo. Arrastra para orbitar.
   scene: "transform" | "keyframe" | "rig" | "ik" | "bounce" | "recoil"
   ==================================================================== */
function Viewport3D({ scene = "transform", caption }) {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;
        let raf, ro;
        let renderer;
        try {
            const W = mount.clientWidth || 600, H = 280;
            const sc = new THREE.Scene();
            sc.background = new THREE.Color(0x232323); // viewport Blender

            const cam = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
            // órbita manual
            let az = 0.7, pol = 1.15, dist = 7;
            const target = new THREE.Vector3(0, 0.6, 0);
            const placeCam = () => {
                cam.position.set(
                    target.x + dist * Math.sin(pol) * Math.cos(az),
                    target.y + dist * Math.cos(pol),
                    target.z + dist * Math.sin(pol) * Math.sin(az)
                );
                cam.lookAt(target);
            };
            placeCam();

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(W, H);
            mount.appendChild(renderer.domElement);
            renderer.domElement.style.display = "block";
            renderer.domElement.style.cursor = "grab";

            // luces
            sc.add(new THREE.HemisphereLight(0xffffff, 0x303030, 1.05));
            const dir = new THREE.DirectionalLight(0xffffff, 1.2);
            dir.position.set(4, 8, 5);
            sc.add(dir);

            // piso estilo Blender: grid con ejes X(rojo) Y(verde)
            const grid = new THREE.GridHelper(12, 12, 0x4a4a4a, 0x333333);
            sc.add(grid);
            const axes = new THREE.AxesHelper(2.2); // X rojo, Y verde, Z azul
            sc.add(axes);

            const matSel = new THREE.MeshStandardMaterial({ color: 0x9a9a9a, emissive: ORANGE, emissiveIntensity: 0.18, roughness: 0.6, metalness: 0.1 });
            const matGrey = new THREE.MeshStandardMaterial({ color: 0x8a8a8a, roughness: 0.7, metalness: 0.1 });
            const matBlue = new THREE.MeshStandardMaterial({ color: 0x6f9bd6, emissive: BLUE, emissiveIntensity: 0.2, roughness: 0.6 });

            // helper: orienta un "hueso" (box alargado en Y) entre a y b
            const up = new THREE.Vector3(0, 1, 0);
            const orientBone = (mesh, a, b) => {
                const d = new THREE.Vector3().subVectors(b, a);
                const len = d.length() || 0.0001;
                mesh.position.copy(a).addScaledVector(d, 0.5);
                mesh.scale.set(1, len, 1);
                mesh.quaternion.setFromUnitVectors(up, d.clone().normalize());
            };
            const makeBone = (mat) => {
                const m = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1, 0.22), mat);
                sc.add(m); return m;
            };
            const makeJoint = (r, mat) => {
                const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), mat);
                sc.add(m); return m;
            };

            /* ---- construcción según escena ---- */
            let cube, bone1, bone2, j0, j1, j2, target3, ball, gun, flash;

            if (scene === "transform") {
                cube = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), matSel);
                cube.position.y = 0.7; sc.add(cube);
            } else if (scene === "keyframe" || scene === "bounce") {
                ball = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 24), matSel);
                sc.add(ball);
                // fantasmas en las poses clave (arriba/abajo)
                const ghostMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.12, roughness: 1 });
                const gTop = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), ghostMat); gTop.position.set(0, 2.6, 0); sc.add(gTop);
                const gBot = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), ghostMat); gBot.position.set(0, 0.6, 0); sc.add(gBot);
            } else if (scene === "rig") {
                bone1 = makeBone(matSel); bone2 = makeBone(matBlue);
                j0 = makeJoint(0.18, matGrey); j1 = makeJoint(0.16, matGrey); j2 = makeJoint(0.16, matGrey);
            } else if (scene === "ik") {
                bone1 = makeBone(matSel); bone2 = makeBone(matSel);
                j0 = makeJoint(0.18, matGrey); j1 = makeJoint(0.16, matGrey);
                target3 = makeJoint(0.22, matBlue);
            } else if (scene === "recoil") {
                gun = new THREE.Group();
                const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 2.6), matSel); body.position.z = -0.2;
                const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.4, 16), matGrey);
                barrel.rotation.x = Math.PI / 2; barrel.position.set(0, 0.08, -1.6);
                const grip = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.5), matGrey); grip.position.set(0, -0.55, 0.5); grip.rotation.x = 0.3;
                gun.add(body, barrel, grip); gun.position.y = 0.9; sc.add(gun);
                flash = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12),
                    new THREE.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: 0 }));
                flash.position.set(0, 0.98, -2.4); sc.add(flash);
            }

            /* ---- animación ---- */
            const clock = new THREE.Clock();
            const easeInOut = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

            const tick = () => {
                const t = clock.getElapsedTime();

                if (scene === "transform" && cube) {
                    const phase = Math.floor(t / 2) % 3;
                    const k = (t / 2) % 1;
                    cube.position.set(0, 0.7, 0); cube.rotation.set(0, 0, 0); cube.scale.set(1, 1, 1);
                    if (phase === 0) cube.position.x = Math.sin(k * Math.PI * 2) * 1.6;          // G (mover)
                    else if (phase === 1) cube.rotation.y = k * Math.PI * 2;                      // R (rotar)
                    else { const s = 1 + Math.sin(k * Math.PI * 2) * 0.4; cube.scale.set(s, s, s); } // S (escalar)
                }

                if ((scene === "keyframe" || scene === "bounce") && ball) {
                    const k = (t % 2) / 2;             // 0..1
                    const h = Math.abs(Math.sin(k * Math.PI)); // rebote
                    ball.position.y = 0.6 + h * 2.0;
                    const sq = 1 - (1 - h) * 0.35;     // squash al tocar suelo
                    ball.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
                }

                if (scene === "rig" && bone1) {
                    const a1 = -0.3 + Math.sin(t) * 0.5;
                    const a2 = a1 - 0.9 + Math.sin(t * 1.4) * 0.6;
                    const A = new THREE.Vector3(0, 0.4, 0);
                    const B = new THREE.Vector3(A.x + Math.cos(a1) * 1.8, A.y + Math.sin(a1) * 1.8, 0);
                    const C = new THREE.Vector3(B.x + Math.cos(a2) * 1.8, B.y + Math.sin(a2) * 1.8, 0);
                    orientBone(bone1, A, B); orientBone(bone2, B, C);
                    j0.position.copy(A); j1.position.copy(B); j2.position.copy(C);
                }

                if (scene === "ik" && bone1) {
                    const A = new THREE.Vector3(-1.6, 0.5, 0);
                    const T = new THREE.Vector3(1.4 + Math.cos(t) * 0.9, 1.5 + Math.sin(t * 1.3) * 1.1, 0);
                    const L1 = 1.8, L2 = 1.8;
                    let d = A.distanceTo(T);
                    d = Math.max(Math.abs(L1 - L2) + 0.05, Math.min(L1 + L2 - 0.05, d));
                    const dirv = new THREE.Vector3().subVectors(T, A);
                    const base = Math.atan2(dirv.y, dirv.x);
                    let c = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d);
                    c = Math.max(-1, Math.min(1, c));
                    const ang = base - Math.acos(c);
                    const B = new THREE.Vector3(A.x + Math.cos(ang) * L1, A.y + Math.sin(ang) * L1, 0);
                    const Tc = new THREE.Vector3(A.x + Math.cos(base) * d, A.y + Math.sin(base) * d, 0);
                    orientBone(bone1, A, B); orientBone(bone2, B, Tc);
                    j0.position.copy(A); j1.position.copy(B);
                    target3.position.copy(T);
                }

                if (scene === "recoil" && gun) {
                    const k = (t % 1.6) / 1.6;
                    let kick = 0;
                    if (k < 0.06) kick = easeInOut(k / 0.06);
                    else if (k < 0.4) kick = 1 - easeInOut((k - 0.06) / 0.34);
                    gun.position.z = kick * 0.6;
                    gun.rotation.x = -kick * 0.25;
                    flash.material.opacity = k < 0.05 ? 0.9 : Math.max(0, 0.9 - (k / 0.12) * 0.9);
                    flash.scale.setScalar(0.6 + kick * 0.8);
                }

                placeCam();
                renderer.render(sc, cam);
                raf = requestAnimationFrame(tick);
            };
            tick();

            /* ---- interacción: arrastrar para orbitar ---- */
            let dragging = false, px = 0, py = 0;
            const down = (e) => { dragging = true; px = (e.touches ? e.touches[0].clientX : e.clientX); py = (e.touches ? e.touches[0].clientY : e.clientY); renderer.domElement.style.cursor = "grabbing"; };
            const move = (e) => {
                if (!dragging) return;
                const cx = (e.touches ? e.touches[0].clientX : e.clientX);
                const cy = (e.touches ? e.touches[0].clientY : e.clientY);
                az -= (cx - px) * 0.01; pol = Math.max(0.25, Math.min(1.5, pol - (cy - py) * 0.01));
                px = cx; py = cy;
                if (e.touches) e.preventDefault();
            };
            const upE = () => { dragging = false; renderer.domElement.style.cursor = "grab"; };
            renderer.domElement.addEventListener("mousedown", down);
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", upE);
            renderer.domElement.addEventListener("touchstart", down, { passive: true });
            renderer.domElement.addEventListener("touchmove", move, { passive: false });
            window.addEventListener("touchend", upE);

            /* ---- resize ---- */
            ro = new ResizeObserver(() => {
                const w = mount.clientWidth || W;
                cam.aspect = w / H; cam.updateProjectionMatrix();
                renderer.setSize(w, H);
            });
            ro.observe(mount);

            return () => {
                cancelAnimationFrame(raf);
                if (ro) ro.disconnect();
                renderer.domElement.removeEventListener("mousedown", down);
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", upE);
                renderer.domElement.removeEventListener("touchstart", down);
                renderer.domElement.removeEventListener("touchmove", move);
                window.removeEventListener("touchend", upE);
                renderer.dispose();
                if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
            };
        } catch (err) {
            mount.innerHTML = '<div style="padding:30px;text-align:center;color:#a0a0a0;font-size:13px">No se pudo iniciar el viewport 3D (WebGL).</div>';
        }
    }, [scene]);

    return (
        <div className="bl-vp">
            <div className="bl-vp-bar">
                <span className="bl-vp-dot" /> Viewport 3D · <span className="bl-vp-hint">arrastra para orbitar</span>
            </div>
            <div ref={mountRef} className="bl-vp-canvas" />
            {caption && <p className="bl-anim-cap">{caption}</p>}
        </div>
    );
}

/* ====================================================================
   Animaciones 2D ligeras (estados/secuencias donde el 3D no aporta)
   ==================================================================== */
function AnimEasing() {
    return (
        <div className="bl-anim">
            <div className="bl-ease">
                <div className="bl-ease-row"><span className="bl-ease-tag">linear</span><div className="bl-ease-track"><div className="bl-ease-dot lin" /></div></div>
                <div className="bl-ease-row"><span className="bl-ease-tag">ease</span><div className="bl-ease-track"><div className="bl-ease-dot eas" /></div></div>
            </div>
            <p className="bl-anim-cap">El mismo recorrido: <code>linear</code> se siente robótico; con <code>ease in/out</code> arranca y frena, y parece vivo.</p>
        </div>
    );
}

function Sequence({ steps, caption }) {
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((s) => (s + 1) % (steps.length + 1)), 850);
        return () => clearInterval(t);
    }, [steps.length]);
    return (
        <div className="bl-anim">
            <div className="bl-pipe">
                {steps.map((s, idx) => (
                    <React.Fragment key={idx}>
                        <div className={`bl-pipe-stage ${idx < i ? "on" : ""} ${idx === i - 1 ? "active" : ""}`}>{s}</div>
                        {idx < steps.length - 1 && <span className={`bl-pipe-arrow ${idx < i - 1 ? "on" : ""}`}>▸</span>}
                    </React.Fragment>
                ))}
            </div>
            <p className="bl-anim-cap">{caption}</p>
        </div>
    );
}

/* ====================================================================
   CONTENIDO — lecciones (teoría breve + 2 ejercicios c/u + quiz)
   ==================================================================== */
const L = [
    /* ===================== FUNDAMENTOS ===================== */
    {
        id: "b_ui", mod: "Fundamentos", icon: Move3d, mins: "20 min",
        title: "El viewport 3D y las transformaciones",
        intro: "Blender es gratis y hace todo. Para shooters lo primero es moverte en el espacio 3D y dominar las transformaciones básicas: mover, rotar y escalar.",
        theory: [
            { scene3d: "transform", cap: "Ejemplo en vivo: el cubo naranja (seleccionado) hace G (mover en X), luego R (rotar en Y) y luego S (escalar). Los ejes son X=rojo, Y=verde, Z=azul, igual que en Blender." },
            { p: "Cada objeto se transforma con tres acciones. En Blender: G mueve (grab), R rota, S escala. Tras la tecla, escribes X, Y o Z para fijar el eje, y un número para hacerlo exacto." },
            { list: [
                    "G mover · R rotar · S escalar, luego X/Y/Z para fijar eje",
                    "I → insertar keyframe · Tab → Edit / Object Mode",
                    "Numpad 1/3/7 → frente / lado / arriba · Numpad 0 → cámara",
                    "El objeto seleccionado lleva el contorno naranja",
                ] },
            { tip: { icon: "🎯", text: "Antes de animar, pon los FPS de la escena igual a los de tu motor (30 o 60) en Output. Si no, los tiempos no coincidirán al exportar." } },
        ],
        practice: [
            { title: "Configura la escena para juego", goal: "Deja la escena lista para animar y exportar a un motor.",
                steps: ["Output: FPS a 30 (o 60)", "Scene: unidades en metros", "Rango de frames (Start 1, End 60)"],
                solution: `// Output Properties
Frame Rate  -> 30 fps   (o 60, igual que tu motor)
Frame Start -> 1
Frame End   -> 60
// Scene Properties
Unit System -> Metric / Meters
// 1 unidad Blender = 1 metro = escala estándar de motor`, file: "ajustes.txt" },
            { title: "Transforma con precisión", goal: "Mueve, rota y escala fijando ejes (como harás con cada hueso).",
                steps: ["Shift+A → Mesh → Cube", "G Z 2 → sube 2 m", "R Y 45 → rota 45° en Y", "S 0.5 → mitad de tamaño"],
                solution: `Shift+A -> Mesh -> Cube
G  Z  2   Enter   // mueve 2 m en Z
R  Y  45  Enter   // rota 45° en Y
S  0.5    Enter   // escala al 50%
// eje + número = control exacto`, file: "pasos.txt" },
        ],
        quiz: [
            { q: "¿Qué atajo inserta un keyframe?", opts: ["K", "I", "Tab", "S"], correct: 1, fb: "I abre el menú de insertar keyframe (Location, Rotation…)." },
            { q: "¿Qué hace 'G' seguido de 'Z'?", opts: ["Rota en Z", "Mueve restringido al eje Z", "Borra", "Escala en Z"], correct: 1, fb: "G mueve; teclear Z lo restringe a ese eje." },
            { q: "¿De qué color es el eje Y en el viewport?", opts: ["Rojo", "Verde", "Azul", "Naranja"], correct: 1, fb: "X=rojo, Y=verde, Z=azul. El naranja es el objeto seleccionado." },
        ],
    },
    {
        id: "b_keys", mod: "Fundamentos", icon: Clapperboard, mins: "30 min",
        title: "Keyframes, timing y el Graph Editor",
        intro: "Animar es marcar poses en el tiempo; Blender rellena lo de en medio. El timing (cuándo) y el spacing (qué tan separadas) hacen que algo se sienta bien.",
        theory: [
            { scene3d: "keyframe", cap: "Ejemplo en vivo: la esfera interpola entre dos poses clave (los fantasmas translúcidos arriba y abajo). Fíjate en el squash al tocar el suelo: eso da peso." },
            { p: "Pones el objeto en una pose, vas a un frame, presionas I y guardas un keyframe. En otro frame, otra pose. Blender genera el movimiento intermedio." },
            { h: "El Graph Editor: curvas, no líneas rectas" },
            { p: "Cada keyframe tiene interpolación: Constant (salta), Linear (constante, robótico) o Bezier (acelera y frena). En el Graph Editor editas esas curvas para dar ease in / ease out." },
            { anim: "easing" },
            { tip: { icon: "💡", text: "Si tu animación se siente mecánica, casi siempre es porque las curvas están lineales. Dales Bezier y ease." } },
        ],
        practice: [
            { title: "Esfera que rebota", goal: "Anima una caída con rebote usando solo 3 keyframes (como el ejemplo 3D).",
                steps: ["F1: arriba → I → Location", "F12: en el suelo → I → Location", "F24: arriba otra vez → I → Location"],
                solution: `F1   sube la esfera (Z alto)  -> I -> Location
F12  bájala al suelo (Z=0)    -> I -> Location
F24  súbela de nuevo          -> I -> Location
Espacio -> reproduce  // 3 poses = un ciclo de rebote`, file: "pasos.txt" },
            { title: "Quita lo robótico", goal: "Convierte un movimiento lineal en uno con ease en el Graph Editor.",
                steps: ["Abre el Graph Editor", "A → selecciona todo", "T → Bezier", "V → Auto Clamped"],
                solution: `Graph Editor
A            // selecciona todas las curvas
T -> Bezier  // interpolación suave
V -> Auto Clamped   // handles automáticos
// ahora arranca y frena: natural`, file: "pasos.txt" },
        ],
        quiz: [
            { q: "¿Qué interpola Blender entre dos keyframes?", opts: ["Nada", "El movimiento intermedio automáticamente", "Solo el color", "El sonido"], correct: 1, fb: "Marcas poses clave y Blender genera los frames de en medio." },
            { q: "¿Qué interpolación se siente robótica?", opts: ["Bezier", "Linear", "Auto Clamped", "Ease"], correct: 1, fb: "Linear va a velocidad constante: nada real se mueve así." },
            { q: "¿Qué efecto da peso a una pelota que cae?", opts: ["Más polígonos", "Squash & stretch al impactar", "Color rojo", "Más FPS"], correct: 1, fb: "El squash al tocar el suelo comunica peso e impacto." },
        ],
    },

    /* ===================== RIGGING ===================== */
    {
        id: "b_rig", mod: "Rigging", icon: Bone, mins: "30 min",
        title: "Rigging: armaduras, huesos y skinning",
        intro: "Un modelo sin rig es una estatua. La armadura (huesos) es el esqueleto que mueves; el skinning decide qué parte de la malla sigue a cada hueso.",
        theory: [
            { scene3d: "rig", cap: "Ejemplo en vivo: una cadena de 2 huesos (FK). Cada hueso rota y el siguiente cuelga del anterior, formando el brazo. Así funcionan brazos y dedos." },
            { p: "Una Armature es un objeto de huesos. En Edit Mode los acomodas y conectas; en Pose Mode los rotas para animar. Padre→hijo: el hijo sigue al padre." },
            { h: "Skinning: pegar la malla a los huesos" },
            { p: "Seleccionas la malla, luego la armadura, y Ctrl+P → With Automatic Weights. Blender calcula qué vértices sigue cada hueso. Si una zona deforma mal, lo corriges en Weight Paint." },
            { tip: { icon: "🔑", text: "Nombra los huesos con sufijos .L y .R (mano.L, mano.R). Así puedes animar un lado y reflejarlo al otro." } },
        ],
        practice: [
            { title: "Brazo de 2 huesos", goal: "Crea una armadura de brazo (hombro → codo → mano).",
                steps: ["Shift+A → Armature", "Tab → selecciona la punta → E para extruir", "Repite para brazo + antebrazo", "Renombra: brazo.L, antebrazo.L"],
                solution: `Shift+A -> Armature       // hueso inicial
Tab                        // Edit Mode
punta -> E -> arrastra     // antebrazo
punta -> E -> arrastra     // mano
// renombra: brazo.L, antebrazo.L, mano.L`, file: "pasos.txt" },
            { title: "Pega la malla al rig", goal: "Haz que la malla se deforme con los huesos.",
                steps: ["Selecciona la MALLA", "Shift+clic la ARMADURA", "Ctrl+P → With Automatic Weights", "Pose Mode → rota un hueso para probar"],
                solution: `1) clic en la malla
2) Shift+clic en la armadura  // queda activa
3) Ctrl+P -> With Automatic Weights
4) Ctrl+Tab (Pose Mode) -> R rota un hueso
// si se estira feo -> Weight Paint`, file: "pasos.txt" },
        ],
        quiz: [
            { q: "¿En qué modo rotas los huesos para animar?", opts: ["Edit Mode", "Pose Mode", "Weight Paint", "Sculpt"], correct: 1, fb: "Edit Mode acomoda; Pose Mode anima." },
            { q: "¿Qué hace Ctrl+P → With Automatic Weights?", opts: ["Exporta", "Calcula qué vértices sigue cada hueso (skinning)", "Borra huesos", "Crea cámara"], correct: 1, fb: "Es el skinning automático: pega malla a armadura." },
            { q: "¿Por qué usar sufijos .L y .R?", opts: ["Estética", "Para simetría: reflejar poses entre lados", "Obligatorio para exportar", "Pesan menos"], correct: 1, fb: "Permiten copiar/reflejar animación de un lado al otro." },
        ],
    },
    {
        id: "b_ik", mod: "Rigging", icon: Hand, mins: "30 min",
        title: "Rig de arma + manos con IK",
        intro: "En un shooter las manos viven pegadas al arma. Con IK mueves un objetivo y el brazo se acomoda solo: eso mantiene las manos clavadas en el arma.",
        theory: [
            { scene3d: "ik", cap: "Ejemplo en vivo: el objetivo azul se mueve y la cadena de 2 huesos se reorienta sola para alcanzarlo (IK resuelto cada frame). Así clavas las manos al arma." },
            { p: "FK: rotas hombro, codo y muñeca uno por uno. IK (Inverse Kinematics): mueves un objetivo y Blender calcula los ángulos de toda la cadena para alcanzarlo." },
            { h: "El rig de arma típico" },
            { p: "Lo común: el arma manda y las manos la siguen con IK (un objetivo en la empuñadura). Al animar el arma, las manos quedan pegadas sin reanimarlas." },
            { tip: { icon: "⚠️", text: "Para que el codo no se doble al revés, el IK necesita un 'pole target': un objetivo extra que indica hacia dónde apunta el codo." } },
        ],
        practice: [
            { title: "Añade IK al brazo", goal: "Convierte el antebrazo en cadena IK controlada por un objetivo.",
                steps: ["Shift+A → Empty (donde va la mano)", "Pose Mode → selecciona el antebrazo", "Bone Constraint → Inverse Kinematics", "Target = armadura/objetivo · Chain Length = 2"],
                solution: `Shift+A -> Empty (posición de la mano)
Pose Mode -> selecciona "antebrazo.L"
Bone Constraint -> Add -> Inverse Kinematics
   Target       = Empty
   Chain Length = 2   // brazo + antebrazo
// mueve el Empty -> el brazo lo sigue`, file: "pasos.txt" },
            { title: "Empareja el arma a la mano", goal: "Haz que el arma cuelgue del hueso de la mano.",
                steps: ["Selecciona el arma", "Shift+clic armadura → Pose Mode → hueso mano.R", "Ctrl+P → Bone"],
                solution: `1) clic en el arma
2) Shift+clic armadura -> Pose Mode -> hueso "mano.R"
3) Ctrl+P -> Bone
// el arma sigue a la mano`, file: "pasos.txt" },
        ],
        quiz: [
            { q: "¿Qué ventaja da IK para las manos?", opts: ["Es más lento", "Mueves la mano y el brazo se acomoda solo, manos clavadas al arma", "No deforma", "Exporta mejor"], correct: 1, fb: "Con IK las manos siguen un objetivo sin reanimar cada hueso." },
            { q: "¿Para qué sirve el 'pole target'?", opts: ["Iluminar", "Controlar hacia dónde apunta el codo/rodilla", "Exportar FBX", "Color"], correct: 1, fb: "Sin él, la articulación puede doblarse al lado incorrecto." },
            { q: "¿Qué hace Ctrl+P → Bone con el arma seleccionada?", opts: ["La borra", "La empareja a un hueso para que lo siga", "La exporta", "La rota"], correct: 1, fb: "Empareja el arma al hueso de la mano." },
        ],
    },

    /* ===================== ANIMACIÓN ===================== */
    {
        id: "b_princ", mod: "Animación", icon: Sparkles, mins: "25 min",
        title: "Principios de animación aplicados a FPS",
        intro: "Las animaciones de shooter son cortas y contundentes. Importan los principios que dan peso y legibilidad en milisegundos.",
        theory: [
            { scene3d: "bounce", cap: "Ejemplo en vivo: el rebote con squash & stretch. Llega rápido, se aplasta al impactar y se recupera. Ese 'peso' es lo que buscas también en una recarga." },
            { p: "Los que más importan en primera persona: Anticipación (un retroceso antes de la acción), Acción + Overshoot (pasarse un poco del destino) y Settle (asentarse). Eso convierte un movimiento plano en algo con peso." },
            { h: "Timing y spacing" },
            { p: "Timing = cuántos frames dura. Spacing = qué tan separadas las poses (lo rápido/lento). Una recarga arranca rápido, frena al final y tiene un pequeño rebote." },
            { tip: { icon: "💡", text: "Legibilidad primero: como solo se ven manos y arma, exagera las poses clave. Si dudas entre sutil y claro, elige claro." } },
        ],
        practice: [
            { title: "Anticipación + overshoot", goal: "Dale peso al tirón del cargador.",
                steps: ["F1: idle", "F3: sube un poco la mano (anticipación)", "F7: baja PASÁNDOTE (overshoot)", "F10: vuelve a la pose final (settle)"],
                solution: `F1   idle
F3   mano sube 2-3 cm        // anticipación
F7   baja y se pasa          // overshoot
F10  vuelve exacto           // settle`, file: "pasos.txt" },
            { title: "Settle / recuperación", goal: "Agrega un micro-rebote final.",
                steps: ["Llega casi a la pose final", "Pásate 1-2 cm", "Vuelve exacto → micro-rebote"],
                solution: `F18  casi en la pose final
F20  se pasa 1-2 cm
F23  vuelve exacto   // settle = inercia`, file: "pasos.txt" },
        ],
        quiz: [
            { q: "¿Qué es la anticipación?", opts: ["Un retroceso breve antes de la acción", "El final", "Un tipo de luz", "Exportar antes"], correct: 0, fb: "Un movimiento contrario que prepara la acción y le da fuerza." },
            { q: "¿Por qué exagerar las poses en FPS?", opts: ["Pesa menos", "Solo se ven manos y arma: hay que vender la pose rápido", "Obligación de Blender", "Gastar frames"], correct: 1, fb: "El espacio visible es chico; la claridad manda." },
            { q: "¿Qué es el overshoot?", opts: ["Quedarse corto", "Pasarse un poco del destino antes de asentarse", "Disparar", "Un atajo"], correct: 1, fb: "Sobrepasar y volver da sensación de inercia." },
        ],
    },

    /* ===================== SHOOTER ===================== */
    {
        id: "b_core", mod: "Shooter", icon: RefreshCw, mins: "35 min",
        title: "Las animaciones core de un shooter",
        intro: "Todo arma de FPS necesita un set base. Si las tienes todas y loopean bien, ya tienes un arma jugable.",
        theory: [
            { seq: ["Idle", "Saca cargador", "Mete cargador", "Carga (cerrojo)", "Idle"], cap: "Una recarga es una secuencia clara de poses clave. Bloquéalas primero, pule después." },
            { p: "El set mínimo: Idle, Draw/Equip, Holster, Reload, Fire, ADS in/out e Inspect. Cada una es un clip corto independiente." },
            { h: "Idle y Reload, las que más se ven" },
            { p: "El Idle es un loop sutil de respiración: el primer y último frame deben ser idénticos para que loopee sin saltos. El Reload es la secuencia de poses: sacar cargador, meter el nuevo, montar el cerrojo." },
            { tip: { icon: "🔑", text: "Para un loop perfecto, copia el keyframe del frame 1 al último frame del idle. Si no coinciden, verás un salto al reiniciar." } },
        ],
        practice: [
            { title: "Bloquea una recarga", goal: "Define las poses clave del reload antes de pulir.",
                steps: ["F1 idle", "F8 saca cargador", "F16 mete nuevo", "F24 monta cerrojo", "F30 idle"],
                solution: `F1  idle
F8  saca el cargador
F16 mete cargador nuevo
F24 monta cerrojo
F30 idle
// interpolación Constant para ver solo poses, luego Bezier`, file: "pasos.txt" },
            { title: "Idle que loopea", goal: "Respiración sutil que cicle sin saltos.",
                steps: ["F1 pose base → I", "F30 arma baja ~1 cm → I", "F60 copia EXACTA del F1", "Loop y revisa que no salte"],
                solution: `F1  pose base                 -> I
F30 baja el arma ~1 cm        -> I
F60 = copia del F1 (idéntico) -> I
// Dope Sheet: copia keys del F1 al F60 -> loop sin salto`, file: "pasos.txt" },
        ],
        quiz: [
            { q: "¿Cuál NO es del set base de un arma FPS?", opts: ["Idle", "Reload", "Fire", "Renderizar a 4K"], correct: 3, fb: "Renderizar no es una animación; las otras sí." },
            { q: "¿Qué hace que un idle loopee sin salto?", opts: ["Durar 60 frames", "Primer y último frame idénticos", "Ser lineal", "Tener sonido"], correct: 1, fb: "Si frame 1 == frame final, reinicia sin brincos." },
            { q: "¿Qué es el 'blocking'?", opts: ["Exportar", "Definir solo las poses clave antes de pulir", "Borrar", "Iluminar"], correct: 1, fb: "El blocking fija las poses principales; el pulido viene después." },
        ],
    },
    {
        id: "b_fire", mod: "Shooter", icon: Crosshair, mins: "30 min",
        title: "Disparo, recoil y ADS",
        intro: "El disparo es la animación más importante y la más corta. El recoil y el ADS definen cómo se siente el arma en las manos.",
        theory: [
            { scene3d: "recoil", cap: "Ejemplo en vivo: el arma da una patada rápida hacia atrás y arriba con su fogonazo, y se recupera más lento a la pose de reposo. Esa curva de recuperación define el 'peso' del arma." },
            { p: "El Fire dura poquísimo: una patada de 1–2 frames atrás y arriba, y una recuperación más lenta a reposo. La curva de recuperación hace que un arma se sienta pesada o ligera." },
            { h: "ADS: aim down sights" },
            { p: "Apuntar mueve el arma a una pose donde la mira queda alineada con la cámara. Transición rápida (pocos frames) al entrar y salir. En muchos motores el recoil se aplica 'additivo' encima de la animación base." },
            { tip: { icon: "⚠️", text: "El recoil suele exportarse como clip corto y aplicarse additivo en el motor, para sumarse al idle/ADS sin reemplazarlo. La pose clave la defines en Blender." } },
        ],
        practice: [
            { title: "Patada de disparo", goal: "Anima un recoil de retroceso rápido y recuperación.",
                steps: ["F1 reposo → I", "F2 patada: atrás + arriba + leve rotación → I", "F8 recuperación suave a reposo"],
                solution: `F1  reposo                       -> I
F2  arma -Z (atrás) +Y (arriba) +rot -> I
F8  regresa a reposo (ease out)  -> I
// patada brusca (1-2 frames), recuperación más lenta`, file: "pasos.txt" },
            { title: "Pose y transición de ADS", goal: "Crea la pose de apuntado alineada con la cámara.",
                steps: ["Numpad 0 (cámara)", "Alinea la mira con el centro", "F1 cadera → I · F4 ADS → I", "Invierte para salir de ADS"],
                solution: `Numpad 0   // ve por la cámara
// alinea la mira con el centro
F1 pose cadera       -> I
F4 pose ADS (alineada)-> I
// transición de 3-4 frames = ágil`, file: "pasos.txt" },
        ],
        quiz: [
            { q: "¿Cómo es el timing de un recoil?", opts: ["Lento todo", "Patada rápida (1-2 frames) + recuperación más lenta", "Constante", "5 segundos"], correct: 1, fb: "El golpe es brusco; la vuelta a reposo es más suave." },
            { q: "¿Qué define la pose de ADS?", opts: ["Que la mira quede alineada con la cámara", "El color", "Las balas", "La textura"], correct: 0, fb: "Apuntar alinea la mira con el centro de la vista." },
            { q: "¿Por qué el recoil se aplica 'additivo'?", opts: ["Pesa menos", "Para sumarse al idle/ADS sin reemplazar la base", "Blender lo exige", "Para iluminar"], correct: 1, fb: "Additivo = se suma encima de la animación activa." },
        ],
    },

    /* ===================== EXPORT ===================== */
    {
        id: "b_export", mod: "Export", icon: Package, mins: "30 min",
        title: "Exportar a tu motor: FBX, bake y root motion",
        intro: "Una animación perfecta no sirve si el motor no la lee. El export es donde se pierden más horas: bake, escala y ajustes de FBX.",
        theory: [
            { seq: ["Blender", "Bake (IK→keyframes)", "FBX", "Motor"], cap: "Antes de exportar hay que 'hornear' (bake) la animación a keyframes simples para que el motor la entienda." },
            { p: "Las constraints como IK no se exportan tal cual. Bake Action convierte todo a keyframes simples de FK en cada hueso, que es lo que el motor entiende." },
            { h: "Ajustes de FBX que importan" },
            { list: [
                    "Aplica la escala: Ctrl+A → Scale (motor espera escala 1)",
                    "Export: solo Armature + Mesh · 'Add Leaf Bones' OFF",
                    "'Bake Animation' / Sample = ON para clips limpios",
                    "FPS del export = FPS de tu motor",
                ] },
            { tip: { icon: "🔑", text: "Si el arma sale acostada o rotada, casi siempre es el eje Forward/Up del export (Unity vs Unreal) o falta aplicar transforms (Ctrl+A → All Transforms)." } },
        ],
        practice: [
            { title: "Bake de la acción", goal: "Convierte la animación con IK a keyframes exportables.",
                steps: ["Pose Mode → A (todos los huesos)", "Object → Animation → Bake Action", "Visual Keying + Clear Constraints + Only Selected Bones", "Rango = tu Start/End"],
                solution: `Pose Mode -> A
Object -> Animation -> Bake Action...
   Visual Keying      = ON   // respeta el IK
   Clear Constraints  = ON   // quita IK, deja FK
   Only Selected Bones= ON
   Bake Data = Pose
// cada hueso queda con keyframes propios`, file: "pasos.txt" },
            { title: "Checklist de export FBX", goal: "Exporta el clip con ajustes correctos.",
                steps: ["Ctrl+A → All Transforms", "File → Export → FBX", "Armature + Mesh", "Bake Animation ON + FPS correcto"],
                solution: `Ctrl+A -> All Transforms   // escala 1, rot 0
File -> Export -> FBX (.fbx)
   Object Types  -> Armature + Mesh
   Add Leaf Bones-> OFF
   Bake Animation-> ON  (Sampling Rate 1)
// Forward/Up: Unity (-Z fwd, Y up) o Unreal`, file: "ajustes.txt" },
        ],
        quiz: [
            { q: "¿Por qué hacer 'bake' antes de exportar?", opts: ["Iluminar", "Las constraints (IK) no se exportan: se pasan a keyframes", "Borrar la malla", "Cambiar colores"], correct: 1, fb: "Bake Action convierte IK a keyframes de FK que el motor entiende." },
            { q: "¿Qué pasa si no aplicas la escala?", opts: ["Nada", "El objeto puede entrar gigante o diminuto", "Se borra", "Mejora el render"], correct: 1, fb: "El motor espera escala 1; Ctrl+A → Scale la aplica." },
            { q: "Si el arma sale rotada en el motor, ¿qué revisas?", opts: ["El color", "Ejes Forward/Up del export y transforms aplicados", "Número de huesos", "La textura"], correct: 1, fb: "Cada motor espera ejes distintos; eso y los transforms son la causa típica." },
        ],
    },
];

const MODS = [
    { name: "Fundamentos", sub: "Viewport, keyframes y timing", icon: Move3d },
    { name: "Rigging", sub: "Huesos, skinning e IK", icon: Bone },
    { name: "Animación", sub: "Principios para FPS", icon: Sparkles },
    { name: "Shooter", sub: "Idle, reload, fire y ADS", icon: Crosshair },
    { name: "Export", sub: "FBX, bake y a tu motor", icon: Package },
];

const RANKS = [
    { min: 0, name: "Aprendiz" },
    { min: 300, name: "Rigger junior" },
    { min: 700, name: "Animador de armas" },
    { min: 1100, name: "Animador de FPS" },
    { min: 1600, name: "Animador senior" },
];
const rankFor = (xp) => RANKS.filter((r) => xp >= r.min).pop();
const loadSave = () => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } };

/* ---------- componentes de UI ---------- */
function CodeBlock({ code, file }) {
    return (
        <div className="bl-term">
            <div className="bl-term-h">
                <span className="d r" /><span className="d y" /><span className="d g" />
                {file && <span className="bl-file">{file}</span>}
            </div>
            <pre>{code.split("\n").map((line, i) => {
                const ci = line.indexOf("//");
                if (ci >= 0) return <div key={i}><span>{line.slice(0, ci)}</span><span className="cmt">{line.slice(ci)}</span></div>;
                return <div key={i}>{line || "\u00A0"}</div>;
            })}</pre>
        </div>
    );
}

function Theory({ blocks }) {
    return blocks.map((b, i) => {
        if (b.scene3d) return <Viewport3D key={i} scene={b.scene3d} caption={b.cap} />;
        if (b.seq) return <Sequence key={i} steps={b.seq} caption={b.cap} />;
        if (b.anim === "easing") return <AnimEasing key={i} />;
        if (b.p) return <p key={i} className="bl-p">{b.p}</p>;
        if (b.h) return <h3 key={i} className="bl-h3">{b.h}</h3>;
        if (b.code) return <CodeBlock key={i} {...b.code} />;
        if (b.tip) return <div key={i} className="bl-tip"><span className="bl-tip-i">{b.tip.icon}</span><span>{b.tip.text}</span></div>;
        if (b.list) return <ul key={i} className="bl-list">{b.list.map((x, j) => <li key={j}>{x}</li>)}</ul>;
        return null;
    });
}

function Exercise({ ex, n }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bl-ex">
            <div className="bl-ex-top"><span className="bl-ex-n">{n}</span><strong>{ex.title}</strong></div>
            <p className="bl-ex-goal">{ex.goal}</p>
            {ex.steps && <ul className="bl-steps">{ex.steps.map((s, i) => <li key={i}>{s}</li>)}</ul>}
            <button className="bl-reveal" onClick={() => setOpen((o) => !o)}>
                {open ? <EyeOff size={13} /> : <Eye size={13} />} {open ? "Ocultar pasos" : "Ver pasos"}
            </button>
            {open && <CodeBlock code={ex.solution} file={ex.file || "pasos.txt"} />}
        </div>
    );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
.bl{ min-height:100vh; width:100%; font-family:'Inter',system-ui,sans-serif; color:#e8e8e8;
  background:radial-gradient(900px 520px at 82% -10%, rgba(232,125,13,.12), transparent 60%), #1d1d1d; }
.bl *{ box-sizing:border-box; }
.bl-wrap{ max-width:880px; margin:0 auto; padding:38px 22px 90px; }
.bl-head{ text-align:center; margin-bottom:8px; }
.bl-kick{ font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:4px; color:#7a7a7a; }
.bl-title{ font-size:42px; font-weight:800; letter-spacing:-1px; margin:6px 0; }
.bl-title b{ color:#e87d0d; }
.bl-sub{ color:#a0a0a0; font-size:15px; max-width:580px; margin:0 auto; }
.bl-rank{ display:flex; gap:14px; align-items:center; justify-content:center; margin:22px auto; flex-wrap:wrap; }
.bl-rbox{ display:flex; align-items:center; gap:10px; border:1px solid #161616; background:#2b2b2b; border-radius:10px; padding:10px 15px; }
.bl-rl{ font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:2px; color:#7a7a7a; }
.bl-rn{ font-size:16px; font-weight:700; }
.bl-bar{ width:200px; height:8px; border-radius:99px; background:#161616; border:1px solid #383838; overflow:hidden; }
.bl-bar i{ display:block; height:100%; background:linear-gradient(90deg,#e87d0d,#ffb15a); transition:width .6s; }
.bl-modh{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:2px; color:#e87d0d;
  margin:30px 0 12px; display:flex; align-items:center; gap:9px; text-transform:uppercase; }
.bl-modh .ms{ color:#7a7a7a; letter-spacing:0; text-transform:none; font-size:12px; }
.bl-list-lessons{ display:flex; flex-direction:column; gap:10px; }
.bl-lcard{ display:flex; align-items:center; gap:15px; cursor:pointer; border:1px solid #161616; border-radius:12px;
  padding:15px 17px; background:#2b2b2b; transition:.16s; text-align:left; width:100%; color:inherit; font-family:inherit; }
.bl-lcard:hover{ transform:translateX(4px); border-color:#e87d0d; background:#323232; }
.bl-lico{ width:42px; height:42px; border-radius:10px; flex:none; display:grid; place-items:center;
  background:#383838; border:1px solid #161616; color:#e87d0d; }
.bl-lcard.done .bl-lico{ background:rgba(92,200,138,.13); border-color:#5cc88a; color:#5cc88a; }
.bl-lm{ flex:1; min-width:0; }
.bl-lt{ font-size:15.5px; font-weight:700; }
.bl-li{ font-size:13px; color:#a0a0a0; margin-top:2px; }
.bl-lmeta{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#7a7a7a; flex:none; }
.bl-back{ display:inline-flex; align-items:center; gap:6px; background:none; border:none; color:#a0a0a0;
  font-family:'JetBrains Mono',monospace; font-size:12px; cursor:pointer; padding:6px 0; margin-bottom:6px; }
.bl-back:hover{ color:#e87d0d; }
.bl-lhead h2{ font-size:29px; font-weight:800; letter-spacing:-.5px; margin:4px 0 8px; }
.bl-badge{ display:inline-block; font-family:'JetBrains Mono',monospace; font-size:11px; color:#e87d0d;
  background:#2b2b2b; border:1px solid #383838; padding:3px 10px; border-radius:99px; }
.bl-intro{ background:#2b2b2b; border-left:4px solid #e87d0d; border-radius:4px 10px 10px 4px;
  padding:15px 18px; margin:16px 0; color:#cccccc; font-size:15px; line-height:1.6; }
.bl-secl{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:2px; color:#7a7a7a;
  margin:26px 0 10px; display:flex; align-items:center; gap:8px; text-transform:uppercase; }
.bl-p{ font-size:15px; line-height:1.7; color:#cccccc; margin:12px 0; }
.bl-h3{ font-size:17px; font-weight:700; margin:22px 0 4px; color:#e8e8e8; }
.bl-term{ background:#141414; border:1px solid #161616; border-radius:10px; overflow:hidden; margin:14px 0; }
.bl-term-h{ background:#323232; padding:9px 13px; border-bottom:1px solid #161616; display:flex; gap:7px; align-items:center; }
.bl-term-h .d{ width:11px; height:11px; border-radius:50%; } .d.r{ background:#ff5f56; } .d.y{ background:#ffbd2e; } .d.g{ background:#27c93f; }
.bl-file{ margin-left:8px; font-family:'JetBrains Mono',monospace; font-size:11px; color:#7a7a7a; }
.bl-term pre{ margin:0; padding:16px; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.6;
  color:#d8d8d8; overflow-x:auto; } .bl-term pre .cmt{ color:#7a7a7a; font-style:italic; }
.bl-tip{ background:rgba(232,125,13,.07); border-left:4px solid #e87d0d; border-radius:4px 10px 10px 4px;
  padding:13px 16px; margin:16px 0; display:flex; gap:12px; align-items:flex-start; font-size:14px; line-height:1.55; color:#cccccc; }
.bl-tip-i{ font-size:18px; flex:none; }
.bl-list{ margin:12px 0; padding-left:4px; list-style:none; display:flex; flex-direction:column; gap:7px; }
.bl-list li{ font-size:14.5px; color:#cccccc; padding-left:18px; position:relative; line-height:1.5; }
.bl-list li::before{ content:'▸'; position:absolute; left:0; color:#e87d0d; }
.bl-ex{ background:#2b2b2b; border:1px solid #161616; border-radius:12px; padding:18px; margin:12px 0; }
.bl-ex-top{ display:flex; align-items:center; gap:10px; }
.bl-ex-n{ background:#e87d0d; color:#1d1d1d; width:24px; height:24px; border-radius:50%; display:grid;
  place-items:center; font-size:13px; font-weight:800; flex:none; }
.bl-ex-goal{ font-size:14.5px; color:#cccccc; margin:10px 0; line-height:1.55; }
.bl-steps{ margin:8px 0; padding-left:18px; } .bl-steps li{ font-size:13.5px; color:#a0a0a0; margin:4px 0; }
.bl-reveal{ display:inline-flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:12px;
  color:#e87d0d; background:rgba(232,125,13,.1); border:1px solid #383838; border-radius:8px; padding:7px 13px; cursor:pointer; margin-top:6px; }
.bl-reveal:hover{ background:rgba(232,125,13,.18); }
.bl-quiz{ border:1px solid #161616; border-radius:12px; padding:18px; background:#2b2b2b; margin:12px 0; }
.bl-q{ font-size:15.5px; font-weight:600; margin-bottom:11px; }
.bl-opt{ display:block; width:100%; text-align:left; background:#222222; border:1px solid #383838; color:#e8e8e8;
  padding:11px 14px; border-radius:9px; margin:6px 0; font-size:14px; cursor:pointer; transition:.14s; font-family:inherit; }
.bl-opt:hover{ border-color:#e87d0d; }
.bl-opt.ok{ background:rgba(92,200,138,.13); border-color:#5cc88a; color:#aef0c6; }
.bl-opt.no{ background:rgba(255,95,86,.12); border-color:#ff5f56; color:#ffb3ae; }
.bl-fb{ font-size:13.5px; margin-top:9px; line-height:1.5; }
.bl-nav{ display:flex; justify-content:space-between; gap:10px; margin-top:26px; }
.bl-btn{ font-family:'JetBrains Mono',monospace; font-size:13px; padding:11px 17px; border-radius:9px; cursor:pointer;
  border:1px solid #383838; background:#2b2b2b; color:#e8e8e8; display:inline-flex; align-items:center; gap:7px; }
.bl-btn:hover:not(:disabled){ border-color:#e87d0d; } .bl-btn:disabled{ opacity:.3; cursor:default; }
.bl-btn.main{ background:#e87d0d; color:#1d1d1d; border-color:#e87d0d; font-weight:700; }
.bl-foot{ text-align:center; margin-top:34px; }
.bl-reset{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#ff7b72; background:transparent;
  border:1px solid rgba(255,123,114,.3); border-radius:8px; padding:8px 14px; cursor:pointer; }
.bl-reset:hover{ background:rgba(255,123,114,.1); }
.bl-done-tag{ display:inline-flex; align-items:center; gap:6px; color:#5cc88a; font-family:'JetBrains Mono',monospace; font-size:12px; }
@media(max-width:560px){ .bl-title{ font-size:32px; } .bl-lhead h2{ font-size:23px; } }

/* ===== Viewport 3D ===== */
.bl-vp{ border:1px solid #161616; border-radius:10px; overflow:hidden; margin:16px 0; background:#232323; }
.bl-vp-bar{ background:#323232; border-bottom:1px solid #161616; padding:7px 12px; font-family:'JetBrains Mono',monospace;
  font-size:11px; color:#a0a0a0; display:flex; align-items:center; gap:7px; }
.bl-vp-dot{ width:9px; height:9px; border-radius:2px; background:#e87d0d; display:inline-block; }
.bl-vp-hint{ color:#7a7a7a; }
.bl-vp-canvas{ width:100%; height:280px; touch-action:none; }
.bl-anim-cap{ font-size:13px; color:#a0a0a0; line-height:1.55; margin:0; padding:12px 14px; text-align:center; background:#262626; }
.bl-anim-cap code{ background:#1d1d1d; padding:1px 6px; border-radius:5px; font-family:'JetBrains Mono',monospace; font-size:12px; color:#ffb15a; }

/* ===== Animaciones 2D ligeras ===== */
.bl-anim{ background:#222222; border:1px solid #161616; border-radius:10px; padding:18px 18px 14px; margin:16px 0; }
.bl-anim .bl-anim-cap{ background:none; padding:14px 0 2px; }
.bl-ease{ display:flex; flex-direction:column; gap:12px; max-width:320px; margin:0 auto; }
.bl-ease-row{ display:flex; align-items:center; gap:10px; }
.bl-ease-tag{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#7a7a7a; width:48px; flex:none; }
.bl-ease-track{ position:relative; flex:1; height:10px; border-radius:99px; background:#1d1d1d; border:1px solid #383838; }
.bl-ease-dot{ position:absolute; top:50%; width:14px; height:14px; border-radius:50%; transform:translateY(-50%); }
.bl-ease-dot.lin{ background:#7a7a7a; animation:bl-mov 2.4s linear infinite; }
.bl-ease-dot.eas{ background:#e87d0d; animation:bl-mov 2.4s cubic-bezier(.6,0,.4,1) infinite; }
@keyframes bl-mov{ 0%{ left:2px;} 50%{ left:calc(100% - 16px);} 100%{ left:2px;} }
.bl-pipe{ display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:5px; }
.bl-pipe-stage{ font-family:'JetBrains Mono',monospace; font-size:11.5px; padding:9px 12px; border-radius:9px;
  border:1px solid #383838; background:#2b2b2b; color:#a0a0a0; transition:all .3s; text-align:center; }
.bl-pipe-stage.on{ border-color:#e87d0d; background:rgba(232,125,13,.12); color:#ffb15a; }
.bl-pipe-stage.active{ box-shadow:0 0 0 4px rgba(232,125,13,.16); }
.bl-pipe-arrow{ color:#444; font-size:13px; transition:color .3s; }
.bl-pipe-arrow.on{ color:#e87d0d; }
`;

export default function App() {
    const saved = loadSave();
    const [open, setOpen] = useState(null);
    const [read, setRead] = useState(saved.read || {});
    const [quiz, setQuiz] = useState(saved.quiz || {});

    useEffect(() => {
        try { localStorage.setItem(SAVE_KEY, JSON.stringify({ read, quiz })); } catch {}
    }, [read, quiz]);

    const quizPassed = (les) => {
        const a = quiz[les.id]; if (!a) return false;
        return les.quiz.every((q, i) => a[i] === q.correct);
    };
    const isDone = (les) => read[les.id] && quizPassed(les);
    const completas = L.filter(isDone).length;
    const xp = completas * 100 + L.reduce((s, les) => s + ((quiz[les.id] || []).filter((a, i) => a === les.quiz[i]?.correct).length) * 10, 0);
    const rank = rankFor(xp);
    const next = RANKS.find((r) => xp < r.min);
    const pct = next ? Math.min(100, ((xp - rank.min) / (next.min - rank.min)) * 100) : 100;

    const openLesson = (idx) => {
        setOpen(idx);
        setRead((r) => ({ ...r, [L[idx].id]: true }));
        window.scrollTo(0, 0);
    };

    if (open != null) {
        const les = L[open];
        const answers = quiz[les.id] || [];
        const answer = (qi, oi) => {
            setQuiz((prev) => {
                const cur = [...(prev[les.id] || [])];
                if (cur[qi] != null) return prev;
                cur[qi] = oi;
                return { ...prev, [les.id]: cur };
            });
        };
        return (
            <div className="bl">
                <style>{CSS}</style>
                <div className="bl-wrap">
                    <button className="bl-back" onClick={() => setOpen(null)}><ChevronLeft size={15} /> TODAS LAS LECCIONES</button>
                    <div className="bl-lhead">
                        <span className="bl-badge">{les.mod} · {les.mins}</span>
                        <h2>{les.title}</h2>
                    </div>
                    <div className="bl-intro">{les.intro}</div>

                    <div className="bl-secl"><BookOpen size={13} /> TEORÍA</div>
                    <Theory blocks={les.theory} />

                    <div className="bl-secl"><Play size={13} /> PRÁCTICA</div>
                    {les.practice.map((ex, i) => <Exercise key={i} ex={ex} n={i + 1} />)}

                    <div className="bl-secl"><Award size={13} /> QUIZ</div>
                    {les.quiz.map((q, qi) => {
                        const picked = answers[qi];
                        const done = picked != null;
                        return (
                            <div className="bl-quiz" key={qi}>
                                <div className="bl-q">{q.q}</div>
                                {q.opts.map((o, oi) => {
                                    let cls = "bl-opt";
                                    if (done) { if (oi === q.correct) cls += " ok"; else if (oi === picked) cls += " no"; }
                                    return <button key={oi} className={cls} onClick={() => answer(qi, oi)}>{o}</button>;
                                })}
                                {done && (
                                    <div className="bl-fb" style={{ color: picked === q.correct ? "#5cc88a" : "#ff7b72" }}>
                                        {picked === q.correct ? "✓ " : "✗ "}{q.fb}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {isDone(les) && (
                        <div style={{ textAlign: "center", marginTop: 18 }}>
                            <span className="bl-done-tag"><Check size={15} /> ¡Lección completada! +100 XP</span>
                        </div>
                    )}

                    <div className="bl-nav">
                        <button className="bl-btn" disabled={open === 0} onClick={() => openLesson(open - 1)}><ChevronLeft size={15} /> Anterior</button>
                        <button className="bl-btn main" disabled={open === L.length - 1} onClick={() => openLesson(open + 1)}>Siguiente <ChevronRight size={15} /></button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bl">
            <style>{CSS}</style>
            <div className="bl-wrap">
                <div className="bl-head">
                    <div className="bl-kick">// EVOLUTIVE · BLENDER</div>
                    <h1 className="bl-title">BLENDER <b>PARA SHOOTERS</b></h1>
                    <p className="bl-sub">Anima armas en primera persona con ejemplos 3D en vivo: del rig de manos al recoil y el FBX que entra a tu motor.</p>
                </div>

                <div className="bl-rank">
                    <div className="bl-rbox">
                        <Film size={20} color="#e87d0d" />
                        <div><div className="bl-rl">RANGO</div><div className="bl-rn">{rank.name}</div></div>
                    </div>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#7a7a7a", marginBottom: 5 }}>
                            <span>{xp} XP · {completas}/{L.length} lecciones</span>
                            <span>{next ? `→ ${next.name}` : "MÁX"}</span>
                        </div>
                        <div className="bl-bar"><i style={{ width: pct + "%" }} /></div>
                    </div>
                </div>

                {MODS.map((m) => {
                    const lessons = L.map((l, i) => ({ l, i })).filter(({ l }) => l.mod === m.name);
                    return (
                        <div key={m.name}>
                            <div className="bl-modh"><m.icon size={14} /> {m.name} <span className="ms">— {m.sub}</span></div>
                            <div className="bl-list-lessons">
                                {lessons.map(({ l, i }) => {
                                    const done = isDone(l);
                                    const Ico = l.icon;
                                    return (
                                        <button key={l.id} className={`bl-lcard ${done ? "done" : ""}`} onClick={() => openLesson(i)}>
                                            <div className="bl-lico">{done ? <Check size={20} /> : <Ico size={20} />}</div>
                                            <div className="bl-lm">
                                                <div className="bl-lt">{l.title}</div>
                                                <div className="bl-li">{l.intro.slice(0, 72)}…</div>
                                            </div>
                                            <div className="bl-lmeta">{l.mins}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                <div className="bl-foot">
                    <button className="bl-reset" onClick={() => {
                        if (window.confirm("¿Reiniciar el progreso de Blender para Shooters?")) { setRead({}); setQuiz({}); }
                    }}>
                        <RotateCcw size={11} style={{ verticalAlign: "-1px", marginRight: 5 }} /> Reiniciar progreso
                    </button>
                </div>
            </div>
        </div>
    );
}