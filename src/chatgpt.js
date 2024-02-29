let ptr = 0;

function init0() {
    if (init1()) {
        main();
    } else {
        setTimeout(init1, 500);
    }
}

function init1() {
    var div = document.querySelector('div[data-testid="conversation-turn-2"]');
    if (div) {
        ptr = div.parentElement.childElementCount;
        console.log(`Set ptr = ${ptr}`);
        return true;
    }
    return false;
}

function main() {
    var div = document.querySelector(
        `div[data-testid="conversation-turn-${ptr}"]`,
    );
    if (div) {
        var end = div.querySelectorAll('div.self-end')[0];
        var ready = end.classList.contains('visible');
        if (ready) {
            div.style.display = 'block';
            ptr += 2;
        } else {
            div.style.display = 'none';
        }
    }
    setTimeout(main, 500);
}

setTimeout(init0, 1000);
