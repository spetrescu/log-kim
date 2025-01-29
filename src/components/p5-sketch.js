import React, { useRef, useEffect, useState } from "react";
import Sketch from "react-p5";
import { generateRandomColorRamp } from "fettepalette";

const toHslStr = (col, a = 1) =>
  `hsla(${col[0] | 0}, ${(col[1] * 100) | 0}%, ${(col[2] * 100) | 0}%, ${a})`;

function P5Sketch() {
  const gradData = useRef([]);
  const numGradients = 50; // Reduced number of gradients for better performance
  const palette = useRef([]);
  const resizeTimeout = useRef(null);
  const [mousePos, setMousePos] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  // Generate the initial color palette
  useEffect(() => {
    palette.current = generateRandomColorRamp({
      total: 5, // Fewer unique colors
      centerHue: Math.random() * 300,
      hueCycle: Math.random() * 0.8 + 0.2,
      offsetTint: 0.6,
      offsetShade: 0.3,
      minSaturationLight: [0, 0.4],
      colorModel: "hsl",
    }).dark;
    generateGradients();
  }, []);

  // Function to create gradients
  const generateGradients = () => {
    gradData.current = [];

    for (let i = 0; i < numGradients; i++) {
      const pos1 = [
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
      ];
      const pos2 = [
        pos1[0] + Math.random() * 100 - 50,
        pos1[1] + Math.random() * 100 - 50,
      ];
      const r1 = Math.random() * 5 + 1;
      const r2 = Math.random() * 50 + window.innerWidth / 4; // Smaller radius for better performance
      const c1 = toHslStr(
        palette.current[Math.floor(Math.random() * palette.current.length)]
      );
      const c2 = "rgba(0, 0, 0, 0)";

      gradData.current.push({
        pos1,
        pos2,
        r1,
        r2,
        c1,
        c2,
        velocity: [Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1], // Slower velocity
        acceleration: [
          Math.random() * 0.02 - 0.01,
          Math.random() * 0.02 - 0.01,
        ], // Slower acceleration
        colorShiftSpeed: Math.random() * 0.02 + 0.01, // Slower color shift speed
      });
    }
  };

  // Setup canvas
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    p5.frameRate(30); // Lower frame rate for better performance
  };

  // Draw loop
  const draw = (p5) => {
    p5.background(30); // Dark background

    gradData.current.forEach((g) => {
      // Update position with velocity and acceleration
      g.pos1[0] += g.velocity[0];
      g.pos1[1] += g.velocity[1];
      g.pos2[0] += g.velocity[0];
      g.pos2[1] += g.velocity[1];

      g.velocity[0] += g.acceleration[0];
      g.velocity[1] += g.acceleration[1];

      // Apply wraparound if the gradient goes off-screen
      if (g.pos1[0] > p5.width || g.pos1[0] < 0) g.velocity[0] *= -1;
      if (g.pos1[1] > p5.height || g.pos1[1] < 0) g.velocity[1] *= -1;

      // Move gradients away from the mouse
      const dx = g.pos1[0] - mousePos.x;
      const dy = g.pos1[1] - mousePos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 200; // Maximum distance to affect the gradients
      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance;
        g.pos1[0] += dx * force * 0.1;
        g.pos1[1] += dy * force * 0.1;
        g.pos2[0] += dx * force * 0.1;
        g.pos2[1] += dy * force * 0.1;
      }

      // Smoothly change colors over time
      const hueShift = (p5.frameCount * g.colorShiftSpeed) % 360;
      const newColor = toHslStr([
        (parseFloat(g.c1.split(",")[0].replace("hsla(", "")) + hueShift) % 360,
        0.5,
        0.5,
      ]);

      const grad = p5.drawingContext.createRadialGradient(
        g.pos1[0],
        g.pos1[1],
        g.r1,
        g.pos2[0],
        g.pos2[1],
        g.r2
      );

      grad.addColorStop(0, newColor);
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");

      p5.push();
      p5.noStroke();
      p5.drawingContext.fillStyle = grad;
      p5.rect(0, 0, p5.width, p5.height);
      p5.pop();
    });
  };

  // Throttled window resize handler
  const windowResized = (p5) => {
    if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
    resizeTimeout.current = setTimeout(() => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
      generateGradients();
    }, 100); // Throttle resize events to 100ms
  };

  // Mouse move handler
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10">
      <Sketch setup={setup} draw={draw} windowResized={windowResized} />
    </div>
  );
}

export default P5Sketch;
