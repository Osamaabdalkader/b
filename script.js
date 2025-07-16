// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAzYZMxqNmnLMGYnCyiJYPg2MbxZMt0co0",
    authDomain: "osama-91b95.firebaseapp.com",
    databaseURL: "https://osama-91b95-default-rtdb.firebaseio.com",
    projectId: "osama-91b95",
    storageBucket: "osama-91b95.appspot.com",
    messagingSenderId: "118875905722",
    appId: "1:118875905722:web:200bff1bd99db2c1caac83",
    measurementId: "G-LEM5PVPJZC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics;
const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

// عناصر DOM
const homePage = document.getElementById('home-page');
const authPage = document.getElementById('auth-page');
const addPostPage = document.getElementById('add-post-page');
const profilePage = document.getElementById('profile-page');
const postDetailsPage = document.getElementById('post-details-page');
const paymentPage = document.getElementById('payment-page');
const adminDashboard = document.getElementById('admin-dashboard');
const loadingOverlay = document.getElementById('loading-overlay');
const uploadProgress = document.getElementById('upload-progress');

const authMessage = document.getElementById('auth-message');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const publishBtn = document.getElementById('publish-btn');

const postsContainer = document.getElementById('posts-container');
const userInfo = document.getElementById('user-info');

const profileIcon = document.getElementById('profile-icon');
const addPostIcon = document.getElementById('add-post-icon');
const homeIcon = document.getElementById('home-icon');
const closeAuthBtn = document.getElementById('close-auth');
const closeAddPostBtn = document.getElementById('close-add-post');
const closeProfileBtn = document.getElementById('close-profile');
const closePostDetailsBtn = document.getElementById('close-post-details');
const closePaymentBtn = document.getElementById('close-payment');
const closeAdminBtn = document.getElementById('close-admin');

// عناصر رفع الصورة
const postImageInput = document.getElementById('post-image');
const chooseImageBtn = document.getElementById('choose-image-btn');
const cameraBtn = document.getElementById('camera-btn');
const imageName = document.getElementById('image-name');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');
const removeImageBtn = document.getElementById('remove-image-btn');

// عناصر صفحة التفاصيل
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.getElementById('detail-description');
const detailPrice = document.getElementById('detail-price');
const detailLocation = document.getElementById('detail-location');
const detailAuthor = document.getElementById('detail-author');
const detailPhone = document.getElementById('detail-phone');
const detailAccount = document.getElementById('detail-account');
const detailImg = document.getElementById('detail-img');
const buyNowBtn = document.getElementById('buy-now-btn');

// عناصر صفحة الدفع
const paymentProductImg = document.getElementById('payment-product-img');
const paymentProductTitle = document.getElementById('payment-product-title');
const paymentProductPrice = document.getElementById('payment-product-price');
const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
const sellerAccountInput = document.getElementById('seller-account');

// عناصر لوحة التحكم
const adminTabs = document.querySelectorAll('.admin-tabs .tab-btn');
const adminOrdersSection = document.getElementById('admin-orders');
const adminNotificationsSection = document.getElementById('admin-notifications');
const adminTransfersSection = document.getElementById('admin-transfers');
const ordersFilter = document.getElementById('orders-filter');
const ordersList = document.getElementById('orders-list');
const notificationsList = document.getElementById('notifications-list');
const clearNotificationsBtn = document.getElementById('clear-notifications');
const recordTransferBtn = document.getElementById('record-transfer-btn');
const transfersList = document.getElementById('transfers-list');

// متغيرات عامة
let currentProduct = null;

// تحميل المنشورات عند بدء التحميل
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});

// استمع لتغير حالة المستخدم
auth.onAuthStateChanged(user => {
    if (user && user.email === 'admin@tasre.com') {
        // إذا كان المسؤول
        document.getElementById('profile-icon').addEventListener('click', () => {
            showPage(adminDashboard);
            loadAdminDashboard();
        });
    }
});

// تحميل المنشورات للجميع
function loadPosts() {
    const postsRef = database.ref('posts');
    postsRef.on('value', (snapshot) => {
        postsContainer.innerHTML = '';
        
        if (snapshot.exists()) {
            const posts = snapshot.val();
            Object.keys(posts).reverse().forEach(postId => {
                const post = posts[postId];
                createPostCard(post, postId);
            });
        } else {
            postsContainer.innerHTML = '<p class="no-posts">لا توجد منشورات بعد. كن أول من ينشر!</p>';
        }
    });
}

// إنشاء بطاقة منشور
function createPostCard(post, postId) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.dataset.id = postId;
    
    // إذا كان هناك صورة، نعرضها. وإلا نعرض أيقونة افتراضية.
    const imageContent = post.imageUrl 
        ? `<div class="post-image"><img src="${post.imageUrl}" alt="${post.title}"></div>`
        : `<div class="post-image"><i class="fas fa-image fa-3x"></i></div>`;
    
    postCard.innerHTML = `
        ${imageContent}
        <div class="post-content">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-description">${post.description}</p>
            <div class="post-meta">
                ${post.price ? `<div class="post-price">${post.price}</div>` : ''}
                <div class="post-location"><i class="fas fa-map-marker-alt"></i> ${post.location}</div>
            </div>
            <div class="post-author">
                <i class="fas fa-user"></i> ${post.authorName}
            </div>
        </div>
    `;
    
    // إضافة حدث النقر لفتح صفحة التفاصيل
    postCard.addEventListener('click', () => {
        showPostDetails(post);
    });
    
    postsContainer.appendChild(postCard);
}

// عرض تفاصيل المنشور
function showPostDetails(post) {
    detailTitle.textContent = post.title;
    detailDescription.textContent = post.description;
    detailLocation.textContent = post.location;
    detailAuthor.textContent = post.authorName;
    detailPhone.textContent = post.phone;
    detailAccount.textContent = post.sellerAccount || 'غير متوفر';
    
    // عرض السعر إذا كان موجوداً
    if (post.price) {
        detailPrice.textContent = post.price;
        detailPrice.style.display = 'block';
    } else {
        detailPrice.style.display = 'none';
    }
    
    // عرض الصورة إذا كانت موجودة
    if (post.imageUrl) {
        detailImg.src = post.imageUrl;
        detailImg.style.display = 'block';
    } else {
        detailImg.style.display = 'none';
    }
    
    // حفظ المنتج الحالي
    currentProduct = {
        ...post,
        id: post.id || Object.keys(posts)[0] // احتياطي لمعرف المنتج
    };
    
    showPage(postDetailsPage);
}

// تسجيل الدخول
loginBtn.addEventListener('click', e => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showAuthMessage('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            showAuthMessage('تم تسجيل الدخول بنجاح!', 'success');
            setTimeout(() => {
                showPage(homePage);
                resetAuthForms();
            }, 1500);
        })
        .catch(error => {
            showAuthMessage(getAuthErrorMessage(error.code), 'error');
        });
});

// إنشاء حساب
signupBtn.addEventListener('click', e => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const phone = document.getElementById('signup-phone').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const address = document.getElementById('signup-address').value;
    const account = document.getElementById('signup-account').value;
    
    if (!name || !phone || !email || !password || !address || !account) {
        showAuthMessage('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            
            // حفظ معلومات المستخدم الإضافية
            return database.ref('users/' + user.uid).set({
                name: name,
                phone: phone,
                email: email,
                address: address,
                account: account
            });
        })
        .then(() => {
            showAuthMessage('تم إنشاء الحساب بنجاح!', 'success');
            setTimeout(() => {
                showPage(homePage);
                resetAuthForms();
            }, 1500);
        })
        .catch(error => {
            showAuthMessage(getAuthErrorMessage(error.code), 'error');
        });
});

// تسجيل الخروج
logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        showPage(homePage);
    });
});

// نشر منشور جديد
publishBtn.addEventListener('click', async e => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) {
        showPage(authPage);
        return;
    }
    
    const title = document.getElementById('post-title').value;
    const description = document.getElementById('post-description').value;
    const price = document.getElementById('post-price').value;
    const location = document.getElementById('post-location').value;
    const phone = document.getElementById('post-phone').value;
    const imageFile = postImageInput.files[0];
    
    if (!title || !description || !location || !phone) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    try {
        // إظهار شاشة التحميل
        loadingOverlay.classList.remove('hidden');
        uploadProgress.style.width = '0%';
        
        let imageUrl = null;
        if (imageFile) {
            // استخدام uploadBytesResumable لتتبع التقدم
            const fileRef = storage.ref('post_images/' + Date.now() + '_' + imageFile.name);
            const uploadTask = fileRef.put(imageFile);
            
            // انتظار اكتمال الرفع مع تحديث شريط التقدم
            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // تحديث شريط التقدم
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        uploadProgress.style.width = progress + '%';
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        // الرفع اكتمل بنجاح
                        resolve();
                    }
                );
            });
            
            // الحصول على رابط التحميل بعد اكتمال الرفع
            imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
        }
        
        // الحصول على بيانات المستخدم
        const userRef = database.ref('users/' + user.uid);
        const userSnapshot = await userRef.once('value');
        
        if (!userSnapshot.exists()) {
            throw new Error('بيانات المستخدم غير موجودة');
        }
        
        const userData = userSnapshot.val();
        
        // إنشاء كائن المنشور
        const postData = {
            title: title,
            description: description,
            price: price || '',
            location: location,
            phone: phone,
            authorId: user.uid,
            authorName: userData.name,
            authorPhone: userData.phone,
            sellerAccount: userData.account,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            imageUrl: imageUrl || ''
        };
        
        // حفظ المنشور في قاعدة البيانات
        await database.ref('posts').push(postData);
        
        // إخفاء شاشة التحميل وإظهار الرسالة
        loadingOverlay.classList.add('hidden');
        alert('تم نشر المنشور بنجاح!');
        resetAddPostForm();
        showPage(homePage);
    } 
    catch (error) {
        console.error('Error adding post: ', error);
        loadingOverlay.classList.add('hidden');
        alert('حدث خطأ أثناء نشر المنشور: ' + error.message);
    }
});

// عرض معلومات المستخدم
profileIcon.addEventListener('click', () => {
    const user = auth.currentUser;
    
    if (user) {
        // عرض صفحة حساب المستخدم
        const userRef = database.ref('users/' + user.uid);
        userRef.once('value', (snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                userInfo.innerHTML = `
                    <div class="user-detail">
                        <i class="fas fa-user"></i>
                        <span>${userData.name}</span>
                    </div>
                    <div class="user-detail">
                        <i class="fas fa-envelope"></i>
                        <span>${userData.email}</span>
                    </div>
                    <div class="user-detail">
                        <i class="fas fa-phone"></i>
                        <span>${userData.phone}</span>
                    </div>
                    <div class="user-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${userData.address}</span>
                    </div>
                    <div class="user-detail">
                        <i class="fas fa-wallet"></i>
                        <span>${userData.account}</span>
                    </div>
                `;
            } else {
                userInfo.innerHTML = '<p>لا توجد بيانات للمستخدم</p>';
            }
            showPage(profilePage);
        });
    } else {
        // عرض صفحة التوثيق
        showPage(authPage);
    }
});

// إضافة منشور جديد
addPostIcon.addEventListener('click', () => {
    const user = auth.currentUser;
    
    if (user) {
        resetAddPostForm();
        showPage(addPostPage);
    } else {
        showPage(authPage);
    }
});

// العودة للصفحة الرئيسية
homeIcon.addEventListener('click', () => {
    showPage(homePage);
});

// إغلاق صفحة التوثيق
closeAuthBtn.addEventListener('click', () => {
    showPage(homePage);
});

// إغلاق صفحة إضافة المنشور
closeAddPostBtn.addEventListener('click', () => {
    showPage(homePage);
});

// إغلاق صفحة الملف الشخصي
closeProfileBtn.addEventListener('click', () => {
    showPage(homePage);
});

// إغلاق صفحة التفاصيل
closePostDetailsBtn.addEventListener('click', () => {
    showPage(homePage);
});

// إغلاق صفحة الدفع
closePaymentBtn.addEventListener('click', () => {
    showPage(postDetailsPage);
});

// إغلاق لوحة التحكم
closeAdminBtn.addEventListener('click', () => {
    showPage(homePage);
});

// زر الشراء الآن
buyNowBtn.addEventListener('click', () => {
    // تعبئة بيانات المنتج في صفحة الدفع
    paymentProductTitle.textContent = currentProduct.title;
    paymentProductPrice.textContent = currentProduct.price || 'السعر غير محدد';
    sellerAccountInput.value = currentProduct.sellerAccount || 'غير متوفر';
    
    if (currentProduct.imageUrl) {
        paymentProductImg.src = currentProduct.imageUrl;
        paymentProductImg.style.display = 'block';
    } else {
        paymentProductImg.style.display = 'none';
    }
    
    showPage(paymentPage);
});

// تأكيد عملية الشراء
confirmPaymentBtn.addEventListener('click', async () => {
    const buyerName = document.getElementById('buyer-name').value;
    const buyerPhone = document.getElementById('buyer-phone').value;
    const senderName = document.getElementById('sender-name').value;
    const transactionId = document.getElementById('transaction-id').value;
    const buyerAddress = document.getElementById('buyer-address').value;
    const agreeTerms = document.getElementById('agree-terms').checked;
    
    if (!buyerName || !buyerPhone || !senderName || !transactionId || !buyerAddress) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    if (!agreeTerms) {
        alert('يرجى الموافقة على شروط الاستخدام');
        return;
    }
    
    // إنشاء كائن الطلب
    const orderData = {
        productId: currentProduct.id,
        productTitle: currentProduct.title,
        productPrice: currentProduct.price,
        buyerName: buyerName,
        buyerPhone: buyerPhone,
        buyerAddress: buyerAddress,
        senderName: senderName,
        transactionId: transactionId,
        sellerAccount: currentProduct.sellerAccount,
        sellerId: currentProduct.authorId,
        sellerName: currentProduct.authorName,
        status: "قيد المراجعة",
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    
    try {
        // حفظ الطلب في قاعدة البيانات
        await database.ref('orders').push(orderData);
        
        // إرسال إشعار للإدارة
        sendAdminNotification(orderData);
        
        // رسالة نجاح للمشتري
        alert('تم استلام طلبك بنجاح! سيتواصل معك فريقنا خلال 24 ساعة لتأكيد العملية.');
        
        // إعادة تعيين النموذج
        resetPaymentForm();
        
        showPage(homePage);
    } catch (error) {
        console.error('Error saving order:', error);
        alert('حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى.');
    }
});

// إرسال إشعار للإدارة
function sendAdminNotification(order) {
    const notification = {
        type: 'new_order',
        message: `طلب جديد: ${order.productTitle} من ${order.buyerName}`,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        read: false
    };
    
    database.ref('admin_notifications').push(notification);
}

// إعادة تعيين نموذج الدفع
function resetPaymentForm() {
    document.getElementById('buyer-name').value = '';
    document.getElementById('buyer-phone').value = '';
    document.getElementById('sender-name').value = '';
    document.getElementById('transaction-id').value = '';
    document.getElementById('buyer-address').value = '';
    document.getElementById('agree-terms').checked = false;
}

// تغيير علامات التوثيق
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (btn.dataset.tab === 'login') {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        }
    });
});

// اختيار صورة من المعرض
chooseImageBtn.addEventListener('click', () => {
    postImageInput.click();
});

// فتح الكاميرا (إذا كان الجهاز يدعمها)
cameraBtn.addEventListener('click', () => {
    postImageInput.setAttribute('capture', 'environment');
    postImageInput.click();
});

// عرض معاينة الصورة
postImageInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const file = this.files[0];
        imageName.textContent = file.name;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            imagePreview.classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }
});

// إزالة الصورة المختارة
removeImageBtn.addEventListener('click', () => {
    postImageInput.value = '';
    imageName.textContent = 'لم يتم اختيار صورة';
    imagePreview.classList.add('hidden');
});

// وظائف مساعدة
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    page.classList.remove('hidden');
}

function showAuthMessage(message, type) {
    authMessage.textContent = message;
    authMessage.className = '';
    authMessage.classList.add(type + '-message');
}

function getAuthErrorMessage(code) {
    switch(code) {
        case 'auth/invalid-email':
            return 'البريد الإلكتروني غير صالح';
        case 'auth/user-disabled':
            return 'هذا الحساب معطل';
        case 'auth/user-not-found':
            return 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني';
        case 'auth/wrong-password':
            return 'كلمة المرور غير صحيحة';
        case 'auth/email-already-in-use':
            return 'هذا البريد الإلكتروني مستخدم بالفعل';
        case 'auth/weak-password':
            return 'كلمة المرور ضعيفة (يجب أن تحتوي على 6 أحرف على الأقل)';
        default:
            return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى';
    }
}

function resetAddPostForm() {
    document.getElementById('post-title').value = '';
    document.getElementById('post-description').value = '';
    document.getElementById('post-price').value = '';
    document.getElementById('post-location').value = '';
    document.getElementById('post-phone').value = '';
    postImageInput.value = '';
    imageName.textContent = 'لم يتم اختيار صورة';
    imagePreview.classList.add('hidden');
}

function resetAuthForms() {
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('signup-name').value = '';
    document.getElementById('signup-phone').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-address').value = '';
    document.getElementById('signup-account').value = '';
    authMessage.textContent = '';
    authMessage.className = '';
}

// لوحة التحكم
adminTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        // إخفاء جميع الأقسام
        adminOrdersSection.classList.add('hidden');
        adminNotificationsSection.classList.add('hidden');
        adminTransfersSection.classList.add('hidden');
        
        // إظهار القسم المحدد
        if (tabName === 'orders') {
            adminOrdersSection.classList.remove('hidden');
        } else if (tabName === 'notifications') {
            adminNotificationsSection.classList.remove('hidden');
        } else if (tabName === 'transfers') {
            adminTransfersSection.classList.remove('hidden');
        }
    });
});

// تحميل لوحة التحكم
function loadAdminDashboard() {
    loadAdminOrders();
    loadAdminNotifications();
    loadTransfersHistory();
}

// تحميل الطلبات للإدارة
function loadAdminOrders(status = 'all') {
    const ordersRef = database.ref('orders');
    ordersRef.on('value', (snapshot) => {
        ordersList.innerHTML = '';
        
        if (snapshot.exists()) {
            const orders = snapshot.val();
            Object.keys(orders).reverse().forEach(orderId => {
                const order = orders[orderId];
                if (status === 'all' || order.status === status) {
                    createOrderCard(order, orderId);
                }
            });
        } else {
            ordersList.innerHTML = '<p>لا توجد طلبات</p>';
        }
    });
}

// إنشاء بطاقة طلب
function createOrderCard(order, orderId) {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    orderCard.innerHTML = `
        <div class="order-header">
            <div class="order-id">طلب #${orderId}</div>
            <div class="order-status status-${order.status.replace(/\s/g, '-')}">${order.status}</div>
        </div>
        
        <div class="order-details">
            <div class="order-detail-group">
                <h4>المنتج</h4>
                <p>${order.productTitle}</p>
                <p><strong>السعر:</strong> ${order.productPrice} ريال</p>
            </div>
            
            <div class="order-detail-group">
                <h4>المشتري</h4>
                <p>${order.buyerName}</p>
                <p><strong>الهاتف:</strong> ${order.buyerPhone}</p>
                <p><strong>العنوان:</strong> ${order.buyerAddress}</p>
            </div>
            
            <div class="order-detail-group">
                <h4>الدفع</h4>
                <p><strong>اسم المرسل:</strong> ${order.senderName}</p>
                <p><strong>رقم العملية:</strong> ${order.transactionId}</p>
            </div>
            
            <div class="order-detail-group">
                <h4>البائع</h4>
                <p>${order.sellerName}</p>
                <p><strong>حساب الكريمي:</strong> ${order.sellerAccount}</p>
            </div>
        </div>
        
        <div class="order-actions">
            <button class="btn btn-confirm" data-id="${orderId}">تأكيد الطلب</button>
            <button class="btn btn-shipped" data-id="${orderId}">تم الشحن</button>
            <button class="btn btn-complete" data-id="${orderId}">مكتمل</button>
            <button class="btn btn-cancel" data-id="${orderId}">إلغاء</button>
        </div>
    `;
    
    ordersList.appendChild(orderCard);
}

// تحميل الإشعارات للإدارة
function loadAdminNotifications() {
    const notifRef = database.ref('admin_notifications');
    notifRef.on('value', (snapshot) => {
        notificationsList.innerHTML = '';
        
        if (snapshot.exists()) {
            const notifications = snapshot.val();
            Object.keys(notifications).reverse().forEach(notifId => {
                const notification = notifications[notifId];
                createNotificationCard(notification, notifId);
            });
        } else {
            notificationsList.innerHTML = '<p>لا توجد إشعارات</p>';
        }
    });
}

// إنشاء بطاقة إشعار
function createNotificationCard(notification, notifId) {
    const notifCard = document.createElement('div');
    notifCard.className = `notification-card ${notification.read ? '' : 'unread'}`;
    notifCard.innerHTML = `
        <div class="notification-content">
            <p>${notification.message}</p>
            <small>${formatDate(notification.timestamp)}</small>
        </div>
        <button class="btn-mark-read" data-id="${notifId}">تم القراءة</button>
    `;
    
    notificationsList.appendChild(notifCard);
}

// تحميل سجل التحويلات
function loadTransfersHistory() {
    const transfersRef = database.ref('transfers');
    transfersRef.on('value', (snapshot) => {
        transfersList.innerHTML = '';
        
        if (snapshot.exists()) {
            const transfers = snapshot.val();
            Object.keys(transfers).reverse().forEach(transferId => {
                const transfer = transfers[transferId];
                createTransferItem(transfer, transferId);
            });
        } else {
            transfersList.innerHTML = '<p>لا توجد تحويلات مسجلة</p>';
        }
    });
}

// إنشاء عنصر تحويل
function createTransferItem(transfer, transferId) {
    const transferItem = document.createElement('div');
    transferItem.className = 'transfer-item';
    transferItem.innerHTML = `
        <div>
            <div><strong>${transfer.account}</strong></div>
            <div>${transfer.reference}</div>
        </div>
        <div>
            <div>${transfer.amount} ريال</div>
            <small>${formatDate(transfer.timestamp)}</small>
        </div>
    `;
    
    transfersList.appendChild(transferItem);
}

// تنسيق التاريخ
function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('ar-SA');
}

// حذف جميع الإشعارات
clearNotificationsBtn.addEventListener('click', () => {
    if (confirm('هل أنت متأكد من حذف جميع الإشعارات؟')) {
        database.ref('admin_notifications').remove()
            .then(() => {
                notificationsList.innerHTML = '<p>لا توجد إشعارات</p>';
            })
            .catch(error => {
                console.error('Error deleting notifications:', error);
                alert('حدث خطأ أثناء حذف الإشعارات');
            });
    }
});

// تسجيل تحويل مالي
recordTransferBtn.addEventListener('click', async () => {
    const account = document.getElementById('transfer-account').value;
    const amount = document.getElementById('transfer-amount').value;
    const reference = document.getElementById('transfer-reference').value;
    
    if (!account || !amount || !reference) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    try {
        await database.ref('transfers').push({
            account: account,
            amount: amount,
            reference: reference,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        
        alert('تم تسجيل التحويل بنجاح');
        document.getElementById('transfer-account').value = '';
        document.getElementById('transfer-amount').value = '';
        document.getElementById('transfer-reference').value = '';
    } catch (error) {
        console.error('Error saving transfer:', error);
        alert('حدث خطأ أثناء تسجيل التحويل');
    }
});

// تصفية الطلبات
ordersFilter.addEventListener('change', (e) => {
    loadAdminOrders(e.target.value);
});

// معالجة أحداث الطلبات
ordersList.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-confirm')) {
        updateOrderStatus(e.target.dataset.id, 'تم التأكيد');
    } else if (e.target.classList.contains('btn-shipped')) {
        updateOrderStatus(e.target.dataset.id, 'تم الشحن');
    } else if (e.target.classList.contains('btn-complete')) {
        updateOrderStatus(e.target.dataset.id, 'مكتمل');
    } else if (e.target.classList.contains('btn-cancel')) {
        updateOrderStatus(e.target.dataset.id, 'ملغي');
    }
});

// تحديث حالة الطلب
function updateOrderStatus(orderId, status) {
    database.ref('orders/' + orderId).update({
        status: status
    })
    .then(() => {
        alert('تم تحديث حالة الطلب بنجاح');
    })
    .catch(error => {
        console.error('Error updating order status:', error);
        alert('حدث خطأ أثناء تحديث حالة الطلب');
    });
}