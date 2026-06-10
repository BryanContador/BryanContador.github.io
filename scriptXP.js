document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    //  TASKBAR CLOCK LOGIC
    // ==========================================================================
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        document.getElementById('clock').textContent = `${hours}:${minutes} ${ampm}`;
    }

    setInterval(updateClock, 1000);
    updateClock(); // Run immediately on load

    // ==========================================================================
    // DYNAMIC DESKTOP ICON GENERATION FROM DATA.JS
    // ==========================================================================
    const desktopContainer = document.getElementById('desktop-icons-container');

    // Map your character IDs from data.js to your custom icon filenames
    //CUSTOM ICONS
    const customCharacterIcons = {
        'sunshine': 'resources/Menu/sunshine_48x48x32.png',
        'jamol': 'resources/Menu/jamol_48x48x32.png',
        'berkut': 'resources/Menu/berkut_48x48x32.png',
        'bertie': 'resources/Menu/bertie_48x48x32.png',
        'demon_girl': 'resources/Menu/demon_48x48x32.png',
        'misc': 'resources/Menu/others-48x48x32.png'
    };

    if (typeof galleryData !== 'undefined' && galleryData.categories) {
        galleryData.categories.forEach(character => {
            //if (character.id === 'misc') return; 

            const iconDiv = document.createElement('div');
            iconDiv.className = 'desktop-icon';
            iconDiv.dataset.app = character.id; 
            
            // Set the small icon to be used for the window title bar & taskbar
            iconDiv.dataset.smallIcon = 'resources/Menu/small-folder_16x32.png';

            const img = document.createElement('img');
            // Check if we have a custom icon, otherwise fallback to standard folder
            img.src = customCharacterIcons[character.id] || "https://win98icons.alexmeub.com/icons/png/directory_closed-4.png";
            img.alt = character.name;

            const label = document.createElement('span');
            label.textContent = character.name;

            iconDiv.appendChild(img);
            iconDiv.appendChild(label);
            desktopContainer.appendChild(iconDiv);
        });
    }

    // ==========================================================================
    // UPDATE DOUBLE-CLICK LOGIC
    // ==========================================================================
    const allIcons = document.querySelectorAll('.desktop-icon');

    allIcons.forEach(icon => {
        // Selection highlight
        icon.addEventListener('click', (e) => {
            e.stopPropagation(); 
            allIcons.forEach(i => i.classList.remove('selected'));
            icon.classList.add('selected');
        });

        // Double click to open
        icon.addEventListener('dblclick', () => {
            const appId = icon.dataset.app;
            const title = icon.querySelector('span').textContent;
            // NEW: Use the small icon data attribute! If it's missing, fallback to the large image.
            const iconSrc = icon.dataset.smallIcon || icon.querySelector('img').src;
            
            openWindow(appId, title, iconSrc);
        });

        // Mobile tap support
        let lastTap = 0;
        icon.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                const appId = icon.dataset.app;
                const title = icon.querySelector('span').textContent;
                // Use the small icon data attribute here too!
                const iconSrc = icon.dataset.smallIcon || icon.querySelector('img').src;
                
                openWindow(appId, title, iconSrc);
                e.preventDefault();
            }
            lastTap = currentTime;
        });
    });

    // Clicking empty desktop clears selection
    document.getElementById('desktop').addEventListener('click', () => {
        allIcons.forEach(i => i.classList.remove('selected'));
    });

    // ==========================================================================
    // WINDOW MANAGER SYSTEM
    // ==========================================================================
    let highestZIndex = 100;
    const desktopEl = document.getElementById('desktop');
    const taskbarTasksEl = document.getElementById('taskbar-tasks');
    const windowTemplate = document.getElementById('window-template');
    const openWindows = {};

    function openWindow(appId, title, iconSrc) {
        // Bring to front if already open
        if (openWindows[appId]) {
            focusWindow(openWindows[appId].windowEl, openWindows[appId].taskbarEl);
            return;
        }

        // Clone template
        const windowNode = windowTemplate.content.cloneNode(true);
        const windowEl = windowNode.querySelector('.xp-window');
        
        windowEl.id = `window-${appId}`;
        windowEl.querySelector('.window-title').textContent = title;
        windowEl.querySelector('.window-icon').src = iconSrc;
        
        populateWindowContent(appId, windowEl.querySelector('.window-content'));

        // Offset positions slightly
        const offset = Object.keys(openWindows).length * 20;
        if (window.innerWidth > 768) {
            windowEl.style.top = `${10 + offset}px`;
            windowEl.style.left = `${10 + offset}px`;
        }

        // Create Taskbar Button
        const taskbarBtn = document.createElement('div');
        taskbarBtn.className = 'taskbar-item';
        taskbarBtn.innerHTML = `<img src="${iconSrc}" alt=""> <span>${title}</span>`;
        taskbarTasksEl.appendChild(taskbarBtn);

        // Store reference
        openWindows[appId] = { windowEl, taskbarEl: taskbarBtn };
        desktopEl.appendChild(windowEl);
        focusWindow(windowEl, taskbarBtn);

        // --- WINDOW LISTENERS ---
        windowEl.addEventListener('mousedown', () => focusWindow(windowEl, taskbarBtn));
        windowEl.addEventListener('touchstart', () => focusWindow(windowEl, taskbarBtn), {passive: true});

        taskbarBtn.addEventListener('click', () => {
            if (windowEl.style.display === 'none') {
                windowEl.style.display = 'flex';
                focusWindow(windowEl, taskbarBtn);
            } else if (windowEl.style.zIndex == highestZIndex) {
                windowEl.style.display = 'none';
                taskbarBtn.classList.remove('active');
            } else {
                focusWindow(windowEl, taskbarBtn);
            }
        });

        // Close Button
        windowEl.querySelector('.btn-close').addEventListener('click', () => {
            windowEl.remove();
            taskbarBtn.remove();
            delete openWindows[appId];
        });

        // Minimize Button
        windowEl.querySelector('.btn-minimize').addEventListener('click', () => {
            windowEl.style.display = 'none';
            taskbarBtn.classList.remove('active');
        });

        // Maximize Logic
        let isMaximized = false;
        let prevTop, prevLeft, prevWidth, prevHeight;
        const btnMaximize = windowEl.querySelector('.btn-maximize');
        const titleBar = windowEl.querySelector('.title-bar');

        function toggleMaximize() {
            if (!isMaximized) {
                prevTop = windowEl.style.top;
                prevLeft = windowEl.style.left;
                prevWidth = windowEl.style.width;
                prevHeight = windowEl.style.height;
                windowEl.classList.add('maximized');
                isMaximized = true;
            } else {
                windowEl.classList.remove('maximized');
                windowEl.style.top = prevTop;
                windowEl.style.left = prevLeft;
                windowEl.style.width = prevWidth || '600px';
                windowEl.style.height = prevHeight || '450px';
                isMaximized = false;
            }
        }
        btnMaximize.addEventListener('click', toggleMaximize);
        titleBar.addEventListener('dblclick', toggleMaximize);

        // Make draggable
        makeDraggable(windowEl, titleBar);
    }

    function focusWindow(windowEl, taskbarEl) {
        highestZIndex++;
        windowEl.style.zIndex = highestZIndex;
        windowEl.style.display = 'flex';
        document.querySelectorAll('.taskbar-item').forEach(item => item.classList.remove('active'));
        taskbarEl.classList.add('active');
    }

    function makeDraggable(windowEl, dragHandle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        dragHandle.onmousedown = dragMouseDown;
        dragHandle.ontouchstart = dragTouchStart;

        function dragMouseDown(e) {
            if (windowEl.classList.contains('maximized')) return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function dragTouchStart(e) {
            if (windowEl.classList.contains('maximized')) return;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementTouchDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            let newTop = windowEl.offsetTop - pos2;
            let newLeft = windowEl.offsetLeft - pos1;

            // BOUNDARY CHECK: Top ceiling
            if (newTop < 0) newTop = 0; 
            
            // BOUNDARY CHECK: Bottom floor (Keep title bar accessible above taskbar)
            // 60 = 30px taskbar + 30px safe space for the title bar
            const maxTop = Math.max(0, window.innerHeight - 60); 
            if (newTop > maxTop) newTop = maxTop;

            windowEl.style.top = newTop + "px";
            windowEl.style.left = newLeft + "px";
        }

        function elementTouchDrag(e) {
            pos1 = pos3 - e.touches[0].clientX;
            pos2 = pos4 - e.touches[0].clientY;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            
            let newTop = windowEl.offsetTop - pos2;
            let newLeft = windowEl.offsetLeft - pos1;

            //bondary top
            if (newTop < 0) newTop = 0;

            //boundary bottom
            const maxTop = Math.max(0, window.innerHeight - 60); 
            if (newTop > maxTop) newTop = maxTop;

            windowEl.style.top = newTop + "px";
            windowEl.style.left = newLeft + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
        }
    }

    // ==========================================================================
    //CONTENT INJECTOR
    // ==========================================================================
    function populateWindowContent(appId, contentContainer) {
        contentContainer.innerHTML = ''; 

        if (appId === 'about') {
            contentContainer.innerHTML = `
                <div class="xp-about-layout">
                    <img src="resources/logo.png" alt="Benjamin Counter">
                    <h2>Benjamin Counter</h2>
                    <p>Welcome to my portfolio, here you will find my latest artwork and creative projects.</p>
                    <p>Created and maintained by Bryan Benjamin Counter. This platform serves as a digital portfolio for my projects and artwork.</p>
                    <p>Discord: bryancontador</p>
                    <a href="https://github.com/BryanContador" target="_blank" style="color: blue;">GitHub Profile</a> | 
                    <a href="https://x.com/BejaminCounter" target="_blank" style="color: blue;">Twitter/X</a>
                </div>
            `;
            return;
        }

        if (appId === 'fanart') {
            const gridWrapper = document.createElement('div');
            gridWrapper.className = 'xp-main-area';
            gridWrapper.innerHTML = `<h2 style="margin-bottom: 15px;">Gifts & Fanart</h2>`;

            const grid = document.createElement('div');
            grid.className = 'xp-gallery-grid';

            const imageArray = galleryData.fanart.filter(item => item.type === 'image');
            imageArray.forEach((item, index) => {
                const thumb = createThumbnailElement(item, imageArray, index);
                grid.appendChild(thumb);
            });

            gridWrapper.appendChild(grid);
            contentContainer.appendChild(gridWrapper);
            return;
        }

        const characterData = galleryData.categories.find(c => c.id === appId);
        if (characterData) {
            contentContainer.innerHTML = `
                <div class="xp-explorer-layout">
                    <div class="xp-sidebar">
                        <img src="${characterData.profileImage || characterData.thumb}" alt="${characterData.name}">
                        <h3>${characterData.name} Details</h3>
                        <p><strong>Bio:</strong><br>${characterData.bio || 'No bio available.'}</p><br>
                        <p><strong>Lore:</strong><br>${characterData.lore || 'No story available.'}</p>
                    </div>
                    <div class="xp-main-area">
                        <h2 style="margin-bottom: 15px;">${characterData.name} Gallery</h2>
                        <div class="xp-gallery-grid" id="grid-${appId}"></div>
                    </div>
                </div>
            `;

            const charGrid = contentContainer.querySelector(`#grid-${appId}`);
            const rawArray = galleryData[characterData.galleryKey];

            if (rawArray && rawArray.length > 0) {
                const imageArray = rawArray.filter(item => item.type === 'image');
                imageArray.forEach((item, index) => {
                    const thumb = createThumbnailElement(item, imageArray, index);
                    charGrid.appendChild(thumb);
                });
            } else {
                charGrid.innerHTML = "<p>No artworks found in this folder.</p>";
            }
        }
    }

    function createThumbnailElement(itemData, currentArray, currentIndex) {
        const wrapper = document.createElement('div');
        wrapper.className = 'xp-thumbnail';
        
        const img = document.createElement('img');
        img.src = itemData.thumb || 'resources/logo.png';
        img.loading = "lazy";
        
        const label = document.createElement('span');
        label.textContent = itemData.title || 'Untitled';

        wrapper.appendChild(img);
        wrapper.appendChild(label);

        // Double click launches the Picture Viewer
        wrapper.addEventListener('dblclick', () => openPictureViewer(currentArray, currentIndex));

        let lastTap = 0;
        wrapper.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                openPictureViewer(currentArray, currentIndex);
                e.preventDefault();
            }
            lastTap = currentTime;
        });

        return wrapper;
    }

    // ==========================================================================
    // WINDOWS PICTURE AND FAX VIEWER (With Zoom, Alt, and Blur Flash Fix)
    // ==========================================================================
    let viewerCurrentArray = [];
    let viewerCurrentIndex = 0;
    let viewerAltIndex = 0; // Tracks which alt image we are on
    let viewerZoomLevel = 1; // Tracks zoom multiplier
    
    // Panning variables
    let isPanning = false, panStartX, panStartY, scrollLeft, scrollTop;

    function openPictureViewer(itemArray, startIndex) {
        viewerCurrentArray = itemArray;
        viewerCurrentIndex = startIndex;
        viewerAltIndex = 0; // Reset alt on new open
        viewerZoomLevel = 1; // Reset zoom on new open
        
        const appId = 'pictureViewer';
        const title = "Windows Picture and Fax Viewer";
        const iconSrc = "resources/Menu/image.png";
        
        openWindow(appId, title, iconSrc);
        
        const windowEl = document.getElementById(`window-${appId}`);
        if(!windowEl) return;
        const contentContainer = windowEl.querySelector('.window-content');
        
        // Inject UI if it doesn't exist
        if(!contentContainer.querySelector('.xp-picture-viewer')) {
            contentContainer.innerHTML = `
                <div class="xp-picture-viewer">
                    <div class="xp-picture-info">
                        <strong class="pv-title"></strong><br>
                        <span class="pv-desc"></span>
                    </div>
                    <div class="xp-picture-display">
                        <div class="pv-loader" style="position: absolute; color: #555; font-family: Tahoma, 'Segoe UI', Geneva, sans-serif; display: none;">Loading...</div>
                        <img class="pv-img" src="" alt="">
                        <div class="sensitive-warning">Sensitive Content - Click to View</div>
                    </div>
                    <div class="xp-picture-toolbar">
                        <button class="xp-toolbar-btn pv-prev" title="Previous Image">◄</button>
                        <button class="xp-toolbar-btn pv-next" title="Next Image">►</button>
                        <div style="width: 1px; height: 20px; background: #7f9db9; margin: 0 5px;"></div>
                        <button class="xp-toolbar-btn pv-zoom-in" title="Zoom In">＋</button>
                        <button class="xp-toolbar-btn pv-zoom-out" title="Zoom Out">－</button>
                        <button class="xp-toolbar-btn pv-zoom-reset" title="Fit to Window">▢</button>
                        <div style="width: 1px; height: 20px; background: #7f9db9; margin: 0 5px;"></div>
                        <button class="xp-toolbar-btn pv-alt" title="View Alternative" style="display:none; font-size:12px; font-weight:bold;">ALT</button>
                    </div>
                </div>
            `;
            
            // --- EVENT LISTENERS ---
            const displayArea = contentContainer.querySelector('.xp-picture-display');
            const imgEl = contentContainer.querySelector('.pv-img');
            const warningBtn = contentContainer.querySelector('.sensitive-warning');

            // Navigation
            contentContainer.querySelector('.pv-prev').addEventListener('click', () => {
                viewerCurrentIndex = (viewerCurrentIndex - 1 + viewerCurrentArray.length) % viewerCurrentArray.length;
                viewerAltIndex = 0; // Reset alt source
                viewerZoomLevel = 1; // Reset zoom
                imgEl.removeAttribute('data-revealed'); // Re-hide sensitive content
                updatePictureViewerUI();
            });
            
            contentContainer.querySelector('.pv-next').addEventListener('click', () => {
                viewerCurrentIndex = (viewerCurrentIndex + 1) % viewerCurrentArray.length;
                viewerAltIndex = 0; 
                viewerZoomLevel = 1; 
                imgEl.removeAttribute('data-revealed');
                updatePictureViewerUI();
            });

            // Alt Sources
            contentContainer.querySelector('.pv-alt').addEventListener('click', () => {
                viewerAltIndex++; 
                viewerZoomLevel = 1;
                // The bounds check for this index happens inside updatePictureViewerUI
                updatePictureViewerUI(); 
            });

            // Zoom Controls
            contentContainer.querySelector('.pv-zoom-in').addEventListener('click', () => { viewerZoomLevel += 0.5; applyZoom(); });
            contentContainer.querySelector('.pv-zoom-out').addEventListener('click', () => { if(viewerZoomLevel > 0.5) viewerZoomLevel -= 0.5; applyZoom(); });
            contentContainer.querySelector('.pv-zoom-reset').addEventListener('click', () => { viewerZoomLevel = 1; applyZoom(); });

            // Sensitive Content un-blur
            warningBtn.addEventListener('click', () => {
                imgEl.classList.remove('blurred');
                warningBtn.style.display = 'none';
                imgEl.setAttribute('data-revealed', 'true');
            });

            // Panning Logic (Click and Drag when zoomed)
            imgEl.addEventListener('mousedown', (e) => {
                if (viewerZoomLevel > 1) {
                    isPanning = true;
                    panStartX = e.pageX - displayArea.offsetLeft;
                    panStartY = e.pageY - displayArea.offsetTop;
                    scrollLeft = displayArea.scrollLeft;
                    scrollTop = displayArea.scrollTop;
                }
            });
            displayArea.addEventListener('mousemove', (e) => {
                if (!isPanning) return;
                e.preventDefault();
                const x = e.pageX - displayArea.offsetLeft;
                const y = e.pageY - displayArea.offsetTop;
                const walkX = (x - panStartX);
                const walkY = (y - panStartY);
                displayArea.scrollLeft = scrollLeft - walkX;
                displayArea.scrollTop = scrollTop - walkY;
            });
            window.addEventListener('mouseup', () => isPanning = false);
        }
        
        updatePictureViewerUI();
    }

    function updatePictureViewerUI() {
        const windowEl = document.getElementById('window-pictureViewer');
        if(!windowEl) return;
        
        const item = viewerCurrentArray[viewerCurrentIndex];
        const imgEl = windowEl.querySelector('.pv-img');
        const warningBtn = windowEl.querySelector('.sensitive-warning');
        const altBtn = windowEl.querySelector('.pv-alt');
        const loaderText = windowEl.querySelector('.pv-loader');
        
        let sources = [item.highRes || item.thumb];
        let sensitivities = [item.sensitive === true];

        if (item.altSources && item.altSources.length > 0) {
            item.altSources.forEach(alt => {
                if (typeof alt === 'string') {
                    sources.push(alt);
                    sensitivities.push(item.sensitive === true); // Inherit main sensitivity
                } else if (typeof alt === 'object') {
                    sources.push(alt.src);
                    sensitivities.push(alt.sensitive !== undefined ? alt.sensitive : item.sensitive === true);
                }
            });
        }

        // Show/Hide Alt Button
        if (sources.length > 1) {
            altBtn.style.display = 'flex';
        } else {
            altBtn.style.display = 'none';
            viewerAltIndex = 0;
        }

        // Ensure Alt index wraps around correctly
        if (viewerAltIndex >= sources.length) viewerAltIndex = 0;

        const currentSrc = sources[viewerAltIndex];
        const currentSensitive = sensitivities[viewerAltIndex];

        // Update Text
        windowEl.querySelector('.pv-title').textContent = item.title || 'Untitled';
        let descText = item.description || '';
        if (sources.length > 1) descText += ` (Showing alt ${viewerAltIndex + 1}/${sources.length})`;
        windowEl.querySelector('.pv-desc').textContent = descText;
        windowEl.querySelector('.window-title').textContent = `${item.title || 'Image'} - Windows Picture and Fax Viewer`;

        // --- INSTANT IMAGE SWAP LOGIC ---
        
        //Hide image and warning instantly, show Loading text
        imgEl.style.visibility = 'hidden'; 
        imgEl.classList.remove('blurred');
        warningBtn.style.display = 'none';
        loaderText.style.display = 'block';
        loaderText.textContent = 'Loading...';
        
        applyZoom();

        imgEl.src = currentSrc;

        imgEl.onload = () => {
            loaderText.style.display = 'none';

            if (currentSensitive && !imgEl.getAttribute('data-revealed')) {
                imgEl.classList.add('blurred');
                warningBtn.style.display = 'block';
            } else {
                imgEl.classList.remove('blurred');
            }
            
            imgEl.style.visibility = 'visible';
        };

        imgEl.onerror = () => {
            loaderText.textContent = 'Error loading image.';
        };
    }

    function applyZoom() {
        const windowEl = document.getElementById('window-pictureViewer');
        if(!windowEl) return;
        const display = windowEl.querySelector('.xp-picture-display');
        const img = windowEl.querySelector('.pv-img');
        
        if (viewerZoomLevel <= 1) {
            // Reset to fit window
            img.style.width = 'auto';
            img.style.height = 'auto';
            display.classList.remove('is-zoomed');
        } else {
            // Apply Zoom
            img.style.width = `${viewerZoomLevel * 100}%`;
            img.style.height = 'auto';
            display.classList.add('is-zoomed');
        }
    }
}); 