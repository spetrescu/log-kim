import React, { useEffect } from 'react';
import Sketch from 'react-p5';
import { generateRandomColorRamp } from 'fettepalette';
import './P5Sketch.css';

const toHslStr = (col, a = 1) =>
  `hsla(${col[0] | 0}, ${(col[1] * 100) | 0}%, ${(col[2] * 100) | 0}%, ${a})`;

function P5Sketch() {
  let ctx;
  const gradData = [];
  const numGradients = 100;
  const palette = generateRandomColorRamp({
    total: numGradients,
    centerHue: Math.random() * 300,
    hueCycle: Math.random() * 0.8 + 0.2,
    offsetTint: 0.6,
    offsetShade: 0.3,
    minSaturationLight: [0, 0.5],
    colorModel: 'hsl',
  }).dark;

  const generateGradients = (p5) => {
    console.log(palette)
    gradData.length = 0;

    for (let i = 0; i < numGradients; i++) {
      const pos1 = [Math.random() * p5.windowWidth, Math.random() * p5.windowHeight];
      const pos2 = pos1;
      const r1 = Math.random() * 5 + 1;
      const r2 = Math.random() * 50 + p5.windowWidth / 3;
      const c1 = toHslStr(palette[Math.floor(Math.random() * palette.length)]);
      const c2 = toHslStr(palette[Math.floor(Math.random() * palette.length)], 0);
      gradData.push({ pos1, r1, c1, pos2, r2, c2 });
    }
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    ctx = p5.drawingContext;
    generateGradients(p5);

    const intervalId = setInterval(() => {
      generateGradients(p5);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  };

  const draw = (p5) => {
    if (!ctx) return;

    p5.background(50);

    const grad = ctx.createRadialGradient(
      p5.width / 3,
      p5.height / 2,
      1,
      p5.width / 3,
      p5.height / 2,
      p5.width / 3
    );
    grad.addColorStop(0, 'blue');
    grad.addColorStop(1, 'rgba(255, 255, 0, 0)');

    p5.push();
    p5.noStroke();
    ctx.fillStyle = grad;
    p5.rect(0, 0, p5.width, p5.height);
    p5.pop();

    gradData.forEach((g, i) => {
      const grad = ctx.createRadialGradient(
        g.pos1[0],
        g.pos1[1],
        g.r1,
        g.pos2[0],
        g.pos2[1],
        g.r2
      );
      grad.addColorStop(0, g.c1);
      grad.addColorStop(1, g.c2);

      p5.push();
      p5.noStroke();
      ctx.fillStyle = grad;
      p5.rect(0, 0, p5.width, p5.height);
      p5.pop();
    });
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    generateGradients(p5);
  };

  return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
}

export default P5Sketch;

