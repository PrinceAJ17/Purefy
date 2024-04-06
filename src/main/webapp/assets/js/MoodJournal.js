function updateSelectedPrompt(item) {
  const promptText = item.querySelector('h4').textContent;
  document.getElementById('selectedPrompt').textContent = promptText;
  console.log('updateSelectedPrompt function called: Updated prompt text.');

  // Call the updateSelectedPrompt method from your TypeScript component
  window.emotionsComponent.updateSelectedPrompt(promptText);

  // Optional: Scroll to the journal entry form
  document.querySelector('.journal-entry-form').scrollIntoView({ behavior: 'smooth' });
}

// Event listeners for each item in the carousel
document.querySelectorAll('.owl-carousel .item').forEach(item => {
  item.addEventListener('click', function () {
    console.log('Click event on carousel item.');
    updateSelectedPrompt(this); // Calling updateSelectedPrompt function here
  });
});

// Adding event listener for the form submission
document.getElementById('journalForm').addEventListener('submit', clearFormData); // Calling clearFormData function here
