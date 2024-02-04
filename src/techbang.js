document.addEventListener('DOMContentLoaded', function () {
    const idleContainer = document.getElementById('idle-container');
    if (idleContainer) {
        idleContainer.style.display = 'none';
        console.log('hide idle-container');
    } else {
        console.log('idle-container not found');
    }
});
