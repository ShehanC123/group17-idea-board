document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation & Sidebar Logic ---
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const navItems = document.querySelectorAll('.sidebar li');
    const sections = document.querySelectorAll('.section');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-section');
            
            // Update Active Nav Item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show Target Section
            sections.forEach(section => {
                section.classList.remove('fade-in'); // Reset animation
                if (section.id === `${targetSection}-section`) {
                    section.classList.remove('hidden');
                    // Force reflow to restart animation
                    void section.offsetWidth; 
                    section.classList.add('fade-in');
                } else {
                    section.classList.add('hidden');
                }
            });

            // Collapse sidebar on mobile after selection
            if (window.innerWidth <= 768) {
                sidebar.classList.add('collapsed');
            }
        });
    });

    // --- Dark Mode Logic ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
        }
    });

    // --- Pomodoro Timer Logic ---
    let timerInterval;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startBtn = document.getElementById('start-timer');
    const stopBtn = document.getElementById('stop-timer');
    const resetBtn = document.getElementById('reset-timer');
    const bellSound = document.getElementById('bell-sound');

    function updateTimerDisplay() {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        minutesDisplay.textContent = mins.toString().padStart(2, '0');
        secondsDisplay.textContent = secs.toString().padStart(2, '0');
    }

    startBtn.addEventListener('click', () => {
        if (timerInterval) return; // Already running

        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                bellSound.play();
                alert('Time is up! Take a break.');
            }
        }, 1000);
    });

    stopBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
    });

    resetBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
        timeLeft = 25 * 60;
        updateTimerDisplay();
    });

    // --- GPA Calculator Logic ---
    const gpaTableBody = document.getElementById('course-list');
    const addCourseBtn = document.getElementById('add-course');
    const calculateGpaBtn = document.getElementById('calculate-gpa');
    const gpaValueDisplay = document.getElementById('gpa-value');

    addCourseBtn.addEventListener('click', () => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" placeholder="e.g. CS101"></td>
            <td><input type="number" class="credits" placeholder="Credits" min="0" step="0.5"></td>
            <td>
                <select class="grade">
                    <option value="4.0">A / A+</option>
                    <option value="3.7">A-</option>
                    <option value="3.3">B+</option>
                    <option value="3.0">B</option>
                    <option value="2.7">B-</option>
                    <option value="2.3">C+</option>
                    <option value="2.0">C</option>
                    <option value="1.7">C-</option>
                    <option value="1.3">D+</option>
                    <option value="1.0">D</option>
                    <option value="0.0">F</option>
                </select>
            </td>
            <td><button class="remove-row"><i class="fas fa-trash"></i></button></td>
        `;
        gpaTableBody.appendChild(newRow);
    });

    // Delegate remove button click
    gpaTableBody.addEventListener('click', (e) => {
        if (e.target.closest('.remove-row')) {
            e.target.closest('tr').remove();
        }
    });

    calculateGpaBtn.addEventListener('click', () => {
        const rows = gpaTableBody.querySelectorAll('tr');
        let totalPoints = 0;
        let totalCredits = 0;

        rows.forEach(row => {
            const credits = parseFloat(row.querySelector('.credits').value);
            const grade = parseFloat(row.querySelector('.grade').value);

            if (!isNaN(credits) && !isNaN(grade)) {
                totalPoints += credits * grade;
                totalCredits += credits;
            }
        });

        if (totalCredits > 0) {
            const gpa = totalPoints / totalCredits;
            gpaValueDisplay.textContent = gpa.toFixed(2);
        } else {
            gpaValueDisplay.textContent = '0.00';
        }
    });

    // --- Idea Board Logic ---
    const memberSelect = document.getElementById('member-select');
    const ideaInput = document.getElementById('idea-input');
    const addIdeaBtn = document.getElementById('add-idea-btn');
    const clearInputBtn = document.getElementById('clear-input-btn');
    const ideaList = document.getElementById('idea-list');
    const totalIdeasCounter = document.getElementById('total-ideas-counter');

    const manageMembersBtn = document.getElementById('manage-members-btn');
    const memberModal = document.getElementById('member-modal');
    const closeModal = document.getElementById('close-modal');
    const newMemberInput = document.getElementById('new-member-input');
    const saveMemberBtn = document.getElementById('save-member-btn');
    const modalMemberList = document.getElementById('modal-member-list');

    // State
    const defaultMembers = [
        'Nisal Themiya', 'Tharuka Vismitha', 'Sandeepa devidu',
        'Rizani Nizar', 'Salma Nisthar', 'Tharundhi Conrad',
        'Chathura Sandaruwan', 'Shehan Chanuka', 'Ravija Ranthush',
        'Vinuka Ransith'
    ];
    let members = JSON.parse(localStorage.getItem('groupMembers')) || defaultMembers;
    let ideas = JSON.parse(localStorage.getItem('groupIdeas')) || [];

    // Initialize
    function initIdeas() {
        renderMembers();
        renderIdeas();
    }

    function saveIdeaData() {
        localStorage.setItem('groupMembers', JSON.stringify(members));
        localStorage.setItem('groupIdeas', JSON.stringify(ideas));
    }

    // Render Members in Dropdown and Modal
    function renderMembers() {
        if (!memberSelect) return;
        const currentSelection = memberSelect.value;
        memberSelect.innerHTML = '<option value="" disabled selected>Select your name...</option>';
        members.forEach(member => {
            const option = document.createElement('option');
            option.value = member;
            option.textContent = member;
            memberSelect.appendChild(option);
        });
        if (members.includes(currentSelection)) {
            memberSelect.value = currentSelection;
        }

        modalMemberList.innerHTML = '';
        members.forEach((member, index) => {
            const li = document.createElement('li');
            li.className = 'member-item';
            li.innerHTML = `
                <span>${member}</span>
                <button class="delete-member" data-index="${index}">Remove</button>
            `;
            modalMemberList.appendChild(li);
        });
    }

    // Render Ideas
    function renderIdeas() {
        if (!totalIdeasCounter || !ideaList) return;
        totalIdeasCounter.textContent = `Total Ideas: ${ideas.length}`;

        if (ideas.length === 0) {
            ideaList.innerHTML = '<li class="empty-state">No ideas yet. Be the first to share!</li>';
            return;
        }

        ideaList.innerHTML = '';
        const ideasWithIndex = ideas.map((idea, index) => ({ ...idea, originalIndex: index }));

        [...ideasWithIndex].reverse().forEach(idea => {
            const li = document.createElement('li');
            li.className = 'idea-item';
            li.innerHTML = `
                <div class="idea-header">
                    <span class="idea-user">${idea.user}</span>
                    <button class="delete-idea-btn" data-index="${idea.originalIndex}" title="Delete Idea">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <span class="idea-text">${idea.text}</span>
            `;
            ideaList.appendChild(li);
        });
    }

    // Add Idea
    if (addIdeaBtn) {
        addIdeaBtn.addEventListener('click', () => {
            const user = memberSelect.value;
            const text = ideaInput.value.trim();

            if (!user) {
                alert('Please select your name first!');
                return;
            }
            if (!text) {
                alert('Please enter an idea!');
                return;
            }

            ideas.push({ user, text, timestamp: Date.now() });
            ideaInput.value = '';
            saveIdeaData();
            renderIdeas();
        });
    }

    // Delete Idea
    if (ideaList) {
        ideaList.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.delete-idea-btn');
            if (deleteBtn) {
                const index = parseInt(deleteBtn.getAttribute('data-index'));
                if (confirm('Are you sure you want to delete this idea?')) {
                    ideas.splice(index, 1);
                    saveIdeaData();
                    renderIdeas();
                }
            }
        });
    }

    // Clear Inputs
    if (clearInputBtn) {
        clearInputBtn.addEventListener('click', () => {
            ideaInput.value = '';
            memberSelect.selectedIndex = 0;
        });
    }

    // Modal Logic
    if (manageMembersBtn) {
        manageMembersBtn.addEventListener('click', () => {
            memberModal.style.display = 'flex';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            memberModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === memberModal) {
            memberModal.style.display = 'none';
        }
    });

    // Add New Member
    if (saveMemberBtn) {
        saveMemberBtn.addEventListener('click', () => {
            const name = newMemberInput.value.trim();
            if (name && !members.includes(name)) {
                members.push(name);
                newMemberInput.value = '';
                saveIdeaData();
                renderMembers();
            } else if (members.includes(name)) {
                alert('This member already exists!');
            }
        });
    }

    // Delete Member
    if (modalMemberList) {
        modalMemberList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-member')) {
                const index = e.target.getAttribute('data-index');
                members.splice(index, 1);
                saveIdeaData();
                renderMembers();
            }
        });
    }

    // Allow Enter key to add idea
    if (ideaInput) {
        ideaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addIdeaBtn.click();
        });
    }

    initIdeas();
});
