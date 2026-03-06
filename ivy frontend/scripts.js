// ============================================
// FinShield AI - Global JavaScript
// Contains all interactive functionality
// ============================================

(function() {
    "use strict";

    // ============================================
    // 1. PARTICLE BACKGROUND (runs on all pages)
    // ============================================
    function initParticles() {
        // Only run if there are no particles yet (prevent duplicates)
        if (document.querySelector('.particle')) return;
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 200 + 50;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.background = `rgba(${Math.random()*100+100}, ${Math.random()*50}, 255, 0.1)`;
            particle.style.filter = 'blur(40px)';
            particle.style.animation = `float ${Math.random()*10+10}s infinite`;
            document.body.appendChild(particle);
        }
    }
    initParticles();

    // ============================================
    // 2. PASSWORD TOGGLE (login/register)
    // ============================================
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.getElementById('toggleIcon');
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            toggleIcon.classList.toggle('fa-eye');
            toggleIcon.classList.toggle('fa-eye-slash');
        });
    }

    // ============================================
    // 3. LOGIN FORM HANDLING
    // ============================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const loginButton = document.getElementById('loginButton');
        const buttonText = document.getElementById('buttonText');
        const spinner = document.getElementById('spinner');
        const otpModal = document.getElementById('otpModal');
        const demoHint = document.getElementById('demoHint');

        // Forgot password link
        const forgotLink = document.getElementById('forgotPassword');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                alert('🔐 Password reset link would be sent to your email (demo).');
            });
        }

        // Google login
        const googleBtn = document.getElementById('googleLogin');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                alert('🌐 Google login demo — redirect would happen here.');
            });
        }

        // Prefill demo credentials
        if (demoHint) {
            demoHint.addEventListener('click', () => {
                emailInput.value = 'demo@finshield.ai';
                passwordInput.value = 'password123';
            });
        }

        // OTP modal elements
        const closeModal = document.getElementById('closeModal');
        const verifyBtn = document.getElementById('verifyBtn');
        const resendBtn = document.getElementById('resendBtn');
        const timerSpan = document.getElementById('timer');
        const otpInputs = [
            document.getElementById('otp1'),
            document.getElementById('otp2'),
            document.getElementById('otp3'),
            document.getElementById('otp4'),
            document.getElementById('otp5'),
            document.getElementById('otp6')
        ].filter(el => el); // filter out nulls

        let timerInterval;
        let timeLeft = 30;
        let canResend = false;

        function resetOTP() {
            otpInputs.forEach(input => { if (input) input.value = ''; });
            if (otpInputs[0]) otpInputs[0].focus();
        }

        function clearTimer() {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = null;
        }

        function startTimer() {
            clearTimer();
            timeLeft = 30;
            if (timerSpan) timerSpan.textContent = timeLeft;
            timerInterval = setInterval(() => {
                timeLeft--;
                if (timerSpan) timerSpan.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    if (timerSpan) timerSpan.textContent = '0';
                    canResend = true;
                    if (resendBtn) {
                        resendBtn.disabled = false;
                    }
                    if (verifyBtn) verifyBtn.disabled = true;
                } else {
                    canResend = false;
                    if (resendBtn) resendBtn.disabled = true;
                    if (verifyBtn) verifyBtn.disabled = false;
                }
            }, 1000);
        }

        // OTP input handling
        if (otpInputs.length) {
            otpInputs.forEach((input, index) => {
                input.addEventListener('input', function(e) {
                    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 1);
                    if (this.value && index < otpInputs.length - 1) {
                        otpInputs[index + 1].focus();
                    }
                });
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Backspace' && !this.value && index > 0) {
                        otpInputs[index - 1].focus();
                    }
                });
            });
        }

        // Close modal
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                if (otpModal) otpModal.classList.add('hidden');
                resetOTP();
                clearTimer();
                if (loginButton) {
                    loginButton.disabled = false;
                    if (buttonText) buttonText.textContent = 'Sign in';
                    if (spinner) spinner.classList.add('hidden');
                }
            });
        }

        // Resend OTP
        if (resendBtn) {
            resendBtn.addEventListener('click', () => {
                if (!canResend) return;
                timeLeft = 30;
                if (timerSpan) timerSpan.textContent = timeLeft;
                canResend = false;
                resendBtn.disabled = true;
                resetOTP();
                startTimer();
                if (otpInputs[0]) otpInputs[0].focus();
                alert('📧 New code sent to your email (demo).');
            });
        }

        // Verify button
        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => {
                const otp = otpInputs.map(inp => inp.value).join('');
                if (otp.length !== 6) {
                    alert('Please enter the full 6-digit code.');
                    return;
                }
                // Demo: accept any 6-digit code
                window.location.href = 'dashboard.html';
            });
        }

        // Login form submit
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Reset errors
            if (emailError) emailError.textContent = '';
            if (passwordError) passwordError.textContent = '';

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            let isValid = true;

            // Email validation
            if (!email) {
                if (emailError) emailError.textContent = 'Email is required';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/^[a-zA-Z0-9_]+$/.test(email)) {
                if (!/^[a-zA-Z0-9_]+$/.test(email)) {
                    if (emailError) emailError.textContent = 'Enter a valid email or username';
                    isValid = false;
                }
            }

            // Password validation
            if (!password) {
                if (passwordError) passwordError.textContent = 'Password is required';
                isValid = false;
            } else if (password.length < 6) {
                if (passwordError) passwordError.textContent = 'Password must be at least 6 characters';
                isValid = false;
            }

            if (!isValid) return;

            // Simulate loading
            if (loginButton) {
                loginButton.disabled = true;
                if (buttonText) buttonText.textContent = 'Signing in...';
                if (spinner) spinner.classList.remove('hidden');
            }

            setTimeout(() => {
                if (loginButton) {
                    loginButton.disabled = false;
                    if (buttonText) buttonText.textContent = 'Sign in';
                    if (spinner) spinner.classList.add('hidden');
                }
                // Show 2FA modal if it exists
                if (otpModal) {
                    otpModal.classList.remove('hidden');
                    resetOTP();
                    startTimer();
                } else {
                    // If no OTP modal, redirect to dashboard
                    window.location.href = 'dashboard.html';
                }
            }, 1500);
        });
    }

    // ============================================
    // 4. REGISTER FORM HANDLING
    // ============================================
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmInput = document.getElementById('confirmPassword');
        const termsCheck = document.getElementById('terms');

        const fullNameError = document.getElementById('fullNameError');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const confirmError = document.getElementById('confirmError');
        const termsError = document.getElementById('termsError');

        const strengthMeter = document.getElementById('strengthMeter');
        const strengthText = document.getElementById('strengthText');

        const registerButton = document.getElementById('registerButton');
        const buttonText = document.getElementById('buttonText');
        const spinner = document.getElementById('spinner');

        // Password strength calculation
        function calculateStrength(password) {
            if (!password) return 0;
            let score = 0;
            if (password.length >= 8) score++;
            if (password.length >= 12) score++;
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
            if (/\d/.test(password)) score++;
            if (/[^a-zA-Z0-9]/.test(password)) score++;
            return Math.min(score, 4);
        }

        function updateStrengthMeter(score) {
            if (!strengthMeter || !strengthText) return;
            strengthMeter.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
            if (score === 0) {
                strengthMeter.style.width = '0%';
                strengthMeter.style.background = 'transparent';
                strengthText.textContent = '';
            } else if (score <= 2) {
                strengthMeter.classList.add('strength-weak');
                strengthText.textContent = 'Weak password';
            } else if (score === 3) {
                strengthMeter.classList.add('strength-medium');
                strengthText.textContent = 'Medium password';
            } else {
                strengthMeter.classList.add('strength-strong');
                strengthText.textContent = 'Strong password';
            }
        }

        function validateConfirmPassword() {
            if (!confirmInput || !passwordInput || !confirmError) return;
            const password = passwordInput.value;
            const confirm = confirmInput.value;
            if (confirm && password !== confirm) {
                confirmError.textContent = 'Passwords do not match';
                confirmInput.classList.add('error');
            } else {
                confirmError.textContent = '';
                confirmInput.classList.remove('error');
            }
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                const strength = calculateStrength(passwordInput.value);
                updateStrengthMeter(strength);
                if (confirmInput) validateConfirmPassword();
            });
        }

        if (confirmInput) {
            confirmInput.addEventListener('input', validateConfirmPassword);
        }

        // Google signup
        const googleBtn = document.getElementById('googleSignup');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                alert('🌐 Google signup demo — redirect would happen here.');
            });
        }

        // Demo hint
        const demoHint = document.getElementById('demoHint');
        if (demoHint) {
            demoHint.addEventListener('click', () => {
                if (fullNameInput) fullNameInput.value = 'Demo User';
                if (emailInput) emailInput.value = 'demo@finshield.ai';
                if (passwordInput) {
                    passwordInput.value = 'Password123!';
                    updateStrengthMeter(calculateStrength('Password123!'));
                }
                if (confirmInput) confirmInput.value = 'Password123!';
                if (termsCheck) termsCheck.checked = true;
            });
        }

        // Terms links
        document.querySelectorAll('a[href="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                alert('📄 Terms / Privacy policy (demo).');
            });
        });

        // Form submit
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Reset errors
            if (fullNameError) fullNameError.textContent = '';
            if (emailError) emailError.textContent = '';
            if (passwordError) passwordError.textContent = '';
            if (confirmError) confirmError.textContent = '';
            if (termsError) termsError.textContent = '';

            const fullName = fullNameInput ? fullNameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';
            const confirm = confirmInput ? confirmInput.value : '';
            const terms = termsCheck ? termsCheck.checked : false;

            let isValid = true;

            // Full name
            if (!fullName) {
                if (fullNameError) fullNameError.textContent = 'Full name is required';
                isValid = false;
            } else if (fullName.length < 2) {
                if (fullNameError) fullNameError.textContent = 'Name must be at least 2 characters';
                isValid = false;
            }

            // Email
            if (!email) {
                if (emailError) emailError.textContent = 'Email is required';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                if (emailError) emailError.textContent = 'Enter a valid email address';
                isValid = false;
            }

            // Password
            if (!password) {
                if (passwordError) passwordError.textContent = 'Password is required';
                isValid = false;
            } else if (password.length < 6) {
                if (passwordError) passwordError.textContent = 'Password must be at least 6 characters';
                isValid = false;
            } else {
                const strength = calculateStrength(password);
                if (strength < 2) {
                    if (passwordError) passwordError.textContent = 'Password is too weak (add uppercase, numbers, or symbols)';
                    isValid = false;
                }
            }

            // Confirm
            if (password !== confirm) {
                if (confirmError) confirmError.textContent = 'Passwords do not match';
                isValid = false;
            }

            // Terms
            if (!terms) {
                if (termsError) termsError.textContent = 'You must agree to the terms';
                isValid = false;
            }

            if (!isValid) return;

            // Simulate loading
            if (registerButton) {
                registerButton.disabled = true;
                if (buttonText) buttonText.textContent = 'Creating account...';
                if (spinner) spinner.classList.remove('hidden');
            }

            setTimeout(() => {
                alert('✅ Account created successfully! Please log in.');
                window.location.href = 'login.html';
            }, 1500);
        });
    }

    // ============================================
    // 5. FILE UPLOAD PAGE (upload_statement.html)
    // ============================================
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
        const fileInput = document.getElementById('fileInput');
        const fileList = document.getElementById('fileList');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const clearBtn = document.getElementById('clearBtn');
        const progressContainer = document.getElementById('progressContainer');
        const progressFill = document.getElementById('progressFill');
        const uploadCount = document.getElementById('uploadCount');
        const totalFiles = document.getElementById('totalFiles');
        const progressPercent = document.getElementById('progressPercent');

        let files = [];

        function formatBytes(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / 1048576).toFixed(1) + ' MB';
        }

        function getFileIcon(filename) {
            const ext = filename.split('.').pop().toLowerCase();
            if (ext === 'pdf') return 'fa-file-pdf text-pink-400';
            if (ext === 'csv') return 'fa-file-csv text-green-400';
            if (ext === 'ofx' || ext === 'qfx') return 'fa-file-invoice text-blue-400';
            return 'fa-file text-purple-400';
        }

        function renderFileList() {
            if (!fileList) return;
            if (files.length === 0) {
                fileList.innerHTML = '<p class="text-purple-300/50 text-sm text-center py-4">No files selected</p>';
                if (analyzeBtn) analyzeBtn.disabled = true;
            } else {
                let html = '';
                files.forEach((file, index) => {
                    html += `
                        <div class="file-item flex items-center justify-between">
                            <div class="flex items-center gap-3 truncate">
                                <i class="fas ${getFileIcon(file.name)}"></i>
                                <div class="truncate">
                                    <p class="text-sm font-medium truncate">${file.name}</p>
                                    <p class="text-xs text-purple-300/50">${formatBytes(file.size)}</p>
                                </div>
                            </div>
                            <button class="text-purple-400 hover:text-pink-400 remove-file" data-index="${index}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                });
                fileList.innerHTML = html;
                if (analyzeBtn) analyzeBtn.disabled = false;

                document.querySelectorAll('.remove-file').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const index = btn.dataset.index;
                        files.splice(index, 1);
                        renderFileList();
                    });
                });
            }
        }

        function isValidFile(file) {
            const ext = file.name.split('.').pop().toLowerCase();
            if (!['pdf', 'csv', 'ofx', 'qfx'].includes(ext)) return false;
            if (file.size > 50 * 1024 * 1024) return false; // 50MB
            return true;
        }

        function handleFiles(selectedFiles) {
            const newFiles = Array.from(selectedFiles).filter(isValidFile);
            if (newFiles.length === 0) {
                alert('Please upload valid files (PDF, CSV, OFX, QFX, max 50MB each).');
                return;
            }
            files = [...files, ...newFiles];
            renderFileList();
        }

        // Drag & drop
        dropZone.addEventListener('click', () => fileInput?.click());
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                handleFiles(e.target.files);
                fileInput.value = ''; // allow re-selection
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                files = [];
                renderFileList();
                if (progressContainer) progressContainer.classList.add('hidden');
            });
        }

        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                if (files.length === 0) return;
                analyzeBtn.disabled = true;
                if (clearBtn) clearBtn.disabled = true;
                if (progressContainer) progressContainer.classList.remove('hidden');
                const total = files.length;
                if (totalFiles) totalFiles.textContent = total;
                let uploaded = 0;
                const step = 100 / total;
                const interval = setInterval(() => {
                    uploaded++;
                    if (uploadCount) uploadCount.textContent = uploaded;
                    const percent = Math.round((uploaded / total) * 100);
                    if (progressFill) progressFill.style.width = percent + '%';
                    if (progressPercent) progressPercent.textContent = percent + '%';
                    if (uploaded >= total) {
                        clearInterval(interval);
                        setTimeout(() => {
                            alert('✅ Analysis complete! Redirecting to dashboard.');
                            window.location.href = 'dashboard.html';
                        }, 500);
                    }
                }, 800);
            });
        }

        // Sample buttons
        document.querySelectorAll('.sample-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const sampleKey = btn.dataset.sample;
                const samples = {
                    basic: { name: 'sample_basic.pdf', size: 12400 },
                    fraud: { name: 'sample_fraud.csv', size: 8700 },
                    stress: { name: 'sample_stress.ofx', size: 15300 }
                };
                if (sampleKey && samples[sampleKey]) {
                    const mockFile = new File([""], samples[sampleKey].name, { type: 'text/plain' });
                    Object.defineProperty(mockFile, 'size', { value: samples[sampleKey].size });
                    files.push(mockFile);
                    renderFileList();
                }
            });
        });
    }

    // ============================================
    // 6. CHARTS (analytics.html, dashboard.html)
    // ============================================
    function initCharts() {
        // Stress chart (dashboard)
        const stressCanvas = document.getElementById('stressChart');
        if (stressCanvas) {
            const ctx = stressCanvas.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['W1', 'W2', 'W3', 'W4'],
                    datasets: [{
                        data: [38, 35, 32, 30],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.3,
                        fill: true,
                        pointBackgroundColor: '#d946ef',
                        pointBorderColor: '#fff',
                        pointRadius: 2,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, max: 100, display: false }, x: { display: false } }
                }
            });
        }

        // Category chart (dashboard)
        const categoryCanvas = document.getElementById('categoryChart');
        if (categoryCanvas) {
            const ctx = categoryCanvas.getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Housing', 'Food', 'Transport', 'Entertainment', 'Others'],
                    datasets: [{
                        data: [1200, 580, 320, 210, 140],
                        backgroundColor: ['#8b5cf6', '#d946ef', '#f43f5e', '#fbbf24', '#4ade80'],
                        borderColor: 'transparent',
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: false } },
                    cutout: '70%',
                }
            });
        }

        // Anomaly chart (analytics) - bar with numbers
        const anomalyCanvas = document.getElementById('anomalyChart');
        if (anomalyCanvas && typeof ChartDataLabels !== 'undefined') {
            Chart.register(ChartDataLabels);
            const ctx = anomalyCanvas.getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'],
                    datasets: [{
                        data: [2.0, 2.2, 2.5, 2.7, 3.0, 3.2, 3.5, 3.7, 4.0, 4.2, 4.5, 4.7],
                        backgroundColor: '#d946ef',
                        borderRadius: 4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        datalabels: {
                            anchor: 'end',
                            align: 'top',
                            offset: 4,
                            color: '#a78bfa',
                            font: { weight: 'bold', size: 8 },
                            formatter: (value) => value.toFixed(1)
                        }
                    },
                    scales: { y: { beginAtZero: true, max: 5.5, display: false }, x: { display: true, ticks: { font: { size: 8 } } } }
                }
            });
        }

        // Gauge chart (analytics)
        const gaugeCanvas = document.getElementById('gaugeChart');
        if (gaugeCanvas) {
            const ctx = gaugeCanvas.getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [35, 65],
                        backgroundColor: ['#4ade80', '#2d3748'],
                        borderColor: 'transparent',
                        circumference: 180,
                        rotation: 270,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: false }, tooltip: { enabled: false } },
                    cutout: '80%',
                }
            });
        }

        // Pie chart (analytics)
        const pieCanvas = document.getElementById('pieChart');
        if (pieCanvas) {
            const ctx = pieCanvas.getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Phishing', 'Card Fraud', 'Identity', 'Other'],
                    datasets: [{
                        data: [40, 30, 20, 10],
                        backgroundColor: ['#d946ef', '#8b5cf6', '#22d3ee', '#fbbf24'],
                        borderColor: 'transparent',
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: false } },
                    cutout: '65%',
                }
            });
        }

        // Trend chart (dashboard healthcare version)
        const trendCanvas = document.getElementById('trendChart');
        if (trendCanvas) {
            const ctx = trendCanvas.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
                    datasets: [
                        {
                            label: 'Fraud Risk',
                            data: [12, 15, 18, 14, 10, 8],
                            borderColor: '#d946ef',
                            backgroundColor: 'rgba(217, 70, 239, 0.1)',
                            tension: 0.3,
                            pointBackgroundColor: '#d946ef',
                        },
                        {
                            label: 'Stress Score',
                            data: [42, 38, 35, 32, 30, 28],
                            borderColor: '#8b5cf6',
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            tension: 0.3,
                            pointBackgroundColor: '#8b5cf6',
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, max: 50, grid: { color: 'rgba(139,92,246,0.1)' }, ticks: { stepSize: 10, font: { size: 8 } } }, x: { ticks: { font: { size: 8 } } } }
                }
            });
        }

        // Month chart (dashboard healthcare)
        const monthCanvas = document.getElementById('monthChart');
        if (monthCanvas) {
            const ctx = monthCanvas.getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        data: [32, 28, 35, 30, 38, 25, 20],
                        backgroundColor: '#8b5cf6',
                        borderRadius: 4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { display: false, beginAtZero: true }, x: { display: false } }
                }
            });
        }

        // Activity chart (analytics) - line
        const activityCanvas = document.getElementById('activityChart');
        if (activityCanvas) {
            const ctx = activityCanvas.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Fraud Attempts',
                        data: [320, 330, 325, 340, 335, 330, 325],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.3,
                        fill: true,
                        pointBackgroundColor: '#d946ef',
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, grid: { color: 'rgba(139,92,246,0.1)' }, ticks: { stepSize: 50 } } }
                }
            });
        }
    }

    // Load Chart.js library dynamically if not present? We assume it's already loaded via CDN in HTML.
    // But we need to ensure charts are initialized only after Chart is defined.
    if (typeof Chart !== 'undefined') {
        initCharts();
    } else {
        // If Chart is not loaded yet, wait for it
        window.addEventListener('load', function() {
            if (typeof Chart !== 'undefined') {
                initCharts();
            }
        });
    }

    // ============================================
    // 7. TICKER ROTATION (analytics.html)
    // ============================================
    const ticker = document.getElementById('ticker');
    if (ticker) {
        setInterval(() => {
            const items = ticker.children;
            if (items.length > 0) {
                ticker.appendChild(items[0].cloneNode(true));
                ticker.removeChild(items[0]);
            }
        }, 3000);
    }

    // ============================================
    // 8. CHART FILTERS (dashboard.html)
    // ============================================
    const chartFilters = document.querySelectorAll('.chart-filter');
    if (chartFilters.length) {
        // This assumes a chart instance is available; we'll need to store references.
        // For simplicity, we'll just add demo alerts.
        chartFilters.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                alert('📊 Chart period changed (demo).');
            });
        });
    }

    // ============================================
    // 9. GENERAL BUTTON HANDLERS (demo alerts)
    // ============================================
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        // Skip buttons inside tables (already handled) and those with specific handlers
        if (btn.closest('td') || btn.id === 'loginButton' || btn.id === 'registerButton' || btn.id === 'analyzeBtn' || btn.id === 'clearBtn' || btn.closest('.otp-input')) return;
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const text = btn.textContent.trim();
            if (text.includes('Refresh')) alert('🔄 Refreshing data...');
            else if (text.includes('Export')) alert('📄 Exporting...');
            else if (text.includes('Share')) alert('🔗 Share dialog opened (demo).');
            else if (text.includes('Download')) alert('📥 Download started (demo).');
            else if (text.includes('Upload')) alert('📤 Upload page would open.');
            else if (text.includes('Add account')) alert('➕ Add account flow.');
            else if (text.includes('Transfer')) alert('💸 Transfer money');
            else if (text.includes('Pay Bills')) alert('🧾 Pay bills');
            else if (text.includes('Investigate')) alert('🔍 Investigating...');
            else if (text.includes('Run Prediction')) alert('🚀 Running predictive model...');
            else if (text.includes('Apply')) alert('✅ Filters applied');
            else if (text.includes('Clear')) alert('🗑️ Filters cleared');
            else if (text.includes('List')) alert('📋 Switching to list view');
            else if (text.includes('Timeline')) alert('📅 Switching to timeline view');
        });
    });

    // ============================================
    // 10. TABLE VIEW BUTTONS (history.html)
    // ============================================
    document.querySelectorAll('td button').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('🔍 Viewing transaction details (demo).');
        });
    });

    // ============================================
    // 11. PAGINATION BUTTONS (history.html)
    // ============================================
    document.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('📄 Page changed (demo).');
        });
    });

})();