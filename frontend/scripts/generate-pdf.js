const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const locales = ['en', 'ru'];
    const baseUrl = 'http://localhost:3000'; // Make sure your dev server is running on port 3000
    const filenames = {
        'en': 'Khokhlov_Dmitry_Fullstack.pdf',
        'ru': 'Хохлов_Дмитрий_Fullstack.pdf'
    };

    console.log('Starting PDF generation...');

    for (const locale of locales) {
        const page = await browser.newPage();
        const url = `${baseUrl}/${locale}/resume-view`;
        const outputPath = path.join(__dirname, `../public/resume/${filenames[locale]}`);

        console.log(`Generating PDF for ${locale} from ${url}...`);

        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

            // Ensure "print-highlighter" classes enforce colors in print mode if needed
            // Usually, styles are preserved if we use printBackground: true

            await page.pdf({
                path: outputPath,
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '0mm', // Margins handled by CSS
                    right: '0mm',
                    bottom: '0mm',
                    left: '0mm'
                }
            });

            console.log(`Saved to ${outputPath}`);
        } catch (e) {
            console.error(`Failed to generate ${locale} PDF:`, e);
        } finally {
            await page.close();
        }
    }

    await browser.close();
    console.log('PDF generation complete.');
})();
