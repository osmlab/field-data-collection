import { createSelector } from "reselect";

import { tilesForBounds } from "../lib";

export const selectUser = state => state.user;

export const selectAvailableSurveys = state => state.surveys.available;
export const selectActiveSurveyIds = state => state.surveys.active;

/**
 * Selector that combines survey data with whether that
 * survey is active
 */
export const selectSurveysWithActivity = createSelector(
  [selectAvailableSurveys, selectActiveSurveyIds],
  (surveys, activeIds) => {
    return surveys.map(survey => {
      let { name, id } = survey.definition;
      var isActive = !!activeIds.find(i => i === (name || id));
      return Object.assign({}, { active: isActive }, survey);
    });
  }
);

/**
 * Selector to filter surveys by activity
 */
export const selectActiveSurveys = createSelector(
  selectSurveysWithActivity,
  surveys => surveys.filter(s => s.active)
);

export const selectFeatureTypes = createSelector(selectActiveSurveys, surveys =>
  surveys
    .map(({ definition: { featureTypes } }) => featureTypes)
    .reduce((arr, val) => arr.concat(val), [])
);

export const selectFeatureType = (id, state) =>
  selectFeatureTypes(state).find(x => x.id === id);

export const selectIcons = createSelector(selectActiveSurveys, surveys =>
  surveys
    .map(x => x.icons)
    .filter(x => x != null)
    .reduce((arr, val) => arr.concat(val), [])
);

export const selectIcon = (id, state) =>
  // startsWith is used because Wao presets include size info
  selectIcons(state).find(x => x.icon.startsWith(id));

export const selectObservationTypes = createSelector(
  selectActiveSurveys,
  surveys =>
    surveys
      .map(
        ({ definition: { featureTypes, observationTypes, name: surveyId } }) =>
          observationTypes.map(t => ({
            ...featureTypes.find(x => x.id === t),
            surveyId
          }))
      )
      .reduce((arr, val) => arr.concat(val), [])
);

export const selectCategories = createSelector(
  [selectActiveSurveys, selectObservationTypes],
  (surveys, observationTypes) =>
    surveys
      .map(({ definition: { categories, name: surveyId } }) =>
        (categories || [])
          .reduce((arr, { icon, members, name }) => {
            const cat = arr.find(x => x.name === name);

            if (cat != null) {
              cat.members = cat.members.concat(
                members.filter(x => !cat.members.includes(x))
              );
            } else {
              arr.push({
                icon,
                members,
                name,
                surveyId
              });
            }

            return arr;
          }, [])
          .map(category => ({
            ...category,
            list: category.members
              .map(id => observationTypes.find(x => x.id === id))
              .map(({ id, name }) => ({ id, name }))
          }))
      )
      .reduce((arr, val) => arr.concat(val), [])
);

export const selectUncategorizedTypes = createSelector(
  [selectObservationTypes, selectCategories, selectActiveSurveys],
  (observationTypes, categories, surveys) => {
    // filter observationTypes to only include uncategorized types
    const filter = (observationTypes, categories) => {
      return observationTypes.filter(
        x =>
          !categories
            .map(x => {
              return x.members;
            })
            .reduce((arr, val) => arr.concat(val), [])
            .includes(x.id)
      );
    };

    // reduce to an array of objects
    const reduce = uncategorized => {
      var reducedObj = uncategorized.reduce((obj, x) => {
        if (!obj[x.surveyId]) {
          obj[x.surveyId] = {
            name: surveys.find(survey => {
              return (
                survey &&
                survey.definition &&
                survey.definition.name === x.surveyId
              );
            }).definition.name,
            surveyId: x.surveyId,
            list: []
          };
        }

        obj[x.surveyId].list.push(x);
        return obj;
      }, {});

      return Object.keys(reducedObj).map(key => reducedObj[key]);
    };

    // return types categorized by survey if not categorized
    return reduce(filter(observationTypes, categories));
  }
);

export const selectAllCategories = createSelector(
  [selectCategories, selectUncategorizedTypes],
  (categories, uncategorized) => {
    return categories.concat(uncategorized);
  }
);

export const selectRemoteSurveys = state => state.surveys.remote;

export const selectStatus = state => state.status;

export const selectActiveObservation = state => state.observation.active;

export const selectUserObservations = state => {};

export const selectSelectedBounds = state => state.bounds.selected;

export const selectVisibleBounds = state => state.bounds.visible;

export const selectFeatureTiles = state => state.features.features;

export const selectObservationTiles = state => state.observations.observations;

export const selectSelectedFeatures = createSelector(
  [selectSelectedBounds, selectFeatureTiles],
  (selectedBounds, features) => {
    const tiles = tilesForBounds(selectedBounds);

    return tiles
      .reduce((selectedFeatures, tile) => {
        selectedFeatures = selectedFeatures.concat(
          features[tile.join("/")] || []
        );

        return selectedFeatures;
      }, [])
      .filter(
        ({ lat, lon }) =>
          // check for containment
          selectedBounds[0] <= lon &&
          lon <= selectedBounds[2] &&
          selectedBounds[1] <= lat &&
          lat <= selectedBounds[3]
      );
  }
);

export const selectSelectedObservations = createSelector(
  [selectSelectedBounds, selectObservationTiles],
  (selectedBounds, observations) => {
    const tiles = tilesForBounds(selectedBounds);

    return tiles
      .reduce((selectedObservations, tile) => {
        selectedObservations = selectedObservations.concat(
          observations[tile.join("/")] || []
        );

        return selectedObservations;
      }, [])
      .filter(
        ({ lat, lon }) =>
          // check for containment
          selectedBounds[0] <= lon &&
          lon <= selectedBounds[2] &&
          selectedBounds[1] <= lat &&
          lat <= selectedBounds[3]
      );
  }
);

export const selectVisibleFeatures = createSelector(
  [selectVisibleBounds, selectFeatureTiles],
  (visibleBounds, features) => {
    const tiles = tilesForBounds(visibleBounds);

    return tiles
      .reduce((visibleFeatures, tile) => {
        visibleFeatures = visibleFeatures.concat(
          features[tile.join("/")] || []
        );

        return visibleFeatures;
      }, [])
      .filter(
        ({ lat, lon }) =>
          // check for containment
          visibleBounds[0] <= lon &&
          lon <= visibleBounds[2] &&
          visibleBounds[1] <= lat &&
          lat <= visibleBounds[3]
      );
  }
);

export const selectVisibleObservations = createSelector(
  [selectVisibleBounds, selectObservationTiles, selectActiveSurveyIds],
  (visibleBounds, observations, activeIds) => {
    const tiles = tilesForBounds(visibleBounds);

    return tiles
      .reduce((visibleObservations, tile) => {
        visibleObservations = visibleObservations.concat(
          observations[tile.join("/")] || []
        );

        return visibleObservations;
      }, [])
      .filter(obs => {
        return !!activeIds.find(i => i === obs.tags.surveyId);
      })
      .filter(
        ({ lat, lon }) =>
          // check for containment
          visibleBounds[0] <= lon &&
          lon <= visibleBounds[2] &&
          visibleBounds[1] <= lat &&
          lat <= visibleBounds[3]
      );
  }
);

export const selectVisibleObservationsByNode = nodeId => {
  return selectVisibleObservations().filter(
    obs => obs.tags["osm-p2p-id"] === nodeId
  );
};

export const selectLoadingStatus = state => state.features.loading;

export const selectActiveFeatureTileQueries = state =>
  state.features.activeTileQueries;

export const selectActiveObservationTileQueries = state =>
  state.observations.activeTileQueries;

export const selectIsQuerying = createSelector(
  [selectActiveFeatureTileQueries, selectActiveObservationTileQueries],
  (featureQueries, observationQueries) =>
    featureQueries.length + observationQueries.length > 0
);
