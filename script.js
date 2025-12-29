window.addEventListener('DOMContentLoaded', () => {

  // Dark Mode Toggle
  const toggle=document.querySelector('.dark-mode-toggle');
  toggle.addEventListener('click',()=>{
    document.body.classList.toggle('dark');
    toggle.textContent=document.body.classList.contains('dark')?'☀️':'🌙';
  });

  // Scroll Animations
  const animateEls=document.querySelectorAll('.animate');
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('show');}
    });
  },{threshold:0.2});
  animateEls.forEach(el=>observer.observe(el));

  // Ripple Buttons
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

  // Particle Hero
  const hero=document.querySelector('.hero');
  const canvas=document.getElementById('hero-canvas');
  const ctx=canvas.getContext('2d');
  let particles=[];
  const particleCount=60;

  function resizeCanvas(){canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight;}
  window.addEventListener('resize',resizeCanvas);resizeCanvas();

  function Particle(){
    this.x=Math.random()*canvas.width;
    this.y=Math.random()*canvas.height;
    this.size=Math.random()*3+1;
    this.speedX=Math.random()*1-0.5;
    this.speedY=Math.random()*1-0.5;
  }
  Particle.prototype.update=function(){
    this.x+=this.speedX; this.y+=this.speedY;
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

  // Hero Cube
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(75,canvas.offsetWidth/canvas.offsetHeight,0.1,1000);
  const renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
  renderer.setSize(canvas.offsetWidth,canvas.offsetHeight);camera.position.z=5;

  const light=new THREE.PointLight(0xffffff,1);light.position.set(10,10,10);scene.add(light);
  const cube=new THREE.Mesh(new THREE.BoxGeometry(1.5,1.5,1.5),
    new THREE.MeshStandardMaterial({color:0xff4d6d}));
  scene.add(cube);

  window.addEventListener('resize',()=>{
    renderer.setSize(canvas.offsetWidth,canvas.offsetHeight);
    camera.aspect=canvas.offsetWidth/canvas.offsetHeight;
    camera.updateProjectionMatrix();
  });

  function animateCube(){
    requestAnimationFrame(animateCube);
    cube.rotation.x+=0.01;
    cube.rotation.y+=0.01;
    renderer.render(scene,camera);
  }
  animateCube();

  // Loading Screen Cube
  const loadingCanvas=document.getElementById('loading-cube');
  const loadScene=new THREE.Scene();
  const loadCamera=new THREE.PerspectiveCamera(75,1,0.1,1000);
  const loadRenderer=new THREE.WebGLRenderer({canvas:loadingCanvas,alpha:true,antialias:true});
  loadRenderer.setSize(200,200); loadCamera.position.z=3;

  const loadCube=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),
    new THREE.MeshStandardMaterial({color:0xff4d6d,metalness:0.7,roughness:0.2}));
  loadScene.add(loadCube);
  const loadLight=new THREE.PointLight(0xffffff,1.5); loadLight.position.set(5,5,5); loadScene.add(loadLight);

  function animateLoadCube(){
    requestAnimationFrame(animateLoadCube);
    loadCube.rotation.x+=0.03;
    loadCube.rotation.y+=0.03;
    loadRenderer.render(loadScene,loadCamera);
  }
  animateLoadCube();

  window.addEventListener('resize',()=>{
    loadRenderer.setSize(200,200);
    loadCamera.aspect=1;
    loadCamera.updateProjectionMatrix();
  });

  window.addEventListener('load',()=>{
    document.body.classList.add('loaded');
  });

});
