(function () {
    /* =========================================
       1. RATING TEMPLATES PER CATEGORY
    ========================================= */
    const RATING_TEMPLATES = {
        household: [
            { key: 'cleaning',   label: 'Cleaning effectiveness' },
            { key: 'fragrance',  label: 'Fragrance / scent' },
            { key: 'value',      label: 'Value for money' },
            { key: 'packaging',  label: 'Packaging quality' },
            { key: 'dissolving', label: 'Dissolves easily in water' }
        ],
        beauty: [
            { key: 'effectiveness', label: 'Effectiveness / results' },
            { key: 'texture',       label: 'Texture & feel on skin' },
            { key: 'scent',         label: 'Fragrance / scent' },
            { key: 'absorption',    label: 'Absorption (if applicable)' },
            { key: 'value',         label: 'Value for money' },
            { key: 'packaging',     label: 'Packaging quality' }
        ],
        electronics: [
            { key: 'performance', label: 'Performance & speed' },
            { key: 'battery',     label: 'Battery life' },
            { key: 'build',       label: 'Build quality' },
            { key: 'display',     label: 'Display / screen quality' },
            { key: 'camera',      label: 'Camera quality (if applicable)' },
            { key: 'value',       label: 'Value for money' }
        ],
        food: [
            { key: 'taste',     label: 'Taste & flavour' },
            { key: 'freshness', label: 'Freshness' },
            { key: 'packaging', label: 'Packaging & sealing' },
            { key: 'quantity',  label: 'Quantity for the price' },
            { key: 'value',     label: 'Value for money' }
        ],
        fashion: [
            { key: 'fit',        label: 'Fit & sizing accuracy' },
            { key: 'comfort',    label: 'Comfort' },
            { key: 'material',   label: 'Material quality' },
            { key: 'durability', label: 'Durability after washing' },
            { key: 'value',      label: 'Value for money' }
        ],
        automotive: [
            { key: 'performance', label: 'Engine performance' },
            { key: 'longevity',   label: 'Longevity / how long it lasts' },
            { key: 'value',       label: 'Value for money' },
            { key: 'packaging',   label: 'Packaging & handling' },
            { key: 'effect',      label: 'Effectiveness on engine' }
        ]
    };


    /* =========================================
       2. RENDER RATING ROWS BASED ON CATEGORY
    ========================================= */
    const categorySelect = document.getElementById('productCategory');
    const ratingsList    = document.getElementById('ratingsList');
    const ratingsHint    = document.getElementById('ratingsHint');

    function buildRatingRow(template) {
        const row = document.createElement('div');
        row.className = 'rating-item';
        row.innerHTML = `
            <span class="rating-label">${template.label}</span>
            <div class="star-input" data-name="${template.key}">
                ${[1,2,3,4,5].map(v => `
                    <button type="button" class="star" data-value="${v}" aria-label="${v} star${v>1?'s':''}">
                        <i class="fa-regular fa-star"></i>
                    </button>
                `).join('')}
            </div>
            <span class="rating-value" data-value="0">Not rated</span>
        `;
        return row;
    }

    function renderRatings(category) {
        const template = RATING_TEMPLATES[category];

        if (!template) {
            ratingsList.innerHTML = `
                <div class="ratings-empty" id="ratingsEmpty">
                    <i class="fa-solid fa-star-half-stroke"></i>
                    <p>Select a category in <strong>Section 02</strong> to see rating areas.</p>
                </div>
            `;
            ratingsHint.textContent = "Pick a category above and we'll show the right things to rate.";
            return;
        }

        ratingsList.innerHTML = '';
        template.forEach(t => ratingsList.appendChild(buildRatingRow(t)));

        const niceName = category.charAt(0).toUpperCase() + category.slice(1);
        ratingsHint.textContent = `Rating ${template.length} areas specific to ${niceName}.`;
    }

    if (categorySelect && ratingsList) {
        categorySelect.addEventListener('change', () => {
            renderRatings(categorySelect.value);
        });
        if (categorySelect.value) renderRatings(categorySelect.value);
    }


    /* =========================================
       3. STAR INPUT — event delegation
       (works for both static + dynamic rows)
    ========================================= */

    // Hover preview
    document.addEventListener('mouseover', e => {
        const star = e.target.closest('.star');
        if (!star) return;

        const group = star.closest('.star-input');
        if (!group) return;

        const stars = Array.from(group.querySelectorAll('.star'));
        const index = stars.indexOf(star);

        stars.forEach((s, i) => {
            const icon = s.querySelector('i');
            if (i <= index) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        });
    });

    // Reset preview on leaving group
    document.addEventListener('mouseout', e => {
        const star = e.target.closest('.star');
        if (!star) return;

        const group = star.closest('.star-input');
        if (!group) return;

        const related = e.relatedTarget;
        if (related && group.contains(related)) return;

        const current = parseInt(group.dataset.rating || 0, 10);
        group.querySelectorAll('.star').forEach((s, i) => {
            const icon = s.querySelector('i');
            if (i < current) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        });
    });

    // Click to select
    document.addEventListener('click', e => {
        const star = e.target.closest('.star');
        if (!star) return;

        const group = star.closest('.star-input');
        if (!group) return;

        const value = parseInt(star.dataset.value, 10);
        group.dataset.rating = value;

        group.querySelectorAll('.star').forEach((s, i) => {
            const icon = s.querySelector('i');
            if (i < value) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        });

        const valueLabel = group.parentElement.querySelector('.rating-value');
        if (valueLabel) {
            valueLabel.textContent = value + ' / 5';
            valueLabel.dataset.value = value;
            valueLabel.classList.add('rated');
        }
    });


    /* =========================================
       4. CHARACTER COUNTER
    ========================================= */
    const reviewText = document.getElementById('reviewText');
    const charCount  = document.getElementById('charCount');

    if (reviewText && charCount) {
        reviewText.addEventListener('input', () => {
            charCount.textContent = reviewText.value.length;
        });
    }


    /* =========================================
       5. PHOTO UPLOAD PREVIEW
    ========================================= */
    const photoInput   = document.getElementById('photoInput');
    const photoPreview = document.getElementById('photoPreview');
    const uploadZone   = document.getElementById('uploadZone');

    let selectedFiles = [];

    function renderPreviews() {
        photoPreview.innerHTML = '';
        selectedFiles.forEach((file, i) => {
            const url = URL.createObjectURL(file);
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `
                <img src="${url}" alt="Preview">
                <button type="button" class="preview-remove" data-index="${i}" aria-label="Remove photo">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;
            photoPreview.appendChild(div);
        });
    }

    if (photoInput) {
        photoInput.addEventListener('change', () => {
            const files = Array.from(photoInput.files);
            files.forEach(f => {
                if (f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024) {
                    selectedFiles.push(f);
                }
            });
            renderPreviews();
        });
    }

    photoPreview.addEventListener('click', e => {
        const btn = e.target.closest('.preview-remove');
        if (!btn) return;
        const index = parseInt(btn.dataset.index, 10);
        selectedFiles.splice(index, 1);
        renderPreviews();
    });

    if (uploadZone) {
        ['dragenter', 'dragover'].forEach(evt => {
            uploadZone.addEventListener(evt, e => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(evt => {
            uploadZone.addEventListener(evt, e => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
            });
        });

        uploadZone.addEventListener('drop', e => {
            const files = Array.from(e.dataTransfer.files);
            files.forEach(f => {
                if (f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024) {
                    selectedFiles.push(f);
                }
            });
            renderPreviews();
        });
    }


    /* =========================================
       6. TOAST
    ========================================= */
    const toast        = document.getElementById('toast');
    const toastTitle   = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastClose   = document.getElementById('toastClose');
    let toastTimer;

    function showToast(title, message, type = 'success') {
        toastTitle.textContent = title;
        toastMessage.textContent = message;

        toast.classList.remove('toast-success', 'toast-error');
        toast.classList.add(type === 'error' ? 'toast-error' : 'toast-success');
        toast.classList.add('show');

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    if (toastClose) {
        toastClose.addEventListener('click', () => {
            toast.classList.remove('show');
            clearTimeout(toastTimer);
        });
    }


    /* =========================================
       7. FORM SUBMIT
    ========================================= */
    const form = document.getElementById('reviewForm');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            // 1) Category must be selected
            if (!categorySelect.value) {
                showToast('No category selected', 'Please pick a category in Section 02 first.', 'error');
                categorySelect.focus();
                categorySelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // 2) All required text inputs / radios
            const requiredFields = form.querySelectorAll('[required]');
            let firstInvalid = null;

            requiredFields.forEach(field => {
                if (field.type === 'radio') {
                    const groupChecked = form.querySelector(`input[name="${field.name}"]:checked`);
                    if (!groupChecked && !firstInvalid) firstInvalid = field;
                } else if (!field.value.trim() && !firstInvalid) {
                    firstInvalid = field;
                }
            });

            if (firstInvalid) {
                showToast('Missing information', 'Please fill in all required fields before submitting.', 'error');
                firstInvalid.focus();
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // 3) Every rating row must be rated
            const ratings = document.querySelectorAll('.star-input');
            let ratingsComplete = ratings.length > 0;
            ratings.forEach(g => { if (!g.dataset.rating) ratingsComplete = false; });

            if (!ratingsComplete) {
                showToast('Ratings incomplete', 'Please rate every aspect with the stars before submitting.', 'error');
                return;
            }

            // 4) Fake submit
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Submitting... <i class="fa-solid fa-circle-notch fa-spin"></i>';

            setTimeout(() => {
                const firstName = document.getElementById('userName').value.trim().split(' ')[0];
                const product   = document.getElementById('productName').value.trim();

                showToast(
                    'Review submitted! 🎉',
                    `Thanks ${firstName}, your review of "${product}" is being verified.`
                );

                form.reset();
                selectedFiles = [];
                renderPreviews();
                charCount.textContent = '0';

                // Clear ratings panel back to empty state
                renderRatings('');

                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Review <i class="fa-solid fa-arrow-right"></i>';
            }, 900);
        });
    }
})();