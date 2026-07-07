import re

with open('main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start of the navigation handler
start_str = """  link.addEventListener('click', (e) => {
    // Exclude the Theme Settings link since it handles itself
    if (e.target.id === 'mobileSettingsBtn') return;
    
    // Mobile dropdown toggle logic
    if (window.innerWidth <= 768 && e.target.classList.contains('nav-link') && e.target.nextElementSibling && e.target.nextElementSibling.classList.contains('dropdown-content')) {
      e.preventDefault();
      e.target.parentElement.classList.toggle('open');
      return;
    }"""

new_str = """  link.addEventListener('click', (e) => {
    const targetEl = e.currentTarget;
    
    // Exclude the Theme Settings link since it handles itself
    if (targetEl.id === 'mobileSettingsBtn') return;
    
    // Mobile dropdown toggle logic
    if (window.innerWidth <= 768 && targetEl.classList.contains('nav-link') && targetEl.nextElementSibling && targetEl.nextElementSibling.classList.contains('dropdown-content')) {
      e.preventDefault();
      e.stopPropagation(); // Prevent the document click listener from firing
      
      const parent = targetEl.parentElement;
      const isOpen = parent.classList.contains('open');
      
      // Close all other dropdowns
      document.querySelectorAll('.dropdown').forEach(d => {
        if (d !== parent) d.classList.remove('open');
      });
      
      // Toggle this one
      if (isOpen) {
        parent.classList.remove('open');
      } else {
        parent.classList.add('open');
      }
      return;
    }"""

if start_str in content:
    content = content.replace(start_str, new_str)
    with open('main.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed dropdown logic in main.js")
else:
    print("Could not find dropdown logic string.")
