function pickSurvey(surveyFields, observation) {
  const surveyType = observation.tags.surveyType;
  for (let i = 0; i < surveyFields.length; i++) {
    if (surveyFields[i].id === surveyType) {
      return surveyFields[i];
    }
  }
}
/**
 * Given the list of active survey fields and an observation, calculate the percent
 * completeness and attach it to the observation
 * 
 * @param {Array} surveys
 * @param {Object} observation 
 * @returns {Float} = {0..100}
 */
function calculateCompleteness(fields, observation) {
  const surveyFields = pickSurvey(fields, observation).fields;
  const keys = new Set(surveyFields.map(field => field.key));
  let filledTags = Object.keys(observation.tags).filter(tag => keys.has(tag));
  return parseInt(filledTags.length / keys.size * 100, 10);
}

module.exports = calculateCompleteness;
