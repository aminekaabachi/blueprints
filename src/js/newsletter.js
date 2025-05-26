// Handle newsletter form submission
document.addEventListener('DOMContentLoaded', () => {
  const supabaseUrl = 'https://uazseyqoisjfyixdpwhq.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhenNleXFvaXNqZnlpeGRwd2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNTMyNjAsImV4cCI6MjA2MzgyOTI2MH0.cSUu3_eAvpC7GubsEOoFbCmk-ZDGnI-p2VEgkA6wBhs'
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)
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
      const { data, error } = await supabase
        .from('emails')
        .insert([{ email }])

      if (error) throw error

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