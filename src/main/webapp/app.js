// Interactive Dynamic Menu Data Array with custom generated assets
const menuData = [
    {
        id: "chai-bun-maska",
        name: "Special Masala Chai & Bun Maska",
        category: "veg",
        desc: "Aromatic steaming hot ginger masala chai paired with soft bun maska layered with melting butter.",
        price: "₹80.00",
        image: "assets/chai_bun_maska.png"
    },
    {
        id: "veg-maggie",
        name: "Homely Veg Maggie",
        category: "veg",
        desc: "Our signature instant masala noodles, pan-fried with fresh carrots, sweetcorn, and green peas.",
        price: "₹90.00",
        image: "assets/veg_maggie.png"
    },
    {
        id: "aloo-paratha",
        name: "Aloo Paratha with Curd",
        category: "veg",
        desc: "Crispy whole wheat flatbread stuffed with spiced mashed potatoes, served hot with rich butter and fresh dahi.",
        price: "₹120.00",
        image: "assets/paratha_curd.png"
    },
    {
        id: "paneer-paratha",
        name: "Paneer Paratha with Curd",
        category: "veg",
        desc: "Crispy hot flatbread stuffed with spiced grated paneer (cottage cheese), served with soft white butter and fresh dahi.",
        price: "₹140.00",
        image: "assets/paratha_curd.png"
    }
];

// Active filter state tracking
let currentCategory = 'all';
let searchQuery = '';

// DOM Elements
const menuContainer = document.getElementById('menu-items');
const searchInput = document.getElementById('menu-search');
const orderForm = document.getElementById('order-form');
const foodSelect = document.getElementById('foodItem');
const modalOverlay = document.getElementById('success-modal-overlay');

// Render Menu Cards dynamically
function renderMenu(items) {
    if (!menuContainer) return;
    menuContainer.innerHTML = '';
    
    if (items.length === 0) {
        menuContainer.innerHTML = `
            <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-muted);">
                <p style="font-size: 1.2rem; font-family: var(--font-heading);">No cafe items found matching your search.</p>
            </div>
        `;
        return;
    }

    items.forEach(item => {
        const isVeg = item.category === 'veg';
        const cardHTML = `
            <div class="menu-card" id="card-${item.id}">
                <div class="menu-img-container">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <span class="menu-badge ${item.category}">${isVeg ? 'Vegetarian' : 'Non-Veg'}</span>
                </div>
                <div class="menu-info">
                    <h3>${item.name}</h3>
                    <p>${item.desc}</p>
                    <div class="menu-meta">
                        <span class="price">${item.price}</span>
                        <button class="add-btn" onclick="addToOrder('${item.name}')">Add to Order</button>
                    </div>
                </div>
            </div>
        `;
        menuContainer.innerHTML += cardHTML;
    });
}

// Filter Menu Items
function filterMenu(category) {
    currentCategory = category;
    
    // Update active state of buttons
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (
            (category === 'all' && btn.id === 'filter-btn-all') ||
            (category === 'veg' && btn.id === 'filter-btn-veg') ||
            (category === 'non-veg' && btn.id === 'filter-btn-non-veg')
        ) {
            btn.classList.add('active');
        }
    });

    applyFilters();
}

// Search Menu Items
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        applyFilters();
    });
}

// Apply Search and Category Filters simultaneously
function applyFilters() {
    let filtered = menuData;
    
    // Apply Category Filter
    if (currentCategory !== 'all') {
        filtered = filtered.filter(item => item.category === currentCategory);
    }
    
    // Apply Search Filter
    if (searchQuery) {
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(searchQuery) || 
            item.desc.toLowerCase().includes(searchQuery)
        );
    }
    
    renderMenu(filtered);
}

// Interactivity linking "Add to Order" to the booking form
function addToOrder(itemName) {
    if (!foodSelect) return;
    
    // Find matching option in the select field
    for (let i = 0; i < foodSelect.options.length; i++) {
        if (foodSelect.options[i].value === itemName) {
            foodSelect.selectedIndex = i;
            break;
        }
    }
    
    // Smooth scroll to the order section
    const orderSection = document.getElementById('order');
    if (orderSection) {
        orderSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Visual Highlight feedback on the selection box
    foodSelect.classList.add('highlight-flash');
    setTimeout(() => {
        foodSelect.classList.remove('highlight-flash');
    }, 1000);
}

// Sticky Header Navigation scroll highlights
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    const header = document.getElementById('main-header');
    
    if (header) {
        if (window.scrollY > 50) {
            header.style.padding = '0.8rem 8%';
            header.style.backgroundColor = 'rgba(250, 246, 240, 0.98)';
        } else {
            header.style.padding = '1.2rem 8%';
            header.style.backgroundColor = 'rgba(250, 246, 240, 0.9)';
        }
    }

    let currentSectionId = 'home';
    sections.forEach(sec => {
        const top = window.scrollY;
        const offset = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        
        if (top >= offset && top < offset + height) {
            currentSectionId = id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '#' && currentSectionId === 'home') {
            link.classList.add('active');
        } else if (href === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
});

// Hybrid Local Simulation of Java backend OrderServlet
if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        // Check if running as standard local file or separate static host (no Java container)
        const isLocalStatic = window.location.protocol === 'file:' || !window.location.host.includes('8080');
        
        if (isLocalStatic) {
            e.preventDefault(); // Intercept form submission
            
            // Perform basic validation checks
            const guestName = document.getElementById('customerName').value.trim();
            const guestPhone = document.getElementById('phoneNumber').value.trim();
            const guestDish = document.getElementById('foodItem').value;
            
            if (!guestName || !guestPhone) {
                alert("Please fill in all requested fields to submit your order.");
                return;
            }
            
            // Populating simulation modal elements
            document.getElementById('summary-name').textContent = guestName;
            document.getElementById('summary-phone').textContent = guestPhone;
            document.getElementById('summary-dish').textContent = guestDish;
            
            // Activate success modal overlay
            if (modalOverlay) {
                modalOverlay.classList.add('active');
            }
        }
    });
}

// Close Simulation Modal function
function closeSuccessModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
    if (orderForm) {
        orderForm.reset();
    }
}

// Initial Load Setup
window.onload = () => {
    renderMenu(menuData);
    
    // Inject keyframes animation styling for selection highlights dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes selectFlash {
            0% { border-color: rgba(217, 119, 54, 0.15); box-shadow: none; }
            55% { border-color: var(--primary); box-shadow: 0 0 15px rgba(217, 119, 54, 0.6); background-color: rgba(217, 119, 54, 0.1); }
            100% { border-color: rgba(255, 255, 255, 0.15); box-shadow: none; }
        }
        .highlight-flash {
            animation: selectFlash 1s ease-in-out;
        }
    `;
    document.head.appendChild(style);
};
