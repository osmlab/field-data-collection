/**
 * Given fields from all surveys return the survey fields
 * pertaining to the observation's type
 * 
 * @param {Array} allSurveyFields 
 * @param {Object} observation 
 * @return {Array}
 */
function pickSurveyType(allSurveyFields, observation) {
  const surveyType = observation.tags.surveyType;
  for (let i = 0; i < allSurveyFields.length; i++) {
    if (allSurveyFields[i].id === surveyType) {
      return allSurveyFields[i].fields;
    }
  }
}

/**
 * Given a survey's fields and an observation, calculate the percent
 * completeness and return the number between 0 and 100
 * 
 * @param {Array} surveys
 * @param {Object} observation 
 * @returns {Float} = {0..100}
 */
function calculateCompleteness(surveyFields, observation) {
  if (!surveyFields || !observation) return 0;

  const keys = new Set(surveyFields.map(field => field.key));
  let filledTags = Object.keys(observation.tags).filter(tag => keys.has(tag));
  return parseInt(filledTags.length / keys.size * 100, 10);
}

module.exports = {
  calculateCompleteness,
  pickSurveyType
};
