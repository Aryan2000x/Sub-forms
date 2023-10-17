const searchInput = document.querySelector('#search');

const results_body = document.querySelector('#results');

load_data();

function load_data(query = '')
{
    console.log("refresh")
    const request = new XMLHttpRequest();

    request.open('GET', `/search?q=${query}`);

    request.onload = () => {

        const results = JSON.parse(request.responseText);

        let html = '';

        if(results.length > 0)
        {
            results.forEach(result => {
                html += `
                <tr>
                    <td>`+result.id+`</td>
                    <td>`+result.name+`</td>
                    <td>`+result.department+`</td>
                    <td>`+result.employment+`</td>
                    <td>`+result.email+`</td>
                    <td>`+ (result.fileUpload ? result.fileUpload : '') +`</td>
                </tr>
                `;
            });
        }
        else
        {
            html += `
            <tr>
                <td colspan="5" class="text-center">No Data Found</td>
            </tr>
            `;
        }

        results_body.innerHTML = html;

    };

    request.send();
}

searchInput.addEventListener('input', () => {

    const query = searchInput.value;

    load_data(query);

});