"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <div>
      ${getStar(story, currentUser)}
      <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
       <div id = 'authorDiv'> <small class="story-author">by ${story.author}</small></div>
        ${addDeleteButton(story, currentUser)}
        <div id = 'usernameDiv'><small class="story-user">posted by ${story.username}</small></div>
        </div>
      </li>
    `);
}
//Function to decide whether to load a favorite star or unfavorite star

function getStar(story, user){
  const favorite = user.isFavorite(story)
  if (favorite === true){
    return  `<span class = "star" ><i class= "fav" > &#9733</i></span>`
  }
  else{
    return `<span class = "star" ><i class= "un-fav" > &#9734</i></span>`
  }
}
//function to load a delete button for your own stories
function addDeleteButton(story, user){
  if(story.username === user.username){
    return `<span id= "delete">x</span>`
  }
  else{
    return ""
  }
}

function loadOnlyFavorites(){
  console.debug("loadOnlyFavorites")

  const favorites = currentUser.favorites
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function loadOnlyMyStories(){
  console.debug("loadOnlyOwnStories")

  const ownStory = currentUser.ownStories
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of ownStory) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}



/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
$postStoryForm.on("submit", createStory)
// create story function
async function createStory(evt){
  console.debug("createStory", evt);
  evt.preventDefault();

  const $title = $("#story-title").val()
  const $author = $("#story-author").val()
  const $url = $("#story-url").val()
  const storyData = {title: $title, author: $author, url: $url}
  const userName = currentUser.username


  const newStory = await storyList.addStory(currentUser, storyData)

  const $newStory = generateStoryMarkup(newStory)
  $allStoriesList.prepend($newStory)

  $postStoryForm.trigger("reset");
  updateUIOnUserLogin
}
//checks to see if the story is favorited and directs the code to the proper function while updating html
async function addOrRemoveFavorite(evt){
  console.debug("addOrRemoveFavorite", evt)
  evt.preventDefault()
  const $target = $(evt.target)
  const $parentLi = $target.closest("li")
  const $liStoryId = $parentLi.attr("id")
  const $story =  storyList.stories.find(s => $liStoryId === s.storyId)
  const closestI = $target.closest("i")
  if ($target.hasClass("un-fav") === true){
    closestI.html('&#9733')
    closestI.attr("class", "fav")
    currentUser.addFavorite($story)
  }
  else {
    closestI.html("&#9734")
    closestI.attr("class", "un-fav")
    currentUser.removeFavorite($story)
  }

}
// function to delete stories
async function deleteStory(evt){
  console.debug("deleteStory", evt)
  evt.preventDefault()
  const $target = $(evt.target)
  const $parentLi = $target.closest("li")
  const storyId = $parentLi.attr("id")
  const token = currentUser.loginToken
  await axios({
    url: `${BASE_URL}/stories/${storyId}`,
    method: 'delete' ,
    data: {token}
   } )
  $parentLi.remove()
}
//event listeners for new items
$allStoriesList.on("click",".star", addOrRemoveFavorite)
$allStoriesList.on("click", "#delete", deleteStory)

