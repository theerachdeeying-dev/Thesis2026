const fs = require('fs');
const cheerio = require('cheerio');

let html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html, { decodeEntities: false });

// 1. Refactor Introduction Section (มาสคอตประจำจังหวัด)
$('section').each((i, el) => {
    const $sec = $(el);
    const text = $sec.text();
    if (text.includes('มาสคอตประจำจังหวัด')) {
        // Change left box from rounded to solid square extending
        $sec.removeClass('gap-12').addClass('gap-0 md:gap-12 p-0 md:p-8');
        const $leftImgContainer = $sec.find('.bg-brand-yellow\\/20');
        if ($leftImgContainer.length) {
            $leftImgContainer.removeClass('bg-brand-yellow/20 p-8 rounded-3xl').addClass('bg-brand-yellow p-8 md:p-12 w-full h-full flex items-center justify-center');
            $leftImgContainer.find('img').removeClass('rounded-2xl').addClass('drop-shadow-2xl tilt-element');
        }
    }
});

// 2. Refactor all Mascot blocks
$('section#mascot').each((i, el) => {
    const $sec = $(el);
    
    // Change section wrapper to an edge-to-edge split grid
    $sec.removeClass('section-padding bg-brand-yellow gap-12 gap-8');
    // We already have md:grid-cols-3, remove it to replace with 2.
    $sec.removeClass('md:grid-cols-3').addClass('grid md:grid-cols-2 w-full p-0 m-0');

    // Make sure we get the columns correctly
    const $leftCol = $sec.find('> div').eq(0);
    const $rightCol = $sec.find('> div').eq(1);

    if ($leftCol.length && $rightCol.length) {
        // Setup left col
        $leftCol.removeClass('md:col-span-2 section-padding space-y-6 space-y-8');
        $leftCol.addClass('bg-brand-brown lg:bg-[#5c4033] section-padding flex flex-col justify-center w-full min-h-full space-y-8');
        
        // Fix text colors inside left col
        $leftCol.find('.text-brand-brown').removeClass('text-brand-brown').addClass('text-brand-yellow font-bold text-xl md:text-2xl mt-6');
        $leftCol.find('.text-gray-800').removeClass('text-gray-800').addClass('text-white/90 leading-relaxed text-base');
        $leftCol.find('h2').removeClass('text-5xl text-brand-brown mb-8').addClass('text-4xl md:text-5xl lg:text-6xl font-bold text-brand-yellow mb-8');

        // Setup right col
        $rightCol.removeClass('tilt-wrapper flex items-center justify-center'); // Wait, tilt-wrapper might be needed for anim
        // Let's wrap tilt-wrapper inside the col
        $rightCol.html(`<div class="tilt-wrapper w-full h-full flex flex-col items-center justify-center relative z-10">${$rightCol.html()}</div>`);
        $rightCol.addClass('bg-brand-yellow w-full h-full section-padding flex flex-col items-center justify-center relative overflow-hidden');
    }
});

// 3. Refactor Color Palettes
$('section').each((i, el) => {
    const $sec = $(el);
    if ($sec.find('h2').text().includes('สีของตัวละคร')) {
        const $leftImgContainer = $sec.find('.bg-brand-yellow');
        const $rightColorsContainer = $sec.find('.grid.grid-cols-3'); // The color swatches
        
        $sec.removeClass('section-padding bg-brand-gray/30 gap-12 items-center rounded-3xl').addClass('grid md:grid-cols-2 w-full gap-0 p-0 m-0');

        if ($leftImgContainer.length) {
            $leftImgContainer.removeClass('p-12 rounded-3xl').addClass('bg-brand-yellow w-full h-full p-12 md:p-24 flex flex-col items-center justify-center text-center');
            $leftImgContainer.css('border-radius', '0');
        }

        if ($rightColorsContainer.length) {
            // Right wrapper
            const currentWrapper = $rightColorsContainer.parent();
            currentWrapper.removeClass('w-full').addClass('bg-[#e5e7eb] w-full h-full p-12 md:p-24 flex flex-col justify-center items-center text-center');
        }
    }
});

fs.writeFileSync('index.html', $.html());
console.log('Refactor complete.');
