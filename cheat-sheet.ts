import fs from "fs";
import { KeyCode } from "./types";
import { LayerCommand } from "./utils";
import puppeteer from "puppeteer";

export async function generateCheatSheet(
  subLayers: { [key: string]: any },
  layerDescriptions: { [key: string]: string }
) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Layers Cheat Sheet</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 40px;
            background-color: #f5f5f7;
            color: #333;
        }
        h1 {
            text-align: center;
            margin-bottom: 40px;
            font-size: 36px;
            font-weight: 700;
        }
        .layer-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 24px;
        }
        .layer-card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: transform 0.2s;
            break-inside: avoid;
        }
        .layer-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .layer-key {
            background: #e0e0e0;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 14px;
            font-family: monospace;
        }
        .command-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .command-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        .command-item:last-child {
            border-bottom: none;
        }
        .command-key {
            font-weight: 600;
            color: #007aff;
            background: #eef5ff;
            padding: 2px 6px;
            border-radius: 4px;
            min-width: 24px;
            text-align: center;
        }
        .command-desc {
            text-align: right;
            font-size: 14px;
            color: #555;
        }
    </style>
</head>
<body>
    <h1>Layers Cheat Sheet</h1>
    <div class="layer-container">
        ${Object.entries(subLayers)
          .map(([key, commands]) => {
            const layerDesc = layerDescriptions[key] || `Layer ${key}`;

            if ('to' in commands) {
                return `
                <div class="layer-card">
                    <div class="layer-title">
                        <span>${layerDesc}</span>
                        <span class="layer-key">${key}</span>
                    </div>
                    <div class="command-list">
                        <div class="command-item">
                            <span class="command-desc">${(commands as LayerCommand).description || 'No description'}</span>
                        </div>
                    </div>
                </div>`;
            }

            const subLayerCommands = commands as { [key: string]: LayerCommand };

            return `
            <div class="layer-card">
                <div class="layer-title">
                    <span>${layerDesc}</span>
                    <span class="layer-key">${key}</span>
                </div>
                <ul class="command-list">
                    ${Object.entries(subLayerCommands)
                      .map(([cmdKey, cmd]) => `
                        <li class="command-item">
                            <span class="command-key">${cmdKey}</span>
                            <span class="command-desc">${cmd.description || 'No description'}</span>
                        </li>
                      `).join('')}
                </ul>
            </div>
            `;
          })
          .join('')}
    </div>
</body>
</html>
  `;

  fs.writeFileSync("layers-cheat-sheet.html", htmlContent);
  console.log("Generated layers-cheat-sheet.html");

  try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      await page.pdf({
        path: 'layers-cheat-sheet.pdf',
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
        }
      });
      await browser.close();
      console.log("Generated layers-cheat-sheet.pdf");
  } catch (error) {
      console.error("Error generating PDF:", error);
  }
}
