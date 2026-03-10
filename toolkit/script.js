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
});
