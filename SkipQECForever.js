// ==UserScript==
// @name         Random Radio Button, Select, Textarea Filler, and Submit
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Automatically selects a random radio button, dropdown option, or fills textareas with random words, excluding "Select" and similar options, and submits the form
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Function to generate random words for textareas
    const generateRandomText = () => {
        const words = [
            "Excellent", "Good", "Average", "Improvement",
            "Satisfactory", "Helpful", "Informative", "Supportive",
            "Engaging", "Knowledgeable"
        ];
        const wordCount = Math.floor(Math.random() * 5) + 5; // Random number of words between 5 and 10
        let text = [];
        for (let i = 0; i < wordCount; i++) {
            text.push(words[Math.floor(Math.random() * words.length)]);
        }
        return text.join(' ');
    };

    // Wait for the page to load completely
    window.addEventListener('load', () => {
        // Handle radio buttons
        const radioButtons = Array.from(document.querySelectorAll('input[type="radio"]'));

        // Group radio buttons by their 'name' attribute
        const radioGroups = {};
        radioButtons.forEach(button => {
            const label = document.querySelector(`label[for="${button.id}"]`)?.textContent?.trim();
            if (label && label.toLowerCase() === "select") return; // Skip "Select" option
            const groupName = button.name;
            if (!radioGroups[groupName]) {
                radioGroups[groupName] = [];
            }
            radioGroups[groupName].push(button);
        });

        // Randomly select a radio button from each group
        Object.values(radioGroups).forEach(group => {
            if (group.length > 0) {
                const randomIndex = Math.floor(Math.random() * group.length);
                const selectedButton = group[randomIndex];
                selectedButton.checked = true; // Select the button
                console.log(`Selected radio: ${selectedButton.id || selectedButton.value || 'Unnamed'}`);
            }
        });

        // Handle <select> dropdown menus
        const selectElements = Array.from(document.querySelectorAll('select'));
        selectElements.forEach(select => {
            const options = Array.from(select.options).filter(option => option.value && !option.text.toLowerCase().includes("select"));
            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);
                const selectedOption = options[randomIndex];
                select.value = selectedOption.value; // Select the option
                console.log(`Selected dropdown: ${selectedOption.text}`);
            }
        });

        // Handle <textarea> elements
        const textareas = Array.from(document.querySelectorAll('textarea'));
        textareas.forEach(textarea => {
            const randomText = generateRandomText();
            textarea.value = randomText; // Fill with random text
            console.log(`Filled textarea with: "${randomText}"`);
        });

        // Handle the "Save Proforma Proforma" button
        const saveButton = document.querySelector('#ctl00_ContentPlaceHolder2_btnSave');
        if (saveButton) {
            saveButton.click(); // Click the Save button
            console.log('Clicked "Save Proforma Proforma" button.');
        } else {
            console.log('"Save Proforma Proforma" button not found.');
        }

        // Submit the form if "Save Proforma Proforma" button wasn't found (fallback)
        const submitButton = document.querySelector('input[type="submit"][value="Submit Proforma"]');
        if (submitButton) {
            submitButton.click();
            console.log('Form submitted via the "Submit Proforma" button.');
        } else {
            console.log('Submit button not found.');
        }

        console.log('Random selection, filling, and submission completed.');
    });
})();
