document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navRight = document.querySelector('.nav-right');
    const links = document.querySelectorAll('.nav-links a');

    // Handle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        navRight.classList.toggle('active');
    });

    // Handle active link states
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active class from all links
            links.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            e.target.classList.add('active');

            // If on mobile, close the menu
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                navRight.classList.remove('active');
            }
        });
    });

    // Set initial active state
    if (links.length > 0) {
        links[0].classList.add('active');
    }

    // Popular cards animation with drag functionality
    const popularCardsInner = document.querySelector('.popular-cards-inner');
    const popularCards = document.querySelector('.popular-cards');

    let isDragging = false;
    let startPosition = 0;
    let currentTranslate = 0;
    let previousTranslate = 0;
    let animationID = null;
    let isAutoScrolling = true;

    function startAutoScroll() {
        if (!isAutoScrolling) return;
        
        const totalWidth = popularCardsInner.scrollWidth;
        const containerWidth = popularCards.offsetWidth;
        
        currentTranslate -= 1; // Speed of auto-scroll
        
        if (Math.abs(currentTranslate) >= totalWidth - containerWidth) {
            currentTranslate = 0;
        }
        
        popularCardsInner.style.transform = `translateX(${currentTranslate}px)`;
        animationID = requestAnimationFrame(startAutoScroll);
    }

    function stopAutoScroll() {
        if (animationID) {
            cancelAnimationFrame(animationID);
            animationID = null;
        }
    }

    function dragStart(e) {
        if (e.type === 'touchstart') {
            startPosition = e.touches[0].clientX;
        } else {
            startPosition = e.clientX;
            e.preventDefault();
        }
        
        stopAutoScroll();
        isAutoScrolling = false;
        isDragging = true;
        popularCardsInner.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;

        let currentPosition;
        if (e.type === 'touchmove') {
            currentPosition = e.touches[0].clientX;
        } else {
            currentPosition = e.clientX;
        }

        const diff = currentPosition - startPosition;
        currentTranslate = previousTranslate + diff;

        // Add boundaries to prevent dragging too far
        const totalWidth = popularCardsInner.scrollWidth;
        const containerWidth = popularCards.offsetWidth;
        const minTranslate = -(totalWidth - containerWidth);

        // Restrict movement within bounds
        if (currentTranslate > 0) {
            currentTranslate = 0;
        } else if (currentTranslate < minTranslate) {
            currentTranslate = minTranslate;
        }

        popularCardsInner.style.transform = `translateX(${currentTranslate}px)`;
    }

    function dragEnd() {
        isDragging = false;
        previousTranslate = currentTranslate;
        popularCardsInner.style.cursor = 'grab';
    }

    // Touch events
    popularCards.addEventListener('touchstart', dragStart);
    popularCards.addEventListener('touchmove', drag);
    popularCards.addEventListener('touchend', dragEnd);

    // Mouse events
    popularCards.addEventListener('mousedown', dragStart);
    popularCards.addEventListener('mousemove', drag);
    popularCards.addEventListener('mouseup', dragEnd);
    popularCards.addEventListener('mouseleave', dragEnd);

    // Start auto-scroll initially
    startAutoScroll();

    // Pause animation on hover/touch
    popularCards.addEventListener('mouseenter', () => {
        stopAutoScroll();
        isAutoScrolling = false;
    });

    popularCards.addEventListener('mouseleave', () => {
        if (!isDragging) {
            isAutoScrolling = true;
            startAutoScroll();
        }
    });

    // Prevent card clicks during drag
    popularCardsInner.addEventListener('click', (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    // Search functionality
    const searchContainer = document.querySelector('.search-container');
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');

    searchBtn.addEventListener('click', () => {
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            searchInput.focus();
        }
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target) && searchContainer.classList.contains('active')) {
            searchContainer.classList.remove('active');
        }
    });

    // Close search when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchContainer.classList.contains('active')) {
            searchContainer.classList.remove('active');
        }
    });

    // Registration Popup Functionality
    const registerBtn = document.querySelector('.register-btn');
    const registerPopup = document.getElementById('registerPopup');
    const closePopupBtn = document.getElementById('closePopup');
    const registerForm = document.querySelector('.register-form');

    // Open popup with animation
    registerBtn.addEventListener('click', () => {
        registerPopup.style.display = 'flex';
        // Trigger reflow
        registerPopup.offsetHeight;
        registerPopup.classList.add('active');
    });

    // Close popup with animation
    closePopupBtn.addEventListener('click', () => {
        registerPopup.classList.remove('active');
        setTimeout(() => {
            registerPopup.style.display = 'none';
        }, 300);
    });

    // Close popup when clicking outside
    registerPopup.addEventListener('click', (e) => {
        if (e.target === registerPopup) {
            registerPopup.classList.remove('active');
            setTimeout(() => {
                registerPopup.style.display = 'none';
            }, 300);
        }
    });

    // Handle form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Add your registration logic here
        console.log('Registration submitted:', { username, email, password });
        
        // Optional: Show success message
        alert('Registration successful!');
        registerPopup.classList.remove('active');
        setTimeout(() => {
            registerPopup.style.display = 'none';
            registerForm.reset();
        }, 300);
    });

    // Social login buttons (add your authentication logic)
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.classList[1]; // google, twitter, or facebook
            console.log(`${platform} login clicked`);
            // Add your social login logic here
        });
    });

    // NFT Details Popup Functionality
    function initializeNFTPopup() {
        console.log('Initializing NFT popup functionality');
        const cards = document.querySelectorAll('.popular-cards .card');
        console.log('Found cards:', cards.length);

        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Prevent drag functionality from interfering with click
                if (!isDragging) {
                    console.log('Card clicked');
                    const popup = document.getElementById('nftDetailsPopup');
                    
                    if (!popup) {
                        console.error('Popup element not found');
                        return;
                    }

                    try {
                        // Get data from the clicked card
                        const cardImage = card.querySelector('img').src;
                        const cardTitle = card.querySelector('.title-row h3').textContent;
                        const cardCreator = card.querySelector('.creator').textContent;
                        const cardPrice = card.querySelector('.price').textContent;
                        const cardLikes = card.querySelector('.likes span').textContent;

                        console.log('Card data:', { cardImage, cardTitle, cardCreator, cardPrice, cardLikes });

                        // Set popup content
                        document.getElementById('popupNftImage').src = cardImage;
                        document.getElementById('popupTitle').textContent = cardTitle;
                        document.getElementById('popupCreator').textContent = cardCreator.replace('by ', '');
                        document.getElementById('popupPrice').textContent = cardPrice;
                        document.getElementById('popupLikes').textContent = cardLikes;

                        // Show popup
                        popup.style.display = 'flex';
                        document.body.style.overflow = 'hidden'; // Prevent background scrolling
                    } catch (error) {
                        console.error('Error updating popup content:', error);
                    }
                }
            });
        });

        // Close popup when clicking the close button
        const closeButton = document.getElementById('closeNftPopup');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                const popup = document.getElementById('nftDetailsPopup');
                popup.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            });
        }

        // Close popup when clicking outside
        const popup = document.getElementById('nftDetailsPopup');
        if (popup) {
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    popup.style.display = 'none';
                    document.body.style.overflow = ''; // Restore scrolling
                }
            });
        }
    }

    initializeNFTPopup();

    // Artwork Details Popup Functionality
    const artworkDetailsPopup = document.getElementById('artworkDetailsPopup');
    const closeArtworkPopup = document.getElementById('closeArtworkPopup');
    const artworkCards = document.querySelectorAll('.artwork-card');

    // Artwork data for each card
    const artworkData = [
        {
            id: '12345',
            title: 'Abstract Collection',
            image: 'images/abstract1.jpg',
            creator: {
                name: 'Digital Artist Pro',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=crop&q=80'
            },
            description: 'A stunning collection of abstract digital art that combines vibrant colors with modern design principles. Each piece is unique and represents the convergence of traditional art and blockchain technology.',
            likes: 234,
            views: 1542,
            collection: 'Abstract Collection',
            category: 'Digital Art',
            price: '2.5'
        },
        {
            id: '12346',
            title: '3D Art Collection',
            image: 'images/3d.jpg',
            creator: {
                name: 'Pixel Master',
                image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&fit=crop&q=80'
            },
            description: 'A nostalgic journey through pixel art masterpieces. This collection features retro-inspired designs with a modern twist, perfect for gaming enthusiasts and digital art collectors.',
            likes: 186,
            views: 892,
            collection: 'Pixel Perfect',
            category: 'Pixel Art',
            price: '1.8'
        },
        {
            id: '12347',
            title: 'MOdern Art Collection',
            image: 'images/modern1.jpg',
            creator: {
                name: '3D Virtuoso',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80'
            },
            description: 'Explore the boundaries of digital sculpture with this innovative collection. Each piece showcases the possibilities of 3D art in the NFT space.',
            likes: 312,
            views: 1876,
            collection: '3D Masterworks',
            category: '3D Art',
            price: '3.2'
        },
        {
            id: '12348',
            title: 'Game Art Collection',
            image: 'images/game.jpg',
            creator: {
                name: 'Photo Artist',
                image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&fit=crop&q=80'
            },
            description: 'A breathtaking series of photographs capturing moments frozen in time. Each NFT represents a unique perspective on life, nature, and human experience.',
            likes: 428,
            views: 2341,
            collection: 'Captured Moments',
            category: 'Photography',
            price: '2.8'
        },
        {
            id: '12349',
            title: 'Graffiti Collection',
            image: 'images/grafiti.jpg',
            creator: {
                name: 'Digital Painter',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&fit=crop&q=80'
            },
            description: 'Traditional painting techniques meet digital innovation in this stunning collection. Each piece demonstrates the perfect blend of classical art and modern technology.',
            likes: 567,
            views: 3102,
            collection: 'Digital Canvas',
            category: 'Digital Painting',
            price: '4.5'
        },
        {
            id: '12350',
            title: 'Watercolor Collection',
            image: 'images/watercolor.jpg',
            creator: {
                name: 'Algorithm Artist',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop&q=80'
            },
            description: 'Experience the beauty of algorithm-generated art. This collection showcases the fascinating intersection of mathematics, code, and artistic expression.',
            likes: 289,
            views: 1654,
            collection: 'Generated Beauty',
            category: 'Generative Art',
            price: '2.2'
        }
    ];

    function showArtworkDetails(artwork) {
        // Update popup content with artwork data
        document.getElementById('popupArtworkImage').src = artwork.image;
        document.getElementById('popupArtworkTitle').textContent = artwork.title;
        document.getElementById('popupArtworkId').textContent = `#${artwork.id}`;
        document.getElementById('popupArtworkCreatorImg').src = artwork.creator.image;
        document.getElementById('popupArtworkCreator').textContent = artwork.creator.name;
        document.getElementById('popupArtworkDescription').textContent = artwork.description;
        document.getElementById('popupArtworkLikes').textContent = artwork.likes;
        document.getElementById('popupArtworkViews').textContent = artwork.views;
        document.getElementById('popupArtworkCollection').textContent = artwork.collection;
        document.getElementById('popupArtworkCategory').textContent = artwork.category;
        document.getElementById('popupArtworkPrice').textContent = `${artwork.price} ETH`;

        // Show popup
        artworkDetailsPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Add click event to artwork cards
    artworkCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // Get the artwork data for this specific card
            const artwork = artworkData[index];
            if (artwork) {
                showArtworkDetails(artwork);
            }
        });
    });

    // Close popup events
    closeArtworkPopup.addEventListener('click', () => {
        artworkDetailsPopup.classList.remove('active');
        document.body.style.overflow = '';
    });

    artworkDetailsPopup.addEventListener('click', (e) => {
        if (e.target === artworkDetailsPopup) {
            artworkDetailsPopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Like button functionality with animation
    const likeBtn = document.querySelector('.like-btn');
    likeBtn.addEventListener('click', function() {
        const likesCount = document.getElementById('popupArtworkLikes');
        let currentLikes = parseInt(likesCount.textContent);
        
        if (this.classList.contains('liked')) {
            currentLikes--;
            this.classList.remove('liked');
            this.style.animation = '';
        } else {
            currentLikes++;
            this.classList.add('liked');
            this.style.animation = 'likeAnimation 0.5s ease';
        }
        
        likesCount.textContent = currentLikes;
    });

    // Share button functionality
    const shareBtn = document.querySelector('.share-btn');
    shareBtn.addEventListener('click', () => {
        const title = document.getElementById('popupArtworkTitle').textContent;
        alert(`Sharing "${title}" coming soon!`);
    });

    // Follow button functionality
    const followBtn = document.querySelector('.follow-btn');
    followBtn.addEventListener('click', function() {
        if (this.classList.contains('following')) {
            this.textContent = 'Follow';
            this.classList.remove('following');
        } else {
            this.textContent = 'Following';
            this.classList.add('following');
        }
    });

    // Join button animation
    const joinBtn = document.querySelector('.join-btn');
    if (joinBtn) {
        joinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add clicked class for pulse animation
            this.classList.add('clicked');
            
            // Create and append confetti elements
            for (let i = 0; i < 50; i++) {
                createConfetti(e.clientX, e.clientY);
            }
            
            // Remove clicked class after animation
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 500);
            
            // Show welcome message
            const message = document.createElement('div');
            message.className = 'welcome-message';
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(-45deg, #FF3CAC, #784BA0, #2B86C5);
                color: white;
                padding: 20px 40px;
                border-radius: 10px;
                font-size: 1.2rem;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            `;
            message.textContent = 'Welcome to our NFT Community! ';
            document.body.appendChild(message);
            
            // Fade in the message
            setTimeout(() => {
                message.style.opacity = '1';
            }, 100);
            
            // Remove the message after 3 seconds
            setTimeout(() => {
                message.style.opacity = '0';
                setTimeout(() => {
                    message.remove();
                }, 300);
            }, 3000);
        });
    }

    // Function to create confetti
    function createConfetti(x, y) {
        const colors = ['#FF3CAC', '#784BA0', '#2B86C5', '#4433ff', '#ff3366'];
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            pointer-events: none;
            border-radius: 50%;
            z-index: 999;
        `;
        document.body.appendChild(confetti);

        // Random direction and speed
        const angle = Math.random() * Math.PI * 2;
        const velocity = 8 + Math.random() * 6;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        let posX = x;
        let posY = y;

        // Animate the confetti
        const animate = () => {
            posX += vx;
            posY += vy + 2; // Add gravity
            confetti.style.left = posX + 'px';
            confetti.style.top = posY + 'px';
            confetti.style.opacity = confetti.style.opacity || 1;
            confetti.style.opacity -= 0.02;
            confetti.style.transform = `rotate(${posY * 2}deg)`;

            if (confetti.style.opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };

        requestAnimationFrame(animate);
    }

    // Bid Modal Functionality
    const bidModal = document.getElementById('bidModal');
    const placeBidButton = document.querySelector('.bid-btn');  
    const closeModal = document.querySelector('.close-modal');
    const confirmBidButton = document.querySelector('.place-bid-confirm');

    placeBidButton.addEventListener('click', (e) => {
        e.preventDefault();
        bidModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeModal.addEventListener('click', () => {
        bidModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    bidModal.addEventListener('click', (e) => {
        if (e.target === bidModal) {
            bidModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    confirmBidButton.addEventListener('click', () => {
        const bidAmount = document.getElementById('bidAmount').value;
        if (bidAmount >= 4.89) {
            // Add success animation
            confirmBidButton.innerHTML = '<i class="fas fa-check"></i> Bid Placed!';
            confirmBidButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            setTimeout(() => {
                bidModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                // Reset button after modal closes
                setTimeout(() => {
                    confirmBidButton.innerHTML = 'Confirm Bid';
                    confirmBidButton.style.background = 'linear-gradient(135deg, #8A2BE2, #2954ff)';
                }, 300);
            }, 1500);
        } else {
            // Show error state
            const input = document.getElementById('bidAmount');
            input.style.borderColor = '#ff4444';
            input.style.animation = 'shake 0.5s';
            setTimeout(() => {
                input.style.animation = '';
            }, 500);
        }
    });

    // Add this CSS for the shake animation
    const style = document.createElement('style');
    style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }`;
    document.head.appendChild(style);
});
