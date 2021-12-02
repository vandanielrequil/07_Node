/*
To interact with program "npm start" and open index.html 
*/

const url = `http://localhost:5501/`,
    button1 = document.getElementById('but1');

let history = '';

function renderCatalog(responseArray, trgNode) {
    for (e of responseArray) {
        const liEl = document.createElement("li"),
            location = e.name,
            data = e.data;
        if (e.type === 'link') {
            liEl.insertAdjacentHTML('beforeend', `<a href="#">${location}</a>`);
        }
        else {
            liEl.insertAdjacentText('beforeend', data);
        }
        liEl.addEventListener("click", (() => { getData(url, location); return true }));
        trgNode.appendChild(liEl);
    }
    return true;
}

async function getData(url, location) {
    const outPutForm = document.querySelector('.outPut');
    history += location + '/';

    while (outPutForm.firstChild) {
        outPutForm.removeChild(outPutForm.firstChild);
    };

    let response = await fetch(url + history).then(r => r.text()),
        responseArray = response.split('~#~').map(e => { return JSON.parse(e) });

    renderCatalog(responseArray, outPutForm);

    return true;
}

button1.addEventListener('click', () => { history = ''; getData(url, ''); return true });


//resultArr.map(e => stringList += `<li><a href="http://localhost:5501/${e}">${e}</a></li>`);