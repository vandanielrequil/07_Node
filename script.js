const button1 = document.getElementById('but1'),
    outPutForm = document.querySelector('.outPut'),
    outPutText = document.createElement("p");

button1.addEventListener('click', () => { getData() });


const url = `http://localhost:5501`,
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'no-cors',
        connection: 'keep-alive'
    };

// fetch(url)
//     .then(response => response.text())
//     .then(data => console.log(data));

async function getData() {
    const response = await fetch(url).then(r => r.text());
    console.log(response);
    outPutText.innerText = '';
    outPutText.insertAdjacentText('afterbegin', response);
    outPutForm.appendChild(outPutText);
    return response;
}
