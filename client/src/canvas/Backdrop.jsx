import React from 'react'
import { easing } from 'maath'
import { useFrame } from '@react-three/fiber'
import { AccumulativeShadows, RandomizedLight} from '@react-three/drei'
import { useRef } from 'react'

const Backdrop = () => {
    const shadows = useRef();

  return (
    <AccumulativeShadows  ref={shadows} temporal frames={60} position={[0,0,-0.14]}>
        <RandomizedLight amount={4}/>
        <RandomizedLight />
    </AccumulativeShadows>
  )
}

export default Backdrop