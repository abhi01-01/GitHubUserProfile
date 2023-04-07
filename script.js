const APIURL = "https://api.github.com/users/";
const form = document.getElementById("form") ;
const main = document.getElementById("main") ;
const search = document.getElementById("search") ;

const createUserCard = (user) => {
    const cardHTML = `
        <div class="card">
            <div>
                <a href="${user.html_url}" target="_blank">
                    <img
                        src="${user.avatar_url}"
                        alt="${user.name}"
                        class="avatar"
                    />
                </a>
            </div>
            <div class="user-info">
                <h2>${user.name} (Id = ${user.id})</h2>
                <p>${user.bio}</p>
                <ul>
                    <a href="${"https://github.com/" + user.login + "?tab=followers"}" target="_blank">
                        <li>${user.followers}<strong>Followers</strong></li>
                    </a>
                    <a href="${"https://github.com/" + user.login + "?tab=following"}" target="_blank">
                        <li>${user.following}<strong>Following</strong></li>
                    </a>
                    <a href="${"https://github.com/" + user.login + "?tab=repositories"}" target="_blank">    
                        <li>${user.public_repos}<strong>Public Repos</strong></li>
                    </a>    
                </ul>
                <div id="repos"></div>
            </div>

        </div>
    `; 
    main.innerHTML = cardHTML ;
 };

 const createErrorCard = (message) => {

    const cardHTML = `
        <div class="card"><h1>${message}</h1></div>
    `;
    main.innerHTML = cardHTML ;
 };

 const addReposToCard = async (repos) => {

    const reposElement = document.getElementById("repos") ;
    repos.slice(0,5).forEach((repo) => {

        const repoElement = document.createElement("a") ;
        repoElement.classList.add("repo") ;
        repoElement.href = repo.html_url ;
        repoElement.target = "_blank" ;
        repoElement.innerText = repo.name ;
        reposElement.appendChild(repoElement)
    });
 };

 const getUser = async(username) => {

    try{
        
        const {data} = await axios(APIURL + username) ;
        createUserCard(data) ;
        getRepos(username) ;

    }catch(error){

        if(error.response.status == 404){

            createErrorCard("No Profile with this Usename.");
        }
    }
 };

const getRepos = async (username) => {

    try{

        const {data} = await axios(APIURL + username + "/repos?sort=created") ;
        addReposToCard(data) ;

    }catch (error){

        createErrorCard("Problem Fetching Repos") ;
    }
}

form.addEventListener("submit",(e) => {
    e.preventDefault() ;
    const user = search.value ;

    if(user){
        getUser(user) ;
        search.value = "" ; 
    }
});