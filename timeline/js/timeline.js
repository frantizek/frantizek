document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.querySelector('.timeline');
    const yearsGrid = document.querySelector('.years-grid');
    const companies = document.querySelectorAll('.company');

    // Configuration
    const startYear = 2000;
    const endYear = 2027;
    const totalYears = endYear - startYear + 1;

    // Ensure grid matches config
    // (In a dynamic version, we could generate the grid here)

    // Function to calculate percentage position for a date (YYYY-MM)
    function getPositionPercentage(dateStr) {
        let date;
        if (dateStr.toLowerCase() === 'present') {
            date = new Date();
        } else {
            // Parse YYYY-MM
            const [year, month] = dateStr.split('-').map(Number);
            date = new Date(year, month - 1); // Month is 0-indexed
        }

        const year = date.getFullYear();
        const month = date.getMonth(); // 0-11

        // Calculate raw year value (e.g., 2010.5 for June 2010)
        const yearValue = year + (month / 12);

        // Calculate offset from start year
        const offset = yearValue - startYear;

        // Convert to percentage
        const percentage = (offset / totalYears) * 100;
        return percentage;
    }

    companies.forEach((company, index) => {
        const startStr = company.getAttribute('data-start');
        const endStr = company.getAttribute('data-end');

        const startPercent = getPositionPercentage(startStr);
        let endPercent;

        if (endStr.toLowerCase() === 'present') {
            // Limit 'present' to the end of the timeline or current date
            endPercent = getPositionPercentage(new Date().toISOString().slice(0, 7)); // 'YYYY-MM'
        } else {
            endPercent = getPositionPercentage(endStr);
        }

        // Calculate width
        let widthPercent = endPercent - startPercent;

        // Minimum width for visibility (e.g., 1 month)
        if (widthPercent < (1 / totalYears / 12) * 100) widthPercent = (1 / totalYears / 2) * 100; // minimal size
        if (widthPercent < 2) widthPercent = 2; // At least 2% width for visibility

        if (window.innerWidth <= 900) {
            // In vertical mode, let CSS handle layout
            company.removeAttribute('style');
            return;
        }

        // Apply styles
        company.style.left = `${startPercent}%`;
        company.style.width = `${widthPercent}%`;

        // Stagger vertical positions to avoid overlap
        // Simple logic: alternate up and down, or random within a range
        // center line is at 50%
        // We want to offset top. 
        // 0 -> -80px (above), 1 -> 80px (below), 2 -> -160, etc if strictly overlapping?
        // Let's just alternate for now: Even above, Odd below.

        const isEven = index % 2 === 0;
        const verticalOffset = isEven ? -60 : 60;

        // For visual variety, maybe randomize slightly or use a distinct pattern
        // Or if it's "Freelance" vs "Full time" (which we don't strictly have), we could separate rows.
        // Let's try 3 rows: Top, Middle, Bottom regarding the axis.

        const row = index % 3;
        let topPos = '50%';

        if (row === 0) topPos = '30%'; // Above
        if (row === 1) topPos = '70%'; // Below
        if (row === 2) topPos = '50%'; // On axis (might overlap axis line)

        // Better staggering:
        const verticalPositions = ['20%', '40%', '60%', '80%'];
        company.style.top = verticalPositions[index % verticalPositions.length];


        // Add specific class for styling based on employer if needed
        const employer = company.getAttribute('data-employer').toLowerCase().replace(/\s/g, '-');
        company.classList.add(`employer-${employer}`);
    });
});
