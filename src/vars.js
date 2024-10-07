export const gameWindow = {
    width: window.innerWidth,
    height: window.innerHeight
}

export const gameConfig = {
    canvasSize: 55000,
}

export const planetData = {
    mercury: { 
        orbitRadius: 3977.5, 
        speed: 0.0025 * (1 / 0.24),  // Mercury orbits ~4.17x faster than Earth
        startAngle: Math.random() * 2 * Math.PI 
    },
    venus: { 
        orbitRadius: 5500, 
        speed: 0.0025 * (1 / 0.62),  // Venus orbits ~1.61x faster than Earth
        startAngle: Math.random() * 2 * Math.PI 
    },
    earth: { 
        orbitRadius: 7000, 
        speed: 0.0025,  // Earth's baseline speed
        startAngle: Math.random() * 2 * Math.PI 
    },
    mars: { 
        orbitRadius: 9000, 
        speed: 0.0025 * (1 / 1.88),  // Mars orbits ~0.53x the speed of Earth
        startAngle: Math.random() * 2 * Math.PI 
    },
    jupiter: { 
        orbitRadius: 12000, 
        speed: 0.0025 * (1 / 11.86),  // Jupiter orbits ~0.084x the speed of Earth
        startAngle: Math.random() * 2 * Math.PI 
    },
    saturn: { 
        orbitRadius: 16000, 
        speed: 0.0025 * (1 / 29.46),  // Saturn orbits ~0.034x the speed of Earth
        startAngle: Math.random() * 2 * Math.PI 
    },
    uranus: { 
        orbitRadius: 20000, 
        speed: 0.0025 * (1 / 84.01),  // Uranus orbits ~0.012x the speed of Earth
        startAngle: Math.random() * 2 * Math.PI 
    },
    neptune: { 
        orbitRadius: 25000, 
        speed: 0.0025 * (1 / 164.8),  // Neptune orbits ~0.006x the speed of Earth
        startAngle: Math.random() * 2 * Math.PI 
    },
    moon: { 
        orbitRadius: 150, // Distance from Earth
        speed: 0.0075,     // Speed of the Moon (you can adjust this as needed)
        startAngle: Math.random() * 2 * Math.PI 
    }
};