// Shared Navigation and Footer Injection for Grampanchayat Masola Bk
const GP_CONFIG = {
    id: 'gp-masolaBk',
    name: 'मसोला बुद्रुक'
};

function init() {
    injectHeader();
    injectFooter();
    initNavHandlers();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

function injectHeader() {
    const headerPlaceholder = document.getElementById("header-placeholder");
    if (!headerPlaceholder) return;

    // Get current filename to highlight active page
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html";

    const headerHtml = `
    <nav class="sticky top-0 z-[9999] bg-white border-b border-gray-200 shadow-sm font-sans">
        <!-- Top Accessibility & Language Utility Bar (Desktop only) -->
        <div class="hidden lg:block bg-slate-900 text-slate-300 text-xs py-1.5 border-b border-slate-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <span class="font-semibold text-slate-400">महाराष्ट्र शासन | ग्रामपंचायत कार्यालय मसोला (खुर्द)</span>
                </div>
                <div class="flex items-center gap-4">
                    <a href="sitemap.html" class="hover:text-emerald-400 transition flex items-center gap-1"><i class="fa-solid fa-sitemap text-emerald-500"></i> साईटमॅप (Sitemap)</a>
                    <span class="text-slate-600">|</span>
                    <!-- Language Selection -->
                    <div class="flex items-center gap-1.5">
                        <i class="fa-solid fa-globe text-emerald-500"></i>
                        <select id="lang-select-desktop" class="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-0.5 text-xs font-semibold focus:outline-none cursor-pointer hover:border-emerald-500">
                            <option value="mr" class="text-slate-200 bg-slate-800" selected>मराठी (MR)</option>
                            <option value="hi" class="text-slate-200 bg-slate-800">हिंदी (HI)</option>
                            <option value="en" class="text-slate-200 bg-slate-800">English (EN)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Top Header Strip (Emblem, Timings, Quick Action, Login) -->
        <div class="py-2.5 bg-gradient-to-r from-[#f0fcf9] via-[#e0f7f4] to-[#f0fcf9]">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col lg:flex-row justify-between items-center gap-3">
                    
                    <!-- Left: Emblem & GP Name -->
                    <div class="flex items-center gap-2.5 w-full lg:w-auto">
                        <a href="index.html" class="block w-10 h-10 shrink-0">
                            <!-- Emblem of Maharashtra or India -->
                            <img src="https://gpmedshi.com/new-gp-page/main-page/images/header-images/2.png" alt="GP Logo" class="w-full h-full object-contain" onerror="this.src='./assets/logo.png'"/>
                        </a>
                        <div class="flex flex-col justify-center">
                            <a href="index.html" class="hover:text-blue-900 transition-colors">
                                <div class="flex flex-row items-center gap-1.5 flex-wrap leading-none">
                                    <span class="text-base sm:text-lg lg:text-base xl:text-lg font-extrabold text-[#1f3a5f] tracking-tight leading-none">ग्रामपंचायत कार्यालय</span>
                                    <span class="text-base sm:text-lg lg:text-base xl:text-lg font-extrabold text-emerald-700 tracking-tight leading-none">मसोला बुद्रुक</span>
                                </div>
                                <div class="text-[10px] sm:text-xs font-semibold text-slate-500 mt-0 leading-none">
                                    <span>पंचायत समिती मंगरुळपीर, जिल्हा वाशिम</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    <!-- Middle: Timings strip (Desktop only) -->
                    <div class="hidden lg:flex flex-col xl:flex-row items-center gap-1 xl:gap-6 text-xs md:text-sm font-medium">
                        <div class="flex items-center gap-2 text-blue-700">
                            <i class="fa-solid fa-calendar-days text-base"></i>
                            <span>सोमवार ते शुक्रवार: <span class="font-bold underline underline-offset-2">सकाळी ९:४५ ते संध्या. ६:१५</span></span>
                        </div>
                        <div class="flex items-center gap-2 text-amber-700">
                            <i class="fa-solid fa-calendar-xmark text-base"></i>
                            <span>शनिवार व रविवार: <span class="font-bold underline underline-offset-2">सार्वजनिक सुट्टी</span></span>
                        </div>
                    </div>

                    <!-- Right: Quick Actions (Forms, Login) -->
                    <div class="flex items-center justify-between sm:justify-end gap-3 w-full lg:w-auto">
                        <a href="gp-applications.html" class="inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-xs sm:text-sm font-bold rounded-lg shadow-md text-white bg-gradient-to-r from-[#1f3a5f] to-[#234a7d] hover:from-[#234a7d] hover:to-[#1a2e50] focus:outline-none transition-all duration-200">
                            <i class="fa-solid fa-building-columns"></i>
                            <span>नागरीक सुविधा अर्ज</span>
                        </a>
                        <button onclick="document.getElementById('loginModal').showModal()" class="inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-xs sm:text-sm font-bold rounded-lg shadow-md text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 focus:outline-none transition-all duration-200">
                            <i class="fa-solid fa-arrow-right-to-bracket"></i>
                            <span>ग्राम लॉगिन</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>

        <!-- Lower Navigation Bar (Menus & Language Select) -->
        <div class="bg-gradient-to-r from-[#203a5e] via-[#3a6b5c] to-[#203a5e] text-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div class="flex items-center lg:justify-center justify-between h-12">
                    
                    <!-- Desktop Menu Items -->
                    <div class="hidden lg:flex items-center justify-center space-x-0.5 xl:space-x-1.5 text-xs lg:text-[11px] xl:text-sm font-medium mx-auto">
                        
                        <a href="index.html" class="px-2 py-1 lg:px-1.5 lg:py-1 xl:px-3 xl:py-1.5 border-b-2 border-transparent rounded-md hover:bg-white/10 transition whitespace-nowrap ${page === 'index.html' ? 'bg-white/20 border-emerald-400 font-semibold' : ''}">मुख्य पृष्ठ</a>

                        <!-- आपल गाव Dropdown -->
                        <div class="dropdown dropdown-hover dropdown-bottom">
                            <label tabindex="0" class="px-2 py-1 lg:px-1.5 lg:py-1 xl:px-3 xl:py-1.5 border-b-2 border-transparent rounded-md hover:bg-white/10 transition cursor-pointer flex items-center gap-1 whitespace-nowrap">
                                <span>आपल गाव</span>
                                <i class="fa-solid fa-chevron-down text-2xs"></i>
                            </label>
                            <ul tabindex="0" class="dropdown-content z-[100] menu p-2 shadow bg-white rounded-box w-52 text-slate-800">
                                <li><a href="mahiti.html" class="${page === 'mahiti.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">अहवाल व माहिती</a></li>
                                <li><a href="population.html" class="${page === 'population.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">ग्रामपंचायत टिपणी</a></li>
                                <li><a href="gallery.html" class="${page === 'gallery.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">Gallery/छायाचित्रे</a></li>
                                <li><a href="digital-lib.html" class="${page === 'digital-lib.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">Digital Library</a></li>
                                <li><a href="udyog.html" class="${page === 'udyog.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">गावातील उद्योग</a></li>
                                <li><a href="news.html" class="${page === 'news.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">गावातील बातम्या</a></li>
                                <li><a href="divyanga-list.html" class="${page === 'divyanga-list.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">दिव्यांग लोकांची यादी</a></li>
                            </ul>
                        </div>

                        <a href="sadasya.html" class="px-2 py-1 lg:px-1.5 lg:py-1 xl:px-3 xl:py-1.5 border-b-2 border-transparent rounded-md hover:bg-white/10 transition whitespace-nowrap ${page === 'sadasya.html' ? 'bg-white/20 border-emerald-400 font-semibold' : ''}">पदाधिकारी व सेवकवर्ग</a>

                        <!-- मार्गदर्शक सेवा Dropdown -->
                        <div class="dropdown dropdown-hover dropdown-bottom">
                            <label tabindex="0" class="px-2 py-1 lg:px-1.5 lg:py-1 xl:px-3 xl:py-1.5 border-b-2 border-transparent rounded-md hover:bg-white/10 transition cursor-pointer flex items-center gap-1 whitespace-nowrap">
                                <span>मार्गदर्शक सेवा</span>
                                <i class="fa-solid fa-chevron-down text-2xs"></i>
                            </label>
                            <ul tabindex="0" class="dropdown-content z-[100] menu p-2 shadow bg-white rounded-box w-56 text-slate-800">
                                <li><a href="online-guidance.html" class="${page === 'online-guidance.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">ONLINE मार्गदर्शन</a></li>
                                <li><a href="eseva.html" class="${page === 'eseva.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">ई-सेवा मार्गदर्शन</a></li>
                                <li><a href="suvidha.html" class="${page === 'suvidha.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">नागरिक सुविधा</a></li>
                            </ul>
                        </div>

                        <!-- योजना-निधी-विकास कामे Dropdown -->
                        <div class="dropdown dropdown-hover dropdown-bottom">
                            <label tabindex="0" class="px-2 py-1 lg:px-1.5 lg:py-1 xl:px-3 xl:py-1.5 border-b-2 border-transparent rounded-md hover:bg-white/10 transition cursor-pointer flex items-center gap-1 whitespace-nowrap">
                                <span>योजना व विकास</span>
                                <i class="fa-solid fa-chevron-down text-2xs"></i>
                            </label>
                            <ul tabindex="0" class="dropdown-content z-[100] menu p-2 shadow bg-white rounded-box w-56 text-slate-800">
                                <li><a href="fund-details.html" class="${page === 'fund-details.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">निधी उत्पन्न व खर्च तपशील</a></li>
                                <li><a href="dev-works.html" class="${page === 'dev-works.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">चालू-पूर्ण विकास कामे</a></li>
                                <li><a href="nirnay.html" class="${page === 'nirnay.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">ग्रामसभेचे निर्णय</a></li>
                            </ul>
                        </div>

                        <!-- आरोग्य सेवा Dropdown -->
                        <div class="dropdown dropdown-hover dropdown-bottom">
                            <label tabindex="0" class="px-2 py-1 lg:px-1.5 lg:py-1 xl:px-3 xl:py-1.5 border-b-2 border-transparent rounded-md hover:bg-white/10 transition cursor-pointer flex items-center gap-1 whitespace-nowrap">
                                <span>आरोग्य सेवा</span>
                                <i class="fa-solid fa-chevron-down text-2xs"></i>
                            </label>
                            <ul tabindex="0" class="dropdown-content z-[100] menu p-2 shadow bg-white rounded-box w-64 text-slate-800">
                                <li><a href="arogya-seva.html" class="${page === 'arogya-seva.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">आरोग्य सेवा व माहिती</a></li>
                                <li><a href="arogya-yojana.html" class="${page === 'arogya-yojana.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">शासकीय आरोग्य योजना व इतर सेवा</a></li>
                            </ul>
                        </div>

                        <!-- शिक्षण Dropdown -->
                        <div class="dropdown dropdown-hover dropdown-bottom">
                            <label tabindex="0" class="px-2 py-1 lg:px-1.5 lg:py-1 xl:px-3 xl:py-1.5 border-b-2 border-transparent rounded-md hover:bg-white/10 transition cursor-pointer flex items-center gap-1 whitespace-nowrap">
                                <span>शिक्षण व कृषी</span>
                                <i class="fa-solid fa-chevron-down text-2xs"></i>
                            </label>
                            <ul tabindex="0" class="dropdown-content z-[100] menu p-2 shadow bg-white rounded-box w-56 text-slate-800">
                                <li><a href="jobs.html" class="${page === 'jobs.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">नोकरी विषयक माहिती</a></li>
                                <li><a href="education-list.html" class="${page === 'education-list.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">शाळा / महाविद्यालय यादी</a></li>
                                <li><a href="krishi.html" class="${page === 'krishi.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">कृषी विज्ञान माहिती</a></li>
                            </ul>
                        </div>

                        <a href="rti-info.html" class="px-2 py-1 lg:px-1.5 lg:py-1 xl:px-3 xl:py-1.5 border-b-2 border-transparent rounded-md hover:bg-white/10 transition whitespace-nowrap ${page === 'rti-info.html' ? 'bg-white/20 border-emerald-400 font-semibold' : ''}">माहितीचा अधिकार</a>
                        <a href="complaints.html" class="px-2 py-1 lg:px-1.5 lg:py-1 xl:px-3 xl:py-1.5 border-b-2 border-transparent rounded-md hover:bg-white/10 transition whitespace-nowrap ${page === 'complaints.html' ? 'bg-white/20 border-emerald-400 font-semibold' : ''}">तक्रार नोंदणी</a>
                        <a href="divyanga-registration.html" class="px-2 py-1 lg:px-1.5 lg:py-1 xl:px-3 xl:py-1.5 border-b-2 border-transparent rounded-md hover:bg-white/10 transition whitespace-nowrap ${page === 'divyanga-registration.html' ? 'bg-white/20 border-emerald-400 font-semibold' : ''}">दिव्यांग नोंदणी</a>
                        <a href="qr-list.html" class="px-2 py-1 lg:px-1.5 lg:py-1 xl:px-3 xl:py-1.5 border-b-2 border-transparent rounded-md hover:bg-white/10 transition whitespace-nowrap ${page === 'qr-list.html' ? 'bg-white/20 border-emerald-400 font-semibold' : ''}">QR List</a>

                        <!-- इतर वैशिष्ट्ये Dropdown -->
                        <div class="dropdown dropdown-hover dropdown-bottom dropdown-end">
                            <label tabindex="0" class="px-2 py-1 lg:px-1.5 lg:py-1 xl:px-3 xl:py-1.5 border-b-2 border-transparent rounded-md hover:bg-white/10 transition cursor-pointer flex items-center gap-1 whitespace-nowrap">
                                <span>इतर</span>
                                <i class="fa-solid fa-chevron-down text-2xs"></i>
                            </label>
                            <ul tabindex="0" class="dropdown-content z-[100] menu p-2 shadow bg-white rounded-box w-52 text-slate-800">
                                <li><a href="nakasha.html" class="${page === 'nakasha.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">गावाचा नकाशा</a></li>
                                <li><a href="puraskar.html" class="${page === 'puraskar.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">पुरस्कार / सन्मान</a></li>
                                <li><a href="utsav.html" class="${page === 'utsav.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">सण आणि उत्सव</a></li>
                                <li><a href="paryatan.html" class="${page === 'paryatan.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">पर्यटन स्थळे</a></li>
                                <li><a href="abhipray.html" class="${page === 'abhipray.html' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}">अभिप्राय नोंदवा</a></li>
                            </ul>
                        </div>

                    </div>

                    <!-- Language Switcher & Hamburger (Mobile only) -->
                    <div class="flex lg:hidden items-center justify-between w-full">
                        <div>
                            <button id="mobile-menu-btn" class="text-white hover:text-gray-200 text-2xl focus:outline-none p-1">
                                <i class="fa-solid fa-bars" id="menu-icon-bars"></i>
                                <i class="fa-solid fa-xmark hidden" id="menu-icon-close"></i>
                            </button>
                        </div>

                        <div class="flex items-center gap-2">
                            <select id="lang-select-mobile" class="bg-white/20 text-white border border-white/30 rounded-lg px-2 py-1 text-xs sm:text-sm font-semibold focus:outline-none cursor-pointer">
                                <option value="mr" class="text-slate-800" selected>मराठी (MR)</option>
                                <option value="hi" class="text-slate-800">हिंदी (HI)</option>
                                <option value="en" class="text-slate-800">English (EN)</option>
                            </select>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- Mobile Menu (Drawer) -->
        <div id="mobile-menu-drawer" class="hidden lg:hidden bg-[#203a5e] border-t border-white/10 text-white w-full transition-all duration-300">
            <div class="px-4 py-3 space-y-2 text-sm font-semibold max-h-[70vh] overflow-y-auto">
                <a href="index.html" class="block py-2 border-b border-white/5 hover:text-emerald-300">मुख्य पृष्ठ</a>
                
                <!-- Expanded Sections -->
                <div class="py-1">
                    <span class="text-emerald-300 text-xs uppercase tracking-wider block mb-1">आपल गाव</span>
                    <a href="mahiti.html" class="block pl-4 py-1.5 hover:text-emerald-300">- अहवाल व माहिती</a>
                    <a href="population.html" class="block pl-4 py-1.5 hover:text-emerald-300">- ग्रामपंचायत टिपणी</a>
                    <a href="gallery.html" class="block pl-4 py-1.5 hover:text-emerald-300">- Gallery/छायाचित्रे</a>
                    <a href="digital-lib.html" class="block pl-4 py-1.5 hover:text-emerald-300">- Digital Library</a>
                    <a href="udyog.html" class="block pl-4 py-1.5 hover:text-emerald-300">- गावातील उद्योग</a>
                    <a href="news.html" class="block pl-4 py-1.5 hover:text-emerald-300">- गावातील बातम्या</a>
                    <a href="divyanga-list.html" class="block pl-4 py-1.5 hover:text-emerald-300">- दिव्यांग लोकांची यादी</a>
                </div>

                <a href="sadasya.html" class="block py-2 border-b border-white/5 hover:text-emerald-300">पदाधिकारी व सेवकवर्ग</a>

                <div class="py-1">
                    <span class="text-emerald-300 text-xs uppercase tracking-wider block mb-1">मार्गदर्शक सेवा</span>
                    <a href="online-guidance.html" class="block pl-4 py-1.5 hover:text-emerald-300">- ONLINE मार्गदर्शन</a>
                    <a href="eseva.html" class="block pl-4 py-1.5 hover:text-emerald-300">- ई-सेवा मार्गदर्शन</a>
                    <a href="suvidha.html" class="block pl-4 py-1.5 hover:text-emerald-300">- नागरिक सुविधा</a>
                </div>

                <div class="py-1">
                    <span class="text-emerald-300 text-xs uppercase tracking-wider block mb-1">योजना व विकास</span>
                    <a href="fund-details.html" class="block pl-4 py-1.5 hover:text-emerald-300">- निधी उत्पन्न व खर्च तपशील</a>
                    <a href="dev-works.html" class="block pl-4 py-1.5 hover:text-emerald-300">- चालू-पूर्ण विकास कामे</a>
                    <a href="nirnay.html" class="block pl-4 py-1.5 hover:text-emerald-300">- ग्रामसभेचे निर्णय</a>
                </div>

                <div class="py-1">
                    <span class="text-emerald-300 text-xs uppercase tracking-wider block mb-1">आरोग्य सेवा</span>
                    <a href="arogya-seva.html" class="block pl-4 py-1.5 hover:text-emerald-300">- आरोग्य सेवा व माहिती</a>
                    <a href="arogya-yojana.html" class="block pl-4 py-1.5 hover:text-emerald-300">- शासकीय आरोग्य योजना</a>
                </div>

                <div class="py-1">
                    <span class="text-emerald-300 text-xs uppercase tracking-wider block mb-1">शिक्षण व कृषी</span>
                    <a href="jobs.html" class="block pl-4 py-1.5 hover:text-emerald-300">- नोकरी विषयक माहिती</a>
                    <a href="education-list.html" class="block pl-4 py-1.5 hover:text-emerald-300">- शाळा / महाविद्यालय यादी</a>
                    <a href="krishi.html" class="block pl-4 py-1.5 hover:text-emerald-300">- कृषी विज्ञान माहिती</a>
                </div>

                <a href="rti-info.html" class="block py-2 border-b border-white/5 hover:text-emerald-300">माहितीचा अधिकार</a>
                <a href="complaints.html" class="block py-2 border-b border-white/5 hover:text-emerald-300">तक्रार नोंदणी</a>
                <a href="divyanga-registration.html" class="block py-2 border-b border-white/5 hover:text-emerald-300">दिव्यांग नोंदणी</a>
                <a href="qr-list.html" class="block py-2 border-b border-white/5 hover:text-emerald-300">QR List</a>
                
                <div class="py-1">
                    <span class="text-emerald-300 text-xs uppercase tracking-wider block mb-1">इतर</span>
                    <a href="nakasha.html" class="block pl-4 py-1.5 hover:text-emerald-300">- गावाचा नकाशा</a>
                    <a href="puraskar.html" class="block pl-4 py-1.5 hover:text-emerald-300">- पुरस्कार / सन्मान</a>
                    <a href="utsav.html" class="block pl-4 py-1.5 hover:text-emerald-300">- सण आणि उत्सव</a>
                    <a href="paryatan.html" class="block pl-4 py-1.5 hover:text-emerald-300">- पर्यटन स्थळे</a>
                    <a href="abhipray.html" class="block pl-4 py-1.5 hover:text-emerald-300">- अभिप्राय नोंदवा</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Interactive Gram Login Modal (DaisyUI dialog) -->
    <dialog id="loginModal" class="modal">
        <div class="modal-box bg-white max-w-sm rounded-xl p-6 shadow-2xl relative text-slate-800">
            <form method="dialog">
                <button type="button" onclick="document.getElementById('loginModal').close()" class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-slate-500 hover:bg-slate-100">✕</button>
            </form>
            <h3 class="text-xl font-extrabold text-[#1f3a5f] text-center mb-4 flex items-center justify-center gap-2">
                <i class="fa-solid fa-lock text-emerald-600"></i>
                <span>ग्राम लॉगिन (Admin)</span>
            </h3>
            
            <form id="navbarLoginForm" onsubmit="handleNavbarLogin(event)" class="space-y-4">
                <div class="form-control">
                    <label class="label font-bold text-xs uppercase text-slate-500">युझरनेम (Username)</label>
                    <input type="text" id="navbarUsername" required placeholder="उदा. admin" class="input input-bordered w-full bg-slate-50 text-slate-800 border-gray-300 focus:border-emerald-500 focus:outline-none text-sm" />
                </div>
                <div class="form-control">
                    <label class="label font-bold text-xs uppercase text-slate-500">पासवर्ड (Password)</label>
                    <input type="password" id="navbarPassword" required placeholder="••••••••" class="input input-bordered w-full bg-slate-50 text-slate-800 border-gray-300 focus:border-emerald-500 focus:outline-none text-sm" />
                </div>
                <button type="submit" class="btn bg-gradient-to-r from-[#1f3a5f] to-[#234a7d] hover:from-[#234a7d] hover:to-[#1a2e50] text-white w-full border-none shadow-md mt-2 font-bold py-2.5">
                    लॉगिन करा
                </button>
            </form>
        </div>
    </dialog>
    `;
    headerPlaceholder.innerHTML = headerHtml;

    // Dynamically update Gram Login button if logged in
    const token = localStorage.getItem('gpToken');
    if (token) {
        const loginBtn = headerPlaceholder.querySelector('button[onclick*="loginModal"]');
        if (loginBtn) {
            loginBtn.outerHTML = `
                <a href="admin.html" class="inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-xs sm:text-sm font-bold rounded-lg shadow-md text-white bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 focus:outline-none transition-all duration-200">
                    <i class="fa-solid fa-gauge-high"></i>
                    <span>प्रशासन डॅशबोर्ड</span>
                </a>
            `;
        }
    }
}

function injectFooter() {
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (!footerPlaceholder) return;

    const footerHtml = `
    <footer class="bg-slate-900 text-slate-300 border-t-4 border-emerald-600 font-sans pt-12 pb-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                
                <!-- Column 1: GP Office & Details -->
                <div class="space-y-4">
                    <div class="flex items-center gap-2">
                        <img src="https://gpmedshi.com/new-gp-page/main-page/images/header-images/2.png" alt="Emblem" class="w-10 h-10 object-contain" onerror="this.src='./assets/logo.png'"/>
                        <h4 class="text-white text-lg font-bold">ग्रामपंचायत कार्यालय, मसोला (खुर्द)</h4>
                    </div>
                    <p class="text-sm text-slate-400 leading-relaxed">
                        मसोला बुद्रुक हे वाशिम जिल्ह्यातील प्रगत आणि समृद्ध गाव आहे. ग्रामपंचायत डिजिटल आणि पारदर्शक कारभारासाठी सदैव तत्पर आहे.
                    </p>
                    <div class="space-y-2 text-sm">
                        <div class="flex items-start gap-2.5">
                            <i class="fa-solid fa-location-dot mt-1 text-emerald-500"></i>
                            <span>ग्रामपंचायत कार्यालय, मसोला (खुर्द), ता. मंगरुळपीर, जि. वाशिम, महाराष्ट्र - ४४४४०९</span>
                        </div>
                        <div class="flex items-center gap-2.5">
                            <i class="fa-solid fa-envelope text-emerald-500"></i>
                            <a href="mailto:gp.masolakhurd@gmail.com" class="hover:text-emerald-400">gp.masolakhurd@gmail.com</a>
                        </div>
                    </div>
                </div>

                <!-- Column 2: Quick Links -->
                <div>
                    <h4 class="text-white text-base font-bold uppercase tracking-wider mb-5 border-b border-slate-700 pb-2">नागरिक दुवे (Links)</h4>
                    <ul class="space-y-2.5 text-sm">
                        <li><a href="index.html" class="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><i class="fa-solid fa-chevron-right text-3xs text-emerald-500"></i>मुख्य पृष्ठ</a></li>
                        <li><a href="rti-info.html" class="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><i class="fa-solid fa-chevron-right text-3xs text-emerald-500"></i>माहितीचा अधिकार (RTI)</a></li>
                        <li><a href="gp-applications.html" class="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><i class="fa-solid fa-chevron-right text-3xs text-emerald-500"></i>नागरीक सुविधा अर्ज</a></li>
                        <li><a href="complaints.html" class="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><i class="fa-solid fa-chevron-right text-3xs text-emerald-500"></i>तक्रार नोंदणी</a></li>
                        <li><a href="sitemap.html" class="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><i class="fa-solid fa-chevron-right text-3xs text-emerald-500"></i>साईटमॅप</a></li>
                    </ul>
                </div>

                <!-- Column 3: Government Portals -->
                <div>
                    <h4 class="text-white text-base font-bold uppercase tracking-wider mb-5 border-b border-slate-700 pb-2">शासकीय संकेतस्थळे</h4>
                    <ul class="space-y-2.5 text-sm">
                        <li><a href="https://maharashtra.gov.in" target="_blank" class="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><i class="fa-solid fa-chevron-right text-3xs text-emerald-500"></i>महाराष्ट्र शासन</a></li>
                        <li><a href="https://aaplesarkar.maharashtra.gov.in" target="_blank" class="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><i class="fa-solid fa-chevron-right text-3xs text-emerald-500"></i>आपले सरकार</a></li>
                        <li><a href="https://mahadbtmahait.gov.in" target="_blank" class="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><i class="fa-solid fa-chevron-right text-3xs text-emerald-500"></i>महाडीबीटी पोर्टल</a></li>
                        <li><a href="https://digilocker.gov.in" target="_blank" class="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><i class="fa-solid fa-chevron-right text-3xs text-emerald-500"></i>डिजिटल लॉकर</a></li>
                        <li><a href="https://pmfby.gov.in" target="_blank" class="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><i class="fa-solid fa-chevron-right text-3xs text-emerald-500"></i>पंतप्रधान पीक विमा</a></li>
                    </ul>
                </div>

                <!-- Column 4: Interactive Map -->
                <div>
                    <h4 class="text-white text-base font-bold uppercase tracking-wider mb-5 border-b border-slate-700 pb-2">गावाचा नकाशा</h4>
                    <div class="rounded-lg overflow-hidden border border-slate-700 shadow-inner">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.123456789012!2d77.12345678901234!3d20.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd13a1a1a1a1a1a%3A0x1a1a1a1a1a1a1a1a!2sMasola%20Khurd%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                            width="100%" 
                            height="140" 
                            style="border:0;" 
                            allowfullscreen="" 
                            loading="lazy"
                            title="Google Map of Masola">
                        </iframe>
                    </div>
                </div>

            </div>

            <!-- Bottom Row: Copyright, Developer and Policies -->
            <div class="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                <div class="text-center md:text-left leading-relaxed">
                    <p>&copy; 2026 ग्रामपंचायत मसोला (खुर्द). सर्व हक्क सुरक्षित.</p>
                    <p class="mt-1">विकसित आणि डिझाइन: ग्रामपंचायत आयटी विभाग.</p>
                </div>
                <div class="flex flex-wrap justify-center gap-4">
                    <a href="dhorne.html" class="hover:text-slate-400">धोरणे (Privacy Policy)</a>
                    <span>|</span>
                    <a href="atisharti.html" class="hover:text-slate-400">अटी आणि शर्ती</a>
                    <span>|</span>
                    <a href="abhipray.html" class="hover:text-slate-400">अभिप्राय (Feedback)</a>
                </div>
            </div>
        </div>
    </footer>
    `;
    footerPlaceholder.innerHTML = footerHtml;
}

function initNavHandlers() {
    // Mobile Drawer Toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenuDrawer = document.getElementById("mobile-menu-drawer");
    const menuIconBars = document.getElementById("menu-icon-bars");
    const menuIconClose = document.getElementById("menu-icon-close");

    if (mobileMenuBtn && mobileMenuDrawer) {
        // Prevent duplicate handler bindings
        if (mobileMenuBtn.dataset.navInitialized) return;
        mobileMenuBtn.dataset.navInitialized = "true";

        mobileMenuBtn.addEventListener("click", function(e) {
            e.preventDefault();
            
            const isHidden = mobileMenuDrawer.classList.contains("hidden");
            if (isHidden) {
                mobileMenuDrawer.classList.remove("hidden");
                menuIconBars.classList.add("hidden");
                menuIconClose.classList.remove("hidden");
            } else {
                mobileMenuDrawer.classList.add("hidden");
                menuIconBars.classList.remove("hidden");
                menuIconClose.classList.add("hidden");
            }
        });

        // Close menu if clicked anywhere outside the drawer (unless clicking the button)
        // OR if clicked on a link (anchor/nav link) inside the drawer
        document.addEventListener("click", function(e) {
            const isClickInsideDrawer = mobileMenuDrawer.contains(e.target);
            const isClickOnButton = mobileMenuBtn.contains(e.target);
            const isClickOnLink = e.target.tagName === 'A' || e.target.closest('a');
            
            if (isClickOnLink && isClickInsideDrawer) {
                // Clicked on a link inside the drawer - close it
                mobileMenuDrawer.classList.add("hidden");
                menuIconBars.classList.remove("hidden");
                menuIconClose.classList.add("hidden");
            } else if (!isClickInsideDrawer && !isClickOnButton) {
                // Clicked completely outside - close it
                mobileMenuDrawer.classList.add("hidden");
                menuIconBars.classList.remove("hidden");
                menuIconClose.classList.add("hidden");
            }
        });
    }

    // Language Dropdown Handler
    const langDesktop = document.getElementById("lang-select-desktop");
    const langMobile = document.getElementById("lang-select-mobile");
    const savedLang = localStorage.getItem("selectedLanguage") || "mr";

    function updateLanguage(selectedLang) {
        localStorage.setItem("selectedLanguage", selectedLang);
        if (langDesktop) langDesktop.value = selectedLang;
        if (langMobile) langMobile.value = selectedLang;

        if (selectedLang === "en") {
            alert("Translation to English is in progress! Core text will change.");
        } else if (selectedLang === "hi") {
            alert("हिंदी में अनुवाद प्रगति पर है! मुख्य पाठ बदल जाएगा।");
        } else {
            alert("मराठी भाषा निवडली आहे.");
        }
    }

    if (langDesktop) {
        langDesktop.value = savedLang;
        langDesktop.addEventListener("change", function() {
            updateLanguage(langDesktop.value);
        });
    }
    if (langMobile) {
        langMobile.value = savedLang;
        langMobile.addEventListener("change", function() {
            updateLanguage(langMobile.value);
        });
    }
}

// Global handler for navbar admin/staff login
async function handleNavbarLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('navbarUsername');
    const passwordInput = document.getElementById('navbarPassword');
    if (!usernameInput || !passwordInput) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('gpToken', data.token);
            localStorage.setItem('gpUser', JSON.stringify(data.user));
            document.getElementById('loginModal').close();
            // Redirect to admin panel
            window.location.href = 'admin.html';
        } else {
            alert(data.error || 'लॉगिन अयशस्वी! कृपया युझरनेम किंवा पासवर्ड तपासा.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('सर्व्हरशी संपर्क साधता आला नाही. कृपया बॅकएंड चालू असल्याची खात्री करा.');
    }
}
