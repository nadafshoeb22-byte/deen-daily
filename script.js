// Particle Physics Animation Script
// Isse background me golden dots halke se float karenge
function createParticle() {
  const p = document.createElement('div');
  p.style.position = 'absolute';
  p.style.width = '2px';
  p.style.height = '2px';
  p.style.background = 'white';
  p.style.borderRadius = '50%';
  p.style.top = Math.random() * 100 + 'vh';
  p.style.left = Math.random() * 100 + 'vw';
  p.style.opacity = Math.random();
  document.body.appendChild(p);
}
// 50 baar chala do ise start me
for(let i=0; i<50; i++) createParticle();
