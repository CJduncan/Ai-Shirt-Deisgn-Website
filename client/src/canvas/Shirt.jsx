import React from 'react';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal,useGLTF, useTexture } from '@react-three/drei';

import { state } from '../store';

const Shirt = () => {
    const snap = useSnapshot(state);
    const { nodes, materials } = useGLTF('/shirt.glb'); 
    const logoTexture = useTexture(snap.logoDecal);
    const fullTexture = useTexture(snap.fullDecal);

    fullTexture.anisotropy = 16;

    useFrame((state,delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta));
    const statesString = JSON.stringify(snap);

  return (
    <group key={statesString}>
        <mesh 
         castShadow geometry={nodes.T_Shirt_male.geometry}
         material={materials.lambert1}
         material-roughness={1}
         dispose={null}
        
        >
            {snap.isFullTexture && (
                <Decal 
                position={[0,0,0]}
                rotation={[0,0,0]}
                scale={[1]}
                map={fullTexture}
                
                />

            )}
            {snap.isLogoTexture && (
                <Decal 
                position={[0,0,0]}
                rotation={[0,0,0]}
                scale={[1]}
                map={fullTexture}
                depthTest={false}
                depthWrite={true}
                
                
                />

            )}
        
           
        
        </mesh>
    </group>
  )
}

export default Shirt