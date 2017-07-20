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
  [selectObservationTypes, selectCategories],
  (observationTypes, categories) =>
    observationTypes.filter(
      x =>
        !categories
          .map(x => x.members)
          .reduce((arr, val) => arr.concat(val), [])
          .includes(x.id)
    )
);

export const selectAllCategories = createSelector(
  [selectCategories, selectUncategorizedTypes, selectObservationTypes],
  (categories, uncategorized, observationTypes) =>
    categories.concat({
      name: "Other",
      list: uncategorized.map(({ id, name }) => ({ id, name }))
    })
);

export const selectRemoteSurveys = state => state.surveys.remote;

export const selectStatus = state => state.status;
