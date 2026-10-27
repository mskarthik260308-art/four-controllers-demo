/**
 * Four Controllers - Public Portfolio Application Logic
 * Integrates dynamic rendering, live team count tracking, and reactive updates.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolio();
});

function initPortfolio() {
  renderBrandAndSettings();
  renderTeamCounter();
  renderTeamMembers();
  renderSkills();
  renderProjects('all');
  renderAchievements();
  setupNavigation();
  setupContactForm();
  setupEventListeners();
}

/**
 * Render Brand, Taglines, and Site Settings
 */
function renderBrandAndSettings() {
  const settings = window.Store.getSettings();
  
  // Update Title and Brand
  document.title = `${settings.brandName} | ${settings.tagline}`;
  
  const brandElements = document.querySelectorAll('.dynamic-brand-name');
  brandElements.forEach(el => el.textContent = settings.brandName);

  const heroHeadline = document.getElementById('heroHeadline');
  if (heroHeadline) heroHeadline.textContent = settings.heroHeadline;

  const heroDesc = document.getElementById('heroDesc');
  if (heroDesc) heroDesc.textContent = settings.heroDescription;

  // Stats in Hero
  const statProjects = document.getElementById('statProjects');
  if (statProjects) statProjects.textContent = settings.stats.projectsDelivered + '+';

  const statSatisfaction = document.getElementById('statSatisfaction');
  if (statSatisfaction) statSatisfaction.textContent = settings.stats.clientSatisfaction;

  const statAwards = document.getElementById('statAwards');
  if (statAwards) statAwards.textContent = settings.stats.awardsWon + '+';

  // Contact Info
  const contactEmail = document.getElementById('contactEmail');
  if (contactEmail) contactEmail.textContent = settings.email;

  const contactPhone = document.getElementById('contactPhone');
  if (contactPhone) contactPhone.textContent = settings.phone;

  const contactLocation = document.getElementById('contactLocation');
  if (contactLocation) contactLocation.textContent = settings.location;
}

/**
 * Feature: Live Team Counter Showcase
 * Dynamically synchronizes team member counts across Hero, Header, and Banner
 */
function renderTeamCounter() {
  const members = window.Store.getMembers();
  const count = members.length;

  // Header Pill Counter
  const headerCounter = document.getElementById('headerTeamCount');
  if (headerCounter) {
    headerCounter.textContent = count;
  }

  // Hero Card Big Counter
  const heroCounter = document.getElementById('heroTeamCount');
  if (heroCounter) {
    heroCounter.textContent = count;
    heroCounter.classList.add('bump');
    setTimeout(() => heroCounter.classList.remove('bump'), 400);
  }

  // Team Section Banner Counter
  const bannerCounter = document.getElementById('bannerTeamCount');
  if (bannerCounter) {
    bannerCounter.textContent = count;
  }

  // Hero Avatar Stack Preview
  const stackContainer = document.getElementById('heroAvatarStack');
  if (stackContainer) {
    stackContainer.innerHTML = '';
    const previewMembers = members.slice(0, 4);
    previewMembers.forEach(m => {
      const img = document.createElement('img');
      img.src = m.avatar;
      img.alt = m.name;
      img.className = 'avatar-stack-item';
      img.title = `${m.name} (${m.role})`;
      stackContainer.appendChild(img);
    });

    if (members.length > 4) {
      const more = document.createElement('div');
      more.className = 'avatar-stack-more';
      more.textContent = `+${members.length - 4}`;
      stackContainer.appendChild(more);
    }
  }
}

/**
 * Render Team Members Showcase
 */
function renderTeamMembers() {
  const members = window.Store.getMembers();
  const container = document.getElementById('teamGrid');
  if (!container) return;

  container.innerHTML = '';

  if (members.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <p>No active controllers found. Log into the Admin Portal to add members.</p>
      </div>
    `;
    return;
  }

  members.forEach((member, index) => {
    const card = document.createElement('article');
    card.className = 'controller-card';
    card.setAttribute('data-member-id', member.id);

    // Skills pill tags
    const skillsHtml = (member.skills || [])
      .map(skill => `<span class="controller-skill-tag">${escapeHtml(skill)}</span>`)
      .join('');

    card.innerHTML = `
      <span class="controller-card-badge">${escapeHtml(member.badge || 'Controller')}</span>
      <div class="controller-avatar-wrapper">
        <img class="controller-avatar-img" src="${escapeHtml(member.avatar)}" alt="${escapeHtml(member.name)}" loading="lazy">
        <span class="controller-code-pill">${escapeHtml(member.controllerCode || 'CTRL-0' + (index + 1))}</span>
      </div>
      <h3 class="controller-name">${escapeHtml(member.name)}</h3>
      <div class="controller-role">${escapeHtml(member.role)}</div>
      <div class="controller-department">${escapeHtml(member.department)}</div>
      <p class="controller-bio">${escapeHtml(member.bio)}</p>
      
      <div class="controller-skills-wrap">
        ${skillsHtml}
      </div>

      <div class="controller-footer">
        <div class="controller-socials">
          <a href="${escapeHtml(member.socials?.github || '#')}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" title="GitHub" aria-label="GitHub Profile">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          <a href="${escapeHtml(member.socials?.linkedin || '#')}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" title="LinkedIn" aria-label="LinkedIn Profile">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
          <a href="${escapeHtml(member.socials?.twitter || '#')}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" title="X / Twitter" aria-label="X Profile">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
        <div class="controller-status-indicator">
          <span class="dot"></span>
          <span>${escapeHtml(member.status || 'Active')}</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * Render Skills Matrix with Animated Proficiency Bars
 */
function renderSkills() {
  const skills = window.Store.getSkills();
  const container = document.getElementById('skillsGrid');
  if (!container) return;

  container.innerHTML = '';
  skills.forEach(skill => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
      <span class="skill-category-badge">${escapeHtml(skill.category)}</span>
      <div class="skill-header">
        <h4 class="skill-title">${escapeHtml(skill.name)}</h4>
        <span class="skill-percentage">${skill.level}%</span>
      </div>
      <div class="skill-bar-outer">
        <div class="skill-bar-inner" style="width: 0%" data-target-width="${skill.level}%"></div>
      </div>
      <div class="skill-highlight">${escapeHtml(skill.highlight)}</div>
    `;
    container.appendChild(card);
  });

  // Animate progress bars into view
  setTimeout(() => {
    document.querySelectorAll('.skill-bar-inner').forEach(bar => {
      bar.style.width = bar.getAttribute('data-target-width');
    });
  }, 150);
}

/**
 * Render Filterable Projects
 */
function renderProjects(filterCategory = 'all') {
  const projects = window.Store.getProjects();
  const container = document.getElementById('projectsGrid');
  if (!container) return;

  container.innerHTML = '';

  const filtered = filterCategory === 'all'
    ? projects
    : projects.filter(p => p.category.toLowerCase().includes(filterCategory.toLowerCase()));

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <p>No projects currently under this category.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(project => {
    const card = document.createElement('article');
    card.className = 'project-card';

    const tagsHtml = (project.tags || [])
      .map(tag => `<span class="project-tag">${escapeHtml(tag)}</span>`)
      .join('');

    card.innerHTML = `
      <div class="project-thumbnail-wrapper">
        <img class="project-thumbnail" src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" loading="lazy">
        ${project.featured ? `<span class="project-featured-tag">★ Featured</span>` : ''}
        <span class="project-category-tag">${escapeHtml(project.category)}</span>
      </div>
      <div class="project-body">
        <h3 class="project-title">${escapeHtml(project.title)}</h3>
        <p class="project-desc">${escapeHtml(project.description)}</p>
        <div class="project-tags-row">
          ${tagsHtml}
        </div>
        <div class="project-actions">
          <a href="${escapeHtml(project.demoUrl || '#')}" class="project-link-btn" target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            Live Solution
          </a>
          <a href="${escapeHtml(project.githubUrl || 'https://github.com')}" class="project-link-btn" target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            Source Code
          </a>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * Render Achievements & Honors
 */
function renderAchievements() {
  const achievements = window.Store.getAchievements();
  const container = document.getElementById('achievementsGrid');
  if (!container) return;

  container.innerHTML = '';
  achievements.forEach(ach => {
    const card = document.createElement('div');
    card.className = 'achievement-card';
    card.innerHTML = `
      <div class="achievement-icon-wrap">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
      </div>
      <div>
        <span class="achievement-year">${escapeHtml(ach.year)}</span>
        <h4 class="achievement-title">${escapeHtml(ach.title)}</h4>
        <div class="achievement-org">${escapeHtml(ach.organization)}</div>
      </div>
      <p class="achievement-desc">${escapeHtml(ach.description)}</p>
    `;
    container.appendChild(card);
  });
}

/**
 * Navigation & Scrolling
 */
function setupNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  // Sticky header class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // Projects category filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';
      renderProjects(filter);
    });
  });
}

/**
 * Contact Form Submission with Store persistence & Toast
 */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const service = document.getElementById('formService').value;
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }

    // Save inquiry to Store
    window.Store.addInquiry({
      name,
      email,
      service,
      message
    });

    form.reset();
    showToast('Inquiry sent successfully! The Four Controllers team will reply shortly.', 'success');
  });
}

/**
 * Global Real-time Event Listeners
 * Re-render seamlessly when LocalStorage or Store dispatches updates
 */
function setupEventListeners() {
  window.addEventListener('fc:datachange', (e) => {
    renderBrandAndSettings();
    renderTeamCounter();
    renderTeamMembers();
    renderSkills();
    renderProjects('all');
    renderAchievements();
  });

  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('fc_')) {
      renderBrandAndSettings();
      renderTeamCounter();
      renderTeamMembers();
      renderSkills();
      renderProjects('all');
      renderAchievements();
    }
  });
}

/**
 * Toast Notification System
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="color: ${type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-cyan)'}; font-size: 1.2rem;">●</span>
    <div>${escapeHtml(message)}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * XSS Helper
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
