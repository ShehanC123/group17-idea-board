document.addEventListener('DOMContentLoaded', () => {
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
    function init() {
        renderMembers();
        renderIdeas();
        saveData();
    }

    function saveData() {
        localStorage.setItem('groupMembers', JSON.stringify(members));
        localStorage.setItem('groupIdeas', JSON.stringify(ideas));
    }

    // Render Members in Dropdown and Modal
    function renderMembers() {
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
        totalIdeasCounter.textContent = `Total Ideas: ${ideas.length}`;

        if (ideas.length === 0) {
            ideaList.innerHTML = '<li class="empty-state">No ideas yet. Be the first to share!</li>';
            return;
        }

        ideaList.innerHTML = '';
        [...ideas].reverse().forEach(idea => {
            const li = document.createElement('li');
            li.className = 'idea-item';
            li.innerHTML = `
                <span class="idea-user">${idea.user}</span>
                <span class="idea-text">${idea.text}</span>
            `;
            ideaList.appendChild(li);
        });
    }

    // Add Idea
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
        saveData();
        renderIdeas();
    });

    // Clear Inputs
    clearInputBtn.addEventListener('click', () => {
        ideaInput.value = '';
        memberSelect.selectedIndex = 0;
    });

    // Modal Logic
    manageMembersBtn.addEventListener('click', () => {
        memberModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        memberModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === memberModal) {
            memberModal.style.display = 'none';
        }
    });

    // Add New Member
    saveMemberBtn.addEventListener('click', () => {
        const name = newMemberInput.value.trim();
        if (name && !members.includes(name)) {
            members.push(name);
            newMemberInput.value = '';
            saveData();
            renderMembers();
        } else if (members.includes(name)) {
            alert('This member already exists!');
        }
    });

    // Delete Member
    modalMemberList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-member')) {
            const index = e.target.getAttribute('data-index');
            members.splice(index, 1);
            saveData();
            renderMembers();
        }
    });

    // Allow Enter key to add idea
    ideaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addIdeaBtn.click();
    });

    init();
});
