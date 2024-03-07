let ptr = 0;

function init0() {
    if (init1()) {
        main();
    } else {
        setTimeout(init0, 500);
    }
}

function init1() {
    var div = document.querySelector('div[data-testid="conversation-turn-2"]');
    if (div) {
        ptr = div.parentElement.childElementCount;
        if (ptr % 2 === 0) {
            ptr++;
        }
        console.log(`init1: ptr = ${ptr}`);
        return true;
    }
    return false;
}

function getConversationElement(idx) {
    return document.querySelector(
        `div[data-testid="conversation-turn-${idx}"]`,
    );
}

function main() {
    var div = getConversationElement(ptr);
    if (div) {
        var end = div.querySelectorAll('div.self-end')[0];
        var ready = end.classList.contains('visible');
        if (ready) {
            div.style.display = 'block';
            ptr += 2;
            console.log(`main: ptr = ${ptr}`);
        } else {
            div.style.display = 'none';
        }
    } else if (!getConversationElement(ptr - 2)) {
        // May change to new converation
        console.log('Change to new converation');
        init0();
        return;
    }
    setTimeout(main, 500);
}

setTimeout(init0, 1000);
