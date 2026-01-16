// admin.js

// DOM Elements
const loginForm = document.getElementById('loginForm');
const loginSection = document.getElementById('loginSection');
const adminSection = document.getElementById('adminSection');
const propertyForm = document.getElementById('propertyForm');
const propertiesTable = document.getElementById('propertiesTable').querySelector('tbody');
const logoutBtn = document.getElementById('logoutBtn');

// Simple admin login (replace with real auth in production)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123";

// Local storage key
const AUTH_KEY = "adminLoggedIn";

// Check login on page load
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem(AUTH_KEY) === "true") {
        loginSection.style.display = "none";
        adminSection.style.display = "block";
        fetchProperties();
    }
});

// Login form submit
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem(AUTH_KEY, "true");
        loginSection.style.display = "none";
        adminSection.style.display = "block";
        fetchProperties();
    } else {
        alert("Invalid username or password!");
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(AUTH_KEY);
    loginSection.style.display = "block";
    adminSection.style.display = "none";
});

// Fetch all properties
async function fetchProperties() {
    propertiesTable.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";

    try {
        const res = await fetch('/api/properties');
        const data = await res.json();

        if (data.length === 0) {
            propertiesTable.innerHTML = "<tr><td colspan='6'>No properties yet</td></tr>";
            return;
        }

        propertiesTable.innerHTML = "";
        data.forEach(property => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${property.title}</td>
                <td>${property.location}</td>
                <td>${property.type}</td>
                <td>KES ${property.price.toLocaleString()}</td>
                <td>${property.status}</td>
                <td>
                    <button class="btn btn-outline edit-btn" data-id="${property._id}">Edit</button>
                    <button class="btn btn-danger delete-btn" data-id="${property._id}">Delete</button>
                </td>
            `;
            propertiesTable.appendChild(tr);
        });

        // Add event listeners for edit/delete
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editProperty(btn.dataset.id));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteProperty(btn.dataset.id));
        });

    } catch (error) {
        console.error(error);
        propertiesTable.innerHTML = "<tr><td colspan='6'>Error loading properties</td></tr>";
    }
}

// Add/Edit Property
propertyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const id = document.getElementById('propertyId').value;

    formData.append('title', document.getElementById('title').value);
    formData.append('location', document.getElementById('location').value);
    formData.append('type', document.getElementById('type').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('bedrooms', document.getElementById('bedrooms').value);
    formData.append('bathrooms', document.getElementById('bathrooms').value);
    formData.append('parking', document.getElementById('parking').value);
    formData.append('size', document.getElementById('size').value);
    formData.append('status', document.getElementById('status').value);
    formData.append('description', document.getElementById('description').value);

    const images = document.getElementById('images').files;
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }

    try {
        let res;
        if (id) {
            // Edit property
            res = await fetch(`/api/properties/${id}`, {
                method: 'PUT',
                body: formData
            });
        } else {
            // Add property
            res = await fetch('/api/properties', {
                method: 'POST',
                body: formData
            });
        }

        const data = await res.json();
        alert(data.message);
        propertyForm.reset();
        document.getElementById('propertyId').value = "";
        fetchProperties();

    } catch (error) {
        console.error(error);
        alert("Error saving property");
    }
});

// Edit property - populate form
async function editProperty(id) {
    try {
        const res = await fetch(`/api/properties/${id}`);
        const property = await res.json();

        document.getElementById('propertyId').value = property._id;
        document.getElementById('title').value = property.title;
        document.getElementById('location').value = property.location;
        document.getElementById('type').value = property.type;
        document.getElementById('price').value = property.price;
        document.getElementById('bedrooms').value = property.bedrooms;
        document.getElementById('bathrooms').value = property.bathrooms;
        document.getElementById('parking').value = property.parking;
        document.getElementById('size').value = property.size;
        document.getElementById('status').value = property.status;
        document.getElementById('description').value = property.description;

        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error(error);
        alert("Error fetching property data");
    }
}

// Delete property
async function deleteProperty(id) {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
        const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
        const data = await res.json();
        alert(data.message);
        fetchProperties();
    } catch (error) {
        console.error(error);
        alert("Error deleting property");
    }
}
