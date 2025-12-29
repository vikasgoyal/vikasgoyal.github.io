// Blog index page functionality
document.addEventListener("DOMContentLoaded", function() {
    const blogPostsContainer = document.getElementById('blog-posts');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!blogPostsContainer) return;

    const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? '' 
        : 'https://vikasgoyal.github.io';
    
    let allPosts = [];
    let currentFilter = 'all';

    // Load posts from JSON
    fetch(`${baseUrl}/latest-posts.json`)
        .then(response => response.json())
        .then(data => {
            allPosts = data.posts;
            renderPosts(allPosts);
            setupFilters();
        })
        .catch(error => {
            console.error('Error loading blog posts:', error);
            blogPostsContainer.innerHTML = '<div class="no-posts">Unable to load blog posts. Please try again later.</div>';
        });

    // Render posts
    function renderPosts(posts) {
        if (posts.length === 0) {
            blogPostsContainer.innerHTML = '<div class="no-posts">No posts found in this category.</div>';
            updatePostCount(0, currentFilter);
            return;
        }

        // Sort by date (most recent first)
        const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        updatePostCount(sortedPosts.length, currentFilter);
        
        let html = '';
        sortedPosts.forEach(post => {
            const date = new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            const excerpt = post.excerpt || 'Click to read more...';
            const readTime = post.readTime ? `${post.readTime} min read` : '';
            const tags = post.tags || [];

            html += `
                <article class="blog-post">
                    <div class="blog-post-header">
                        <div>
                            <h2><a href="${post.url}">${post.title}</a></h2>
                            <div class="blog-post-meta">
                                <span>📅 ${date}</span>
                                ${readTime ? `<span>⏱️ ${readTime}</span>` : ''}
                            </div>
                        </div>
                        <span class="blog-post-category">${post.category}</span>
                    </div>
                    <p class="blog-post-excerpt">${excerpt}</p>
                    ${tags.length > 0 ? `
                        <div class="blog-post-tags">
                            ${tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    <a href="${post.url}" class="read-more">Read more →</a>
                </article>
            `;
        });
        
        blogPostsContainer.innerHTML = html;
    }

    // Update post count
    function updatePostCount(count, filter) {
        const postCountEl = document.getElementById('post-count');
        if (postCountEl) {
            const filterText = filter === 'all' ? 'All Posts' : filter;
            const plural = count === 1 ? 'post' : 'posts';
            postCountEl.textContent = `${count} ${plural} in ${filterText}`;
        }
    }

    // Setup filter buttons
    function setupFilters() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter posts
                const category = this.dataset.category;
                currentFilter = category;
                
                if (category === 'all') {
                    renderPosts(allPosts);
                } else {
                    const filtered = allPosts.filter(post => post.category === category);
                    renderPosts(filtered);
                }
            });
        });
    }
});
