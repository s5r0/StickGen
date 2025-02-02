* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
}

body {
    background: #f5f5f5;
    text-align: center;
}

header {
    background: #333;
    color: white;
    padding: 2rem;
}

.social-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
}

.social-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.social-card:hover {
    transform: translateY(-5px);
}

.social-card i {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.fa-tiktok { color: #000; }
.fa-instagram { color: #E1306C; }
.fa-youtube { color: #FF0000; }
.fa-twitter { color: #1DA1F2; }

.btn {
    display: inline-block;
    padding: 0.8rem 1.5rem;
    background: #333;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    margin-top: 1rem;
    transition: background 0.3s;
}

.btn:hover {
    background: #555;
}
