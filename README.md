# Benjamin Counter - Art Portfolio

This repository contains the source code and assets for my personal website, hosted via GitHub Pages.

## About This Site
This website is developed and maintained exclusively by **Bryan Benjamin Counter**. It serves as a personal portfolio to showcase my work, art, and creative projects, while also functioning as a sandbox for web development, design experimentation, and hands-on coding.

Please note that all content is subject to change or removal at any time without prior notice.

---

## Features
* **Dual-Interface System:** Contains a modern, glassmorphic UI and a fully functional Windows XP Desktop simulation (`WinXP.html`).
* **Custom Image Modal:** A from-scratch gallery viewer that supports zooming, panning, and seamlessly switching between alternative versions of an image.
* **Content Warning System:** Built-in blurring and consent checks for sensitive artwork.
* **API Integrations:** Utilizes the GitHub API to display the latest repository commit and the Open-Meteo API for real-time local weather.
* **Theming & Layout:** CSS-variable powered Light/Dark mode and dynamic grid layouts (OG, Large, Small) saved via `localStorage`.

## Architecture & Tech Stack
This project is built using **Vanilla HTML5, CSS3, and JavaScript**. No heavy frameworks (like React or Vue) or CSS libraries (like Tailwind or Bootstrap) were used. 

The site operates on a "Headless CMS" style approach using a single JavaScript file:
* **`data.js`**: Acts as the central database. It stores all metadata (titles, descriptions, lore, file paths, alternative versions, etc.).
* **`script.js`**: The controller for the modern web UI. It reads `data.js` and dynamically generates the HTML grids, modals, and character pages.
* **`scriptXP.js`**: The controller for the Windows XP simulation. It reads the *exact same* `data.js` file but renders it into Draggable Windows, Desktop Icons, and Start Menu items.

---

## Developer Guide: Updating Content (`data.js`)

To add new artwork or characters, you only need to modify `data.js`. The JavaScript will automatically render it across both the modern site and the WinXP OS.

### 1. Adding a Standard Image
Inside an array (like `fanart` or `drawings`), add an object with this structure:

```javascript
{
    type: "image",
    thumb: "path/to/thumb.jpg",
    highRes: "path/to/fullsize.jpg",
    title: "Artwork Title",
    description: "Your description here.\nLine breaks are supported.",
    status: "finished", // "finished" or "sketch" (used for filtering)
    date: "2024-05-12"  // YYYY-MM-DD (used for sorting)
}
```

### 2. Adding Alternative / Sensitive Images
If an image has alternative versions (like a sketch version or a sensitive version), use the `altSources` array and the `sensitive` flag:

```javascript
{
    type: "image",
    thumb: "path/to/thumb.jpg",
    highRes: "path/to/fullsize.jpg",
    title: "Title",
    description: "Description",
    sensitive: false, // Applies to the main image
    altSources: [
        "path/to/alt_image_1.jpg", // Inherits main sensitivity (false)
        {
            src: "path/to/nsfw_alt.jpg",
            sensitive: true // Specific to this alternative image only
        }
    ]
}
```

### 3. Adding a New Category / Character
To add a new character profile or project folder, add an object to the `categories` array:

```javascript
{
    type: "category",
    id: "new_character_id",
    name: "Character Name",
    thumb: "path/to/category_thumb.jpg",
    profileImage: "path/to/large_profile_pic.jpg", // Used on character.html
    galleryKey: "new_character_art", // Must match the array name holding their art
    bio: "Character bio goes here...",
    lore: "Character lore goes here...",
    isProject: false // Set to true to hide the bio/lore UI (e.g., for 3D Renders)
}
```

---

## Developer Guide: Easter Eggs & Secret Codes

The site features a "User String" input (and a WinXP "Run" command) that takes secret codes. To prevent users from reading the source code to find the secrets, the codes are hashed using SHA-256.

### How to add a new secret code:

1. Open your browser's Developer Console (F12).
2. Paste and run this temporary function to generate a hash for your new secret word:

   ```javascript
   async function getHash(text) {
     const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
     console.log(Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));
   }
   getHash("my_secret_password"); // Replace with your secret word
   ```

3. Copy the resulting hash.
4. In `script.js` and `scriptXP.js`, locate the `SECRET_DESTINATIONS` object and add your hash and destination URL:

   ```javascript
   const SECRET_DESTINATIONS = {
       // ...existing codes
       "your_new_hash_here": "[https://example.com/surprise](https://example.com/surprise)"
   };
   ```

---

## License & Usage

Because this repository contains both structural web code and original artistic content, it operates under a dual-license structure to keep the code open while protecting my art:

### The Art & Content: All Rights Reserved
All artwork, illustrations, photographs, graphics, and written content hosted in this repository are **Copyright © 2026 Benjamin Counter. All rights reserved.** 
* **Usage Rules:** You **may not** reproduce, distribute, display, or use my artwork for commercial or personal purposes without explicit written permission.
* **If you fork this repository or copy the code:** You must remove and replace all of my personal artwork, images, and specific portfolio text with your own assets.
* **Typography:** This project uses the font "ND Logos," which is used under a commercial license. The font files are not open-source and may not be extracted, downloaded, or used by third parties.

### The Code: Open Source
The underlying source code (HTML, CSS, JavaScript, etc.) used to build the structure and layout of this website is completely free to use. You are welcome to copy, modify, adapt, and use the code for your own projects without any restrictions.

## Contact
If you have feedback, suggestions for expanding the site, or would like to reach out for any other reason, feel free to do so:

* **Email:** bryan.virtuales@gmail.com
* **Discord:** bryancontador - *(Currently inactive - please use email)*
