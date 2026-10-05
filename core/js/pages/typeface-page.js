/* ==========================================================================
   Nova Genesis - Typeface Specific JavaScript
   Handles live sample text preview tester and dynamic font injection
   ========================================================================== */

function resolveAssetUrl(relativePath) {
  const root = typeof window.resolveSiteRootPath === 'function' ? window.resolveSiteRootPath() : './';
  const basePath = `${root}${relativePath.replace(/^\.\//, '').replace(/^\//, '')}`;
  return new URL(basePath, window.location.href).href;
}

async function ensureFontFaceStyles() {
  const styleId = 'nova-font-face-styles';
  if (document.getElementById(styleId)) {
    return;
  }

  const fontDefs = [
    {
      family: 'JetBrains Mono',
      file: resolveAssetUrl('assets/fonts/purchasable/JetBrainsMono-Medium.ttf'),
      format: 'truetype',
      mime: 'font/ttf',
      weight: '500'
    },
    {
      family: 'Clash Display',
      file: resolveAssetUrl('assets/fonts/purchasable/ClashDisplay-Regular.otf'),
      format: 'opentype',
      mime: 'font/otf',
      weight: '400'
    },
    {
      family: 'High Octane',
      file: resolveAssetUrl('assets/fonts/purchasable/Octane-Regular.ttf'),
      format: 'truetype',
      mime: 'font/ttf',
      weight: '400'
    }
  ];

  try {
    const styles = await Promise.all(fontDefs.map(async (font) => {
      const response = await fetch(font.file);
      if (!response.ok) return '';

      const arrayBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i += 1) {
        binary += String.fromCharCode(bytes[i]);
      }

      const dataUrl = `data:${font.mime};base64,${btoa(binary)}`;
      return `
        @font-face {
          font-family: "${font.family}";
          src: url("${dataUrl}") format("${font.format}");
          font-weight: ${font.weight};
          font-style: normal;
          font-display: swap;
        }
      `;
    }));

    const combined = styles.filter(Boolean).join('\n');
    if (!combined) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = combined;
    document.head.appendChild(style);
  } catch (error) {
    // If running in restricted local context, static @font-face in typeface-styles.css is used
  }
}

function bindTypefaceSampleInput() {
  const sampleInput = document.querySelector('#font-sample-text');
  const sampleBox = document.querySelector('.typeface-sample-box');

  if (!sampleInput || !sampleBox || sampleInput.dataset.typefaceBound === 'true') {
    return;
  }

  const updateSample = () => {
    const nextValue = sampleInput.value.trim();
    sampleBox.textContent = nextValue || 'Nova Genesis';
  };

  sampleInput.addEventListener('input', updateSample);
  sampleInput.dataset.typefaceBound = 'true';
  updateSample();
}

function initTypefacePageBehavior() {
  ensureFontFaceStyles();
  bindTypefaceSampleInput();

  if (document.body && document.body.dataset.pageType === 'product-page') {
    const observer = new MutationObserver(() => {
      bindTypefaceSampleInput();
    });
  // If on a page where product data renders dynamically, observe for font sample element insertion
  const observer = new MutationObserver(() => {
    bindTypefaceSampleInput();
  });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

document.addEventListener('DOMContentLoaded', initTypefacePageBehavior);
