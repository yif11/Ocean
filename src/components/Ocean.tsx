import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import Fish from "./Fish";

const Ocean: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const scene = new THREE.Scene();

    useEffect(() => {
        // const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, -80, 30);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current?.appendChild(renderer.domElement);

        const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x05fff });

        const geometry = new THREE.BufferGeometry();
        const lineGeometry = new THREE.BufferGeometry();
        const points: number[] = [];
        const linePositions: number[] = [];

        const rows = 50;
        const cols = 100;
        const spacing = 10;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const x = (j - cols / 2) * spacing;
                const y = (i - rows / 2) * spacing;
                const z = 0;
                points.push(x, y, z);
            }
        }
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));

        const pointCloud = new THREE.Points(geometry, material);
        pointCloud.visible = false;
        scene.add(pointCloud);

        function updateLines() {
            linePositions.length = 0;
            const positions = geometry.attributes.position.array as Float32Array;

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const index = (i * cols + j) * 3;
                    const x = positions[index];
                    const y = positions[index + 1];
                    const z = positions[index + 2];

                    if (j < cols - 1) {
                        linePositions.push(x, y, z, positions[index + 3], positions[index + 4], positions[index + 5]);
                    }
                    if (i < rows - 1) {
                        const belowIndex = ((i + 1) * cols + j) * 3;
                        linePositions.push(x, y, z, positions[belowIndex], positions[belowIndex + 1], positions[belowIndex + 2]);
                    }
                    if (i < rows - 1 && j < cols - 1) {
                        const diagonalIndex = ((i + 1) * cols + (j + 1)) * 3;
                        linePositions.push(x, y, z, positions[diagonalIndex], positions[diagonalIndex + 1], positions[diagonalIndex + 2]);
                    }
                }
            }
            lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
            lineGeometry.attributes.position.needsUpdate = true;
        }

        lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
        const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lineMesh);

        const animate = () => {
            requestAnimationFrame(animate);
            const positions = geometry.attributes.position.array as Float32Array;
            const time = performance.now() * 0.001;

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const index = (i * cols + j) * 3 + 2;
                    positions[index] = (Math.sin(time + i * 0.2) * Math.cos(time * 0.3 + j * 0.2) +
                        Math.sin(time * 0.5 + i * 0.4) * Math.cos(time * 0.6 + j * 0.4)) * 3;
                }
            }
            geometry.attributes.position.needsUpdate = true;
            updateLines();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    // return <div ref={mountRef} />;
    return (
        <div>
            <div ref={mountRef} />
            <Fish scene={scene} />
        </div>
    );
};

export default Ocean;
