// Nav: transparent on hero, white on scroll
const nav = document.getElementById('main-nav');
const navLinks = document.querySelectorAll('.nav-link');
const navLogo = document.querySelector('.nav-logo');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 80;
    nav.classList.toggle('bg-white/80', scrolled);
    nav.classList.toggle('backdrop-blur-md', scrolled);
    nav.classList.toggle('shadow-sm', scrolled);
    navLogo.classList.toggle('text-white', !scrolled);
    navLogo.classList.toggle('text-primary', scrolled);
    navLinks.forEach(link => {
        link.classList.toggle('text-white', !scrolled);
        link.classList.toggle('text-white/80', !scrolled);
        link.classList.toggle('text-secondary', scrolled);
        link.classList.toggle('hover:text-white', !scrolled);
        link.classList.toggle('hover:text-primary', scrolled);
    });
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

// Use Case Gallery
const useCaseData = {
    mural: {
        title: '인테리어 벽화',
        description: '실내 분위기를 살리는 대형 포인트 벽화',
        images: ['images/gallery_mural_01.jpg', 'images/gallery_mural_02.jpg', 'images/gallery_mural_03.jpg', 'images/gallery_mural_04.jpg', 'images/gallery_mural_05.jpg'],
    },
    signage: {
        title: '캐릭터 간판',
        description: '브랜드 아이덴티티를 담은 입체적인 사이니지',
        images: ['images/gallery_signage_01.jpg', 'images/gallery_signage_02.jpg', 'images/gallery_signage_03.jpg', 'images/gallery_signage_04.jpg', 'images/gallery_signage_05.jpg'],
    },
    wrapping: {
        title: '인테리어 랩핑',
        description: '유휴 공간을 풍성하게 채우는 그래픽 솔루션',
        images: ['images/gallery_wrapping_01.jpg', 'images/gallery_wrapping_02.jpg', 'images/gallery_wrapping_03.jpg', 'images/gallery_wrapping_04.jpg', 'images/gallery_wrapping_05.jpg'],
    },
};

let currentSlideIndex = 1;
let isTransitioning = false;

const track = document.getElementById('carousel-track');
const dotContainer = document.getElementById('carousel-dots');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const paginationText = document.getElementById('detail-pagination');
const detailTitle = document.getElementById('detail-title');
const detailDesc = document.getElementById('detail-description');
const cards = document.querySelectorAll('.use-case-card');
const galleryWrapper = document.getElementById('gallery-wrapper');
const useCaseGrid = document.getElementById('use-case-grid');

function getRealCount() { return dotContainer.querySelectorAll('div').length; }

function getRealIndex() {
    const n = getRealCount();
    if (currentSlideIndex === 0) return n - 1;
    if (currentSlideIndex > n) return 0;
    return currentSlideIndex - 1;
}

function syncDots() {
    const ri = getRealIndex();
    const n = getRealCount();
    dotContainer.querySelectorAll('div').forEach((dot, i) => {
        dot.classList.toggle('bg-white', i === ri);
        dot.classList.toggle('border-gray-300', i === ri);
        dot.classList.toggle('scale-125', i === ri);
        dot.classList.toggle('bg-white/40', i !== ri);
        dot.classList.toggle('border-white/20', i !== ri);
    });
    paginationText.textContent = `${ri + 1} / ${n}`;
}

function moveTo(index, animate = true) {
    if (!animate) { track.style.transition = 'none'; track.offsetHeight; }
    else track.style.transition = '';
    track.style.transform = `translateX(-${index * 100}%)`;
}

track.addEventListener('transitionend', () => {
    const n = getRealCount();
    if (currentSlideIndex === n + 1) { currentSlideIndex = 1; moveTo(1, false); }
    else if (currentSlideIndex === 0) { currentSlideIndex = n; moveTo(n, false); }
    isTransitioning = false;
});

nextBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentSlideIndex++;
    moveTo(currentSlideIndex);
    syncDots();
});

prevBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentSlideIndex--;
    moveTo(currentSlideIndex);
    syncDots();
});

function buildCarousel(images) {
    currentSlideIndex = 1;
    isTransitioning = false;
    track.innerHTML = '';
    dotContainer.innerHTML = '';
    const n = images.length;
    [images[n - 1], ...images, images[0]].forEach(src => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `<img src="${src}" class="w-full h-full object-cover" alt="">`;
        track.appendChild(slide);
    });
    images.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'w-2.5 h-2.5 rounded-full border cursor-pointer transition-all duration-300';
        dot.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentSlideIndex = i + 1;
            moveTo(currentSlideIndex);
            syncDots();
        });
        dotContainer.appendChild(dot);
    });
    moveTo(1, false);
    syncDots();
}

function setActiveCategory(category) {
    const data = useCaseData[category];
    detailTitle.textContent = data.title;
    detailDesc.textContent = data.description;
    buildCarousel(data.images);

    // 클릭한 카드 래퍼 찾기
    const cardWrapper = document.querySelector(`[data-card="${category}"]`);
    const grid = document.getElementById('use-case-grid');

    if (window.innerWidth < 768) {
        // 모바일: 클릭한 카드 바로 아래에 삽입
        cardWrapper.after(galleryWrapper);
    } else {
        // 데스크탑: 그리드 아래에 삽입
        grid.after(galleryWrapper);
    }

    galleryWrapper.classList.remove('hidden');
    galleryWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    cards.forEach(c => c.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
}

cards.forEach(card => {
    card.addEventListener('click', () => {
        setActiveCategory(card.getAttribute('data-category'));
    });
});

function resetGallery() {
    galleryWrapper.classList.add('hidden');
    cards.forEach(c => c.classList.remove('active'));
}

