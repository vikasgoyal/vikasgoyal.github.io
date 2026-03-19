document.addEventListener("DOMContentLoaded", function() {
    const headerTarget = document.getElementById('header') || document.getElementById('header-container');
    const footerTarget = document.getElementById('footer') || document.getElementById('footer-container');

    if (headerTarget) {
        fetch('https://vikasgoyal.github.io/header.html')
            .then(response => response.text())
            .then(data => {
                headerTarget.innerHTML = data;
            })
            .catch(error => console.error('Error loading the header:', error));
    }

    if (footerTarget) {
        fetch('https://vikasgoyal.github.io/footer.html')
            .then(response => response.text())
            .then(data => {
                footerTarget.innerHTML = data;
            })
            .catch(error => console.error('Error loading the footer:', error));
    }

    initSubscribePrompt();
});

function initSubscribePrompt() {
    if (!document.body || shouldSkipSubscribePrompt()) {
        return;
    }

    const promptState = getSubscribePromptState();
    if (promptState.suppressed) {
        return;
    }

    injectSubscribePromptStyles();

    const prompt = document.createElement('aside');
    prompt.className = 'subscribe-slidein';
    prompt.hidden = true;
    prompt.setAttribute('aria-hidden', 'true');
    prompt.setAttribute('aria-label', 'Newsletter subscription prompt');
    prompt.innerHTML = [
        '<button class="subscribe-slidein-close" type="button" aria-label="Dismiss subscribe prompt">×</button>',
        '<span class="subscribe-slidein-tag">Newsletter</span>',
        '<h2>Get new essays in your inbox.</h2>',
        '<p>Practical writing on agentic AI, startups, software architecture, and career judgment.</p>',
        '<div class="subscribe-slidein-actions">',
        '  <a class="subscribe-slidein-primary" data-subscribe-link href="https://aistartupscareer.substack.com/" target="_blank" rel="noopener noreferrer">Subscribe</a>',
        '  <button class="subscribe-slidein-secondary" type="button" data-dismiss-prompt>Not now</button>',
        '</div>'
    ].join('');

    document.body.appendChild(prompt);

    const closeButton = prompt.querySelector('.subscribe-slidein-close');
    const dismissButton = prompt.querySelector('[data-dismiss-prompt]');
    const subscribeLink = prompt.querySelector('[data-subscribe-link]');

    let shown = false;
    let timerReady = false;
    let scrollReady = false;
    let fallbackReady = false;

    const revealPrompt = function() {
        if (shown) {
            return;
        }

        shown = true;
        prompt.hidden = false;
        prompt.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(function() {
            prompt.classList.add('is-visible');
        });
        window.removeEventListener('scroll', handleScroll);
    };

    const maybeRevealPrompt = function() {
        if (shown) {
            return;
        }

        if (fallbackReady || (timerReady && scrollReady)) {
            revealPrompt();
        }
    };

    const hidePrompt = function(daysToSuppress) {
        prompt.classList.remove('is-visible');
        prompt.setAttribute('aria-hidden', 'true');
        setSubscribePromptCooldown(daysToSuppress);
        window.setTimeout(function() {
            prompt.hidden = true;
        }, 180);
    };

    const handleScroll = function() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight <= 0) {
            return;
        }

        const progress = window.scrollY / scrollHeight;
        if (progress >= 0.28) {
            scrollReady = true;
            maybeRevealPrompt();
        }
    };

    closeButton.addEventListener('click', function() {
        hidePrompt(14);
    });

    dismissButton.addEventListener('click', function() {
        hidePrompt(14);
    });

    subscribeLink.addEventListener('click', function() {
        setSubscribePromptCooldown(60);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.setTimeout(function() {
        timerReady = true;
        maybeRevealPrompt();
    }, 18000);
    window.setTimeout(function() {
        fallbackReady = true;
        maybeRevealPrompt();
    }, 45000);
}

function shouldSkipSubscribePrompt() {
    const path = (window.location.pathname || '/').toLowerCase();
    const excludedPaths = [
        '/privacy.html',
        '/google964a936629e9de51.html'
    ];

    if (excludedPaths.includes(path)) {
        return true;
    }

    return false;
}

function getSubscribePromptState() {
    const now = Date.now();
    const sessionKey = 'vg-subscribe-prompt-session';
    const storageKey = 'vg-subscribe-prompt-until';

    try {
        if (window.sessionStorage.getItem(sessionKey) === 'dismissed') {
            return { suppressed: true };
        }

        const suppressedUntil = Number(window.localStorage.getItem(storageKey) || '0');
        if (suppressedUntil > now) {
            return { suppressed: true };
        }
    } catch (error) {
        return { suppressed: false };
    }

    return { suppressed: false };
}

function setSubscribePromptCooldown(days) {
    const sessionKey = 'vg-subscribe-prompt-session';
    const storageKey = 'vg-subscribe-prompt-until';

    try {
        window.sessionStorage.setItem(sessionKey, 'dismissed');
        window.localStorage.setItem(storageKey, String(Date.now() + days * 24 * 60 * 60 * 1000));
    } catch (error) {
        // Ignore storage failures so the prompt does not break browsing.
    }
}

function injectSubscribePromptStyles() {
    if (document.getElementById('subscribe-slidein-styles')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'subscribe-slidein-styles';
    style.textContent = [
        '.subscribe-slidein {',
        '  position: fixed;',
        '  right: 20px;',
        '  bottom: 20px;',
        '  z-index: 1200;',
        '  width: min(360px, calc(100vw - 28px));',
        '  padding: 18px 18px 16px;',
        '  border: 1px solid rgba(18, 18, 18, 0.12);',
        '  border-radius: 24px;',
        '  background: rgba(255, 255, 255, 0.96);',
        '  box-shadow: 0 22px 48px rgba(18, 18, 18, 0.18);',
        '  backdrop-filter: blur(10px);',
        '  transform: translateY(18px);',
        '  opacity: 0;',
        '  transition: opacity 0.18s ease, transform 0.18s ease;',
        '}',
        '.subscribe-slidein.is-visible {',
        '  opacity: 1;',
        '  transform: translateY(0);',
        '}',
        '.subscribe-slidein-tag {',
        '  display: inline-flex;',
        '  padding: 6px 10px;',
        '  border-radius: 999px;',
        '  background: rgba(23, 60, 115, 0.08);',
        '  color: #173c73;',
        '  font-size: 0.75rem;',
        '  font-weight: 800;',
        '  letter-spacing: 0.08em;',
        '  text-transform: uppercase;',
        '}',
        '.subscribe-slidein h2 {',
        '  margin: 12px 0 8px;',
        '  font-size: 1.2rem;',
        '  line-height: 1.25;',
        '  color: #121212;',
        '}',
        '.subscribe-slidein p {',
        '  margin: 0;',
        '  color: #505050;',
        '  line-height: 1.65;',
        '}',
        '.subscribe-slidein-actions {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 10px;',
        '  margin-top: 16px;',
        '}',
        '.subscribe-slidein-primary,',
        '.subscribe-slidein-secondary {',
        '  display: inline-flex;',
        '  align-items: center;',
        '  justify-content: center;',
        '  min-height: 42px;',
        '  padding: 0 16px;',
        '  border-radius: 999px;',
        '  font-weight: 700;',
        '  text-decoration: none;',
        '  cursor: pointer;',
        '}',
        '.subscribe-slidein-primary {',
        '  border: none;',
        '  background: linear-gradient(135deg, #173c73 0%, #0f5d44 100%);',
        '  color: #ffffff;',
        '  box-shadow: 0 12px 22px rgba(23, 60, 115, 0.20);',
        '}',
        '.subscribe-slidein-secondary {',
        '  border: 1px solid rgba(18, 18, 18, 0.10);',
        '  background: rgba(255, 255, 255, 0.82);',
        '  color: #173c73;',
        '}',
        '.subscribe-slidein-close {',
        '  position: absolute;',
        '  top: 10px;',
        '  right: 10px;',
        '  width: 34px;',
        '  height: 34px;',
        '  border: none;',
        '  border-radius: 999px;',
        '  background: rgba(18, 18, 18, 0.06);',
        '  color: #505050;',
        '  font-size: 1.15rem;',
        '  cursor: pointer;',
        '}',
        '.subscribe-slidein-close:hover,',
        '.subscribe-slidein-close:focus,',
        '.subscribe-slidein-primary:hover,',
        '.subscribe-slidein-primary:focus,',
        '.subscribe-slidein-secondary:hover,',
        '.subscribe-slidein-secondary:focus {',
        '  transform: translateY(-1px);',
        '}',
        '@media (max-width: 720px) {',
        '  .subscribe-slidein {',
        '    right: 12px;',
        '    left: 12px;',
        '    bottom: 12px;',
        '    width: auto;',
        '    border-radius: 20px;',
        '  }',
        '}',
        '@media (prefers-reduced-motion: reduce) {',
        '  .subscribe-slidein {',
        '    transition: none;',
        '  }',
        '}',
        ''
    ].join('\n');

    document.head.appendChild(style);
}