/**
 * Four Controllers - Admin Control Center Application Logic
 * Full CRUD capabilities for Team Members, Projects, Skills, Inquiries, and Site Settings.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdmin();
});

let currentEditingMemberId = null;
let currentEditingProjectId = null;

// Preset professional avatars for one-click selection
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=600&q=80'
];

function initAdmin() {
  setupAuth();
  setupTabs();
  setupMemberModal();
  setupProjectModal();
  setupSkillForm();
  setupAchievementForm();
  setupSettingsForm();
  setupExportImport();
  setupGlobalEvents();
}

/**
 * Authentication Gate
 */
function setupAuth() {
  const authOverlay = document.getElementById('adminAuthOverlay');
  const authForm = document.getElementById('adminLoginForm');
  const pinInput = document.getElementById('adminPinInput');
  const demoUnlockBtn = document.getElementById('demoUnlockBtn');
  const logoutBtn = document.getElementById('adminLogoutBtn');

  const checkStatus = () => {
    if (window.Store.isAdminLoggedIn()) {
      if (authOverlay) authOverlay.style.display = 'none';
      loadAllDashboardData();
    } else {
      if (authOverlay) authOverlay.style.display = 'flex';
      if (pinInput) pinInput.focus();
    }
  };

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = pinInput.value.trim();
      if (window.Store.loginAdmin(entered)) {
        pinInput.value = '';
        checkStatus();
        showAdminToast('Access Granted. Welcome to Four Controllers Command Center.', 'success');
      } else {
        showAdminToast('Incorrect security PIN. Please try again.', 'error');
        pinInput.select();
      }
    });
  }

  if (demoUnlockBtn) {
    demoUnlockBtn.addEventListener('click', () => {
      window.Store.loginAdmin('admin123');
      checkStatus();
      showAdminToast('Authenticated via Master Access Passcode.', 'success');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.Store.logoutAdmin();
      checkStatus();
      showAdminToast('Session terminated.', 'info');
    });
  }

  checkStatus();
}

/**
 * Tab Navigation in Dashboard
 */
function setupTabs() {
  const navItems = document.querySelectorAll('.admin-nav-item');
  const tabPanels = document.querySelectorAll('.admin-tab-panel');
  const topbarTitle = document.getElementById('adminTopbarTitle');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      if (!targetTab) return;

      navItems.forEach(nav => nav.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));

      item.classList.add('active');
      const activePanel = document.getElementById(`panel-${targetTab}`);
      if (activePanel) activePanel.classList.add('active');

      const titleMap = {
        overview: 'System Command Overview',
        members: 'Team Controllers Management',
        projects: 'Projects & Work Matrix',
        skills: 'Technical Capabilities & Skills',
        achievements: 'Honors & Milestones',
        inquiries: 'Inbound Inquiries & Messages',
        settings: 'Global Site Configuration'
      };
      if (topbarTitle) topbarTitle.textContent = titleMap[targetTab] || 'Command Center';
    });
  });
}

/**
 * Load all Dashboard Components
 */
function loadAllDashboardData() {
  renderOverviewStats();
  renderMembersTable();
  renderProjectsTable();
  renderSkillsList();
  renderAchievementsList();
  renderInquiriesList();
  populateSettingsForm();
}

/**
 * Render Overview Metrics
 */
function renderOverviewStats() {
  const members = window.Store.getMembers();
  const projects = window.Store.getProjects();
  const skills = window.Store.getSkills();
  const inquiries = window.Store.getInquiries();

  const countMembers = document.getElementById('statTotalMembers');
  if (countMembers) countMembers.textContent = members.length;

  const countProjects = document.getElementById('statTotalProjects');
  if (countProjects) countProjects.textContent = projects.length;

  const countSkills = document.getElementById('statTotalSkills');
  if (countSkills) countSkills.textContent = skills.length;

  const countInquiries = document.getElementById('statTotalInquiries');
  if (countInquiries) {
    const unread = inquiries.filter(i => !i.read).length;
    countInquiries.textContent = `${unread} New (${inquiries.length})`;
  }

  // Update badges on sidebar
  const memberNavBadge = document.getElementById('navBadgeMembers');
  if (memberNavBadge) memberNavBadge.textContent = members.length;

  const inquiryNavBadge = document.getElementById('navBadgeInquiries');
  if (inquiryNavBadge) inquiryNavBadge.textContent = inquiries.filter(i => !i.read).length;
}

/**
 * ==========================================================================
 * TEAM MEMBERS CRUD MANAGEMENT (CORE REQUIREMENT)
 * ==========================================================================
 */
function renderMembersTable() {
  const members = window.Store.getMembers();
  const tbody = document.getElementById('membersTableBody');
  const countBadge = document.getElementById('membersCountHeaderBadge');

  if (countBadge) {
    countBadge.textContent = `${members.length} Active Controllers`;
  }

  if (!tbody) return;
  tbody.innerHTML = '';

  if (members.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
          No members found. Click "Add Controller Member" to create your team.
        </td>
      </tr>
    `;
    return;
  }

  members.forEach((m, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="member-cell">
          <img src="${escapeHtml(m.avatar)}" alt="${escapeHtml(m.name)}" class="member-cell-img">
          <div>
            <div class="member-cell-name">${escapeHtml(m.name)}</div>
            <div class="member-cell-code">${escapeHtml(m.controllerCode || 'CTRL-0' + (index + 1))}</div>
          </div>
        </div>
      </td>
      <td>
        <strong>${escapeHtml(m.role)}</strong>
        <div style="font-size: 0.78rem; color: var(--text-muted);">${escapeHtml(m.department)}</div>
      </td>
      <td>
        <span class="badge">${escapeHtml(m.badge || 'Controller')}</span>
      </td>
      <td>
        <div style="display: flex; gap: 4px; flex-wrap: wrap; max-width: 200px;">
          ${(m.skills || []).slice(0, 3).map(s => `<span class="controller-skill-tag">${escapeHtml(s)}</span>`).join('')}
          ${(m.skills || []).length > 3 ? `<span class="controller-skill-tag">+${m.skills.length - 3}</span>` : ''}
        </div>
      </td>
      <td>
        <span style="color: var(--accent-emerald); font-size: 0.82rem; font-family: var(--font-mono); font-weight: 600;">
          ● ${escapeHtml(m.status || 'Active')}
        </span>
      </td>
      <td>
        <div class="action-btn-group">
          <button class="btn-icon-action" onclick="openEditMemberModal('${m.id}')" title="Edit Controller">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn-icon-action btn-delete" onclick="handleDeleteMember('${m.id}', '${escapeHtml(m.name)}')" title="Remove Controller">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function setupMemberModal() {
  const modal = document.getElementById('memberModal');
  const openBtn = document.getElementById('openAddMemberBtn');
  const closeBtn = document.getElementById('closeMemberModalBtn');
  const cancelBtn = document.getElementById('cancelMemberModalBtn');
  const form = document.getElementById('memberForm');
  const presetsContainer = document.getElementById('avatarPresetsRow');

  // Render avatar preset buttons
  if (presetsContainer) {
    presetsContainer.innerHTML = '';
    AVATAR_PRESETS.forEach(url => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-avatar-btn';
      btn.innerHTML = `<img src="${url}" alt="Preset Avatar">`;
      btn.addEventListener('click', () => {
        document.getElementById('memberAvatarInput').value = url;
        document.querySelectorAll('.preset-avatar-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
      presetsContainer.appendChild(btn);
    });
  }

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      currentEditingMemberId = null;
      document.getElementById('memberModalTitle').textContent = 'Add New Controller Member';
      form.reset();
      document.getElementById('memberAvatarInput').value = AVATAR_PRESETS[0];
      modal.classList.add('active');
    });
  }

  const closeModal = () => modal.classList.remove('active');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const memberData = {
        name: document.getElementById('memberNameInput').value.trim(),
        role: document.getElementById('memberRoleInput').value.trim(),
        department: document.getElementById('memberDeptInput').value.trim(),
        bio: document.getElementById('memberBioInput').value.trim(),
        avatar: document.getElementById('memberAvatarInput').value.trim(),
        badge: document.getElementById('memberBadgeInput').value.trim() || 'Controller',
        status: document.getElementById('memberStatusInput').value,
        skills: document.getElementById('memberSkillsInput').value.trim(),
        github: document.getElementById('memberGithubInput').value.trim(),
        linkedin: document.getElementById('memberLinkedinInput').value.trim(),
        twitter: document.getElementById('memberTwitterInput').value.trim()
      };

      if (!memberData.name || !memberData.role) {
        showAdminToast('Please provide a name and role.', 'warning');
        return;
      }

      if (currentEditingMemberId) {
        window.Store.updateMember(currentEditingMemberId, memberData);
        showAdminToast(`Controller "${memberData.name}" updated successfully.`, 'success');
      } else {
        const added = window.Store.addMember(memberData);
        showAdminToast(`New Controller "${added.name}" added to team! (Count: ${window.Store.getTeamCount()})`, 'success');
      }

      closeModal();
      renderMembersTable();
      renderOverviewStats();
    });
  }
}

window.openEditMemberModal = function(id) {
  const members = window.Store.getMembers();
  const m = members.find(item => item.id === id);
  if (!m) return;

  currentEditingMemberId = id;
  const modal = document.getElementById('memberModal');
  document.getElementById('memberModalTitle').textContent = `Edit Controller: ${m.name}`;

  document.getElementById('memberNameInput').value = m.name || '';
  document.getElementById('memberRoleInput').value = m.role || '';
  document.getElementById('memberDeptInput').value = m.department || '';
  document.getElementById('memberBioInput').value = m.bio || '';
  document.getElementById('memberAvatarInput').value = m.avatar || '';
  document.getElementById('memberBadgeInput').value = m.badge || '';
  document.getElementById('memberStatusInput').value = m.status || 'Active & Online';
  document.getElementById('memberSkillsInput').value = Array.isArray(m.skills) ? m.skills.join(', ') : (m.skills || '');
  document.getElementById('memberGithubInput').value = m.socials?.github || '';
  document.getElementById('memberLinkedinInput').value = m.socials?.linkedin || '';
  document.getElementById('memberTwitterInput').value = m.socials?.twitter || '';

  modal.classList.add('active');
};

window.handleDeleteMember = function(id, name) {
  const confirmMsg = `Are you sure you want to remove Controller "${name}" from the team?\nThis will immediately update the live team count.`;
  if (confirm(confirmMsg)) {
    window.Store.removeMember(id);
    const newCount = window.Store.getTeamCount();
    showAdminToast(`Removed "${name}". Team members count is now ${newCount}.`, 'info');
    renderMembersTable();
    renderOverviewStats();
  }
};

/**
 * ==========================================================================
 * PROJECTS CRUD MANAGEMENT
 * ==========================================================================
 */
function renderProjectsTable() {
  const projects = window.Store.getProjects();
  const tbody = document.getElementById('projectsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (projects.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">
          No projects found. Click "Add New Project" to add your showcase work.
        </td>
      </tr>
    `;
    return;
  }

  projects.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" style="width: 50px; height: 35px; border-radius: 6px; object-fit: cover;">
          <strong>${escapeHtml(p.title)}</strong>
        </div>
      </td>
      <td><span class="badge">${escapeHtml(p.category)}</span></td>
      <td>${p.featured ? '<span style="color: var(--accent-amber); font-weight: 700;">★ Featured</span>' : '<span style="color: var(--text-muted);">Standard</span>'}</td>
      <td>
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
          ${(p.tags || []).slice(0, 2).map(t => `<span class="project-tag">${escapeHtml(t)}</span>`).join('')}
        </div>
      </td>
      <td>
        <div class="action-btn-group">
          <button class="btn-icon-action" onclick="openEditProjectModal('${p.id}')" title="Edit Project">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn-icon-action btn-delete" onclick="handleDeleteProject('${p.id}', '${escapeHtml(p.title)}')" title="Delete Project">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function setupProjectModal() {
  const modal = document.getElementById('projectModal');
  const openBtn = document.getElementById('openAddProjectBtn');
  const closeBtn = document.getElementById('closeProjectModalBtn');
  const cancelBtn = document.getElementById('cancelProjectModalBtn');
  const form = document.getElementById('projectForm');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      currentEditingProjectId = null;
      document.getElementById('projectModalTitle').textContent = 'Add New Project';
      form.reset();
      modal.classList.add('active');
    });
  }

  const closeModal = () => modal.classList.remove('active');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const projectData = {
        title: document.getElementById('projectTitleInput').value.trim(),
        category: document.getElementById('projectCategoryInput').value.trim(),
        description: document.getElementById('projectDescInput').value.trim(),
        image: document.getElementById('projectImageInput').value.trim(),
        tags: document.getElementById('projectTagsInput').value.trim(),
        demoUrl: document.getElementById('projectDemoUrlInput').value.trim(),
        githubUrl: document.getElementById('projectGithubUrlInput').value.trim(),
        featured: document.getElementById('projectFeaturedInput').checked
      };

      if (!projectData.title) {
        showAdminToast('Please provide a project title.', 'warning');
        return;
      }

      if (currentEditingProjectId) {
        window.Store.updateProject(currentEditingProjectId, projectData);
        showAdminToast(`Project "${projectData.title}" updated.`, 'success');
      } else {
        window.Store.addProject(projectData);
        showAdminToast(`Project "${projectData.title}" published!`, 'success');
      }

      closeModal();
      renderProjectsTable();
      renderOverviewStats();
    });
  }
}

window.openEditProjectModal = function(id) {
  const p = window.Store.getProjects().find(item => item.id === id);
  if (!p) return;

  currentEditingProjectId = id;
  const modal = document.getElementById('projectModal');
  document.getElementById('projectModalTitle').textContent = `Edit Project: ${p.title}`;

  document.getElementById('projectTitleInput').value = p.title || '';
  document.getElementById('projectCategoryInput').value = p.category || '';
  document.getElementById('projectDescInput').value = p.description || '';
  document.getElementById('projectImageInput').value = p.image || '';
  document.getElementById('projectTagsInput').value = Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '');
  document.getElementById('projectDemoUrlInput').value = p.demoUrl || '';
  document.getElementById('projectGithubUrlInput').value = p.githubUrl || '';
  document.getElementById('projectFeaturedInput').checked = !!p.featured;

  modal.classList.add('active');
};

window.handleDeleteProject = function(id, title) {
  if (confirm(`Delete project "${title}"?`)) {
    window.Store.removeProject(id);
    showAdminToast(`Project "${title}" deleted.`, 'info');
    renderProjectsTable();
    renderOverviewStats();
  }
};

/**
 * ==========================================================================
 * SKILLS & ACHIEVEMENTS MANAGEMENT
 * ==========================================================================
 */
function renderSkillsList() {
  const skills = window.Store.getSkills();
  const container = document.getElementById('skillsTableBody');
  if (!container) return;

  container.innerHTML = '';
  skills.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${escapeHtml(s.name)}</strong></td>
      <td><span class="badge">${escapeHtml(s.category)}</span></td>
      <td><span class="stat-number" style="font-size: 1.1rem; color: var(--accent-cyan); font-family: var(--font-mono);">${s.level}%</span></td>
      <td>${escapeHtml(s.highlight)}</td>
      <td>
        <button class="btn-icon-action btn-delete" onclick="handleDeleteSkill('${s.id}')" title="Delete Skill">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    `;
    container.appendChild(tr);
  });
}

function setupSkillForm() {
  const form = document.getElementById('addSkillForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('skillNameInput').value.trim();
    const category = document.getElementById('skillCategoryInput').value.trim();
    const level = document.getElementById('skillLevelInput').value;
    const highlight = document.getElementById('skillHighlightInput').value.trim();

    if (!name) return;
    window.Store.addSkill({ name, category, level, highlight });
    form.reset();
    showAdminToast(`Competency "${name}" registered.`, 'success');
    renderSkillsList();
    renderOverviewStats();
  });
}

window.handleDeleteSkill = function(id) {
  if (confirm('Delete this competency?')) {
    window.Store.removeSkill(id);
    renderSkillsList();
    renderOverviewStats();
  }
};

function renderAchievementsList() {
  const achs = window.Store.getAchievements();
  const container = document.getElementById('achievementsTableBody');
  if (!container) return;

  container.innerHTML = '';
  achs.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${escapeHtml(a.title)}</strong></td>
      <td>${escapeHtml(a.organization)}</td>
      <td><span class="badge">${escapeHtml(a.year)}</span></td>
      <td>${escapeHtml(a.description)}</td>
      <td>
        <button class="btn-icon-action btn-delete" onclick="handleDeleteAchievement('${a.id}')" title="Delete Achievement">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    `;
    container.appendChild(tr);
  });
}

function setupAchievementForm() {
  const form = document.getElementById('addAchievementForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('achTitleInput').value.trim();
    const organization = document.getElementById('achOrgInput').value.trim();
    const year = document.getElementById('achYearInput').value.trim();
    const description = document.getElementById('achDescInput').value.trim();

    if (!title) return;
    window.Store.addAchievement({ title, organization, year, description });
    form.reset();
    showAdminToast(`Achievement "${title}" logged.`, 'success');
    renderAchievementsList();
  });
}

window.handleDeleteAchievement = function(id) {
  if (confirm('Delete this achievement?')) {
    window.Store.removeAchievement(id);
    renderAchievementsList();
  }
};

/**
 * ==========================================================================
 * INBOUND INQUIRIES MANAGEMENT
 * ==========================================================================
 */
function renderInquiriesList() {
  const inquiries = window.Store.getInquiries();
  const container = document.getElementById('inquiriesTableBody');
  if (!container) return;

  container.innerHTML = '';
  if (inquiries.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
          No contact inquiries recorded yet.
        </td>
      </tr>
    `;
    return;
  }

  inquiries.forEach(inq => {
    const tr = document.createElement('tr');
    tr.style.background = inq.read ? 'transparent' : 'rgba(0, 240, 255, 0.04)';
    tr.innerHTML = `
      <td>
        <strong>${escapeHtml(inq.name)}</strong>
        <div style="font-size: 0.8rem; color: var(--accent-cyan);">${escapeHtml(inq.email)}</div>
      </td>
      <td><span class="badge">${escapeHtml(inq.service || 'Inquiry')}</span></td>
      <td style="max-width: 320px; line-height: 1.4;">${escapeHtml(inq.message)}</td>
      <td style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted);">${escapeHtml(inq.timestamp)}</td>
      <td>
        ${inq.read 
          ? '<span style="color: var(--text-muted); font-size: 0.8rem;">Read</span>' 
          : '<span style="color: var(--accent-emerald); font-weight: 700; font-size: 0.8rem;">● New</span>'}
      </td>
      <td>
        <div class="action-btn-group">
          ${!inq.read ? `<button class="btn-icon-action" onclick="markInquiryAsRead('${inq.id}')" title="Mark Read">✓</button>` : ''}
          <button class="btn-icon-action btn-delete" onclick="handleDeleteInquiry('${inq.id}')" title="Delete Inquiry">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </td>
    `;
    container.appendChild(tr);
  });
}

window.markInquiryAsRead = function(id) {
  window.Store.markInquiryRead(id);
  renderInquiriesList();
  renderOverviewStats();
  showAdminToast('Marked inquiry as read.', 'info');
};

window.handleDeleteInquiry = function(id) {
  if (confirm('Delete this message?')) {
    window.Store.deleteInquiry(id);
    renderInquiriesList();
    renderOverviewStats();
  }
};

/**
 * ==========================================================================
 * SITE SETTINGS & BRAND CONFIGURATION
 * ==========================================================================
 */
function populateSettingsForm() {
  const settings = window.Store.getSettings();
  const brandName = document.getElementById('settingBrandName');
  if (brandName) brandName.value = settings.brandName || '';

  const tagline = document.getElementById('settingTagline');
  if (tagline) tagline.value = settings.tagline || '';

  const heroHeadline = document.getElementById('settingHeroHeadline');
  if (heroHeadline) heroHeadline.value = settings.heroHeadline || '';

  const heroDesc = document.getElementById('settingHeroDesc');
  if (heroDesc) heroDesc.value = settings.heroDescription || '';

  const email = document.getElementById('settingEmail');
  if (email) email.value = settings.email || '';

  const phone = document.getElementById('settingPhone');
  if (phone) phone.value = settings.phone || '';

  const location = document.getElementById('settingLocation');
  if (location) location.value = settings.location || '';

  const adminPin = document.getElementById('settingAdminPin');
  if (adminPin) adminPin.value = settings.adminPin || 'admin123';
}

function setupSettingsForm() {
  const form = document.getElementById('settingsGeneralForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = {
      brandName: document.getElementById('settingBrandName').value.trim(),
      tagline: document.getElementById('settingTagline').value.trim(),
      heroHeadline: document.getElementById('settingHeroHeadline').value.trim(),
      heroDescription: document.getElementById('settingHeroDesc').value.trim(),
      email: document.getElementById('settingEmail').value.trim(),
      phone: document.getElementById('settingPhone').value.trim(),
      location: document.getElementById('settingLocation').value.trim(),
      adminPin: document.getElementById('settingAdminPin').value.trim() || 'admin123'
    };

    window.Store.updateSettings(updated);
    showAdminToast('Website settings successfully updated & synced.', 'success');
  });

  const resetBtn = document.getElementById('resetAllDataBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const ok = confirm('WARNING: Are you sure you want to reset all portfolio data back to default factory demo state?');
      if (ok) {
        window.Store.resetAllData();
      }
    });
  }
}

/**
 * Backup Export and Import
 */
function setupExportImport() {
  const exportBtn = document.getElementById('exportBackupBtn');
  const importBtn = document.getElementById('importBackupBtn');
  const importFile = document.getElementById('importBackupFile');

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const json = window.Store.exportJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `four-controllers-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showAdminToast('Backup JSON exported successfully.', 'success');
    });
  }

  if (importBtn && importFile) {
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const ok = window.Store.importJSON(evt.target.result);
        if (ok) {
          showAdminToast('Data successfully imported from backup!', 'success');
          loadAllDashboardData();
        } else {
          showAdminToast('Invalid backup file format.', 'error');
        }
      };
      reader.readAsText(file);
    });
  }
}

function setupGlobalEvents() {
  window.addEventListener('fc:datachange', () => {
    renderOverviewStats();
  });
}

function showAdminToast(msg, type = 'info') {
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
    <span style="color: ${type === 'success' ? 'var(--accent-emerald)' : (type === 'error' ? 'var(--accent-rose)' : 'var(--accent-cyan)')}">●</span>
    <div>${escapeHtml(msg)}</div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
