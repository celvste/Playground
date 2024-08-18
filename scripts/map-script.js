// Timeline artifacts order
const timelineOrder = [
  'ludo', 'pick-up-sticks', 'gasing', 'five-stones', 'chapteh',
  'lego', 'nerf-guns', 'sylvanian-families', 'game-boy', 'tamagotchi',
  'pokemon-trading-card-game', 'pop-mart', 'minecraft', 'fortnite', 'nintendo-switch'
];

let timelineIndex = 0

// Function to save the selected level to localStorage
function saveComprehensionLevel(level) {
  localStorage.setItem('comprehensionLevel', level);
}

// Function to load the selected level from localStorage
function loadComprehensionLevel() {
  return localStorage.getItem('comprehensionLevel') || 'child-friendly'; // Default to 'child-friendly'
}

// Function to update the displayed content and image based on the selected level and item
function updateContent(item, level) {
  // Hide all content divs
  document.querySelectorAll('#content div').forEach(div => {
      div.style.display = 'none';
  });

  // Hide all paragraphs
  document.querySelectorAll('#content p').forEach(p => {
      p.classList.remove('active');
  });

  // Show the content div for the selected item
  const selectedDiv = document.querySelector(`.${item}-content`);
  if (selectedDiv) {
      selectedDiv.style.display = 'block';
      selectedDiv.querySelectorAll('p').forEach(p => {
          if (p.getAttribute('data-level') === level) {
              p.classList.add('active'); // Show the paragraph matching the selected level
          }
      });
  }

  // Update the heading based on the selected item
  const itemLabel = document.getElementById('item-label');
  if (itemLabel) {
      itemLabel.textContent = item.replace(/-/g, ' ').toUpperCase(); // Format the label text
  }

  // Update the item image based on the selected item
  const itemImage = document.getElementById('item-image');
  if (itemImage) {
      itemImage.src = `imgs/actual-imgs/${item}-actual.webp`; // Update the image source based on the item
  }

  // Show or hide the "Next" and "Previous" buttons based on the current item
  const nextButton = document.querySelector('.map-next');
  const prevButton = document.querySelector('.map-previous');

  const navigationMode = localStorage.getItem('navigationMode');

  if (navigationMode === 'timeline') {
      // Timeline navigation
      if (item === 'nintendo-switch') {
          nextButton.style.display = 'none'; // Hide the "Next" button for the last item in the timeline
      } else {
          nextButton.style.display = 'inline-block'; // Show the "Next" button
      }

      if (item === 'ludo') {
          prevButton.style.display = 'none'; // Hide the "Previous" button for the first item in the timeline
      } else {
          prevButton.style.display = 'inline-block'; // Show the "Previous" button
      }
  } else if (navigationMode === 'origins') {
      // Region-based navigation
      const currentRegion = localStorage.getItem('selectedRegion');

      if (['europe', 'india'].includes(currentRegion)) {
          prevButton.style.display = 'none';
          nextButton.style.display = 'none';
      } else {
          // Show the "Previous" button for other regions
          prevButton.style.display = 'inline-block';
          nextButton.style.display = 'inline-block';
      }

      if (selectedRegionItems.length > 0 && regionIndex === selectedRegionItems.length - 1) {
          nextButton.style.display = 'inline-block'; // Always show "Next" button in region mode
      } else {
          nextButton.style.display = 'inline-block'; // Show the "Next" button
      }
  }
}

// Event listener for the dropdown change
document.getElementById('comprehension-level').addEventListener('change', function() {
  const selectedLevel = this.value;
  saveComprehensionLevel(selectedLevel);

  // Retrieve the current item based on navigation mode
  const navigationMode = localStorage.getItem('navigationMode');
  let currentItem;

  if (navigationMode === 'timeline') {
    currentItem = timelineOrder[timelineIndex]; // Use the current item from the timeline
  } else {
    currentItem = localStorage.getItem('selectedItem'); // Use the currently selected item
  }

  if (currentItem) {
    updateContent(currentItem, selectedLevel);
  }
});

// Event listener for map item buttons
document.querySelectorAll('.map-item-button').forEach(button => {
  button.addEventListener('click', function() {
    const item = this.getAttribute('data-item');
    localStorage.setItem('selectedItem', item);
    const savedLevel = loadComprehensionLevel();
    updateContent(item, savedLevel);

    const index = timelineOrder.indexOf(item);
    if (index!==-1) {
      timelineIndex=index;
    }
  });
});

// Load the selected comprehension level and item on page load
document.addEventListener('DOMContentLoaded', function() {
  const savedLevel = loadComprehensionLevel();
  document.getElementById('comprehension-level').value = savedLevel;

  const savedItem = localStorage.getItem('selectedItem');
  if (savedItem) {
    updateContent(savedItem, savedLevel);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const timelineButton = document.getElementById('timeline-button');
  const originsButton = document.getElementById('origins-button');
  const originsRegions = document.getElementById('origins-regions');
  const nextButton = document.querySelector('.map-next');
  const prevButton = document.querySelector('.map-previous');

  let selectedRegionItems = [];
  let regionIndex = 0;

  // Function to update the visibility of Next/Previous buttons
  function updateNavButtons(itemCount) {
      if (itemCount <= 1) {
          nextButton.style.display = 'none';
          prevButton.style.display = 'none';
      } else {
          nextButton.style.display = 'inline-block';
          prevButton.style.display = 'inline-block';
      }
  }

  // New nextButton click handler
  nextButton.addEventListener('click', function () {
      const navigationMode = localStorage.getItem('navigationMode');

      if (navigationMode === 'timeline') {
          timelineIndex = (timelineIndex + 1) % timelineOrder.length;
          const currentItem = timelineOrder[timelineIndex];
          updateContent(currentItem, loadComprehensionLevel());
      } else if (navigationMode === 'origins' && selectedRegionItems.length > 0) {
          regionIndex = (regionIndex + 1) % selectedRegionItems.length;
          updateContent(selectedRegionItems[regionIndex], loadComprehensionLevel());
      }
  });

  // New prevButton click handler
  prevButton.addEventListener('click', function () {
      const navigationMode = localStorage.getItem('navigationMode');

      if (navigationMode === 'timeline') {
          timelineIndex = (timelineIndex - 1 + timelineOrder.length) % timelineOrder.length;
          const currentItem = timelineOrder[timelineIndex];
          updateContent(currentItem, loadComprehensionLevel());
      } else if (navigationMode === 'origins' && selectedRegionItems.length > 0) {
          regionIndex = (regionIndex - 1 + selectedRegionItems.length) % selectedRegionItems.length;
          updateContent(selectedRegionItems[regionIndex], loadComprehensionLevel());
      }
  });

  // Timeline button click handler
  timelineButton.addEventListener('click', function () {
    // Change the button color to indicate selection
    timelineButton.style.color = "#F58058";
    originsButton.style.color = "black";

    document.querySelectorAll('.region-button').forEach(button => {
      button.classList.remove('selected-region');
    });

    // Hide regions
    originsRegions.style.display = 'none';
    document.querySelectorAll('.map-item-button').forEach(button => {
      button.style.display = 'inline-block'; // Ensure all buttons are visible
    });

    console.log('timeline navigation mode');

    // Save selection in localStorage
    localStorage.setItem('navigationMode', 'timeline');

    // Reset timeline index
    timelineIndex = 0;

    // Update content for the first item in the timeline
    const firstItem = timelineOrder[timelineIndex];
    updateContent(firstItem, loadComprehensionLevel());

    // Update visibility of Next/Previous buttons based on timeline
    updateNavButtons(timelineOrder.length);

    prevButton.style.display = 'none';
  });

  // Origins button click handler
  originsButton.addEventListener('click', function () {
      // Change the button color to indicate selection
      originsButton.style.color = "#F58058"; // Change to your desired color
      timelineButton.style.color = "black"; // Reset the other button color

      // Show regions
      originsRegions.style.display = 'block';

      // Save selection in localStorage
      localStorage.setItem('navigationMode', 'origins');
  });

  // Region button click handler
document.querySelectorAll('.region-button').forEach(button => {
  button.addEventListener('click', function () {
      const region = this.getAttribute('data-region');

      // Remove 'selected-region' class from all buttons
      document.querySelectorAll('.region-button').forEach(btn => {
          btn.classList.remove('selected-region');
      });

      // Add 'selected-region' class to the clicked button
      this.classList.add('selected-region');

      // Filter and store items for the selected region
      selectedRegionItems = [];
      document.querySelectorAll('.map-item-button').forEach(itemButton => {
          if (itemButton.getAttribute('data-region') === region) {
              selectedRegionItems.push(itemButton.getAttribute('data-item'));
              itemButton.style.display = 'inline-block'; // Show the item
          } else {
              itemButton.style.display = 'none'; // Hide the item
          }
      });

      // Save the selected region to localStorage
      localStorage.setItem('selectedRegion', region);

      // Reset region index
      regionIndex = 0;

      // Show the first item in the selected region
      if (selectedRegionItems.length > 0) {
          updateContent(selectedRegionItems[regionIndex], loadComprehensionLevel());
      }

      // Update visibility of Next/Previous buttons based on region size
      updateNavButtons(selectedRegionItems.length);
    });
  });

  // Restore previous selection
  const savedMode = localStorage.getItem('navigationMode');
  if (savedMode === 'timeline') {
      timelineButton.click();
  } else if (savedMode === 'origins') {
      originsButton.click();
  }
});

function popup(room) {
  // Hide all popups
  document.querySelectorAll('.popup').forEach(p => p.classList.remove('active'));
  // Show the selected popup
  document.getElementById('popup-' + room).classList.add('active');
}

function closePopup(room) {
  document.getElementById('popup-' + room).classList.remove('active');
}