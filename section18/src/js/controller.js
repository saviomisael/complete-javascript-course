import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

const apiKey = 'af9c2353-950b-4713-9cd6-25734711b1c8';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    // Loading Recipe
    recipeView.renderSpinner();

    await model.loadRecipe(id);

    const { recipe } = model.state;

    // Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    alert(err);
  }
};

// showRecipe('664c8f193e7aa067e94e8297');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes),
);
