import React from "react";

export default function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 6, 5]} intensity={1.4} />
      <pointLight position={[-4, -2, 3]} intensity={0.6} color="#0690d4" />
    </>
  );
}
