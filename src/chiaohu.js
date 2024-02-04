const array = [
    'https://mychiaohu.benesse.com.tw/ericDvd/01/012212',
    'https://mychiaohu.benesse.com.tw/ericDvd/01/012301',
    'https://mychiaohu.benesse.com.tw/ericDvd/01/012302',
    'https://mychiaohu.benesse.com.tw/ericDvd/01/012303',
    'https://mychiaohu.benesse.com.tw/ericDvd/01/012304',
    'https://mychiaohu.benesse.com.tw/ericDvd/01/012305',
    'https://mychiaohu.benesse.com.tw/ericDvd/01/012306',
    'https://mychiaohu.benesse.com.tw/ericDvd/01/012307',
    'https://mychiaohu.benesse.com.tw/ericDvd/01/012308',

    'https://mychiaohu.benesse.com.tw/ericDvd/02/022309',
    'https://mychiaohu.benesse.com.tw/ericDvd/02/022310',
    'https://mychiaohu.benesse.com.tw/ericDvd/02/022311',
    'https://mychiaohu.benesse.com.tw/ericDvd/02/022312',
    'https://mychiaohu.benesse.com.tw/ericDvd/02/022401',
    'https://mychiaohu.benesse.com.tw/ericDvd/02/022402',
    'https://mychiaohu.benesse.com.tw/ericDvd/02/022403',
    'https://mychiaohu.benesse.com.tw/ericDvd/02/022404',
    'https://mychiaohu.benesse.com.tw/ericDvd/02/022405',
    'https://mychiaohu.benesse.com.tw/ericDvd/02/022406',
    'https://mychiaohu.benesse.com.tw/ericDvd/02/022407',
    'https://mychiaohu.benesse.com.tw/ericDvd/02/022408',

    'https://mychiaohu.benesse.com.tw/ericDvd/03/022409',
    'https://mychiaohu.benesse.com.tw/ericDvd/03/022410',
    'https://mychiaohu.benesse.com.tw/ericDvd/03/022411',
    'https://mychiaohu.benesse.com.tw/ericDvd/03/022412',
];

document.addEventListener('keydown', function (event) {
    let index = array.indexOf(document.URL);
    if (index === -1) {
        console.log('Fail to find index of current url');
        return;
    }

    switch (event.key) {
        case 'b':
            if (index == 0) {
                index = array.length - 1;
            } else {
                index--;
            }
            break;
        case 'n':
            if (index === array.length - 1) {
                index = 0;
            } else {
                index++;
            }
            break;
    }
    window.location.href = array[index];
});
