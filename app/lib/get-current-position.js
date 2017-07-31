export default function getCurrentPosition(callback) {
  const success = data => {
    callback(null, data);
  };

  const error = err => {
    callback(err);
  };

  navigator.geolocation.getCurrentPosition(success, error);
}
