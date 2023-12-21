// Canvas creation (although I could have created one in HTML and just called it)
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

// 2D context creation for the canvas
const ctx = canvas.getContext("2d");

// Define the colors white and black
const WHITE = "rgb(255, 255, 255)";
const BLACK = "rgb(0, 0, 0)";

let hue = 0; // Hue variable

// Canvas dimensions
const WIDTH = 1920;
const HEIGHT = 1080;
const RES = [WIDTH, HEIGHT];
const FPS = 60; // Set to 60 fps

// Size of each pixel square (setting up a kind of matrix with each 10x10 square, where each one will have a character inside)
const pixel_width = 10;
const pixel_height = 10;

// Pixel position variables
let x_pixel = 0;
let y_pixel = 0;

// Calculate dimensions in terms of pixel squares
const screen_width = WIDTH / pixel_width;
const screen_height = HEIGHT / pixel_height;
const screen_size = screen_width * screen_height;

// Rotation variables
let A = 0;
let B = 0;

// Angular spacing for donut generation
const theta_spacing = 5;
const phi_spacing = 3;

// Characters representing illumination
const chars = ".,-~:;=!*#$@";

// Donut parameters
const R1 = 10;
const R2 = 20;
const K2 = 200;
const K1 = (screen_height * K2 * 3) / (8 * (R1 + R2));

// Function to convert from HSV color space to RGB
const hsv2rgb = (h, s, v) => {
  return [h, s, v].map((c, i) => Math.round(c * 255));
};

// Function to display text on the canvas
const text_display = (char, x, y) => {
  ctx.fillStyle = `rgb(${hsv2rgb(hue, 1, 1).join(",")})`;
  ctx.font = "bold 10px Arial";
  ctx.fillText(char, x, y);
};

let k = 0;
let paused = false;
let running = true;

// Main update and rendering function
const update = () => {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = BLACK;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Arrays to store the output and depth buffer
  const output = Array(screen_size).fill(" ");
  const zbuffer = Array(screen_size).fill(0);

  // Loop to generate the donut in 3D coordinates
  for (let theta = 0; theta < 628; theta += theta_spacing) {
    for (let phi = 0; phi < 628; phi += phi_spacing) {
      const cosA = Math.cos(A);
      const sinA = Math.sin(A);
      const cosB = Math.cos(B);
      const sinB = Math.sin(B);

      const costheta = Math.cos(theta);
      const sintheta = Math.sin(theta);
      const cosphi = Math.cos(phi);
      const sinphi = Math.sin(phi);

      const circlex = R2 + R1 * costheta;
      const circley = R1 * sintheta;

      const x = circlex * (cosB * cosphi + sinA * sinB * sinphi) - circley * cosA * sinB;
      const y = circlex * (sinB * cosphi - sinA * cosB * sinphi) + circley * cosA * cosB;
      const z = K2 + cosA * circlex * sinphi + circley * sinA;
      const ooz = 1 / z;

      const xp = Math.floor(screen_width / 2 + K1 * ooz * x);
      const yp = Math.floor(screen_height / 2 - K1 * ooz * y);

      const position = xp + screen_width * yp;

      const L =
        cosphi * costheta * sinB -
        cosA * costheta * sinphi -
        sinA * sintheta +
        cosB * (cosA * sintheta - costheta * sinA * sinphi);

      if (ooz > zbuffer[position]) {
        zbuffer[position] = ooz;
        const luminance_index = Math.floor(L * 8);
        output[position] = chars[luminance_index > 0 ? luminance_index : 0];
      }
    }
  }

  // Loop to display the output on the canvas
  for (let i = 0; i < screen_height; i++) {
    y_pixel += pixel_height;
    for (let j = 0; j < screen_width; j++) {
      x_pixel += pixel_width;
      text_display(output[k], x_pixel, y_pixel);
      k++;
    }
    x_pixel = 0;
  }
  y_pixel = 0;
  k = 0;

  A += 0.05;
  B += 0.01;
  hue += 0.005;

  if (!paused) {
    requestAnimationFrame(update);
  }
};

update();

window.addEventListener("resize", () => {
  // Adjust canvas size on window resize
  RES[0] = window.innerWidth;
  RES[1] = window.innerHeight;
  canvas.width = RES[0];
  canvas.height = RES[1];
});
