import { createSelector } from "reselect";

export const selectAvailableSurveys = state => state.surveys.available;

export const selectObservationTypes = createSelector(
  selectAvailableSurveys,
  surveys =>
    surveys
      .map(({ definition: { featureTypes, observationTypes } }) =>
        observationTypes.map(t => featureTypes.find(x => x.id === t))
      )
      .reduce((arr, val) => arr.concat(val), [])
);

export const selectRemoteSurveys = state => state.surveys.remote;

export const selectStatus = state => state.status;
