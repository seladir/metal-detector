export function detectTrackFile(track) {
  const formData  = new FormData();
  formData.append('track', track);
  return fetch(`${process.env.REACT_APP_API_URL}/detect-file`, {
    method: 'POST',
    body: formData,
  })
}

export function detectTrackLink(link) {
  return fetch(`${process.env.REACT_APP_API_URL}/detect-link`, {
    method: 'POST',
    body: JSON.stringify({ link }),
    headers: {
      'Content-Type': 'application/json'
    },
  })
}

export function getDetectionResult(id) {
  return fetch(`${process.env.REACT_APP_API_URL}/detect/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
}
