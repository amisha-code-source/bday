# 📸 Image Setup Instructions

## Required Images

To make the gallery and surprise popup work properly, you need to add these images to your project folder:

### Gallery Images (Solo Photos)
- `mom2.jpg` - First solo mom photo for gallery
- `mom5.jpg` - Second solo mom photo for gallery  
- `mom6.jpg` - Third solo mom photo for gallery

### Surprise Popup Images
- `mom4.jpg` - Additional photo for surprise popup

### Image Requirements
- **Format**: JPG (recommended) or PNG
- **Size**: Any size (will be automatically resized)
- **Aspect Ratio**: Square images work best (1:1 ratio)
- **Quality**: High resolution recommended for best display

### How to Add Images

1. **Save your images** with the exact names listed above
2. **Place them** in the same folder as `index.html`
3. **Make sure** the file extensions are exactly `.jpg` (not `.jpeg`)

### File Structure
```
birthday-website/
├── index.html
├── styles.css
├── script.js
├── database.js
├── mom2.jpg      ← Add your solo mom images here
├── mom4.jpg      ← Add your surprise popup image here
├── mom5.jpg      ← Add your solo mom images here
├── mom6.jpg      ← Add your solo mom images here
└── README.md
```

### What Happens Without Images

If the images are missing:
- Gallery will show empty placeholder boxes
- Surprise popup will show broken image icons
- The website will still function normally
- No errors will occur

### Testing Your Images

1. Open `index.html` in your browser
2. Click on "Gallery" in the navigation
3. You should see your mom's photos in a beautiful grid
4. Click on "Surprise" and then "Open Surprise"
5. You should see a popup with your images that you can navigate through

### Troubleshooting

**Images not showing?**
- Check that file names are exactly `mom1.jpg`, `mom2.jpg`, etc.
- Make sure images are in the same folder as `index.html`
- Check that file extensions are `.jpg` (not `.jpeg`)

**Images too large/small?**
- The website automatically resizes images to fit
- Square images (1:1 ratio) look best
- High resolution images will be scaled down automatically

**Want to use different image names?**
- Edit the `surpriseImages` array in `script.js`
- Change the `src` attributes in the gallery section of `index.html`

## Enjoy Your Mom's Birthday Website! 🎉
