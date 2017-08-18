import { createSelector } from "reselect";

export const selectAvailableSurveys = state => state.surveys.available;

export const selectCustomSurveys = createSelector(
  selectAvailableSurveys,
  surveys => surveys.filter(x => !x.default)
);

export const selectDefaultSurveys = createSelector(
  selectAvailableSurveys,
  surveys => surveys.filter(x => x.default)
);

export const selectActiveSurveys = createSelector(
  [selectCustomSurveys, selectDefaultSurveys],
  (customSurveys, defaultSurveys) =>
    customSurveys.length > 0 ? customSurveys : defaultSurveys
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
      .map(({ definition: { featureTypes, observationTypes } }) =>
        observationTypes.map(t => featureTypes.find(x => x.id === t))
      )
      .reduce((arr, val) => arr.concat(val), [])
);

export const selectCategories = createSelector(
  [selectActiveSurveys, selectObservationTypes],
  (surveys, observationTypes) =>
    surveys
      .map(({ definition: { categories, name: surveyId } }) =>
        categories
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
            .map(x => x.members)
            .reduce((arr, val) => arr.concat(val), [])
            .includes(x.id)
      );
    };

    // reduce to an array of objects
    const reduce = uncategorized => {
      var reducedObj = uncategorized.reduce((obj, x) => {
        if (!obj[x.surveyId]) {
          obj[x.surveyId] = {
            name: surveys.find(survey => survey.definition.id === x.surveyId)
              .definition.name,
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

export const selectActiveObservation = state => state.observation;

export const selectObservations = state => state.observations.list;

export const selectOsmFeatures = state => state.osm.featureList;

export const selectUserObservations = state => {};
