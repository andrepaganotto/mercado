import axios from "axios";

async function main() {
    try {
        await axios.get('https://api.mercadobitcoin.net/api/v4/zuzu', {
            headers: {
                Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6InB1YmxpYzpoeWRyYS5qd3QuYWNjZXNzLXRva2VuIiwidHlwIjoiSldUIn0.eyJhdWQiOltdLCJjbGllbnRfaWQiOiI3YjdiMDM3MDJiNTdhMTY5MmMyYThkZjljZmRkMjE5ZDcyZjE4YWZhMDBjMGM2NDJlZWVkMTE5MjFkM2VkOTkyIiwiZXhwIjoxNzIxMDUxNjA2LCJleHQiOnt9LCJpYXQiOjE3MjEwNDgwMDYsImlzcyI6Imh0dHBzOi8vc2VydmljZS1hY2NvdW50cy5tZXJjYWRvYml0Y29pbi5uZXQvIiwianRpIjoiYjNlYTgwNjAtNzc4My00NGE1LWE1ZmMtYmUwNzI4ZWQ3Y2FjIiwibmJmIjoxNzIxMDQ4MDA2LCJzY3AiOlsicHJvZmlsZSIsImdsb2JhbCJdLCJzdWIiOiI3YjdiMDM3MDJiNTdhMTY5MmMyYThkZjljZmRkMjE5ZDcyZjE4YWZhMDBjMGM2NDJlZWVkMTE5MjFkM2VkOTkyIn0.v1kuR5kv6gtGuv3z8FPzZi1boDtJ4-Q5kZtTUUt3P_7A64C8yWgCKwnxXZ0JzrwhY1pguwoxg5GwxAMLZyPS5rsMLopl49aP_9qSY6zqY4onFe975vUCLYM7M3iJuk3P-7rorLfZVqRavD6qotUyq9cMM1zRjoTGvWScRVWtQFqQO6NgPxTRjYtAsCkABPpO57gICtbq5Y3KesO5jeZPy6saIpNl5LPCKXGbngXFEwUJc2Pkzw7cdu6rQkdErBmV7SbZ8gSHz9MJgolvMFVvsjUVdsWkDXmomUxih-19z8gNkLWyMFL0qI269EGLsangZcvECxXRpRVZfhsEWkK160AufSFyARwXqYPWIQK6e9U7o1-K4dLAJmuJXjeA9slxQAtwbsD5GHBS7tr0VGN1SCa7p1tCPVuXoFj8Eyl9ejKNrNhjmux9dpMBETDoSedNvC3Xm1VNLIxPqnYYRjs5W5w9eOrHHve34pkGV18PskK2O7x1PjqEy9EMlxS2dRpR_AeCaRLsChLRFDgCkVM5WAbyFbg9R25ICGHETbknW0Eq3RhSgGGfqY_q_kxaOlcfZdyz2utUGp7I9y8-366BV5Vf2wX0qCuzNlx7uhxPnyaTILXWA6_2sy-P0kcCFzOVuNk3jXa91dbYvkBTXTMpWU0ms6hwl43yw7g3H81x9XQ'
            }
        })
        console.log('SUCCESS');
    }
    catch (error) {
        if(!error.response) {
            throw new Error('Unkown Error' + error.message);
        }

        const status = error.response.status;

        if (error.response.data.error) {
            if (status === 404) return; //Not found > throw
            if (status === 403) return; //Forbidden > throw Invalid account ID
            if (status === 401) return; //Unauthorized > Get new token > return retry
        }

        error = error.response.data;
        const [path, endpoint, code] = error.code.split('|');


        console.error('Error Code', error.code);
        console.error('HTTP Code', error.response.status);
        console.error('Error.message', error.message);
        console.error('Error.response.data', error.response.data);
    }
}

main();