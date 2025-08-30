// Global variables
let chatData = [];
let currentUser = 'Salih Güngör';
let otherUser = 'Orhan İlhan';
let chatParticipants = new Set();

// DOM elements
const chatMessages = document.getElementById('chatMessages');
const chatFileInput = document.getElementById('chatFile');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load default chat if available
    loadDefaultChat();
    
    // File upload listener
    chatFileInput.addEventListener('change', handleFileUpload);
    
    // Modal close listeners
    document.querySelector('.close').addEventListener('click', closeModal);
    imageModal.addEventListener('click', function(e) {
        if (e.target === imageModal) {
            closeModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// Load default chat from _chat.txt
async function loadDefaultChat() {
    try {
        const response = await fetch('_chat.txt');
        if (response.ok) {
            const text = await response.text();
            parseChatFile(text);
            displayMessages();
        }
    } catch (error) {
        console.log('Default chat file not found, waiting for user upload');
    }
}

// Handle file upload
function handleFileUpload(event) {
    const files = event.target.files;
    
    if (files.length === 0) return;
    
    console.log('Uploading', files.length, 'files...');
    
    // Clear previous virtual images
    window.virtualImages = {};
    
    let chatFile = null;
    const imageFiles = [];
    
    // Separate chat file and media files
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);
        
        if (file.name === '_chat.txt' || file.name.endsWith('.txt')) {
            chatFile = file;
            console.log('Found chat file:', file.name);
        } else if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/') || 
                   file.name.match(/\.(jpg|jpeg|png|gif|mp4|avi|mov|pdf|doc|docx|txt|zip|rar|vcf|opus|mp3|wav|m4a|ogg|aac)$/i)) {
            imageFiles.push(file);
            console.log('Found media file:', file.name);
        } else {
            console.log('Unknown file type:', file.name);
        }
    }
    
    console.log('Chat file:', chatFile ? chatFile.name : 'None');
    console.log('Image files:', imageFiles.map(f => f.name));
    
    // Process media files first
    if (imageFiles.length > 0) {
        console.log('Processing', imageFiles.length, 'media files...');
        processImageFiles(imageFiles);
    } else {
        console.log('No media files found');
    }
    
    // Process chat file
    if (chatFile) {
        console.log('Reading chat file...');
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('Chat file loaded, parsing...');
            parseChatFile(e.target.result);
            displayMessages();
        };
        reader.onerror = function(e) {
            console.error('Error reading chat file:', e);
        };
        reader.readAsText(chatFile);
    } else {
        alert('Lütfen _chat.txt dosyasını da seçin');
    }
}

// Parse WhatsApp chat file
function parseChatFile(text) {
    const lines = text.split('\n');
    chatData = [];
    chatParticipants.clear();
    
    let currentMessage = null;
    const messageRegex = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}\s+\d{1,2}:\d{2}:\d{2})\]\s+(.+?):\s*(.*)/;
    
    // Pre-allocate array for better performance
    const messages = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Check if this line starts a new message
        const messageMatch = line.match(messageRegex);
        
        if (messageMatch) {
            // Save previous message if exists
            if (currentMessage) {
                messages.push(currentMessage);
            }
            
            // Start new message
            const [, timestamp, sender, content] = messageMatch;
            const senderName = sender.trim();
            
            // Add sender to participants
            chatParticipants.add(senderName);
            
            currentMessage = {
                timestamp: parseTimestamp(timestamp),
                sender: senderName,
                content: content.trim(),
                type: getMessageType(content)
            };
        } else if (currentMessage) {
            // This line is continuation of current message
            currentMessage.content += '\n' + line;
            // Update message type based on new content
            currentMessage.type = getMessageType(currentMessage.content);
        }
    }
    
    // Add the last message
    if (currentMessage) {
        messages.push(currentMessage);
    }
    
    // Sort messages by timestamp
    chatData = messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // Update header with participants
    updateChatHeader();
}



// Parse timestamp
function parseTimestamp(timestamp) {
    const [datePart, timePart] = timestamp.split(' ');
    const [month, day, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');
    
    // Handle 2-digit year
    let fullYear = year;
    if (year.length === 2) {
        fullYear = '20' + year;
    }
    
    // Validate date components
    const monthNum = parseInt(month) - 1; // JavaScript months are 0-based
    const dayNum = parseInt(day);
    const yearNum = parseInt(fullYear);
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);
    const secondNum = parseInt(second);
    
    // Check if date is valid
    if (isNaN(monthNum) || isNaN(dayNum) || isNaN(yearNum) || 
        isNaN(hourNum) || isNaN(minuteNum) || isNaN(secondNum)) {
        console.warn('Invalid timestamp:', timestamp);
        return new Date(); // Return current date as fallback
    }
    
    return new Date(yearNum, monthNum, dayNum, hourNum, minuteNum, secondNum);
}

// Determine message type
function getMessageType(content) {
    if (content.includes('<') && content.includes('.jpg eklendi>')) {
        return 'image';
    } else if (content.includes('<') && content.includes('.mp4 eklendi>')) {
        return 'video';
    } else if (content.includes('<') && content.includes('.pdf eklendi>')) {
        return 'document';
    } else if (content.includes('<') && content.includes('.doc eklendi>')) {
        return 'document';
    } else if (content.includes('<') && content.includes('.docx eklendi>')) {
        return 'document';
    } else if (content.includes('<') && content.includes('.txt eklendi>')) {
        return 'document';
    } else if (content.includes('<') && content.includes('.zip eklendi>')) {
        return 'document';
    } else if (content.includes('<') && content.includes('.rar eklendi>')) {
        return 'document';
    } else if (content.includes('<') && content.includes('.vcf eklendi>')) {
        return 'contact';
    } else if (content.includes('<') && content.includes('.opus eklendi>')) {
        return 'audio';
    } else if (content.includes('<') && content.includes('.mp3 eklendi>')) {
        return 'audio';
    } else if (content.includes('<') && content.includes('.wav eklendi>')) {
        return 'audio';
    } else if (content.includes('<') && content.includes('.m4a eklendi>')) {
        return 'audio';
    } else if (content.includes('<') && content.includes('.ogg eklendi>')) {
        return 'audio';
    } else if (content.includes('<') && content.includes('.aac eklendi>')) {
        return 'audio';
    } else if (content.includes('Konum: https://maps.google.com')) {
        return 'location';
    } else if (content.includes('Cevapsız görüntülü arama')) {
        return 'missed_call';
    } else if (content.includes('https://')) {
        return 'link';
    } else {
        return 'text';
    }
}



// Display messages
function displayMessages() {
    if (chatData.length === 0) {
        chatMessages.innerHTML = `
            <div class="loading">
                <i class="fas fa-comments"></i>
                <p>Henüz mesaj yok. Sohbet dosyası yükleyin.</p>
            </div>
        `;
        return;
    }
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    chatData.forEach(message => {
        const messageElement = createMessageElement(message);
        fragment.appendChild(messageElement);
    });
    
    // Clear and append all at once
    chatMessages.innerHTML = '';
    chatMessages.appendChild(fragment);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Create message element
function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    const isSent = message.sender === currentUser;
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
    
    const timeString = formatTime(message.timestamp);
    
    switch (message.type) {
        case 'image':
            const imagePath = getMediaPath(message.content);
            console.log('Creating image element for:', imagePath);
            messageDiv.innerHTML = `
                <div class="message-content">
                    <img src="${imagePath}" 
                         alt="Resim" 
                         class="message-image"
                         onclick="openImageModal('${imagePath}')"
                         onerror="console.error('Image failed to load:', '${imagePath}'); this.style.display='none'; this.nextElementSibling.style.display='block';"
                         onload="console.log('Image loaded successfully:', '${imagePath}')">
                    <div class="image-error" style="display: none; padding: 20px; text-align: center; color: #6c757d;">
                        <i class="fas fa-image"></i>
                        <div>Resim yüklenemedi: ${imagePath}</div>
                        <small>Dosya yolu: ${imagePath}</small>
                        <br><small>Virtual images: ${window.virtualImages ? Object.keys(window.virtualImages).join(', ') : 'None'}</small>
                    </div>
                </div>
                <div class="message-time">${timeString}</div>
            `;
            break;
            
        case 'video':
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="media-message video">
                        <i class="fas fa-video"></i>
                        <span>Video dosyası</span>
                        <div class="file-name">${getMediaPath(message.content)}</div>
                    </div>
                </div>
                <div class="message-time">${timeString}</div>
            `;
            break;
            
        case 'document':
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="media-message document">
                        <i class="fas fa-file"></i>
                        <span>Dosya</span>
                        <div class="file-name">${getMediaPath(message.content)}</div>
                    </div>
                </div>
                <div class="message-time">${timeString}</div>
            `;
            break;
            
        case 'contact':
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="media-message contact">
                        <i class="fas fa-address-card"></i>
                        <span>Kişi kartı</span>
                        <div class="file-name">${getMediaPath(message.content)}</div>
                    </div>
                </div>
                <div class="message-time">${timeString}</div>
            `;
            break;
            
        case 'audio':
            const audioPath = getMediaPath(message.content);
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="media-message audio">
                        <i class="fas fa-microphone"></i>
                        <span>Ses mesajı</span>
                        <div class="file-name">${audioPath}</div>
                        <audio controls style="width: 100%; margin-top: 8px;">
                            <source src="${audioPath}" type="audio/${getAudioType(audioPath)}">
                            Tarayıcınız ses dosyasını desteklemiyor.
                        </audio>
                    </div>
                </div>
                <div class="message-time">${timeString}</div>
            `;
            break;
            
        case 'location':
            const locationUrl = extractLocationUrl(message.content);
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="location-message" onclick="openLocation('${locationUrl}')">
                        <i class="fas fa-map-marker-alt location-icon"></i>
                        <span class="location-text">Konum paylaşıldı</span>
                    </div>
                </div>
                <div class="message-time">${timeString}</div>
            `;
            break;
            

            
        case 'missed_call':
            messageDiv.innerHTML = `
                <div class="message-content">
                    <i class="fas fa-phone-slash"></i>
                    ${message.content}
                </div>
                <div class="message-time">${timeString}</div>
            `;
            break;
            
        case 'link':
            const linkUrl = extractLink(message.content);
            messageDiv.innerHTML = `
                <div class="message-content">
                    <a href="${linkUrl}" target="_blank" style="color: inherit; text-decoration: underline;">
                        ${message.content}
                    </a>
                </div>
                <div class="message-time">${timeString}</div>
            `;
            break;
            
        default:
            messageDiv.innerHTML = `
                <div class="message-content">${escapeHtml(message.content).replace(/\n/g, '<br>')}</div>
                <div class="message-time">${timeString}</div>
            `;
    }
    
    return messageDiv;
}



// Process image files and create virtual URLs
function processImageFiles(imageFiles) {
    window.virtualImages = {};
    
    console.log('Processing', imageFiles.length, 'image files...');
    
    imageFiles.forEach(file => {
        const fileName = file.name;
        const virtualUrl = URL.createObjectURL(file);
        window.virtualImages[fileName] = virtualUrl;
        console.log('Processed image:', fileName, '->', virtualUrl);
    });
    
    console.log('Available virtual images:', Object.keys(window.virtualImages));
}

// Get media path from content
function getMediaPath(content) {
    const match = content.match(/<(.+\.(jpg|jpeg|png|gif|mp4|avi|mov|pdf|doc|docx|txt|zip|rar|vcf|opus|mp3|wav|m4a|ogg|aac))\s+eklendi>/i);
    if (match) {
        const fileName = match[1];
        console.log('Looking for media:', fileName);
        
        // Check if we have a virtual URL for this file
        if (window.virtualImages && window.virtualImages[fileName]) {
            console.log('Found virtual URL for:', fileName);
            return window.virtualImages[fileName];
        }
        
        console.log('No virtual URL found for:', fileName);
        console.log('Available media:', window.virtualImages ? Object.keys(window.virtualImages) : 'None');
        return fileName; // Fallback to direct file path
    }
    return '';
}

// Get audio type from file extension
function getAudioType(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    const audioTypes = {
        'opus': 'opus',
        'mp3': 'mpeg',
        'wav': 'wav',
        'm4a': 'mp4',
        'ogg': 'ogg',
        'aac': 'aac'
    };
    return audioTypes[extension] || 'mpeg';
}

// Extract location URL
function extractLocationUrl(content) {
    const match = content.match(/Konum:\s*(https:\/\/maps\.google\.com\/\?q=[^\s]+)/);
    return match ? match[1] : '';
}

// Extract link URL
function extractLink(content) {
    const match = content.match(/(https:\/\/[^\s]+)/);
    return match ? match[1] : '';
}

// Format time
function formatTime(date) {
    return date.toLocaleString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}



// Open image modal
function openImageModal(imageSrc) {
    modalImage.src = imageSrc;
    imageModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    imageModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Open location in new tab
function openLocation(url) {
    window.open(url, '_blank');
}

// Toggle dark theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const icon = document.querySelector('.action-btn i');
    if (document.body.classList.contains('dark-theme')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Export chat
function exportChat() {
    if (chatData.length === 0) {
        alert('Dışa aktarılacak mesaj bulunamadı');
        return;
    }
    
    let exportText = `WhatsApp Sohbeti - ${currentUser} & ${otherUser}\n`;
    exportText += `Dışa aktarma tarihi: ${new Date().toLocaleString('tr-TR')}\n\n`;
    
    chatData.forEach(message => {
        const dateStr = message.timestamp.toLocaleDateString('tr-TR');
        const timeStr = message.timestamp.toLocaleTimeString('tr-TR');
        exportText += `[${dateStr} ${timeStr}] ${message.sender}: ${message.content}\n`;
    });
    
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whatsapp-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}



// Update chat header with participants
function updateChatHeader() {
    const participants = Array.from(chatParticipants);
    if (participants.length > 0) {
        const headerTitle = document.querySelector('.chat-details h3');
        if (headerTitle) {
            if (participants.length === 1) {
                headerTitle.textContent = participants[0];
            } else if (participants.length === 2) {
                headerTitle.textContent = `${participants[0]} & ${participants[1]}`;
            } else {
                headerTitle.textContent = `${participants[0]} & ${participants.length - 1} kişi`;
            }
        }
    }
}

// Auto-load chat on page load
window.addEventListener('load', function() {
    // Try to load the default chat file
    loadDefaultChat();
});
