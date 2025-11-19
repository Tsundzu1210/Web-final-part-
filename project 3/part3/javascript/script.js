
document.addEventListener('DOMContentLoaded', function() {

    // ==================== CART FUNCTIONALITY ====================
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: Number(this.dataset.price),
                quantity: 1
            };

            const existing = cart.find(item => item.id === product.id);
            if (existing) {
                existing.quantity++;
            } else {
                cart.push(product);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            showFeedback(`${product.name} added to cart!`, 'success');
        });
    });

  
    if (document.getElementById('cart-items')) {
        loadCart();
    }

    function loadCart() {
        const cartTable = document.getElementById('cart-items');
        const totalPrice = document.getElementById('total-price');
        
        if (!cartTable) return;

        cartTable.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>R${item.price}</td>
                <td>
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    ${item.quantity}
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </td>
                <td>R${itemTotal}</td>
                <td><button onclick="removeFromCart(${index})">Remove</button></td>
            `;
            cartTable.appendChild(row);
        });

        if (totalPrice) {
            totalPrice.textContent = `Total: R${total}`;
        }
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showFeedback('Your cart is empty!', 'error');
            } else {
                window.location.href = 'Checkout.html';
            }
        });
    }

    const contactForm = document.querySelector('form[action="/send-message"]');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const name = document.getElementById('name').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

  
            if (!email.includes('@')) {
                showFeedback('Please enter a valid email address', 'error');
                return;
            }
            if (name.length < 2) {
                showFeedback('Please enter your full name', 'error');
                return;
            }
            if (subject.length < 3) {
                showFeedback('Please enter a subject', 'error');
                return;
            }
            if (message.length < 10) {
                showFeedback('Please enter a message with at least 10 characters', 'error');
                return;
            }

            let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
            messages.push({
                email: email,
                name: name,
                subject: subject,
                message: message,
                date: new Date().toLocaleString()
            });
            localStorage.setItem('contactMessages', JSON.stringify(messages));

            showFeedback('Message sent successfully! We will get back to you soon.', 'success');
            contactForm.reset();
        });
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        // Load order summary
        loadOrderSummary();

        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            

            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const fname = document.getElementById('fname').value.trim();
            const address = document.getElementById('address').value.trim();

            if (!email.includes('@')) {
                showFeedback('Please enter a valid email', 'error');
                return;
            }
            if (phone.length < 10) {
                showFeedback('Please enter a valid phone number', 'error');
                return;
            }
            if (fname.length < 2) {
                showFeedback('Please enter your first name', 'error');
                return;
            }
            if (address.length < 5) {
                showFeedback('Please enter your complete address', 'error');
                return;
            }

            showFeedback('Order placed successfully! Thank you for your purchase.', 'success');
            
       
            localStorage.removeItem('cart');
            setTimeout(() => {
                window.location.href = 'Home.html';
            }, 2000);
        });
    }

    function loadOrderSummary() {
        const checkoutItems = document.getElementById('checkout-items');
        const subtotalElem = document.getElementById('subtotal');
        const vatElem = document.getElementById('vat');
        const grandTotalElem = document.getElementById('grand-total');

        if (!checkoutItems) return;

        checkoutItems.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td align="right">${item.quantity}</td>
                <td align="right">R${item.price}</td>
                <td align="right">R${itemTotal}</td>
            `;
            checkoutItems.appendChild(row);
        });

        const vat = subtotal * 0.15;
        const grandTotal = subtotal + vat;

        if (subtotalElem) subtotalElem.textContent = `R${subtotal}`;
        if (vatElem) vatElem.textContent = `R${vat.toFixed(2)}`;
        if (grandTotalElem) grandTotalElem.textContent = `R${grandTotal.toFixed(2)}`;
    }

    const storeForm = document.getElementById('store-form');
    if (storeForm) {
        storeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const province = document.getElementById('province').value;
            const results = document.getElementById('store-results');

            if (!province) {
                showFeedback('Please select a province', 'error');
                return;
            }

            const stores = {
                'Gauteng': 'Johannesburg: 3900 Mountain Zebra Street, Boksburg - Phone: +27 163 671 949',
                'Western Cape': 'Cape Town: 45 Innovation Road, City Bowl - Phone: +27 284 129 568',
                'KwaZulu-Natal': 'Durban: 78 Coastal Avenue, Umhlanga - Phone: +27 375 789 034',
                'Limpopo': 'Polokwane: 56 Market Road, Tzaneen - Phone: +27 159 824 106',
                'Mpumalanga': 'Mbombela: 34 Riverside Mall - Phone: +27 137 098 271',
                'North West': 'Rustenburg: 67 Platinum Plaza - Phone: +27 147 301 689',
                'Northern Cape': 'Kimberley: 21 Diamond Street - Phone: +27 530 280 451'
            };

            if (results) {
                results.innerHTML = `
                    <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 10px 0;">
                        <h3>Store in ${province}</h3>
                        <p>${stores[province]}</p>
                    </div>
                `;
            }
        });
    }

 
    const joinBtn = document.querySelector('#loyalty button');
    if (joinBtn) {
        joinBtn.addEventListener('click', function() {
            if (localStorage.getItem('loyaltyMember')) {
                showFeedback('You are already a loyalty member!', 'info');
            } else {
                localStorage.setItem('loyaltyMember', 'true');
                showFeedback('Welcome to the Smart Tee Loyalty Program!', 'success');
                this.textContent = 'Member Joined ✓';
                this.disabled = true;
            }
        });
    }


    function showFeedback(message, type) {
      
        const existingFeedback = document.querySelector('.feedback-message');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        const feedback = document.createElement('div');
        feedback.className = `feedback-message feedback-${type}`;
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;

    
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#ff9800'
        };
        feedback.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(feedback);

       
        setTimeout(() => {
            feedback.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => feedback.remove(), 300);
        }, 4000);
    }

  
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

});


function changeQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    cart[index].quantity += change;
    
    if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
   
    const cartTable = document.getElementById('cart-items');
    if (cartTable) {
        location.reload(); 
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemName = cart[index].name;
    
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    
   
    const feedback = document.createElement('div');
    feedback.textContent = `${itemName} removed from cart`;
    feedback.style.cssText = 'background: #f44336; color: white; padding: 10px; margin: 10px 0; border-radius: 5px;';
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
        location.reload();
    }, 1000);
}


if (!localStorage.getItem('firstVisit')) {
    setTimeout(() => {
        alert('Welcome to Smart Tee Devices! 🎉 Enjoy your shopping experience.');
        localStorage.setItem('firstVisit', 'true');
    }, 1000);
}
    // ---------------------------------------------------------
    //  READ MORE / SHOW LESS (for content blocks with .content)
    // ---------------------------------------------------------
    document.querySelectorAll(".content").forEach(section => {
        const paragraph = section.querySelector("p");
        const btn = section.querySelector("a");

        if (!paragraph || !btn) return;

        if (paragraph.innerText.length > 120) {
            const fullText = paragraph.innerText;
            const shortText = fullText.substring(0, 120) + "...";

            paragraph.innerText = shortText;

            btn.addEventListener("click", (e) => {
                e.preventDefault();

                if (paragraph.innerText === shortText) {
                    paragraph.innerText = fullText;
                    btn.innerText = "Show less";
                } else {
                    paragraph.innerText = shortText;
                    btn.innerText = "Read more";
                }
            });
        }
    });
  