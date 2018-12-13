function showError(e) {
    console.warn("Error", e);
}

function updateUI(userWithImage) {
    let current = $('#app').html();
    current = current.concat(`<p><img src="${userWithImage.avatar}"><strong>${userWithImage.first_name}</strong></p>`);
    $("#app").html(current);
}

function getUserURL(id) {
    return `https://reqres.in/api/users/${id}`;
}

$("#btn2").on("click", () => {
    $.getJSON({
        url: `https://reqres.in/api/users?page=2`,
        success: page => {
            page.data.forEach(user => {
                $.getJSON({
                    url: getUserURL(user.id),
                    success(u) {
                        updateUI(
                            u.data,
                        );
                    },
                    error: showError
                });
            });
        },
        error: showError
    });
});

// 1 - creazione
const promise = new Promise(() => { });

// 2 - cambiare stato
const promise2 = new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 1000);
});

// 3 - cambiare stato
console.log('Prima che sia risolta', promise2);
setTimeout(() => {
    console.log('Dopo che è stata risolta', promise2)
}, 2000);

// 4 - capire quanto cambia stato

function onSuccess() {
    console.log('Alé!')
}

function onError() {
    console.log('Che disdetta!')
}

const promise3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve()
    }, 2000)
})

promise3.then(onSuccess)
promise3.catch(onError)

// 5 - codice vero

$("#btn4").on("click", () => {
    $.getJSON({
        url: `https://reqres.in/api/users?page=2`,
        success: page => {
            page.data.forEach(user => {
                $.getJSON({
                    url: getUserURL(user.id),
                    success(u) {
                        updateUI(
                            u.data,
                        );
                    },
                    error: showError
                });
            });
        },
        error: showError
    });
});

function getUsersPage() {
    return new Promise((resolve, reject) => {
        $.getJSON({
            url: `https://reqres.in/api/users?page=1`,
            success: resolve,
            error: reject
        })
    })
}

function getSingleUser(id) {
    return new Promise((resolve, reject) => {
        $.getJSON({
            url: getUserURL(id),
            success: resolve,
            error: reject
        })
    })
}

$("#btn6").on("click", () => {
    const promiseOfAPage = getUsersPage();
    promiseOfAPage.then((page) => {
        page.data.forEach(user => {
            const promiseOfAUser = getSingleUser(user.id);
            promiseOfAUser.then(user2 => updateUI(user2.data));
            promiseOfAUser.catch(showError);
        });
    });
    promiseOfAPage.catch(showError);
});

// 6 - chaining
function getPromise() {
    return new Promise((resolve) => { setTimeout(resolve, 1000) });
}

function log1() {
    console.log("Log 1");
    return 'log 2'
}

function log2(msg) {
    console.log(msg);
    return `${msg}-${msg}`;
}

function log3(msg) {
    console.log("Log 3");
    return `Finale ${msg}`; // dove va? (ci vuole un'altra promise, o va usata nel then)
}

getPromise().then(log1).then(log2).then(log3).then(res => console.log(res));

// --------- PRE

function getWeatherURL([city, state]) {
    return `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${city}%2C%20${state}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
}

function getUser(id, onSuccess, onFailure) {
    $.getJSON({
        url: `https://api.github.com/users/${id}`,
        success: onSuccess,
        error: onFailure
    })
}

function getWeather(user, onSuccess, onFailure) {
    $.getJSON({
        url: getWeatherURL(user.location.split(',')),
        success: onSuccess,
        error: onFailure,
    })
}

function updateGithubUI(info) {
    let current = $('#app').html();
    current = current.concat(`<p>${info.user.login}</p><p>${info.weather.channel.item.condition.text}</p>`);
    $("#app").html(current);
}

$("#btn10").on("click", () => {
    getUser('marcofabbri', (user) => {
        getWeather(user, (weather) => {
            updateGithubUI({
                user: user,
                weather: weather.query.results
            })
        }, showError)
    }, showError)
})

// --------- POST 1
$("#btn2").on("click", () => {
    const userPromise = getUser('marcofabbri')
    userPromise.then((user) => {
        const weatherPromise = getWeather(user)
        weatherPromise.then((weather) => {
            updateGithubUI({
                user: user,
                weather: weather.query.results
            })
        })
        weatherPromise.catch(showError)
    })
    userPromise.catch(showError)
})

// --------- POST 2

function getPromiseOfAUser(id) {
    return new Promise((resolve, reject) => {
        $.getJSON({
            url: `https://api.github.com/users/${id}`,
            success: resolve,
            error: reject
        })
    })
}

function getPromiseOfAWeather(user) {
    return new Promise((resolve, reject) => {
        $.getJSON({
            url: getWeatherURL(user.location.split(',')),
            success: resolve,
            error: reject,
        })
    })
}

$("#btn6").on("click", () => {
    getPromiseOfAUser('marcofabbri')
        .then(getPromiseOfAWeather)
        .then((weather) => updateGithubUI(weather)) // error
        .catch(showError)
})

// --------- POST 3

function getPromiseOfAWeather(user) {
    return new Promise((resolve, reject) => {
        $.getJSON({
            url: getWeatherURL(user.location.split(',')),
            success(weather) {
                resolve({
                    user: user,
                    weather: weather.query.results
                })
            },
            error: reject,
        })
    })
}

$("#btn4").on("click", () => {
    getPromiseOfAUser('marcofabbri')
        .then(getPromiseOfAWeather)
        .then((userAndWeather) => updateGithubUI(userAndWeather))
        .catch(showError)
})

// async/await
$("#btn").on("click", async () => {
    const user = await getPromiseOfAUser('marcofabbri');
    const userAndWeather = await getPromiseOfAWeather(user);
    updateGithubUI(userAndWeather);
})
