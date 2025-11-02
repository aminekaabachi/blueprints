document.addEventListener('DOMContentLoaded', () => {
  // Replace this with your deployed Google Apps Script web app URL
  const sheetEndpoint = 'https://script.google.com/macros/s/AKfycbzco2h0799YjYcIvvXQ5P8NARvMOHJCJJCokbr-QXDdH_gT0jwc1Lu0VUdiqwfmSTs8/exec'

  const form = document.querySelector('.newsletter-form')
  if (!form) return

  // Create success message element
  const successMessage = document.createElement('div')
  successMessage.className = 'newsletter-success'
  successMessage.style.display = 'none'
  successMessage.textContent = 'Thanks for subscribing!'
  form.appendChild(successMessage)

  // Create error message element
  const errorMessage = document.createElement('div')
  errorMessage.className = 'newsletter-error'
  errorMessage.style.display = 'none'
  errorMessage.textContent = 'Sorry, there was an error subscribing. Please try again.'
  form.appendChild(errorMessage)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const emailInput = form.querySelector('input[type="email"]')
    const email = emailInput.value.trim()

    if (!email) return

    try {
      const res = await fetch(sheetEndpoint, {
        redirect: "follow",
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ email })
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok || json.result === 'error') {
        throw new Error(json.error || 'Failed to save email')
      }

      // Show success message and clear input
      emailInput.value = ''
      successMessage.style.display = 'block'
      errorMessage.style.display = 'none'

      // Hide success message after 3 seconds
      setTimeout(() => {
        successMessage.style.display = 'none'
      }, 3000)
    } catch (error) {
      console.error('Error:', error.message)
      errorMessage.style.display = 'block'
      successMessage.style.display = 'none'

      // Hide error message after 5 seconds
      setTimeout(() => {
        errorMessage.style.display = 'none'
      }, 5000)
    }
  })
})