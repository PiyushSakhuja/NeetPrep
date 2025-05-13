// User Progress and Gamification
class UserProgress {
    constructor() {
        this.xp = parseInt(localStorage.getItem('userXP')) || 0;
        this.level = this.calculateLevel();
        this.streak = parseInt(localStorage.getItem('studyStreak')) || 0;
        this.lastStudyDate = localStorage.getItem('lastStudyDate');
        this.achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    }

    addXP(points) {
        this.xp += points;
        this.level = this.calculateLevel();
        localStorage.setItem('userXP', this.xp);
        this.checkAchievements();
        return this.level;
    }

    calculateLevel() {
        return Math.floor(Math.sqrt(this.xp / 100)) + 1;
    }

    updateStreak() {
        const today = new Date().toDateString();
        if (this.lastStudyDate !== today) {
            if (this.isConsecutiveDay()) {
                this.streak++;
            } else {
                this.streak = 1;
            }
            this.lastStudyDate = today;
            localStorage.setItem('studyStreak', this.streak);
            localStorage.setItem('lastStudyDate', today);
            this.checkStreakAchievements();
        }
    }

    isConsecutiveDay() {
        if (!this.lastStudyDate) return false;
        const lastDate = new Date(this.lastStudyDate);
        const today = new Date();
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1;
    }

    checkAchievements() {
        const xpAchievements = {
            'Rising Star': 100,
            'Knowledge Seeker': 500,
            'Master Student': 1000
        };

        for (const [achievement, requiredXP] of Object.entries(xpAchievements)) {
            if (this.xp >= requiredXP && !this.achievements.includes(achievement)) {
                this.unlockAchievement(achievement);
            }
        }
    }

    checkStreakAchievements() {
        const streakAchievements = {
            'Consistent Learner': 3,
            'Dedicated Scholar': 7,
            'Study Champion': 14
        };

        for (const [achievement, requiredStreak] of Object.entries(streakAchievements)) {
            if (this.streak >= requiredStreak && !this.achievements.includes(achievement)) {
                this.unlockAchievement(achievement);
            }
        }
    }

    unlockAchievement(achievement) {
        this.achievements.push(achievement);
        localStorage.setItem('achievements', JSON.stringify(this.achievements));
        this.showAchievementNotification(achievement);
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-text">
                <h4>Achievement Unlocked!</h4>
                <p>${achievement}</p>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Quiz and Learning Progress
class QuizProgress {
    constructor() {
        this.completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes')) || {};
        this.subjectProgress = JSON.parse(localStorage.getItem('subjectProgress')) || {
            physics: 0,
            chemistry: 0,
            biology: 0
        };
    }

    completeQuiz(subject, score, totalQuestions) {
        const quizId = `${subject}-${Date.now()}`;
        this.completedQuizzes[quizId] = {
            subject,
            score,
            date: new Date().toISOString()
        };
        localStorage.setItem('completedQuizzes', JSON.stringify(this.completedQuizzes));

        // Update subject progress
        const progress = (score / totalQuestions) * 100;
        this.subjectProgress[subject] = Math.max(
            this.subjectProgress[subject],
            progress
        );
        localStorage.setItem('subjectProgress', JSON.stringify(this.subjectProgress));

        // Award XP based on performance
        const xpEarned = Math.floor(score * 10);
        userProgress.addXP(xpEarned);
    }

    getSubjectProgress(subject) {
        return this.subjectProgress[subject] || 0;
    }

    getRecentQuizzes(limit = 5) {
        return Object.entries(this.completedQuizzes)
            .sort(([, a], [, b]) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }
}

// Initialize progress tracking
const userProgress = new UserProgress();
const quizProgress = new QuizProgress();

// UI Updates
function updateProgressUI() {
    // Update level and XP display
    const levelElement = document.getElementById('user-level');
    const xpElement = document.getElementById('user-xp');
    if (levelElement) levelElement.textContent = `Level ${userProgress.level}`;
    if (xpElement) xpElement.textContent = `${userProgress.xp} XP`;

    // Update streak display
    const streakElement = document.getElementById('study-streak');
    if (streakElement) streakElement.textContent = `${userProgress.streak} days`;

    // Update subject progress bars
    for (const subject of ['physics', 'chemistry', 'biology']) {
        const progressBar = document.querySelector(`.${subject}-progress`);
        if (progressBar) {
            const progress = quizProgress.getSubjectProgress(subject);
            progressBar.style.width = `${progress}%`;
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateProgressUI();
    userProgress.updateStreak();
});

// Interactive Elements
document.querySelectorAll('.interactive-element').forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.transform = 'scale(1.05)';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
    });
}); 