setTimeout(() => {
    const adCover = document.getElementById('desktop-ad-cover');
    if (adCover) {
        adCover.remove();
        console.log('Remove desktop-ad-cover');
    } else {
        console.log('desktop-ad-cover not found');
    }
}, 5000);
