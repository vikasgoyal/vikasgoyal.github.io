// Load and display latest posts in sidebar
document.addEventListener("DOMContentLoaded", function() {
    const latestPostsContainer = document.getElementById('latest-posts');
    if (!latestPostsContainer) return;

    const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? '' 
        : 'https://vikasgoyal.github.io';
    
    fetch(`${baseUrl}/latest-posts.json`)
        .then(response => response.json())
        .then(data => {
            // Sort by date (most recent first)
            const sortedPosts = data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Take only top 3
            const latestThree = sortedPosts.slice(0, 3);
            
            // Generate HTML
            let html = '<h3 style="color: #ffffff; font-size: 1em; margin-bottom: 0.8em; border-bottom: 1px solid #333; padding-bottom: 0.5em;">Latest Posts</h3>';
            html += '<ul style="list-style: none; padding: 0; margin: 0;">';
            
            latestThree.forEach(post => {
                const date = new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                html += `
                    <li style="margin-bottom: 1em; padding-bottom: 0.8em; border-bottom: 1px solid #222;">
                        <a href="${post.url}" style="color: #4da6ff; font-size: 0.85em; line-height: 1.4; text-decoration: none; display: block;">
                            ${post.title}
                        </a>
                        <span style="color: #888; font-size: 0.75em; margin-top: 0.3em; display: block;">${date} • ${post.category}</span>
                    </li>
                `;
            });
            
            html += '</ul>';
            latestPostsContainer.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading latest posts:', error);
            latestPostsContainer.innerHTML = '<p style="color: #888; font-size: 0.8em;">Unable to load latest posts</p>';
        });
});
