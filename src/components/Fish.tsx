import React from "react";
import * as THREE from "three";

interface FishProps {
    scene: THREE.Scene;
}

const Fish: React.FC<FishProps> = ({ scene }) => {
    const createFish = (
        flipX: boolean,
        positionX: number,
        moveToPoint: [number, number],
        shapePoints: [number, number, number, number][]
    ) => {
        const shape = new THREE.Shape();
        shape.moveTo(...moveToPoint);
        for (const curve of shapePoints) {
            shape.quadraticCurveTo(...curve);
        }

        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({ color: 0x9999ff, wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);

        if (flipX) {
            mesh.scale.x = -1;
        }
        mesh.position.x = positionX;
        mesh.rotation.x = Math.PI / 2;
        scene.add(mesh);
    };

    createFish(false, 0, [-0.6, -1], [[0.8, -1, 1.2, 0], [0.8, 1, -0.6, 1], [0.2, 0, -0.6, -1]]);
    createFish(true, -1.6, [-1, -1], [[1.5, -1, 3, 0], [1.5, 1, -1, 1], [0.2, 0, -1, -1]]);
    createFish(false, -5.4, [-0.2, -1], [[0.4, -1, 0.8, 0], [0.4, 1, -0.2, 1], [0.2, 0, -0.2, -1]]);

    return null;
};

export default Fish;
