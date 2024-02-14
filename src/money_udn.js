const showBox = document.getElementById('show_box');
if (showBox) {
    showBox.remove();
    console.log('Remove show box');
} else {
    console.log('show_box not found');
}
