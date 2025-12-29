// Dark Mode Toggle
const toggle=document.querySelector('.dark-mode-toggle');
toggle.addEventListener('click',()=>{
  document.body.classList.toggle('dark');
  toggle.textContent=document.body.classList.contains('dark')?'☀️':'🌙';
});

// Scroll Animations + Smooth Section Transition
const animateEls=document.querySelectorAll('.animate');
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('show');}
  });
},{threshold:0.2});
animateEls.forEach(el=>observer.observe(el));

// Ripple effect for buttons
const buttons=document.querySelectorAll('.btn');
buttons.forEach(btn=>{
  btn.addEventListener('click', e=>{
    const circle=document.createElement('span');
    circle.classList.add('ripple');
    btn.appendChild(circle);
    const d=Math.max(btn.clientWidth,btn.clientHeight);
    circle.style.width=circle.style.height=d+'px';
    const rect=btn.getBoundingClientRect();
    circle.style.left=e.clientX-rect.left-d/2+'px';
    circle.style.top=e.clientY-rect.top-d/2+'px';
    setTimeout(()=>circle.remove(),600);
  });
});

// Particle Background
const hero=document.querySelector('.hero');
const canvas=document.createElement('canvas');
hero.appendChild(canvas);
canvas.style.position='absolute';
canvas.style.top=0;canvas.style.left=0;canvas.style.width='100%';canvas.style.height='100%';
canvas.style.zIndex='0';
const ctx=canvas.getContext('2d');
let particles=[];
const particleCount=60;
function resizeCanvas(){canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;}
window.addEventListener('resize',resizeCanvas);resizeCanvas();
function Particle(){
  this.x=Math.random()*canvas.width;
  this.y=Math.random()*canvas.height;
  this.size=Math.random()*3+1;
  this.speedX=Math.random()*1-0.5;
  this.speedY=Math.random()*1-0.5;
}
Particle.prototype.update=function(){
  this.x+=this.speedX;this.y+=this.speedY;
  if(this.x<0)this.x=canvas.width;
  if(this.x>canvas.width)this.x=0;
  if(this.y<0)this.y=canvas.height;
  if(this.y>canvas.height)this.y=0;
}
Particle.prototype.draw=function(){
  const gradient=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.size*2);
  gradient.addColorStop(0,'rgba(255,255,255,0.8)');
  gradient.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=gradient;
  ctx.beginPath();
  ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
  ctx.fill();
}
for(let i=0;i<particleCount;i++){particles.push(new Particle());}
function animateParticles(){ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{p.update();p.draw();});
  requestAnimationFrame(animateParticles);}
animateParticles();

// Hero Cube 3D
const cubeCanvas=document.createElement('canvas');
hero.appendChild(cubeCanvas);
cubeCanvas.style.position='absolute';
cubeCanvas.style.top=0;cubeCanvas.style.left=0;
cubeCanvas.style.width='100%';cubeCanvas.style.height='100%';
cubeCanvas.style.zIndex='1';

const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(75,hero.offsetWidth/hero.offsetHeight,0.1,1000);
const renderer=new THREE.WebGLRenderer({canvas:cubeCanvas,alpha:true,antialias:true});
renderer.setSize(hero.offsetWidth,hero.offsetHeight);camera.position.z=5;

const light=new THREE.PointLight(0xffffff,1);light.position.set(10,10,10);scene.add(light);
const glowLight=new THREE.PointLight(0xff4d6d,1,10);glowLight.position.set(2,2,2);scene.add(glowLight);

const geometry=new THREE.BoxGeometry(1.5,1.5,1.5);
const material=new THREE.MeshStandardMaterial({color:0xff4d6d});
const cube=new THREE.Mesh(geometry,material);scene.add(cube);

window.addEventListener('resize',()=>{
  renderer.setSize(hero.offsetWidth,hero.offsetHeight);
  camera.aspect=hero.offsetWidth/hero.offsetHeight;
  camera.updateProjectionMatrix();
});

function animateCube(){
  requestAnimationFrame(animateCube);
  cube.rotation.x+=0.01;
  cube.rotation.y+=0.01;
  renderer.render(scene,camera);
}
animateCube();

function animateGlow(){
  const time=Date.now()*0.002;
  const h=(Math.sin(time)+1)/2*0.1+0.05;
  glowLight.color.setHSL(h,1,0.5);
  renderer.setClearColor(new THREE.Color(`hsl(${h*360},50%,5%)`),0);
  requestAnimationFrame(animateGlow);
}
animateGlow();

hero.addEventListener('mousemove',e=>{
  const x=(e.clientX/window.innerWidth-0.5)*2;
  const y=(e.clientY/window.innerHeight-0.5)*2;
  cube.rotation.x=y;
  cube.rotation.y=x;
  hero.querySelector('.hero-text').style.transform=`translate(${x*10}px, ${y*10}px)`;
});

// Scroll Parallax + Smooth Section Transition
window.addEventListener('scroll',()=>{
  const scrollY=window.scrollY;
  hero.querySelector('.hero-text').style.transform=`translateY(${scrollY*0.1}px)`;
  cube.position.y=-scrollY*0.002;
  particles.forEach((p,i)=>{p.y+=Math.sin(scrollY*0.001+i)*0.1;});
});

// Loading Screen Cube
const loadingCubeCanvas=document.getElementById('loading-cube');
const loadingScene=new THREE.Scene();
const loadingCamera=new THREE.PerspectiveCamera(75,1,0.1,1000);
const loadingRenderer=new THREE.WebGLRenderer({canvas:loadingCubeCanvas,alpha:true,antialias:true});
loadingRenderer.setSize(200,200);
loadingCamera.position.z=3;

const loadingGeometry=new THREE.BoxGeometry(1,1,1);
const loadingMaterial=new THREE.MeshStandardMaterial({color:0xff4d6d,metalness:0.7,roughness:0.2});
const loadingCube=new THREE.Mesh(loadingGeometry,loadingMaterial);
loadingScene.add(loadingCube);

const loadingLight=new THREE.PointLight(0xffffff,1.5);
loadingLight.position.set(5,5,5);
loadingScene.add(loadingLight);

function animateLoadingCube(){
  requestAnimationFrame(animateLoadingCube);
  loadingCube.rotation.x+=0.03;
  loadingCube.rotation.y+=0.03;
  loadingRenderer.render(loadingScene,loadingCamera);
}
animateLoadingCube();

window.addEventListener('resize',()=>{
  loadingRenderer.setSize(200,200);
  loadingCamera.aspect=1;
  loadingCamera.updateProjectionMatrix();
});

// Hide Loading Screen After Page Load
window.addEventListener('load',()=>{
  document.body.classList.add('loaded');
});
