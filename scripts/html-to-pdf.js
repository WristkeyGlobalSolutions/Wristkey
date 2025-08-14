const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
	try {
		const inputPath = process.argv[2] || '/workspace/invoice.html';
		const outputPath = process.argv[3] || '/workspace/invoice-WGS-2025-001.pdf';
		if (!fs.existsSync(inputPath)) {
			console.error('Input HTML not found:', inputPath);
			process.exit(1);
		}
		const browser = await puppeteer.launch({
			headless: 'new',
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		});
		const page = await browser.newPage();
		const inputUrl = 'file://' + path.resolve(inputPath);
		await page.goto(inputUrl, { waitUntil: 'networkidle0' });
		await page.emulateMediaType('screen');
		await page.pdf({
			path: outputPath,
			format: 'Letter',
			printBackground: true,
			margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
			preferCSSPageSize: true
		});
		await browser.close();
		console.log('PDF saved to', outputPath);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
})();