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

export const selectObservationTypes = createSelector(
  selectActiveSurveys,
  surveys =>
    surveys
      .map(({ definition: { featureTypes, observationTypes } }) =>
        observationTypes.map(t => featureTypes.find(x => x.id === t))
      )
      .reduce((arr, val) => arr.concat(val), [])
);

export const selectRemoteSurveys = state => state.surveys.remote;

export const selectStatus = state => state.status;
