// main.js - Travel Agency Frontend Connected to Backend

const API = "https://travelagencywebsite-production.up.railway.app/api";

// -------------------------
// Load packages dynamically when on packages.html
// -------------------------
document.addEventListener("DOMContentLoaded", async () => {
    const packageContainer = document.querySelector(".packages-grid");

    if (packageContainer) {
        try {
            const res = await fetch(`${API}/packages`);
            const data = await res.json();

            if (data && data.length > 0) {
                packageContainer.innerHTML = data.map(pkg => `
                    <div class="package-card">
                        <img src="${pkg.image || 'https://via.placeholder.com/300x200'}" alt="${pkg.name}">
                        <div class="package-info">
                            <h3>${pkg.name}</h3>
                            <p>${pkg.description}</p>
                            <div class="price">₹${pkg.price}</div>
                            <button class="btn btn-secondary" onclick="deletePackage('${pkg._id}')">Delete</button>
                        </div>
                    </div>
                `).join('');
            } else {
                packageContainer.innerHTML = "<p>No packages found.</p>";
            }
        } catch (err) {
            console.error("Error fetching packages:", err);
            packageContainer.innerHTML = "<p>Error loading packages.</p>";
        }
    }
});

// -------------------------
// CRUD — Delete Package
// -------------------------
async function deletePackage(id) {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
        const res = await fetch(`${API}/packages/${id}`, { method: "DELETE" });
        if (res.ok) {
            alert("Package deleted successfully!");
            location.reload();
        } else {
            alert("Failed to delete package");
        }
    } catch (err) {
        console.error("Error deleting package:", err);
    }
}

// -------------------------
// Registration & Login
// -------------------------
function $(id){ return document.getElementById(id); }
function validEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }
function validPhone(p){ return /^\d{10}$/.test(p) }
function validName(n){ return /^[A-Za-z\s]+$/.test(n) }

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = $('registerForm');
    const loginForm = $('loginForm');

    // -------------------------
    // Register
    // -------------------------
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = $('regName').value.trim();
            const email = $('regEmail').value.trim();
            const phone = $('regPhone').value.trim();
            const password = $('regPassword').value;

            if (!validName(name) || !validEmail(email) || !validPhone(phone) || password.length < 6) {
                alert("Please fill valid details. Name letters only, 10-digit phone, 6+ char password");
                return;
            }

            try {
                const res = await fetch(`${API}/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, password })
                });
                const json = await res.json();
                if (res.ok) {
                    alert(json.message || "Registered successfully");
                    registerForm.reset();
                    // Optional: redirect to login
                    location.href = "login.html";
                } else {
                    alert(json.error || "Registration failed");
                }
            } catch (err) {
                console.error(err);
                alert("Server error during registration");
            }
        });
    }

    // -------------------------
    // Login
    // -------------------------
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = $('loginEmail').value.trim();
            const password = $('loginPassword').value;

            if (!validEmail(email) || !password) {
                alert("Enter valid email & password");
                return;
            }

            try {
                const res = await fetch(`${API}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const json = await res.json();
                if (res.ok) {
                    alert(json.message || "Login successful");
                    // store user info
                    localStorage.setItem('vibe_user', JSON.stringify(json.user));
                    // redirect to book-trip page
                    location.href = "book-trip.html";
                } else {
                    alert(json.error || "Login failed");
                }
            } catch (err) {
                console.error(err);
                alert("Server error during login");
            }
        });
    }

    // -------------------------
    // Show logged-in user on book-trip page
    // -------------------------
    const welcomeEl = $('welcomeUser');
    if (welcomeEl) {
        const user = JSON.parse(localStorage.getItem('vibe_user') || 'null');
        if (user) {
            welcomeEl.textContent = `Welcome, ${user.name}! Book your trip now 🧳`;
        } else {
            window.location.href = "login.html"; // redirect if not logged in
        }
    }

    // -------------------------
    // Booking Form
    // -------------------------
    const bookingForm = $('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const user = JSON.parse(localStorage.getItem('vibe_user') || 'null');
            if (!user) { alert("Please login first"); return; }

            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData.entries());
            data.name = user.name;       // attach logged-in name
            data.email = user.email;     // attach logged-in email
            data.people = Number(data.people) || 1;

            // phone validation
            if (!validPhone(data.phone.replace(/\D/g, ''))) { alert("Enter valid 10-digit phone"); return; }

            try {
                const res = await fetch(`${API}/bookings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const json = await res.json();
                if (res.ok) {
                    alert("Booking submitted successfully!");
                    bookingForm.reset();
                } else {
                    alert(json.error || "Booking failed");
                }
            } catch (err) {
                console.error(err);
                alert("Server error while booking");
            }
        });
    }
});

// Header profile handling (for index and other pages)
(() => {
    try {
        const user = JSON.parse(localStorage.getItem('vibe_user') || 'null');
        const siteProfile = document.getElementById('siteProfile');
        const hdrUserName = document.getElementById('hdrUserName');
        const hdrProfileBtn = document.getElementById('hdrProfileBtn');

        if (user && siteProfile && hdrUserName) {
            hdrUserName.textContent = user.name.split(' ')[0];
            siteProfile.style.display = 'flex';
            // hide sign in/up links if present
            document.querySelectorAll('a[href="login.html"], a[href="register.html"]').forEach(a => a.style.display = 'none');

            // simple dropdown
            hdrProfileBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                let menu = document.getElementById('hdrProfileMenu');
                if (!menu) {
                    menu = document.createElement('div');
                    menu.id = 'hdrProfileMenu';
                    menu.style.position = 'absolute';
                    menu.style.right = '10px';
                    menu.style.top = '56px';
                    menu.style.width = '200px';
                    menu.style.background = '#fff';
                    menu.style.border = '1px solid #eee';
                    menu.style.borderRadius = '10px';
                    menu.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
                    menu.style.padding = '12px';
                    menu.innerHTML = `
                        <div style="font-weight:600;margin-bottom:6px">${user.name}</div>
                        <div style="font-size:13px;color:#666;margin-bottom:10px">${user.email}</div>
                        <button id="hdrLogout" style="width:100%;padding:8px;border-radius:8px;background:var(--accent);color:#fff;border:none;cursor:pointer">Logout</button>
                    `;
                    document.body.appendChild(menu);
                    document.getElementById('hdrLogout').addEventListener('click', () => {
                        localStorage.removeItem('vibe_user');
                        window.location.href = 'index.html';
                    });
                } else {
                    menu.classList.toggle('hidden');
                    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
                }
            });
            document.addEventListener('click', () => { const m = document.getElementById('hdrProfileMenu'); if (m) m.style.display = 'none'; });
        }
    } catch (e) {
        // ignore
    }
})();
// Populate package dropdown dynamically
const packageSelect = document.getElementById('qpackage');
if (packageSelect) {
  fetch(`${API}/packages`)
    .then(res => res.json())
    .then(packages => {
      packages.forEach(pkg => {
        const option = document.createElement('option');
        option.value = pkg.name; // or pkg._id if you prefer
        option.textContent = `${pkg.name} — ₹${pkg.price}`;
        packageSelect.appendChild(option);
      });
    })
    .catch(err => console.error("Failed to load packages:", err));
}
