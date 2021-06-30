const usersDiv = document.getElementById("users");
const postsDiv = document.getElementById("posts");

function getUsers() {
  return fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((data) => data);
}

function getUserPosts(userID) {
  return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userID}`)
    .then((response) => response.json())
    .then((data) => data);
}

function createUserElement(user) {
  // Set up as Promise so that we can take advantage of the container element as a return value from this function
  return new Promise((resolve, reject) => {
    // set up parent container for each users main information to be displayed in
    const container = document.createElement("div");
    container.setAttribute(
      "class",
      "my-1 d-flex flex-column align-items-start userContainer"
    );

    // add username
    const username = document.createElement("h2");
    username.textContent = user.username;

    // Add users full name
    const namePrefix = document.createElement("p");
    namePrefix.textContent = "Full name: ";
    const name = document.createElement("span");
    name.setAttribute("class", "boldFont");
    name.textContent = user.name;
    namePrefix.append(name);

    // Add users place of work
    const workPlacePrefix = document.createElement("p");
    workPlacePrefix.textContent = "Works at: ";
    const workPlace = document.createElement("span");
    workPlace.setAttribute("class", "boldFont");
    workPlace.textContent = user.company.name;
    // Append these two together. Created seperately for styling
    workPlacePrefix.append(workPlace);

    container.append(username, namePrefix, workPlacePrefix);
    resolve(container);
    reject("Something went wrong in DOM manipulation");
  });
}

function createPostElement(post) {
  return new Promise((resolve, reject) => {
    const container = document.createElement("div");
    container.setAttribute("class", "postContainer");

    const title = document.createElement("h2");
    title.textContent = post.title;

    const body = document.createElement("p");
    body.textContent = post.body;

    container.append(title, body);
    resolve(container);
  });
}

function displayUserPosts(posts, username) {
  // Set up a header for the posts div, upon the selection of a users posts
  const postHeader = document.createElement("h1");
  postHeader.textContent = `${username}'s posts`;
  postsDiv.append(postHeader);

  // then append all of the posts
  posts.forEach((post) => {
    createPostElement(post).then((element) => {
      postsDiv.append(element);
    });
  });
}

// Custom function for adding click event listener
function addClickEventListener(element, user) {
  element.addEventListener("click", async (e) => {
    e.preventDefault();
    // first clear out any previously loaded posts
    postsDiv.innerHTML = "";
    const userPosts = await getUserPosts(user.id);
    // Then here is the main function that we want to run with every click
    displayUserPosts(userPosts, user.username);
  });
}

async function init() {
  // always initialize by clearing the DOM of any old elements
  usersDiv.innerHTML = "";
  postsDiv.innerHTML = "";

  const users = await getUsers();

  users.forEach((user) => {
    // Create each element that will container the main user information, that you can click on to view posts from
    createUserElement(user).then((element) => {
      // add the newly created element to the DOM
      usersDiv.append(element);
      // Then we add the click event listener
      addClickEventListener(element, user);
    });
  });
}

init();
