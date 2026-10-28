/* ==========================================================
   NAVIGATION ACTIVE STATE
   ========================================================== */
function setActive(element) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
}

/* ==========================================================
   SCROLL REVEAL ANIMATIONS (Professional Fade-Up)
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const portraitStage = document.getElementById('portrait-stage');
    const alignPortraitGrid = () => {
        if (!portraitStage) return;
        const rect = portraitStage.getBoundingClientRect();
        portraitStage.style.setProperty('--portrait-grid-x', `${-Math.round(rect.left + window.scrollX)}px`);
        portraitStage.style.setProperty('--portrait-grid-y', `${-Math.round(rect.top + window.scrollY)}px`);
    };
    alignPortraitGrid();
    window.addEventListener('scroll', alignPortraitGrid, { passive: true });
    window.addEventListener('resize', alignPortraitGrid);
    window.addEventListener('load', alignPortraitGrid, { once: true });

    const marqueeTrack = document.querySelector('.tech-marquee-track');
    const marqueeGroup = marqueeTrack?.querySelector('.tech-marquee-group');
    if (marqueeTrack && marqueeGroup) {
        const ensureContinuousMarquee = () => {
            const cloneGroup = () => {
                const clone = marqueeGroup.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                marqueeTrack.appendChild(clone);
            };

            while (marqueeTrack.scrollWidth < window.innerWidth * 2) cloneGroup();
            if (marqueeTrack.children.length % 2 !== 0) cloneGroup();

            const travelDistance = marqueeTrack.scrollWidth / 2;
            marqueeTrack.style.setProperty('--ticker-duration', `${Math.max(24, travelDistance / 38)}s`);
        };

        ensureContinuousMarquee();
        window.addEventListener('resize', ensureContinuousMarquee, { passive: true });
    }

    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.1, // Triggers when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px" 
    });

    revealElements.forEach(el => revealObserver.observe(el));

    const navLinks = [...document.querySelectorAll('.nav-item')];
    const pageSections = [...document.querySelectorAll('#home, #about, #services, #projects, #contact')];
    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
        });
    }, { rootMargin: '-35% 0px -55% 0px' });
    pageSections.forEach(section => navObserver.observe(section));

    const statsGrid = document.querySelector('.stats-grid');
    const counters = [...document.querySelectorAll('.stat-number[data-count]')];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animateCounter = (counter, index) => {
        const target = Number(counter.dataset.count);
        const suffix = counter.dataset.suffix || '';
        if (!Number.isFinite(target) || prefersReducedMotion) {
            counter.textContent = `${counter.dataset.count}${suffix}`;
            return;
        }

        const duration = 1200;
        const startTime = performance.now() + index * 130;
        const update = (now) => {
            const progress = Math.min(Math.max((now - startTime) / duration, 0), 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = `${Math.round(target * eased)}${suffix}`;
            if (progress < 1) requestAnimationFrame(update);
        };
        counter.textContent = `0${suffix}`;
        requestAnimationFrame(update);
    };

    if (statsGrid && counters.length) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            if (!entries.some(entry => entry.isIntersecting)) return;
            counters.forEach(animateCounter);
            observer.disconnect();
        }, { threshold: 0.35 });
        statsObserver.observe(statsGrid);
    }

});

/* ==========================================================
   DYNAMIC PROJECT DETAILS MODAL
   ========================================================== */
const projectsData = {
    'p1': {
        title: 'Yellow Bumblebee Corp.',
        badge: 'Enterprise System',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        desc: 'HRIS and asset registry work covering employee record workflows, inventory visibility, and personal data sheets.',
        highlights: ['Employee records and personal data sheets', 'Asset registry and inventory visibility', 'Operational dashboard views'],
        tags: ['Figma', 'UI/UX Design', 'Dashboard', 'React.js', 'Enterprise Architecture']
    },
    'p2': {
        title: 'PDEA Virtual Gallery',
        badge: 'Government Web Portal',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        desc: 'An interactive digital gallery concept for educational modules and historical drug prevention records.',
        highlights: ['Educational content organized into modules', 'Interactive gallery browsing', 'Accessible, straightforward page flow'],
        tags: ['Web Design', 'JavaScript (ES6)', 'Interactive UI', 'HTML5 / CSS3']
    },
    'p3': {
        title: 'OADR HRIS Framework',
        badge: 'HR Management',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        desc: 'An HR management interface concept for employee leave tracking, performance reviews, and administrative workflows.',
        highlights: ['Employee leave tracking', 'Performance review workflows', 'Reusable interface components'],
        tags: ['Design Systems', 'Tailwind CSS', 'Prototyping', 'Component Architecture']
    },
    'p4': {
        title: 'Delivery Pipeline Lab',
        badge: 'DevOps Learning Project',
        image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
        desc: 'Learning track for documenting a simple build, test, and deployment workflow while developing practical DevOps skills.',
        highlights: ['Build and test workflow documentation', 'Deployment process fundamentals', 'Automation and cloud learning goals'],
        tags: ['CI / CD', 'Automation', 'Cloud Fundamentals']
    }
};

function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    const image = document.getElementById('pm-img');
    image.src = data.image;
    image.alt = `${data.title} project preview`;
    document.getElementById('pm-badge').innerText = data.badge;
    document.getElementById('pm-title').textContent = data.title;
    document.getElementById('pm-desc').innerText = data.desc;

    const highlightsContainer = document.getElementById('pm-highlights');
    highlightsContainer.innerHTML = '';
    data.highlights.forEach(highlight => {
        const item = document.createElement('li');
        item.textContent = highlight;
        highlightsContainer.appendChild(item);
    });

    const tagsContainer = document.getElementById('pm-tags');
    tagsContainer.innerHTML = '';
    data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.innerText = tag;
        tagsContainer.appendChild(span);
    });

    document.getElementById('projectDetailsModal').classList.add('active');
}

function closeProjectModal() {
    document.getElementById('projectDetailsModal').classList.remove('active');
}

/* ==========================================================
   DOWNLOAD CV ANIMATED SYSTEM FLOW
   ========================================================== */
function startDownloadProcess() {
    const modal = document.getElementById('downloadModal');
    const progressBar = document.getElementById('downloadProgressBar');
    const percentText = document.getElementById('downloadPercentText');
    const statusText = document.getElementById('downloadStatusText');
    const progressView = document.getElementById('downloadProgressView');
    const successView = document.getElementById('downloadSuccessView');

    if (!modal) return;

    progressView.style.display = 'block';
    successView.style.display = 'none';
    progressBar.style.width = '0%';
    percentText.innerText = '0%';
    statusText.innerText = 'Initializing package...';
    modal.classList.add('active');

    let currentPercent = 0;
    const interval = setInterval(() => {
        currentPercent += Math.floor(Math.random() * 12) + 6;

        if (currentPercent >= 40 && currentPercent < 70) {
            statusText.innerText = 'Compiling resume assets...';
        } else if (currentPercent >= 70 && currentPercent < 100) {
            statusText.innerText = 'Finalizing PDF buffer...';
        }

        if (currentPercent >= 100) {
            currentPercent = 100;
            clearInterval(interval);
            progressBar.style.width = '100%';
            percentText.innerText = '100%';
            statusText.innerText = 'Complete!';

            setTimeout(() => {
                progressView.style.display = 'none';
                successView.style.display = 'block';

                const downloadLink = document.createElement('a');
                downloadLink.href = 'CV/Millbert_Secretario_CV.pdf';
                downloadLink.download = 'Millbert_Secretario_CV.pdf';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }, 450);
        } else {
            progressBar.style.width = currentPercent + '%';
            percentText.innerText = currentPercent + '%';
        }
    }, 120);
}

function closeDownloadModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) modal.classList.remove('active');
}

/* ==========================================================
   CONTACT MODAL FLOW
   ========================================================== */
function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (!modal) return;
    modal.classList.add('active');
    modal.querySelector('.modal-close')?.focus();
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            document.getElementById('contactForm').style.display = 'block';
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('contactFormStatus').textContent = '';
        }, 300);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const status = document.getElementById('contactFormStatus');
    const submitButton = form.querySelector('[type="submit"]');
    const submitLabel = submitButton.querySelector('span');
    const accessKey = form.elements.access_key.value.trim();

    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
        status.textContent = 'Add your Web3Forms access key to enable message delivery.';
        status.classList.add('is-error');
        return;
    }

    status.textContent = '';
    status.classList.remove('is-error');
    submitButton.disabled = true;
    submitLabel.textContent = 'Sending…';

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: { Accept: 'application/json' }
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || 'Message could not be sent.');

        form.style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
    } catch (error) {
        status.textContent = error.message || 'Something went wrong. Please try again.';
        status.classList.add('is-error');
    } finally {
        submitButton.disabled = false;
        submitLabel.textContent = 'Submit Project Details';
    }
}

/* Global Click Event for Modals */
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('contactModal')) closeContactModal();
    if (e.target === document.getElementById('downloadModal')) closeDownloadModal();
    if (e.target === document.getElementById('projectDetailsModal')) closeProjectModal();
});

window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeContactModal();
    closeProjectModal();
    closeDownloadModal();
});

/* ==========================================================
   SCROLL PROJECTS CAROUSEL
   ========================================================== */
function scrollProjects(direction) {
    const wrapper = document.getElementById('projectsWrapper');
    if (!wrapper) return;
    const scrollAmount = 390;
    if (direction === 'left') {
        wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

/* ==========================================================
   CANVAS PARTICLE ENGINE
   ========================================================== */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas?.getContext('2d') ?? null;
const stage = document.getElementById('portrait-stage');

let particles = [];
const mouse = { x: null, y: null, prevX: null, prevY: null, vx: 0, vy: 0, radius: 45 };
let portraitFallbackCanvas = null;
let usePortraitFallback = false;

const portraitImg = new Image();
let portraitAnimationStarted = false;

let drawW = 0, drawH = 0, startX = 0, startY = 0;

class BurstParticle {
    constructor(x, y, color) {
        this.originX = x;
        this.originY = y;
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 2.4;
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.84;
        this.ease = 0.09;
    }

    update() {
        if (mouse.x !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.hypot(dx, dy);

            if (distance < mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (mouse.radius - distance) / mouse.radius;
                this.vx -= Math.cos(angle) * force * 12;
                this.vy -= Math.sin(angle) * force * 12;
                this.vx += mouse.vx * force * 0.35;
                this.vy += mouse.vy * force * 0.35;
            }
        }

        this.vx += (this.originX - this.x) * this.ease;
        this.vy += (this.originY - this.y) * this.ease;
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function initParticles() {
    if (!stage || !canvas || !ctx) return;
    canvas.width = stage.clientWidth;
    canvas.height = stage.clientHeight;
    particles = [];
    portraitFallbackCanvas = null;
    usePortraitFallback = false;

    const scale = Math.min(canvas.width / portraitImg.naturalWidth, canvas.height / portraitImg.naturalHeight) * 1.15;
    drawW = portraitImg.naturalWidth * scale;
    drawH = portraitImg.naturalHeight * scale;
    startX = (canvas.width - drawW) / 2;
    startY = ((canvas.height - drawH) / 2) + 10;

    const offCanvas = document.createElement('canvas');
    offCanvas.width = canvas.width;
    offCanvas.height = canvas.height;
    const offCtx = offCanvas.getContext('2d');
    offCtx.drawImage(portraitImg, startX, startY, drawW, drawH);

    try {
        const imgData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const gap = 4;

        for (let y = 0; y < canvas.height; y += gap) {
            for (let x = 0; x < canvas.width; x += gap) {
                const index = (y * canvas.width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const alpha = data[index + 3];

                const isWhite = r > 235 && g > 235 && b > 235;
                if (alpha > 40 && !isWhite) {
                    particles.push(new BurstParticle(x, y, `rgb(${r},${g},${b})`));
                }
            }
        }
    } catch (e) {
        usePortraitFallback = true;
    }

    if (particles.length === 0) usePortraitFallback = true;

    if (usePortraitFallback) {
        const pixelSize = 4;
        portraitFallbackCanvas = document.createElement('canvas');
        portraitFallbackCanvas.width = Math.max(1, Math.ceil(canvas.width / pixelSize));
        portraitFallbackCanvas.height = Math.max(1, Math.ceil(canvas.height / pixelSize));
        const fallbackCtx = portraitFallbackCanvas.getContext('2d');
        if (fallbackCtx) {
            fallbackCtx.drawImage(
                portraitImg,
                startX / pixelSize,
                startY / pixelSize,
                drawW / pixelSize,
                drawH / pixelSize
            );
        }
    }
}

function startPortraitRenderer() {
    if (!stage || !canvas || !ctx) return;
    if (!stage.clientWidth || !stage.clientHeight) {
        requestAnimationFrame(startPortraitRenderer);
        return;
    }
    initParticles();
    if (!portraitAnimationStarted) {
        portraitAnimationStarted = true;
        animate();
    }
}

portraitImg.onload = startPortraitRenderer;
portraitImg.src = 'My picture/portrait.png';
if (portraitImg.complete && portraitImg.naturalWidth) startPortraitRenderer();

window.addEventListener('resize', () => {
    if (portraitImg.complete && portraitImg.naturalWidth && stage && canvas && ctx) initParticles();
});

if(stage) {
    stage.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const currX = (e.clientX - rect.left) * scaleX;
        const currY = (e.clientY - rect.top) * scaleY;

        if (mouse.prevX !== null) {
            mouse.vx = currX - mouse.prevX;
            mouse.vy = currY - mouse.prevY;
        }
        mouse.x = currX; mouse.y = currY;
        mouse.prevX = currX; mouse.prevY = currY;
    });

    stage.addEventListener('mouseleave', () => {
        mouse.x = null; mouse.y = null; mouse.prevX = null; mouse.vx = 0; mouse.vy = 0;
    });
}

function animate() {
    if (!canvas || !ctx || !stage) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    mouse.vx *= 0.8; mouse.vy *= 0.8;

    if (usePortraitFallback && portraitFallbackCanvas) {
        const pixelSize = 4;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(portraitFallbackCanvas, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = '#000';
        for (let x = pixelSize - 1; x < canvas.width; x += pixelSize) ctx.fillRect(x, 0, 1, canvas.height);
        for (let y = pixelSize - 1; y < canvas.height; y += pixelSize) ctx.fillRect(0, y, canvas.width, 1);
        ctx.globalCompositeOperation = 'source-over';
        ctx.imageSmoothingEnabled = true;
    } else {
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
    }

    if (mouse.x !== null && mouse.y !== null) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius - 5, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(portraitImg, startX, startY, drawW, drawH);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius - 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    requestAnimationFrame(animate);
}
