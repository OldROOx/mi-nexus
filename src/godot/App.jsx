export default function App() {
    // El curso de Godot es un HTML autónomo (Three.js + editor).
    // Vive en /public/godot-3d.html y lo mostramos dentro de un iframe.
    // Como es del mismo origen, su progreso en localStorage lo puede leer el hub.
    return (
        <iframe
            src="/godot-3d.html"
            title="Godot 3D · de cero a experto"
            style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
        />
    );
}