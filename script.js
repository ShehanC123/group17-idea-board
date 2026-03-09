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
        // Map ideas with their original index to handle deletion correctly after reverse
        const ideasWithIndex = ideas.map((idea, index) => ({ ...idea, originalIndex: index }));
        
        [...ideasWithIndex].reverse().forEach(idea => {
            const li = document.createElement('li');
            li.className = 'idea-item';
            li.innerHTML = `
                <div class="idea-header">
                    <span class="idea-user">${idea.user}</span>
                    <button class="delete-idea-btn" data-index="${idea.originalIndex}" title="Delete Idea">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
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

    // Delete Idea
    ideaList.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-idea-btn');
        if (deleteBtn) {
            const index = parseInt(deleteBtn.getAttribute('data-index'));
            if (confirm('Are you sure you want to delete this idea?')) {
                ideas.splice(index, 1);
                saveData();
                renderIdeas();
            }
        }
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
