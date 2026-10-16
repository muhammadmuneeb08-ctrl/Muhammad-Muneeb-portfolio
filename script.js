/**
 * Muhammad Muneeb - AI Automation Engineer Portfolio
 * Interactive Script: Anti-Gravity Canvas, 3D Tilt Physics, Modals & Workflows
 */

document.addEventListener('DOMContentLoaded', () => {
  initGravityCanvas();
  initNavbarScroll();
  initMobileNav();
  initTiltPhysics();
  initProjectFilters();
  initCopyEmail();
  initBackToTop();
  updateCopyrightYear();
});

/* --------------------------------------------------------------------------
   1. ANTI-GRAVITY CANVAS PARTICLE SYSTEM
   -------------------------------------------------------------------------- */
function initGravityCanvas() {
  const canvas = document.getElementById('gravity-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = {
    x: width / 2,
    y: height / 2,
    radius: 140,
    isActive: false
  };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.isActive = true;
  });

  window.addEventListener('mouseout', () => {
    mouse.isActive = false;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 0.8;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 20 + 2;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.color = Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(157, 78, 221, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    draw() {
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      // Natural floating movement
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Anti-Gravity mouse deflection
      if (mouse.isActive) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density;
          const directionY = forceDirectionY * force * this.density;

          this.x -= directionX * 0.6;
          this.y -= directionY * 0.6;
        }
      }
    }
  }

  // Populate particles based on screen size
  const particleCount = Math.min(Math.floor((width * height) / 14000), 85);
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Connect particles with faint gravitational lines
  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          let opacity = 1 - dist / 110;
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.12})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw();
      particles[i].update();
    }
    connect();
    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. NAVBAR SCROLL & ACTIVE STATE
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Add scrolled class for glassmorphism background
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Detection
    let scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. MOBILE NAVIGATION MENU
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggle || !mainNav) return;

  toggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      toggle.classList.remove('active');
    });
  });
}

/* --------------------------------------------------------------------------
   4. 3D TILT PHYSICS (ANTI-GRAVITY INTERACTION)
   -------------------------------------------------------------------------- */
function initTiltPhysics() {
  // Only apply tilt on desktop devices with hover support
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const tiltElements = document.querySelectorAll('.anti-gravity-element');

  tiltElements.forEach((elem) => {
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      // Subtle tilt rotation
      const rotateX = -deltaY * 5;
      const rotateY = deltaX * 5;

      elem.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale3d(1.015, 1.015, 1.015)`;
    });

    elem.addEventListener('mouseleave', () => {
      elem.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
    });
  });
}

/* --------------------------------------------------------------------------
   5. PROJECT FILTER SYSTEM
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. INTERACTIVE ARCHITECTURE MODAL DATA & HANDLERS
   -------------------------------------------------------------------------- */
const projectData = {
  receptionist: {
    tag: 'VOICE & APPOINTMENT ORCHESTRATION',
    title: 'Real Time AI Receptionist',
    summary: 'A sub-second latency conversational assistant built for local service contractors to field inbound calls, extract appointment criteria, and book slots directly to Calendly/Google Calendar.',
    steps: [
      { num: '01', title: 'Inbound Call Event Trigger', desc: 'Twilio/WebRTC webhook triggers n8n workflow pipeline instantly.' },
      { num: '02', title: 'Real-Time Audio Transcription', desc: 'Streamed audio is converted to clean text via OpenAI Whisper in under 300ms.' },
      { num: '03', title: 'Claude 3.5 Intent & Slot Extraction', desc: 'Analyzes user needs, checks schedule availability, and extracts customer contact info.' },
      { num: '04', title: 'Calendar Sync & SMS Confirmation', desc: 'Writes booking into Google Calendar and triggers an SMS reminder to customer and technician.' }
    ],
    metrics: [
      { val: '< 0.8s', label: 'Average Response Latency' },
      { val: '100%', label: 'Zero Dropped After-Hours Calls' }
    ]
  },
  whatsapp: {
    tag: 'OMNICHANNEL MESSAGING AUTOMATION',
    title: 'AI WhatsApp Customer Support & Receptionist',
    summary: 'Direct WhatsApp Business Cloud API integration enabling 24/7 conversational support, instant quote estimates, and seamless escalation to human technicians.',
    steps: [
      { num: '01', title: 'Webhook Ingestion', desc: 'Customer message received via Meta Cloud API and validated against HMAC signature.' },
      { num: '02', title: 'Vector RAG Query (Pinecone)', desc: 'Retrieves relevant business pricing, service FAQs, and company policies in real time.' },
      { num: '03', title: 'GPT-4o Response Synthesis', desc: 'Drafts human-like, courteous replies formatted cleanly with WhatsApp action buttons.' },
      { num: '04', title: 'Conditional Human Escalation', desc: 'If customer expresses urgent frustration or custom requirement, alerts owner via Slack/Gmail.' }
    ],
    metrics: [
      { val: '24/7', label: 'Continuous Instant Resolution' },
      { val: '85%', label: 'Repetitive Inquiries Deflected' }
    ]
  },
  leadgen: {
    tag: 'REVENUE ACCELERATION ENGINE',
    title: 'AI Powered Lead Capture & Onboarding Agent',
    summary: 'An autonomous multi-stage pipeline that ingests web leads, conducts instant AI qualification & scoring, updates the central CRM, and sends tailored onboarding sequences.',
    steps: [
      { num: '01', title: 'Lead Webhook Capture', desc: 'Ingests raw form submissions from website or Meta Lead Ads.' },
      { num: '02', title: 'AI Enrichment & Intent Scoring', desc: 'Claude assesses company size, urgency score, and estimated project budget.' },
      { num: '03', title: 'CRM & Google Sheets Logging', desc: 'Structured JSON data synced to client database with automatic timestamping.' },
      { num: '04', title: 'Personalized Welcome Dispatch', desc: 'Triggers dynamic Gmail onboarding sequence tailored specifically to lead industry.' }
    ],
    metrics: [
      { val: '10 Sec', label: 'Lead Response Time' },
      { val: '3.4x', label: 'Increased Onboarding Conversion' }
    ]
  },
  content: {
    tag: 'AUTONOMOUS MARKETING PIPELINE',
    title: 'AI Powered Content Publishing Agent',
    summary: 'Eliminates hours of repetitive social distribution by ingesting single content prompts and autonomously optimizing and publishing them across Facebook, Instagram, and LinkedIn.',
    steps: [
      { num: '01', title: 'Topic / Article Ingestion', desc: 'Reads source article or audio transcript from Google Drive/Notion.' },
      { num: '02', title: 'Multi-Persona Tone Adaptation', desc: 'Creates professional LinkedIn post, engaging Instagram carousel caption, and snappy Facebook update.' },
      { num: '03', title: 'Hashtag & Visual Optimization', desc: 'Extracts high-performing semantic tags and matches with branded media assets.' },
      { num: '04', title: 'Automated Meta & LinkedIn API Dispatch', desc: 'Schedules and posts directly across all official APIs with error retry loops.' }
    ],
    metrics: [
      { val: '15+ Hrs', label: 'Weekly Marketing Time Saved' },
      { val: '3 Platforms', label: 'Simultaneous One-Click Syndication' }
    ]
  },
  voice: {
    tag: 'REAL-TIME CONVERSATIONAL VOICE',
    title: 'AI Voice Agent',
    summary: 'Ultra-low latency phone assistant specifically tuned for home service emergency calls, capturing addresses, job scopes, and dispatcher alerts in real time.',
    steps: [
      { num: '01', title: 'Telephony Webhook Connection', desc: 'Bi-directional audio stream established via SIP/WebRTC interface.' },
      { num: '02', title: 'Live Voice Activity Detection (VAD)', desc: 'Supports human interruption and natural conversational back-and-forth.' },
      { num: '03', title: 'Job Scope & Emergency Extraction', desc: 'Extracts caller phone number, physical address, and urgency of repair.' },
      { num: '04', title: 'Field Crew Dispatch Broadcast', desc: 'Generates post-call transcript and dispatches push alert to duty technician.' }
    ],
    metrics: [
      { val: '< 650ms', label: 'Voice Response Turnaround' },
      { val: '99.4%', label: 'Transcription Accuracy' }
    ]
  },
  weather: {
    tag: 'CONTEXTUAL TRIGGER AUTOMATION',
    title: 'AI Weather Report Automation',
    summary: 'Automated meteorological watcher executing scheduled cron jobs, synthesizing proactive weather advisories, and alerting clients before freeze/storm events hit.',
    steps: [
      { num: '01', title: 'Scheduled Cron Execution', desc: 'n8n workflow wakes up every morning at 06:00 AM local time.' },
      { num: '02', title: 'Live Meteorological API Fetch', desc: 'Pulls multi-day temperature, precipitation, and freeze warning telemetry.' },
      { num: '03', title: 'AI Advisory Generation', desc: 'GPT-4o generates protective tips (e.g. pipe insulation reminders for homeowners).' },
      { num: '04', title: 'Multi-Channel Alert Broadcast', desc: 'Sends personalized email alerts and WhatsApp broadcasts to customer list.' }
    ],
    metrics: [
      { val: '100%', label: 'Automated Unattended Execution' },
      { val: '0 Extra Cost', label: 'Pure Serverless Cloud Run' }
    ]
  }
};

window.openProjectModal = function(projectId) {
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const data = projectData[projectId];

  if (!data || !modal || !modalBody) return;

  const stepsHTML = data.steps.map(step => `
    <div class="arch-step">
      <div class="arch-step-num">${step.num}</div>
      <div class="arch-step-content">
        <h5>${step.title}</h5>
        <p>${step.desc}</p>
      </div>
    </div>
  `).join('');

  const metricsHTML = data.metrics.map(m => `
    <div class="modal-metric-box">
      <strong>${m.val}</strong>
      <span>${m.label}</span>
    </div>
  `).join('');

  modalBody.innerHTML = `
    <div class="modal-header-tag">${data.tag}</div>
    <h3 class="modal-title">${data.title}</h3>
    <p class="modal-summary">${data.summary}</p>
    
    <div class="arch-flow-diagram">
      ${stepsHTML}
    </div>

    <div class="modal-metrics-grid">
      ${metricsHTML}
    </div>
  `;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

window.closeProjectModal = function() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

// Close modal when clicking backdrop
document.addEventListener('click', (e) => {
  const modal = document.getElementById('projectModal');
  if (modal && e.target === modal) {
    closeProjectModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProjectModal();
  }
});

/* --------------------------------------------------------------------------
   7. COPY EMAIL TO CLIPBOARD & TOAST
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailToCopy = 'muhammadmuneeb8408@gmail.com';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(emailToCopy).then(() => {
      showToast('Email copied to clipboard!');
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
      }, 2000);
    }).catch(() => {
      showToast('Failed to copy. Email: ' + emailToCopy);
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* --------------------------------------------------------------------------
   8. INTERACTIVE CONTACT FORM HANDLER
   -------------------------------------------------------------------------- */
window.handleFormSubmit = function(event) {
  event.preventDefault();

  const name = document.getElementById('userName').value.trim();
  const email = document.getElementById('userEmail').value.trim();
  const businessType = document.getElementById('businessType').value;
  const message = document.getElementById('userMessage').value.trim();
  const submitBtn = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');

  if (!name || !email || !message) return;

  // Visual submission feedback
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing Transmission...';

  setTimeout(() => {
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Inquiry Ready';
    feedback.className = 'form-feedback success';
    feedback.innerHTML = `✓ Thank you, ${name}! Generating direct mail transmission to Muhammad Muneeb...`;

    // Construct mailto URL to launch default mail client
    const subject = encodeURIComponent(`AI Automation Inquiry from ${name} [${businessType}]`);
    const body = encodeURIComponent(
      `Hi Muhammad Muneeb,\n\n` +
      `My Name: ${name}\n` +
      `My Email: ${email}\n` +
      `Industry/Business: ${businessType}\n\n` +
      `Automation Request / Bottleneck:\n${message}\n\n` +
      `Looking forward to hearing from you!`
    );

    const mailtoUrl = `mailto:muhammadmuneeb8408@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Send Inquiry</span> <i class="fa-solid fa-paper-plane"></i>';
    }, 4000);
  }, 1000);
};

/* --------------------------------------------------------------------------
   9. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.style.opacity = '1';
      backToTop.style.visibility = 'visible';
    } else {
      backToTop.style.opacity = '0.4';
    }
  });
}

/* --------------------------------------------------------------------------
   10. COPYRIGHT YEAR
   -------------------------------------------------------------------------- */
function updateCopyrightYear() {
  const yearElem = document.getElementById('currentYear');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}
