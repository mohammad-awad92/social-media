import DBLoader from "./loaders/Database";
import ExpressLoader from "./loaders/Express";

const start = async () => {
  await DBLoader();
  ExpressLoader.start();
};
start().catch((error) => {
  console.log("loading error", error);
});