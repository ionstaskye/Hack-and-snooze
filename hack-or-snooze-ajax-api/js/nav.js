"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $postStoryForm.show();
}

function navFavoriteClick(evt){
  console.debug("navFavoriteClick", evt)
  loadOnlyFavorites()
}

function navOwnStoryClick(evt){
  console.debug("navFavoriteClick", evt)
  loadOnlyMyStories()
}

$navLogin.on("click", navLoginClick);
$navSubmit.on("click", navSubmitClick);
$navFavorite.on("click", navFavoriteClick)
$navOwnStories.on("click", navOwnStoryClick)

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
