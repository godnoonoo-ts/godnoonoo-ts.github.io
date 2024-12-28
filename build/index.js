/*
Entry point for the application, any code that needs to be executed on startup should be called from here.
This file should not contain any logic, only calls to other files.
This file should not interact with the data layer.
*/
import { setupController } from "./controller/gameController.js"; // eslint-disable-line no-restricted-imports -- this is allowed here
import { initialiseItems } from "./controller/itemsController.js";
import { bonusesView } from "./view/bonusesView.js";
import { extrasView } from "./view/extra/extrasView.js";
import { itemsView } from "./view/itemsView.js";
import { levelsView } from "./view/levelsView.js";
import { simulationView } from "./view/simulationView.js";
// Autobattle
setupController();
// Items
initialiseItems();
itemsView();
// Bonuses
bonusesView();
// Results
simulationView();
levelsView();
extrasView();
