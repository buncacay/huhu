// Thông tin người dùng (có thể lấy từ API hoặc localStorage)
const user = {
    name: 'user name',
    avatar: 'avatar.jpg' // Đường dẫn đến ảnh đại diện
};

// Load posts from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadPosts);

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.forEach(post => createPostElement(post.content, post.user, post.attachments));
}

function addPost() {
    const postContent = document.getElementById('postContent').value;
    const attachments = getAttachments();

    if (postContent.trim() === '' && attachments.length === 0) {
        alert('Please write something or add an attachment before posting.');
        return;
    }

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const newPost = {
        content: postContent,
        user: user,
        attachments: attachments
    };
    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    // Chuyển hướng đến trang event.html
    window.location.href = 'event.html';

    // Clear the textarea and attachments
    document.getElementById('postContent').value = '';
    clearAttachments();
}

function getAttachments() {
    const attachments = [];
    const image = document.getElementById('imagePreview');
    if (image) attachments.push({ type: 'image', src: image.src });
    const video = document.getElementById('videoPreview');
    if (video) attachments.push({ type: 'video', src: video.src });
    return attachments;
}

function clearAttachments() {
    document.getElementById('imagePreview')?.remove();
    document.getElementById('videoPreview')?.remove();
}

function createPostElement(content, userInfo, attachments) {
    const postsContainer = document.getElementById('posts');

    const post = document.createElement('div');
    post.classList.add('post');
    post.innerHTML = `
        <div class="user-info">
            <img src="${userInfo.avatar}" alt="User Avatar" class="avatar">
            <span class="user-name">${userInfo.name}</span>
        </div>
        <p>${content}</p>
        <div class="attachments">
            ${attachments.map(att => {
                if (att.type === 'image') {
                    return `<img src="${att.src}" alt="Image" />`;
                } else if (att.type === 'video') {
                    return `<video controls src="${att.src}"></video>`;
                }
                return '';
            }).join('')}
        </div>
        <div class="post-actions">
            <button onclick="likePost(this)">Like</button>
            <span class="likes">0 Likes</span>
            <button onclick="editPost(this)">Edit</button>
            <button onclick="deletePost(this)">Delete</button>
        </div>
    `;

    postsContainer.prepend(post);
}

function likePost(button) {
    const likes = button.nextElementSibling;
    let count = parseInt(likes.innerText.split(' ')[0]);
    likes.innerText = `${++count} Likes`;
}

function editPost(button) {
    const post = button.closest('.post');
    const content = post.querySelector('p').innerText;
    const newContent = prompt('Edit your post:', content);
    if (newContent) {
        post.querySelector('p').innerText = newContent;

        // Update localStorage
        updateLocalStorage();
    }
}

function deletePost(button) {
    const post = button.closest('.post');
    post.remove();

    // Update localStorage
    updateLocalStorage();
}

function updateLocalStorage() {
    const posts = Array.from(document.querySelectorAll('.post')).map(post => {
        const content = post.querySelector('p').innerText;
        const userName = post.querySelector('.user-name').innerText;
        const userAvatar = post.querySelector('.avatar').src;
        const attachments = Array.from(post.querySelectorAll('.attachments img, .attachments video')).map(elm => {
            return { type: elm.tagName.toLowerCase(), src: elm.src };
        });
        return {
            content,
            user: { name: userName, avatar: userAvatar },
            attachments
        };
    });
    localStorage.setItem('posts', JSON.stringify(posts));
}

function attachImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const img = document.createElement('img');
            img.src = reader.result;
            img.id = 'imagePreview';
            document.querySelector('.post-box').appendChild(img);
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

function attachEmotion() {
    // Here, you can add logic to insert emotion (e.g., emoji picker).
    alert("Emotion picker will be added here.");
}

function attachGIF() {
    // Add GIF functionality, e.g., using a GIF API.
    alert("GIF picker will be added here.");
}

function attachVideo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = () => {
        const file = input.files[0];
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.id = 'videoPreview';
        video.controls = true;
        document.querySelector('.post-box').appendChild(video);
    };
    input.click();
}
