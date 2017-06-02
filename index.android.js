import "./global";

import { TabNavigator, TabBarBottom } from "react-navigation";
import { AppRegistry } from "react-native";

import ObservationsNavigator from "./screens/observations";
import ObservationCreateNavigator from "./screens/observation-create";
import AccountScreen from "./screens/account";

import locale from "./locale/";

console.log("locale.map", locale.map);

const Surveyor = TabNavigator(
  {
    Observations: { screen: ObservationsNavigator },
    CreateObservation: { screen: ObservationCreateNavigator },
    Account: { screen: AccountScreen }
  },
  {
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      showIcon: false,
      style: {
        backgroundColor: "white"
      }
    }
  }
);

// run osm-p2p-db tests
require("./osm-p2p-db-tests/batch.js")(CreateOsmDb);
require("./osm-p2p-db-tests/changeset.js")(CreateOsmDb);
require("./osm-p2p-db-tests/create.js")(CreateOsmDb);
require("./osm-p2p-db-tests/del_batch.js")(CreateOsmDb);
require("./osm-p2p-db-tests/del.js")(CreateOsmDb);
require("./osm-p2p-db-tests/del_node_in_way.js")(CreateOsmDb);
require("./osm-p2p-db-tests/del_node.js")(CreateOsmDb);
require("./osm-p2p-db-tests/del_relation.js")(CreateOsmDb);
require("./osm-p2p-db-tests/del_way_in_relation.js")(CreateOsmDb);
require("./osm-p2p-db-tests/del_way.js")(CreateOsmDb);
require("./osm-p2p-db-tests/fork_count.js")(CreateOsmDb);
require("./osm-p2p-db-tests/fork_del.js")(CreateOsmDb);
require("./osm-p2p-db-tests/fork.js")(CreateOsmDb);
require("./osm-p2p-db-tests/modify_batch.js")(CreateOsmDb);
require("./osm-p2p-db-tests/modify_way.js")(CreateOsmDb);
require("./osm-p2p-db-tests/ordered.js")(CreateOsmDb);
require("./osm-p2p-db-tests/query_way.js")(CreateOsmDb);
require("./osm-p2p-db-tests/refbug.js")(CreateOsmDb);
require("./osm-p2p-db-tests/relation_bare_ref.js")(CreateOsmDb);
require("./osm-p2p-db-tests/relation_batch.js")(CreateOsmDb);
require("./osm-p2p-db-tests/relation.js")(CreateOsmDb);
require("./osm-p2p-db-tests/split.js")(CreateOsmDb);
require("./osm-p2p-db-tests/super_relation_bare.js")(CreateOsmDb);
require("./osm-p2p-db-tests/super_relation.js")(CreateOsmDb);
require("./osm-p2p-db-tests/update.js")(CreateOsmDb);

AppRegistry.registerComponent("Surveyor", () => Surveyor);
