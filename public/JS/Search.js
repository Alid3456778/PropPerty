

document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault(); 

    
    const searchInput = document.getElementById('searchInput').value.trim();

    
    if (searchInput !== '') {
        // localStorage.clear();
        localStorage.setItem('searchQuery', searchInput);
        
        window.location.href = 'fake'; 
    } else {
        console.error('Please enter a valid place name.');
    }
});








